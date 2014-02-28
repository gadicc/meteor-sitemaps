if (Meteor.isServer) {
  sitemaps.add('/sitemap.xml', function() {
    // 'page' is reqired
    // 'lastmod', 'changefreq', 'priority', 'xhtmlLinks' are optional.
    return [
      { page: 'x', lastmod: new Date().getTime() },
      { page: '/y', lastmod: new Date().getTime(), changefreq: 'monthly' },
      { page: 'z', lastmod: new Date().getTime(), changefreq: 'monthly', priority: 0.8 },
      { page: 'lang/english', xhtmlLinks: [
      	{ rel: 'alternate', hreflang: 'de', href: '/lang/deutsch' },
      	{ rel: 'alternate', hreflang: 'de-ch', href: 'lang/schweiz-deutsch' },
      	{ rel: 'alternate', hreflang: 'en', href: 'lang/english' }
      ]}
    ];
  });
}
