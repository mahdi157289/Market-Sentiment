import { memo } from 'react';
import { motion } from 'framer-motion';
import { SentimentGaugeProps, GaugeZone } from '@types';

const GAUGE_ZONES: GaugeZone[] = [
  { min: 0, max: 39, color: '#dc2626', label: 'Bearish' },
  { min: 40, max: 69, color: '#ca8a04', label: 'Neutral' },
  { min: 70, max: 100, color: '#16a34a', label: 'Bullish' }
];

const GAUGE_SIZE = 200;
const GAUGE_CENTER = GAUGE_SIZE / 2;
const GAUGE_RADIUS = 80;
const NEEDLE_LENGTH = 60;

function SentimentGaugeBase({ value, size = 'md', showLabel = true }: SentimentGaugeProps) {
  const clamped = Math.max(0, Math.min(100, value));
  
  // Calculate needle rotation (-90° to +90°)
  const needleRotation = (clamped / 100) * 180 - 90;
  
  // Get current zone
  const currentZone = (GAUGE_ZONES.find(zone => clamped >= zone.min && clamped <= zone.max) || GAUGE_ZONES[0])!;
  
  // Size variants
  const sizeClasses: Record<'sm' | 'md' | 'lg', string> = {
    sm: 'w-32 h-32',
    md: 'w-48 h-48', 
    lg: 'w-64 h-64'
  };

  const textSizes: Record<'sm' | 'md' | 'lg', string> = {
    sm: 'text-2xl',
    md: 'text-4xl',
    lg: 'text-6xl'
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

  return (
    <div className="flex flex-col items-center gap-4">
      {/* SVG Gauge */}
      <div className={`${sizeClasses[size]} relative`}>
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
            strokeWidth="12"
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
                strokeWidth="12"
                strokeLinecap="round"
                opacity="0.8"
              />
            );
          })}
          
          {/* Needle */}
          <motion.g
            initial={{ rotate: -90 }}
            animate={{ rotate: needleRotation }}
            transition={{ 
              type: "spring", 
              stiffness: 100, 
              damping: 15,
              duration: 0.8 
            }}
            style={{ transformOrigin: `${GAUGE_CENTER}px ${GAUGE_CENTER}px` }}
          >
            <line
              x1={GAUGE_CENTER}
              y1={GAUGE_CENTER}
              x2={GAUGE_CENTER}
              y2={GAUGE_CENTER - NEEDLE_LENGTH}
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <circle
              cx={GAUGE_CENTER}
              cy={GAUGE_CENTER}
              r="4"
              fill="white"
            />
          </motion.g>
        </svg>
      </div>

      {/* Value Display */}
      <div className="text-center">
        <motion.div
          key={clamped}
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className={`font-bold ${textSizes[size]} ${currentZone.color === '#dc2626' ? 'text-error' : currentZone.color === '#ca8a04' ? 'text-warning' : 'text-primary'}`}
        >
          {clamped}
        </motion.div>
        
        {showLabel && (
          <motion.div
            key={`${clamped}-label`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="text-sm text-white/70 mt-1"
          >
            {currentZone.label}
          </motion.div>
        )}
      </div>
    </div>
  );
}

export const SentimentGauge = memo(SentimentGaugeBase);


