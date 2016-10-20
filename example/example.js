if (Meteor.isServer) {
  var Pages = new Meteor.Collection('pages');

  if (Pages.find().count() == 0) {
    Pages.insert({ page: 'x', lastmod: new Date().getTime() });
    Pages.insert({ page: '/y', lastmod: new Date().getTime(), changefreq: 'monthly' });
    Pages.insert({ page: 'z', lastmod: new Date(), changefreq: 'monthly', priority: 0.8 });
  }

  // From README
  sitemaps.add('/sitemap.xml', function() {
    // required: page
    // optional: lastmod, changefreq, priority, xhtmlLinks, images, videos
    return [
      { page: '/x', lastmod: new Date() },
      { page: '/y', lastmod: new Date(), changefreq: 'monthly' },
      { page: '/z', lastmod: new Date().getTime(), changefreq: 'monthly', priority: 0.8 },
      // https://support.google.com/webmasters/answer/178636?hl=en
      { page: '/pageWithViedeoAndImages',
        images: [
          { loc: '/myImg.jpg', },        // Only loc is required
          { loc: '/myOtherImg.jpg',      // Below properties are optional
            caption: "..", geo_location: "..", title: "..", license: ".."}
        ],
        videos: [
          { loc: '/myVideo.jpg', },      // Only loc is required
          { loc: '/myOtherVideo.jpg',    // Below properties are optional
            thumbnail_loc: "..", title: "..", description: "..", etc: '..' }
        ]
      },
      // https://support.google.com/webmasters/answer/2620865?hl=en
      { page: 'lang/english', xhtmlLinks: [
        { rel: 'alternate', hreflang: 'de', href: '/lang/deutsch' },
        { rel: 'alternate', hreflang: 'de-ch', href: '/lang/schweiz-deutsch' },
        { rel: 'alternate', hreflang: 'en', href: '/lang/english' }
      ]}
    ];
  });

  var getFullLink = function(req) {
    if (!req) {
      return '';
    }

    var headers = req.headers;

    var host = headers && headers.host;

    var protocol = headers && headers['x-forwarded-proto'];

    if (protocol && protocol.match((/^https/))) {
      protocol = 'https://';
    } else {
      protocol = 'http://';
    }

    return protocol + host;
  };

  sitemaps.add('/sitemapDB.xml', function(req) {
    // NOTE: to get the exact domain, in case you have a multiple-domain app
    const fullLink = getFullLink(req);

    out.push({
      page: fullLink + '/',
    })

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
