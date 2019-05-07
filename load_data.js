
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


function solicitationData(data) {
  var solicitationGroup =  _.chain(data).groupBy('solicitation_procedure_code').value();
  let result = [];
  for (var index in solicitationGroup) {
    var contracts_count = _.reduce(_.pluck(solicitationGroup[index], 'contracts_count'), function(memo, num) { return memo + parseInt(num) },0);
    var original_value = _.reduce(_.pluck(solicitationGroup[index], 'original_value'), function(memo, num){ return memo + parseInt(num); }, 0);
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
  console.log(result);
  return result;
}



function consumeData(error, under25k_data, over25k_data) {

  if (error){
      console.log("Error on data load");
  }

  // Table 1 = tables 2 + 3
  let table1_output = spendingPerType(_.union(under25k_data, over25k_data));
  populateTable(table1_output, 'table1');
  function drawChart1(){
    drawBarGraph('chart1', table1_output, "Commodity type", "Number");
  }

  // Table 2
  let table2_output = spendingPerType(under25k_data);
  populateTable(table2_output, 'table2');
  function drawChart2(){
    drawBarGraph('chart2', table2_output, "Commodity type", "Number");
  }

  // Table 3
  let table3_output = spendingPerType(over25k_data);
  populateTable(table3_output, 'table3');
  function drawChart3(){
    drawBarGraph('chart3', table3_output, "Commodity type", "Number");
  }


  // Table 4
  let table4_output = solicitationData(over25k_data);






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
