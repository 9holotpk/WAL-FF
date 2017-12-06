// DEV. EXTENTION BY 9holotpk
// Saves options to chrome.storage
var whatsAppURL = "https://web.whatsapp.com/";
var thisTabID;
chrome.tabs.getCurrent(function(tabs){
	thisTabID = tabs.id;
	chrome.tabs.update(thisTabID, { active: true });
});
function save_options() {
  var badge = document.getElementById('badge').value;
  var likesBadge = document.getElementById('like').checked;
  var reload = document.getElementById('reload').checked;
  chrome.storage.local.set({
    favoriteBadge: badge,
    likesBadge: likesBadge
  }, function() {
	  	//Update status to let user know options were saved.
	    var status = document.getElementById('status');	   
	    status.textContent = 'Options saved.';
	    //console.log('log: Saved Options: '+badge);
	    setTimeout(function() {
	    	status.textContent = '';
	    	if(reload == true){
	    		//console.log('log: Closed Options and Reload.');
	    		chrome.tabs.query({ url: whatsAppURL + "*" }, function(tabs){
	    	        if(tabs.length > 0){
	    	        	var winID = tabs[0].windowId;
	    	        	chrome.tabs.reload(tabs[0].id);
	    	    		chrome.windows.update(winID, { focused: true });  
	    	    		chrome.tabs.remove(thisTabID);
	    	        }else{
	    	        	chrome.tabs.remove(thisTabID);
	    	        }
	    	    });
	    		
	    	}
	}, 750);
	});
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.

function restore_options() {	
  // Use default value badge = 'contact' and likesBadge = true.
	chrome.storage.local.get({
		favoriteBadge: 'Contact',
		likesBadge: true
	}, function(items) {
		document.getElementById('badge').value = items.favoriteBadge;
		document.getElementById('like').checked = items.likesBadge;
		var chosenoption2 = items.favoriteBadge;
		//console.log('log: options='+chosenoption2);
		var detail = document.getElementById('detail');
		if (chosenoption2 == "none"){	   
			detail.textContent = 'None = Badge is Off.';
		}else if (chosenoption2 == "contact"){
			detail.textContent = 'Contacts = Show number of contact send new chat to you.';
                }else if (chosenoption2 == "icontact"){
			detail.textContent = 'Icon number = Show number of contact send new chat to you (inside icon). *This option is beta.';
		}else if (chosenoption2 == "total"){
			detail.textContent = 'Messages = Show the total number of messages. (Next ver.)';
		}else {
			detail.textContent = "*First (Empty) default is 'Contacts'.";
		}
  });
  
}

var selectmenu = document.getElementById("badge")
selectmenu.onchange = function(){ //run some code when "onchange" event fires
	var chosenoption = this.options[this.selectedIndex] //this refers to "selectmenu"
	var detail = document.getElementById('detail');	
	if (chosenoption.value == "none"){	   
		detail.textContent = 'None = Badge is Off.';
	}else if (chosenoption.value == "contact"){
		detail.textContent = 'Contacts = Show number of contact send new chat to you.';
        }else if (chosenoption.value == "icontact"){
			detail.textContent = 'Icon number = Show number of contact send new chat to you (inside icon). *This option is beta.';
	}else if (chosenoption.value == "total"){
		detail.textContent = 'Messages = Show the total number of messages. (Next ver.)';
	}
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);