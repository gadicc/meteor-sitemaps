sitemaps = {
  list: {}
};

if (typeof Number.lpad === "undefined") {
  Number.prototype.lpad = function(length) {
    "use strict";
    var str = this.toString();
    while (str.length < length) {
      str = "0" + str;
    }
    return str;
  };
}

/*
 * http://en.wikipedia.org/wiki/Site_map
 * http://www.sitemaps.org/index.html
 */

// TODO: 1) gzip, 2) sitemap index + other types + sitemap for old content
var app = typeof WebApp != 'undefined'
        ? WebApp.connectHandlers : __meteor_bootstrap__.app;
app.use(function(req, res, next) {
    "use strict";
		var out, urlStart, pages, urls;

    urls = _.keys(sitemaps.list);
    if (!_.contains(urls, req.url))
      return next();

    urlStart = (req.headers['x-forwarded-proto'] || req.protocol || 'http')
      + '://' + req.headers.host + '/';

		pages = sitemaps.list[req.url];
    if (_.isFunction(pages))
      pages = pages();
    else if (!_.isArray(pages))
      throw new TypeError("sitemaps.add() expects an array or function");

		out = '<?xml version="1.0" encoding="UTF-8"?>\n\n'
			+ '<urlset \n'
      + 'xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n'
      + 'xmlns:xhtml="http://www.w3.org/1999/xhtml">\n\n';

    var w3cDateTimeTS, date;
		_.each(pages, function(page) {

			out += '   <url>\n'
        + '      <loc>' + urlStart + escape(page.page) + '</loc>\n';

      if (page.lastmod) {
        date = new Date(page.lastmod);
        w3cDateTimeTS = date.getUTCFullYear() + '-'
          + (date.getUTCMonth()+1).lpad(2) + '-'
          + date.getUTCDate().lpad(2) + 'T'
          + date.getUTCHours().lpad(2) + ':'
          + date.getUTCMinutes().lpad(2) + ':'
          + date.getUTCSeconds().lpad(2) + '+00:00';
				out += '      <lastmod>' + w3cDateTimeTS + '</lastmod>\n';
      }

      if (page.changefreq)
        out += '      <changefreq>' + page.changefreq + '</changefreq>\n';

      if (page.priority)
        out += '      <priority>' + page.priority + '</priority>\n';

      if (page.xhtmlLinks) {
        if (!_.isArray(page.xhtmlLinks))
          page.xhtmlLinks = [page.xhtmlLinks];
        _.each(page.xhtmlLinks, function(link) {
          out += '      <xhtml:link \n';
          if (link.href)
            link.href = urlStart + escape(link.href);
          for (var key in link)
            out += '        ' + key + '="' + link[key] + '"\n';
          out += '        />\n';
        });
      }

			out	+= '   </url>\n\n';
		});

		out += '</urlset>\n';

		res.writeHead(200, {'Content-Type': 'application/xml'});
		res.end(out, 'utf8');
    return;
});

sitemaps.add = function(url, func) {
  "use strict";
  sitemaps.list[url] = func;
  robots.addLine('Sitemap: ' + process.env.ROOT_URL + url);
};

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