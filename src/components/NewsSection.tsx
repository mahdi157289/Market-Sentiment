import { memo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NewsItem } from '@types';

interface NewsSectionProps {
  newsItems?: NewsItem[];
}

// Mock data for realistic news and social sentiment
const mockNewsItems: NewsItem[] = [
  {
    source: "Bloomberg",
    headline: "Fed Signals Potential Rate Cut as Inflation Cools",
    sentiment: "positive",
    buzz: 85
  },
  {
    source: "Reuters",
    headline: "Tech Stocks Rally on Strong Earnings Reports",
    sentiment: "positive",
    buzz: 72
  },
  {
    source: "CNBC",
    headline: "Market Volatility Rises Amid Geopolitical Tensions",
    sentiment: "negative",
    buzz: 68
  },
  {
    source: "Financial Times",
    headline: "Central Banks Coordinate Policy Response",
    sentiment: "neutral",
    buzz: 45
  },
  {
    source: "Wall Street Journal",
    headline: "Corporate Earnings Beat Expectations Across Sectors",
    sentiment: "positive",
    buzz: 78
  },
  {
    source: "MarketWatch",
    headline: "Oil Prices Surge on Supply Concerns",
    sentiment: "negative",
    buzz: 62
  }
];

// Mock Twitter/StockTwits sentiment data
const mockSocialSentiment = [
  {
    platform: "Twitter",
    username: "@TraderMike",
    message: "SPY breaking resistance at 450! This rally has legs 🚀 #SPY #BullMarket",
    sentiment: "positive",
    buzz: 92,
    timestamp: "2m ago"
  },
  {
    platform: "StockTwits",
    username: "@BearMarket",
    message: "VIX spiking again. This volatility is unsustainable. Market crash incoming 📉",
    sentiment: "negative",
    buzz: 78,
    timestamp: "5m ago"
  },
  {
    platform: "Twitter",
    username: "@OptionsTrader",
    message: "Put/Call ratio looking bullish. Smart money positioning for upside 📈",
    sentiment: "positive",
    buzz: 65,
    timestamp: "8m ago"
  },
  {
    platform: "StockTwits",
    username: "@MarketGuru",
    message: "Fed dovish comments supporting risk assets. QQQ to 400? 🤔",
    sentiment: "neutral",
    buzz: 58,
    timestamp: "12m ago"
  },
  {
    platform: "Twitter",
    username: "@CryptoTrader",
    message: "Bitcoin correlation with stocks breaking down. Alt season incoming? 🪙",
    sentiment: "positive",
    buzz: 71,
    timestamp: "15m ago"
  }
];

// Get sentiment color and styling
const getSentimentStyle = (sentiment: 'positive' | 'negative' | 'neutral') => {
  switch (sentiment) {
    case 'positive':
      return {
        color: 'text-green-400',
        bg: 'bg-green-500/20',
        border: 'border-green-500/30',
        icon: '📈',
        label: 'POSITIF'
      };
    case 'negative':
      return {
        color: 'text-red-400',
        bg: 'bg-red-500/20',
        border: 'border-red-500/30',
        icon: '📉',
        label: 'NÉGATIF'
      };
    case 'neutral':
      return {
        color: 'text-yellow-400',
        bg: 'bg-yellow-500/20',
        border: 'border-yellow-500/30',
        icon: '➡️',
        label: 'NEUTRE'
      };
  }
};

// Get buzz level styling
const getBuzzStyle = (buzz: number) => {
  if (buzz >= 80) return { color: 'text-red-400', bg: 'bg-red-500/20', label: 'ÉLEVÉ' };
  if (buzz >= 60) return { color: 'text-yellow-400', bg: 'bg-yellow-500/20', label: 'MODÉRÉ' };
  return { color: 'text-green-400', bg: 'bg-green-500/20', label: 'FAIBLE' };
};

// Get market impact assessment
const getMarketImpact = (sentiment: 'positive' | 'negative' | 'neutral', buzz: number) => {
  const impactScore = sentiment === 'positive' ? 1 : sentiment === 'negative' ? -1 : 0;
  const buzzMultiplier = buzz / 100;
  const totalImpact = impactScore * buzzMultiplier;
  
  if (totalImpact > 0.5) return { impact: 'BULLISH', color: 'text-green-400', description: 'Soutient la hausse' };
  if (totalImpact < -0.5) return { impact: 'BEARISH', color: 'text-red-400', description: 'Pression à la baisse' };
  return { impact: 'NEUTRAL', color: 'text-yellow-400', description: 'Impact neutre' };
};

