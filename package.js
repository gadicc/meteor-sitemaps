Package.describe({
    summary: "functions to easily output valid sitemaps"
});

Package.on_use(function (api) {
	// TODO, 0.6.4 and below support until 2014
	try {
	    api.use('webapp', 'server');
	}
	catch (error) {
	    if (error.code != 'ENOENT')
	        throw(error);
	}

	api.use('robots-txt', 'server');
	api.add_files('sitemaps.js', 'server');

	// TODO, 0.6.4 and below support until 2014
	if (api.export)
		api.export('sitemaps', 'server');
});
