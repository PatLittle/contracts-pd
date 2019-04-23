function consumeData(data) {
  var periods = _.uniq(_.map(_.pluck(data, 'reporting_period'), function(period) {
    return period.substring(0, period.length-3)
  }));

  var mappedData = _.map(periods, function(period){
     var length = _.reject(data, function(el){
           return (el.reporting_period.indexOf(period) < 0);
     }).length;
     return {period: period, count: length};
   });

   drawBarGraph('myChart', mappedData);
   populateTable(mappedData);
}


d3.csv("contracts-nil.csv", function(data) {
  consumeData(data);
});
