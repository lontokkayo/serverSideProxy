const express = require('express');
const fetch = require('node-fetch');
const app = express();
const PORT = 4000;
const httpProxy = require('express-http-proxy');

const { createProxyMiddleware } = require('http-proxy-middleware');


app.use('/jackall', httpProxy('http://jackall.aichikeiki.com', {
    proxyReqPathResolver: function (req) {
        return new Promise(function (resolve, reject) {
            // Modify the path or headers here if necessary
            const modifiedPath = req.originalUrl.replace('/jackall', '');
            resolve(modifiedPath);
        });
    },
    userResDecorator: function (proxyRes, proxyResData, userReq, userRes) {
        // Modify the response here if necessary, for example, remove security headers
        userRes.removeHeader('Content-Security-Policy');
        userRes.removeHeader('X-Frame-Options');
        return proxyResData;
    }
}));

app.use('/rmj', httpProxy('http://control.realmotor.jp', {
    proxyReqPathResolver: function (req) {
        return new Promise(function (resolve, reject) {
            // Modify the path or headers here if necessary
            const modifiedPath = req.originalUrl.replace('/rmj', '');
            resolve(modifiedPath);
        });
    },
    userResDecorator: function (proxyRes, proxyResData, userReq, userRes) {
        // Modify the response here if necessary, for example, remove security headers
        userRes.removeHeader('Content-Security-Policy');
        userRes.removeHeader('X-Frame-Options');
        return proxyResData;
    }
}));

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});



