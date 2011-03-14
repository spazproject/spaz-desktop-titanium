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
	//	sch.debug('restoring window');
	//			nativeWindow.restore();
	//		}
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
	//	sch.dump('windowClose was not called');
	//	Spaz.Windows.windowClose();
	//	return;
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
	var tray = Titanium.UI.addTray("images/spaz-icon-alpha_16.png", Spaz.Windows.onSystrayClick);
	tray.setHint($L("Spaz loves you"));
};

Spaz.Windows.onSystrayClick = function(event) {
	Spaz.Windows.windowRestore();
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
	/*
	* See https://gist.github.com/785158
	Bullet Proof window drag

	This is the most performant window dragging code
	I could come up with. All the example on
	developer.appcelerator.com we laggy

	Version 2: More contained version
	*/

	var toolbarHandle = document.getElementById('header');

	toolbarHandle.addEventListener('mousedown', function (e){
		var isDragging = true;
		var mousePosition = {x:event.clientX, y:event.clientY};

		document.addEventListener('mousemove', drag, false);
		document.addEventListener('mouseup', function (e){
			document.removeEventListener('mousemove', drag, false);
			document.removeEventListener('mouseup', arguments.callee, false);
		}, false);


		function drag(event) {
			var wnd = Titanium.UI.currentWindow;
			var curentPosition = {x:wnd.getX(), y:wnd.getY()};

			curentPosition.x += event.clientX - mousePosition.x;
			curentPosition.y += event.clientY - mousePosition.y;
			wnd.moveTo(curentPosition.x, curentPosition.y);
			Spaz.Windows.onWindowMove();
		}
		event.stopPropagation();
	}, false);

};


Spaz.Windows.listenForResize = function() {
	var resizeHandle = document.getElementById('resize-se');

	resizeHandle.addEventListener('mousedown', function (e){
		var isDragging = true;
		var mousePosition = {x:event.clientX, y:event.clientY};

		document.addEventListener('mousemove', drag, false);
		document.addEventListener('mouseup', function (e){
			document.removeEventListener('mousemove', drag, false);
			document.removeEventListener('mouseup', arguments.callee, false);
		}, false);


		function drag(event) {
            // console.log("firing drag", event.clientX, event.clientY);
			var wnd = Titanium.UI.currentWindow;
			wnd.setBounds({'x':wnd.getX(), 'y':wnd.getY(), 'width':event.clientX, 'height':event.clientY});
            Spaz.Windows.onWindowResize();
	        return;
		}
        event.stopPropagation();
	}, false);
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
		Spaz.Prefs.set('window-width',	thisWin.getWidth());
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
	//	air.NativeApplication.nativeApplication.addEventListener('activate', Spaz.Windows.windowRestore);
	// } else {
	//	air.NativeApplication.nativeApplication.removeEventListener('activate', Spaz.Windows.windowRestore);
	// }
};

/**
 * @TODO decide if we support this in Titanium 
 */
Spaz.Windows.enableMinimizeOnBackground = function(state) {
	sch.error("Spaz.Windows.enableMinimizeOnBackground NYI!");
	// if (state) {
	//	air.NativeApplication.nativeApplication.addEventListener('deactivate', Spaz.Windows.windowMinimize);
	// } else {
	//	air.NativeApplication.nativeApplication.removeEventListener('deactivate', Spaz.Windows.windowMinimize);
	// }
};
