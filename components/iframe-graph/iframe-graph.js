
var script = document.createElement("script");
script.defer = true;
script.src = "https://cdnjs.cloudflare.com/ajax/libs/cytoscape/2.7.13/cytoscape.min.js";
document.getElementsByTagName("head")[0].appendChild(script);

var cy = cytoscape({
	// container to render in
  container: document.getElementById('cy'),
	elements: [ // list of graph elements to start with
    { // parent node
			grabbable: false,
      data: {
				id: 'orgid1',
				name: 'Parent Orgname'
			}
    },
    { // current node
			grabbable: false,
      data: {
				id: 'orgid2',
				name: 'Current Orgname',
			}
    },
		{ // Child Node
			grabbable: false,
			data: {
				id: 'orgid3',
				name: 'Child OrgnameA',
			}
		},
		{ // Child Node
			grabbable: false,
			data: {
				id: 'orgid4',
				name: 'Child OrgnameB',
			}
		},
    { // edge ab
      data: { id: 'top', source: 'orgid1', target: 'orgid2' }
    },
		{
			data: { id: 'childa', source: 'orgid2', target: 'orgid3' }
		},
		{
      data: { id: 'childb', source: 'orgid2', target: 'orgid4' }
		}
  ],

  style: [ // the stylesheet for the graph
    {
      selector: 'node',
      style: {
        'background-color': '#666',
        'label': 'data(name)',
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
    name: 'breadthfirst',
		directed: true,
		animate: true,
		animationDuration: 1000,
		animationEase: 'ease-in-out',
  },
	
	userPanningEnabled: false
});
cy.on('click', 'node', function(evt) {
	alert("Redirect to /" + this.data('id') + "/");
});