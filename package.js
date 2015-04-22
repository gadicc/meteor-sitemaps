Package.describe({
	name: "gadicohen:sitemaps",
  summary: "functions to easily output valid sitemaps",
  version: "0.0.21",
  git: 'https://github.com/gadicc/meteor-sitemaps.git'
});

Package.on_use(function (api) {
  if(api.versionsFrom)
  	api.versionsFrom("METEOR@0.9.0");

  api.use('webapp', 'server', 'check');
  api.use('gadicohen:robots-txt@0.0.8', 'server');

  api.add_files('sitemaps.js', 'server');
  api.export('sitemaps', 'server');
});
