module('Webform-Toolkit', {
  setup : function() {
    if (setup) return;   // Skip process

    stop();

    var xhr = new XMLHttpRequest();

    xhr.addEventListener('load', function() {
      if (this.status == 200) {
        start();

        document.getElementById('qunit-custom')
          .WebformToolkit({
            id:     'example',
            action: 'http://www.domain.com/handler',
            fields: JSON.parse(this.responseText)
          },
          function(form) {
            window.alert("callback(form='" + form.id + "')");
          });

        setup = true;
      }
    });

    xhr.open('GET', 'https://nuxy.github.io/Webform-Toolkit/demo.json');
    xhr.send(null);

    // Hide test elements
    document.getElementById('qunit-custom').style.display = 'none';
  }
});

done(function() {
  var elm = document.getElementById('qunit-custom');
  while (elm.firstChild) {
    elm.removeChild(elm.firstChild);
  }
});

test('Generate HTML', function() {
  ok(document.getElementById('qunit-custom').querySelector(webform), 'Webform elements created');
});
