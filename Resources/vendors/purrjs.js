
PurrJS = {};

 /*
	 modal
 */
PurrJS.modal = function(title, msg, icon, duration, position) {
	
	console.log('PurrJS.modal NYI');
	return;
	
	var width  = 400;
	var height = 300;
	
	var padding = 0;
	
	var farRight = air.Screen.mainScreen.bounds.right;
	var farTop   = air.Screen.mainScreen.bounds.top;
	
	var winX = farRight - width - padding;
	var winY = 0 + padding + 20;
	
	var opts = new air.NativeWindowInitOptions();
	opts.transparent = true;
	opts.type = air.NativeWindowType.UTILITY;
	opts.systemChrome = air.NativeWindowSystemChrome.NONE;
	opts.resizable = false;
	opts.minimizable = false;
	opts.maximizable = false;
	
	var winBounds = new air.Rectangle(winX, winY, width, height);
	var notifyLoader = air.HTMLLoader.createRootWindow(true, opts, false, winBounds);
	notifyLoader.load(new air.URLRequest("app:/html/modal.html"));
	notifyLoader.alpha = 0.6;


	fadeIn();
	var fadeOutTimeout = setTimeout(fadeOut, 8000);
	
	
	
	function fadeIn() {
		
		notifyLoader.alpha = 0;
		
		// start
		opacityUp();
		
		function opacityUp() {
			notifyLoader.alpha += 0.1;
			if (notifyLoader.alpha < 1) {
				setTimeout(opacityUp, 30); // do again
			}
		}
		
		
	}
	
	function fadeOut() {
		notifyLoader.alpha = 1;
		
		clearTimeout(fadeOutTimeout);
		
		// start
		opacityDown();
		
		function opacityDown() {
			notifyLoader.alpha -= 0.1;
			if (notifyLoader.alpha > 0 && opacityDown) {
				setTimeout(opacityDown, 30); // do again
			} else {
				notifyLoader.window.nativeWindow.close();
				notifyLoader = null;
			}
		}
		
	}
	
	
};







/*
   notify
*/
PurrJS.notify = function(opts) {
	
	console.log('PurrJS.notify NYI');
	
	
	opts = sch.defaults({
		'title':   'opts.title',
		'message': 'opts.message',
		'icon':    'opts.icon',
		'duration':6000, // in ms
		'position':'topRight',
		'height':  160,
		'width':   300,
		'padding': 0,
		'data':    null,
		'template':null,
		'onClick' :null,
		'onHover' :null
	}, opts);

	
	/*
	  Size of window
	*/
	var width  = opts.width;
	var height = opts.height;
	
	/*
	  padding from screen edges
	*/
	var padding = opts.padding;
	
	/*
	  get dimensions
	*/
	var farRight  = screen.availWidth-20;
	var farTop    = 20;
	var farLeft   = 20;
	var farBottom = screen.availHeight-20;
	
	/*
	  Calculate position
	*/
	var winX, winY;
	switch (opts.position) {
		case 'topLeft':
			winX = farLeft + padding;
			winY = farTop + padding + 0;
			break;

		case 'bottomLeft':
			winX = farLeft + padding;
			winY = farBottom - height - padding - 0;
			break;
		
		case 'bottomRight':
			winX = farRight - width - padding;
			winY = farBottom - height - padding - 0;
			break;
		
		default:
			winX = farRight - width - padding;
			winY = farTop + padding + 0;
			break;
	}
	sch.dump(winX+"x"+winY);
	/*
	  Create window
	*/
	var notify_url = "app://html/notify.html?json="+encodeURIComponent(sch.enJSON(opts));
	var winopts = {
		'transparentBackground' : true,
		'chrome' : false,
		'resizable' : false,
		'minimizable' : false,
		'maximizable' : false,
		'width'       : width,
		'height'       : height,
		'x'       : winX,
		'y'       : winY,
		'topmost'   : true,
		'visible': true,
		'url': notify_url
	};
	
	var notifyWin = Titanium.UI.createWindow(winopts);
	notifyWin.open();

};
