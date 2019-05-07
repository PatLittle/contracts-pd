
let formatDollar = function(d) { return "$" + d3.format(",.0f")(d).replace(/G/,"B"); }
let formatPercent = function(d) { return d3.format(".1f")(d) + "%"; }

function spendingPerType(data) {

  var typeGroup =  _.chain(data).groupBy('commodity_type').value();
  let result = [];
  for (var index in typeGroup) {
    var contracts_count = _.reduce(_.pluck(typeGroup[index], 'contracts_count'), function(memo, num) { return memo + parseInt(num) },0);
    var original_value = _.reduce(_.pluck(typeGroup[index], 'original_value'), function(memo, num){ return memo + parseInt(num); }, 0);
    var percent_total = 100 * (contracts_count / _.reduce(_.pluck(data, 'contracts_count'), function(memo, num){ return memo + parseInt(num); }, 0));
    var percent_total_value = 100 * (original_value / _.reduce(_.pluck(data, 'original_value'), function(memo, num){ return memo + parseInt(num); }, 0));
    result.push({
      "Commodity type": index,
      "Number": contracts_count,
      "Percent of total number of contracts": formatPercent(percent_total),
      "Value" : formatDollar(original_value),
      "Percent of total value": formatPercent(percent_total_value)
    });
  }
  return result;
}



function consumeData(error, under25k_data, over25k_data) {

  if (error){
      console.log("Error on data load");
  }


  // Table 1 = tables 2 + 3
  function drawChart1(){
    let output = spendingPerType(_.union(under25k_data, over25k_data));
    console.log(JSON.stringify(output));
    populateTable(output, 'table1');
    drawBarGraph('chart1', output, "Commodity type", "Number");
  }

  // Table 2
  function drawChart2(){
    let under25k_output = spendingPerType(under25k_data);
    console.log(JSON.stringify(under25k_output));
    populateTable(under25k_output, 'table2');
    drawBarGraph('chart2', under25k_output, "Commodity type", "Number");
  }

  // Table 3
  function drawChart3(){
    let over25k_output = spendingPerType(over25k_data);
    console.log(JSON.stringify(over25k_output));
    populateTable(over25k_output, 'table3');
    drawBarGraph('chart3', over25k_output, "Commodity type", "Number");
  }


// Animate Chart drawing using Materialize
  var options = [
    {selector: '#chart1', offset:150, callback: drawChart1},
    {selector: '#chart2', offset:150, callback: drawChart2},
    {selector: '#chart3', offset:150, callback: drawChart3}
  ];
  Materialize.scrollFire(options);



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
