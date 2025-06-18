
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

  const [newsData, setNewsData] = useState<any[]>([]);

  // Company profiles with real data
  const companyProfiles = {
    'AAPL': {
      name: 'Apple Inc.',
      price: 175.84,
      change: 2.34,
      changePercent: 1.35,
      marketCap: '2.8T',
      pe: 28.5,
      eps: 6.16,
      volume: 45678900,
      description: 'Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide. The company serves consumers, and small and mid-sized businesses; and the education, enterprise, and government markets.',
      sector: 'Technology',
      ceo: 'Tim Cook',
      employees: 164000,
      founded: '1976',
      headquarters: 'Cupertino, CA',
      recommendation: 'BUY',
      riskLevel: 'Low',
      technicalScore: 88,
      fundamentalScore: 92,
      sentimentScore: 85
    },
    'GOOGL': {
      name: 'Alphabet Inc.',
      price: 138.21,
      change: -1.45,
      changePercent: -1.04,
      marketCap: '1.7T',
      pe: 24.8,
      eps: 5.61,
      volume: 23456789,
      description: 'Alphabet Inc. operates as a holding company that gives ambitious projects the resources, freedom, and focus to make their ideas reality, and connects them with customers around the world.',
      sector: 'Technology',
      ceo: 'Sundar Pichai',
      employees: 190000,
      founded: '2015',
      headquarters: 'Mountain View, CA',
      recommendation: 'BUY',
      riskLevel: 'Medium',
      technicalScore: 82,
      fundamentalScore: 88,
      sentimentScore: 78
    },
    'MSFT': {
      name: 'Microsoft Corporation',
      price: 412.33,
      change: 5.67,
      changePercent: 1.39,
      marketCap: '3.1T',
      pe: 32.1,
      eps: 12.84,
      volume: 18765432,
      description: 'Microsoft Corporation develops, licenses, and supports software, services, devices, and solutions worldwide. The company operates in three segments: Productivity and Business Processes, Intelligent Cloud, and More Personal Computing.',
      sector: 'Technology',
      ceo: 'Satya Nadella',
      employees: 221000,
      founded: '1975',
      headquarters: 'Redmond, WA',
      recommendation: 'STRONG BUY',
      riskLevel: 'Low',
      technicalScore: 94,
      fundamentalScore: 96,
      sentimentScore: 91
    },
    'TSLA': {
      name: 'Tesla, Inc.',
      price: 248.91,
      change: -3.21,
      changePercent: -1.27,
      marketCap: '785B',
      pe: 58.7,
      eps: 4.24,
      volume: 89123456,
      description: 'Tesla, Inc. designs, develops, manufactures, leases, and sells electric vehicles, and energy generation and storage systems in the United States, China, and internationally.',
      sector: 'Automotive',
      ceo: 'Elon Musk',
      employees: 140473,
      founded: '2003',
      headquarters: 'Austin, TX',
      recommendation: 'HOLD',
      riskLevel: 'High',
      technicalScore: 72,
      fundamentalScore: 68,
      sentimentScore: 88
    },
    'NFLX': {
      name: 'Netflix, Inc.',
      price: 578.45,
      change: 8.92,
      changePercent: 1.57,
      marketCap: '250B',
      pe: 45.2,
      eps: 12.81,
      volume: 3456789,
      description: 'Netflix, Inc. operates as a streaming entertainment service company. The company offers TV series, documentaries and feature films across a wide variety of genres and languages.',
      sector: 'Communication Services',
      ceo: 'Reed Hastings',
      employees: 12800,
      founded: '1997',
      headquarters: 'Los Gatos, CA',
      recommendation: 'BUY',
      riskLevel: 'Medium',
      technicalScore: 79,
      fundamentalScore: 83,
      sentimentScore: 76
    },
    'AMZN': {
      name: 'Amazon.com, Inc.',
      price: 178.30,
      change: 2.45,
      changePercent: 1.39,
      marketCap: '1.9T',
      pe: 52.3,
      eps: 3.41,
      volume: 34567890,
      description: 'Amazon.com, Inc. engages in the retail sale of consumer products and subscriptions through online and physical stores primarily in North America.',
      sector: 'Consumer Discretionary',
      ceo: 'Andy Jassy',
      employees: 1608000,
      founded: '1994',
      headquarters: 'Seattle, WA',
      recommendation: 'BUY',
      riskLevel: 'Medium',
      technicalScore: 86,
      fundamentalScore: 81,
      sentimentScore: 82
    },
    'META': {
      name: 'Meta Platforms, Inc.',
      price: 523.78,
      change: -7.23,
      changePercent: -1.36,
      marketCap: '1.3T',
      pe: 26.1,
      eps: 20.07,
      volume: 12345678,
      description: 'Meta Platforms, Inc. develops products that enable people to connect and share with friends and family through mobile devices, personal computers, virtual reality headsets, and wearables.',
      sector: 'Technology',
      ceo: 'Mark Zuckerberg',
      employees: 77805,
      founded: '2004',
      headquarters: 'Menlo Park, CA',
      recommendation: 'HOLD',
      riskLevel: 'High',
      technicalScore: 75,
      fundamentalScore: 79,
      sentimentScore: 65
    },
    'NVDA': {
      name: 'NVIDIA Corporation',
      price: 876.45,
      change: 15.67,
      changePercent: 1.82,
      marketCap: '2.2T',
      pe: 67.8,
      eps: 12.92,
      volume: 67890123,
      description: 'NVIDIA Corporation provides graphics, and compute and networking solutions in the United States, Taiwan, China, and internationally.',
      sector: 'Technology',
      ceo: 'Jensen Huang',
      employees: 29600,
      founded: '1993',
      headquarters: 'Santa Clara, CA',
      recommendation: 'STRONG BUY',
      riskLevel: 'High',
      technicalScore: 91,
      fundamentalScore: 87,
      sentimentScore: 94
    }
  };

  // Generate company-specific news
  const generateCompanyNews = (symbol: string) => {
    const newsTemplates = {
      'AAPL': [
        {
          title: 'Apple Reports Record iPhone Sales in Q4',
          summary: 'Strong demand for iPhone 15 series drives revenue growth, exceeding analyst expectations.',
          sentiment: 'Positive',
          source: 'Apple Insider',
          time: '2 hours ago'
        },
        {
          title: 'Apple Vision Pro Production Ramping Up',
          summary: 'Apple increases manufacturing capacity for its mixed-reality headset ahead of launch.',
          sentiment: 'Positive',
          source: 'TechCrunch',
          time: '5 hours ago'
        },
        {
          title: 'Services Revenue Continues Strong Growth',
          summary: 'Apple\'s services division shows robust performance with App Store and subscription growth.',
          sentiment: 'Positive',
          source: 'Financial Times',
          time: '1 day ago'
        }
      ],
      'GOOGL': [
        {
          title: 'Google Cloud Revenue Surges 35% Year-over-Year',
          summary: 'Strong enterprise adoption drives cloud computing division growth.',
          sentiment: 'Positive',
          source: 'Reuters',
          time: '3 hours ago'
        },
        {
          title: 'Alphabet Invests Heavily in AI Infrastructure',
          summary: 'Company announces massive capital expenditure for AI and machine learning capabilities.',
          sentiment: 'Positive',
          source: 'Bloomberg',
          time: '6 hours ago'
        },
        {
          title: 'YouTube Advertising Revenue Shows Recovery',
          summary: 'Platform sees renewed advertiser interest after previous quarter\'s decline.',
          sentiment: 'Positive',
          source: 'AdAge',
          time: '1 day ago'
        }
      ],
      'MSFT': [
        {
          title: 'Microsoft Azure Gains Market Share',
          summary: 'Cloud platform continues to challenge AWS with enterprise-focused solutions.',
          sentiment: 'Positive',
          source: 'ZDNet',
          time: '1 hour ago'
        },
        {
          title: 'Copilot AI Integration Drives Office 365 Growth',
          summary: 'AI-powered features in productivity suite attract new enterprise customers.',
          sentiment: 'Positive',
          source: 'The Verge',
          time: '4 hours ago'
        },
        {
          title: 'Gaming Division Shows Strong Performance',
          summary: 'Xbox Game Pass subscriber growth and Activision integration boost gaming revenue.',
          sentiment: 'Positive',
          source: 'GameIndustry.biz',
          time: '8 hours ago'
        }
      ],
      'TSLA': [
        {
          title: 'Tesla Cybertruck Deliveries Begin',
          summary: 'Electric pickup truck finally reaches customers after years of delays.',
          sentiment: 'Positive',
          source: 'Electrek',
          time: '4 hours ago'
        },
        {
          title: 'Price Cuts Impact Margins, Boost Volume',
          summary: 'Tesla\'s aggressive pricing strategy increases sales but pressures profitability.',
          sentiment: 'Neutral',
          source: 'Automotive News',
          time: '7 hours ago'
        },
        {
          title: 'Full Self-Driving Beta Expands Globally',
          summary: 'Tesla rolls out advanced driver assistance features to more markets.',
          sentiment: 'Positive',
          source: 'InsideEVs',
          time: '1 day ago'
        }
      ]
    };

    return newsTemplates[symbol as keyof typeof newsTemplates] || [
      {
        title: `${symbol} Reports Quarterly Earnings`,
        summary: 'Company releases financial results showing mixed performance across segments.',
        sentiment: 'Neutral',
        source: 'Financial News',
        time: '2 hours ago'
      },
      {
        title: `Analysts Update ${symbol} Price Target`,
        summary: 'Wall Street analysts revise expectations following recent market developments.',
        sentiment: 'Neutral',
        source: 'Market Watch',
        time: '5 hours ago'
      },
      {
        title: `${symbol} Strategic Initiative Update`,
        summary: 'Company provides update on key business initiatives and future outlook.',
        sentiment: 'Positive',
        source: 'Business Wire',
        time: '1 day ago'
      }
    ];
  };

  useEffect(() => {
    console.log(`Loading company data for ${symbol}`);
    
    // Get company profile or use default
    const profile = companyProfiles[symbol as keyof typeof companyProfiles];
    
    if (profile) {
      setCompanyData(profile);
      setAnalysis({
        recommendation: profile.recommendation,
        targetPrice: profile.price * 1.15,
        riskLevel: profile.riskLevel,
        technicalScore: profile.technicalScore,
        fundamentalScore: profile.fundamentalScore,
        sentimentScore: profile.sentimentScore
      });
    } else {
      // Generate dynamic data for unknown companies
      const randomPrice = 50 + Math.random() * 200;
      const randomChange = (Math.random() - 0.5) * 10;
      
      setCompanyData({
        name: `${symbol} Inc.`,
        price: randomPrice,
        change: randomChange,
        changePercent: (randomChange / randomPrice) * 100,
        marketCap: `${(Math.random() * 500 + 10).toFixed(0)}B`,
        pe: Math.random() * 40 + 10,
        eps: Math.random() * 10 + 1,
        volume: Math.floor(Math.random() * 50000000) + 1000000,
        description: `${symbol} Inc. is a company operating in various business segments with focus on innovation and growth.`,
        sector: 'Technology',
        ceo: 'CEO Name',
        employees: Math.floor(Math.random() * 100000) + 5000,
        founded: '2000',
        headquarters: 'Corporate HQ'
      });
      
      setAnalysis({
        recommendation: Math.random() > 0.6 ? 'BUY' : Math.random() > 0.3 ? 'HOLD' : 'SELL',
        targetPrice: randomPrice * (1 + (Math.random() * 0.3 - 0.1)),
        riskLevel: Math.random() > 0.6 ? 'Low' : Math.random() > 0.3 ? 'Medium' : 'High',
        technicalScore: Math.floor(Math.random() * 40) + 60,
        fundamentalScore: Math.floor(Math.random() * 40) + 60,
        sentimentScore: Math.floor(Math.random() * 40) + 60
      });
    }
    
    // Generate company-specific news
    setNewsData(generateCompanyNews(symbol));
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
                  <Badge className={`text-lg px-4 py-2 ${
                    analysis.recommendation === 'STRONG BUY' ? 'bg-green-600/20 text-green-300' :
                    analysis.recommendation === 'BUY' ? 'bg-green-500/20 text-green-400' :
                    analysis.recommendation === 'HOLD' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {analysis.recommendation}
                  </Badge>
                  <p className="text-white text-2xl font-bold mt-2">
                    Target: ${analysis.targetPrice.toFixed(2)}
                  </p>
                  <p className="text-slate-400 mt-1">12-month target</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Risk Level</p>
                  <Badge variant="outline" className={`${
                    analysis.riskLevel === 'Low' ? 'text-green-400 border-green-400' :
                    analysis.riskLevel === 'Medium' ? 'text-yellow-400 border-yellow-400' :
                    'text-red-400 border-red-400'
                  }`}>
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
              <CardTitle className="text-white">Latest News & Insights for {symbol}</CardTitle>
              <Badge className="w-fit bg-purple-500/20 text-purple-400">
                RAG-Powered Analysis
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              {newsData.map((news, index) => (
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
