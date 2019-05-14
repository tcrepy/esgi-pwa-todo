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
        "**/*.{json,jpg,html,js,css}",
        "./node_modules/wcomponent-check-connexion/*",
        "./node_modules/idb/build/esm/index.js",
        "./node_modules/idb/build/esm/chunk.js",
        "./node_modules/lit-element/**/*.js",
        "./node_modules/lit-html/**/*.js",
    ],
    "swDest": "sw.js"
};