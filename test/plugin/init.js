module('Webform-Toolkit', {
	setup : function() {
		$.getJSON('demo.json', function(data) {
			$('#qunit-fixture')
				.WebformToolkit({
					id     : 'example',
					action : 'http://www.domain.com/handler',
					fields : data
				},
				function(form) {
					alert("callback(form='" + form.attr('id') + "')");
				});
		});
	},
	teardown : function() {
		// do nothing - preserve element structure
	}
});

test('Generate HTML', function() {
	ok($('#qunit-fixture').find(webform), 'Webform elements created');
});
