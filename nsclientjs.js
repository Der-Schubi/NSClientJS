function RefreshEntries() {
  if (document.hidden !== true)
  {
    $.ajax({
      url: ns_url+'/api/v1/entries?token='+token,
      cache: 'false',
      method: 'GET',
      timeout: 1000,
      success: function(response)
      {
        try
        {
          var firstLine = response.slice(0, response.indexOf("\n"));
          var words = firstLine.split('	');

          $('#BGValue').text(words[2]);

          var trend = words[3].replace(/['"]+/g, '');
          if (trend == 'Flat') {
            $('#BGTrend').text('→');
          } else if (trend == 'FortyFiveUp') {
            $('#BGTrend').text('↗');
          } else if (trend == 'SingleUp') {
            $('#BGTrend').text('↑');
          } else if (trend == 'DoubleUp') {
            $('#BGTrend').text('↑↑');
          } else if (trend == 'FortyFiveDown') {
            $('#BGTrend').text('↘');
          } else if (trend == 'SingleDown') {
            $('#BGTrend').text('↓');
          } else if (trend == 'DoubleDown') {
            $('#BGTrend').text('↓↓');
          }

          //$('#Debug').text(response);
        }
        catch( e )
        {
          $('#BGValue').text('N/A');
        }
      },
    });
  }
  setTimeout(RefreshEntries, 5000);
}

$(document).ready(function() {
  $('#BGValue').text('[loading]');
  RefreshEntries();
});

