var Spaz;
if (!Spaz) Spaz = {};

/***********
Spaz.UI
***********/
if (!Spaz.UI) Spaz.UI = {};

// the currently selected tab (should be the element)
Spaz.UI.selectedTab = null;

// widgets
Spaz.UI.tabbedPanels = {};
Spaz.UI.entryBox = {};
Spaz.UI.prefsCPG = {};

// holder
Spaz.UI.tooltipHideTimeout = null;
// holder for the timeoutObject
Spaz.UI.tooltipShowTimeout = null;
// holder for the timeoutObject
// kind of a const
Spaz.UI.mainTimelineId = 'timeline-friends';



Spaz.UI.setTitle = function(msg) {
	var new_title;
	if (msg) {
		new_title = "Spaz – "+msg;
	} else {
		new_title = "Spaz";
	}
	window.document.title = new_title;
};


Spaz.UI.statusBar = function(txt) {
    $('#statusbar-text').html(txt);
};

Spaz.UI.resetStatusBar = function() {
    $('#statusbar-text').html('Ready');
    Spaz.UI.hideLoading();
};

Spaz.UI.flashStatusBar = function() {
    for (var i = 0; i < 3; i++) {
        $('#statusbar-text').fadeOut(400);
        $('#statusbar-text').fadeIn(400);
    }
};

Spaz.UI.showLoading = function() {
    $('#status-text').html('Uploading image…');
    $('#loading').fadeIn(500);
};

Spaz.UI.hideLoading = function() {
    $('#loading').fadeOut(500);
};



Spaz.UI.showPopup = function(panelid) {
    sch.debug('showing ' + panelid + '...');
    $('#' + panelid).css('opacity', 0);
    $('#' + panelid).show();
    $('#' + panelid).fadeTo('fast', 1.0,
    function() {
        sch.debug(panelid + ':fadeIn:' + 'faded in!');
        sch.debug(panelid + ':display:' + $('#' + panelid).css('display'));
        sch.debug(panelid + ':opacity:' + $('#' + panelid).css('opacity'));
    });
    Spaz.UI.centerPopup(panelid);
};
Spaz.UI.hidePopup = function(panelid) {
    sch.debug('hiding ' + panelid + '...');
    $('#' + panelid).fadeTo('fast', 0,
    function() {
        sch.debug('fadeOut:' + 'faded out!');
        sch.debug('fadeOut:' + $('#' + panelid).css('display'));
        sch.debug('fadeOut:' + $('#' + panelid).css('opacity'));
        $('#' + panelid).hide();
    });
};


Spaz.UI.showUpdateCheck = function() {
    Spaz.UI.showPopup('updateCheckWindow');
};
Spaz.UI.hideUpdateCheck = function() {
    Spaz.UI.hidePopup('updateCheckWindow');
};



/**
 *  Wrapper for `jQuery.openDOMWindow` that wipes out appearance defaults.
 *  These should be handled via CSS instead.
 */
Spaz.UI.openDOMWindow = function(options){
	// Close any existing popbox
	(function(){
		function closeDOMWindowCallback(){
			// Stop animations immediately. `stop` arguments:
			// - `false`: Don't clear queue.
			// - `true`:  Jump to end and run callbacks.
			jQuery('#DOMWindow').stop(false, true);
			jQuery('#DOMWindowOverlay').stop(false, true);
		}
		jQuery.closeDOMWindow({
			functionCallOnClose:    closeDOMWindowCallback,
			functionCallAfterClose: closeDOMWindowCallback
		});
	})();

	return jQuery.openDOMWindow($.extend({
		width:          null,
		height:         null,
		borderColor:    null,
		borderSize:     null,
		overlay:        1,
		overlayColor:   null,
		overlayOpacity: null,
		positionType:   'centered',
		windowBGColor:  null,
		windowBGImage:  null,
		windowPadding:  0
	}, options));
};




/**
 *  opens a popbox that contains an iframe displaying the passed URL
 */
Spaz.UI.openPopboxURL = function(url) {
	var cont_width = jQuery('#container').outerWidth();
	Spaz.UI.openDOMWindow({
		windowSource:    'iframe',
		windowSourceURL: url,
		width:           cont_width - 30,
		height:          300
	});

	jQuery('#DOMWindow').outerWidth( cont_width-30 );
};


/**
 *  opens a popbox that contains the contents within the element of the passed ID
 */
