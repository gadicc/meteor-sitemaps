## vNEXT

## v0.0.21

* Use encodeURI() enstead of escape() - thanks @picsoung (#24)
* Allow custom ROOT_URLs - thanks @picsoung (#25)
* New sitemaps.config(key, value) and sitemaps.config({key1: value1, etc})
* New sitemaps.config('rootUrl', myRootUrl) to configure ROOT_URL (#26)
* Don't prepend ROOT_URL on absolute URLS (#27)
* Bump robots-txt from 0.0.8 to 0.0.9
* Add dependency on check package - thanks @SashaG (#28)
* Finally added a comprehensive test suite :)

## v0.0.20

* Support for images, thanks @DirkStevens (#22)
* SUpport for videos
* Clean up indentation, refactor URL escaping, images/videos

## v0.0.19

* Whitespace per Meteor standards, thanks @dandv (#15, #16)
* Use Meteor.absoluteUrl() to generate URLs (#17).

## v0.0.18

* Typos, spacing, quote, etc... thanks @dandv (#12)
* Upload to Meteor 0.9.x package server, thanks @tarang (#11, #14)

## v0.0.17

* Multiple protocols reported by reverse proxy (closes #10, thanks tarangp!)

## v0.0.16

* Fix documentation to not require `.getTime()` on `new Date()`
* Run user code in a Fiber so Collection calls work (#5)
* Removed < 0.6.5 support :)
* What happened in 0.0.15? :)

## v0.0.14

* Fix for double slash issue, thanks @zol (#3)

## v0.0.13

* Support for rel="alternate" and hreflang="x" (#2)
