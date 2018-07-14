var inited = 0;
var query = null;
var data = null

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.type == 'network_graph_data' && inited == 0) {
            console.log("recieved");
            inited = 1;
            query = request.query;
            query = query.replace(/\s+/g, '');
            data = request.data;
            console.log(data);
            let nodes = [];
            centerNode = {
                data: {
                    id: query
                }
            };
            nodes.push(centerNode);
            for (let i = 0; i < data.length; i++) {
                let eachNode = {
                    data: {
                        id: data[i].entity_name,
                        weight: data[i].hist_score,
                    }
                };
                nodes.push(eachNode);
            }

            let edges = [];
            for (let i = 0; i < data.length; i++) {
                let eachEdge = {
                    data: {
                        source: query,
                        target: data[i].entity_name
                    }
                };
                edges.push(eachEdge);
            }

            // para = document.getElementById('paragraph')
            // para.innerHTML = data
            sendResponse({
                status: true
            });
            var cy = cytoscape({
                container: document.getElementById('cy'),
                elements: {
                    nodes: nodes,
                    edges: edges
                },
                style: [ // the stylesheet for the graph
                    {
                        selector: 'node',
                        style: {
                            'background-color': '#2c98f0',
                            'label': 'data(id)'
                        }
                    },
                    {
                        selector: 'node#' + query,
                        style: {
                            'background-color': '#e72663',
                            'label': 'data(id)',
                            'width': 100,
                            'height': 100
                        }
                    },
                    {
                        selector: 'node[weight>50]',
                        style: {
                            'background-color': '#4055b2',
                            'label': 'data(id)',
                            'width': 50,
                            'height': 50
                        }
                    },

                    {
                        selector: 'edge',
                        style: {
                            'width': 1,
                            'line-color': '#ccc',
                            'target-arrow-color': '#ccc',
                            'target-arrow-shape': 'triangle'
                        }
                    }
                ],

                layout: {
                    name: 'cose',
                    animate: true,
                    idealEdgeLength: 100,
                    nodeOverlap: 20,
                    refresh: 20,
                    fit: true,
                    padding: 30,
                    randomize: false,
                    componentSpacing: 100,
                    nodeRepulsion: 400000,
                    edgeElasticity: 100,
                    nestingFactor: 5,
                    gravity: 80,
                    numIter: 1000,
                    initialTemp: 200,
                    coolingFactor: 0.95,
                    minTemp: 1.0
                }
            });
            cy.on('click', 'node', function (evt) {
                console.log(evt);
                console.log('clicked ' + this.id());
                for (let i = 0; i < data.length; i++) {
                    if (data[i].entity_name == this.id()) {
                        let newGoogleSearchUrl = 'https://www.google.com/search?q=' + this.id();
                        // window.open(data[i].url);
                        window.open(newGoogleSearchUrl);

                        break;
                    }
                }
            });
        }
        if (request.type == 'network_graph_data' && inited == 1 && query == request.query) {
            // call to 
            // rerender network graph	
            data = request.data;
        }

        return true;
    });