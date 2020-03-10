
let formatDollar = function(d) { return "$" + d3.format(",.0f")(d).replace(/G/,"B"); }
let formatDollarMini = function(d) { return "$" + d3.format(".2s")(d).replace(/G/,"B"); }
let formatPercent = function(d) { return d3.format(".1f")(d) + "%"; }
let formatNumberMini = function(d) { return d3.format(".2s")(d).replace(/G/,"B"); }

var url = window.location.href;
var fr_page = (url.indexOf('contracts-fr.html') > -1) ? true : false;

var fr_json = JSON.parse($.ajax({ 
        url: 'translate.json', 
        async: false
      }).responseText);

// Get french translations
function trans(str) {
  return (fr_page) ? fr_json[str] : str;
}

function spendingPerYear(data, dep_name, chartType) {

  console.log("trans('All'): " + trans('All'));
  if (dep_name == trans('All')) {
    typeGroup = _.chain(data).groupBy(chartType).mapObject(function(dep) {
     return _.groupBy(dep, 'year');
    }).value();
    yearGroup = _.chain(data).groupBy('year').value();
  } else {
    data = _.filter(data, function(row) { return row[trans('department_en')] == dep_name })
    typeGroup = _.chain(data).groupBy(chartType).mapObject(function(dep) {
      return _.groupBy(dep, 'year');
    }).value();
    yearGroup = _.chain(data).groupBy('year').value();
  }

  let result = {};
  let result_total = [];

  for (var type in typeGroup) {
    var resultPerType = []
    for (var year in typeGroup[type]) {
      var contracts_count_total = _.reduce(_.pluck(yearGroup[year], 'contracts_count'), function(memo, num){ return memo + parseInt(num); }, 0);
      var value_total = _.reduce(_.pluck(yearGroup[year], 'original_value'), function(memo, num){ return memo + parseInt(num); }, 0) + _.reduce(_.pluck(yearGroup[year], 'amendment_value'), function(memo, num){ return memo + parseInt(num); }, 0);
      var contracts_count = _.reduce(_.pluck(typeGroup[type][year], 'contracts_count'), function(memo, num) { return memo + parseInt(num) },0);
      var original_value = _.reduce(_.pluck(typeGroup[type][year], 'original_value'), function(memo, num){ return memo + parseInt(num); }, 0);
      var amendment_value = _.reduce(_.pluck(typeGroup[type][year], 'amendment_value'), function(memo, num){ return memo + parseInt(num); }, 0);
      var percent_total = 100 * (contracts_count / contracts_count_total);
      var percent_total_value = 100 * ((original_value + amendment_value) / value_total);
      if (chartType == 'commodity_type_en') {
        resultPerType.push({
          "Year" : year,
          "Commodity type": type,
          "Number": contracts_count,
          "Percent of total number of contracts": formatPercent(percent_total),
          "Value" : formatDollar(original_value + amendment_value),
          "Percent of total value": formatPercent(percent_total_value)
        });
      } else if (chartType == 'solicitation_code') {
        resultPerType.push({
          "Year" : year,
          "Solicitation procedure": type,
          "Number": contracts_count,
          "Percent of total number of contracts": formatPercent(percent_total),
          "Value" : formatDollar(original_value + amendment_value),
          "Percent of total value": formatPercent(percent_total_value)
        });
      }

    }
    result[type] = resultPerType;
  }

  for (year in yearGroup) {
    var contracts_count_total = _.reduce(_.pluck(yearGroup[year], 'contracts_count'), function(memo, num){ return memo + parseInt(num); }, 0);
    var value_total = _.reduce(_.pluck(yearGroup[year], 'original_value'), function(memo, num){ return memo + parseInt(num); }, 0) + _.reduce(_.pluck(yearGroup[year], 'amendment_value'), function(memo, num){ return memo + parseInt(num); }, 0);
    if (chartType == 'commodity_type_en') {
      result_total.push({
        "Year" : year,
        "Commodity type": "Total",
        "Number": contracts_count_total,
        "Percent of total number of contracts": "100%",
        "Value" : formatDollar(value_total),
        "Percent of total value": "100%"
      });
    } else if (chartType == 'solicitation_code') {
      result_total.push({
        "Year" : year,
        "Solicitation procedure": "Total",
        "Number": contracts_count_total,
        "Percent of total number of contracts": "100%",
        "Value" : formatDollar(value_total),
        "Percent of total value": "100%"
      });
    }
  }
  result['Total'] = result_total;
  // console.log(result);
  return result;
}


function getContractRange(under10k, over10k) {
  let range = d3.select('#commodity_value_range').property("value");
  if (range == 'under10k'){
    return under10k;
  } else if (range == 'over10k') {
    return over10k;
  } else {
    return _.union(under10k, over10k);
  }
}


