// Scalability Configuration - Optimized
export interface ScalabilityConfig {
  multiRestaurant: { enabled: boolean; defaultRestaurantId: string; allowCrossRestaurantOrders: boolean; sharedCustomerBase: boolean; };
  microservices: { enabled: boolean; services: { auth: { enabled: boolean; url?: string }; orders: { enabled: boolean; url?: string }; payments: { enabled: boolean; url?: string }; notifications: { enabled: boolean; url?: string }; analytics: { enabled: boolean; url?: string }; }; };
  database: { readReplicas: string[]; writeDatabase: string; enableSharding: boolean; shardingStrategy: 'customer' | 'restaurant' | 'geographic'; };
  caching: { strategy: 'memory' | 'redis' | 'hybrid'; redis: { host: string; port: number; password?: string; cluster: boolean; }; ttl: { products: number; categories: number; settings: number; analytics: number; }; };
  api: { currentVersion: string; supportedVersions: string[]; deprecationWarnings: boolean; };
  features: { mobileApp: boolean; multiLanguage: boolean; multiCurrency: boolean; advancedAnalytics: boolean; aiRecommendations: boolean; realTimeTracking: boolean; loyaltyProgram: boolean; subscriptions: boolean; };
  integrations: { payment: { stripe: boolean; paypal: boolean; localGateways: string[]; }; delivery: { ownFleet: boolean; thirdPartyServices: string[]; }; marketing: { emailProvider: string; smsProvider: string; pushNotifications: boolean; }; };
}

// Default configuration
export const defaultScalabilityConfig: ScalabilityConfig = {
  multiRestaurant: { enabled: false, defaultRestaurantId: 'casanawal-main', allowCrossRestaurantOrders: false, sharedCustomerBase: true },
  microservices: { enabled: false, services: { auth: { enabled: false }, orders: { enabled: false }, payments: { enabled: false }, notifications: { enabled: false }, analytics: { enabled: false } } },
  database: { readReplicas: [], writeDatabase: process.env.DATABASE_URL || '', enableSharding: false, shardingStrategy: 'customer' },
  caching: { strategy: 'memory', redis: { host: process.env.REDIS_HOST || 'localhost', port: parseInt(process.env.REDIS_PORT || '6379'), password: process.env.REDIS_PASSWORD, cluster: false }, ttl: { products: 300, categories: 1800, settings: 3600, analytics: 60 } },
  api: { currentVersion: 'v1', supportedVersions: ['v1'], deprecationWarnings: true },
  features: { mobileApp: false, multiLanguage: true, multiCurrency: false, advancedAnalytics: false, aiRecommendations: false, realTimeTracking: false, loyaltyProgram: false, subscriptions: false },
  integrations: { payment: { stripe: false, paypal: false, localGateways: ['cmi', 'maroc_telecommerce'] }, delivery: { ownFleet: true, thirdPartyServices: [] }, marketing: { emailProvider: 'smtp', smsProvider: 'local', pushNotifications: false } }
};

// Scalability Manager
class ScalabilityManager {
  private config: ScalabilityConfig;
  private initialized = false;

  constructor() { this.config = { ...defaultScalabilityConfig }; }

  async initialize(): Promise<void> {
    try {
      await this.loadConfigFromDatabase();
      this.validateConfig();
      await this.initializeServices();
      this.initialized = true;
      console.log('✅ Scalability manager initialized');
    } catch (error) {
      console.error('❌ Failed to initialize scalability manager:', error);
      throw error;
    }
  }

  private async loadConfigFromDatabase(): Promise<void> { try { const { db } = await import('../database/connection'); const result = await db.query('SELECT setting_value FROM system_settings WHERE setting_key = $1', ['scalability_config']); if (result.rows.length > 0) this.config = { ...this.config, ...result.rows[0].setting_value }; } catch (error) { console.warn('Using default scalability config:', error); } }
  private validateConfig(): void { if (!this.config.database.writeDatabase) throw new Error('Write database URL is required'); if (this.config.caching.strategy === 'redis' && !this.config.caching.redis.host) throw new Error('Redis host is required for Redis caching'); if (this.config.microservices.enabled) { Object.entries(this.config.microservices.services).forEach(([service, config]) => { if (config.enabled && !config.url) throw new Error(`URL is required for enabled microservice: ${service}`); }); } }
  private async initializeServices(): Promise<void> { if (this.config.caching.strategy === 'redis') await this.initializeRedis(); if (this.config.microservices.enabled) await this.initializeMicroservices(); console.log('Services initialized according to scalability config'); }
  private async initializeRedis(): Promise<void> { try { const Redis = require('ioredis'); const redis = new Redis({ host: this.config.caching.redis.host, port: this.config.caching.redis.port, password: this.config.caching.redis.password }); await redis.ping(); console.log('✅ Redis connection established'); } catch (error) { console.error('❌ Redis initialization failed:', error); this.config.caching.strategy = 'memory'; } }
  private async initializeMicroservices(): Promise<void> { const enabledServices = Object.entries(this.config.microservices.services).filter(([_, config]) => config.enabled); for (const [serviceName, serviceConfig] of enabledServices) { try { const response = await fetch(`${serviceConfig.url}/health`); if (!response.ok) throw new Error(`Health check failed for ${serviceName}`); console.log(`✅ Microservice ${serviceName} is healthy`); } catch (error) { console.error(`❌ Microservice ${serviceName} health check failed:`, error); throw error; } } }

