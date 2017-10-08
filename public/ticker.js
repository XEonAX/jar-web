'use strict';
var chartColors = {
    red: 'rgb(255, 99, 132)',
    orange: 'rgb(255, 159, 64)',
    yellow: 'rgb(255, 205, 86)',
    green: 'rgb(75, 192, 192)',
    blue: 'rgb(54, 162, 235)',
    purple: 'rgb(153, 102, 255)',
    grey: 'rgb(201, 203, 207)',
    white: 'rgb(0, 0, 0)'
};

var ctx = document.getElementById('cnvCPUTotal').getContext('2d');
var chart = new Chart(ctx, {
    type: 'line',
    data: {
        datasets: [{
            label: 'CPU Total',
            backgroundColor: Color(chartColors.red).alpha(0.3).rgbString(),
            borderColor: chartColors.red,
            fill: true,
            cubicInterpolationMode: 'default',
            data: [],
            pointRadius: 0
        }, {
            label: 'Average of all cores',
            backgroundColor: Color(chartColors.green).alpha(0.3).rgbString(),
            borderColor: chartColors.green,
            fill: true,
            cubicInterpolationMode: 'default',
            data: [],
            pointRadius: 0
        }, {
            label: 'Memory Usage',
            backgroundColor: Color(chartColors.blue).alpha(0.3).rgbString(),
            borderColor: chartColors.blue,
            fill: true,
            cubicInterpolationMode: 'default',
            data: [],
            pointRadius: 0
        }, ]
    },
    options: {
        legend: {
            labels: {
                fontColor: 'lightgrey',
            }
        },
        responsive: true,
        //maintainAspectRatio: false,
        scales: {
            xAxes: [{
                type: 'realtime',
                display: true,
                ticks: {
                    fontColor: 'lightgrey',
                }
            }],
            yAxes: [{
                type: 'linear',
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: 'Percentage'
                },
                ticks: {
                    suggestedMin: 0,
                    suggestedMax: 100,
                    fontColor: 'white',
                },
            }]
        },
        tooltips: {
            enabled: false
            // intersect: false
        },
        hover: {
            mode: 'point',
        },
        plugins: {
            streaming: {
                duration: 40000,
                refresh: 1000,
                delay: 2000,
            }
        }
    }
});

function AddTick(perfoTick) {
    chart.data.datasets[0].data.push({
        x: moment(),
        y: perfoTick.CPUTotal
    });
    chart.data.datasets[1].data.push({
        x: moment(),
        y: perfoTick.AverageCores
    });
    chart.data.datasets[2].data.push({
        x: moment(),
        y: perfoTick.MemoryAvailable
    });
}