if (!Spaz.Dock) Spaz.Dock = {};

/***********
Spaz.Dock takes care of modifying the OS X dock icon
***********/

/* Initiliaze everything.
 */
Spaz.Dock.init = function() {

	// Only on OSX
	Spaz.Dock.active = true;

	//
	if (!Spaz.Dock.active)
	{
		return;

	}

	Spaz.Dock.mincachetime = 1000;
	// in mseconds
	Spaz.Dock.lastchecked = 0;
	// unix timestamp
	// Load the image async
	var imageURL = 'images/spaz-icon-alpha.png';
	sch.dump("Want to load image " + imageURL);
	Titanium.UI.setDockIcon(imageURL);

	//
	Spaz.Dock.sync();

}

Spaz.Dock.cache = {};

Spaz.Dock.colorMap = {
	"red": {
		"high": 0xFF0000,
		"low": 0xAA0000,
		"border": 0x660000
	},
	"blue": {
		"high": 0xFF,
		"low": 0xAA,
		"border": 0x66
	},
	"yellow": {
		"high": 0xFFFF00,
		"low": 0xAAAA00,
		"border": 0x666600
	},
	"green": {
		"high": 0xFF00,
		"low": 0xAA00,
		"border": 0x6600
	},
	"cyan": {
		"high": 0xFFFF,
		"low": 0xAAAA,
		"border": 0x6666
	},
	"magenta": {
		"high": 0xFF00FF,
		"low": 0xAA00AA,
		"border": 0x660066
	}

}

Spaz.Dock.setColor = function(color) {
	if (typeof color == 'undefined' || Spaz.Dock.colorMap[color] == null)
	{
		color = "red";

	}
	Spaz.Dock.color = color;

}

Spaz.Dock.getColor = function() {
	var color = Spaz.Dock.color;
	if (color == null)
	{
		color = "red";

	}
	return color;

}

Spaz.Dock.shapeMap = {
	"classic": function(unreadCount, color) {
		return new Spaz.Dock.ClassicBadge(unreadCount, color)

	},
	"star": function(unreadCount, color) {
		return new Spaz.Dock.StarBadge(unreadCount, color)

	}

};

Spaz.Dock.setShape = function(shape) {
	if (typeof shape == 'undefined' || Spaz.Dock.shapeMap[shape] == null)
	{
		shape = "classic";

	}
	Spaz.Dock.shape = shape;

}

Spaz.Dock.getShape = function() {
	var shape = Spaz.Dock.shape;
	if (shape == null)
	{
		shape = "classic";

	}
	return shape;

}

/* Synchronize the dock with its the prefs. It also takes care of starting/stopping the refresh thread.
 */
Spaz.Dock.sync = function() {
	if (!Spaz.Dock.active)
	{
		return;

	}

	//
	var reloadID = Spaz.Dock.reloadID;
	if (reloadID != null)
	{
		// sch.dump("Stopping dock refresh thread");
		$(document).unbind('UNREAD_COUNT_CHANGED', Spaz.Dock.refresh);
		// window.clearInterval(reloadID);

	}
	if (Spaz.Prefs.getDockDisplayUnreadBadge())
	{
		$(document).bind('UNREAD_COUNT_CHANGED', Spaz.Dock.refresh);
		// var refresh = Spaz.Prefs.getDockRefreshInterval();
		//		 sch.dump("Starting dock refresh thread with refresh rate of " + refresh + " ms");
		//		 // Spaz.Dock.reloadID = window.setInterval(Spaz.Dock.refresh, refresh);

	}

}

/* Performs a visual refresh. The unreadCount argument is optional. If it is not provided
 * then the value will be computed from the div elements non marked as read in the timeline of friends.
 * unreadCount should be an integer; if not, it is ignored and unreadCount is retrieved by Spaz.UI.getUnreadCount
 */
Spaz.Dock.refresh = function(unreadCount) {
	if (!Spaz.Dock.active)
	{
		return;

	}

	// clear any existing timeouts so we don't fire a second time unnecessarily
	if (Spaz.Dock.deferredRefresh) {
		clearTimeout(Spaz.Dock.deferredRefresh);
	}

	// check if timelimit has passed
	var now = sch.getTimeAsInt();
	var diff = now - Spaz.Dock.lastchecked;
	if (diff < Spaz.Dock.mincachetime) {
		// sch.dump('timelimit not passed (it is now '+now+')');
		// defer execution if time limit has not passed
		Spaz.Dock.deferredRefresh = setTimeout(Spaz.Dock.refresh, Spaz.Dock.mincachetime);
		return;

	} else {
		Spaz.Dock.lastchecked = now;

	}

	//
	if (typeof unreadCount != 'number')
	{
		unreadCount = Spaz.UI.getUnreadCount();

	}

	// Use the original icon if count is zero
	if (unreadCount == 0)
	{
		sch.dump('unread == 0');
		// Update state
		Titanium.UI.setBadge('');
		Spaz.Dock.lastUnreadCount = 0;
		return;

	} else {
		Titanium.UI.setBadge(unreadCount.toString());
	}


	// Update state
	Spaz.Dock.cache.lastUnreadCount = unreadCount;

}

