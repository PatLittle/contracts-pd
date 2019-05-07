
function populateTable(data, id) {

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
      columns: headers
    });
  });

}
