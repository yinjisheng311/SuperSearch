chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        // TODO keep a state of all created graphs so that no recreation upon refresh
        if (request.type == 'links') {
            var links = request.links
            var query = request.query
            console.log(request);
            console.log(sender);
			console.log('got a message');
			scrape_url(links[0])
        }
    });


function scrape_url(url){
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function (){
		console.log(this.status);
		if (this.readyState == 4 && this.status ==200){
			console.log(xhttp.responseText);			
		}
	}
	xhttp.open("GET", url, true);
	console.log("sending a request to "+url);
	xhttp.send();
}
