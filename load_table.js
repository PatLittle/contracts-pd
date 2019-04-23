
function populateTable(data) {

  let tableData = _.map(data, function(obj) {
    return [obj.period, obj.count];
  });

  let headers = _.map(_.keys(data[0]), function(header) {
    return { title: header };
  });

  $(document).ready(function() {
    $('#table_id').DataTable( {
      paging : false,
      searching : false,
      bInfo : false,
      ordering: false,
      data: tableData,
      columns: headers
    });
  });

}
