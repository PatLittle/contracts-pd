let myCharts = {};
Chart.plugins.unregister(ChartDataLabels);


function drawDoughnutChart(id, data, x_axis, y_axis) {

    if (y_axis == 'Value') {
      _.map(data, function(obj) {
        obj['Value'] = parseInt(obj['Value'].replace(/,/g, '').replace('$', ''));
        return obj;
      });
    }
  var canvas = document.getElementById(id).getContext('2d');
  var chartData = {
          labels: _.pluck(data, x_axis),
          datasets: [{
              label: '# of Votes',
              data: _.pluck(data, y_axis),
              backgroundColor: ['rgb(70, 191, 189)','rgb(252, 180, 92)','rgb(247, 70, 74)',],
              borderColor: 'white',
              borderWidth: 5,
          }]
    };

  var options = {
    animation: {
        duration: 2000
    },
    legend: {
      position: 'left',
      fullWidth: true,
      display: (id == 'chart2') ? false : true,
      onClick: function (e) {
        e.stopPropagation();
      }
    },
    devicePixelRatio: 1.5,
    title: {
      display: true,
      text: (id == 'chart1') ? 'Number of Contracts' : 'Dollar Value',
      position: 'top',
      padding: 20,
      fontSize: 16
    },
    plugins: {
      datalabels: {
        color: 'black',
        borderWidth: 10,
        align: 'center',
        formatter: function(value, context) {
          if (id == 'chart1') {
            return formatNumberMini(value) +'\n('+ data[context.dataIndex]['Percent of total number of contracts'] +')';
          } else if(id == 'chart2') {
              return formatDollarMini(value) +'\n('+ data[context.dataIndex]['Percent of total value'] +')';
          }
        }
      }
    }
  }

  myCharts[id] = new Chart(canvas, {
      type: 'doughnut',
      plugins: [ChartDataLabels],
      data: chartData,
      options: options
  });


}


function drawLineChart(id, data, x_axis, y_axis) {

    if (y_axis == 'Value') {
        for( type in data) {
            _.map(data[type], function(obj) {
                obj['Value'] = parseInt(obj['Value'].replace(/,/g, '').replace('$', ''));
                return obj;
            });
        }

    }
    console.log(data);
    var canvas = document.getElementById(id).getContext('2d');

    //Configure global variables for all lines
    // console.log("object: " + JSON.stringify(Chart.defaults));
    console.log(Chart.defaults);
    Chart.defaults.global.elements.line.fill = false;
    // Chart.defaults.global.elements.line.lineTension = 0.1;
    Chart.defaults.global.elements.line.borderCapStyle = 'square';
    Chart.defaults.global.elements.line.borderDash = []; // try [5, 15] for instance
    // Chart.defaults.global.elements.line.pointBorderColor = "black";
    // Chart.defaults.global.elements.line.pointBorderWidth = 1;
    // Chart.defaults.global.elements.line.pointHoverRadius = 8;
    // Chart.defaults.global.elements.line.pointHoverBackgroundColor = "yellow";
    // Chart.defaults.global.elements.line.pointHoverBorderColor = "brown";
    // Chart.defaults.global.elements.line.pointHoverBorderWidth = 2;
    // Chart.defaults.global.elements.line.pointRadius = 4;
    // Chart.defaults.global.elements.line.pointHitRadius = 10;

    if(id == 'chart5' || id == 'chart6') {
        var chartData = {
            labels: _.pluck(data["Total"], x_axis),
            datasets: [
                {
                  label: "Total",
                  backgroundColor: "rgb(204,0,0)",
                  borderColor: "rgb(204,0,0)",
                  data: _.pluck(data["Total"], y_axis),
                  // pointBorderColor: "black",
                  // pointBackgroundColor: "white",
                  lineTension: 0.2
                },
                {
                  label: "Service",
                  backgroundColor: "rgb(0,77,154)",
                  borderColor: "rgb(0,77,154)",
                  data: _.pluck(data["Service"], y_axis),
                  lineTension: 0.2
                },
                {
                  label: "Good",
                  backgroundColor: "rgb(70, 191, 189)",
                  borderColor: "rgb(70, 191, 189)",
                  data: _.pluck(data["Good"], y_axis),
                  lineTension: 0.2
                },
                {
                  label: "Construction",
                  backgroundColor: "orange",
                  borderColor: "orange",
                  data: _.pluck(data["Construction"], y_axis),
                  lineTension: 0.2
                },
            ]
        };
    } else {
        var chartData = {
            labels: _.pluck(data["Total"], x_axis),
            datasets: [
                {
                  label: "Total",
                  backgroundColor: "rgb(204,0,0)",
                  borderColor: "rgb(204,0,0)",
                  data: _.pluck(data["Total"], y_axis),
                  lineTension: 0.2
                },
                {
                  label: "Traditional Competitive",
                  backgroundColor: "rgb(0,77,154)",
                  borderColor: "rgb(0,77,154)",
                  data: _.pluck(data["TC"], y_axis),
                  lineTension: 0.2
                },
                {
                  label: "Open Bidding",
                  backgroundColor: "rgb(70, 191, 189)",
                  borderColor: "rgb(70, 191, 189)",
                  data: _.pluck(data["OB"], y_axis),
                  lineTension: 0.2
                },
                {
                  label: "Advanced Contract Award Notice",
                  backgroundColor: "orange",
                  borderColor: "orange",
                  data: _.pluck(data["AC"], y_axis),
                  lineTension: 0.2
                },
                {
                  label: "Traditional Non-Competitive",
                  backgroundColor: "rgb(0,154,0)",
                  borderColor: "rgb(0,154,0)",
                  data: _.pluck(data["TN"], y_axis),
                  lineTension: 0.2
                },
            ]
        };
    }


    var options = {
        legend: {
          display: true,
          position: 'bottom',
          align: 'left',
          labels: {
            usePointStyle: false,
            boxWidth: 25
          }
        }, 
        scales: {
            yAxes: [{
                ticks: {
                    callback: function(value, index, values) {
                        return (id == 'chart6' || id == 'chart8') ? formatNumberMini(value) : formatDollarMini(value);
                    },
                    beginAtZero:true
                },
                scaleLabel: {
                     display: true,
                     labelString: (id == 'chart5' || id == 'chart7') ? 'Value($)' : 'Number of contracts($)',
                     fontSize: 15,
                     fontColor: 'black'
                  }
            }]
        }
    };

  myCharts[id] = new Chart(canvas, {
      type: 'line',
      data: chartData,
      options: options
  });

  // var myLegendContainer = document.getElementById("legend");
  // myLegendContainer.innerHTML = myCharts[id].generateLegend();


}







