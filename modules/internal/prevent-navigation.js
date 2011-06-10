/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Chromeless.
 *
 * The Initial Developer of the Original Code is David Murdoch.
 * Portions created by the Initial Developer are Copyright (C) 2011
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *  Lloyd Hilaiel <lloyd@hilaiel.com>
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

const {Cc, Ci, Cu, Cm, Cr} = require("chrome");

const xpcom = require("xpcom");

/***********************************************************
class definition
***********************************************************/

var description = "Chromeless Policy XPCOM Component";
/* UID generated by http://www.famkruithof.net/uuid/uuidgen */
var classID = Components.ID("{2e946f14-72d5-42f3-95b7-4907c676cf2b}");
var contractID = "@mozilla.org/chromeless-policy;1";

//class constructor
function ChromelessPolicy() {
    //this.wrappedJSObject = this;
}

// class definition
var ChromelessPolicy = {

  // properties required for XPCOM registration:
  classDescription: description,
  classID:          classID,
  contractID:       contractID,
  xpcom_categories: ["content-policy"],

  // QueryInterface implementation
  QueryInterface: xpcom.utils.generateQI([Ci.nsIContentPolicy, Ci.nsIFactory, Ci.nsISupportsWeakReference]),

  // ...component implementation...
  shouldLoad : function(aContentType, aContentLocation, aRequestOrigin, aContext, aMimeTypeGuess, aExtra) {
    let result = Ci.nsIContentPolicy.ACCEPT;
    // only filter DOCUMENTs (not SUB_DOCUMENTs, like iframes)
    if (aContentType === Ci.nsIContentPolicy["TYPE_DOCUMENT"] && aContentLocation.scheme !== "chrome") {
		result = Ci.nsIContentPolicy.REJECT_REQUEST;
        console.log("navigation blocked for: " + aContentLocation.spec);
    }
    return result;
  },
  createInstance: function(outer, iid) {
    if (outer) {
        throw Cr.NS_ERROR_NO_AGGREGATION;
    }
    return this.QueryInterface(iid);
  }
};

let registrar = Cm.QueryInterface(Ci.nsIComponentRegistrar);
try {
	Cm.nsIComponentRegistrar.registerFactory(classID, description, contractID, ChromelessPolicy);
}
catch (e) {
	// Don't stop on errors - the factory might already be registered
	Cu.reportError(e);
}

const categoryManager = Cc["@mozilla.org/categorymanager;1"].getService(Ci.nsICategoryManager);
for each (let category in ChromelessPolicy.xpcom_categories) {
	categoryManager.addCategoryEntry(category, ChromelessPolicy.classDescription, ChromelessPolicy.contractID, false, true);
}