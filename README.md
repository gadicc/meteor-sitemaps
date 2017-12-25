# meteor-sitemaps [![Build Status](https://api.travis-ci.org/gadicc/meteor-sitemaps.svg)](https://travis-ci.org/gadicc/meteor-sitemaps)

*Quickly create dynamic ("real-time") sitemaps using your own functions.*

Copyright (c) 2013 by Gadi Cohen <dragon@wastelands.net> and released under the MIT license (see LICENSE.txt).

## Important

**Sitemaps are *dynamic* (generated "on-the-fly" at request time), i.e. *no sitemap.xml file is persisted on disk*.  You can check your sitemap at http://localhost:3000/sitemap.xml (or wherever you defined it).**

The package is intended for moderate use with the latest data from your database.  If you have more than a few hundred pages and/or are crawled at high frequency, you may be better off creating a static sitemap.  PRs to cache recent requests (optionally persisting on disk or elsewhere) are welcome.

## Quick Start

A simple example is shown below, with more complicated examples further down.  

```bash
meteor add gadicohen:sitemaps
```

1. Create `server/sitemaps.js` which contains something like:

```js
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
          thumbnail_loc: "..", title: "..", description: ".." etc }
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
```

You can call `sitemaps.add()` as many times as you like.
More details on the format below.
Note that the `url` is automatically added to the data served from
`/robots.txt` (since 0.0.4, using the robots.txt smart package).

**Important**: The above example uses a brand new Date() for every link.  *This
is just for demonstration purposes*.  Of course you should use the real date
of the last page update (`updatedAt` from the database?).  If you always use
the current time, Google will penalize you (or at the very least, ignore this
field on future crawls).

## Full Usage

```js
// To add a sitemap
sitemaps.add(url, list);

// To compress sitemap as gzip files. Note this will apply to all sitemap files
sitemaps.config('gzip', true/false); // default to false
```

### URL

The obvious example is `/sitemap.xml`.  You can call the function
more than once to have many different (types of) sitemaps.  The URL is added
to the output of /robots.txt automatically (since 0.0.4).

Note that the location is
[important](http://www.sitemaps.org/protocol.html#location).  A sitemap can only
reference other URLs in its own path or descendant paths.  e.g. `/sitemap.xml`
can reference all URLs on the site.  `/articles/sitemap.xml` can only reference
other pages in the `/articles/` directory/path/route.

### List (Array or Function)

The list can either be an array in the following format, or a function that
returns an array in the following format (e.g. a function that iterates over
information in a Collection).

```js
[
  {
    // Required.  http[s]://sitename.com automatically prepended */
    page: '/pageName',
    // Optional.  Timestamp of when the page was last modified.
    lastmod: new Date(),         // or new Date().getTime()
    // Optional.  always, hourly, daily, weekly, monthly, yearly, never
    // http://www.sitemaps.org/protocol.html#changefreqdef
    changefreq: 'monthly',
    // Optional.  http://www.sitemaps.org/protocol.html#prioritydef
    priority: 0.8
    // Optional.  https://support.google.com/webmasters/answer/2620865
    // Again, the base URL is automatically prepended to the href key
    xHtmlLinks: [
      { ref: 'alternate', 'hreflang': 'en', 'href': 'en/blah' },
      { ref: 'alternate', 'hreflang': 'de', 'href': 'de/blah' }
    ],
    // Optional.  https://support.google.com/webmasters/answer/2620865?hl=en
    // Again, the base URL is automatically prepended to the loc key
    images: [
      { loc: '/myImg.jpg' },      // Only loc is required
      { loc: '/myOtherImg.jpg',   // Below properties are optional
        caption: "..", geo_location: "..", title: "..", license: ".."}
    ],
    // Optional.  https://support.google.com/webmasters/answer/80472?hl=en
    // Again, the base URL is automatically prepended to loc, *_loc
    videos: [
      { loc: '/myVideo.jpg' },    // Only loc is required
      { loc: '/myOtherVideo.jpg'  // Below properties are optional
        thumbnail_loc: "..", title: "..", description: "..", etc: ".." }
    ]
  }
]
```

Other options might come soon, e.g. to automatically use routes in your app
to build the sitemap.

### Example (from Meteorpedia)

```js
// To compress all sitemap as gzip file
sitemaps.config('gzip', true);

sitemaps.add('/mw_AllPages_sitemap.xml.gz', function(req) {
  // NOTE: req is the Node request object, use it when you need to retrieve information (host, port, protocol ...)
  // check out more in ./example/example.js

  var out = [], pages = WikiPages.find().fetch();
  _.each(pages, function(page) {
    out.push({
      page: 'read/' + page.name,
      lastmod: page.lastUpdated
    });
  });
  return out;
});
```

You can see this output here: http://www.meteorpedia.com/mw_AllPages_sitemap.xml

### Locations (page, loc, href, etc)

Anywhere where a url can be provided, you can provide a "relative URL" (with
or without a leading /), and Meteor.absoluteUrl() will be prepended.  You
can override this by calling `sitemaps.config('rootUrl', 'myRootUrl')`.  For
individual links, providing an absoluet URL (beginning with `http://` or
`https://`) will avoid this behaviour.  URI components are escaped for you.

## Contributors

Thanks to @zol, @tarang, @dandv, @DirkStevens, @picsoung, @SashaG for various
PRs as listed in [History.md](History.md).
