
function populateTable(data, id) {

  // console.log(data);

  if (id == 'table5' || id == 'table6') {
    // data = _.map(data, function(obj) {
    //   return _.values(obj);
    // });
    newData = [];
    for (index in data) {
      newData = _.union(newData, data[index]);
    }
    data = newData;
    console.log(data);
  }

  

  let tableData = _.map(data, function(obj) {
    return _.values(obj);
  });

  // replace acronyms with full names
  _.each(tableData, function(obj) {
    _.each(obj, function(value, key) {
      if(value === 'TN') obj[key] = trans('Traditional Non-Competitive');
      if(value === 'TC') obj[key] = trans('Traditional Competitive');
      if(value === 'OB') obj[key] = trans('Open Bidding');
      if(value === 'AC') obj[key] = trans('Advanced Contract Award Notice');
    });
  });

  console.log(tableData);


  let headers = _.map(_.keys(data[0]), function(header) {
    return { title: trans(header) };
  });

  if (id == 'table3' || id == 'table4') {
    $(document).ready(function() {
      $('#'+id).DataTable( {
        searching : false,
        bInfo : false,
        data: tableData,
        columns: headers,
        scrollY:        "600px",
        scrollX:        true,
        scrollCollapse: true,
        paging:         false,
        fixedColumns:   {
            leftColumns: 2
        }
      });
    });
  } else {
    $(document).ready(function() {
      $('#'+id).DataTable( {
        paging : false,
        searching : false,
        bInfo : false,
        data: tableData,
        columns: headers
      });
    });
  }
}



function populateCustomTable(data, id) {

  let tableData = _.map(data, function(obj) {
    return _.values(obj);
  });

  let headers = _.map(_.keys(data[0]), function(header) {
    return { title: header };
  });

  $(document).ready(function() {
    $('#'+id).DataTable( {
      paging : false,
      searching : false,
      bInfo : false,
      ordering: false,
      data: tableData,
      columns: headers,
      rowGroup: {
        dataSrc: 5
      },
      columnDefs: [
        {
            "targets": [ 5 ],
            "visible": false,
        }
      ]
    });
  });

}



function updateTable(data, id) {
  $('#'+id).DataTable().destroy();
  console.log(data);
  if (id == 'table5' || id == 'table6') {
    // data = _.map(data, function(obj) {
    //   return _.values(obj);
    // });
    newData = [];
    for (index in data) {
      newData = _.union(newData, data[index]);
    }
    data = newData;
  }

  let tableData = _.map(data, function(obj) {
    return _.values(obj);
  });

  // replace acronyms with full names
  _.each(tableData, function(obj) {
    _.each(obj, function(value, key) {
      if(value === 'TN') obj[key] = trans('Traditional Non-Competitive');
      if(value === 'TC') obj[key] = trans('Traditional Competitive');
      if(value === 'OB') obj[key] = trans('Open Bidding');
      if(value === 'AC') obj[key] = trans('Advanced Contract Award Notice');
    });
  });

  let headers = _.map(_.keys(data[0]), function(header) {
    return { title: header };
  });

  var columnDefs = null;
  if (id == 'table2') {
    $('#'+id).DataTable( {
      paging : false,
      searching : false,
      bInfo : false,
      ordering: false,
      data: tableData,
      columns: headers,
      rowGroup: {
        dataSrc: 5
      },
      columnDefs: [
          {
            "targets": [ 5 ],
            "visible": false,
          }
      ]
    });
  } else {
    $('#'+id).DataTable( {
      paging : false,
      searching : false,
      bInfo : false,
      data: tableData,
      columns: headers,
      columnDefs: columnDefs
    });
  }
}
