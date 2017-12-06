// DEV. EXTENTION BY 9holotpk
browser.runtime.onMessage.addListener(
	function(request, sender){
		if(request.line=='countparas'){
			var paras = document.body.querySelectorAll('div.qrcode');
			var alert = document.body.querySelectorAll('div.butterbar');
                        var icon = document.getElementById('favicon').href;
			if(paras.length > 0){ 
				var theCount = paras.length+'';
				chrome.runtime.sendMessage({count:theCount});
			}else if(alert.length > 1){
				var theCount = paras.length+'';
				chrome.runtime.sendMessage({alert:theCount});
			}else{
				//console.log('log: There does not seem to be any <div> elements in this page!');
			}
                        
                        if(icon.length > 0){
                            var hicon = icon;
                            chrome.runtime.sendMessage({icon:hicon});
                           
                        }
			
		}
});