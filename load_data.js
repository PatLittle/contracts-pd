
let formatDollar = function(d) { return "$" + d3.format(",.0f")(d).replace(/G/,"B"); }
let formatDollarMini = function(d) { return "$" + d3.format(".2s")(d).replace(/G/,"B"); }
let formatPercent = function(d) { return d3.format(".1f")(d) + "%"; }
let formatNumberMini = function(d) { return d3.format(".2s")(d).replace(/G/,"B"); }

function spendingPerType(data) {

  var typeGroup =  _.chain(data).groupBy('commodity_type_en').value();
  let result = [];
  var contracts_count_total = _.reduce(_.pluck(data, 'contracts_count'), function(memo, num){ return memo + parseInt(num); }, 0);
  var value_total = _.reduce(_.pluck(data, 'original_value'), function(memo, num){ return memo + parseInt(num); }, 0) + _.reduce(_.pluck(data, 'amendment_value'), function(memo, num){ return memo + parseInt(num); }, 0);

  for (var index in typeGroup) {
    var contracts_count = _.reduce(_.pluck(typeGroup[index], 'contracts_count'), function(memo, num) { return memo + parseInt(num) },0);
    var original_value = _.reduce(_.pluck(typeGroup[index], 'original_value'), function(memo, num){ return memo + parseInt(num); }, 0);
    var amendment_value = _.reduce(_.pluck(typeGroup[index], 'amendment_value'), function(memo, num){ return memo + parseInt(num); }, 0);
    var percent_total = 100 * (contracts_count / _.reduce(_.pluck(data, 'contracts_count'), function(memo, num){ return memo + parseInt(num); }, 0));
    var percent_total_value = 100 * ((original_value + amendment_value) / value_total);
    result.push({
      "Commodity type": index,
      "Number": contracts_count,
      "Percent of total number of contracts": formatPercent(percent_total),
      "Value" : formatDollar(original_value + amendment_value),
      "Percent of total value": formatPercent(percent_total_value)
    });
  }
  result.push({
    "Commodity type": "Total",
    "Number": contracts_count_total,
    "Percent of total number of contracts": "100%",
    "Value" : formatDollar(value_total),
    "Percent of total value": "100%"
  });
  // console.log("spendingPerType: " + JSON.stringify(result));
  return result;
}

