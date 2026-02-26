/**
 * Data Worker - Handles data fetching and parsing in background thread
 * 
 * This worker can:
 * - Fetch data from APIs
 * - Parse large JSON/CSV files
 * - Process data without blocking main thread
 */

// Type definitions for messages
interface WorkerMessage {
  action: 'fetch' | 'parse' | 'process';
  url?: string;
  data?: any;
  options?: any;
}

interface WorkerResponse {
  success: boolean;
  data?: any;
  error?: string;
}

// Handle messages from main thread
self.onmessage = async (e: MessageEvent<WorkerMessage>) => {
  const { action, url, data, options } = e.data;
  
  try {
    let result: any;
    
    switch (action) {
      case 'fetch':
        result = await handleFetch(url!, options);
        break;
        
      case 'parse':
        result = await handleParse(data);
        break;
        
      case 'process':
        result = await handleProcess(data, options);
        break;
        
      default:
        throw new Error(`Unknown action: ${action}`);
    }
    
    const response: WorkerResponse = {
      success: true,
      data: result
    };
    
    self.postMessage(response);
    
  } catch (error) {
    const response: WorkerResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
    
    self.postMessage(response);
  }
};

/**
 * Fetch data from URL
 */
async function handleFetch(url: string, options?: Record<string, any>): Promise<any> {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers
    }
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  const contentType = response.headers.get('content-type');
  
  if (contentType?.includes('application/json')) {
    return await response.json();
  } else if (contentType?.includes('text/')) {
    return await response.text();
  } else {
    return await response.blob();
  }
}

/**
 * Parse large data sets
 */
async function handleParse(data: any): Promise<any> {
  // Example: Parse CSV data
  if (typeof data === 'string') {
    // Simple CSV parser (for demonstration)
    const lines = data.split('\n');
    const headers = lines[0].split(',');
    
    const parsed = lines.slice(1).map(line => {
      const values = line.split(',');
      const obj: any = {};
      headers.forEach((header, index) => {
        obj[header.trim()] = values[index]?.trim();
      });
      return obj;
    });
    
    return parsed;
  }
  
  return data;
}

/**
 * Process data (e.g., filtering, mapping, reducing)
 */
async function handleProcess(data: any[], options?: any): Promise<any> {
  if (!Array.isArray(data)) {
    return data;
  }
  
  // Example processing operations
  let result = data;
  
  if (options?.filter) {
    result = result.filter(options.filter);
  }
  
  if (options?.map) {
    result = result.map(options.map);
  }
  
  if (options?.sort) {
    result = [...result].sort(options.sort);
  }
  
  // Simulate heavy processing
  if (options?.simulate) {
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  return result;
}

// Export for TypeScript (won't be used at runtime)
export {};
