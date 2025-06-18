
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface Agent {
  id: string;
  name: string;
  status: 'idle' | 'working' | 'complete';
  task: string;
  progress: number;
  type: 'data-collector' | 'analyzer' | 'predictor' | 'rag-agent';
}

interface AgentSystemProps {
  searchQuery: string;
}

export const AgentSystem: React.FC<AgentSystemProps> = ({ searchQuery }) => {
  const [agents, setAgents] = useState<Agent[]>([
    {
      id: 'data-agent',
      name: 'Data Collector',
      status: 'idle',
      task: 'Gathering real-time market data',
      progress: 0,
      type: 'data-collector'
    },
    {
      id: 'analysis-agent',
      name: 'Market Analyzer',
      status: 'idle',
      task: 'Analyzing technical indicators',
      progress: 0,
      type: 'analyzer'
    },
    {
      id: 'prediction-agent',
      name: 'AI Predictor',
      status: 'idle',
      task: 'Generating price predictions',
      progress: 0,
      type: 'predictor'
    },
    {
      id: 'rag-agent',
      name: 'Knowledge Agent',
      status: 'idle',
      task: 'Retrieving external insights',
      progress: 0,
      type: 'rag-agent'
    }
  ]);

  useEffect(() => {
    if (searchQuery) {
      // Simulate agent activation
      const activateAgents = async () => {
        for (let i = 0; i < agents.length; i++) {
          setTimeout(() => {
            setAgents(prev => prev.map((agent, index) => 
              index === i 
                ? { ...agent, status: 'working', progress: 0 }
                : agent
            ));

            // Simulate progress
            const progressInterval = setInterval(() => {
              setAgents(prev => prev.map((agent, index) => {
                if (index === i && agent.progress < 100) {
                  const newProgress = Math.min(agent.progress + 10, 100);
                  return {
                    ...agent,
                    progress: newProgress,
                    status: newProgress === 100 ? 'complete' : 'working'
                  };
                }
                return agent;
              }));
            }, 200);

            setTimeout(() => clearInterval(progressInterval), 2000);
          }, i * 500);
        }
      };

      activateAgents();
    }
  }, [searchQuery]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'idle': return 'bg-slate-500';
      case 'working': return 'bg-blue-500 animate-pulse';
      case 'complete': return 'bg-green-500';
      default: return 'bg-slate-500';
    }
  };

  const getAgentIcon = (type: string) => {
    switch (type) {
      case 'data-collector': return '📊';
      case 'analyzer': return '🔍';
      case 'predictor': return '🧠';
      case 'rag-agent': return '📚';
      default: return '🤖';
    }
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center space-x-2">
          <span>AI Agent System</span>
          <Badge variant="outline" className="text-cyan-400 border-cyan-400">
            A2A Active
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {agents.map((agent) => (
          <div key={agent.id} className="p-4 bg-slate-900/50 rounded-lg border border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="text-lg">{getAgentIcon(agent.type)}</span>
                <span className="text-white font-medium">{agent.name}</span>
              </div>
              <div className={`h-2 w-2 rounded-full ${getStatusColor(agent.status)}`}></div>
            </div>
            
            <p className="text-slate-400 text-sm mb-2">{agent.task}</p>
            
            {agent.status === 'working' && (
              <Progress value={agent.progress} className="h-2" />
            )}
            
            <Badge 
              variant="outline" 
              className={`mt-2 text-xs ${
                agent.status === 'complete' 
                  ? 'text-green-400 border-green-400' 
                  : agent.status === 'working'
                  ? 'text-blue-400 border-blue-400'
                  : 'text-slate-400 border-slate-400'
              }`}
            >
              {agent.status.toUpperCase()}
            </Badge>
          </div>
        ))}
        
        <div className="mt-4 p-3 bg-blue-900/20 border border-blue-700/50 rounded-lg">
          <p className="text-blue-300 text-sm">
            💡 <strong>MCP Integration:</strong> Agents communicate via Model Context Protocol for enhanced coordination
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
