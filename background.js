// DEV. EXTENTION BY 9holotpk
var whatsAppURL = "https://web.whatsapp.com/";
var readTitle;
var tabID;
var res = "";
var status = ''; // 'contact' default
chrome.browserAction.setBadgeText({ text: "" });

function checkQR (what){
	chrome.tabs.query({ url: whatsAppURL + "*" }, function(tabs){
		chrome.tabs.sendMessage(tabs[0].id, {line: 'countparas'});
	});
	var nicon = '';
	chrome.runtime.onMessage.addListener(
		function (request, sender) {
			if(request.count){
				//console.log('log: (' +request.count+ ') tab ID: (' +sender.tab.id+ ') Waiting Scan QR Code.');
				chrome.browserAction.setBadgeText({ text: "QR" });
				chrome.browserAction.setTitle({ title: 'Please Scan QR Code' })
				chrome.browserAction.setBadgeBackgroundColor({ color: "#000000" });
			}
			if(request.alert){
				//console.log('log: (' +request.alert+ ') tab ID: (' +sender.tab.id+ ') Something Alert!');
				chrome.browserAction.setBadgeText({ text: "!" });
				chrome.browserAction.setTitle({ title: 'Something Alert!'})
				chrome.browserAction.setBadgeBackgroundColor({ color: "#FED859" });
			}
                        if(request.icon){
                            //console.log('log: (' +request.icon+ ')');
                            nicon = request.icon;
                            if(what=="ckicon"){
                                chrome.browserAction.setIcon({
                                    path : nicon
                                });
                            }else {
                                chrome.browserAction.setIcon({
                                    path : "icons/whatsapp_48.png"
                                });
                            }
                        }
		}
	);
        
}

chrome.browserAction.onClicked.addListener(function(){
	chrome.tabs.query({ url: whatsAppURL + "*" }, function(tabs){
        if(tabs.length > 0){
        	var winID = tabs[0].windowId;
    		chrome.windows.update(winID, { focused: true });   		
            //chrome.tabs.update(tabs[0].id, { active: true });
            tabID = tabs[0].id;
            checkQR();
        }else{
        	chrome.windows.create({url: whatsAppURL, type: "popup", width: 685, height: 620, top: 50, left: 50});
        	//console.log('log: Created new Window chat!');
        }
    });	
});

chrome.tabs.onUpdated.addListener(function(tabsU, changeInfo, tab){
	chrome.tabs.query({ url: whatsAppURL + "*" }, function(tabs){
		if(tabs.length > 0){
			tabID = tabs[0].id;
			//console.log('TabID='+tabID);
			if(tabsU==tabID){
				//Options
				chrome.storage.local.get("favoriteBadge", function(items) {
					if (!browser.runtime.lastError) {
						status = items.favoriteBadge;
						//console.log('Status='+status);
					}
				});				
				readTitle = tabs[0].title;
				//console.log('Title='+readTitle);
				if(readTitle.length > 0 && status == 'contact'){
                                    var f = readTitle.indexOf("(");
				    var e = readTitle.indexOf(")");
				    res = readTitle.substring(f+1, e);
				    if(res.length > 0){
				    	chrome.browserAction.setTitle({title: 'Chat from ' +res+ ' contact(s) | Click to Launch'})
					    chrome.browserAction.setBadgeText({ text: res });
					    chrome.browserAction.setBadgeBackgroundColor({ color: "#ff0000" });
                                            
					}else{
                                            chrome.browserAction.setTitle({title: 'WhatsApp Launcher'})
                                            chrome.browserAction.setBadgeText({ text: "on" });
                                            chrome.browserAction.setBadgeBackgroundColor({ color: "#000000" });
					}
				    checkQR(); // Check QR & Alert
				}else if(readTitle.length > 0 && status == 'icontact'){
                                    var f = readTitle.indexOf("(");
				    var e = readTitle.indexOf(")");
				    res = readTitle.substring(f+1, e);
				    if(res.length > 0){
				    	chrome.browserAction.setTitle({title: 'Chat from ' +res+ ' contact(s) | Click to Launch'})
					chrome.browserAction.setBadgeText({ text: "" });
					chrome.browserAction.setBadgeBackgroundColor({ color: "#ff0000" });
                                            
                                    }else{
                                        chrome.browserAction.setTitle({title: 'WhatsApp Launcher'})
                                        chrome.browserAction.setBadgeText({ text: "" });
                                        chrome.browserAction.setBadgeBackgroundColor({ color: "#000000" });
					}
				    checkQR("ckicon"); // Check QR & Alert
				}else if(status == 'total'){
					var numChat;
					if(numChat.length > 0){
				    	chrome.browserAction.setTitle({title: 'New ' +res+ ' message(s) | Click to Launch'})
					    chrome.browserAction.setBadgeText({ text: numChat });
					    chrome.browserAction.setBadgeBackgroundColor({ color: "#ff0000" });
					}else{
						chrome.browserAction.setTitle({title: 'WhatsApp Launcher'})
						chrome.browserAction.setBadgeText({ text: "on" });
				    	chrome.browserAction.setBadgeBackgroundColor({ color: "#000000" });
					}
					checkQR(); // Check QR & Alert
				}else if(status == 'none'){
					chrome.browserAction.setBadgeText({ text: "" });
					chrome.browserAction.setTitle({title: 'WhatsApp Launcher'})
				}else{
					//console.log('default status');
					//default = contact
					var f = readTitle.indexOf("(");
				    var e = readTitle.indexOf(")");
				    res = readTitle.substring(f+1, e);
				    if(res.length > 0){
				    	chrome.browserAction.setTitle({title: 'Chat from ' +res+ ' contact(s) | Click to Launch'})
					    chrome.browserAction.setBadgeText({ text: res });
					    chrome.browserAction.setBadgeBackgroundColor({ color: "#ff0000" });
					}else{
						chrome.browserAction.setTitle({title: 'WhatsApp Launcher'})
						chrome.browserAction.setBadgeText({ text: "on" });
				    	chrome.browserAction.setBadgeBackgroundColor({ color: "#000000" });
					}
				    checkQR(); // Check QR & Alert					
				}
								
			}
        }
	});
});

chrome.tabs.onRemoved.addListener(function (tabsR, removeInfo){
	if(tabsR==tabID){
		chrome.browserAction.setBadgeText({ text: "" });
		chrome.browserAction.setTitle({title: 'WhatsApp Launcher'});
                chrome.browserAction.setIcon({
                    path : "icons/whatsapp_48.png"
                });
		//console.log('log: Closed Window chat!');
	}
});
