SpazGrowl = function(appname) {
	this.appname = appname || null;
}

SpazGrowl.prototype.notify= function(title, message, opts) {
	if (!opts) { opts = {}; }
	
	
	
	var show = function(title, message, opts) {
		sch.debug(title);
		sch.debug(message);
		sch.debug(opts);

		var not = Titanium.Notification.createNotification();

		console.dir(opts);

		not.setMessage(message);
		not.setIcon(opts.icon||null);
		not.setTimeout(opts.duration||null);
		not.setTitle(title);
		not.setCallback(function () {
			if (opts.onClick) {
				opts.onClick();
			}
		});
		not.show();
	}
	
	
	if (opts.icon && opts.icon.indexOf('http') === 0) {
		
		// var filename = opts.icon.replace(/[^a-zA-Z\._-]/, '_');
		var filename = 'http://a3.twimg.com/profile_images/1230189066/cal_really_small_normal.jpg'.replace(/[^a-zA-Z0-9\._-]/gi, '_');
		
		// first, make a cache dir
		var appDdir = Titanium.Filesystem.getApplicationDataDirectory();
		var cacheDir = Titanium.Filesystem.getFile(appDdir, 'avatar_cache');
		if (!cacheDir.exists()) {
			cacheDir.createDirectory();
		}
		var cacheFile = Titanium.Filesystem.getFile(cacheDir, filename);
		if (!cacheFile.exists()) {
			cacheFile.touch();
		}
		
		var httpClient = Titanium.Network.createHTTPClient();
		httpClient.onload = function() {
			var stream = cacheFile.open(Titanium.Filesystem.MODE_WRITE);
			stream.write(this.responseData);
			stream.close();
			opts.icon = cacheFile.toString();
			// opts.icon = "/Users/coj/Desktop/green normal";
			console.log(opts.icon);
			show(title, message, opts);
		};
		httpClient.open('GET', opts.icon);
		httpClient.send();
	} else {
		show(title, message, opts);
	}
	
};