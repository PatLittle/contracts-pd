

function drawBarGraph(id, data) {

  var canvas = document.getElementById(id).getContext('2d');
  var data = {
          labels: _.pluck(data, 'period'),
          datasets: [{
              label: '# of Votes',
              data: _.pluck(data, 'count'),
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
