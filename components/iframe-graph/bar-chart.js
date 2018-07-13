function makeGraph() {
    console.log('running bar chart');
    var ctx = document.getElementById("barChart").getContext('2d');

    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
            datasets: [{
                label: '# of Votes',
                data: [12, 19, 3, 5, 2, 3],
                backgroundColor: [
                    'rgba(28, 115, 231, 1)',
                    'rgba(28, 115, 231, 0.8)',
                    'rgba(28, 115, 231, 0.6)',
                    'rgba(28, 115, 231, 0.4)',
                    'rgba(28, 115, 231, 0.2)',
                    'rgba(28, 115, 231, 0.1)',
                ],
                borderWidth: 1
            }]
        },
        options: {
            animation: {
                onComplete: function (e) {
                    this.options.animation.onComplete = null;
                    console.log(e);
                    let newData = [25, 24, 23, 22, 21, 20];
                    let newLabel = '';
                    addData(myChart, newLabel, newData);
                }
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
}

function addData(chart, label, data) {
    console.log(chart);
    console.log(label);
    chart.data.labels.push(label);
    console.log(chart.data.datasets);
    for (let i = 0; i < data.length; i ++) {
        chart.data.datasets[0].data[i] = data[i];
    }
    // myLineChart.data.datasets[0].data[2] = 50;
    console.log(chart.data.datasets);
    chart.update();
    
}


makeGraph();