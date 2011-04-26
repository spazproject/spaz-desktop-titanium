if (!Spaz.DB) Spaz.DB = {};

var SPAZ_DB_NAME = "spaz.db";
var SPAZ_DB_CURRENT_VERSION = "1.0";
var SPAZ_DB_TABLE_READ_ENTRIES = 'read_entries_1';
var SPAZ_DB_TABLE_READ_DMS = 'read_dms_1';

/***********
Spaz.DB takes care of persisting a portion of the application state
***********/


/**
 * Initialize the runtime of the DB. If the database does not exist it is created
 * and then a global connection is made available for the life time of the
 * application's runtime.
 */
Spaz.DB.init = function() {
	var spazDB = Spaz.DB.getDB();
	var sql;
	var create;

	sch.debug("Creating "+TABLE_READ_ENTRIES+" table if necessary : " + conn.connected);
	
	create_sqls = [
		"CREATE TABLE IF NOT EXISTS "+SPAZ_DB_TABLE_READ_ENTRIES+" (entry_id VARCHAR(32) PRIMARY KEY, account_id VARCHAR(36))",
		"CREATE TABLE IF NOT EXISTS "+SPAZ_DB_TABLE_READ_DMS+" (entry_id VARCHAR(32) PRIMARY KEY, account_id VARCHAR(36))"
	];

	spazDB.transaction(function(tx) {
		for (var i = 0; i < create_sqls.length; i++) {
			sch.debug(create_sqls[i]);
			tx.executeSql(create_sqls[i], [], function (tx) {
				sch.debug('executed "'+create_sqls[i]+'"')
			});
		};
	})
};


/**
 * Mark an entry as read using the provided entry id. The entry id must be
 * an integer which is the value of the id returned by Twitter.
 */
Spaz.DB.markEntryAsRead = function(entryId, is_dm, account_id, callback) {
	if (!account_id) {
		account_id = Spaz.Prefs.getCurrentAccountId();
	}
	var db = Spaz.DB.getDB();
	var table = SPAZ_DB_TABLE_READ_ENTRIES;	

	
	if (db.connected) {
		// We insert the value only if it does not exist already (otherwise will have an SQL error due to the existing PK)
		Spaz.DB.asyncGetAsRead(entryId, is_dm, function(data) {
			if (!data) {
				if (is_dm) {
					table = SPAZ_DB_TABLE_READ_DMS;
				}
				sch.debug("Marking as read entry " + entryId);
				sch.debug('USING '+table+" for entryId "+entryId);
				var sql  = "INSERT INTO "+table+" (entry_id, account_id) VALUES (?, ?)";
				try {
					db.executeSql(sql, [entryId, account_id], function(tx) {
						
					});
				} catch (error) {
					sch.error("Failed to mark '"+entryId+"' as read:", error);
					sch.error(error.message);
					sch.error(error.details);
				}
			}
		});
	}
};



/* Check against the database if the entry should be marked as read or not. The first argument is the entry id which must
 * be an integer and the second argument is the callback function made once it has been determined if the entry should be marked as
 * read or not. The callback function takes as unique argument a boolean value which is true if the entry should be marked as read.
 */
Spaz.DB.asyncGetAsRead = function(entryId, is_dm, account_id, callback) {
	return;

	if (!account_id) {
		account_id = Spaz.Prefs.getCurrentAccountId();
	}

	var table = SPAZ_DB_TABLE_READ_ENTRIES;	
	if (is_dm) {
		table = SPAZ_DB_TABLE_READ_DMS;
	}
	var conn = Spaz.DB.conn;
	if (conn.connected)
	{
		sch.debug("Read read entry status " + entryId);
		var callbackAdapter = function(event) {
			markAsReadSt.removeEventListener(air.SQLEvent.RESULT, callbackAdapter);
			markAsReadSt.removeEventListener(air.SQLErrorEvent.ERROR, errorHandler);
			var data =  markAsReadSt.getResult().data;
			sch.debug("Entry status of " + entryId + " read=" + sch.enJSON(data));

			callback.call(this, data);
		};
		var errorHandler = function(event) {
			sch.debug("Async get read for entry id " + entryId + " failed " + event.error);
		};
		sch.debug('USING '+table+" for entryId "+entryId);
		var sql = "SELECT entry_id FROM "+table+" WHERE entry_id=?";
		markAsReadSt.execute();
	}
};

// alias; there is no sync connection
Spaz.DB.isRead = Spaz.DB.asyncGetAsRead;

/**
 * Open a database in synchronous mode and return the SQLConnection
 */
Spaz.DB.getDB = function() {
	return openDatabase(SPAZ_DB_NAME, SPAZ_DB_CURRENT_VERSION, 'put stuff in this', 2 * 1024 * 1024);
};