function drawBarChart(id, data, x_axis, y_axis) {

  // console.log(data);
  if (y_axis != 'Number') {
    _.map(data, function(obj) {
      obj['Value original'] = parseInt(obj['Value original'].replace(/,/g, '').replace('$', ''));
      obj['Value amendment'] = parseInt(obj['Value amendment'].replace(/,/g, '').replace('$', ''));
      obj['Value'] = parseInt(obj['Value'].replace(/,/g, '').replace('$', ''));
      return obj;
    });
  }

  var canvas = document.getElementById(id).getContext('2d');
  console.log("labels: " + _.pluck(data, x_axis));
  console.log("label: " + _.pluck(data, y_axis));
  if(y_axis == "Number") {
    var chartData = {
          labels: _.pluck(data, x_axis),
          datasets: [{
              label: '# of Contracts',
              data: _.pluck(data, y_axis),
              backgroundColor: 'rgba(54, 162, 235, 1)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1
          }]
    };
  } else {
    var chartData = {
          labels: _.pluck(data, x_axis),
          datasets: [{
              label: 'Original value',
              data: _.pluck(data, "Value original"),
              backgroundColor: 'rgba(54, 162, 235, 1)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1
          },
          {
              label: 'Amendments',
              data: _.pluck(data, "Value amendment"),
              backgroundColor: 'rgb(64,224,208)',
              borderColor: 'rgb(64,224,208)',
              borderWidth: 1
          }]
    };
  }




  var options = {
    layout: {
      padding: {
        right: 50,
      }
    },
    title: {
      display: true,
      text: (id == 'chart3') ? 'Number of Contracts' : 'Dollar Value',
      position: 'top',
      padding: 20,
      fontSize: 16,
      fontColor: 'black'
    },
    legend: {
      display: (id == 'chart3') ? false : true,
      position: 'bottom',
      onClick: function (e) {
        e.stopPropagation();
      }
    },
      animation: {
          duration: 1500
      },
      devicePixelRatio: 1.5,
      scales: {
        xAxes: [{
          stacked: true,
          ticks: {
            callback: function(value, index, values) {
                return (id == 'chart3') ? formatNumberMini(value) : formatDollarMini(value);
            },
            fontColor: 'black'
          },
          gridLines: {
              display:false
          }
        }],
        yAxes: [{
            stacked: true,
            ticks: {
                // display: (id == 'chart3') ? true : false,
                beginAtZero: true,
                fontColor: 'black'
            },
            gridLines: {
                display:false
            }
        }]
      },
      plugins: {
        datalabels: {
          color: 'black',
          anchor: 'end',
          align: 'right',
          formatter: function(value, context) {
            if (id == 'chart3') {
              return formatNumberMini(value) +'\n('+ data[context.dataIndex]['Percent of total number of contracts'] +')';
            } else if(id == 'chart4') {
                if (context.datasetIndex === 1) {
                  return formatDollarMini(data[context.dataIndex]['Value']) +'\n('+ data[context.dataIndex]['Percent of total value'] +')';
                } else {
                  return '';
                }
            }
          }
        }
      }
  }

  myCharts[id] = new Chart(canvas, {
      type: 'horizontalBar',
      plugins: [ChartDataLabels],
      data: chartData,
      options: options
  });

}





