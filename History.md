## vNEXT

## v0.0.26 (2016-10-25)

* GZIP compression support.  Big thanks to @nlhuykhang, this has been on the
  TODO list for a long time.  See the README for instructions and examples,
  but in short, `sitemaps.config('gzip', true)`.  This will probably be the
  default in the future.  (#48, #43)

* Sitemap `Content-Type` now explicitly specifies `charset=UTF-8`.

## v0.0.25 (2016-10-20)

* Pass `req` object to `.add()` callback, useful for dealing with multi-domain
  apps.  thanks @nlhuykhang (#47)

## v0.0.24 (2016-03-14)

* api.use('underscore') to work in Meteor 1.2+ and avoid conflicts with
  globally installed lodash (if it exists).

## v0.0.23 (2015-08-28)

* Release under MIT license.

## v0.0.22 (2015-Jul-10)

* Escape & in loc tag (must be &amp; in XML) - fixes #29

## v0.0.21 (2015-Apr-22)

* Use encodeURI() enstead of escape() - thanks @picsoung (#24)
* Allow custom ROOT_URLs - thanks @picsoung (#25)
* New sitemaps.config(key, value) and sitemaps.config({key1: value1, etc})
* New sitemaps.config('rootUrl', myRootUrl) to configure ROOT_URL (#26)
* Don't prepend ROOT_URL on absolute URLS (#27)
* Bump robots-txt from 0.0.8 to 0.0.9
* Add dependency on check package - thanks @SashaG (#28)
* Finally added a comprehensive test suite :)

## v0.0.20 (2014-Nov-06)

* Support for images, thanks @DirkStevens (#22)
* SUpport for videos
* Clean up indentation, refactor URL escaping, images/videos

## v0.0.19 (2014-Oct-11)

* Whitespace per Meteor standards, thanks @dandv (#15, #16)
* Use Meteor.absoluteUrl() to generate URLs (#17).

## v0.0.18 (2014-Aug-08)

* Typos, spacing, quote, etc... thanks @dandv (#12)
* Upload to Meteor 0.9.x package server, thanks @tarang (#11, #14)

## v0.0.17 (2014-Jul-17)

* Multiple protocols reported by reverse proxy (closes #10, thanks tarangp!)

## v0.0.16 (2014-Apr-08)

* Fix documentation to not require `.getTime()` on `new Date()`
* Run user code in a Fiber so Collection calls work (#5)
* Removed < 0.6.5 support :)
* What happened in 0.0.15? :)

## v0.0.14 (2014-Feb-19)

* Fix for double slash issue, thanks @zol (#3)

## v0.0.13 (2014-Jan-24)

* Support for rel="alternate" and hreflang="x" (#2)
