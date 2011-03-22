var Spaz; if (!Spaz) Spaz = {};

/***********
Spaz.Debug
************/
if (!Spaz.Debug) Spaz.Debug = {};

Spaz.Debug.enable = function() {
	Spaz.Debug.enableLogging(true);
	Spaz.Debug.enableInspector(true);
};

Spaz.Debug.disable = function() {
	Spaz.Debug.enableLogging(false);
	Spaz.Debug.enableInspector(false);
};

Spaz.Debug.setEnable = function(state) {
	if (state) {
		Spaz.Debug.enable();
	} else {
		Spaz.Debug.disable();
	}
};

Spaz.Debug.enableLogging = function(state) {
	Spaz.Prefs.set('debug-enabled', !!state);
}

Spaz.Debug.enableInspector = function(state) {
	Spaz.Prefs.set('inspector-enabled', !!state);
}

Spaz.Debug.dump = function(msg, type) {
	if ( Spaz.Prefs && Spaz.Prefs.get('debug-enabled') ) {
		
		if (!type) {
			type = 'info';
		}

		if (window.console) {
			console.log(msg);
		}

//		window.runtime.trace(msg);
	
		Spaz.Debug.logToFile(msg);
	}
}


Spaz.Debug.logToFile = function(obj, level) {

	var msg = ''
	
	if (!level) { level = SPAZCORE_DUMPLEVEL_DEBUG; }
	
	msg += level + ' : '
	
	if (sc.helpers.isString(obj) || sc.helpers.isNumber(obj) || !obj) {
		msg += obj.toString();
	} else {
		msg += typeof(obj) + ' - ' + sch.enJSON(obj);
	}

	var cr = Titanium.Filesystem.getLineEnding();
	var file   = Titanium.Filesystem.getDocumentsDirectory();
	file       = Titanium.Filesystem.getFile(file, "spaz-debug.log");
	if (!file.exists()) {
		file.touch();
	}
	var stream = file.open(Titanium.Filesystem.MODE_APPEND);
	now = new Date();
	stream.write(now.toString() + ' : ' + msg + cr);
	stream.close();
}



Spaz.Debug.openLogFile = function() {
	var file   = Titanium.Filesystem.getDocumentsDirectory();
	file       = Titanium.Filesystem.getFile(file, "spaz-debug.log");
	alert('file is:\n'+file.toString()+"\n\nI'll open the containing directory for you now");
	Titanium.Platform.openApplication(Titanium.Filesystem.getDocumentsDirectory().toString());
}





Spaz.Debug.showProps = function(obj, objName) {
	sch.dump('dumping '+objName);
	var result = "";
	for (var i in obj) {
	   result += objName + "." + i + " = " + obj[i] + "\n";
	}
	sch.dump(result);
}



Spaz.Debug.dumpHTML = function() {
	return;
	var docsDir = Titanium.Filesystem.getDocumentsDirectory();
	try {
		docsDir.browseForSave("Save HTML As");
		docsDir.addEventListener(air.Event.SELECT, Spaz.Debug.dumpHTMLSelectListener);
	} catch (error) {
		sch.debug("Failed:"+error.message, 'error');
	}
};

Spaz.Debug.dumpHTMLSelectListener = function(event) {
	return;
	var newFile = event.target;
	sch.debug('got newFile '+newFile.toString());
	
	var html = $('html')[0].outerHTML;
	html = html.replace(/app:\/\//, '');
	html = html.replace(/onclick="Spaz\.UI\.setSelectedTab\(this\)"/, '');
	
	sch.debug('got html '.html);

	var stream = new air.FileStream();
	sch.debug('made stream ');
	stream.open(newFile, air.FileMode.UPDATE);
	sch.debug('opened stream '+newFile.toString());
	stream.writeUTFBytes(html);
	sch.debug('write utfbytes '+html);
	stream.close();
	sch.debug('close stream')

}


Spaz.Debug.openInspector = function() {

	Titanium.UI.getCurrentWindow().showInspector(true);
	
};
