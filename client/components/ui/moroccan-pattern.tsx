import { cn } from "@/lib/utils";

interface MoroccanPatternProps {
  variant?: 'subtle' | 'medium' | 'bold';
  pattern?: 'zellige' | 'geometric' | 'mixed';
  className?: string;
  animated?: boolean;
  corners?: boolean;
}

export const MoroccanPattern = ({ 
  variant = 'subtle',
  pattern = 'mixed',
  className,
  animated = false,
  corners = true
}: MoroccanPatternProps) => {
  const getOpacity = () => {
    switch (variant) {
      case 'bold': return 'opacity-[0.12]';
      case 'medium': return 'opacity-[0.06]';
      default: return 'opacity-[0.03]';
    }
  };

  const getPatternId = (type: string) => `${pattern}-${type}-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={cn("absolute inset-0", className)} aria-hidden="true">
      {/* Primary geometric pattern */}
      <div className={cn(
        "absolute inset-0",
        getOpacity(),
        animated && "moroccan-pattern-animate"
      )}>
        <svg className="w-full h-full" viewBox="0 0 120 120" fill="none">
          <defs>
            {/* Traditional Moroccan 8-pointed star (khatam) */}
            <pattern id={getPatternId('primary')} x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              <g fill="currentColor" className="text-terracotta">
                <path d="M30 15 L45 22.5 L30 30 L15 22.5 Z" />
                <path d="M45 22.5 L52.5 37.5 L45 45 L37.5 37.5 Z" />
                <path d="M30 45 L22.5 37.5 L15 45 L22.5 52.5 Z" />
                <path d="M15 22.5 L7.5 37.5 L15 45 L22.5 37.5 Z" />
                <path d="M37.5 7.5 L45 22.5 L37.5 37.5 L30 22.5 Z" />
                <path d="M52.5 37.5 L60 30 L52.5 22.5 L45 30 Z" />
                <path d="M22.5 52.5 L30 60 L37.5 52.5 L30 45 Z" />
                <path d="M7.5 22.5 L0 30 L7.5 37.5 L15 30 Z" />
              </g>
            </pattern>
            
            {/* Interlacing pattern inspired by Fez mosaics */}
            <pattern id={getPatternId('secondary')} x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <g fill="currentColor" className="text-safran">
                <circle cx="20" cy="20" r="2" />
                <path d="M20 10 L30 20 L20 30 L10 20 Z" fill="none" stroke="currentColor" strokeWidth="0.5" />
                <path d="M10 0 L30 0 M0 10 L40 10 M10 40 L30 40 M40 30 L0 30" 
                      stroke="currentColor" strokeWidth="0.3" />
              </g>
            </pattern>
            
            {/* Hexagonal honeycomb pattern from Alhambra */}
            <pattern id={getPatternId('accent')} x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
              <g fill="none" stroke="currentColor" strokeWidth="0.4" className="text-zellige">
                <path d="M40 5 L60 15 L60 35 L40 45 L20 35 L20 15 Z" />
                <path d="M40 45 L60 55 L60 75 L40 85 L20 75 L20 55 Z" />
                <path d="M0 25 L20 15 L20 35 L0 45 L-20 35 L-20 15 Z" />
                <path d="M80 25 L100 15 L100 35 L80 45 L60 35 L60 15 Z" />
              </g>
            </pattern>

            {/* Calligraphy-inspired flowing pattern */}
            <pattern id={getPatternId('flow')} x="0" y="0" width="100" height="50" patternUnits="userSpaceOnUse">
              <g fill="none" stroke="currentColor" strokeWidth="0.3" className="text-nuit-400">
                <path d="M0 25 Q25 5 50 25 T100 25" />
                <path d="M0 25 Q25 45 50 25 T100 25" />
                <circle cx="25" cy="25" r="1" fill="currentColor" />
                <circle cx="75" cy="25" r="1" fill="currentColor" />
              </g>
            </pattern>
          </defs>
          
          <rect width="100%" height="100%" fill={`url(#${getPatternId('primary')})`} />
          {pattern === 'mixed' && (
            <>
              <rect width="100%" height="100%" fill={`url(#${getPatternId('secondary')})`} />
              <rect width="100%" height="100%" fill={`url(#${getPatternId('accent')})`} />
              <rect width="100%" height="100%" fill={`url(#${getPatternId('flow')})`} />
            </>
          )}
        </svg>
      </div>
      
      {/* Radial gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-sable-100/20" />
      
      {/* Corner decorative elements */}
      {corners && (
        <>
          <div className="absolute top-4 left-4 w-8 h-8 opacity-10 transition-all duration-1000 hover:opacity-20">
            <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
              <path d="M16 0 L24 8 L16 16 L8 8 Z" fill="currentColor" className="text-terracotta" />
              <path d="M0 16 L8 24 L16 16 L8 8 Z" fill="currentColor" className="text-safran" />
              <circle cx="16" cy="16" r="2" fill="currentColor" className="text-zellige" />
            </svg>
          </div>
          
          <div className="absolute top-4 right-4 w-8 h-8 opacity-10 transition-all duration-1000 hover:opacity-20 transform rotate-90">
            <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
              <path d="M16 0 L24 8 L16 16 L8 8 Z" fill="currentColor" className="text-zellige" />
              <path d="M0 16 L8 24 L16 16 L8 8 Z" fill="currentColor" className="text-terracotta" />
              <circle cx="16" cy="16" r="2" fill="currentColor" className="text-safran" />
            </svg>
          </div>
          
          <div className="absolute bottom-4 left-4 w-8 h-8 opacity-10 transition-all duration-1000 hover:opacity-20 transform rotate-180">
            <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
              <path d="M16 0 L24 8 L16 16 L8 8 Z" fill="currentColor" className="text-safran" />
              <path d="M0 16 L8 24 L16 16 L8 8 Z" fill="currentColor" className="text-zellige" />
              <circle cx="16" cy="16" r="2" fill="currentColor" className="text-terracotta" />
            </svg>
          </div>
          
          <div className="absolute bottom-4 right-4 w-8 h-8 opacity-10 transition-all duration-1000 hover:opacity-20 transform rotate-270">
            <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
              <path d="M16 0 L24 8 L16 16 L8 8 Z" fill="currentColor" className="text-terracotta" />
              <path d="M0 16 L8 24 L16 16 L8 8 Z" fill="currentColor" className="text-safran" />
              <circle cx="16" cy="16" r="2" fill="currentColor" className="text-zellige" />
            </svg>
          </div>
        </>
      )}
      
      {/* Subtle border accent with gradient */}
      <div className="absolute inset-0 rounded-3xl border border-transparent" 
           style={{
             background: 'linear-gradient(white, white) padding-box, linear-gradient(45deg, rgba(198, 95, 61, 0.1), rgba(230, 162, 0, 0.1), rgba(15, 126, 126, 0.1)) border-box'
           }} />
    </div>
  );
};
