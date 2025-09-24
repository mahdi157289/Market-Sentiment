import { useState } from 'react';
import { motion } from 'framer-motion';
import { Header } from '@components/layout/Header';
import { SentimentGauge } from '@components/SentimentGauge';
import { MetricCards } from '@components/MetricCards';
import { ChartsSection } from '@components/ChartsSection';
import { MacroSection } from '@components/MacroSection';
import { NewsSection } from '@components/NewsSection';
import { AISummary } from '@components/AISummary';
import { mockMarketIndexes } from '@data/mock';
import { MarketIndex, SentimentData, Metric } from '@types';
import { DashboardProvider } from '@/context/DashboardContext';
import { ErrorBoundary } from '@components/common/ErrorBoundary';
import { LoadingOverlay } from '@components/common/LoadingOverlay';
import { useDashboard } from '@/context/DashboardContext';

function AppContent() {
  const [selectedIndex, setSelectedIndex] = useState<MarketIndex>(mockMarketIndexes[0]!);
  const { loading } = useDashboard();

  // Mock data for components
  const sentimentData: SentimentData = {
    score: 65,
    status: "Neutral",
    description: "Le marché affiche un sentiment mitigé avec des signaux contradictoires. La volatilité reste contenue mais la prudence domine."
  };

  const metrics: Metric[] = [
    {
      name: "Fear & Greed Index",
      value: 58,
      change: 0.12,
      isPositiveGood: true
    },
    {
      name: "VIX",
      value: 22.1,
      change: -0.08,
      isPositiveGood: false
    },
    {
      name: "Put/Call Ratio",
      value: 0.85,
      change: 0.15,
      isPositiveGood: false
    },
    {
      name: "DXY",
      value: 103.45,
      change: 0.03,
      isPositiveGood: false
    },
    {
      name: "10Y Yield",
      value: 4.25,
      change: 0.05,
      isPositiveGood: false
    }
  ];

  return (
    <div className="min-h-full flex flex-col">
      <LoadingOverlay visible={loading} />
      
      {/* 1. Header (top) */}
      <Header 
        selectedIndex={selectedIndex}
        onIndexChange={setSelectedIndex}
        availableIndexes={mockMarketIndexes}
      />
      
      <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6 sm:space-y-8 lg:space-y-12"
        >
          {/* Section 1: SentimentGauge + MetricCards (quick overview) - 5-second understanding */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4 sm:space-y-6 lg:space-y-8"
          >
            <div className="text-center px-2">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-1 sm:mb-2">Vue d'Ensemble du Marché</h2>
              <p className="text-xs sm:text-sm text-white/60">Compréhension rapide en 5 secondes</p>
            </div>
            
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
              {/* Large Sentiment Gauge */}
              <div className="order-1 xl:order-1">
                <SentimentGauge data={sentimentData} size="lg" />
              </div>
              
              {/* Mini-cards */}
              <div className="order-2 xl:order-2">
                <MetricCards metrics={metrics} />
              </div>
            </div>
          </motion.section>

          {/* Section 2: ChartsSection (market drivers) - 1-minute context */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-4 sm:space-y-6 lg:space-y-8"
          >
            <div className="text-center px-2">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-1 sm:mb-2">Analyse Technique</h2>
              <p className="text-xs sm:text-sm text-white/60">Contexte technique en 1 minute</p>
            </div>
            
            <ChartsSection selectedIndex={selectedIndex} />
          </motion.section>

          {/* Section 3: MacroSection (macro context) */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4 sm:space-y-6 lg:space-y-8"
          >
            <MacroSection />
          </motion.section>

          {/* Section 4: NewsSection (news/sentiment) */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-4 sm:space-y-6 lg:space-y-8"
          >
            <NewsSection />
          </motion.section>

          {/* Section 5: AISummary (AI analysis) - 5-minute decision */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-4 sm:space-y-6 lg:space-y-8"
          >
            <div className="text-center px-2">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-1 sm:mb-2">Analyse IA du Marché</h2>
              <p className="text-xs sm:text-sm text-white/60">Décision éclairée en 5 minutes</p>
            </div>
            
            <AISummary autoUpdate={true} />
          </motion.section>
        </motion.div>
      </main>

      <footer className="mx-4 mb-6 mt-auto text-center text-xs text-white/40">
        Data is mock for development. Structured for future API integration.
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <DashboardProvider initialIndex={mockMarketIndexes[0]!} initialRange="1M">
        <AppContent />
      </DashboardProvider>
    </ErrorBoundary>
  );
}


