const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
const port = 3001;

// Enable CORS for all routes
app.use(cors({
  origin: true,
  credentials: true,
}));

// AEM proxy configuration
const aemProxy = createProxyMiddleware({
  target: 'https://author-p34771-e1278037.adobeaemcloud.com',
  changeOrigin: true,
  secure: false, // Allow self-signed certificates
  pathRewrite: {
    '^/aem': '',
  },
  onProxyReq: (proxyReq, req) => {
    // Log the request details
    // eslint-disable-next-line no-console
    console.log('=== Request Details ===');
    // eslint-disable-next-line no-console
    console.log(`Method: ${req.method}`);
    // eslint-disable-next-line no-console
    console.log(`URL: ${req.url}`);
    // eslint-disable-next-line no-console
    console.log('Headers:', JSON.stringify(req.headers, null, 2));
    // eslint-disable-next-line no-console
    console.log('Cookies:', req.headers.cookie);

    // Forward cookies
    if (req.headers.cookie) {
      // Split cookies and decode them
      const cookies = req.headers.cookie.split(';').map((cookie) => {
        const [name, value] = cookie.trim().split('=');
        return `${name}=${decodeURIComponent(value)}`;
      }).join('; ');

      proxyReq.setHeader('Cookie', cookies);
    }
  },
  onProxyRes: (proxyRes, req) => {
    // Log the response details
    // eslint-disable-next-line no-console
    console.log('=== Response Details ===');
    // eslint-disable-next-line no-console
    console.log(`Status: ${proxyRes.statusCode}`);
    // eslint-disable-next-line no-console
    console.log('Headers:', JSON.stringify(proxyRes.headers, null, 2));

    // Set CORS headers
    proxyRes.headers['Access-Control-Allow-Origin'] = req.headers.origin || '*';
    proxyRes.headers['Access-Control-Allow-Credentials'] = 'true';

    // Forward cookies from AEM
    if (proxyRes.headers['set-cookie']) {
      proxyRes.headers['set-cookie'] = proxyRes.headers['set-cookie'].map((cookie) => cookie.replace(/Domain=.*?;/, 'Domain=localhost;'));
    }
  },
  onError: (err, req, res) => {
    // eslint-disable-next-line no-console
    console.error('Proxy Error:', err);
    res.status(500).json({ error: 'Proxy Error', message: err.message });
  },
});

// UE proxy configuration
const ueProxy = createProxyMiddleware({
  target: 'https://universal-editor-service.adobe.io',
  changeOrigin: true,
  secure: false,
  pathRewrite: {
    '^/ue': '',
  },
  onProxyReq: (proxyReq, req) => {
    // Log the request
    // eslint-disable-next-line no-console
    console.log(`Proxying request to UE: ${req.method} ${req.url}`);

    // Forward cookies
    if (req.headers.cookie) {
      proxyReq.setHeader('Cookie', req.headers.cookie);
    }
  },
  onProxyRes: (proxyRes, req) => {
    // Log the response
    // eslint-disable-next-line no-console
    console.log(`Received response from UE: ${proxyRes.statusCode}`);

    // Set CORS headers
    proxyRes.headers['Access-Control-Allow-Origin'] = req.headers.origin || '*';
    proxyRes.headers['Access-Control-Allow-Credentials'] = 'true';

    // Forward cookies from UE
    if (proxyRes.headers['set-cookie']) {
      proxyRes.headers['set-cookie'] = proxyRes.headers['set-cookie'].map((cookie) => cookie.replace(/Domain=.*?;/, 'Domain=localhost;'));
    }
  },
  onError: (err, req, res) => {
    // eslint-disable-next-line no-console
    console.error('Proxy Error:', err);
    res.status(500).json({ error: 'Proxy Error', message: err.message });
  },
});

// Add a test endpoint
app.get('/test', (req, res) => {
  res.json({ status: 'Proxy server is running' });
});

// Use proxy middleware
app.use('/aem', aemProxy);
app.use('/ue', ueProxy);

// Start server
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Proxy server running at http://localhost:${port}`);
  // eslint-disable-next-line no-console
  console.log('Test the proxy with:');
  // eslint-disable-next-line no-console
  console.log('  - http://localhost:3001/test');
  // eslint-disable-next-line no-console
  console.log('  - http://localhost:3001/aem/libs/granite/csrf/token.json');
});