Spaz.UI.openPopboxInline = function(content_id) {
	var $body       = jQuery('body'),
	    $domWindow  = jQuery('#DOMWindow'),
	    cont_width  = $body.outerWidth(),
	    cont_height = $body.outerHeight();
	Spaz.UI.openDOMWindow({
		// windowSource:   'inline',
		windowSourceID: content_id,
		// fixedWindowY:   30,
		width:          cont_width - 40,
		height:         cont_height - 100
	});

	$domWindow.outerWidth(cont_width - 30);
	$domWindow.outerHeight(cont_height - 30);

	return false;
};

/**
 * closes the open popbox 
 */
Spaz.UI.closePopbox = function() {
	jQuery.closeDOMWindow();
};


Spaz.UI.showAbout = function() {
    Spaz.UI.openPopboxInline('#aboutWindow');
};
Spaz.UI.showHelp = function() {
    Spaz.UI.openPopboxInline('#helpWindow');
};
Spaz.UI.showShortLink = function() {
    Spaz.UI.openPopboxInline('#shortLinkWindow');
};
Spaz.UI.uploadImage = function(imgurl) {
	Spaz.UI.openPopboxInline('#imageUploadWindow');
	if (imgurl) {
		SpazImgUpl.displayChosenFile(imgurl);
	}
};
Spaz.UI.showCSSEdit = function() {
    this.instance = window.open('app:/html/css_edit.html', 'cssEditWin', 'height=350,width=400');
};




Spaz.UI.pageLeft = function(tabEl) {
    Spaz.UI.page(tabEl, -1);
};
Spaz.UI.pageRight = function(tabEl) {
    Spaz.UI.page(tabEl, 1);
};
Spaz.UI.page = function(tabEl, distance) {
    panel = tabEl.id.replace(/tab/, 'panel');
    sch.debug('Getting page number using \'#' + panel + ' .timeline-pager-number\'');
    var thispage = parseInt($('#' + panel + ' .timeline-pager-number').text());
    sch.debug("Current page:" + thispage);
    sch.debug("Paging distance:" + distance);
    var newpage = thispage + distance;
    sch.debug("New page:" + newpage);
    if (newpage < 1) {
        return;
    }
    Spaz.Data.loadDataForTab(tabEl, false, newpage);
};
Spaz.UI.setCurrentPage = function(tabEl, newpage) {
    panel = tabEl.id.replace(/tab/, 'panel');
    $('#' + panel + ' .timeline-pager-number').html(newpage);
};
Spaz.UI.showEntryboxTip = function() {
    Spaz.UI.statusBar('Logged in as <span class="statusbar-username">' + Spaz.Prefs.getUsername() + '@'+Spaz.Prefs.getCurrentAccountType()+'</span>. ENTER sends.');
};

Spaz.UI.showLocationOnMap = function(location) {
    if (location.length > 0) {
        var url = 'http://maps.google.com/?q=' + encodeURIComponent(location);
        sch.debug("Loading " + url);
        sc.helpers.openInBrowser(url);
    }
};

// Spaz.UI.showPopup = function(contentid) {
//	if (!Spaz.UI.popupPanel) {
//		Spaz.UI.popupPanel = new Spry.Widget.HTMLPanel("mainContent");
//	}
//	Spaz.UI.popupPanel.setContent($('#'+contentid).html());
// }
// Spaz.UI.showWhatsNew = function() {
//	Spaz.UI.popupPanel.loadContent('whatsnew.html');
// }
// taken from ThickBox
// http://jquery.com/demo/thickbox/
Spaz.UI.centerPopup = function(windowid) {
    var jqWin = $('#' + windowid);
    var jqBody = $('#container');

    jqWin.css('margin', 0);

    // WIDTH
    var winWidth = jqWin.outerWidth();
    if (jqBody.width() > winWidth) {
        jqWin.css('left', (jqBody.width() - winWidth) / 2);
    } else {
        // jqWin.width()(jqBody.width() - 20);
        // jqWin.width() = jqWin.width()();
        jqWin.css('left', 0);
    }

    // HEIGHT
    var winHeight = jqWin.outerHeight();
    if (jqBody.height() > winHeight) {
        jqWin.css('top', (jqBody.height() - winHeight) / 2);
    } else {
        // jqWin.width()(jqBody.width() - 20);
        // jqWin.width() = jqWin.width()();
        jqWin.css('top', 0);
    }
    // jqBody.css('border', '1px solid red');
    // jqWin.css('border', '1px solid blue');
    sch.debug("windowid:#" + windowid);
    sch.debug("jqBody.height():" + jqBody.height());
    sch.debug("jqBody.width() :" + jqBody.width());
    sch.debug("jqWin.height() :" + winHeight);
    sch.debug("jqWin.width()  :" + winWidth);
    sch.debug("margin	 :" + jqWin.css('margin'));
    sch.debug("top		 :" + jqWin.css('top'));
    sch.debug("left		 :" + jqWin.css('left'));

};




