
import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, BarChart3, Users, Zap, Shield } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export const HeroSection: React.FC = () => {
  const [stats, setStats] = useState({
    totalUsers: 125000,
    predictions: 98.7,
    volume: 2.4,
    accuracy: 94.2
  });

  useEffect(() => {
    // Animate numbers on mount
    const interval = setInterval(() => {
      setStats(prev => ({
        totalUsers: prev.totalUsers + Math.floor(Math.random() * 50),
        predictions: prev.predictions + (Math.random() - 0.5) * 0.1,
        volume: prev.volume + (Math.random() - 0.5) * 0.1,
        accuracy: Math.min(99.9, prev.accuracy + Math.random() * 0.1)
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: BarChart3,
      title: "AI-Powered Analysis",
      description: "Advanced machine learning algorithms analyze market patterns"
    },
    {
      icon: Zap,
      title: "Real-Time Data",
      description: "Live market data with millisecond precision updates"
    },
    {
      icon: Shield,
      title: "Risk Management",
      description: "Comprehensive risk assessment and portfolio protection"
    }
  ];

  return (
    <div className="relative overflow-hidden bg-slate-800/30 rounded-lg p-8">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          StockMind AI
        </h1>
        <p className="text-xl text-slate-300 max-w-2xl mx-auto">
          Revolutionizing investment decisions with AI-powered market intelligence and real-time analytics
        </p>
      </div>

      {/* Animated Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-400">{stats.totalUsers.toLocaleString()}+</div>
            <div className="text-slate-400 text-sm">Active Users</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">{stats.predictions.toFixed(1)}%</div>
            <div className="text-slate-400 text-sm">Prediction Rate</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-400">${stats.volume.toFixed(1)}T</div>
            <div className="text-slate-400 text-sm">Daily Volume</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400">{stats.accuracy.toFixed(1)}%</div>
            <div className="text-slate-400 text-sm">Accuracy Rate</div>
          </CardContent>
        </Card>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <Card key={index} className="bg-slate-800/30 border-slate-700 hover:bg-slate-800/50 transition-all duration-300 hover:scale-105">
            <CardContent className="p-6 text-center">
              <feature.icon className="h-12 w-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
              <p className="text-slate-400 text-sm">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
