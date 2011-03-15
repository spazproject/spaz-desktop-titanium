var Spaz;
if (!Spaz) Spaz = {};

/**
 * localization helper. Not yet implemented; just returns the passed string 
 */
function $L(str) {
	return str;
}

// Spaz.verified = false;
Spaz.startReloadTimer = function() {
	var refreshInterval = Spaz.Prefs.getRefreshInterval();
	sch.debug('started timer with refresh of ' + refreshInterval + ' msecs');
	reloadID = window.setInterval(Spaz.UI.autoReloadCurrentTab, refreshInterval);
	return reloadID;
};

/**
 * this forces a reload of the index.html doc in the HTMLLoader 
 */
Spaz.reloadHTMLDoc = function() {
	window.htmlLoader.load(new air.URLRequest("index.html"));
};

Spaz.stopReloadTimer = function() {
	if (reloadID) {
		window.clearInterval(reloadID);
		sch.debug('stopped timer');
	}
};

Spaz.restartReloadTimer = function() {
	sch.debug('trying to restart timer');
	Spaz.stopReloadTimer();
	Spaz.startReloadTimer();
};

Spaz.createUserDirs = function() {
	var appStore = sch.getFileObject(sch.getAppStorageDir());
	
	var userThemesDir = appStore.resolve(USERDIR_THEMES);
	userThemesDir.createDirectory();

	var userPluginsDir = appStore.resolve(USERDIR_PLUGINS);
	userPluginsDir.createDirectory();

	var userSmileysDir = appStore.resolve(USERDIR_SMILEYS);
	userSmileysDir.createDirectory();

	var userSoundsDir = appStore.resolve(USERDIR_SOUND);
	userSoundsDir.createDirectory();

	sch.debug(userThemesDir.toString());
	sch.debug(userPluginsDir.toString());
	sch.debug(userSmileysDir.toString());
	sch.debug(userSoundsDir.toString());
};


/**
 * loads the user.js file, if it exists, and injects it into the script tag with id='userjs' 
 */
Spaz.loadUserJS = function() {
	var userjsfile = sch.getFileObject(sch.getAppStorageDir()).resolve('user.js');
	
	if (userjsfile.exists()) {
		var userJS = Spaz.Sys.getFileContents(userjsfile.toString());
		$('#userjs').text(userJS);
	} else {
		userjsfile.touch();
		Spaz.Sys.setFileContents(userjsfile.toString(), "/* Edit this file to add your own functionality to Spaz */\n\n");
	}
	
};



Spaz.loadOAuthServices = function() {
	SpazAuth.addService(SPAZCORE_ACCOUNT_TWITTER, {
        authType: SPAZCORE_AUTHTYPE_OAUTH,
        consumerKey: SPAZCORE_CONSUMERKEY_TWITTER,
        consumerSecret: SPAZCORE_CONSUMERSECRET_TWITTER,
        accessURL: 'https://twitter.com/oauth/access_token'
    });
};


/**
 * Bootstraps the app
 */
