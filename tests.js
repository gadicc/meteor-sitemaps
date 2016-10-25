var parseString = Meteor.wrapAsync(Npm.require('xml2js').parseString);
var zlib = Npm.require('zlib');
var http = Npm.require('http');

// Expects a "url" relative to ROOT_URL.
// Inherently validates XML and throws an error if invalid
function fetch(url) {
  var res = HTTP.get(Meteor.absoluteUrl() + url);
  return parseString(res.content);
}

function addAndFetch(data) {
  var url = Random.id();
  sitemaps.config('gzip', false);
  sitemaps.add(url, data);
  return fetch(url);
}

function addAndFetchGzip(data, cb) {
  var route = Meteor.absoluteUrl();
  var url = Random.id();

  sitemaps.config('gzip', true);
  sitemaps.add(url, data);

  http.get(route + url, Meteor.bindEnvironment(function(res) {
    var re = [];

    res.on('data', function(chunk) {
      re.push(Buffer.from(chunk));
    });

    res.on('end', Meteor.bindEnvironment(function() {
      zlib.gunzip(Buffer.concat(re), Meteor.bindEnvironment(function(err, buff) {
        var xml = parseString(buff.toString());

        cb && cb(xml);
      }));

    }));

  }));
}


/* urls */

Tinytest.add('sitemaps - config - sitemaps.config(key, value);', function(test) {
  sitemaps.config('testkey', 123);
  test.equal(sitemaps._config.testkey, 123);
});

Tinytest.add('sitemaps - config - sitemaps.config({key1: value1, key2: value2})', function(test) {
  sitemaps.config({testkey1: 1, testkey2: 2});
  test.equal(sitemaps._config.testkey1, 1);
  test.equal(sitemaps._config.testkey2, 2);
});

Tinytest.add('sitemaps - urls - relative with leading /', function(test) {
  test.equal(sitemaps._prepareUrl('/test'),
    Meteor.absoluteUrl() + 'test');
});

Tinytest.add('sitemaps - urls - relative without leading /', function(test) {
  test.equal(sitemaps._prepareUrl('test'),
    Meteor.absoluteUrl() + 'test');
});

Tinytest.add('sitemaps - urls - uri escaped', function(test) {
  test.equal(sitemaps._prepareUrl('space space.html'),
    Meteor.absoluteUrl() + 'space%20space.html');
});

Tinytest.add('sitemaps - urls - & must be escaped', function(test) {
  test.equal(sitemaps._prepareUrl('?arg1=val1&arg2=val2&arg3=val3'),
    Meteor.absoluteUrl() + '?arg1=val1&amp;arg2=val2&amp;arg3=val3');
});

Tinytest.add('sitemaps - urls - custom root', function(test) {
  var rootUrl = 'http://custom.com/';
  sitemaps.config('rootUrl', rootUrl);
  test.equal(sitemaps._prepareUrl('custom'), rootUrl+'custom');
  sitemaps.config('rootUrl', undefined);
});

Tinytest.add('sitemaps - urls - absolute url', function(test) {
  test.equal(sitemaps._prepareUrl('http://cdn.com/test'),
    'http://cdn.com/test');
});

Tinytest.add('sitemaps - urls - used by loc/xhtml/image/video', function(test) {
  var sitemapUrl = 'usedBy.xml';
  var unescapedUrl = ' ';
  var escapedUrl = Meteor.absoluteUrl() + '%20';

  sitemaps.config('gzip', false);
  sitemaps.add(sitemapUrl, [
    {
      page: unescapedUrl,
      images: [ { loc: unescapedUrl } ],
      videos: [ { loc: unescapedUrl } ],
      xhtmlLinks: [ { href: unescapedUrl } ]
    }
  ]);

  var sitemap = fetch(sitemapUrl);
  var page = sitemap.urlset.url[0];

  test.equal(page.loc[0], escapedUrl);
  test.equal(page['xhtml:link'][0].$.href, escapedUrl);
  test.equal(page['image:image'][0]['image:loc'][0], escapedUrl);
  test.equal(page['video:video'][0]['video:loc'][0], escapedUrl);
});

/* general */

