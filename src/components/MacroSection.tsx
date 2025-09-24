import { memo } from 'react';
import { motion } from 'framer-motion';
import { MacroIndicator } from '@types';

interface MacroSectionProps {
  indicators?: MacroIndicator[];
}

// Mock data for realistic macro indicators
const mockMacroIndicators: MacroIndicator[] = [
  {
    name: "PIB US",
    value: 2.1,
    previous: 1.8,
    trend: "up"
  },
  {
    name: "Inflation (CPI)",
    value: 3.1,
    previous: 3.2,
    trend: "down"
  },
  {
    name: "Chômage / NFP",
    value: 3.7,
    previous: 3.8,
    trend: "down"
  },
  {
    name: "Fed Funds Rate",
    value: 5.25,
    previous: 5.25,
    trend: "stable"
  }
];

// Get impact assessment for each indicator
const getImpactAssessment = (indicator: MacroIndicator): { 
  impact: 'risk-on' | 'risk-off' | 'neutral'; 
  description: string; 
  color: string;
} => {
  const { name, value, previous, trend } = indicator;
  
  switch (name) {
    case "PIB US":
      if (trend === "up" && value > 2.0) {
        return {
          impact: 'risk-on',
          description: 'Croissance solide → soutient les marchés',
          color: 'text-green-400'
        };
      } else if (trend === "down" || value < 1.5) {
        return {
          impact: 'risk-off',
          description: 'Croissance faible → pression sur les marchés',
          color: 'text-red-400'
        };
      }
      return {
        impact: 'neutral',
        description: 'Croissance modérée → neutre',
        color: 'text-yellow-400'
      };
      
    case "Inflation (CPI)":
      if (value > 3.5) {
        return {
          impact: 'risk-off',
          description: 'Inflation élevée → pression Fed',
          color: 'text-red-400'
        };
      } else if (value < 2.0) {
        return {
          impact: 'risk-on',
          description: 'Inflation contrôlée → Fed accommodante',
          color: 'text-green-400'
        };
      }
      return {
        impact: 'neutral',
        description: 'Inflation modérée → Fed prudente',
        color: 'text-yellow-400'
      };
      
    case "Chômage / NFP":
      if (value < 4.0) {
        return {
          impact: 'risk-on',
          description: 'Emploi fort → économie robuste',
          color: 'text-green-400'
        };
      } else if (value > 5.0) {
        return {
          impact: 'risk-off',
          description: 'Chômage élevé → faiblesse économique',
          color: 'text-red-400'
        };
      }
      return {
        impact: 'neutral',
        description: 'Emploi stable → neutre',
        color: 'text-yellow-400'
      };
      
    case "Fed Funds Rate":
      if (trend === "up") {
        return {
          impact: 'risk-off',
          description: 'Hausse des taux → resserrement monétaire',
          color: 'text-red-400'
        };
      } else if (trend === "down") {
        return {
          impact: 'risk-on',
          description: 'Baisse des taux → politique accommodante',
          color: 'text-green-400'
        };
      }
      return {
        impact: 'neutral',
        description: 'Taux stables → politique neutre',
        color: 'text-yellow-400'
      };
      
    default:
      return {
        impact: 'neutral',
        description: 'Impact neutre',
        color: 'text-yellow-400'
      };
  }
};

// Get trend arrow and color
const getTrendDisplay = (trend: 'up' | 'down' | 'stable') => {
  switch (trend) {
    case 'up':
      return { arrow: '↗️', color: 'text-green-400', bg: 'bg-green-500/20', border: 'border-green-500/30' };
    case 'down':
      return { arrow: '↘️', color: 'text-red-400', bg: 'bg-red-500/20', border: 'border-red-500/30' };
    case 'stable':
      return { arrow: '→', color: 'text-yellow-400', bg: 'bg-yellow-500/20', border: 'border-yellow-500/30' };
  }
};

// Format value based on indicator type
const formatValue = (name: string, value: number): string => {
  switch (name) {
    case "PIB US":
      return `${value.toFixed(1)}%`;
    case "Inflation (CPI)":
      return `${value.toFixed(1)}%`;
    case "Chômage / NFP":
      return `${value.toFixed(1)}%`;
    case "Fed Funds Rate":
      return `${value.toFixed(2)}%`;
    default:
      return value.toString();
  }
};