Spaz.initialize = function() {
	

	sch.debug('root init begin');
	
	/* @TODO find equivalent */
	// window.htmlLoader.navigateInSystemBrowser = false;

	/* @TODO find equivalent */
	// air.NativeApplication.nativeApplication.autoExit = true;
	
	// create user themes and plugins dirs if necessary
	Spaz.createUserDirs();


	/***************************
	 * Load prefs
	 **************************/
	sch.debug('init prefs');
	Spaz.loadOAuthServices();
	Spaz.Prefs.init();
	Spaz.AccountPrefs.init();
	
	// turn on inspector
	if (Spaz.Prefs.get('inspector-enabled')) {
		Spaz.Debug.insertInspectorScripts();
	}
	
	// turn on debugging
	if (Spaz.Prefs.get('debug-enabled')) {
		
		/*
			wrap this to log
		*/
		function wrap(fn) {
			return function(){
				Spaz.Debug.logToFile.apply(this, arguments);
				return fn.apply(this, arguments);
			};
		}
		
		sc.helpers.dump = wrap(sc.helpers.dump);

		sc.setDumpLevel(5);
	}

	// sch.debug('init Sections');
	// Spaz.Section.init();

	
	// Database initialization
	sch.debug("database initialization");
	// Spaz.DB.init();
	
    sch.debug('JazzRecord initialization');
    JazzRecord.adapter = new JazzRecord.TitaniumAdapter({dbFile: "spaz_jr.db"});
    if (Spaz.Prefs.get('debug-enabled')) {
     JazzRecord.debug = true;
    }
    JazzRecord.depth = 0;
    JazzRecord.migrate();
    // JazzRecord.addIndex('tweets', 'twitter_id');
    // JazzRecord.addIndex('twusers', 'twitter_id');
    // JazzRecord.addIndex('twusers', 'screen_name');
    JazzRecord.addIndex('drafts', 'updated_at_unixtime');


    Spaz.TweetsModel = new Tweets();

	// Docking initialization
	sch.debug("docking initialization");
	Spaz.Dock.init();

	
	
	Spaz.Sys.initUserAgentString();
	

	Spaz.Windows.makeSystrayIcon();


	// ***************************************************************
	// Keyboard shortcut handling
	// ***************************************************************
	Spaz.Controller.setKeyboardShortcuts();


	// insert theme CSS links
	Spaz.Themes.init();

	/***************************
	 * Apply prefs
	 **************************/
	window.moveTo(Spaz.Prefs.get('window-x'), Spaz.Prefs.get('window-y'));
	window.resizeTo(Spaz.Prefs.get('window-width'), Spaz.Prefs.get('window-height'));
	$('#username').val(Spaz.Prefs.getUsername());
	// $('#password').val(Spaz.Prefs.getPassword());

	//DONE: Check for Update
	if (Spaz.Prefs.get('checkupdate')) {
		sch.debug('Starting check for update');
		Spaz.Update.go();
		sch.debug('Ending check for update');
	}

	/************************
	 * Other stuff to do when document is ready
	 ***********************/
	Spaz.Sounds.playSoundStartup();
	sch.debug('Played startup sound');

	Spaz.Windows.makeWindowVisible();
	sch.debug('Made window visible');

	Spaz.Windows.setWindowOpacity(Spaz.Prefs.get('window-alpha'));
	Spaz.Windows.enableDropShadow(Spaz.Prefs.get('window-dropshadow')); 
	Spaz.Windows.enableRestoreOnActivate(Spaz.Prefs.get('window-restoreonactivate'));
	Spaz.Windows.enableMinimizeOnBackground(Spaz.Prefs.get('window-minimizeonbackground'));
	
	if (Spaz.Prefs.get('window-minimizeatstartup')) {
		Spaz.Windows.windowMinimize();
	}
	

	/*
		this displays the body
	*/
	// $('body').addClass('visible');

	Spaz.UI.tabbedPanels = new Spry.Widget.TabbedPanels("tabs");

	Spaz.UI.prefsCPG = new Spry.Widget.CollapsiblePanelGroup("prefsCPG", {
		contentIsOpen: false,
		duration: 200
	});

	Spaz.UI.buildToolsMenu();

	// $('.panelmenu form input[title="filter"]').hint();

	$('.TabbedPanelsTab').each(function(i) {
		this.title = this.title + '<br />Shortcut: <strong>CMD or CTRL+' + (parseInt(i, 10) + 1) + '</strong>';
	});
	sch.debug('Set shortcut info in tab titles');


	/*
		set-up window and app events
	*/
	Titanium.API.addEventListener(Titanium.EXIT, Spaz.Windows.onWindowClose);
	// air.NativeApplication.nativeApplication.addEventListener(air.Event.EXITING, Spaz.Windows.onAppExit);
	Titanium.API.addEventListener(Titanium.CLOSE, Spaz.Windows.onWindowClose);
	Titanium.API.addEventListener(Titanium.FOCUSED, Spaz.Windows.onWindowActive);
	Titanium.API.addEventListener(Titanium.UNFOCUSED, Spaz.Windows.onWindowDeactivate);
	
	Spaz.Windows.listenForMove();
	Spaz.Windows.listenForResize();
	
	/*
		Initialize native menus
	*/
	sch.error('Spaz.Menus.initAll()')
	Spaz.Menus.initAll();

	/*
		Set up event delegation stuff
	*/
	sch.error('Spaz.Controller.initIntercept()')
	Spaz.Controller.initIntercept();


	/*
		set-up usernameCompleter
	*/
	sch.error("new usernameCompleter");
	Spaz.uc = new usernameCompleter({
		'usernames':Spaz.Autocomplete.getScreenNames(),
		'hashtags':Spaz.Autocomplete.getHashTags(),
		'displayDiv':'#suggestions',
		'textarea':'#entrybox',
		'maxMatches':15,
		'timeout':100 // timeout in ms before it kicks in
	});
	
	/*
		set-up post panel
	*/
	sch.error("new SpazPostPanel");
	Spaz.postPanel = new SpazPostPanel({
		on_submit:function() {
			this.disable();
			var status = sch.trim(this.getMessageText());
			var auth = Spaz.Prefs.getAuthObject();	
			var twit = new SpazTwit({'auth':auth});
			Spaz.Data.setAPIUrl(twit);
			var source = Spaz.Prefs.get('twitter-source');
			var irt_id = this.irt_status_id;
			twit.update(status, source, irt_id, 
				
				function(data) {
					Spaz.postPanel.reset();
					Spaz.postPanel.enable();

					$('#entrybox')[0].blur();

					if (data[0].text.length == 140) {
						if (Spaz.Prefs.get('sound-enabled')) {
							if (Spaz.Prefs.get('wilhelm-enabled')) {
								Spaz.Wilhelm.start();
								Spaz.UI.statusBar("Wilhelm!");
								Spaz.Sounds.playSoundWilhelm();
							} else {
								sch.dump('not doing Wilhelm because Wilhelm disabled');
							}
						} else {
							sch.dump('not doing Wilhelm because sound disabled');
						}
					} else {
						Spaz.Sounds.playSoundUpdate();
						Spaz.UI.statusBar("Update succeeded");
					}

					// if (Spaz.Prefs.get('services-pingfm-enabled')) {
					//	Spaz.Data.updatePingFM(msg);
					// }

				},
				function(xhr, msg, exc) {
					Spaz.postPanel.enable();
					Spaz.UI.statusBar('Posting failed!');
				}
			);
		}
	});
	Spaz.Drafts.updateCounter();

	/*
		Set up timeline calls to action
	*/
	Spaz.Timelines.toggleNewUserCTAs();

	/*
		About popbox
	*/
	$('#about-version').text("v"+Spaz.Sys.getVersion());


	/*
		initialinze URL shortener
	*/
	var initUrlShortener = function() {
		
		var method;
		
		// get the pref
		var service = Spaz.Prefs.get('url-shortener');
		sch.debug("service is "+ service);
	
			if (service == 'shortie') {
				$('#shorten-custom-hidden').css({display: 'block', visibility: 'visible'});
			}
	
		// populate the dropdown
		for (method in Spaz.Shortlink.services) {
			sch.debug(method);
	
			if (method[0] != '$') {
				if (method == service) {
					$('#url-shortener').append('<option value="'+method+'" selected="selected">'+method+'</option>');
				} else {
					$('#url-shortener').append('<option value="'+method+'">'+method+'</option>');
				}
			}
		}
		
		
		$('#url-shortener').bind('change', function() {
	
			sch.debug($('#url-shortener').val());
			Spaz.Prefs.set('url-shortener', $('#url-shortener').val());
			if ($('#url-shortener').val() != 'shortie') {
				$('#shorten-custom-hidden').css({display: 'none', visibility: 'hidden'});
			} else {
				$('#shorten-custom-hidden').css({display: 'block', visibility: 'visible'});
			}
		});
		
		$('#shorten-original-link').focus();
		$('#shorten-original-link').val('http://');
		$('#shortenLink-form').bind('submit', function() {
		var service = Spaz.Prefs.get('url-shortener');
			sch.debug("service is "+ service);
				var custom = $('#shorten-custom-link').val();
				if (custom != '') {
				Spaz.Shortlink.services[service]($('#shorten-original-link').val(), custom);
				} else {
				Spaz.Shortlink.services[service]($('#shorten-original-link').val());
				}
		});
		
		// sch.debug(air.NativeApplication.nativeApplication.spazPrefs);
	};

	initUrlShortener();

	/*
		initialize Image uploader popbox
	*/
	window.SpazImgUpl = new Spaz.ImageUploader();
	window.SpazImgUpl.init();

	// load User JS file
	Spaz.loadUserJS();

	/*
		load news popup
	*/
	setTimeout(Spaz.Newspopup.build, 3000);
	/*
		if we have a username and password set, trigger an "account_switched" event
		to kick things off
	*/
	if (Spaz.Prefs.getUsername() && Spaz.Prefs.getAccountType()) {
		sch.trigger('account_switched', document, Spaz.Prefs.getCurrentAccount());
	}

	/*
		Initialize indicators of current account
	(function(){
		var account = Spaz.Prefs.getCurrentAccount();
		if(account){
			Spaz.AccountPrefs.updateWindowTitleAndToolsMenu(account.id);
		}
	})();
	*/

	
	sch.debug('ended document.ready()');
};
