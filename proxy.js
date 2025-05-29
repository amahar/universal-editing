const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
const port = 3001;

// Enable CORS for all routes
app.use(cors());

// AEM proxy configuration
const aemProxy = createProxyMiddleware({
  target: 'https://author-p34771-e1278037.adobeaemcloud.com',
  changeOrigin: true,
  pathRewrite: {
    '^/aem': '',
  },
  onProxyRes: (proxyRes) => {
    proxyRes.headers['Access-Control-Allow-Origin'] = '*';
  },
});

// UE proxy configuration
const ueProxy = createProxyMiddleware({
  target: 'https://universal-editor-service.adobe.io',
  changeOrigin: true,
  pathRewrite: {
    '^/ue': '',
  },
  onProxyRes: (proxyRes) => {
    proxyRes.headers['Access-Control-Allow-Origin'] = '*';
  },
});

// Use proxy middleware
app.use('/aem', aemProxy);
app.use('/ue', ueProxy);

// Start server
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Proxy server running at http://localhost:${port}`);
});

fetch('http://localhost:3001/aem/libs/granite/csrf/token.json', { credentials: 'include' })
  .then(res => res.json())
  .then(data => console.log(data));
