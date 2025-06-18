
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, TrendingUp, TrendingDown, BarChart } from 'lucide-react';
import { StockChart } from './StockChart';

interface CompanyDetailProps {
  symbol: string;
  onBack: () => void;
}

export const CompanyDetail: React.FC<CompanyDetailProps> = ({ symbol, onBack }) => {
  const [companyData, setCompanyData] = useState({
    name: '',
    price: 0,
    change: 0,
    changePercent: 0,
    marketCap: '',
    pe: 0,
    eps: 0,
    volume: 0,
    description: '',
    sector: '',
    ceo: '',
    employees: 0,
    founded: '',
    headquarters: ''
  });

  const [analysis, setAnalysis] = useState({
    recommendation: 'BUY',
    targetPrice: 0,
    riskLevel: 'Medium',
    technicalScore: 85,
    fundamentalScore: 78,
    sentimentScore: 92
  });

  useEffect(() => {
    // Simulate fetching company data
    const fetchCompanyData = () => {
      const mockData = {
        AAPL: {
          name: 'Apple Inc.',
          price: 175.84,
          change: 2.34,
          changePercent: 1.35,
          marketCap: '2.8T',
          pe: 28.5,
          eps: 6.16,
          volume: 45678900,
          description: 'Apple Inc. is an American multinational technology company that specializes in consumer electronics, software and online services.',
          sector: 'Technology',
          ceo: 'Tim Cook',
          employees: 164000,
          founded: '1976',
          headquarters: 'Cupertino, CA'
        },
        GOOGL: {
          name: 'Alphabet Inc.',
          price: 138.21,
          change: -1.45,
          changePercent: -1.04,
          marketCap: '1.7T',
          pe: 24.8,
          eps: 5.61,
          volume: 23456789,
          description: 'Alphabet Inc. is an American multinational conglomerate and the parent company of Google.',
          sector: 'Technology',
          ceo: 'Sundar Pichai',
          employees: 190000,
          founded: '2015',
          headquarters: 'Mountain View, CA'
        }
      };

      setCompanyData(mockData[symbol as keyof typeof mockData] || mockData.AAPL);
    };

    fetchCompanyData();
  }, [symbol]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button 
          variant="outline" 
          onClick={onBack}
          className="bg-slate-800 border-slate-600 text-white hover:bg-slate-700"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Overview
        </Button>
        <Badge className="bg-blue-500/20 text-blue-400">
          AI Analysis Complete
        </Badge>
      </div>

      {/* Company Header */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">{symbol}</h1>
              <p className="text-xl text-slate-300">{companyData.name}</p>
              <p className="text-slate-400 mt-2">{companyData.sector}</p>
            </div>
            <div className="text-right">
              <p className="text-4xl font-bold text-white">
                ${companyData.price.toFixed(2)}
              </p>
              <div className="flex items-center justify-end space-x-1 mt-1">
                {companyData.change >= 0 ? (
                  <TrendingUp className="h-5 w-5 text-green-400" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-red-400" />
                )}
                <span className={`text-lg font-medium ${
                  companyData.change >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {companyData.change >= 0 ? '+' : ''}
                  {companyData.change.toFixed(2)} ({companyData.changePercent.toFixed(2)}%)
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-slate-800 border-slate-700">
          <TabsTrigger value="overview" className="text-white">Overview</TabsTrigger>
          <TabsTrigger value="chart" className="text-white">Chart</TabsTrigger>
          <TabsTrigger value="analysis" className="text-white">AI Analysis</TabsTrigger>
          <TabsTrigger value="news" className="text-white">News & Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Key Metrics */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Key Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-slate-400 text-sm">Market Cap</p>
                    <p className="text-white font-bold text-lg">{companyData.marketCap}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">P/E Ratio</p>
                    <p className="text-white font-bold text-lg">{companyData.pe}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">EPS</p>
                    <p className="text-white font-bold text-lg">${companyData.eps}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Volume</p>
                    <p className="text-white font-bold text-lg">
                      {(companyData.volume / 1000000).toFixed(1)}M
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Company Info */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Company Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-slate-400 text-sm">CEO</p>
                  <p className="text-white">{companyData.ceo}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Employees</p>
                  <p className="text-white">{companyData.employees.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Founded</p>
                  <p className="text-white">{companyData.founded}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Headquarters</p>
                  <p className="text-white">{companyData.headquarters}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Description */}
          <Card className="bg-slate-800/50 border-slate-700 mt-6">
            <CardHeader>
              <CardTitle className="text-white">About {companyData.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300 leading-relaxed">{companyData.description}</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chart">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <BarChart className="h-5 w-5" />
                <span>{symbol} Stock Chart</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <StockChart symbol={symbol} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">AI Recommendation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-6 bg-gradient-to-r from-green-900/20 to-blue-900/20 rounded-lg">
                  <Badge className="bg-green-500/20 text-green-400 text-lg px-4 py-2">
                    {analysis.recommendation}
                  </Badge>
                  <p className="text-white text-2xl font-bold mt-2">
                    Target: ${analysis.targetPrice || (companyData.price * 1.15).toFixed(2)}
                  </p>
                  <p className="text-slate-400 mt-1">12-month target</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Risk Level</p>
                  <Badge variant="outline" className="text-yellow-400 border-yellow-400">
                    {analysis.riskLevel}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">AI Scores</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-400">Technical Analysis</span>
                    <span className="text-white">{analysis.technicalScore}/100</span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full">
                    <div 
                      className="h-2 bg-blue-500 rounded-full transition-all duration-500"
                      style={{ width: `${analysis.technicalScore}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-400">Fundamental Analysis</span>
                    <span className="text-white">{analysis.fundamentalScore}/100</span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full">
                    <div 
                      className="h-2 bg-green-500 rounded-full transition-all duration-500"
                      style={{ width: `${analysis.fundamentalScore}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-400">Market Sentiment</span>
                    <span className="text-white">{analysis.sentimentScore}/100</span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full">
                    <div 
                      className="h-2 bg-purple-500 rounded-full transition-all duration-500"
                      style={{ width: `${analysis.sentimentScore}%` }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="news">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Latest News & Insights</CardTitle>
              <Badge className="w-fit bg-purple-500/20 text-purple-400">
                RAG-Powered Analysis
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  title: `${companyData.name} Reports Strong Q4 Earnings`,
                  summary: "Company exceeds analyst expectations with revenue growth driven by strong product demand.",
                  sentiment: "Positive",
                  source: "Financial Times",
                  time: "2 hours ago"
                },
                {
                  title: "Industry Analysis: Tech Sector Outlook",
                  summary: "Analysts remain bullish on technology stocks despite market volatility.",
                  sentiment: "Neutral",
                  source: "Reuters",
                  time: "4 hours ago"
                },
                {
                  title: "AI-Powered Market Prediction",
                  summary: "Machine learning models suggest continued upward trend based on historical patterns.",
                  sentiment: "Positive",
                  source: "AI Market Insights",
                  time: "6 hours ago"
                }
              ].map((news, index) => (
                <div key={index} className="p-4 bg-slate-900/50 rounded-lg border border-slate-700">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-white font-medium mb-2">{news.title}</h3>
                      <p className="text-slate-400 text-sm mb-2">{news.summary}</p>
                      <div className="flex items-center space-x-4 text-xs text-slate-500">
                        <span>{news.source}</span>
                        <span>{news.time}</span>
                      </div>
                    </div>
                    <Badge 
                      variant="outline"
                      className={`ml-4 ${
                        news.sentiment === 'Positive' 
                          ? 'text-green-400 border-green-400'
                          : news.sentiment === 'Negative'
                          ? 'text-red-400 border-red-400'
                          : 'text-slate-400 border-slate-400'
                      }`}
                    >
                      {news.sentiment}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
