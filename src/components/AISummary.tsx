import { memo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AISummary as AISummaryType } from '@types';

interface AISummaryProps {
  summary?: AISummaryType;
  autoUpdate?: boolean;
}

// Mock AI-generated market analysis
const generateAIAnalysis = (): AISummaryType => {
  const analyses = [
    {
      text: "Le sentiment global est actuellement neutre avec un biais baissier. Le VIX remonte (24.5), indiquant un stress grandissant, et le Put/Call ratio à 1.35 reflète une demande accrue de protection. Sur le plan macro, l'inflation reste élevée, ce qui pourrait pousser la Fed à rester hawkish. Prudence à court terme sur le Nasdaq.",
      timestamp: new Date()
    },
    {
      text: "Les marchés affichent une résilience remarquable malgré les tensions géopolitiques. Le Fear & Greed Index à 58 suggère une avidité modérée, tandis que la volatilité reste contenue. Les indicateurs macro montrent une économie robuste avec un chômage bas et une croissance soutenue. Biais haussier sur les valeurs technologiques.",
      timestamp: new Date()
    },
    {
      text: "La correction technique se poursuit avec une pression vendeuse sur les grandes capitalisations. Le VIX à 28.2 reflète une nervosité accrue des investisseurs. Les flux institutionnels montrent une rotation vers les valeurs défensives. Attention aux niveaux de support clés sur le SP500.",
      timestamp: new Date()
    },
    {
      text: "Le rebond des marchés s'accélère avec une reprise de l'appétit au risque. Les indicateurs de sentiment s'améliorent significativement, portés par des résultats d'entreprises solides. La Fed maintient une posture accommodante, soutenant les actifs risqués. Momentum haussier confirmé sur les indices majeurs.",
      timestamp: new Date()
    },
    {
      text: "Les marchés évoluent dans un range étroit avec une volatilité contenue. Les indicateurs techniques montrent une consolidation saine après la récente correction. Les flux de capitaux restent équilibrés entre actions et obligations. Patience recommandée en attendant un nouveau catalyseur directionnel.",
      timestamp: new Date()
    }
  ];

  const randomAnalysis = analyses[Math.floor(Math.random() * analyses.length)];
  return {
    text: randomAnalysis.text,
    timestamp: new Date()
  };
};

// Typing effect for natural text appearance
const useTypingEffect = (text: string, speed: number = 30) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!text) return;
    
    setIsTyping(true);
    setDisplayedText('');
    
    let index = 0;
    const timer = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1));
        index++;
      } else {
        setIsTyping(false);
        clearInterval(timer);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed]);

  return { displayedText, isTyping };
};

function AISummaryBase({ summary, autoUpdate = true }: AISummaryProps) {
  const [currentSummary, setCurrentSummary] = useState<AISummaryType>(
    summary || generateAIAnalysis()
  );
  const [isUpdating, setIsUpdating] = useState(false);

  const { displayedText, isTyping } = useTypingEffect(currentSummary.text, 25);

  // Auto-update simulation
  useEffect(() => {
    if (!autoUpdate) return;

    const interval = setInterval(() => {
      setIsUpdating(true);
      setTimeout(() => {
        setCurrentSummary(generateAIAnalysis());
        setIsUpdating(false);
      }, 1000);
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [autoUpdate]);

  const formatTimestamp = (timestamp: Date) => {
    return timestamp.toLocaleString('fr-FR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="glass p-4 sm:p-6 lg:p-8 rounded-xl border border-white/10 backdrop-blur-md"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="size-8 sm:size-9 lg:size-10 grid place-items-center rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30">
            <span className="text-sm sm:text-base lg:text-lg">🤖</span>
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-white">
              Analyse IA du Marché
            </h2>
            <div className="text-xs sm:text-sm text-white/60">
              Dernière mise à jour: {formatTimestamp(currentSummary.timestamp)}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {isUpdating && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="size-4 sm:size-5 border-2 border-blue-400 border-t-transparent rounded-full"
            />
          )}
          <div className={`text-xs px-2 py-1 rounded-full ${
            isTyping ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'
          }`}>
            {isTyping ? 'En cours...' : 'À jour'}
          </div>
        </div>
      </div>

      {/* Analysis Text */}
      <div className="relative">
        <motion.div
          className="text-sm sm:text-base leading-relaxed text-white/90 font-medium"
          style={{ minHeight: '100px' }}
        >
          {displayedText}
          {isTyping && (
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="inline-block w-0.5 h-4 sm:h-5 bg-blue-400 ml-1"
            />
          )}
        </motion.div>

        {/* Professional styling overlay */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="h-full w-full bg-gradient-to-r from-transparent via-transparent to-transparent" />
        </div>
      </div>

      {/* Key Insights */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-white/10"
      >
        <h3 className="text-xs sm:text-sm font-medium text-white/70 uppercase tracking-wider mb-3">
          Points Clés
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="flex items-center gap-2">
            <div className="size-2 bg-blue-400 rounded-full"></div>
            <span className="text-xs sm:text-sm text-white/80">Analyse technique intégrée</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="size-2 bg-green-400 rounded-full"></div>
            <span className="text-xs sm:text-sm text-white/80">Indicateurs macro-économiques</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="size-2 bg-yellow-400 rounded-full"></div>
            <span className="text-xs sm:text-sm text-white/80">Sentiment du marché</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="size-2 bg-purple-400 rounded-full"></div>
            <span className="text-xs sm:text-sm text-white/80">Perspective institutionnelle</span>
          </div>
        </div>
      </motion.div>

      {/* Footer with confidence level */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-white/10"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="text-xs text-white/60">
            Analyse générée par IA • Niveau de confiance: 87%
          </div>
          <div className="flex items-center gap-2">
            <div className="text-xs text-white/60">Mise à jour automatique</div>
            <div className={`size-2 rounded-full ${
              autoUpdate ? 'bg-green-400' : 'bg-gray-400'
            }`}></div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export const AISummary = memo(AISummaryBase);