Spaz.UI.prepMessage = function() {
	//     var eb = $('#entrybox');
	//     eb.val('');
	//     eb[0].setSelectionRange(0, 0);
	// 
	// Spaz.UI.clearPostIRT();
};

Spaz.UI.prepRetweet = function(entryid) {
	// var timelineid = Spaz.UI.selectedTab.id.replace(/tab-/, 'timeline-');
	// // sch.dump(timelineid);
	// // sch.dump('#'+timelineid+'-'+entryid);
	// var entry = $('#'+timelineid+'-'+entryid);
	// // sch.dump(entry.html());
	// var text = entry.children('.entry-text').text();
	// var screenname = entry.children('.entry-user-screenname').text();
	// 
	// var rtstr = 'RT @' + screenname + ': '+text+'';
	// 
	// if (rtstr.length > 140) {
	// 	rtstr = rtstr.substr(0,139)+'…"';
	// }
	// 
	//     var eb = $('#entrybox');
	// eb.focus();
	// eb.val(rtstr);
	// eb[0].setSelectionRange(eb.val().length, eb.val().length);
	// 
	// Spaz.UI.clearPostIRT();

};

Spaz.UI.prepDirectMessage = function(username) {
	//     var eb = $('#entrybox');
	//     eb.focus();
	//     if (username) {
	//         eb.val('d ' + username + ' ...');
	//         eb[0].setSelectionRange(eb.val().length - 3, eb.val().length)
	//     } else {
	//         eb.val('d username');
	//         eb[0].setSelectionRange(2, eb.val().length)
	//     }
	// Spaz.UI.clearPostIRT();
};

Spaz.UI.prepPhotoPost = function(url) {
	//     var eb = $('#entrybox');
	//     eb.focus();
	//     if (url) {
	//         eb.val(url + ' desc');
	//         eb[0].setSelectionRange(eb.val().length - 4, eb.val().length);
	//         return true;
	//     } else {
	//         return false;
	//     }
	// 
	// Spaz.UI.clearPostIRT();

};

Spaz.UI.prepReply = function(username, irt_id) {
	//     var eb = $('#entrybox');
	//     eb.focus();
	// 
	// if (irt_id) {
	// 	var timelineid = Spaz.UI.selectedTab.id.replace(/tab-/, 'timeline-');
	// 	var entry = $('#'+timelineid+'-'+irt_id);
	// 	var text = entry.children('.entry-text').text();
	// 	Spaz.UI.setPostIRT(irt_id, text);
	// }
	// 
	//     if (username) {
	//         var newText = '@' + username + ' ';
	// 
	//         if (eb.val() != '') {
	//             eb.val(newText + eb.val());
	//             eb[0].setSelectionRange(eb.val().length, eb.val().length);
	//         } else {
	//             eb.val('@' + username + ' ...');
	//             eb[0].setSelectionRange(eb.val().length - 3, eb.val().length);
	//         }
	//     } else {
	//         var newText = '@';
	//         if (eb.val() != '') {
	//             eb.val(newText + ' ' + eb.val());
	//         } else {
	//             eb.val('@');
	//         }
	//         eb[0].setSelectionRange(newText.length, newText.length);
	//     }
};



/**
 *
 */
Spaz.UI.setPostIRT = function(status_id, raw_text) {
	// if (raw_text) {
	// 	var status_text = raw_text;
	// 	if (status_text.length > 30) {
	// 		status_text = status_text.substr(0,29)+'…'
	// 	}
	// } else {
	// 	var status_text = 'status #'+status_id;
	// }
	// 
	// // update the GUI stuff
	// $('#irt-message')
	// 	.html(status_text)
	// 	.attr('data-status-id', status_id);
	// $('#irt').fadeIn('fast');
};


/**
 *
 */
Spaz.UI.clearPostIRT = function() {
	// $('#irt').fadeOut('fast');
	// $('#irt-message').html('').attr('data-status-id', '0');
};



