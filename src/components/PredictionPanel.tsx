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

  const generateCompanyPredictions = (symbol: string) => {
    console.log(`Generating predictions for ${symbol}`);
    
    const companyProfiles = {
      'AAPL': { volatility: 0.3, growth: 0.8, stability: 0.9 },
      'GOOGL': { volatility: 0.4, growth: 0.7, stability: 0.8 },
      'MSFT': { volatility: 0.25, growth: 0.75, stability: 0.95 },
      'TSLA': { volatility: 0.8, growth: 0.9, stability: 0.4 },
      'NFLX': { volatility: 0.5, growth: 0.6, stability: 0.6 },
      'AMZN': { volatility: 0.35, growth: 0.85, stability: 0.7 },
      'META': { volatility: 0.6, growth: 0.7, stability: 0.5 },
      'NVDA': { volatility: 0.7, growth: 0.95, stability: 0.6 }
    };

    const profile = companyProfiles[symbol as keyof typeof companyProfiles] || 
      { volatility: 0.5, growth: 0.6, stability: 0.6 };

    const generatePrediction = (timeframe: string, baseVolatility: number) => {
      const volatilityMultiplier = timeframe === 'nextDay' ? 1 : timeframe === 'nextWeek' ? 1.5 : 2;
      const adjustedVolatility = baseVolatility * volatilityMultiplier;
      
      const upwardBias = profile.growth * 0.3;
      const directionRandom = Math.random() + upwardBias;
      
      const baseConfidence = 40 + (profile.stability * 40);
      const confidenceVariation = (Math.random() - 0.5) * 20;
      const confidence = Math.max(30, Math.min(95, baseConfidence + confidenceVariation));
      
      const maxChange = timeframe === 'nextDay' ? 5 : timeframe === 'nextWeek' ? 12 : 20;
      const changeVariation = (Math.random() - 0.5) * maxChange * adjustedVolatility;
      
      return {
        direction: directionRandom > 0.5 ? 'up' : 'down',
        confidence: Math.floor(confidence),
        change: Number(changeVariation.toFixed(1))
      };
    };

    return {
      nextDay: generatePrediction('nextDay', profile.volatility),
      nextWeek: generatePrediction('nextWeek', profile.volatility),
      nextMonth: generatePrediction('nextMonth', profile.volatility)
    };
  };

  const updateModelAccuracies = (symbol: string) => {
    const techStocks = ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'NFLX', 'META', 'NVDA'];
    const isTechStock = techStocks.includes(symbol);
    
    setAiModels(prev => prev.map(model => {
      let accuracyAdjustment = 0;
      
      if (model.name === 'Transformer Model' && isTechStock) {
        accuracyAdjustment = 3;
      } else if (model.name === 'LSTM Neural Network' && symbol === 'TSLA') {
        accuracyAdjustment = -5;
      } else if (model.name === 'Random Forest' && !isTechStock) {
        accuracyAdjustment = 4;
      }
      
      const baseAccuracy = model.name === 'LSTM Neural Network' ? 85 :
                          model.name === 'Random Forest' ? 78 :
                          model.name === 'Transformer Model' ? 92 : 88;
      
      return {
        ...model,
        accuracy: Math.max(60, Math.min(98, baseAccuracy + accuracyAdjustment + (Math.random() - 0.5) * 4))
      };
    }));
  };

  useEffect(() => {
    if (selectedCompany) {
      console.log(`Updating predictions for ${selectedCompany}`);
      
      const newPredictions = generateCompanyPredictions(selectedCompany);
      setPredictions(newPredictions);
      
      updateModelAccuracies(selectedCompany);
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
    <div className="space-y-4">
      {/* AI Predictions - Horizontal Layout */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-white flex items-center space-x-2 text-lg">
            <Brain className="h-5 w-5 text-purple-400" />
            <span>AI Predictions</span>
            <Badge className="bg-purple-500/20 text-purple-400">LangGraph</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedCompany ? (
            <>
              <div className="text-center mb-4">
                <p className="text-slate-400 text-sm">Analyzing {selectedCompany}</p>
                <Badge className="bg-blue-500/20 text-blue-400 mt-1 text-xs">
                  Multi-Model Ensemble
                </Badge>
              </div>

              {/* Horizontal Predictions Grid */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                {Object.entries(predictions).map(([period, pred]) => (
                  <div key={period} className="p-3 bg-slate-900/50 rounded-lg border border-slate-700">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-medium text-sm capitalize">
                        {period.replace(/([A-Z])/g, ' $1')}
                      </span>
                      {getDirectionIcon(pred.direction)}
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 text-xs">Confidence</span>
                        <span className={`font-medium text-xs ${getConfidenceColor(pred.confidence)}`}>
                          {pred.confidence}%
                        </span>
                      </div>
                      
                      <Progress value={pred.confidence} className="h-1" />
                      
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 text-xs">Change</span>
                        <span className={`font-medium text-xs ${
                          pred.change >= 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {pred.change >= 0 ? '+' : ''}{pred.change.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Company-specific insights - Compact */}
              <div className="p-3 bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-lg border border-blue-500/20">
                <p className="text-blue-400 text-xs font-medium mb-1">AI Insight</p>
                <p className="text-slate-300 text-xs">
                  {selectedCompany === 'TSLA' && "High volatility expected due to EV market dynamics and regulatory changes."}
                  {selectedCompany === 'AAPL' && "Stable growth pattern with seasonal iPhone launch cycles affecting predictions."}
                  {selectedCompany === 'GOOGL' && "AI developments and advertising market trends driving forecast models."}
                  {selectedCompany === 'MSFT' && "Cloud computing growth and enterprise adoption supporting bullish outlook."}
                  {selectedCompany === 'NFLX' && "Streaming competition and content investment cycles influencing volatility."}
                  {!['TSLA', 'AAPL', 'GOOGL', 'MSFT', 'NFLX'].includes(selectedCompany) && 
                   "Analysis based on sector trends, market sentiment, and technical indicators."}
                </p>
              </div>
            </>
          ) : (
            <div className="text-center py-6">
              <Target className="h-8 w-8 text-slate-600 mx-auto mb-2" />
              <p className="text-slate-400 text-sm">Select a company to view predictions</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Horizontal Layout for Models and Sentiment */}
      <div className="grid grid-cols-2 gap-4">
        {/* AI Models Status - Compact */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-white flex items-center space-x-2 text-sm">
              <Zap className="h-4 w-4 text-yellow-400" />
              <span>AI Models</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {aiModels.map((model, index) => (
              <div key={index} className="p-2 bg-slate-900/50 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-white text-xs font-medium truncate pr-2">{model.name}</span>
                  <Badge className={`text-xs ${
                    model.status === 'active' 
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-orange-500/20 text-orange-400'
                  }`}>
                    {model.status}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-xs">Accuracy</span>
                  <span className="text-white text-xs font-medium">{model.accuracy.toFixed(0)}%</span>
                </div>
                
                <Progress value={model.accuracy} className="h-1 mt-1" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Market Sentiment - Compact */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-sm">Market Sentiment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-xs">Fear & Greed Index</span>
                <span className="text-green-400 font-medium text-xs">68 (Greed)</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-xs">Social Sentiment</span>
                <span className="text-blue-400 font-medium text-xs">
                  {selectedCompany === 'TSLA' ? 'Very Bullish' : 
                   selectedCompany === 'AAPL' ? 'Bullish' : 
                   selectedCompany ? 'Neutral' : 'Bullish'}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-xs">News Sentiment</span>
                <span className="text-green-400 font-medium text-xs">
                  {selectedCompany === 'META' ? 'Mixed' : 'Positive'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
