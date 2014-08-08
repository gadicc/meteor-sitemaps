Package.describe({
    summary: "functions to easily output valid sitemaps",
    version: "0.0.18"
});

Package.on_use(function (api) {
	if(api.versionsFrom) api.versionsFrom("METEOR-CORE@0.9.0-atm");
	api.use('webapp', 'server');
	api.use('gadicohen:robots-txt@0.0.8', 'server');
	api.add_files('sitemaps.js', 'server');
	
	api.export('sitemaps', 'server');
});