function spendingPerYear(data, dep_name, chartType) {

  if (dep_name == 'All') {
    typeGroup = _.chain(data).groupBy(chartType).mapObject(function(dep) {
     return _.groupBy(dep, 'year');
    }).value();
    yearGroup = _.chain(data).groupBy('year').value();
  } else {
    data = _.filter(data, function(row) { return row['department_en'] == dep_name })
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

function numbersPerDept(data) {

  let deptGroup = _.chain(data).groupBy('department_en').value();

  let result = [];
  for (var dept in deptGroup) {
    var contracts_count_OB = _.reduce(_.pluck(_.filter(deptGroup[dept], function(row) { return row['solicitation_code'] == 'OB'}), 'contracts_count'), function(memo, num) { return memo + parseInt(num) },0);
    var contracts_count_TC = _.reduce(_.pluck(_.filter(deptGroup[dept], function(row) { return row['solicitation_code'] == 'TC'}), 'contracts_count'), function(memo, num) { return memo + parseInt(num) },0);
    var contracts_count_AC = _.reduce(_.pluck(_.filter(deptGroup[dept], function(row) { return row['solicitation_code'] == 'AC'}), 'contracts_count'), function(memo, num) { return memo + parseInt(num) },0);
    var contracts_count_competitive = contracts_count_OB + contracts_count_TC + contracts_count_AC;
    var contracts_count_TN = _.reduce(_.pluck(_.filter(deptGroup[dept], function(row) { return row['solicitation_code'] == 'TN'}), 'contracts_count'), function(memo, num) { return memo + parseInt(num) },0);
    var contracts_count_total = _.reduce(_.pluck(deptGroup[dept], 'contracts_count'), function(memo, num) { return memo + parseInt(num) },0);
    var percent_competitive = 100 * (contracts_count_competitive / contracts_count_total);
    result.push({
      "Department": dept,
      "Number - Electronic bidding": contracts_count_OB,
      "Number - Traditional competitive": contracts_count_TC,
      "Number - ACANs": contracts_count_AC,
      "Number - Competitive subtotal": contracts_count_competitive,
      "Number - Non-competitive": contracts_count_TN,
      "Per Cent Competitive": formatPercent(percent_competitive),
      "Number of Original Contracts": contracts_count_total,
    });
  }
  return result;
}


function valuesPerDept(data) {

  let deptGroup = _.chain(data).groupBy('department_en').value();

  let result = [];
  for (var dept in deptGroup) {
    var original_value_OB = _.reduce(_.pluck(_.filter(deptGroup[dept], function(row) { return row['solicitation_code'] == 'OB'}), 'original_value'), function(memo, num) { return memo + parseInt(num) },0);
    var amendment_value_OB = _.reduce(_.pluck(_.filter(deptGroup[dept], function(row) { return row['solicitation_code'] == 'OB'}), 'amendment_value'), function(memo, num) { return memo + parseInt(num) },0);
    var value_OB = original_value_OB + amendment_value_OB;

    var original_value_TC = _.reduce(_.pluck(_.filter(deptGroup[dept], function(row) { return row['solicitation_code'] == 'TC'}), 'original_value'), function(memo, num) { return memo + parseInt(num) },0);
    var amendment_value_TC = _.reduce(_.pluck(_.filter(deptGroup[dept], function(row) { return row['solicitation_code'] == 'TC'}), 'amendment_value'), function(memo, num) { return memo + parseInt(num) },0);
    var value_TC = original_value_TC + amendment_value_TC;

    var original_value_AC = _.reduce(_.pluck(_.filter(deptGroup[dept], function(row) { return row['solicitation_code'] == 'AC'}), 'original_value'), function(memo, num) { return memo + parseInt(num) },0);
    var amendment_value_AC = _.reduce(_.pluck(_.filter(deptGroup[dept], function(row) { return row['solicitation_code'] == 'AC'}), 'amendment_value'), function(memo, num) { return memo + parseInt(num) },0);
    var value_AC = original_value_AC + amendment_value_AC;

    var original_value_competitive = original_value_OB + original_value_TC + original_value_AC;
    var amendment_value_competitive = amendment_value_OB + amendment_value_TC + amendment_value_AC;
    var value_competitive = original_value_competitive + amendment_value_competitive;

    var original_value_TN = _.reduce(_.pluck(_.filter(deptGroup[dept], function(row) { return row['solicitation_code'] == 'TN'}), 'original_value'), function(memo, num) { return memo + parseInt(num) },0);
    var amendment_value_TN = _.reduce(_.pluck(_.filter(deptGroup[dept], function(row) { return row['solicitation_code'] == 'TN'}), 'amendment_value'), function(memo, num) { return memo + parseInt(num) },0);
    var value_TN = original_value_TN + amendment_value_TN;

    var original_value_total = _.reduce(_.pluck(deptGroup[dept], 'original_value'), function(memo, num) { return memo + parseInt(num) },0);
    var amendment_value_total = _.reduce(_.pluck(deptGroup[dept], 'amendment_value'), function(memo, num) { return memo + parseInt(num) },0);
    var value_total = original_value_total + amendment_value_total;

    var percent_competitive = 100 * (value_competitive / value_total);

    result.push({
      "Department": dept,
      "Value - Electronic bidding": formatDollar(original_value_OB),
      "Value - Traditional competitive": formatDollar(original_value_TC),
      "Value - ACANs": formatDollar(original_value_AC),
      "Value - Competitive subtotal": formatDollar(original_value_competitive),
      "Amendment Value - Competitive": formatDollar(amendment_value_competitive),
      "Total Value - Competitive": formatDollar(value_competitive),
      "Value - Non-competitive": formatDollar(original_value_TN),
      "Amendment Value Non-competitive": formatDollar(amendment_value_TN),
      "Total Value Non-competitive": formatDollar(value_TN),
      "Per Cent Competitive": formatPercent(percent_competitive),
      "Total Value": formatDollar(value_total),
    });
  }

  // console.log("result" + result)
  return result;
}


function solicitationData(data, vizType) {
  var solicitationGroup =  _.chain(data).groupBy('solicitation_code').value();
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


if (vizType == 'table') {
    result.push({
      "Solicitation procedure for construction": "Electronic Bidding",
      "Number": contracts_count_OB,
      "Percent of total number of contracts": formatPercent(100 * (contracts_count_OB / contracts_count_total)),
      "Value" : formatDollar(original_value_OB),
      "Percent of total value": formatPercent(100 * (original_value_OB / value_total)),
      "Section" : "Competitive awards"
    },
    {
      "Solicitation procedure for construction": "Traditional Competitive",
      "Number": contracts_count_TC,
      "Percent of total number of contracts": formatPercent(100 * (contracts_count_TC / contracts_count_total)),
      "Value" : formatDollar(original_value_TC),
      "Percent of total value": formatPercent(100 * (original_value_TC / value_total)),
      "Section" : "Competitive awards"
    },
    {
      "Solicitation procedure for construction": "Total competitive awards",
      "Number": contracts_count_OB + contracts_count_TC,
      "Percent of total number of contracts": formatPercent(100 * ((contracts_count_OB + contracts_count_TC) / contracts_count_total)),
      "Value" : formatDollar(original_value_OB + original_value_TC),
      "Percent of total value": formatPercent(100 * ((original_value_OB + original_value_TC) / value_total)),
      "Section" : "Competitive awards"
    },
    {
      "Solicitation procedure for construction": "Net competitive amendments",
      "Number": "N/A",
      "Percent of total number of contracts": "N/A",
      "Value" : formatDollar(amendment_value_OB + amendment_value_TC),
      "Percent of total value": formatPercent(100 * ((amendment_value_OB + amendment_value_TC) / value_total)),
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
      "Percent of total value": formatPercent(100 * (original_value_AC / value_total)),
      "Section" : "Competitive awards"
    },
    {
      "Solicitation procedure for construction": "Net ACAN amendments",
      "Number": "N/A",
      "Percent of total number of contracts": "N/A",
      "Value" : formatDollar(amendment_value_AC),
      "Percent of total value": formatPercent(100 * (amendment_value_AC / value_total)),
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
  } else if (vizType == 'chart') {
    result.push({
      "Solicitation procedure for construction": "Electronic Bidding",
      "Number": contracts_count_OB,
      "Percent of total number of contracts": formatPercent(100 * (contracts_count_OB / contracts_count_total)),
      "Value original" : formatDollar(original_value_OB),
      "Value amendment" : formatDollar(amendment_value_OB),
      "Value" : formatDollar(value_OB),
      "Percent of total value": formatPercent(100 * (value_OB / value_total)),
    },{
      "Solicitation procedure for construction": "Traditional Competitive",
      "Number": contracts_count_TC,
      "Percent of total number of contracts": formatPercent(100 * (contracts_count_TC / contracts_count_total)),
      "Value original" : formatDollar(original_value_TC),
      "Value amendment" : formatDollar(amendment_value_TC),
      "Value" : formatDollar(value_TC),
      "Percent of total value": formatPercent(100 * (value_TC / value_total)),
    },{
      "Solicitation procedure for construction": "Advance contract Award Notice",
      "Number": contracts_count_AC,
      "Percent of total number of contracts": formatPercent(100 * (contracts_count_AC / contracts_count_total)),
      "Value original" : formatDollar(original_value_AC),
      "Value amendment" : formatDollar(amendment_value_AC),
      "Value" : formatDollar(value_AC),
      "Percent of total value": formatPercent(100 * (value_AC / value_total)),
    },{
      "Solicitation procedure for construction": "Non-competitive awards",
      "Number": contracts_count_TN,
      "Percent of total number of contracts": formatPercent(100 * (contracts_count_TN / contracts_count_total)),
      "Value original" : formatDollar(original_value_TN),
      "Value amendment" : formatDollar(amendment_value_TN),
      "Value" : formatDollar(value_TN),
      "Percent of total value": formatPercent(100 * (value_TN / value_total)),
    });
  }


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

  var deps_list = _.sortBy(_.uniq(_.pluck(_.union(under10k_data, over10k_data),'department_en')), function (dep) {return dep});
  deps_list.unshift('All');
  var deps_list_over_10k = _.sortBy(_.uniq(_.pluck(over10k_data,'department_en')), function (dep) {return dep});
  deps_list_over_10k.unshift('All');
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

  // dropdown.selectAll("option")
  //         .data(cereals)
  //         .enter().append("option")
  //           .attr("value", function (d) { return d; })
  //           .text(function (d) {
  //           return d[0].toUpperCase() + d.slice(1,d.length); // capitalize 1st letter
  //       });



    
  


  // // Table 1
  // let table1_output = spendingPerType(_.union(under10k_data, over10k_data));
  let table5_output = spendingPerYear(_.union(under10k_data, over10k_data), 'All', 'commodity_type_en');
  let table6_output = spendingPerYear(over10k_data, 'All', 'solicitation_code');
  // // console.log(table1_output);
  // populateTable(table1_output, 'table1');
  populateTable(table5_output, 'table5');
  populateTable(table6_output, 'table6');
  // function drawChart1(){
  //   drawDoughnutChart('chart1', table1_output.slice(0,3), "Commodity type", "Number");
  // }
  // function drawChart2(){
  //   drawDoughnutChart('chart2', table1_output.slice(0,3), "Commodity type", "Value");
  // }

  // d3.select('#value_range').property("value","All").on('change', function(){
  //   let sel_value = d3.select('#value_range').property("value");
  //   if(sel_value == 'under10k') {
  //     table1_output = spendingPerType(under10k_data);
  //     updateTable(table1_output, 'table1');
  //     updateDoughnutChart('chart1', table1_output.slice(0,3), "Number");
  //     updateDoughnutChart('chart2', table1_output.slice(0,3), "Value");
  //   } else if(sel_value == 'over10k') {
  //     table1_output = spendingPerType(over10k_data);
  //     updateTable(table1_output, 'table1');
  //     updateDoughnutChart('chart1', table1_output.slice(0,3), "Number");
  //     updateDoughnutChart('chart2', table1_output.slice(0,3), "Value");
  //   } else {
  //     table1_output = spendingPerType(_.union(under10k_data, over10k_data));
  //     updateTable(table1_output, 'table1');
  //     updateDoughnutChart('chart1', table1_output.slice(0,3), "Number");
  //     updateDoughnutChart('chart2', table1_output.slice(0,3), "Value");
  //   }
  // });


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


  // // Table 2
  // var typeGroup =  _.chain(over10k_data).groupBy('commodity_type_en').value();
  // let table2_output = solicitationData(over10k_data, 'table');
  // let chart3_4_output = solicitationData(over10k_data, 'chart');
  // populateCustomTable(table2_output, 'table2');
  // function drawChart3() {
  //   drawBarChart('chart3', chart3_4_output, "Solicitation procedure for construction", "Number");
  // }
  // function drawChart4() {
  //   drawBarChart('chart4', chart3_4_output, "Solicitation procedure for construction", "Value");
  // }

  // d3.select('#commodity_type').property("value","All").on('change', function(){
  //   let sel_value = d3.select('#commodity_type').property("value");
  //   if(sel_value != 'All') {
  //     table2_output = solicitationData(typeGroup[sel_value], 'table');
  //     chart3_4_output = solicitationData(typeGroup[sel_value], 'chart');
  //     updateBarChart('chart3', chart3_4_output, "Number");
  //     updateBarChart('chart4', chart3_4_output, "Value");
  //   } else {
  //     table2_output = solicitationData(over10k_data, 'table');
  //     chart3_4_output = solicitationData(over10k_data, 'chart');
  //     updateBarChart('chart3', chart3_4_output, "Number");
  //     updateBarChart('chart4', chart3_4_output, "Value");
  //   }
  //   updateTable(table2_output, 'table2');
  // });

  // //Table 3
  // let table3_output = numbersPerDept(over10k_data);
  // populateTable(table3_output, 'table3');

  // //Table 4
  // let table4_output = valuesPerDept(over10k_data);
  // populateTable(table4_output, 'table4');






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
