
let formatDollar = function(d) { return "$" + d3.format(",.0f")(d).replace(/G/,"B"); }
let formatPercent = function(d) { return d3.format(".1f")(d) + "%"; }

function spendingPerType(data) {

  var typeGroup =  _.chain(data).groupBy('commodity_type_en').value();
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
  var solicitationGroup =  _.chain(data).groupBy('solicitation_code').value();
  console.log(solicitationGroup);
  let result = [];

  var contracts_count_total = _.reduce(_.pluck(data, 'contracts_count'), function(memo, num){ return memo + parseInt(num); }, 0);
  var original_value_total =  _.reduce(_.pluck(data, 'original_value'), function(memo, num){ return memo + parseInt(num); }, 0);
  var amendment_value_total =  _.reduce(_.pluck(data, 'amendment_value'), function(memo, num){ return memo + parseInt(num); }, 0);
  var value_total = original_value_total + amendment_value_total;

  var contracts_count_OB = _.reduce(_.pluck(solicitationGroup['OB'], 'contracts_count'), function(memo, num) { return memo + parseInt(num) },0);
  var original_value_OB = _.reduce(_.pluck(solicitationGroup['OB'], 'original_value'), function(memo, num){ return memo + parseInt(num); }, 0);
  var amendment_value_OB = _.reduce(_.pluck(solicitationGroup['OB'], 'amendment_value'), function(memo, num){ return memo + parseInt(num); }, 0);
  var value_OB = original_value_OB + amendment_value_OB;

  var contracts_count_TC = _.reduce(_.pluck(solicitationGroup['TC'], 'contracts_count'), function(memo, num) { return memo + parseInt(num) },0);
  var original_value_TC = _.reduce(_.pluck(solicitationGroup['TC'], 'original_value'), function(memo, num){ return memo + parseInt(num); }, 0);
  var amendment_value_TC = _.reduce(_.pluck(solicitationGroup['TC'], 'amendment_value'), function(memo, num){ return memo + parseInt(num); }, 0);
  var value_TC = original_value_TC + amendment_value_TC;

  var contracts_count_AC = _.reduce(_.pluck(solicitationGroup['AC'], 'contracts_count'), function(memo, num) { return memo + parseInt(num) },0);
  var original_value_AC = _.reduce(_.pluck(solicitationGroup['AC'], 'original_value'), function(memo, num){ return memo + parseInt(num); }, 0);
  var amendment_value_AC = _.reduce(_.pluck(solicitationGroup['AC'], 'amendment_value'), function(memo, num){ return memo + parseInt(num); }, 0);
  var value_AC = original_value_AC + amendment_value_AC;

  var contracts_count_TN = _.reduce(_.pluck(solicitationGroup['TN'], 'contracts_count'), function(memo, num) { return memo + parseInt(num) },0);
  var original_value_TN = _.reduce(_.pluck(solicitationGroup['TN'], 'original_value'), function(memo, num){ return memo + parseInt(num); }, 0);
  var amendment_value_TN = _.reduce(_.pluck(solicitationGroup['TN'], 'amendment_value'), function(memo, num){ return memo + parseInt(num); }, 0);
  var value_TN = original_value_TN + amendment_value_TN;



  result.push({
    "Solicitation procedure for construction": "Electronic Bidding",
    "Number": contracts_count_OB,
    "Percent of total number of contracts": formatPercent(100 * (contracts_count_OB / contracts_count_total)),
    "Value" : formatDollar(original_value_OB),
    "Percent of total value": formatPercent(100 * (original_value_OB / original_value_total)),
    "Section" : "Competitive awards"
  },
  {
    "Solicitation procedure for construction": "Traditional Competitive",
    "Number": contracts_count_TC,
    "Percent of total number of contracts": formatPercent(100 * (contracts_count_TC / contracts_count_total)),
    "Value" : formatDollar(original_value_TC),
    "Percent of total value": formatPercent(100 * (original_value_TC / original_value_total)),
    "Section" : "Competitive awards"
  },
  {
    "Solicitation procedure for construction": "Total competitive awards",
    "Number": contracts_count_OB + contracts_count_TC,
    "Percent of total number of contracts": formatPercent(100 * ((contracts_count_OB + contracts_count_TC) / contracts_count_total)),
    "Value" : formatDollar(original_value_OB + original_value_TC),
    "Percent of total value": formatPercent(100 * ((original_value_OB + original_value_TC) / original_value_total)),
    "Section" : "Competitive awards"
  },
  {
    "Solicitation procedure for construction": "Net competitive amendments",
    "Number": "N/A",
    "Percent of total number of contracts": "N/A",
    "Value" : formatDollar(amendment_value_OB + amendment_value_TC),
    "Percent of total value": formatPercent(100 * ((amendment_value_OB + amendment_value_TC) / amendment_value_total)),
    "Section" : "Competitive awards"
  },
  {
    "Solicitation procedure for construction": "Subtotal competitive awards, including amendments",
    "Number": contracts_count_OB + contracts_count_TC,
    "Percent of total number of contracts": formatPercent(100 * ((contracts_count_OB + contracts_count_TC) / contracts_count_total)),
    "Value" : formatDollar(value_OB + value_TC),
    "Percent of total value": formatPercent(100 * ((value_OB + value_TC) / value_total)),
    "Section" : "Competitive awards"
  },
  {
    "Solicitation procedure for construction": "Advance contract Award Notice (ACAN)",
    "Number": contracts_count_AC,
    "Percent of total number of contracts": formatPercent(100 * (contracts_count_AC / contracts_count_total)),
    "Value" : formatDollar(original_value_AC),
    "Percent of total value": formatPercent(100 * (original_value_AC / original_value_total)),
    "Section" : "Competitive awards"
  },
  {
    "Solicitation procedure for construction": "Net ACAN amendments",
    "Number": "N/A",
    "Percent of total number of contracts": "N/A",
    "Value" : formatDollar(amendment_value_AC),
    "Percent of total value": formatPercent(100 * (amendment_value_AC / amendment_value_total)),
    "Section" : "Competitive awards"
  },
  {
    "Solicitation procedure for construction": "Subtotal competitive awards and ACANs, including amendments",
    "Number": contracts_count_OB + contracts_count_TC + contracts_count_AC,
    "Percent of total number of contracts": formatPercent(100 * ((contracts_count_OB + contracts_count_TC + contracts_count_AC) / contracts_count_total)),
    "Value" : formatDollar(value_OB + value_TC + value_AC),
    "Percent of total value": formatPercent(100 * ((value_OB + value_TC + value_AC) / value_total)),
    "Section" : "Competitive awards"
  },
  {
    "Solicitation procedure for construction": "Non-competitive awards",
    "Number": contracts_count_TN,
    "Percent of total number of contracts": formatPercent(100 * (contracts_count_TN / contracts_count_total)),
    "Value" : formatDollar(original_value_TN),
    "Percent of total value": formatPercent(100 * (original_value_TN / original_value_total)),
    "Section" : "Non-competitive awards"
  },
  {
    "Solicitation procedure for construction": "Net amendments",
    "Number": "N/A",
    "Percent of total number of contracts": "N/A",
    "Value" : formatDollar(amendment_value_TN),
    "Percent of total value": formatPercent(100 * (amendment_value_TN / value_total)),
    "Section" : "Non-competitive awards"
  },
  {
    "Solicitation procedure for construction": "Non-competitive awards, including amendments",
    "Number": contracts_count_TN,
    "Percent of total number of contracts": formatPercent(100 * (contracts_count_TN / contracts_count_total)),
    "Value" : formatDollar(value_TN),
    "Percent of total value": formatPercent(100 * (value_TN / value_total)),
    "Section" : "Non-competitive awards"
  },
  {
    "Solicitation procedure for construction": "Total contracts $25,000 and above",
    "Number": contracts_count_OB + contracts_count_TC + contracts_count_AC + contracts_count_TN,
    "Percent of total number of contracts": formatPercent(100 * ((contracts_count_OB + contracts_count_TC + contracts_count_AC + contracts_count_TN) / contracts_count_total)),
    "Value" : formatDollar(value_OB + value_TC + value_AC + value_TN),
    "Percent of total value": formatPercent(100 * ((value_OB + value_TC + value_AC + value_TN) / value_total)),
    "Section" : "Total awards"
  });


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
  populateCustomTable(table4_output, 'table4');






// Animate Chart drawing using Materialize
  var options = [
    {selector: '#chart1', offset:150, callback: drawChart1},
    {selector: '#chart2', offset:150, callback: drawChart2},
    {selector: '#chart3', offset:150, callback: drawChart3}
  ];
  Materialize.scrollFire(options);

}





d3.queue()
  .defer(d3.csv, 'contracts_dv_under_25k.csv')
  .defer(d3.csv, 'contracts_dv_over_25k.csv')
  .await(consumeData); //only function name is needed
