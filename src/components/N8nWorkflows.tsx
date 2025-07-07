
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Webhook, Play, Settings, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface N8nWorkflow {
  id: string;
  name: string;
  description: string;
  webhookUrl: string;
  status: 'idle' | 'running' | 'completed' | 'error';
  lastRun?: Date;
  progress: number;
  icon: string;
}

interface N8nWorkflowsProps {
  selectedCompany?: string | null;
}

export const N8nWorkflows: React.FC<N8nWorkflowsProps> = ({ selectedCompany }) => {
  const [workflows, setWorkflows] = useState<N8nWorkflow[]>([
    {
      id: 'stock-analysis',
      name: 'Deep Stock Analysis',
      description: 'Comprehensive analysis using multiple AI agents and data sources',
      webhookUrl: '',
      status: 'idle',
      progress: 0,
      icon: '📊'
    },
    {
      id: 'sentiment-tracker',
      name: 'Social Sentiment Tracker',
      description: 'Monitor Reddit, Twitter, and news sentiment for selected stock',
      webhookUrl: '',
      status: 'idle',
      progress: 0,
      icon: '📱'
    },
    {
      id: 'earnings-predictor',
      name: 'Earnings Impact Predictor',
      description: 'Analyze earnings calls and predict stock price impact',
      webhookUrl: '',
      status: 'idle',
      progress: 0,
      icon: '💰'
    },
    {
      id: 'risk-monitor',
      name: 'Risk Alert System',
      description: 'Monitor portfolio risk and send real-time alerts',
      webhookUrl: '',
      status: 'idle',
      progress: 0,
      icon: '⚠️'
    }
  ]);

  const [n8nBaseUrl, setN8nBaseUrl] = useState('');

  // Load saved n8n configuration
  useEffect(() => {
    const savedBaseUrl = localStorage.getItem('n8n_base_url');
    const savedWorkflows = localStorage.getItem('n8n_workflows');
    
    if (savedBaseUrl) {
      setN8nBaseUrl(savedBaseUrl);
    }
    
    if (savedWorkflows) {
      try {
        const parsed = JSON.parse(savedWorkflows);
        setWorkflows(parsed);
      } catch (error) {
        console.error('Failed to parse saved workflows:', error);
      }
    }
  }, []);

  // Save configuration when it changes
  const saveConfiguration = () => {
    localStorage.setItem('n8n_base_url', n8nBaseUrl);
    localStorage.setItem('n8n_workflows', JSON.stringify(workflows));
    toast.success('n8n configuration saved');
  };

  // Update webhook URL for a workflow
  const updateWorkflowUrl = (workflowId: string, url: string) => {
    setWorkflows(prev => prev.map(workflow => 
      workflow.id === workflowId 
        ? { ...workflow, webhookUrl: url }
        : workflow
    ));
  };

  // Trigger n8n workflow
  const triggerWorkflow = async (workflow: N8nWorkflow) => {
    if (!workflow.webhookUrl) {
      toast.error('Webhook URL required', {
        description: `Please set the webhook URL for ${workflow.name}`
      });
      return;
    }

    if (!selectedCompany && workflow.id !== 'risk-monitor') {
      toast.error('Stock selection required', {
        description: 'Please select a stock to analyze'
      });
      return;
    }

    // Update workflow status
    setWorkflows(prev => prev.map(w => 
      w.id === workflow.id 
        ? { ...w, status: 'running', progress: 0, lastRun: new Date() }
        : w
    ));

    try {
      const apiKey = localStorage.getItem('stockApiKey');
      
      // Prepare payload with Alpha Vantage data and context
      const payload = {
        symbol: selectedCompany,
        apiKey: apiKey,
        timestamp: new Date().toISOString(),
        workflowType: workflow.id,
        source: 'stockmind-ai',
        context: {
          userAgent: navigator.userAgent,
          referrer: window.location.href
        }
      };

      console.log(`Triggering n8n workflow: ${workflow.name}`, payload);

      // Simulate progress
      const progressInterval = setInterval(() => {
        setWorkflows(prev => prev.map(w => {
          if (w.id === workflow.id && w.progress < 90) {
            return { ...w, progress: w.progress + 10 };
          }
          return w;
        }));
      }, 500);

      const response = await fetch(workflow.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'no-cors', // Handle CORS for external n8n instances
        body: JSON.stringify(payload),
      });

      // Clear progress interval
      clearInterval(progressInterval);

      // Update final status
      setWorkflows(prev => prev.map(w => 
        w.id === workflow.id 
          ? { ...w, status: 'completed', progress: 100 }
          : w
      ));

      toast.success(`${workflow.name} triggered`, {
        description: 'Check your n8n instance for workflow execution status'
      });

      // Reset status after 5 seconds
      setTimeout(() => {
        setWorkflows(prev => prev.map(w => 
          w.id === workflow.id 
            ? { ...w, status: 'idle', progress: 0 }
            : w
        ));
      }, 5000);

    } catch (error) {
      console.error('Error triggering n8n workflow:', error);
      
      setWorkflows(prev => prev.map(w => 
        w.id === workflow.id 
          ? { ...w, status: 'error', progress: 0 }
          : w
      ));

      toast.error('Workflow trigger failed', {
        description: 'Please check your n8n webhook URL and try again'
      });

      // Reset status after 3 seconds
      setTimeout(() => {
        setWorkflows(prev => prev.map(w => 
          w.id === workflow.id 
            ? { ...w, status: 'idle', progress: 0 }
            : w
        ));
      }, 3000);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running': return <Clock className="h-4 w-4 text-blue-400 animate-spin" />;
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'error': return <AlertCircle className="h-4 w-4 text-red-400" />;
      default: return <Webhook className="h-4 w-4 text-slate-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-blue-500/20 text-blue-400 border-blue-400';
      case 'completed': return 'bg-green-500/20 text-green-400 border-green-400';
      case 'error': return 'bg-red-500/20 text-red-400 border-red-400';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-400';
    }
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center space-x-2">
          <Webhook className="h-5 w-5 text-purple-400" />
          <span>n8n Workflows</span>
          <Badge variant="outline" className="text-purple-400 border-purple-400">
            Automation Active
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* n8n Base URL Configuration */}
        <div className="p-3 bg-slate-900/50 rounded-lg border border-slate-700">
          <div className="flex items-center space-x-2 mb-2">
            <Settings className="h-4 w-4 text-slate-400" />
            <span className="text-white text-sm font-medium">n8n Configuration</span>
          </div>
          <div className="flex space-x-2">
            <Input
              placeholder="https://your-n8n-instance.com"
              value={n8nBaseUrl}
              onChange={(e) => setN8nBaseUrl(e.target.value)}
              className="bg-slate-800 border-slate-600 text-white text-xs"
            />
            <Button
              size="sm"
              onClick={saveConfiguration}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Save
            </Button>
          </div>
        </div>

        {/* Workflow List */}
        <div className="space-y-3">
          {workflows.map((workflow) => (
            <div key={workflow.id} className="p-4 bg-slate-900/50 rounded-lg border border-slate-700">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{workflow.icon}</span>
                  <div>
                    <h3 className="text-white font-medium text-sm">{workflow.name}</h3>
                    <p className="text-slate-400 text-xs">{workflow.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(workflow.status)}
                  <Badge variant="outline" className={`text-xs ${getStatusColor(workflow.status)}`}>
                    {workflow.status.toUpperCase()}
                  </Badge>
                </div>
              </div>

              {/* Webhook URL Input */}
              <div className="mb-3">
                <Input
                  placeholder={`${n8nBaseUrl}/webhook/${workflow.id}`}
                  value={workflow.webhookUrl}
                  onChange={(e) => updateWorkflowUrl(workflow.id, e.target.value)}
                  className="bg-slate-800 border-slate-600 text-white text-xs"
                />
              </div>

              {/* Progress Bar */}
              {workflow.status === 'running' && (
                <div className="mb-3">
                  <Progress value={workflow.progress} className="h-1" />
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between">
                <Button
                  size="sm"
                  onClick={() => triggerWorkflow(workflow)}
                  disabled={workflow.status === 'running'}
                  className="bg-blue-600 hover:bg-blue-700 text-xs"
                >
                  <Play className="h-3 w-3 mr-1" />
                  Trigger
                </Button>
                
                {workflow.lastRun && (
                  <span className="text-xs text-slate-500">
                    Last run: {workflow.lastRun.toLocaleTimeString()}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Integration Info */}
        <div className="p-3 bg-purple-900/20 border border-purple-700/50 rounded-lg">
          <p className="text-purple-300 text-xs">
            💡 <strong>Alpha Vantage Integration:</strong> Your API key and selected stock data will be automatically sent to n8n workflows for processing
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
