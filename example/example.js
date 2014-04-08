if (Meteor.isServer) {
  var Pages = new Meteor.Collection('pages');
  if (Pages.find().count() == 0) {
    Pages.insert({ page: 'x', lastmod: new Date().getTime() });
    Pages.insert({ page: '/y', lastmod: new Date().getTime(), changefreq: 'monthly' });
    Pages.insert({ page: 'z', lastmod: new Date(), changefreq: 'monthly', priority: 0.8 });
  }
  
  sitemaps.add('/sitemap.xml', function() {
    // 'page' is reqired
    // 'lastmod', 'changefreq', 'priority', 'xhtmlLinks' are optional.
    return [
      { page: 'x', lastmod: new Date().getTime() },
      { page: '/y', lastmod: new Date(), changefreq: 'monthly' },
      { page: 'z', lastmod: new Date().getTime(), changefreq: 'monthly', priority: 0.8 },
      { page: 'lang/english', xhtmlLinks: [
      	{ rel: 'alternate', hreflang: 'de', href: '/lang/deutsch' },
      	{ rel: 'alternate', hreflang: 'de-ch', href: 'lang/schweiz-deutsch' },
      	{ rel: 'alternate', hreflang: 'en', href: 'lang/english' }
      ]}
    ];
  });

  sitemaps.add('/sitemapDB.xml', function() {
    var out = [], pages = Pages.find().fetch();
    _.each(pages, function(page) {
      out.push({
        page: page.page,
        lastmod: page.lastmod
      });
    });
    return out;
  });
}
