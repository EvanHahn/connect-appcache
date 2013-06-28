connect-appcache
================

Serve an appcache with some middleware.

    appcache = require("connect-appcache")

    cacheOptions =
      path: "/cache.appcache"
      comment: "Lovingly made by Evan Hahn."
      cache: ["the.js", "other.js"]
      network: ["*", "*/*"]
      fallback: { "/": "index.html" }

    if inDevelopmentMode
      app.use(appcache(cacheOptions, "development"))
    else
      app.use(appcache(cacheOptions, "production"))

In development mode, it will rebuild the cache each time. In production mode, it will build the cache once.

Defaults to production mode.

And that is all.
