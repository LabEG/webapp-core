
/*
 |--------------------------------------------------------------------------
 | Browser-sync config file
 |--------------------------------------------------------------------------
 |
 | For up-to-date information about the options:
 |   http://www.browsersync.io/docs/options/
 |
 | There are more options than you see here, these are just the ones that are
 | set internally. See the website for more info.
 |
 |
 */

const { createProxyMiddleware } = require('http-proxy-middleware');
const proxy = createProxyMiddleware(
    (pathname, req) => pathname.match('^/api'),
    {
        target: "https://labeg.ru",
        secure: false,
        // changeOrigin: true,
        headers: {
            "Authorization": "Basic 111"
        }
    }
);

module.exports = {
    https: true,
    open: false,
    watch: true,
    server: {
        baseDir: "./dist/",
        middleware: [
            proxy,
            {
                route: "/",
                handle: function (req, res, next) {
                    res.writeHead(302, {
                        'Location': '/landing/'
                    });
                    res.end();
                    next();
                }
            }
        ]
    }
};