/* sends a twitter status update for the current user */
Spaz.UI.sendUpdate = function() {
		//     var entrybox = $('#entrybox');
		// 
		//     if (entrybox.val() != '' && entrybox.val() != Spaz.Prefs.get('entryboxhint')) {
		// 
		//         sch.debug('length:' + entrybox.val().length);
		// 
		// var irt_id = parseInt($('#irt-message').attr('data-status-id'));
		// 
		// if (!Spaz.Prefs.get('twitter-disable-direct-posting')) {
		// 	if ( irt_id > 0 ) {
		// 		Spaz.Data.update(entrybox.val(), Spaz.Prefs.getUsername(), Spaz.Prefs.getPassword(), irt_id);
		// 	} else {
		// 		Spaz.Data.update(entrybox.val(), Spaz.Prefs.getUsername(), Spaz.Prefs.getPassword());
		// 	}
		// } else if (Spaz.Prefs.get('services-pingfm-enabled')) {
		// 	Spaz.Data.updatePingFM( entrybox.val() );
		// } else {
		// 	Spaz.UI.statusBar("Nothing sent! Enable direct posting and/or ping.fm");
		// }
		// 
		// 
		//         // entrybox.val('');
		//     }
};







Spaz.UI.decodeSourceLinkEntities = function(str) {
    str = str.replace(/&gt;/gi, '>');
    str = str.replace(/&lt;/gi, '<');
    return str;
};


Spaz.UI.setSelectedTab = function(tab) {
    if (typeof tab == 'number') {
        // if a # is passed in, get the element of the corresponding tab
        sch.debug('getting tab element for number ' + tab);
        Spaz.UI.selectedTab = Spaz.UI.tabbedPanels.getTabs()[tab];
    } else if (typeof tab == 'string') { // this is an ID
        sch.debug('getting tab element for id ' + tab);
		if (tab.indexOf('#') !== 0) {
			tab = '#'+tab;
		}
		Spaz.UI.selectedTab = $(tab).get(0);
    } else {
        sch.debug('tab element passed in ' + $(tab).attr('id'));
        Spaz.UI.selectedTab = tab;
    }

    sch.debug('Spaz.UI.selectedTab: ' + Spaz.UI.selectedTab.id);

    // sch.debug('restarting reload timer');
    // Spaz.restartReloadTimer();

    Spaz.Data.loadDataForTab(Spaz.UI.selectedTab);
};

/**
 * returns the currently selected tab element
 * @return {DOMElement}
 */
Spaz.UI.getSelectedTab = function() {
    return Spaz.UI.selectedTab;
};


Spaz.UI.reloadCurrentTab = function(force, reset) {
    sch.debug('reloading the current tab');
    Spaz.Data.loadDataForTab(Spaz.UI.getSelectedTab(), force, reset);
};


Spaz.UI.autoReloadCurrentTab = function() {
    sch.debug('auto-reloading the current tab');
    Spaz.Data.loadDataForTab(Spaz.UI.getSelectedTab(), true);
};

Spaz.UI.clearCurrentTimeline = function() {
    sch.debug('clearing the current timeline');
    var tl = Spaz.Timelines.getTimelineFromTab(Spaz.UI.getSelectedTab());

    // reset the lastcheck b/c some timelines will use "since" parameters
	section.lastcheck = 0;
	sch.debug('set lastcheck to 0');
	if (section.lastid) {
		section.lastid = 0;
		sch.debug('set lastid to 0');
	}
	if (section.lastid_dm) {
		section.lastid_dm = 0;
		sch.debug('set lastid_dm to 0');
	}



    if (section.canclear) {
        var timelineid = section.timeline;
        $('#' + timelineid + ' .timeline-entry').remove();
        sch.debug('cleared timeline #' + timelineid);
    } else {
        sch.debug('timeline not clearable');
    }
};


Spaz.UI.markCurrentTimelineAsRead = function() {
    sch.debug('marking current timeline as read');
	sch.debug(Spaz.UI.getSelectedTab().id);
	
    var tl = Spaz.Timelines.getTimelineFromTab(Spaz.UI.getSelectedTab());
    tl.markAsRead();
};


Spaz.UI.toggleTimelineFilter = function() {
	if (!Spaz.cssFilters.currentFilter) {
		Spaz.cssFilters.currentFilter = 'view-friends-menu-all';
	}
	
	if (Spaz.cssFilters.currentFilter !== 'view-friends-menu-all') {
		Spaz.cssFilters.applyFilter('view-friends-menu-all');
	} else {
		Spaz.cssFilters.applyFilter('view-friends-menu-replies-dms');
	}
};



/*
    Remap this function to the new, more OOP-oriented setup
*/
Spaz.UI.showTooltip = function(el, str, previewurl) {

    var opts = {
        'el': el,
        'previewurl': previewurl
    };

    // if (e) { opts['e'] = e }
    if (event) {
        opts.e = event;
    }

    var tt = new Spaz_Tooltip(str, opts);
    tt.show();

};