Tinytest.add('sitemaps - README example generates valid sitemap', function(test) {
  sitemaps.config('gzip', false);
  sitemaps.add('/readme.xml', function() {
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

  test.ok(fetch('readme.xml'));
});

Tinytest.add('sitemaps - sitemap+page relative URL with leading /', function(test) {
  sitemaps.config('gzip', false);
  sitemaps.add('/sitemap1.xml', [ { page: '/page2' } ]);
  var sitemap = fetch('sitemap1.xml'); // throws error if /test1.xml isn't served
  var url = sitemap.urlset.url[0].loc[0];
  test.equal(url, Meteor.absoluteUrl('page2'));
});

Tinytest.add('sitemaps - sitemap+page relative URL without leading /', function(test) {
  sitemaps.config('gzip', false);
  sitemaps.add('sitemap2.xml', [ { page: 'page2' } ]);
  var sitemap = fetch('sitemap2.xml'); // throws error if /test1.xml isn't served
  var url = sitemap.urlset.url[0].loc[0];
  test.equal(url, Meteor.absoluteUrl('page2'));
});

/* namespaces */

Tinytest.add('sitemaps - namespaces - xmlns always', function(test) {
  var sitemap = addAndFetch([ { page: 'x' } ]);
  test.equal(sitemap.urlset.$.xmlns, 'http://www.sitemaps.org/schemas/sitemap/0.9');
  test.equal(Object.keys(sitemap.urlset.$).length, 1);
});

Tinytest.add('sitemaps - namespaces - xmlns:xhtml on xhtmlLinks', function(test) {
  var sitemap = addAndFetch([ { page: 'x',
    xhtmlLinks: [ { rel: 'alternate', hreflang: 'en', href: 'xen' } ] } ]);
  test.equal(sitemap.urlset.$['xmlns:xhtml'], 'http://www.w3.org/1999/xhtml');
  test.equal(Object.keys(sitemap.urlset.$).length, 2);
});

Tinytest.add('sitemaps - namespaces - xmlns:image on image', function(test) {
  var sitemap = addAndFetch([ { page: 'x', images: [ { loc: 'ximg' } ] } ]);
  test.equal(sitemap.urlset.$['xmlns:image'],
    'http://www.google.com/schemas/sitemap-image/1.1');
  test.equal(Object.keys(sitemap.urlset.$).length, 2);
});

Tinytest.add('sitemaps - namespaces - xmlns:video on video', function(test) {
  var sitemap = addAndFetch([ { page: 'x', videos: [ { loc: 'xvid' } ] } ]);
  test.equal(sitemap.urlset.$['xmlns:video'],
    'http://www.google.com/schemas/sitemap-video/1.1');
  test.equal(Object.keys(sitemap.urlset.$).length, 2);
});

/* gzip-namespaces */

Tinytest.addAsync('sitemaps-gzip - namespaces - xmlns always', function(test, next) {
  addAndFetchGzip([ { page: 'x' } ], function(xml) {
    test.equal(xml.urlset.$.xmlns, 'http://www.sitemaps.org/schemas/sitemap/0.9');
    test.equal(Object.keys(xml.urlset.$).length, 1);
    next();
  });
});

Tinytest.addAsync('sitemaps-gzip - namespaces - xmlns:xhtml on xhtmlLinks', function(test, next) {
  addAndFetchGzip([{
    page: 'x',
    xhtmlLinks: [ { rel: 'alternate', hreflang: 'en', href: 'xen' } ]
  }], function(xml) {
    test.equal(xml.urlset.$['xmlns:xhtml'], 'http://www.w3.org/1999/xhtml');
    test.equal(Object.keys(xml.urlset.$).length, 2);
    next();
  });
});

Tinytest.addAsync('sitemaps-gzip - namespaces - xmlns:image on image', function(test, next) {
  addAndFetchGzip([ { page: 'x', images: [ { loc: 'ximg' } ] } ], function(xml) {
    test.equal(xml.urlset.$['xmlns:image'],
      'http://www.google.com/schemas/sitemap-image/1.1');
    test.equal(Object.keys(xml.urlset.$).length, 2);
    next();
  });
});

Tinytest.addAsync('sitemaps-gzip - namespaces - xmlns:video on video', function(test, next) {
  addAndFetchGzip([ { page: 'x', videos: [ { loc: 'xvid' } ] } ], function(xml) {
    test.equal(xml.urlset.$['xmlns:video'],
      'http://www.google.com/schemas/sitemap-video/1.1');

    test.equal(Object.keys(xml.urlset.$).length, 2);
    next();
  });
});