  getConfig(): ScalabilityConfig { return this.config; }
  isInitialized(): boolean { return this.initialized; }

  async updateConfig(updates: Partial<ScalabilityConfig>): Promise<void> { this.config = { ...this.config, ...updates }; this.validateConfig(); try { const { db } = await import('../database/connection'); await db.query('INSERT INTO system_settings (setting_key, setting_value) VALUES ($1, $2) ON CONFLICT (setting_key) DO UPDATE SET setting_value = $2, updated_at = CURRENT_TIMESTAMP', ['scalability_config', JSON.stringify(this.config)]); console.log('✅ Scalability config updated'); } catch (error) { console.error('❌ Failed to save scalability config:', error); } }

  // Feature flag helpers
  isFeatureEnabled(feature: keyof ScalabilityConfig['features']): boolean { return this.config.features[feature]; }
  isMultiRestaurantEnabled(): boolean { return this.config.multiRestaurant.enabled; }
  isMicroservicesEnabled(): boolean { return this.config.microservices.enabled; }
  getCachingStrategy(): string { return this.config.caching.strategy; }
  getCacheTTL(type: keyof ScalabilityConfig['caching']['ttl']): number { return this.config.caching.ttl[type]; }

  // Database helpers
  getWriteDatabase(): string { return this.config.database.writeDatabase; }
  getReadReplicas(): string[] { return this.config.database.readReplicas; }
  isShardingEnabled(): boolean { return this.config.database.enableSharding; }

  // API helpers
  getCurrentAPIVersion(): string { return this.config.api.currentVersion; }
  getSupportedAPIVersions(): string[] { return this.config.api.supportedVersions; }
  isAPIVersionSupported(version: string): boolean { return this.config.api.supportedVersions.includes(version); }

  // Integration helpers
  getEnabledPaymentGateways(): string[] {
    const gateways = [];
    if (this.config.integrations.payment.stripe) gateways.push('stripe');
    if (this.config.integrations.payment.paypal) gateways.push('paypal');
    gateways.push(...this.config.integrations.payment.localGateways);
    return gateways;
  }

  getDeliveryServices(): string[] {
    const services = [];
    if (this.config.integrations.delivery.ownFleet) services.push('own_fleet');
    services.push(...this.config.integrations.delivery.thirdPartyServices);
    return services;
  }

  // Performance monitoring
  getPerformanceMetrics() {
    return {
      config: { multiRestaurant: this.config.multiRestaurant.enabled, microservices: this.config.microservices.enabled, caching: this.config.caching.strategy, sharding: this.config.database.enableSharding },
      features: Object.entries(this.config.features).filter(([_, enabled]) => enabled).map(([name]) => name),
      integrations: { payments: this.getEnabledPaymentGateways().length, delivery: this.getDeliveryServices().length }
    };
  }
}

// Singleton instance
export const scalabilityManager = new ScalabilityManager();

// Environment-based configuration loader
export const loadScalabilityConfig = async (): Promise<ScalabilityConfig> => {
  if (!scalabilityManager.isInitialized()) await scalabilityManager.initialize();
  return scalabilityManager.getConfig();
};

// Helper functions
export const isFeatureEnabled = (feature: keyof ScalabilityConfig['features']): boolean => scalabilityManager.isFeatureEnabled(feature);
export const getCacheTTL = (type: keyof ScalabilityConfig['caching']['ttl']): number => scalabilityManager.getCacheTTL(type);
export const isMultiRestaurantMode = (): boolean => scalabilityManager.isMultiRestaurantEnabled();
export const getCurrentAPIVersion = (): string => scalabilityManager.getCurrentAPIVersion();

// Configuration validation
export const validateScalabilityConfig = (config: Partial<ScalabilityConfig>): string[] => {
  const errors: string[] = [];
  if (config.database?.writeDatabase === '') errors.push('Write database URL cannot be empty');
  if (config.caching?.strategy === 'redis' && !config.caching?.redis?.host) errors.push('Redis host is required for Redis caching');
  if (config.microservices?.enabled) {
    Object.entries(config.microservices.services || {}).forEach(([service, serviceConfig]) => {
      if (serviceConfig?.enabled && !serviceConfig?.url) errors.push(`URL is required for enabled microservice: ${service}`);
    });
  }
  return errors;
};

// Export for external use
export { ScalabilityManager };
export default scalabilityManager;