Spaz.UI.hideTooltips = function() {
    // clear existing timeouts
    var tt = $('#tooltip');

    sch.debug('clearing show and hide tooltip timeouts');
    clearTimeout(Spaz_Tooltip_Timeout);
    clearTimeout(Spaz_Tooltip_hideTimeout);
    tt.stop();
    $('#tooltip .preview').hide();
    tt.hide();
};


Spaz.UI.getViewport = function() {
    return {
        x: $('#container').scrollLeft(),
        y: $('#container').scrollTop(),
        cx: $('#container').width(),
        cy: $('#container').height()
    };
};






Spaz.UI.buildToolsMenu = function(){
	var menuId  = 'tools-menu',
	    menu,
	    $menu   = $('#' + menuId),
	    $toggle = $('#tools-menu-toggle');

	// Build menu
	menu = new SpazMenu({
		base_id:    menuId,
		base_class: 'spaz-menu',
		li_class:   'spaz-menu-item',
		items_func: function(){
			var i, acct, account_class,
			    accts = Spaz.AccountPrefs.spaz_acc._accounts,
			    items = [];

			i = accts.length; while(i--){
				acct = accts[i];
				account_class = 'account_'+acct.id;
        		sch.debug(account_class);        		
				items.unshift({
					label:   acct.username + '@' + acct.type,
					'class': account_class,
					data:    { accountId: acct.id },
					handler: function(e, data){
						Spaz.AccountPrefs.setAccount(data.accountId);
					}
				});
			}

			items = items.concat(
				{
					label:   'Manage accounts…',
					handler: function(){
						Spaz.UI.showPrefs();
						Spaz.UI.openAccountsPrefs();
					}
				},
				null,
				{
					label:   'Send a @-reply…',
					handler: function(){ Spaz.postPanel.prepReply(''); }
				},
				{
					label:   'Send a direct message…',
					handler: function(){ Spaz.postPanel.prepDirectMessage(''); }
				},
				{
					label:   'Upload image…',
					handler: function(){ Spaz.UI.uploadImage(); }
				},
				null,
				{
					label:   'Preferences…',
					handler: function(){ Spaz.UI.showPrefs(); }
				},
				{
					label:   'Help',
					handler: function(){ Spaz.UI.showHelp(); }
				},
				{
					label:   'News &amp; Updates',
					handler: function(){ Spaz.Newspopup.build(true); }
				},
				{
					label:   'About Spaz',
					handler: function(){ Spaz.UI.showAbout(); }
				},
				{
					label:   'Follow @Spaz',
					handler: function(){ Spaz.Data.addFriend('@spaz'); }
				}
			);
			return items;
		}
	});
	menu.bindToggle($toggle.selector, {
		showOpts: {rebuild: true},
			// Rebuild every time. This can be optimized to only rebuild if any
			// account has been modified since the last time the menu was shown.
		afterShow: function(e){
			// Re-select the current account because the menu has been rebuilt
			var account = Spaz.Prefs.getCurrentAccount();
			if(account){
				Spaz.AccountPrefs.updateWindowTitleAndToolsMenu(account.id);
			}
		}
	});

};

