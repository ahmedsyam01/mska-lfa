import React, { useState } from 'react';
import Layout from '../components/Layout/Layout';

const BackendTest: React.FC = () => {
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testBackend = async () => {
    setLoading(true);
    const tests = [];

    // Test 1: Health endpoint
    try {
      const healthResponse = await fetch('https://rimna-backend-production.up.railway.app/api/health');
      tests.push({
        name: 'Health Check',
        url: 'https://rimna-backend-production.up.railway.app/api/health',
        status: healthResponse.status,
        success: healthResponse.ok,
        data: healthResponse.ok ? await healthResponse.json() : await healthResponse.text()
      });
    } catch (error) {
      tests.push({
        name: 'Health Check',
        url: 'https://rimna-backend-production.up.railway.app/api/health',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    // Test 2: Articles endpoint
    try {
      const articlesResponse = await fetch('https://rimna-backend-production.up.railway.app/api/articles');
      tests.push({
        name: 'Articles API',
        url: 'https://rimna-backend-production.up.railway.app/api/articles',
        status: articlesResponse.status,
        success: articlesResponse.ok,
        data: articlesResponse.ok ? await articlesResponse.json() : await articlesResponse.text()
      });
    } catch (error) {
      tests.push({
        name: 'Articles API',
        url: 'https://rimna-backend-production.up.railway.app/api/articles',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    // Test 3: Root backend URL
    try {
      const rootResponse = await fetch('https://rimna-backend-production.up.railway.app/');
      tests.push({
        name: 'Backend Root',
        url: 'https://rimna-backend-production.up.railway.app/',
        status: rootResponse.status,
        success: rootResponse.ok,
        data: rootResponse.ok ? await rootResponse.text() : await rootResponse.text()
      });
    } catch (error) {
      tests.push({
        name: 'Backend Root',
        url: 'https://rimna-backend-production.up.railway.app/',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    setResults(tests);
    setLoading(false);
  };

  return (
    <Layout title="Backend Test - Rimna">
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Backend Connectivity Test</h1>
          
          <button
            onClick={testBackend}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Backend Connection'}
          </button>

          {results && (
            <div className="mt-8 space-y-6">
              {results.map((test: any, index: number) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-semibold mb-2">
                    {test.name} {test.success ? '✅' : '❌'}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">URL: {test.url}</p>
                  {test.status && <p className="text-sm mb-2">Status: {test.status}</p>}
                  
                  {test.success ? (
                    <div>
                      <p className="text-green-600 font-medium mb-2">✅ Success!</p>
                      <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto">
                        {JSON.stringify(test.data, null, 2)}
                      </pre>
                    </div>
                  ) : (
                    <div>
                      <p className="text-red-600 font-medium mb-2">❌ Failed</p>
                      <p className="text-red-500 text-sm">
                        Error: {test.error || 'Unknown error'}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default BackendTest;
