console.log('running bar chart')
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
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero:true
                }
            }]
        }
    }
});
console.log('done loading');