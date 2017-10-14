**NOTE:** This project is now being maintained as cross-browser, WebExtension
based extension called [Web API Manager](https://github.com/snyderp/web-api-manager).

API Blocking Firefox Extension
===

This extension allows users to choose which parts of the Web API they expose
to websites, using a technique that minimizes the effect of the desirable
parts of browser functionality.

Running the Extension
---
This extension was built for versions of Firefox before Mozilla started
enforcing code-signing on extensions, and before they deprecated parts of their
previous add-on API.

As a result, running the extension requires running a previous version of
Firefox (version [43.0.4](https://ftp.mozilla.org/pub/firefox/releases/43.0.4/))
and using a special profile configured to not require code signing.  Such a
profile is included in this repository, and is configured to already have
the extension installed.

You can run the extension with the following steps.
1. [Download Firefox 43.0.04](https://ftp.mozilla.org/pub/firefox/releases/43.0.4/)
   for your platform.
2. Run that version of Firefox so that it uses the included profile:
   For example, on OSX you would run:
   `<path to version 43.0.04 Firefox.app>/Contents/MacOS/firefox --profile <path to this archive>/n7hzhgm2.Control`.


Using the Extension
---
Once you're running Firefox with the extension installed, you can configure
it through the following steps:

1. Go to the "Add-Ons" screen in Firefox
2. Click the "Preferences" button next to the "Web Standard Blocker" extension
3. Click "Configure WebAPI Settings" on the next page.

The resulting page allows you to configure which WebAPI standards are enabled
by default (for newly encountered pages).  It also allows you to set
custom rules for other domains, using regular expression patterns.

If a custom rule's pattern matches a visited domain, that particular Web API
configuration will be used.  Otherwise, the "default" rule set will be used.

**Note** that you must restart Firefox in order for these changes to become
active.  This is an implementation detail of doing this modification at the
extension level.  Pushing this work into the browser itself would not
require this additional step.
