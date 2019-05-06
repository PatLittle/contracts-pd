
let formatDollar = function(d) { return "$" + d3.format(",.0f")(d).replace(/G/,"B"); }
let formatPercent = function(d) { return d3.format(".1f")(d) + "%"; }

function consumeData(error, under25k_data, over25k_data) {

  if (error){
      console.log("Error on data load");
  }

  // Table 2
  var typeGroup =  _.chain(under25k_data).groupBy('commodity_type').value();

  let result = [];
  for (var index in typeGroup) {
    var contracts_count = _.reduce(_.pluck(typeGroup[index], 'contracts_count'), function(memo, num) { return memo + parseInt(num) },0);
    var original_value = _.reduce(_.pluck(typeGroup[index], 'original_value'), function(memo, num){ return memo + parseInt(num); }, 0);
    var percent_total = 100 * (contracts_count / _.reduce(_.pluck(under25k_data, 'contracts_count'), function(memo, num){ return memo + parseInt(num); }, 0));
    var percent_total_value = 100 * (original_value / _.reduce(_.pluck(under25k_data, 'original_value'), function(memo, num){ return memo + parseInt(num); }, 0));
    result.push({
      "Commodity type": index,
      "Number": contracts_count,
      "Percent of total number of contracts": formatPercent(percent_total),
      "Value" : formatDollar(original_value),
      "Percent of total value": formatPercent(percent_total_value)
    });
  }


  console.log(JSON.stringify(result));
  populateTable(result);
  drawBarGraph('myChart', result, "Commodity type", "Number");


}



d3.queue()
  .defer(d3.csv, 'under-25k.csv')
  .defer(d3.csv, 'over-25k.csv')
  .await(consumeData); //only function name is needed





// function consumeData(data) {
//   var periods = _.uniq(_.map(_.pluck(data, 'reporting_period'), function(period) {
//     return period.substring(0, period.length-3);
//   }));
//
//   var mappedData = _.map(periods, function(period){
//      var length = _.reject(data, function(el){
//            return (el.reporting_period.indexOf(period) < 0);
//      }).length;
//      return {period: period, count: length};
//    });
//
//    console.log(JSON.stringify(mappedData));
//    drawBarGraph('myChart', mappedData);
//    populateTable(mappedData);
//  }
//
//
// d3.csv("contracts-nil.csv", function(data) {
//   consumeData(data);
// });
