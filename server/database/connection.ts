import dotenv from 'dotenv';
import { Pool, PoolConfig, Client } from 'pg';

dotenv.config();

// Determine if we should use SQLite as a fallback (not implemented here)
const USE_SQLITE = process.env.USE_SQLITE === 'true' || (!process.env.DB_HOST && !process.env.DATABASE_URL);
if (USE_SQLITE) {
  console.log('🔄 Using SQLite database (fallback mode)');
}

// Circuit breaker for database connections
class CircuitBreaker {
  private failures = 0;
  private lastFailureTime = 0;
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';

  constructor(
    private failureThreshold = 5,
    private recoveryTimeout = 30000,
    private monitoringInterval = 5000
  ) {
    // Monitor circuit state
    setInterval(() => this.monitor(), monitoringInterval);
  }

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailureTime > this.recoveryTimeout) {
        this.state = 'HALF_OPEN';
        console.log('🔄 Circuit breaker: Testing connection (HALF_OPEN)');
      } else {
        throw new Error('Circuit breaker is OPEN - database unavailable');
      }
    }

    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess() {
    this.failures = 0;
    this.state = 'CLOSED';
  }

  private onFailure() {
    this.failures++;
    this.lastFailureTime = Date.now();

    if (this.failures >= this.failureThreshold) {
      this.state = 'OPEN';
      console.error(`🚨 Circuit breaker: OPEN after ${this.failures} failures`);
    }
  }

  private monitor() {
    if (this.state === 'OPEN' && Date.now() - this.lastFailureTime > this.recoveryTimeout) {
      this.state = 'HALF_OPEN';
      console.log('🔄 Circuit breaker: Attempting recovery (HALF_OPEN)');
    }
  }

  getState() {
    return this.state;
  }
}

interface DatabaseConfig extends PoolConfig {
  database?: string;
  user?: string;
  password?: string;
  host?: string;
  port?: number;
  ssl?: boolean | object;
  max?: number;
  idleTimeoutMillis?: number;
  connectionTimeoutMillis?: number;
  connectionString?: string;
}

const isProd = process.env.NODE_ENV === 'production';

// Enhanced connection configuration with retry and pooling optimizations
const baseConfig: DatabaseConfig = {
  max: parseInt(process.env.DB_POOL_SIZE || '20'), // Connection pool size
  min: parseInt(process.env.DB_POOL_MIN || '2'), // Minimum connections
  idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT || '30000'), // 30 seconds
  connectionTimeoutMillis: parseInt(process.env.DB_CONNECTION_TIMEOUT || '10000'), // 10 seconds
  acquireTimeoutMillis: parseInt(process.env.DB_ACQUIRE_TIMEOUT || '60000'), // 60 seconds
  allowExitOnIdle: true,
  // Retry configuration
  retryDelay: parseInt(process.env.DB_RETRY_DELAY || '1000'), // 1 second
  maxRetries: parseInt(process.env.DB_MAX_RETRIES || '3'),
};

// Helper: strip SSL-related params from a connection string when SSL is disabled
function stripSslParamsFromUrl(input: string): string {
  try {
    const [base, query = ''] = input.split('?');
    if (!query) return input;
    const params = new URLSearchParams(query);
    // Remove common ssl flags used by various hosts
    params.delete('sslmode');
    params.delete('ssl');
    params.delete('sslcert');
    params.delete('sslkey');
    params.delete('sslrootcert');
    const cleaned = params.toString();
    return cleaned ? `${base}?${cleaned}` : base;
  } catch {
    return input;
  }
}

const rawUrl = process.env.DATABASE_URL;
const shouldUseSSL = process.env.DB_SSL === 'true';
const sanitizedUrl = rawUrl && !shouldUseSSL ? stripSslParamsFromUrl(rawUrl) : rawUrl || undefined;

const config: DatabaseConfig = sanitizedUrl
  ? {
      ...baseConfig,
      connectionString: sanitizedUrl,
      // Force-disable SSL at driver level when DB_SSL is false
      ssl: shouldUseSSL ? { rejectUnauthorized: false } : false,
    }
  : {
      ...baseConfig,
      database: process.env.DB_NAME || 'casanawal',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || '',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      ssl: shouldUseSSL ? { rejectUnauthorized: false } : false,
    };

// PG SSL mode env for compatibility with some environments
process.env.PGSSLMODE = shouldUseSSL ? 'require' : 'disable';

