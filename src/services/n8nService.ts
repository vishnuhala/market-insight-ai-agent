
interface N8nWorkflowPayload {
  symbol?: string;
  apiKey?: string;
  timestamp: string;
  workflowType: string;
  source: string;
  context: {
    userAgent: string;
    referrer: string;
  };
  marketData?: any;
}

interface N8nResponse {
  success: boolean;
  workflowId?: string;
  executionId?: string;
  message?: string;
}

export class N8nService {
  private baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || localStorage.getItem('n8n_base_url') || '';
  }

  // Trigger workflow with Alpha Vantage data integration
  async triggerWorkflow(
    webhookUrl: string, 
    workflowType: string, 
    symbol?: string
  ): Promise<N8nResponse> {
    const apiKey = localStorage.getItem('stockApiKey');
    
    // Fetch current market data if symbol is provided
    let marketData = null;
    if (symbol && apiKey) {
      try {
        const response = await fetch(
          `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`
        );
        marketData = await response.json();
      } catch (error) {
        console.warn('Failed to fetch market data for n8n workflow:', error);
      }
    }

    const payload: N8nWorkflowPayload = {
      symbol,
      apiKey,
      timestamp: new Date().toISOString(),
      workflowType,
      source: 'stockmind-ai',
      context: {
        userAgent: navigator.userAgent,
        referrer: window.location.href
      },
      marketData
    };

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'no-cors',
        body: JSON.stringify(payload),
      });

      return {
        success: true,
        message: 'Workflow triggered successfully'
      };
    } catch (error) {
      console.error('n8n workflow trigger failed:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Get workflow status (if n8n API is accessible)
  async getWorkflowStatus(executionId: string): Promise<any> {
    if (!this.baseUrl) {
      throw new Error('n8n base URL not configured');
    }

    try {
      const response = await fetch(`${this.baseUrl}/api/v1/executions/${executionId}`, {
        headers: {
          'Accept': 'application/json',
        }
      });
      
      return await response.json();
    } catch (error) {
      console.error('Failed to get workflow status:', error);
      throw error;
    }
  }

  // Validate webhook URL format
  static isValidWebhookUrl(url: string): boolean {
    try {
      const urlObj = new URL(url);
      return urlObj.pathname.includes('/webhook/') || urlObj.pathname.includes('/webhook-test/');
    } catch {
      return false;
    }
  }

  // Generate suggested webhook URLs based on workflow type
  static generateWebhookUrl(baseUrl: string, workflowType: string): string {
    const cleanBaseUrl = baseUrl.replace(/\/$/, '');
    return `${cleanBaseUrl}/webhook/${workflowType}`;
  }
}

export default N8nService;
