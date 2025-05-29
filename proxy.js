const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
const port = 3001;

// Enable CORS for all routes
app.use(cors());

// Proxy middleware configuration
const aemProxy = createProxyMiddleware({
  target: 'https://author-p34771-e1278037.adobeaemcloud.com',
  changeOrigin: true,
  pathRewrite: {
    '^/aem': '', // remove base path
  },
  onProxyRes: function (proxyRes, req, res) {
    proxyRes.headers['Access-Control-Allow-Origin'] = '*';
    proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS';
    proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';
  },
});

// Proxy middleware configuration for UE service
const ueProxy = createProxyMiddleware({
  target: 'https://universal-editor-service.adobe.io',
  changeOrigin: true,
  pathRewrite: {
    '^/ue': '', // remove base path
  },
  onProxyRes: function (proxyRes, req, res) {
    proxyRes.headers['Access-Control-Allow-Origin'] = '*';
    proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS';
    proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';
  },
});

// Use the proxy middleware
app.use('/aem', aemProxy);
app.use('/ue', ueProxy);

app.listen(port, () => {
  console.log(`Proxy server running at http://localhost:${port}`);
}); 