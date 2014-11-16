module('Webform-Toolkit', {
	setup : function() {
		if (setup) return;   // skip process

		stop();

		$.getJSON('demo.json', function(data) {
			start();

			$('#qunit-custom')
				.WebformToolkit({
					id:     'example',
					action: 'http://www.domain.com/handler',
					fields: data
				},
				function(form) {
					alert("callback(form='" + form.attr('id') + "')");
				});

			// hide test elements
			$('#qunit-custom').hide(0);
		});

		setup = true;
	}
});

done(function() {
	$('#qunit-custom').empty();
});

test('Generate HTML', function() {
	ok($('#qunit-custom').find(webform), 'Webform elements created');
});
