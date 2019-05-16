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








function drawBarChart(id, data, x_axis, y_axis) {

  console.log(data);
  if (y_axis != 'Number') {
    _.map(data, function(obj) {
      obj['Value original'] = parseInt(obj['Value original'].replace(/,/g, '').replace('$', ''));
      obj['Value amendment'] = parseInt(obj['Value amendment'].replace(/,/g, '').replace('$', ''));
      obj['Value'] = parseInt(obj['Value'].replace(/,/g, '').replace('$', ''));
      return obj;
    });
  }

  var canvas = document.getElementById(id).getContext('2d');
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
