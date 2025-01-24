let url, token, unit;
var timerID = null;
var enableRefresh = false;

function showForm()
{
  $("#Form").css("display","block");
  $("#showButton").css("display","none");
  hidePage();
  enableRefresh = false;
  console.log('showForm');
}

function hideForm()
{
  $("#Form").css("display","none");
  $("#showButton").css("display","inline");
  showPage();
  enableRefresh = true;
  console.log('hideForm');
  RefreshEntries();
}

function showPage()
{
  $("#Page").css("display","block");
}

function hidePage()
{
  $("#Page").css("display","none");
}

$(document).ready(function()
{
  console.log('init');
  $('#BGValue').text('[loading]');

  // get the dom objects one time
  url = document.querySelector('#url');
  token = document.querySelector('#token');
  unit = document.querySelectorAll('input[name=unit]');

  let elems = Array.from(document.querySelectorAll('#mainForm input, #mainForm select'));
  elems.forEach(e => e.addEventListener('input', handleChange, false));

  let cached = getForm();
  console.log(cached);
  if(cached)
  {
    console.log('reading');
    url.value = cached.url;
    token.value = cached.token;
    if(cached.unit)
    {
      unit.forEach(d => {
        if(d.value === cached.unit) d.checked = true;
      });
    }
    enableRefresh = true;
  }
  else {
    console.log('no data');
    $("#mgdl").prop("checked", true)
    showForm();
  }

  document.querySelector('#mainForm').addEventListener('submit', () => {
    window.localStorage.removeItem('form');
  }, false);

  RefreshEntries();
  timerID = setInterval(function ()
  {
    RefreshEntries()
  }, 10000);
});

function RefreshEntries()
{
  if (document.hidden !== true && enableRefresh == true)
  {
    console.log('refresh');
    $.ajax({
      url: url.value+'/api/v1/entries?token='+token.value,
      cache: 'false',
      method: 'GET',
      timeout: 1000,
      success: function(response)
      {
        try
        {
          var firstLine = response.slice(0, response.indexOf("\n"));
          var words = firstLine.split('	');
          var bgValue = '';

          if ($("#mmol").is(":checked"))
          {
            bgValue = (words[2]/18).toFixed(1);
          }
          else
          {
            bgValue = words[2];
          }

          $('#BGValue').text(bgValue);

          var trend = words[3].replace(/['"]+/g, '');
          var trendArrow = '';
          if (trend == 'Flat')
          {
            trendArrow = '→';
          }
          else if (trend == 'FortyFiveUp')
          {
            trendArrow = '↗';
          }
          else if (trend == 'SingleUp')
          {
            trendArrow = '↑';
          }
          else if (trend == 'DoubleUp')
          {
            trendArrow = '↑↑';
          }
          else if (trend == 'FortyFiveDown')
          {
            trendArrow = '↘';
          }
          else if (trend == 'SingleDown')
          {
            trendArrow = '↓';
          }
          else if (trend == 'DoubleDown')
          {
            trendArrow = '↓↓';
          }

          $('#BGTrend').text(trendArrow);
          document.title = bgValue+' '+trendArrow;


          //$('#Debug').text(response);
          //$("#Debug").css("display","inline");
        }
        catch( e )
        {
          $('#BGValue').text('[Error]');
        }
        if ($("#Form").css("display") != "none")
        {
          hideForm();
        }
      },

      error: function(error)
      {
        hidePage();
        showForm();
        console.log('error; ' + error);
      }

    });
  }
  else
  {
    console.log('refresh disabled');
    $('#BGValue').text('[disabled]');
  }
}

function handleChange(e)
{
  console.log('handleChange');
  let form = {};
  form.url = url.value;
  form.token = token.value;
  // either null or one
  unit.forEach(d => {
    if(d.checked) form.unit = d.value;
  });

  // store ...
  saveForm(form);
}

function saveForm(form)
{
  console.log('saving');
  let f = JSON.stringify(form);
  console.log(f);
  window.localStorage.setItem('form', f);
}

function getForm()
{
  console.log('loading');
  let f = window.localStorage.getItem('form');
  console.log(f);
  if(f) return JSON.parse(f);
}