// Connection retry utility
async function retryConnection(operation: () => Promise<any>, maxRetries = 3, delay = 1000): Promise<any> {
  let lastError: Error;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      console.warn(`Database connection attempt ${attempt}/${maxRetries} failed:`, error.message);

      if (attempt < maxRetries) {
        console.log(`⏳ Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2; // Exponential backoff
      }
    }
  }

  throw lastError!;
}

class Database {
  private pool: Pool;
  private static instance: Database;
  private circuitBreaker: CircuitBreaker;
  private listeners: Map<string, (payload: any) => void> = new Map();
  private healthCheckInterval?: NodeJS.Timeout;
  private poolEnded = false;

  private constructor() {
    this.circuitBreaker = new CircuitBreaker();
    this.pool = new Pool(config);

    // Enhanced pool event handlers
    this.pool.on('error', (err, client) => {
      console.error('Unexpected error on idle client:', err.message);
      // Don't exit process, just log and continue
      console.error('Client details:', {
        totalCount: this.pool.totalCount,
        idleCount: this.pool.idleCount,
        waitingCount: this.pool.waitingCount
      });
    });

    this.pool.on('connect', (client) => {
      console.log('✅ Database client connected');
      // Set up LISTEN/NOTIFY for this client
      this.setupRealtimeListener(client);
    });

    this.pool.on('remove', (client) => {
      console.log('📤 Database client removed');
    });

    // Start health monitoring
    this.startHealthMonitoring();

    // Handle graceful shutdown
    process.on('SIGTERM', () => this.gracefulShutdown());
    process.on('SIGINT', () => this.gracefulShutdown());
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public getPool(): Pool {
    return this.pool;
  }

  // (removed duplicate basic testConnection implementation)

  public async query(text: string, params?: any[]): Promise<any> {
    // If circuit breaker is open, immediately throw error for fast failure
    if (this.circuitBreaker.getState() === 'OPEN') {
      throw new Error('Database connection is unavailable (circuit breaker open)');
    }

    return this.circuitBreaker.execute(async () => {
      return retryConnection(async () => {
        const client = await this.pool.connect();
        try {
          const startTime = Date.now();
          const result = await client.query(text, params);
          const duration = Date.now() - startTime;

          // Log slow queries
          if (duration > 1000) {
            console.warn(`🐌 Slow query (${duration}ms):`, text.substring(0, 100));
          }

          return result;
        } catch (error) {
          console.error('Database query error:', error);
          throw error;
        } finally {
          client.release();
        }
      });
    });
  }

  public async transaction<T>(callback: (client: any) => Promise<T>): Promise<T> {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  public async close(): Promise<void> {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
    }
    if (!this.poolEnded) {
      await this.pool.end();
      this.poolEnded = true;
    }
  }

  // Real-time LISTEN/NOTIFY methods
  private async setupRealtimeListener(client: any): Promise<void> {
    try {
      // Listen to important channels for real-time updates
      const channels = ['offers_changes', 'products_changes', 'orders_changes'];

      for (const channel of channels) {
        await client.query(`LISTEN ${channel}`);
        console.log(`👂 Listening to channel: ${channel}`);
      }

      // Handle notifications
      client.on('notification', (msg: any) => {
        console.log(`📡 Real-time notification on ${msg.channel}:`, msg.payload);
        this.handleRealtimeNotification(msg.channel, msg.payload);
      });
    } catch (error) {
      console.error('Failed to setup real-time listener:', error);
    }
  }

  private handleRealtimeNotification(channel: string, payload: string): void {
    const listener = this.listeners.get(channel);
    if (listener) {
      try {
        const data = JSON.parse(payload);
        listener(data);
      } catch (error) {
        console.error('Failed to parse notification payload:', error);
        listener(payload);
      }
    }
  }

  // Subscribe to real-time changes
  public on(channel: string, callback: (payload: any) => void): void {
    this.listeners.set(channel, callback);
  }

  // Unsubscribe from real-time changes
  public off(channel: string): void {
    this.listeners.delete(channel);
  }

  // Send real-time notification
  public async notify(channel: string, payload: any): Promise<void> {
    try {
      await this.query(`NOTIFY ${channel}, '${JSON.stringify(payload)}'`);
    } catch (error) {
      console.error('Failed to send notification:', error);
    }
  }

  // Health monitoring
  private startHealthMonitoring(): void {
    this.healthCheckInterval = setInterval(async () => {
      try {
        const isHealthy = await this.testConnection();
        if (!isHealthy) {
          console.warn('⚠️ Database health check failed');
        }
      } catch (error) {
        console.error('Health check error:', error);
      }
    }, 30000); // Check every 30 seconds
  }

  // Enhanced connection testing with retry
  public async testConnection(): Promise<boolean> {
    try {
      return await this.circuitBreaker.execute(async () => {
        return retryConnection(async () => {
          const client = await this.pool.connect();
          const result = await client.query('SELECT NOW(), pg_is_in_recovery() as is_replica');
          client.release();

          const isReplica = result.rows[0].is_replica;
          console.log(`✅ Database connection successful (${isReplica ? 'replica' : 'primary'}):`, result.rows[0].now);
          return true;
        });
      });
    } catch (error) {
      console.error('❌ Database connection failed:', error);
      return false;
    }
  }

  // Get connection pool stats
  public getPoolStats(): any {
    return {
      totalCount: this.pool.totalCount,
      idleCount: this.pool.idleCount,
      waitingCount: this.pool.waitingCount,
      circuitBreakerState: this.circuitBreaker.getState()
    };
  }

  // Graceful shutdown
  private async gracefulShutdown(): Promise<void> {
    console.log('🛑 Shutting down database connections gracefully...');

    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
    }

    try {
      if (!this.poolEnded) {
        await this.pool.end();
        this.poolEnded = true;
        console.log('✅ Database connections closed successfully');
      }
    } catch (error) {
      console.error('❌ Error during database shutdown:', error);
    }
  }
}

export const db = Database.getInstance();
export default Database;
