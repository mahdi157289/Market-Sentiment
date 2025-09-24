import { motion } from 'framer-motion';
import { SentimentGauge } from '@components/metrics/SentimentGauge';
import { MiniTrend } from '@components/charts/MiniTrend';
import { mockOverview, mockChartSeries } from '@data/mock';
import { MetricCard } from '@components/metrics/MetricCard';
import { Suspense, lazy } from 'react';
const ChartComponent = lazy(() => import('@components/charts/ChartComponent').then(m => ({ default: m.ChartComponent })));
import type { TimeRange } from '@types';
import { useState } from 'react';

export function OverviewSection() {
  const { sentimentScore, marketBreadth, volatilityIndex } = mockOverview;
  const [range, setRange] = useState<TimeRange>('1M');
  const [testValue, setTestValue] = useState(sentimentScore);

  const testValues = [25, 45, 58, 75, 85];

  return (
    <div className="space-y-8">
      {/* Main Overview */}
      <section className="grid gap-6 md:grid-cols-3">
        <motion.div 
          whileHover={{ y: -2 }} 
          className="glass p-8 flex flex-col items-center justify-center min-h-[280px]"
        >
          <h2 className="text-sm font-medium text-white/70 mb-6 uppercase tracking-wider">Overall Sentiment</h2>
          <SentimentGauge value={sentimentScore} size="md" showLabel={true} />
        </motion.div>

        <motion.div 
          whileHover={{ y: -2 }} 
          className="glass p-8 flex flex-col items-center justify-center min-h-[280px]"
        >
          <h2 className="text-sm font-medium text-white/70 mb-6 uppercase tracking-wider">Market Breadth</h2>
          <div className="w-full h-32 flex items-center justify-center">
            <MiniTrend data={marketBreadth} color="primary" />
          </div>
          <div className="mt-4 text-center">
            <div className="text-2xl font-bold text-primary">+12.5%</div>
            <div className="text-xs text-white/60">vs yesterday</div>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -2 }} 
          className="glass p-8 flex flex-col items-center justify-center min-h-[280px]"
        >
          <h2 className="text-sm font-medium text-white/70 mb-6 uppercase tracking-wider">Volatility Index</h2>
          <div className="w-full h-32 flex items-center justify-center">
            <MiniTrend data={volatilityIndex} color="warning" />
          </div>
          <div className="mt-4 text-center">
            <div className="text-2xl font-bold text-warning">22.1</div>
            <div className="text-xs text-white/60">VIX level</div>
          </div>
        </motion.div>
      </section>

      {/* Interactive Gauge Demo */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass p-8"
      >
        <div className="text-center mb-8">
          <h2 className="text-xl font-semibold mb-2">Interactive Sentiment Gauge</h2>
          <p className="text-sm text-white/60">Test different sentiment values to see the gauge in action</p>
        </div>
        
        <div className="flex flex-col lg:flex-row items-center justify-center gap-12">
          <div className="flex-shrink-0">
            <SentimentGauge value={testValue} size="lg" showLabel={true} />
          </div>
          
          <div className="flex flex-col items-center gap-6 min-w-[280px]">
            <div className="text-center">
              <p className="text-sm font-medium text-white/80 mb-4">Click to test different values:</p>
              <div className="flex flex-wrap justify-center gap-3">
                {testValues.map((value) => (
                  <button
                    key={value}
                    onClick={() => setTestValue(value)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      testValue === value 
                        ? 'bg-primary/20 text-primary border-2 border-primary/40 shadow-lg shadow-primary/20' 
                        : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white border border-white/20'
                    }`}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="text-center p-4 bg-white/5 rounded-lg border border-white/10">
              <div className="text-lg font-bold text-white mb-1">Current Value</div>
              <div className="text-3xl font-bold mb-2" style={{ 
                color: testValue >= 70 ? '#16a34a' : testValue >= 40 ? '#ca8a04' : '#dc2626' 
              }}>
                {testValue}
              </div>
              <div className="text-sm text-white/60">
                {testValue >= 70 ? 'Bullish' : testValue >= 40 ? 'Neutral' : 'Bearish'} Sentiment
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Metric + Chart Demo */}
      <section className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6">
          <MetricCard id="advancers" title="Advancers" value="327" change={0.065} trend="up" accent="primary" />
          <MetricCard id="decliners" title="Decliners" value="192" change={-0.034} trend="down" accent="error" />
          <MetricCard id="newHighs" title="52W Highs" value="18" change={0.012} trend="up" accent="warning" />
        </div>
        <div className="lg:col-span-2">
          <Suspense fallback={<div className="glass p-6 text-white/70">Loading chart...</div>}>
            <ChartComponent 
              title="Market Composite"
              ranges={['1D','1W','1M','3M','1Y']}
              activeRange={range}
              onRangeChange={setRange}
              series={mockChartSeries as any}
              color="primary"
            />
          </Suspense>
        </div>
      </section>
    </div>
  );
}