// Calculate change percentage
const getChangePercentage = (current: number, previous: number): number => {
  return ((current - previous) / previous) * 100;
};

function MacroCard({ indicator, index }: { indicator: MacroIndicator; index: number }) {
  const impact = getImpactAssessment(indicator);
  const trendDisplay = getTrendDisplay(indicator.trend);
  const changePercent = getChangePercentage(indicator.value, indicator.previous);
  const formattedValue = formatValue(indicator.name, indicator.value);
  const formattedPrevious = formatValue(indicator.name, indicator.previous);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.1,
        ease: "easeOut"
      }}
      whileHover={{ 
        y: -2, 
        scale: 1.01,
        transition: { duration: 0.2 }
      }}
      whileTap={{ 
        scale: 0.98,
        transition: { duration: 0.1 }
      }}
      className={`glass p-4 sm:p-5 lg:p-6 rounded-xl border ${trendDisplay.border} ${trendDisplay.bg} backdrop-blur-md touch-manipulation`}
    >
      {/* Header with trend indicator */}
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className={`size-8 sm:size-9 lg:size-10 grid place-items-center rounded-lg ${trendDisplay.bg} ${trendDisplay.border} border`}>
            <span className="text-sm sm:text-base lg:text-lg">{trendDisplay.arrow}</span>
          </div>
          <h3 className="text-xs sm:text-sm font-medium text-white/80 uppercase tracking-wider">
            {indicator.name}
          </h3>
        </div>
        <div className={`text-xs font-medium ${trendDisplay.color} px-2 py-1 rounded-full ${trendDisplay.bg}`}>
          {indicator.trend === 'up' ? 'HAUSSE' : indicator.trend === 'down' ? 'BAISSE' : 'STABLE'}
        </div>
      </div>

      {/* Current vs Previous */}
      <div className="space-y-2 sm:space-y-3">
        <div className="flex items-end justify-between">
          <div>
            <div className={`text-xl sm:text-2xl lg:text-3xl font-bold ${trendDisplay.color}`}>
              {formattedValue}
            </div>
            <div className="text-xs sm:text-sm text-white/60 mt-1">
              vs {formattedPrevious} (précédent)
            </div>
          </div>
        </div>
        
        {/* Change indicator */}
        {changePercent !== 0 && (
          <div className={`flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-medium ${trendDisplay.color}`}>
            <span className="text-sm sm:text-base lg:text-lg">{trendDisplay.arrow}</span>
            <span>{Math.abs(changePercent).toFixed(1)}%</span>
          </div>
        )}
        
        {changePercent === 0 && (
          <div className="text-xs sm:text-sm text-white/60">
            Aucun changement
          </div>
        )}
      </div>

      {/* Impact Assessment */}
      <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-white/10">
        <div className={`text-xs sm:text-sm font-medium ${impact.color} mb-1`}>
          Impact: {impact.impact.toUpperCase()}
        </div>
        <div className="text-xs text-white/70">
          {impact.description}
        </div>
      </div>
    </motion.div>
  );
}

function MacroSectionBase({ indicators = mockMacroIndicators }: MacroSectionProps) {
  return (
    <div className="space-y-6">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center"
      >
        <h2 className="text-xl font-semibold text-white mb-2">
          Contexte Macro
        </h2>
        <p className="text-sm text-white/60">
          Indicateurs économiques clés pour évaluer le soutien macro à la tendance
        </p>
      </motion.div>

      {/* Macro Indicators Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {indicators.map((indicator, index) => (
          <MacroCard 
            key={indicator.name} 
            indicator={indicator} 
            index={index}
          />
        ))}
      </div>

      {/* Summary Assessment */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="glass p-6 rounded-xl border border-white/10"
      >
        <h3 className="text-lg font-semibold text-white mb-4">
          Évaluation Macro Globale
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400 mb-1">
              {indicators.filter(ind => getImpactAssessment(ind).impact === 'risk-on').length}
            </div>
            <div className="text-sm text-white/70">Soutien Risk-On</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-400 mb-1">
              {indicators.filter(ind => getImpactAssessment(ind).impact === 'risk-off').length}
            </div>
            <div className="text-sm text-white/70">Pression Risk-Off</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400 mb-1">
              {indicators.filter(ind => getImpactAssessment(ind).impact === 'neutral').length}
            </div>
            <div className="text-sm text-white/70">Neutre</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export const MacroSection = memo(MacroSectionBase);