Spaz.UI.showLinkContextMenu = function(jq, url) {
    var el = jq[0];

    // hide any showing tooltips
    // sch.dump('hiding tooltip');
    $('#tooltip').hide();

    // show the link context menu
    // sch.dump('opening context menu');
    $('#linkContextMenu').css('left', event.pageX)
    .css('top', event.pageY)
    .unbind()
    .show();


    $('#userContextMenu .menuitem').unbind();

    // sch.dump('outerHTML:'+el.outerHTML);
    var urlarray = /http:\/\/([^'"]+)/i.exec(url);
    if (urlarray && urlarray.length > 0) {
        var elurl = urlarray[0];

        // sch.dump('url from element:'+elurl);
        $('#linkContextMenu-copyLink').one('click', {
            url: elurl
        },
        function(event) {
            Spaz.Sys.setClipboardText(event.data.url);
            // sch.dump('Current Clipboard:'+Spaz.Sys.getClipboardText());
        });
        // sch.dump('Set one-time click event on #menu-copyLink');
        $(document).one('click',
        function() {
            $('#linkContextMenu').hide();
        });
        // sch.dump('set one-time link context menu close event for click on document');
    } else {
        // sch.dump('no http link found');
        }
};







Spaz.UI.selectEntry = function(el) {

    sch.debug('unselected tweets');
    Spaz.UI.deselectAllEntries();


    sch.debug('selecting tweet');
    $(el).addClass('ui-selected').addClass('read').each(function() {
        if (entryId = Spaz.UI.getStatusIdFromElement(this)) {
            sch.dump("Want to mark as read " + entryId);
			var is_dm = false;
			if ($(this).hasClass('dm')) {
				is_dm = true;
			}
			Spaz.DB.markEntryAsRead(entryId, is_dm);
        }
    });

	sch.debug(el);
    sch.debug('selected tweet #' + el.id + ':' + el.tagName + '.' + el.className);

    $(document).trigger('UNREAD_COUNT_CHANGED');

};


Spaz.UI.deselectAllEntries = function() {
    $('div.timeline-entry.ui-selected').removeClass('ui-selected');
};


Spaz.UI.getStatusIdFromElement = function(el) {
	var entryId = $(el).attr('data-status-id');

    if (entryId === null) {
        sch.error("Cannot obtain entry id for entry with DOM id " + this.id);
        return false;
    } else {
        return entryId;
    }
};


/*
	this returns the first matching element that contains the given id
*/
Spaz.UI.getElementFromStatusId = function(id) {
	var element = $('div.timeline-entry[data-status-id="'+id+'"]').get()[0];
	if (element) {
		sch.dump(element.id);
		return element;
	}
	return false;
};



Spaz.UI.markEntryAsRead = function(el) {

    $(el).removeClass('new').addClass('read');

    $(document).trigger('UNREAD_COUNT_CHANGED');

};


Spaz.UI.removeEntry = function(id, is_dm) {
	is_dm = !!is_dm;
	
	if (is_dm) {
		$('div.dm.timeline-entry[data-status-id="'+id+'"]').remove();
	} else {
		$('div.timeline-entry[data-status-id="'+id+'"]').not('.dm').remove();
	}
	
};


Spaz.UI.markFavorite = function(postid) {
	$('.timeline-entry[data-status-id='+postid+']').addClass('favorited');
};

Spaz.UI.markNotFavorite = function(postid) {
	$('.timeline-entry[data-status-id='+postid+']').removeClass('favorited');
};


Spaz.UI.sortTimeline = function(timelineid, reverse, sort_all) {

    /*
        Check the sorting
    */
    var unsorted = false;

    $('#' + timelineid + ' div.timeline-entry').each(function() {

        if ( parseInt($(this).find('div.entry-timestamp').text()) < parseInt($(this).next().find('div.entry-timestamp').text()) ) {
            unsorted = true;
            return false;
        }
    });

    if (unsorted) {
        // if (sort_all) {
        time.start('sortTimeline');
        var cells = $('#' + timelineid + ' div.timeline-entry').remove().get();
        // } else {
        // var cells = $('#'+timelineid+' div.timeline-entry.needs-cleanup');
        // }
        // sch.debug('cells length:'+cells.length);

        if (reverse) {
            $(cells.sort(Spaz.UI.sortTweetElements)).prependTo('#' + timelineid);
        } else {
            $(cells.sort(Spaz.UI.sortTweetElements)).appendTo('#' + timelineid);
        }
        time.stop('sortTimeline');

        // time.report();
        // sch.debug('done sorting');
    }

};



Spaz.UI.sortTweetElements = function(a, b) {
    var inta = parseInt($(a).find('.entry-timestamp').text());
    var intb = parseInt($(b).find('.entry-timestamp').text());
    var diff =  inta - intb;
    return diff;
};



Spaz.UI.reverseTimeline = function(timelineid) {
    var cells = $('#' + timelineid + ' .timeline-entry');
    cells.reverse(true).remove().appendTo('#' + timelineid);
};


Spaz.UI.getUnreadCount = function() {
	var timelineid = Spaz.Timelines.friends.timeline.timeline_container_selector;

	var selector = timelineid + ' div.timeline-entry:visible';

    // // unread count depends on whether or not we're showing everything, or just replies/dms
    // if ($('#' + timelineid).is('.dm-replies')) {
    //     var selector = '#' + timelineid + ' div.timeline-entry.dm, #' + timelineid + ' div.timeline-entry.reply'
    // } else {
    //     var selector = '#' + timelineid + ' div.timeline-entry'
    // }
	var unread_count = $(selector).not('.read').length;

	sch.dump(unread_count);

    return unread_count;
};


Spaz.UI.getNewEntrySelector = function() {
    var timeline_container_selector = Spaz.Timelines.friends.timeline.timeline_container_selector;

    // we change the selector so that messages not showing do not trigger notifications
    if ($(timeline_container_selector).is('.dm-replies')) {
        var selector = timeline_container_selector + ' .new.dm, ' + timeline_container_selector + ' .new.reply:visible';
    } else {
        var selector = timeline_container_selector + ' .new:visible';
    }

    return selector;
};

Spaz.UI.getNewEntryCount = function() {
    return $(Spaz.UI.getNewEntrySelector()).not('.read').length;
};

Spaz.UI.getNewMentionsCount = function() {
	return $(Spaz.UI.getNewEntrySelector()).not('.read').filter('.reply').length;
};

Spaz.UI.getNewDmsCount = function() {
	return $(Spaz.UI.getNewEntrySelector()).not('.read').filter('.dm').length;
};

Spaz.UI.getNewRegularCount = function() {
	return $(Spaz.UI.getNewEntrySelector()).not('.read').not('.reply').not('.dm').length;
};


Spaz.UI.notifyOfNewEntries = function(new_entries) {

	var notify_entries = [];

    $(document).trigger('UNREAD_COUNT_CHANGED');
    sch.debug('notifyOfNewEntries');

	/*
		pare down new_entries to only what we want to be notified of
	*/
	for (var i=0; i < new_entries.length; i++) {
		if (new_entries[i].SC_is_dm && Spaz.Prefs.get('notify-dms')) {
			notify_entries.push(new_entries[i]);
		}
		if (new_entries[i].SC_is_reply && Spaz.Prefs.get('notify-mentions')) {
			notify_entries.push(new_entries[i]);
		}
		if (Spaz.Prefs.get('notify-messages') && !new_entries[i].SC_is_dm && !new_entries[i].SC_is_reply) {
			notify_entries.push(new_entries[i]);
		}
	}

	var new_count = new_entries.length;
    if (notify_entries.length > 0) {

        sch.debug('NewEntries found!');

		if (Spaz.Prefs.get('window-notificationmethod') === 'system') {

			if (!Spaz.Growl) {
				Spaz.Growl = new SpazGrowl('Spaz');
			}
			
			if (Spaz.Prefs.get('notify-totals')) {
				Spaz.UI.notify({
					'title':new_count + " New Messages",
					'message':"There were "+new_count+" new messages found"
				});
			}


			if ( new_count > Spaz.Prefs.get('window-notificationmax')) {
				notify_entries = notify_entries.slice(0, Spaz.Prefs.get('window-notificationmax'));
			}

			
			for (var x=0; x<notify_entries.length; x++) {
				
				var this_entry = notify_entries[x];
				
				if (this_entry.SC_is_dm && Spaz.Prefs.get('notify-dms')) {
					var title = "New DM from "+this_entry.sender.screen_name;
					var text        = this_entry.SC_text_raw;
					var img   = this_entry.sender.profile_image_url;
					Spaz.UI.notify({
						message:  text,
						title:    title,
						icon:     img});
				} else {
					if (this_entry.SC_is_reply && Spaz.Prefs.get('notify-mentions')) {
						var title = "New @mention from "+this_entry.user.screen_name;
						var text        = this_entry.SC_text_raw;
						var img = this_entry.user.profile_image_url;
						Spaz.UI.notify({
							message:  text,
							title:    title,
							icon:     img});

					} else if (Spaz.Prefs.get('notify-messages')) {
						var title = "New message from "+this_entry.user.screen_name;
						var text        = this_entry.SC_text_raw;
						var img = this_entry.user.profile_image_url;
						Spaz.UI.notify({
							message:  text,
							title:    title,
							icon:     img});
					}
				}
				
				
			}

		} else {
			
			var notify_data = {};
			
			notify_data['new_total'] = Spaz.UI.getNewEntryCount();
			
			notify_data['new_mentions'] = Spaz.UI.getNewMentionsCount();
			notify_data['new_dms'] = Spaz.UI.getNewDmsCount();
			notify_data['new_regular'] = Spaz.UI.getNewRegularCount();
			notify_data['new_entries'] = notify_entries;
			
			
			
			// var this_entry = new_entries[0];
			// 
	        sch.debug('Sending notification');
	        var resp = "";
			
			this_entry = new_entries[0];
			
			if (this_entry.SC_is_dm) {
				var screen_name = this_entry.sender.screen_name;
				var text        = this_entry.SC_text_raw;
				var img = this_entry.sender.profile_image_url;
				// growl_opts.identifier = SpazGrowl.NEW_MESSAGE_DM;
			} else {
				if (this_entry.SC_is_reply) {
					var screen_name = this_entry.user.screen_name;
					var text        = this_entry.SC_text_raw;
					var img = this_entry.user.profile_image_url;
					// growl_opts.identifier = SpazGrowl.NEW_MESSAGE_REPLY;
				} else {
					var screen_name = this_entry.user.screen_name;
					var text        = this_entry.SC_text_raw;
					var img = this_entry.user.profile_image_url;
					// growl_opts.identifier = SpazGrowl.NEW_MESSAGE;
				}
			}
			
			var title = 'New Messages';
			
			Spaz.UI.notify({
				message:  text,
				title:    title,
				position: Spaz.Prefs.get('window-notificationposition'),
				icon:     img,
				data:     notify_data
			});

		}

        Spaz.Sounds.playSoundNew();
        Spaz.UI.statusBar('Updates found');

    } else {
        sch.debug('NewEntries NOT found!');
        Spaz.UI.statusBar('No new messages');
    }

};


Spaz.UI.alert = function(message, title) {
    if (!title) {
        title = "Alert";
    }
    Spaz.UI.notify(message, title, null, Spaz.Prefs.get('window-notificationhidedelay'), sch.joinPaths([sch.getAppDir(), 'images/spaz-icon-alpha_48.png']));
};




Spaz.UI.notify = function(opts) {

	opts = sch.defaults({
		message:  'message',
		title:    'title',
		position: null,
		duration: Spaz.Prefs.get('window-notificationhidedelay')*1000,
		icon:     sch.getFileObject(sch.joinPaths([sch.getAppDir(), 'images/spaz-icon-alpha.png'])).toURL(),
		force:    false,
		data:     null,
		template: null,
		onClick:  null,
		onHover:  null
	}, opts);
	
    if (Spaz.Prefs.get('window-shownotificationpopups') || opts.force) {
        // Spaz.Notify.add(message, title, position, duration, icon);

		if (Spaz.Prefs.get('window-notificationmethod') === 'system') {

			if (!Spaz.Growl) {
				Spaz.Growl = new SpazGrowl();
			}

			Spaz.Growl.notify(opts.title, opts.message, {
				icon:opts.icon,
				duration:opts.duration,
				onClick:opts.onClick
			});
			
		} else {
			PurrJS.notify({
				title:    opts.title,
				message:  opts.message,
				icon:     opts.icon,
				duration: opts.duration,
				position: opts.position,
				data:     opts.data,
				template: opts.template,
				onClick:  opts.onClick,
				onHover:  opts.onHover
			});
		}

    } else {
        sch.debug('not showing notification popup - window-shownotificationpopups disabled');
    }
};



/**
 * @param {string|number} index an integer or an ID for the tab 
 */
Spaz.UI.showTab = function(index) {
    Spaz.UI.setSelectedTab(index);
	
	sch.debug('showing tab '+index);
	
	if (typeof index === 'number') {
	    Spaz.UI.tabbedPanels.showPanel(index);		
	} else if (typeof index === 'string') {
	    Spaz.UI.tabbedPanels.showPanel(index);		
	}
};

/**
 * show preferences section 
 */
Spaz.UI.showPrefs = function() {
	var tabid = 'tab-prefs';
	Spaz.UI.setSelectedTab(tabid);
	Spaz.UI.tabbedPanels.showPanel(tabid);
};

/**
 * Open the Accounts panel in the Prefs section
 */
Spaz.UI.openAccountsPrefs = function() {
    Spaz.UI.prefsCPG.openPanel(0);
};



Spaz.UI.focusHandler = function(event) {
    e = event || window.event;
    el = e.srcElement || e.target;

    sch.debug('FOCUS name:' + e.name + ' tagname:' + el.tagName + ' id:' + el.id);
};

Spaz.UI.blurHandler = function(event) {
    e = event || window.event;
    el = e.srcElement || e.target;

    sch.debug('BLUR	 name:' + e.name + ' tagname:' + el.tagName + ' id:' + el.id);
};

Spaz.UI.clickHandler = function(event) {
    e = event || window.event;
    el = e.srcElement || e.target;

    sch.debug('BLUR	 name:' + e.name + ' tagname:' + el.tagName + ' id:' + el.id);
};

Spaz.UI.shortenPostPanelText = function() {
	Spaz.postPanel.textarea.focus();
	Spaz.postPanel.shortenText.call(Spaz.postPanel);
};

Spaz.UI.shortenPostPanelURLs = function() {
	sch.debug('firing entrybox-shortenURLs');
	Spaz.postPanel.textarea.focus();
	Spaz.postPanel.shortenURLs.call(Spaz.postPanel);
};

