var Spaz; if (!Spaz) Spaz = {};

/***********
Spaz.Prefs
************/
if (!Spaz.Windows) Spaz.Windows = {};

Spaz.Windows.windowExitCalled = false;

Spaz.Windows.getCurrentWindow = function() {
	return Titanium.UI.getCurrentWindow();
};

Spaz.Windows.onWindowActive = function (event) {
	sch.debug('Window ACTIVE');
  // if ($('body').focus()) {}
  $('body').addClass('active');
};


Spaz.Windows.onWindowDeactivate = function(event) {
	Spaz.UI.hideTooltips();
	$('body').removeClass('active');
};


Spaz.Windows.windowMinimize = function() {
	Spaz.Windows.getCurrentWindow().minimize();
	if (Spaz.Prefs.get('window-minimizetosystray') && air.NativeApplication.supportsSystemTrayIcon) {
		Spaz.Windows.getCurrentWindow().hide();
	}
	return false;
};


Spaz.Windows.windowRestore = function() {
	var thisWin = Spaz.Windows.getCurrentWindow();
	sch.debug('restoring window');
	// sch.debug('current window state:'+window.nativeWindow.displayState);
	//sch.debug('id:'+air.NativeApplication.nativeApplication.id);


	// if (window.nativeWindow.displayState == air.NativeWindowDisplayState.MINIMIZED) {
	// 	sch.debug('restoring window');
	//  		nativeWindow.restore();
	//  	}
	sch.debug('restoring window');
	if (thisWin.isMaximized()) {
		thisWin.unmaximize();
	}
	if (thisWin.isMinimized()) {
		thisWin.unminimize();
	}

	sch.debug('activating window');
	thisWin.focus();
};


Spaz.Windows.onAppExit = function(event) {
	var thisWin = Spaz.Windows.getCurrentWindow();
	
	sch.dump('Spaz.Windows.windowExitCalled is '+Spaz.Windows.windowExitCalled);
	// 
	// if (Spaz.Windows.windowExitCalled == false) {
	// 	sch.dump('windowClose was not called');
	// 	Spaz.Windows.windowClose();
	// 	return;
	// }

	Spaz.Prefs.savePrefs();
	
	if (event) {
		sch.dump('onAppExit triggered by event')
		// event.preventDefault();
		// event.stopImmediatePropagation();
	}
	
	// window.nativeWindow.removeEventListener(air.Event.CLOSING, Spaz.Windows.onWindowClose);
	// window.nativeWindow.removeEventListener(air.Event.EXITING, Spaz.Windows.windowClose);
	// air.NativeApplication.nativeApplication.removeEventListener(air.Event.EXITING, Spaz.Windows.onAppExit); 
	sch.dump("i'm exiting the app!");

	// alert('onAppExit');

	

	if (Spaz.Prefs.get('sound-enabled')) {
		Spaz.Sounds.playSoundShutdown(function() {
			Titanium.App.exit();
		});
	} else {
		sch.dump('sound not playing');
		Titanium.App.exit();
	}
	
};


Spaz.Windows.onWindowClose = function(event) {
	sch.dump("i'm closing a window!");
	Spaz.Prefs.savePrefs();
};


/**
* Called when the user closes the main window.
*/
Spaz.Windows.windowClose = function() {
	Spaz.Prefs.savePrefs();
	$('#container').addClass('animation-fadeout');
	sch.dump('calling windowClose');
	Spaz.Windows.windowExitCalled = true;
	Spaz.Windows.onAppExit();
};

/**
 * 
 */
Spaz.Windows.makeSystrayIcon = function() {
	sch.debug('Making Windows system tray menu')
	// air.NativeApplication.nativeApplication.icon.menu = Spaz.Menus.createRootMenu();
	var tray = Titanium.UI.addTray("images/spaz-icon-alpha_16.png", Spaz.Windows.onSystrayClick);
	tray.setHint($L("Spaz loves you"));
};

Spaz.Windows.onSystrayClick = function(event) {
	Spaz.Windows.windowRestore();
	
	// // TODO replace this with call to Spaz.Windows.windowRestore()
	// sch.debug('clicked on systray');
	// sch.debug(nativeWindow.displayState);
	// sch.debug('id:'+air.NativeApplication.nativeApplication.id);
	// 
	// if (nativeWindow.displayState == air.NativeWindowDisplayState.MINIMIZED) {
	// 	sch.debug('restoring window');
	//  		nativeWindow.restore();
	//  	}
	//  	sch.debug('activating application');
	//  	air.NativeApplication.nativeApplication.activate() // bug fix by Mako
	// sch.debug('activating window');
	// nativeWindow.activate();
	// sch.debug('ordering-to-front window');
	// nativeWindow.orderToFront();
};


Spaz.Windows.makeWindowVisible = function(){
	sch.debug("making window visible");
	Spaz.Windows.getCurrentWindow().show();
};


Spaz.Windows.makeWindowHidden = function(){
	sch.debug("making window hidden");
	Spaz.Windows.getCurrentWindow().hide();
};


Spaz.Windows.setWindowOpacity = function(value) {
    percentage = parseInt(value);
    if (isNaN(percentage)) {
        percentage = 100;
    }
    if (percentage < 25) {
        percentage = 25;
    }
    var val = parseInt(percentage) / 100;
    if (isNaN(val)) {
        val = 1;
    } else if (val >= 1) {
        val = 1;
    } else if (val <= 0) {
        val = 1;
    }
	Spaz.Windows.getCurrentWindow().setTransparency(val);
};



