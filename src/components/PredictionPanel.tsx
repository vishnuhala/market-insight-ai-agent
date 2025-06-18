
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Brain, TrendingUp, TrendingDown, Target, Zap } from 'lucide-react';

interface PredictionPanelProps {
  selectedCompany: string | null;
}

export const PredictionPanel: React.FC<PredictionPanelProps> = ({ selectedCompany }) => {
  const [predictions, setPredictions] = useState({
    nextDay: { direction: 'up', confidence: 78, change: 1.2 },
    nextWeek: { direction: 'up', confidence: 65, change: 3.5 },
    nextMonth: { direction: 'down', confidence: 45, change: -2.1 }
  });

  const [aiModels, setAiModels] = useState([
    { name: 'LSTM Neural Network', accuracy: 85, status: 'active' },
    { name: 'Random Forest', accuracy: 78, status: 'active' },
    { name: 'Transformer Model', accuracy: 92, status: 'training' },
    { name: 'Ensemble Model', accuracy: 88, status: 'active' }
  ]);

  useEffect(() => {
    if (selectedCompany) {
      // Simulate prediction updates when company changes
      const timeout = setTimeout(() => {
        setPredictions({
          nextDay: { 
            direction: Math.random() > 0.5 ? 'up' : 'down', 
            confidence: Math.floor(Math.random() * 30) + 60, 
            change: (Math.random() - 0.5) * 4 
          },
          nextWeek: { 
            direction: Math.random() > 0.5 ? 'up' : 'down', 
            confidence: Math.floor(Math.random() * 30) + 50, 
            change: (Math.random() - 0.5) * 8 
          },
          nextMonth: { 
            direction: Math.random() > 0.5 ? 'up' : 'down', 
            confidence: Math.floor(Math.random() * 30) + 40, 
            change: (Math.random() - 0.5) * 12 
          }
        });
      }, 1000);

      return () => clearTimeout(timeout);
    }
  }, [selectedCompany]);

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-400';
    if (confidence >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getDirectionIcon = (direction: string) => {
    return direction === 'up' ? (
      <TrendingUp className="h-4 w-4 text-green-400" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-400" />
    );
  };

  return (
    <div className="space-y-6">
      {/* AI Predictions */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Brain className="h-5 w-5 text-purple-400" />
            <span>AI Predictions</span>
            <Badge className="bg-purple-500/20 text-purple-400">LangGraph</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {selectedCompany ? (
            <>
              <div className="text-center mb-4">
                <p className="text-slate-400 text-sm">Analyzing {selectedCompany}</p>
                <Badge className="bg-blue-500/20 text-blue-400 mt-1">
                  Multi-Model Ensemble
                </Badge>
              </div>

              {Object.entries(predictions).map(([period, pred]) => (
                <div key={period} className="p-3 bg-slate-900/50 rounded-lg border border-slate-700">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium capitalize">
                      {period.replace(/([A-Z])/g, ' $1')}
                    </span>
                    {getDirectionIcon(pred.direction)}
                  </div>
                  
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-400 text-sm">Confidence</span>
                    <span className={`font-medium ${getConfidenceColor(pred.confidence)}`}>
                      {pred.confidence}%
                    </span>
                  </div>
                  
                  <Progress value={pred.confidence} className="h-2 mb-2" />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-sm">Expected Change</span>
                    <span className={`font-medium ${
                      pred.change >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {pred.change >= 0 ? '+' : ''}{pred.change.toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div className="text-center py-8">
              <Target className="h-12 w-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400">Select a company to view predictions</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* AI Models Status */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Zap className="h-5 w-5 text-yellow-400" />
            <span>AI Models</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {aiModels.map((model, index) => (
            <div key={index} className="p-3 bg-slate-900/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white text-sm font-medium">{model.name}</span>
                <Badge className={
                  model.status === 'active' 
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-orange-500/20 text-orange-400'
                }>
                  {model.status}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-xs">Accuracy</span>
                <span className="text-white text-sm font-medium">{model.accuracy}%</span>
              </div>
              
              <Progress value={model.accuracy} className="h-1 mt-1" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Market Sentiment */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white text-sm">Market Sentiment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-slate-400 text-sm">Fear & Greed Index</span>
              <span className="text-green-400 font-medium">68 (Greed)</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-slate-400 text-sm">Social Sentiment</span>
              <span className="text-blue-400 font-medium">Bullish</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-slate-400 text-sm">News Sentiment</span>
              <span className="text-green-400 font-medium">Positive</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
