// var script = document.createElement("script");
// script.defer = true;
// script.src = "https://cdnjs.cloudflare.com/ajax/libs/cytoscape/2.7.13/cytoscape.min.js";
// document.getElementsByTagName("head")[0].appendChild(script);
console.log('loading cytoscape');
var cy = cytoscape({
	container: document.getElementById('cy'),
	elements: [ // list of graph elements to start with
		{ // node a
			data: {
				id: 'a'
			}
		},
		{ // node b
			data: {
				id: 'b'
			}
		},
		{ // edge ab
			data: {
				id: 'ab',
				source: 'a',
				target: 'b'
			}
		}
	],

	style: [ // the stylesheet for the graph
		{
			selector: 'node',
			style: {
				'background-color': '#666',
				'label': 'data(id)'
			}
		},

		{
			selector: 'edge',
			style: {
				'width': 3,
				'line-color': '#ccc',
				'target-arrow-color': '#ccc',
				'target-arrow-shape': 'triangle'
			}
		}
	],

	layout: {
		name: 'grid',
		rows: 1
	}
});
// cy.on('click', 'node', function(evt) {
// 	alert("Redirect to /" + this.data('id') + "/");
// });