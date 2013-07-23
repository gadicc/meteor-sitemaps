## Create valid sitemaps using your own functions

### Quick Start

```bash
mrt add sitemaps
```

1. Create <code>server/sitemaps.js</code> which contains something like:

```js
sitemaps.add('/sitemap.xml', function() {
  // 'page' is reqired
  // 'lastmod', 'changefreq', 'priority' are optional.
  return [
    { page: 'x', lastmod: new Date().getTime() },
    { page: 'y', lastmod: new Date().getTime(), changefreq: 'monthly' },
    { page: 'z', lastmod: new Date().getTime(), changefreq: 'monthly', priority: 0.8 }
  ];
});
```

You can call <code>sitemaps.add()</code> as many times as you like.  More details on the format below.
Note that the <code>url</code> is automatically added to the data served from
<code>/robots.txt</code> (since 0.0.4, using the robots.txt smart package).

### Full Usage

```js
sitemaps.add(url, list);
```

#### URL

The obvious example is <code>/sitemap.xml</code>.  You can call the function
more than once to have many different (types of) sitemaps.  The URL is added
to the output of /robots.txt automatically (since 0.0.4).

Note that the location is [important](http://www.sitemaps.org/protocol.html#location).  A sitemap can only
reference other URLs in it's own path or descendant paths.  e.g. /sitemap.xml
can reference all URLs on the site.  /articles/sitemap.xml can only reference
other pages in the /articles/ directory/path/route.

#### List (Array or Function)

The list can either be an array in the following format, or a function that
returns an array in the following format (e.g. a function that iterates over
information in a Collection).

```js
[
	{
		// Required.  http[s]://sitename.com automatically prepended */
		page: '/pageName',
		// Optional.  Timestamp of when the page was last modified.
		lastmod: new Date().getTime(),
		// Optional.  always, hourly, daily, weekly, monthly, yearly, never
		// http://www.sitemaps.org/protocol.html#changefreqdef
		changefreq: 'monthly',
		// Optional.  http://www.sitemaps.org/protocol.html#prioritydef
		priority: 0.8
	}
]
```

Other options might come soon, e.g. to automatically use routes in your app
to build the sitemap.

#### Example (from Meteorpedia)

```js
	sitemaps.add('/mw_AllPages_sitemap.xml', function() {
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

You can see this output here:
http://www.meteorpedia.com/mw_AllPages_sitemap.xml
