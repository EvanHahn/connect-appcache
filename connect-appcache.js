/* connect-appcache
   Lovingly made by Evan Hahn.
   Licensed under the Unlicense. */

var buildManifest = require("render-appcache-manifest");

module.exports = function connectAppcache(options, mode) {

	// "Get the manifest" recalculates every time in development.
	var getManifest;
	options.unique || (options.unique = true);
	if (mode === "development") {
		getManifest = function() {
			return buildManifest(options);
		};
	} else {
		var cachedManifest = buildManifest(options);
		getManifest = function() {
			return cachedManifest;
		};
	}

	// Return middleware that returns the manifest (if we ask for it).
	return function connectAppcache(req, res, next) {
		if (req.url !== options.path) {
			next();
		} else {
			var manifest = getManifest();
			res.writeHead(200, {
				"Content-Type": "text/cache-manifest",
				"Content-Length": manifest.length
			});
			res.end(manifest);
		}
	};

};
