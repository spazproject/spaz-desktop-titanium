var Spaz; if (!Spaz) Spaz = {};
if (!Spaz.Menus) Spaz.Menus = {};


// Spaz.Menus.methods = new object{
// 	'Preferences…':			Spaz.Menu.menus.prefs,
// 	'Reload current timeline': 	Spaz.Menu.menus.reload, 
// }


/**
 * @TODO NYI for titanium 
 */
Spaz.Menus.initAll = function() {
	sch.error("Spaz.Menus.initAll NYI");

	sch.debug('Create Native context Menus');
	var ctx = Titanium.UI.createMenu();

	ctx.appendItem(Titanium.UI.createMenuItem(
			'Reload current timeline', Spaz.Menus.menuReload));
	ctx.appendItem(Titanium.UI.createMenuItem(
			'Clear current timeline', Spaz.Menus.menuClearTimeline));
	ctx.appendItem(Titanium.UI.createMenuItem(
			'Preferences', Spaz.Menus.menuPrefs));
	ctx.appendItem(Titanium.UI.createMenuItem(
			'Reset Position', Spaz.Windows.resetPosition));
	ctx.appendItem(Titanium.UI.createMenuItem(
			'About Spaz', Spaz.Windows.showAbout));
	ctx.appendItem(Titanium.UI.createMenuItem(
			'Provide Feedback', Spaz.Menus.menuFeedback));
	ctx.appendItem(Titanium.UI.createMenuItem(
			'Help', Spaz.UI.showHelp));
	ctx.appendItem(Titanium.UI.createMenuItem(
			'Check for updates', function () {
				Spaz.Update.updater.checkForUpdate();
			}));

	Titanium.UI.setContextMenu(ctx);
	return;

	// Seems really crappy on OSX; doesn't merge these with the
	// default menus created by the runtime, so you get two Window menus
	// for instance.
	//
	var menu = Titanium.UI.createMenu();

	var file = Titanium.UI.createMenuItem('Window');
	file.addItem('Reset Position', Spaz.Windows.resetPosition);
	menu.appendItem(file);

	Titanium.UI.setMenu(menu);
};

// Handlers
Spaz.Menus.menuReload = function() {
	sch.debug('in Spaz.Menu.menuReload');
	Spaz.UI.reloadCurrentTab();
	Spaz.restartReloadTimer();
};

Spaz.Menus.menuClearTimeline = function() {
	sch.debug('in Spaz.Menu.menuClearTimeline');
	Spaz.UI.clearCurrentTimeline();
	Spaz.UI.reloadCurrentTab();
	Spaz.restartReloadTimer();
};

Spaz.Menus.menuPrefs  = function() {
	sch.debug('in Spaz.Menu.menuPrefs');
	Spaz.UI.setSelectedTab(document.getElementById('tab-prefs'));
	Spaz.UI.tabbedPanels.showPanel('tab-prefs');
};

Spaz.Menus.menuFeedback = function() {
	Spaz.postPanel.prepReply('spaz');
}
