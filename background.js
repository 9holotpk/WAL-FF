// DEV. EXTENTION BY 9holotpk
var whatsAppURL = "https://web.whatsapp.com/";
var readTitle;
var tabID;
var res = "";
var status = ''; // 'contact' default
browser.browserAction.setBadgeText({ text: "" });

initContextMenus();
function initContextMenus(){
	browser.contextMenus.create({
		id: 'options-wal-id',
		title: 'WhatsApp Launch Options',
		contexts: ["browser_action"]
	}, onCreated);

	function onCreated(n) {
		if (browser.runtime.lastError) {
		}
	}
	browser.contextMenus.onClicked.addListener(listener);
}

function openPreferences(){
	function onOpened() {
	}
	browser.runtime.openOptionsPage().then(onOpened, onError);	
}

function listener(info,tab){
	if(info.menuItemId == "options-wal-id"){
		openPreferences();
		return;
	}
}

function checkQR (what){
	browser.tabs.query({ url: whatsAppURL + "*" }, function(tabs){
		browser.tabs.sendMessage(tabs[0].id, {line: 'countparas'});
		// console.log('sendMessage * ' + tabs[0].id);
	});
	// console.log('CHK: QR = ' + what);
	checkBadge();
	browser.runtime.onMessage.addListener(
		function (request, sender) {
			// console.log('runtime', request.count);
			if(request.count == 'Scan me!'){
				// console.log('log: (' +request.count+ ') tab ID: (' +sender.tab.id+ ') Waiting Scan QR Code.');
				setBadgeQR();
			} else {
				setBadgeQR();
			}
		}
	);
}

function checkBadge() {
	browser.tabs.query({ url: whatsAppURL + "*", status: 'complete' }, function(tabs){
		if(tabs.length > 0){
			tabID = tabs[0].id;
			// # Load options saved.
			browser.storage.local.get("favoriteBadge", function(items) {
				if (!browser.runtime.lastError) {
					status = items.favoriteBadge;
				}
			});
			// # Read Title.				
			readTitle = tabs[0].title;
			// # Check status by options.
			if (status == 'none') {
				browser.browserAction.setBadgeText({ text: "" });
				browser.browserAction.setTitle({title: 'WhatsApp Launcher'})
			} else {
				var f = readTitle.indexOf("(");
				var e = readTitle.indexOf(")");
				res = readTitle.substring(f+1, e);
				if(res.length > 0){
					browser.browserAction.setTitle({title: 'Chat from ' +res+ ' contact(s) | Click to Launch'})
					browser.browserAction.setBadgeText({ text: res });
					browser.browserAction.setBadgeBackgroundColor({ color: "#ff0000" });
				}else{
					browser.browserAction.setTitle({title: 'WhatsApp Launcher'})
					browser.browserAction.setBadgeText({ text: "on" });
					browser.browserAction.setBadgeBackgroundColor({ color: "#000000" });
				}
			}
		}
	});
}

function setBadgeQR() {
	browser.browserAction.setBadgeText({ text: "QR" });
	browser.browserAction.setTitle({ title: 'Please Scan QR Code' })
	browser.browserAction.setBadgeBackgroundColor({ color: "#000000" });
}

function setBadgeOn() {
	browser.browserAction.setTitle({title: 'WhatsApp Launcher'})
	browser.browserAction.setBadgeText({ text: "on" });
	browser.browserAction.setBadgeBackgroundColor({ color: "#000000" });
}

browser.browserAction.onClicked.addListener(function(){
	// # Check WhatsApp tab.
	browser.tabs.query({ url: whatsAppURL + "*" }, function(tabs){
        if(tabs.length > 0){
        	var winID = tabs[0].windowId;
    		browser.windows.update(winID, { focused: true });   		
            tabID = tabs[0].id;
            checkQR('by Click');
        }else{
			// # Create new window chat.
        	browser.windows.create({url: whatsAppURL, type: "popup", width: 685, height: 620, top: 50, left: 50});
			checkQR('by Click');
        }
    });	
});

browser.tabs.onActivated.addListener(function (activeInfo){
	// console.log('log: onActive');
	if(activeInfo.tabId == tabID){
		checkQR('by Active');
	}
});

browser.tabs.onUpdated.addListener(function(tabsU, changeInfo, tab){
	checkQR('by Update');
});

browser.tabs.onRemoved.addListener(function (tabsR, removeInfo){
	if(tabsR==tabID){
		browser.browserAction.setBadgeText({ text: "" });
		browser.browserAction.setTitle({title: 'WhatsApp Launcher'});
	}
});
