import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  
  try {
    // Test backend connectivity
    const response = await fetch(`${backendUrl}/api/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (response.ok) {
      const data = await response.json();
      res.status(200).json({
        status: 'Backend is accessible',
        backendUrl,
        backendResponse: data,
      });
    } else {
      res.status(500).json({
        status: 'Backend returned error',
        backendUrl,
        statusCode: response.status,
        statusText: response.statusText,
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 'Failed to connect to backend',
      backendUrl,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
