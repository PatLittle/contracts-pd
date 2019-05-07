

function drawBarGraph(id, data, x_axis, y_axis) {

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
