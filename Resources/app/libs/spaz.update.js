/*
	1. Get current app version
	2. Go online and get newest app version
	3. compare
	4. if new, download new version
	5. update to new version
*/

var Spaz; if (!Spaz) Spaz = {};

if (!Spaz.Update) Spaz.Update = {};

Spaz.Update.descriptorUrl = 'http://funkatron.com/apps/spaz/AIR/UpdateDescriptor.json';

Spaz.Update.descriptorUrlTests = 'http://funkatron.com/apps/spaz/AIR/testbuilds/UpdateDescriptor.json';

Spaz.Update.info = {};



Spaz.Update.go = function() {
	
	Spaz.Update.info.currentVersion = Spaz.Update.getCurrentVersion();
	Spaz.Update.getNewestVersion();
	
	/*
		if (checktestversion) {
			
		}
	*/
	
	
};



/**
 * Retrieves the version of the currently running app
 * @returns the version string
 * @type String
 */
Spaz.Update.getCurrentVersion = function() {

	return Spaz.Sys.getVersion();
	
};






/**
 * Retrieves the newest version string of the app from Spaz.Update.descriptorUrl
 * @returns the version string
 * @type String
 * @see Spaz.Update.descriptorUrl
 */
Spaz.Update.getNewestVersion = function(url) {
	
	if (Spaz.Prefs.get('checkupdate-testversions')) {
		var url = Spaz.Update.descriptorUrlTests
	} else {
		var url = Spaz.Update.descriptorUrl
	}
	
	$.ajax({
		'url': url,
		type: "GET",
		dataType: "json",
	
		complete: function(xhr, rstr) {
			sch.debug('Ajax Update Complete');
			sch.debug(rstr);
			sch.debug(xhr.status);
		},
	
		success: function(data) {
			sch.debug('Success');
			sch.debug(data);
			for(key in data) {
				Spaz.Update.info[key] = data[key]
			}
			
			Spaz.Update.compareVersions(Spaz.Update.info.currentVersion, Spaz.Update.info.newestVersion);
		},
	
		error: function(xhr, rstr) {
			sch.debug('Error getting newest version');
			sch.debug(xhr.responseText);
		},
	});
	
};

/**
 * Compares the current and newest version strings, and returns OLDER, SAME, or NEWER
 * @param String current the current version string
 * @param String newest the newest version string
 * @returns a string: 'OLDER', 'SAME', or 'NEWER'
 * @type String
 */
Spaz.Update.compareVersions = function(current, newest) {
	
	var siteV = {};
	var currV = {};
	
	var newpieces = newest.split('.');
	sch.debug(newpieces);
	siteV.major = parseInt(newpieces[0]);
	siteV.minor = parseInt(newpieces[1]);
	siteV.micro = parseInt(newpieces[2]);
	siteV.builddate = parseInt(newpieces[3]);
	
	sch.debug('SITE VERSION:'+siteV);
	
	var curpieces = current.split('.');
	sch.debug(curpieces);
	currV.major = parseInt(curpieces[0]);
	currV.minor = parseInt(curpieces[1]);
	currV.micro = parseInt(curpieces[2]);
	currV.builddate = parseInt(curpieces[3]);
	
	sch.debug('LOCAL VERSION:'+currV);
	
	Spaz.Update.info.status = 'SAME';
	if (siteV.major > currV.major) {
		Spaz.Update.info.status = 'NEWER';
	} else if (siteV.major < currV.major) {
		Spaz.Update.info.status = 'OLDER';
	} else { // minor could still be bigger
		
		if (siteV.minor > currV.minor) {
			Spaz.Update.info.status = 'NEWER';
		} else if (siteV.minor < currV.minor) {
			Spaz.Update.info.status = 'OLDER';
		} else { // micro could still be bigger
			
			if (siteV.micro > currV.micro) {
				Spaz.Update.info.status = 'NEWER';
			} else if (siteV.micro < currV.micro) {
				Spaz.Update.info.status = 'OLDER';
			} else {
				if (siteV.builddate > currV.builddate) {
					Spaz.Update.info.status = 'NEWER';
				} else if (siteV.builddate < currV.builddate) {
					Spaz.Update.info.status = 'OLDER';
				} else {
					Spaz.Update.info.status = 'SAME';
				}
			}
		}	
	}
	
	sch.debug(Spaz.Update.info.status)
	
	switch (Spaz.Update.info.status) {
		case 'NEWER':
			if (confirm('Hey! There is a new version available: '+Spaz.Update.info.newestVersion+'\nI will download and install it.')) {
				Spaz.Update.downloadNewest(Spaz.Update.info.newestURL)
			}
			break;
		case 'OLDER':
			sch.debug('Your version is newer that the one online!');
			break;
		case 'SAME':
			sch.debug('Your have the newest version available');
			break;
	}
};


Spaz.Update.deleteExisting = function() {
	var existingFile = sch.getFileObject(sch.getAppStorageDir()).resolve("Spaz-Newest.air");
	if (existingFile.exists) {
		sch.dump('Existing file; will now delete')
		existingFile.deleteFile();
	}
};



Spaz.Update.downloadNewest = function(url) {

	// Spaz.Update.deleteExisting();

	var urlReq = new air.URLRequest(url);
	var urlStream = new air.URLStream();
	var fileData = new air.ByteArray();
	urlStream.addEventListener(air.Event.COMPLETE, loaded);
	urlStream.addEventListener(air.ProgressEvent.PROGRESS, progress);
	Spaz.UI.statusBar('Downloading new version…')
	sch.debug("Downloading from "+url);
	urlStream.load(urlReq);
	
	function loaded(event) {
		sch.debug("Loaded...");
		sch.debug(event);
		// sch.dump(urlStream.bytesAvailable);
		urlStream.readBytes(fileData, 0, urlStream.bytesAvailable);
		writeAirFile();
	}


	function progress(event) {
		var percentage = Math.round(event.bytesLoaded/event.bytesTotal*100);
		Spaz.UI.statusBar('Downloading new version '+percentage+'%');
	}

	
	function writeAirFile() {
		sch.debug("Writing File...");
		
		
		var file = sch.getFileObject(sch.getAppStorageDir()).resolve("Spaz-Newest.air");
		
		var fileStream = new air.FileStream();
		fileStream.open(file, air.FileMode.WRITE);
		fileStream.writeBytes(fileData, 0, fileData.length);
		fileStream.close();
		sch.debug("The AIR file is written.");
		Spaz.Update.info.airfile = file;
		
		Spaz.UI.statusBar('New version downloaded');
		
		if (confirm('The new version has been downloaded to \n'+file.nativePath+'\nLet\'s apply it, American Bluejeans!')) {
			Spaz.Update.applyUpdate();
		}
		
	}
	
	return;
};


Spaz.Update.applyUpdate = function() {
	
	/*
		Always save prefs before applying an update
	*/
	Spaz.Prefs.savePrefs();
	
	airUpdater = new air.Updater()
	
	airUpdater.update(Spaz.Update.info.airfile, Spaz.Update.info.newestVersion);
	
	return;
}