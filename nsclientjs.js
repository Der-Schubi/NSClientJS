let url, token, unit;

function showForm() {
 $("#Form").css("display","block");
 $("#showButton").css("display","none");
}

function hideForm() {
 $("#Form").css("display","none");
 $("#showButton").css("display","inline");
}

function showPage() {
 $("#Page").css("display","block");
}

function hidePage() {
 $("#Page").css("display","none");
}

$(document).ready(function() {
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
  if(cached) {
    console.log('reading');
    url.value = cached.url;
    token.value = cached.token;
    if(cached.unit) {
      unit.forEach(d => {
        if(d.value === cached.unit) d.checked = true;
      });
    }
  }
  else {
    console.log('no data');
    hidePage();
    showForm();
  }

  document.querySelector('#mainForm').addEventListener('submit', () => {
    window.localStorage.removeItem('form');
  }, false);


  // To-Do: Sanity-Check of URL / Token?
  RefreshEntries();
});

function RefreshEntries() {
  if (document.hidden !== true)
  {
    $.ajax({
      url: url.value+'/api/v1/entries?token='+token.value,
      cache: 'false',
      method: 'GET',
      //async:true,
      //crossDomain:true,
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
          //$("#Debug").css("display","inline");
        }
        catch( e )
        {
          $('#BGValue').text('N/A');
        }
      },
    });
  }
  //setTimeout(RefreshEntries, 5000);
}

function handleChange(e) {
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

function saveForm(form) {
  console.log('saving');
  let f = JSON.stringify(form);
  console.log(f);
  window.localStorage.setItem('form', f);
}

function getForm() {
  console.log('loading');
  let f = window.localStorage.getItem('form');
  console.log(f);
  if(f) return JSON.parse(f);
}
