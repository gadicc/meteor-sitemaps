sitemaps = {
  list: {}
};	

if (typeof Number.lpad === "undefined") {
  Number.prototype.lpad = function(length) {
      var str = this.toString();
      while (str.length < length)
          str = "0" + str;
      return str;
  }
}

/*
 * http://en.wikipedia.org/wiki/Site_map
 * http://www.sitemaps.org/index.html
 */

// TODO: 1) gzip, 2) sitemap index + other types + sitemap for old content
__meteor_bootstrap__.app.use(function(req, res, next) {
		var out, urlStart, pages, d, urls;

    urls = _.keys(sitemaps.list);
    if (!_.contains(urls, req.url))
      return next();

    urlStart = (req.headers['x-forwarded-proto']
        ? req.headers['x-forwarded-proto']
        : req.protocol) + '://' + req.headers.host + '/';

		pages = sitemaps.list[req.url];
    if (_.isFunction(pages))
      pages = pages();
    else if (!_.isArray(pages))
      throw new TypeError("sitemaps.add expects an array or function");

		out = '<?xml version="1.0" encoding="UTF-8"?>\n\n'
			+ '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n\n';

		_.each(pages, function(page) {
			var w3cDateTimeTS, d = new Date(page.lastmod);
			w3cDateTimeTS = d.getUTCFullYear() + '-'
				+ (d.getUTCMonth()+1).lpad(2) + '-'
				+ d.getUTCDate().lpad(2) + 'T'
				+ d.getUTCHours().lpad(2) + ':'
				+ d.getUTCMinutes().lpad(2) + ':'
				+ d.getUTCSeconds().lpad(2) + '+00:00';

			out += '   <url>\n'
				 + '      <loc>' + urlStart + escape(page.page) + '</loc>\n';

      if (page.lastmod)
				out += '      <lastmod>' + w3cDateTimeTS + '</lastmod>\n';

      if (page.changefreq)
        out += '      <changefreq>' + page.changefreq + '</changefreq>\n';

      if (page.priority)
        out += '      <priority>' + page.priority + '</priority>\n';

			out	+= '   </url>\n\n';
		});

		out += '</urlset>\n';

		res.writeHead(200, {'Content-Type': 'application/xml'});
		res.end(out, 'utf8');
    return;
});

sitemaps.add = function(url, func) {
  sitemaps.list[url] = func;
}

/*
sitemaps.add('/sitemap.xml', function() {
  // 'page' is reqired
  // 'lastmod', 'changefreq', 'priority' are optional.
  return [
    { page: 'x', lastmod: new Date().getTime() },
    { page: 'y', lastmod: new Date().getTime(), changefreq: 'monthly' },
    { page: 'z', lastmod: new Date().getTime(), changefreq: 'monthly', priority: 0.8 }
  ];
});
*/