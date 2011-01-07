var Spaz; if (!Spaz) Spaz = {};


if (!Spaz.Sys) Spaz.Sys = {};


Spaz.Sys.getVersion = function() {
	return Titanium.App.getVersion();
};



Spaz.Sys.initUserAgentString = function() {
	sch.error('Spaz.Sys.initUserAgentString NYI');
	// window.htmlLoader.userAgent = 'Mozilla/5.0 (Macintosh; U; Intel Mac OS X; en) AppleWebKit/420+ (KHTML, like Gecko) Spaz/' + Spaz.Sys.getVersion();
};
Spaz.Sys.getUserAgent = function() {
	sch.error('Spaz.Sys.getUserAgent NYI');
	// return window.htmlLoader.userAgent
};
Spaz.Sys.setUserAgent = function(uastring) {
	sch.error('Spaz.Sys.setUserAgent NYI');
	// window.htmlLoader.userAgent = uastring
	// // air.URLRequestDefaults.userAgent = uastring
	// return window.htmlLoader.userAgent
};

Spaz.Sys.initNetworkConnectivityCheck = function() {
	sch.debug('initNetworkConnectivityCheck disabled');

	// var monitor;
	// 
	// var test_url = Spaz.Data.getAPIURL('test');
	// 
	// monitor = new air.URLMonitor( new air.URLRequest( test_url ) );
	// monitor.addEventListener(air.Event.NETWORK_CHANGE, announceStatus);
	// monitor.pollInterval = 30*1000;
	// monitor.start();
	// 
	// function announceStatus(e) {
	// 	sch.debug("Network status change. Current status: " + monitor.available);
	// 	sch.dump("Network status change. Current status: " + monitor.available);
	// }
};


Spaz.Sys.initMemcheck = function() {
	sch.debug('Memcheck disabled');

	// t = new air.Timer(15*1000, 0);
	// t.addEventListener(air.TimerEvent.TIMER, memCheckGC);
	// t.start();
	// 
	// // sch.dump("Running!"+t.running);
	// 
	// function memCheckGC(e) {
	// 	// sch.dump("memcheck event");
	// 	sch.debug("air.System.totalMemory:"+air.System.totalMemory);
	// 	// air.System.gc();
	// 	// sch.dump("post mem:"+air.System.totalMemory);
	// }
};


Spaz.Sys.getRuntimeInfo = function(){
	return ret ={
		os : air.Capabilities.os,
		version: air.Capabilities.version, 
		manufacturer: air.Capabilities.manufacturer,
		totalMemory: air.System.totalMemory,
		
	};
}






Spaz.Sys.getClipboardText = function() {
	if(air.Clipboard.generalClipboard.hasFormat("text/plain")){
	    var text = air.Clipboard.generalClipboard.getData("text/plain");
		return text;
	} else {
		return '';
	}
}

Spaz.Sys.setClipboardText = function(text) {
	sch.debug('Copying "' + text + '" to clipboard');
	air.Clipboard.generalClipboard.clear();
	air.Clipboard.generalClipboard.setData(air.ClipboardFormats.TEXT_FORMAT,text,false);
}


Spaz.Sys.getFileContents = function(path) {
	return sch.getFileContents(path);

};


/*
	@TODO: should really wrap the business end of this in a try/catch
*/
Spaz.Sys.setFileContents = function(path, content, serialize) {
	
	return sch.setFileContents(path, content, serialize);
};



Spaz.Sys.openInBrowser = function(url) {
	sch.debug('opening '+url);
	try {            
	    Titanium.Platform.openURL(url);
	}
	catch (e) {
	    sch.debug(e.errorMsg)
	}
};



Spaz.Sys.openAppStorageFolder = function() {
	Titanium.Platform.openApplication(sch.getAppStorageDir()); 
};