function NewsCard({ newsItem, index }: { newsItem: NewsItem; index: number }) {
  const sentimentStyle = getSentimentStyle(newsItem.sentiment);
  const buzzStyle = getBuzzStyle(newsItem.buzz);
  const marketImpact = getMarketImpact(newsItem.sentiment, newsItem.buzz);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ 
        duration: 0.4, 
        delay: index * 0.1,
        ease: "easeOut"
      }}
      whileHover={{ 
        y: -2, 
        scale: 1.01,
        transition: { duration: 0.2 }
      }}
      className={`glass p-4 sm:p-5 rounded-xl border ${sentimentStyle.border} backdrop-blur-md touch-manipulation`}
    >
      {/* Header with source and sentiment */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className={`size-6 sm:size-7 lg:size-8 grid place-items-center rounded-lg ${sentimentStyle.bg} ${sentimentStyle.border} border`}>
            <span className="text-xs sm:text-sm">{sentimentStyle.icon}</span>
          </div>
          <div>
            <div className="text-xs sm:text-sm font-medium text-white/80">{newsItem.source}</div>
            <div className={`text-xs ${sentimentStyle.color} font-medium`}>
              {sentimentStyle.label}
            </div>
          </div>
        </div>
        <div className={`text-xs font-medium ${buzzStyle.color} px-2 py-1 rounded-full ${buzzStyle.bg}`}>
          {buzzStyle.label}
        </div>
      </div>

      {/* Headline */}
      <div className="mb-3 sm:mb-4">
        <h3 className="text-sm sm:text-base font-medium text-white leading-relaxed">
          {newsItem.headline}
        </h3>
      </div>

      {/* Market Impact */}
      <div className="flex items-center justify-between pt-2 sm:pt-3 border-t border-white/10">
        <div className={`text-xs sm:text-sm font-medium ${marketImpact.color}`}>
          Impact: {marketImpact.impact}
        </div>
        <div className="text-xs text-white/60">
          {marketImpact.description}
        </div>
      </div>
    </motion.div>
  );
}

function SocialSentimentCard({ socialItem, index }: { socialItem: any; index: number }) {
  const sentimentStyle = getSentimentStyle(socialItem.sentiment);
  const buzzStyle = getBuzzStyle(socialItem.buzz);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ 
        duration: 0.4, 
        delay: index * 0.1,
        ease: "easeOut"
      }}
      whileHover={{ 
        y: -2, 
        scale: 1.01,
        transition: { duration: 0.2 }
      }}
      className={`glass p-3 sm:p-4 rounded-xl border ${sentimentStyle.border} backdrop-blur-md touch-manipulation`}
    >
      {/* Header with platform and user */}
      <div className="flex items-center justify-between mb-2 sm:mb-3">
        <div className="flex items-center gap-2">
          <div className={`size-5 sm:size-6 grid place-items-center rounded ${sentimentStyle.bg}`}>
            <span className="text-xs">{sentimentStyle.icon}</span>
          </div>
          <div>
            <div className="text-xs sm:text-sm font-medium text-white/80">{socialItem.username}</div>
            <div className="text-xs text-white/60">{socialItem.platform}</div>
          </div>
        </div>
        <div className="text-xs text-white/60">{socialItem.timestamp}</div>
      </div>

      {/* Message */}
      <div className="mb-2 sm:mb-3">
        <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
          {socialItem.message}
        </p>
      </div>

      {/* Buzz indicator */}
      <div className="flex items-center justify-between pt-2 border-t border-white/10">
        <div className={`text-xs font-medium ${buzzStyle.color} px-2 py-1 rounded-full ${buzzStyle.bg}`}>
          Buzz: {buzzStyle.label}
        </div>
        <div className="text-xs text-white/60">
          {socialItem.buzz}% engagement
        </div>
      </div>
    </motion.div>
  );
}

function NewsSectionBase({ newsItems = mockNewsItems }: NewsSectionProps) {
  const [activeTab, setActiveTab] = useState<'news' | 'social'>('news');

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
          Narratif du Marché
        </h2>
        <p className="text-sm text-white/60">
          Sentiment social et actualités pour comprendre le contexte du marché
        </p>
      </motion.div>

      {/* Tab Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="flex justify-center"
      >
        <div className="glass p-1 rounded-xl border border-white/10">
          <button
            onClick={() => setActiveTab('news')}
            className={`px-3 sm:px-6 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all touch-manipulation ${
              activeTab === 'news'
                ? 'bg-primary/20 text-primary border border-primary/30'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            📰 Actualités
          </button>
          <button
            onClick={() => setActiveTab('social')}
            className={`px-3 sm:px-6 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all touch-manipulation ${
              activeTab === 'social'
                ? 'bg-primary/20 text-primary border border-primary/30'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            🐦 Social Sentiment
          </button>
        </div>
      </motion.div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'news' ? (
          <motion.div
            key="news"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
          >
            {newsItems.map((newsItem, index) => (
              <NewsCard key={`${newsItem.source}-${index}`} newsItem={newsItem} index={index} />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="social"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {mockSocialSentiment.map((socialItem, index) => (
              <SocialSentimentCard key={`${socialItem.username}-${index}`} socialItem={socialItem} index={index} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Summary Stats */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="glass p-6 rounded-xl border border-white/10"
      >
        <h3 className="text-lg font-semibold text-white mb-4">
          Résumé du Sentiment
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400 mb-1">
              {newsItems.filter(item => item.sentiment === 'positive').length}
            </div>
            <div className="text-sm text-white/70">Actualités Positives</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-400 mb-1">
              {newsItems.filter(item => item.sentiment === 'negative').length}
            </div>
            <div className="text-sm text-white/70">Actualités Négatives</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400 mb-1">
              {newsItems.filter(item => item.sentiment === 'neutral').length}
            </div>
            <div className="text-sm text-white/70">Actualités Neutres</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export const NewsSection = memo(NewsSectionBase);
