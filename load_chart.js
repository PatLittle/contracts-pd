let myDoughnutCharts = {};
Chart.plugins.unregister(ChartDataLabels);


function drawDoughnutChart(id, data, x_axis, y_axis) {

    if (y_axis == 'Value') {
      _.map(data, function(obj) {
        obj['Value'] = parseInt(obj['Value'].replace(/,/g, '').replace('$', ''));
        console.log(obj['Value']);
        return obj;
      });
    }
  var canvas = document.getElementById(id).getContext('2d');
  console.log(data);
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
      display: (id == 'chart2') ? false : true
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
              console.log();
              return formatDollarMini(value) +'\n('+ data[context.dataIndex]['Percent of total value'] +')';
          }
        }
      }
    }
  }

  myDoughnutCharts[id] = new Chart(canvas, {
      type: 'doughnut',
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
  var data =  _.pluck(data, y_axis);
  myDoughnutCharts[id].data.datasets[0].data = data;
  myDoughnutCharts[id].update();
}



function drawBarChart(id, data, x_axis, y_axis) {

  var chartData = data.slice(0,2);
  console.log(data);
  console.log(chartData);

  var canvas = document.getElementById(id).getContext('2d');
  var data = {
          labels: _.pluck(data, x_axis),
          datasets: [{
              label: '# of Votes',
              data: _.pluck(data, y_axis),
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1
          }]
      }

  var options = {
      animation: {
          duration: 1500
      },
      devicePixelRatio: 1.5,
      scales: {
        yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
      }
  }

  var myBarChart = Chart.Bar(canvas, {
      data: data,
      options: options
  });

}