Spaz.Windows.windowResize = function(){
	nativeWindow.startResize(air.NativeWindowResize.BOTTOM_RIGHT);
};


Spaz.Windows.listenForMove = function() {
	Spaz.Windows._dragging = false;
	
	var xstart, ystart;
	
	jQuery('h1#header')
		.mousemove(function(event) {
			if (!Spaz.Windows._dragging) {
				return;
			}
			var newX = Titanium.UI.currentWindow.getX() + event.clientX - xstart;
			var newY = Titanium.UI.currentWindow.getY() + event.clientY - ystart;
			Titanium.UI.getMainWindow().moveTo(newX, newY)
		})
		.mousedown(function(event) {
			Spaz.Windows._dragging = true;
			xstart = event.clientX;
			ystart = event.clientY;
		})
		.mouseup(function(event) {
			Spaz.Windows._dragging = false;
			Spaz.Windows.onWindowMove();
		});


};


Spaz.Windows.listenForResize = function() {
	Spaz.Windows._resizing = false;
	
	var xstart, ystart;
	
	jQuery('#resize-sw')
		.mousemove(function(event) {
			if (!Spaz.Windows._resizing) {
				return;
			}

			Titanium.UI.currentWindow.setWidth(Titanium.UI.currentWindow.getWidth() + event.clientX - xstart);
			Titanium.UI.currentWindow.setHeight(Titanium.UI.currentWindow.setHeight() + event.clientY - ystart);
		})
		.mousedown(function(event) {
			Spaz.Windows._resizing = true;
			xstart = event.clientX;
			ystart = event.clientY;
		})
		.mouseup(function(event) {
			Spaz.Windows._resizing = false;
			Spaz.Windows.onWindowResize();
		});
};



Spaz.Windows.resetPosition = function() {
	var thisWin = Spaz.Windows.getCurrentWindow();
	thisWin.setX(Spaz.Prefs.defaultPreferences['window-x']);
	thisWin.setY(Spaz.Prefs.defaultPreferences['window-y']);
	sch.dump(Spaz.Prefs.defaultPreferences['window-x'] +"x"+Spaz.Prefs.defaultPreferences['window-y']);
	sch.dump(thisWin.getX() +"x"+thisWin.getY());
	Spaz.Windows.onWindowMove();
	
	thisWin.setWidth(Spaz.Prefs.defaultPreferences['window-width']);
	thisWin.setHeight(Spaz.Prefs.defaultPreferences['window-height']);
	sch.dump(Spaz.Prefs.defaultPreferences['window-width'] +"x"+Spaz.Prefs.defaultPreferences['window-height']);
	sch.dump(thisWin.getWidth() +"x"+thisWin.getHeight());
	Spaz.Windows.onWindowResize();
};


Spaz.Windows.onWindowResize = function() {
	var thisWin = Spaz.Windows.getCurrentWindow();
	
	if(Spaz.Windows.onWindowResize.prefsTimeout){
		clearTimeout(Spaz.Windows.onWindowResize.prefsTimeout);
		delete Spaz.Windows.onWindowResize.prefsTimeout;
	}
	Spaz.Windows.onWindowResize.prefsTimeout = setTimeout(function(){
		Spaz.Prefs.set('window-width',  thisWin.getWidth());
		Spaz.Prefs.set('window-height', thisWin.getHeight());
	}, 500);
};


Spaz.Windows.onWindowMove = function() {
	var thisWin = Spaz.Windows.getCurrentWindow();
	
	if(Spaz.Windows.onWindowMove.prefsTimeout){
		clearTimeout(Spaz.Windows.onWindowMove.prefsTimeout);
		delete Spaz.Windows.onWindowMove.prefsTimeout;
	}
	Spaz.Windows.onWindowMove.prefsTimeout = setTimeout(function(){
		Spaz.Prefs.set('window-x', thisWin.getX());
		Spaz.Prefs.set('window-y', thisWin.getY());
	}, 500);
};

/**
 * turns the drop shadow on if passed truthy val, else turns it off
 * @param {Boolean} state true or false 
 * @TODO decide if we support this in Titanium
 */
Spaz.Windows.enableDropShadow = function(state) {
	sch.error("Spaz.Windows.enableDropShadow NYI!");
};


/**
 * turns on restore on activate if passed truthy val, else turns it off
 * @param {Boolean} state true or false 
 * @TODO decide if we support this in Titanium
 */
Spaz.Windows.enableRestoreOnActivate = function(state) {
	sch.error("Spaz.Windows.enableRestoreOnActivate NYI!");
	// if (state) {
	// 	air.NativeApplication.nativeApplication.addEventListener('activate', Spaz.Windows.windowRestore);
	// } else {
	// 	air.NativeApplication.nativeApplication.removeEventListener('activate', Spaz.Windows.windowRestore);
	// }
};

/**
 * @TODO decide if we support this in Titanium 
 */
Spaz.Windows.enableMinimizeOnBackground = function(state) {
	sch.error("Spaz.Windows.enableMinimizeOnBackground NYI!");
	// if (state) {
	// 	air.NativeApplication.nativeApplication.addEventListener('deactivate', Spaz.Windows.windowMinimize);
	// } else {
	// 	air.NativeApplication.nativeApplication.removeEventListener('deactivate', Spaz.Windows.windowMinimize);
	// }
};
