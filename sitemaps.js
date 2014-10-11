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
var Fiber = Npm.require('fibers');
WebApp.connectHandlers.use(function(req, res, next) {
  new Fiber(function() {
    "use strict";
    var out, pages, urls;
    var urlStart = Meteor.absoluteUrl();

    urls = _.keys(sitemaps.list);
    if (!_.contains(urls, req.url))
      return next();
  
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
        + '      <loc>' + urlStart + escape(page.page.replace(/^\//,'')) + '</loc>\n';

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
            link.href = urlStart + escape(link.href.replace(/^\//,''));
          for (var key in link)
            out += '        ' + key + '="' + link[key] + '"\n';
          out += '        />\n';
        });
      }

      out  += '   </url>\n\n';
    });

    out += '</urlset>\n';

    res.writeHead(200, {'Content-Type': 'application/xml'});
    res.end(out, 'utf8');
    return;
  }).run();
});

sitemaps.add = function(url, func) {
  "use strict";
  
  var root = process.env.ROOT_URL;

  // don't double slash urls
  check(url, String);
  if (process.env.ROOT_URL.slice(-1) == '/' && url[0] == '/')
    root = root.slice(0, -1);

  sitemaps.list[url] = func;
  robots.addLine('Sitemap: ' + root + url);
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