function consumeData(error, under10k_data, over10k_data) {

  if (error){
      console.log("Error on data load");
  }

  var deps_list = _.sortBy(_.uniq(_.pluck(_.union(under10k_data, over10k_data),trans('department_en'))), function (dep) {return dep});
  deps_list.unshift(trans('All'));
  var deps_list_over_10k = _.sortBy(_.uniq(_.pluck(over10k_data,trans('department_en'))), function (dep) {return dep});
  deps_list_over_10k.unshift(trans('All'));
  // console.log(deps_list);
  // console.log(deps_list_under_10k);
  // _.sortBy(["Bob", "Mary", "Alice"], function (name) {return name});
  
  // load select list options
  var select_commodity_dep = d3.select("#commodity_dep");
  select_commodity_dep.selectAll("option")
      .data(deps_list)
      .enter()
      .append("option")
        // .attr("value", function (d) { return d; })
        .text(function (d) {
          return d;
        });

  var select_solicit_dep = d3.select("#solicit_dep");
  select_solicit_dep.selectAll("option")
      .data(deps_list_over_10k)
      .enter()
      .append("option")
        // .attr("value", function (d) { return d; })
        .text(function (d) { 
          return d; 
        });




    
  


  // // Table 1
  // let table1_output = spendingPerType(_.union(under10k_data, over10k_data));
  let table5_output = spendingPerYear(_.union(under10k_data, over10k_data), trans('All'), 'commodity_type_en');
  let table6_output = spendingPerYear(over10k_data, trans('All'), 'solicitation_code');

  populateTable(table5_output, 'table5');
  populateTable(table6_output, 'table6');



  d3.select('#commodity_dep').on('change', function(){
    let sel_dep = d3.select('#commodity_dep').property("value");
    let range = getContractRange(under10k_data, over10k_data);
    let table5_output = spendingPerYear(range, sel_dep, 'commodity_type_en');
    updateTable(table5_output, 'table5');
    updateLineChart('chart5', table5_output, 'Year', 'Value');
    updateLineChart('chart6', table5_output, 'Year', 'Number');
    console.log(table5_output);
  });

  d3.select('#commodity_value_range').on('change', function(){
    let sel_dep = d3.select('#commodity_dep').property("value");
    let range = getContractRange(under10k_data, over10k_data);
    let table5_output = spendingPerYear(range, sel_dep, 'commodity_type_en');
    updateTable(table5_output, 'table5');
    updateLineChart('chart5', table5_output, 'Year', 'Value');
    updateLineChart('chart6', table5_output, 'Year', 'Number');
    console.log(table5_output);
  });

  d3.select('#solicit_dep').on('change', function(){
    let sel_dep = d3.select('#solicit_dep').property("value");
    let table6_output = spendingPerYear(over10k_data, sel_dep, 'solicitation_code');
    updateTable(table6_output, 'table6');
    updateLineChart('chart7', table6_output, 'Year', 'Value');
    updateLineChart('chart8', table6_output, 'Year', 'Number');
    console.log(table6_output);
  });

  function drawChart5(){
    drawLineChart('chart5', table5_output, 'Year', 'Value');
  }

  function drawChart6(){
    drawLineChart('chart6', table5_output, 'Year', 'Number');
  }

  function drawChart7(){
    drawLineChart('chart7', table6_output, 'Year', 'Value');
  }

  function drawChart8(){
    drawLineChart('chart8', table6_output, 'Year', 'Number');
  }

// Animate Chart drawing using Materialize
  var options = [
    // {selector: '#chart1', offset:50, callback: drawChart1},
    // {selector: '#chart2', offset:50, callback: drawChart2},
    {selector: '#chart5', offset:50, callback: drawChart5},
    {selector: '#chart6', offset:50, callback: drawChart6},
    {selector: '#chart7', offset:50, callback: drawChart7},
    {selector: '#chart8', offset:50, callback: drawChart8},
    // {selector: '#chart3', offset:50, callback: drawChart3},
    // {selector: '#chart4', offset:50, callback: drawChart4}
  ];
  Materialize.scrollFire(options);

}





d3.queue()
  .defer(d3.csv, 'contracts_viz_under_10k.csv')
  .defer(d3.csv, 'contracts_viz_over_10k.csv')
  // .defer(d3.csv, 'https://open.canada.ca/static/dv/contracts/data/contracts_under_25k.csv')
  // .defer(d3.csv, 'https://open.canada.ca/static/dv/contracts/data/contracts_over_25k.csv')
  .await(consumeData); //only function name is needed
