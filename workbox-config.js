module.exports = {
    "globDirectory": "./",
    "importWorkboxFrom": "local",
    "globIgnores": [
        "node_modules/**/*",
        "package*",
        "workbox-config.js",
        "images/**/*"
    ],
    "runtimeCaching": [{
        "urlPattern": /\.(?:png|gif|jpg|jpeg|svg)$/,
        "handler": "CacheFirst",
        "options": {
            "cacheName": "image-cache"
        }
    }],
    "globPatterns": [
        "**/*.{json,jpg,html,js,css}"
    ],
    "swDest": "sw.js"
};