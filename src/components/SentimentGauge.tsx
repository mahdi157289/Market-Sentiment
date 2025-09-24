import { memo } from 'react';
import { motion } from 'framer-motion';
import { SentimentData } from '@types';

interface SentimentGaugeProps {
  data: SentimentData;
  size?: 'sm' | 'md' | 'lg';
}

const GAUGE_ZONES = [
  { min: 0, max: 39, color: '#dc2626', label: 'Bearish', frenchLabel: 'Pessimisme' },
  { min: 40, max: 69, color: '#ca8a04', label: 'Neutral', frenchLabel: 'Avidité modérée' },
  { min: 70, max: 100, color: '#16a34a', label: 'Bullish', frenchLabel: 'Optimisme' }
];

const GAUGE_SIZE = 280;
const GAUGE_CENTER = GAUGE_SIZE / 2;
const GAUGE_RADIUS = 100;
const NEEDLE_LENGTH = 75;

function SentimentGaugeBase({ data, size = 'lg' }: SentimentGaugeProps) {
  const clamped = Math.max(0, Math.min(100, data.score));
  
  // Calculate needle rotation (-90° to +90°)
  const needleRotation = (clamped / 100) * 180 - 90;
  
  // Get current zone
  const currentZone = GAUGE_ZONES.find(zone => clamped >= zone.min && clamped <= zone.max) || GAUGE_ZONES[0];
  
  // Size variants with responsive design
  const sizeClasses: Record<'sm' | 'md' | 'lg', string> = {
    sm: 'w-32 h-32 sm:w-40 sm:h-40',
    md: 'w-40 h-40 sm:w-56 sm:h-56', 
    lg: 'w-48 h-48 sm:w-64 sm:h-64 lg:w-72 lg:h-72'
  };

  const textSizes: Record<'sm' | 'md' | 'lg', string> = {
    sm: 'text-lg sm:text-xl',
    md: 'text-2xl sm:text-3xl',
    lg: 'text-3xl sm:text-4xl lg:text-5xl'
  };

  // Create arc path for each zone
  const createArcPath = (startAngle: number, endAngle: number, radius: number) => {
    const start = polarToCartesian(GAUGE_CENTER, GAUGE_CENTER, radius, endAngle);
    const end = polarToCartesian(GAUGE_CENTER, GAUGE_CENTER, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
  };

  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  };

  // Get risk assessment
  const getRiskAssessment = (score: number): string => {
    if (score >= 70) return 'RISK-ON';
    if (score <= 39) return 'RISK-OFF';
    return 'NEUTRAL';
  };

  const riskAssessment = getRiskAssessment(clamped);

  return (
    <motion.div 
      className="glass p-4 sm:p-6 lg:p-8 rounded-2xl border border-white/10"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* SVG Gauge */}
      <div className={`${sizeClasses[size]} relative mx-auto`}>
        <svg
          width={GAUGE_SIZE}
          height={GAUGE_SIZE}
          viewBox={`0 0 ${GAUGE_SIZE} ${GAUGE_SIZE}`}
          className="absolute inset-0"
        >
          {/* Background arc */}
          <path
            d={createArcPath(0, 180, GAUGE_RADIUS)}
            fill="none"
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="16"
            strokeLinecap="round"
          />
          
          {/* Color zone arcs */}
          {GAUGE_ZONES.map((zone, index) => {
            const startAngle = (zone.min / 100) * 180;
            const endAngle = (zone.max / 100) * 180;
            return (
              <path
                key={zone.label}
                d={createArcPath(startAngle, endAngle, GAUGE_RADIUS)}
                fill="none"
                stroke={zone.color}
                strokeWidth="16"
                strokeLinecap="round"
                opacity="0.9"
              />
            );
          })}
          
          {/* Needle */}
          <motion.g
            initial={{ rotate: -90 }}
            animate={{ rotate: needleRotation }}
            transition={{ 
              type: "spring", 
              stiffness: 80, 
              damping: 20,
              duration: 1.2 
            }}
            style={{ transformOrigin: `${GAUGE_CENTER}px ${GAUGE_CENTER}px` }}
          >
            <line
              x1={GAUGE_CENTER}
              y1={GAUGE_CENTER}
              x2={GAUGE_CENTER}
              y2={GAUGE_CENTER - NEEDLE_LENGTH}
              stroke="white"
              strokeWidth="4"
              strokeLinecap="round"
              filter="drop-shadow(0 0 8px rgba(255,255,255,0.3))"
            />
            <circle
              cx={GAUGE_CENTER}
              cy={GAUGE_CENTER}
              r="6"
              fill="white"
              filter="drop-shadow(0 0 4px rgba(255,255,255,0.5))"
            />
          </motion.g>

          {/* Zone labels */}
          {GAUGE_ZONES.map((zone, index) => {
            const angle = ((zone.min + zone.max) / 2 / 100) * 180;
            const labelPos = polarToCartesian(GAUGE_CENTER, GAUGE_CENTER, GAUGE_RADIUS + 25, angle);
            return (
              <text
                key={`label-${zone.label}`}
                x={labelPos.x}
                y={labelPos.y}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-xs font-medium fill-white/60"
              >
                {zone.min}-{zone.max}
              </text>
            );
          })}
        </svg>
      </div>

      {/* Score Display - EXACT CLIENT FORMAT */}
      <div className="text-center mt-6">
        <motion.div
          key={clamped}
          initial={{ scale: 1.3, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className={`font-bold ${textSizes[size]} ${
            currentZone.color === '#dc2626' ? 'text-red-400' : 
            currentZone.color === '#ca8a04' ? 'text-yellow-400' : 'text-green-400'
          }`}
        >
          {clamped}/100
        </motion.div>
        
        <motion.div
          key={`${clamped}-label`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="text-sm sm:text-base lg:text-lg font-medium text-white/90 mt-2"
        >
          ({currentZone.frenchLabel})
        </motion.div>

        {/* Risk Assessment */}
        <motion.div
          key={`${clamped}-risk`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className={`mt-2 sm:mt-3 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold ${
            riskAssessment === 'RISK-ON' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
            riskAssessment === 'RISK-OFF' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
            'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
          }`}
        >
          {riskAssessment}
        </motion.div>

        {/* Description */}
        <motion.div
          key={`${clamped}-desc`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="text-xs sm:text-sm text-white/70 mt-3 sm:mt-4 max-w-sm sm:max-w-md mx-auto px-2"
        >
          {data.description}
        </motion.div>
      </div>
    </motion.div>
  );
}

export const SentimentGauge = memo(SentimentGaugeBase);
