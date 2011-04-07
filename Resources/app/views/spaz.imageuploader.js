Spaz.ImageUploader = function() {
	
	var that = this;
	
	this.fileobj = null;
	
	this.SIU = new SpazImageUploader();
	
	this.init = function() {
		
		var container = jQuery('#imageUploadWindow');
		
		this.SIU = new SpazImageUploader();
		
		jQuery('#imageupload-loading').hide();
		jQuery('#imageupload-status-text').hide().text('');


		// get the pref
		var sharepass = Spaz.Prefs.get('services-twitpic-sharepassword');
		sch.debug("sharepass is "+ sharepass);
		
		/*
			populate the dropdown
		*/
		var labels = this.SIU.getServiceLabels();

		for (var i=0; i < labels.length; i++) {
			var this_service = labels[i];
			jQuery('#imageupload-file-uploader').append('<option value="'+this_service+'">'+this_service+'</option>');
		};

		// set dropdown value		
		if (Spaz.Prefs.getCurrentAccountType() == SPAZCORE_ACCOUNT_IDENTICA) {
			jQuery('#imageupload-file-uploader').val('identi.ca').attr('disabled', true);
		} else if (Spaz.Prefs.getCurrentAccountType() == SPAZCORE_ACCOUNT_STATUSNET) {
			jQuery('#imageupload-file-uploader').val('StatusNet').attr('disabled', true);
		} else {
			jQuery('#imageupload-file-uploader').val(Spaz.Prefs.get('file-uploader')).attr('disabled', '');
		}
		
		
		/*
			bind click on droplet
		*/
		jQuery('#imageupload-droplet').click(function() {
			that.browseForImage();
		});
		
		
		/*
			bind service dropdown
		*/
		jQuery('#imageupload-file-uploader').bind('change', function() {
			Spaz.Prefs.set('file-uploader', jQuery('#imageupload-file-uploader').val());
		});
		

		// bind click to upload
		jQuery('#imageupload-button').bind('click', function() {
			if (that.fileobj) {
				that.uploadDraggedImage(that.fileobj);
			} else {
				that.browseForImage();
			}
		});
		
		
		jQuery('#imageupload-post-message').keyup(function(e) {
			if (jQuery('#imageupload-post-message').val().length>110) {
				jQuery('#imageupload-post-message').val( jQuery('#imageupload-post-message').val().substr(0,110) );
			}
			sch.debug(jQuery('#imageupload-post-message').val().length);
		});

	};



	/*
		Browse for the image!
	*/
	this.browseForImage = function() {
		
		
		var opts = {multiple:false,directories:false,files:true,types:['gif','png','jpg']};
		
		Titanium.UI.openFileChooserDialog(function(f) {
		    
		    if (f.length) {
		        var file_url = f[0];
				
				if (file_url.match(/^(.+)\.(jpg|jpeg|gif|png)$/i)<1) {
					alert("File must be one of the following:\n .jpg, .jpeg, .gif, .png");
					return false;
				}
				that.displayChosenFile(file_url);
				return true;
            }
	    
		}, opts);
		
	};


	/*
		Really a proxy for the Spaz.postPanel.prepPhotoPost method created in app initialization
	*/
	this.prepPhotoPost = function(url) {
	    if (url) {
			Spaz.postPanel.prepPhotoPost(url);			
	        return true;
	    } else {
	        return false;
	    }
	};

	/*
		handle dropped file
	*/
	this.displayChosenFile = function(fileUrl) {
		
		this.fileobj = Titanium.Filesystem.getFile(fileUrl);
		fileUrl = this.fileobj.toURL();
		
		var $droplet = jQuery('#imageupload-droplet');
		
		$droplet.html('<img src="'+this.fileobj.toURL()+'" />');
		
		var $droppedimg = jQuery('#imageupload-droplet>img');
		
		$droppedimg.css('max-width', $droplet.width());
		$droppedimg.css('max-height', $droplet.height());

		// we can't calculate the image width until it has loaded
		$droppedimg.load(function(e) {
			
			// get the diffs so we can center the image
			var diff_x = $droplet.width() - $droppedimg.width();
			var diff_y = $droplet.height() - $droppedimg.height();

			if (diff_x > 0) {
				$droppedimg.css('margin-left', diff_x/2);
			}
			if (diff_y > 0) {
				$droppedimg.css('margin-top', diff_y/2);
			}

			jQuery('#imageupload-file-url').val(fileUrl);
		});
		
	};

	/*
		Upload the dragged image to the service
	*/
	this.uploadDraggedImage = function(fileobj) {
		var that = this;
		
		var service = Spaz.Prefs.get('file-uploader');
		
		if (this.SIU.getServiceLabels().indexOf(service) === -1 ) {
			Spaz.Prefs.set('file-uploader', this.SIU.getServiceLabels()[0]);
		}
		
		var auth = Spaz.Prefs.getAuthObject();
		var image_uploader = new SpazImageUploader();
		
		jQuery('#imageupload-loading').show();
		jQuery('#imageupload-status-text').show().text('Uploading…');
		
		var image_uploader_opts = {
			'auth_obj': auth,
			'service' : Spaz.Prefs.get('file-uploader') || 'twitpic',
			'file_url': this.fileobj.toString(),
			'onSuccess':function(event_data) { // onSuccess
				
				jQuery('#imageupload-loading').hide();
				if (event_data.url) {
					that.prepPhotoPost(event_data.url);
					jQuery('#imageupload-status-text').html($L('Complete'));
					Spaz.UI.closePopbox();
					that.init();
				} else if (event_data.error) {
					jQuery('#imageupload-status-text').html($L("Posting image failed:") + " " + event_data.error);
				} else {
					jQuery('#imageupload-status-text').html($L("Posting image failed"));
				}
			},
			'onFailure':function(responseText, xhr) { // onFailure
				sch.error('Posting image FAILED');
				ech.error("Error!");
				ech.error(event_obj);
				jQuery('#imageupload-loading').hide();
				jQuery('#imageupload-status-text').html($L("Posting image failed"));
			}
		};
		
		// force identi.ca uploading if using identi.ca
		if (Spaz.Prefs.getCurrentAccountType() == SPAZCORE_ACCOUNT_IDENTICA) {
			image_uploader_opts['service'] = 'identi.ca';
		} else if (Spaz.Prefs.getCurrentAccountType() == SPAZCORE_ACCOUNT_STATUSNET) {
			image_uploader_opts['service'] = 'StatusNet';
			image_uploader_opts['statusnet_api_base'] = Spaz.Prefs.getCustomAPIUrl();
		}
		
		sch.error(image_uploader_opts);
		console.dir(image_uploader_opts);
		
		
		image_uploader.setOpts(image_uploader_opts);
		image_uploader.upload();
		
	};
};

