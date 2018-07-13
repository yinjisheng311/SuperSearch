var inited = 0;
var query = null;
var data = null

chrome.runtime.onMessage.addListener(
		function(request, sender, sendResponse){
			if (request.type == 'network_graph_data'){
				inited = 1;
				query = request.query;
				data = request.data;

				para = document.getElementById('paragraph')
				para.innerHTML = data
			}
		});
