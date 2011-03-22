# Spaz Desktop
## for Appcelerator Titanium Desktop

Spaz is an open source microblogging client written in JavaScript, HTML and CSS. This version runs on top of the Appcelerator Titanium Desktop web runtime platform.

There are many, many problems with this code that need to be fixed. Much work needs to be done to convert AIR-specific code to Titanium equivalents. Bugs/issues should be filed in the [issue tracker for this project](https://github.com/funkatron/spaz-desktop-titanium/issues), so we have a running tally of what to fix.

## Notes on xAuth ##

Spaz uses [xAuth](http://dev.twitter.com/pages/xauth) to authenticate with Twitter. We do not distribute our consumer key and secret per Twitter's request. You will need to:

  1. [Register an app at Twitter](https://twitter.com/apps/new), and get your own consumer key and secret
  2. Request xAuth access by emailing <api@twitter.com> ([more info](http://dev.twitter.com/pages/xauth))
  3. When you get your keys, rename `app/auth_config_sample.js` to `app/auth_config.js` and fill in the correct values

If you don't want to go through these steps, you'll need to use end-user test builds, and won't be able to run from source.