function updateDoughnutChart(id, data, y_axis) {

  if (y_axis == 'Value') {
    _.map(data, function(obj) {
      obj['Value'] = parseInt(obj['Value'].replace(/,/g, '').replace('$', ''));
      return obj;
    })
  }
  var newData =  _.pluck(data, y_axis);
  myCharts[id].data.datasets[0].data = newData;

  // Update labels
  myCharts[id].options.plugins.datalabels.formatter = function(value, context) {
    if (id == 'chart1') {
      return formatNumberMini(value) +'\n('+ data[context.dataIndex]['Percent of total number of contracts'] +')';
    } else if(id == 'chart2') {
        return formatDollarMini(value) +'\n('+ data[context.dataIndex]['Percent of total value'] +')';
    }
  }

  myCharts[id].update();
}


function updateLineChart(id, data, x_axis, y_axis) {

  if (y_axis == 'Value') {
    for( type in data) {
        _.map(data[type], function(obj) {
            obj['Value'] = parseInt(obj['Value'].replace(/,/g, '').replace('$', ''));
            return obj;
        });
    }
  }

  myCharts[id].data.labels = _.pluck(data["Total"], x_axis);
  myCharts[id].data.datasets[0].data = _.pluck(data['Total'], y_axis);
  if(id == 'chart5' || id == 'chart6') {
    myCharts[id].data.datasets[1].data = _.pluck(data['Service'], y_axis);
    myCharts[id].data.datasets[2].data = _.pluck(data['Good'], y_axis);
    myCharts[id].data.datasets[3].data = _.pluck(data['Construction'], y_axis);
  } else if (id == 'chart7' || id == 'chart8') {
    myCharts[id].data.datasets[1].data = _.pluck(data['TC'], y_axis);
    myCharts[id].data.datasets[2].data = _.pluck(data['OB'], y_axis);
    myCharts[id].data.datasets[3].data = _.pluck(data['AC'], y_axis);
    myCharts[id].data.datasets[4].data = _.pluck(data['TN'], y_axis);
  }
  console.log(_.pluck(data['OB'], y_axis));
  myCharts[id].update();
}




function updateBarChart(id, data, y_axis) {

  if (id == 'chart3') {
    var newData =  _.pluck(data, y_axis);
    myCharts[id].data.datasets[0].data = newData;
  } else if (id == 'chart4') {
    _.map(data, function(obj) {
      obj['Value original'] = parseInt(obj['Value original'].replace(/,/g, '').replace('$', ''));
      obj['Value amendment'] = parseInt(obj['Value amendment'].replace(/,/g, '').replace('$', ''));
      obj['Value'] = parseInt(obj['Value'].replace(/,/g, '').replace('$', ''));
      return obj;
    })
    var data1 = _.pluck(data, 'Value original');
    var data2 = _.pluck(data, 'Value amendment');
    myCharts[id].data.datasets[0].data = data1;
    myCharts[id].data.datasets[1].data = data2;
  }


  // Update labels
  myCharts[id].options.plugins.datalabels.formatter = function(value, context) {
    if (id == 'chart3') {
      return formatNumberMini(value) +'\n('+ data[context.dataIndex]['Percent of total number of contracts'] +')';
    } else if(id == 'chart4') {
        if (context.datasetIndex === 1) {
          return formatDollarMini(data[context.dataIndex]['Value']) +'\n('+ data[context.dataIndex]['Percent of total value'] +')';
        } else {
          return '';
        }
    }
  }

  myCharts[id].update();
}
