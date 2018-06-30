// var script = document.createElement("script");
// script.defer = true;
// script.src = "https://cdnjs.cloudflare.com/ajax/libs/cytoscape/2.7.13/cytoscape.min.js";
// document.getElementsByTagName("head")[0].appendChild(script);
console.log('loading cytoscape');
var cy = cytoscape({
	container: document.getElementById('cy'),
	elements: {
		nodes: [{
				data: {
					id: 'j',
					name: 'Jerry'
				}
			},
			{
				data: {
					id: 'e',
					name: 'Elaine'
				}
			},
			{
				data: {
					id: 'k',
					name: 'Kramer'
				}
			},
			{
				data: {
					id: 'g',
					name: 'George'
				}
			}
		],
		edges: [{
				data: {
					source: 'j',
					target: 'e'
				}
			},
			{
				data: {
					source: 'j',
					target: 'k'
				}
			},
			{
				data: {
					source: 'j',
					target: 'g'
				}
			},
			{
				data: {
					source: 'e',
					target: 'j'
				}
			},
			{
				data: {
					source: 'e',
					target: 'k'
				}
			},
			{
				data: {
					source: 'k',
					target: 'j'
				}
			},
			{
				data: {
					source: 'k',
					target: 'e'
				}
			},
			{
				data: {
					source: 'k',
					target: 'g'
				}
			},
			{
				data: {
					source: 'g',
					target: 'j'
				}
			}
		]
	}

	,

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
		rows: 2
	}
});
// cy.on('click', 'node', function(evt) {
// 	alert("Redirect to /" + this.data('id') + "/");
// });