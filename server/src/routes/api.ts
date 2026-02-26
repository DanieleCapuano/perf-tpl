/**
 * API Routes
 */

import { Router, Request, Response, type IRouter } from 'express';

const router: IRouter = Router();

// Sample data endpoint
router.get('/data', (_req: Request, res: Response) => {
  // Simulate some data
  const data = {
    message: 'Hello from API',
    timestamp: new Date().toISOString(),
    items: Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      name: `Item ${i + 1}`,
      value: Math.random() * 100,
    })),
  };
  
  res.json(data);
});

// POST endpoint example
router.post('/data', (req: Request, res: Response) => {
  const { body } = req;
  
  // Process data
  res.json({
    success: true,
    received: body,
    timestamp: new Date().toISOString(),
  });
});

// Large dataset endpoint (for testing worker performance)
router.get('/large-dataset', (req: Request, res: Response) => {
  const size = parseInt(req.query.size as string) || 1000;
  
  const data = Array.from({ length: size }, (_, i) => ({
    id: i + 1,
    name: `Record ${i + 1}`,
    value: Math.random() * 100,
    category: ['A', 'B', 'C'][Math.floor(Math.random() * 3)],
    timestamp: new Date().toISOString(),
  }));
  
  res.json(data);
});

// CPU-intensive endpoint (should be avoided, but useful for testing)
router.get('/compute', (req: Request, res: Response) => {
  const iterations = parseInt(req.query.iterations as string) || 1000000;
  
  let result = 0;
  for (let i = 0; i < iterations; i++) {
    result += Math.sqrt(i);
  }
  
  res.json({
    iterations,
    result,
    message: 'Computation complete',
  });
});

export default router;
