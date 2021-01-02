const withCSS = require('@zeit/next-css')

module.exports = withCSS({
    cssLoaderOptions: {
        url: false
    },
    webpackDevMiddleware: config => {
        config.watchOptions.poll = 300;
        return config;
    }
})