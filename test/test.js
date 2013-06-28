var assert = require("assert");
require("sugar");

describe("connect-appcache", function() {

	var appcache = require("../connect-appcache");
	var bad = function() { throw new Error("We should never hit this!"); };

	var options;
	var req;
	var res;
	beforeEach(function() {
		var path = "/cache.appcache";
		options = { path: path };
		req = { url: path };
		res = {
			writeHead: function() {},
			end: function() {}
		};
	});

	it("should be a function", function() {
		assert(Object.isFunction(appcache));
	});

	it("should defer when we don't request it", function(done) {
		var cache = appcache(options);
		cache({ url: "/" }, res, done);
	});

	it("should respond with the right headers", function(done) {
		var cache = appcache(options);
		res.writeHead = function(code, data) {
			assert.equal(code, 200);
			assert.equal(data["Content-Type"], "text/cache-manifest");
			assert(Object.isNumber(data["Content-Length"]));
			assert(data["Content-Length"] >= 1);
			done();
		};
		cache(req, res, bad);
	});

	it("should respond with a string", function(done) {
		var cache = appcache(options);
		res.end = function(data) {
			assert(Object.isString(data));
			done();
		};
		cache(req, res, bad);
	});

	it('should put "CACHE MANIFEST" in the response', function(done) {
		var cache = appcache(options);
		res.end = function(data) {
			assert(data.startsWith("CACHE MANIFEST"));
			done();
		};
		cache(req, res, bad);
	});

	it("should fill in all the data", function(done) {
		Object.merge(options, {
			comment: "Lovingly made by Evan Hahn.",
			cache: ["the.js", "other.js"],
			network: ["*", "*/*"],
			fallback: {
				"/": "index.html",
				"/about": "about.html"
			}
		});
		var cache = appcache(options);
		res.end = function(data) {
			var lines = data.lines().compact(true);
			assert.equal(lines[0], "CACHE MANIFEST");
			assert.equal(lines[1], "the.js");
			assert.equal(lines[2], "other.js");
			assert.equal(lines[3], "NETWORK:");
			assert.equal(lines[4], "*");
			assert.equal(lines[5], "*/*");
			assert.equal(lines[6], "FALLBACK:");
			assert.equal(lines[7], "/ index.html");
			assert.equal(lines[8], "/about about.html");
			assert(lines.any("# Lovingly made by Evan Hahn."));
			done();
		};
		cache(req, res, bad);
	});

	xit("should always be the same in production", function() {
	});

	xit("should always be different in development", function() {
	});

});
