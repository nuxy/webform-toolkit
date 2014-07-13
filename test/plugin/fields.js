test("Field 'User Name'", function() {
	var field = $(webform).find('div.field_username'),
		input = field.children('input');

	equal(field.children('label').contents().eq(1).text(), 'User Name', "Label 'User Name'");

	checkFieldAttr(input, {
		name      : 'username',
		type      : 'text',
		maxlength : '15',
		required  : true
	});

	ok(input.val('user!@#$%'), "Define invalid value 'user!@#$%'");

	ok(input.trigger('mousemove'), "Mouse event 'move'");

	stop();

	setTimeout(function() {
		ok(input.hasClass('error_on'), "<input> contains required class 'error_on'");

		var mesg = field.children('p.error_mesg');

		ok(mesg[0], 'Error message should be visible');

		equal(mesg.text(), 'Supported characters: A-Z, 0-9 and underscore',
		   "Expected value 'Supported characters: A-Z, 0-9 and underscore'");

		var button = $(webform).find(':submit');

		equal(button.is(':disabled'), true, 'Submit button is disabled');

		start();

		ok(input.val('newuser'), "Define valid value 'newuser'");

		ok(input.trigger('mousemove'), "Mouse event 'move'");

		stop();

		setTimeout(function() {
			ok(!input.hasClass('error_on'), "<input> should not contain class 'error_on'");

			ok(!field.children('p.error_mesg')[0], 'Error message should not be visible');

			start();
		}, 1000);
	}, 500);
});

test("Field 'Password'", function() {
	var field = $(webform).find('div.field_password'),
		input = field.children('input');

	equal(field.children('label').contents().eq(1).text(), 'Password', "Label 'Password'");

	checkFieldAttr(input, {
		name      : 'password',
		type      : 'password',
		maxlength : '15',
		required  : true
	});

	ok(input.val('password'), "Define invalid value 'password'");

	ok(input.trigger('mousemove'), "Mouse event 'move'");

	stop();

	setTimeout(function() {
		ok(input.hasClass('error_on'), "<input> contains required class 'error_on'");

		var mesg = field.children('p.error_mesg');

		ok(mesg[0], 'Error message should be visible');

		equal(mesg.text(), 'The password entered is not valid',
		   "Expected value: The password entered is not valid");

		var button = $(webform).find(':submit');

		equal(button.is(':disabled'), true, 'Submit button is disabled');

		start();

		ok(input.val('pass!@#$%'), "Define valid value 'pass!@#$%'");

		ok(input.trigger('mousemove'), "Mouse event 'move'");

		stop();

		setTimeout(function() {
			ok(!input.hasClass('error_on'), "<input> should not contain class 'error_on'");

			mesg = field.children('p.error_mesg');

			ok(!mesg[0], 'Error message should not be visible');

			start();
		}, 1000);
	}, 500);
});

test("Field 'Profile Image'", function() {
	var field = $(webform).find('div.field_upload'),
		input = field.children('input');

	equal(field.children('label').text(), 'Profile Image', "Label 'Profile Image'");

	checkFieldAttr(input, {
		name     : 'upload',
		type     : 'file',
		required : false
	});

	var desc = field.children('p.field_desc');

	ok(desc[0], 'Field description should be visible');

	equal(desc.text(), 'You can upload a JPG, GIF or PNG (File size limit is 2 MB)',
	   "Expected value: You can upload a JPG, GIF or PNG (File size limit is 2 MB)");
});

test("Field 'Age Group'", function() {
	var field = $(webform).find('div.field_age_group'),
		input = field.find('select');

	equal(field.children('label').contents().eq(1).text(), 'Age Group', "Label 'Age Group'");

	checkFieldAttr(input, {
		name     : 'age_group',
		required : true
	});

	var opts = [ 'Select One','18-24','25-34','35-44','45-54','55-64','65 or more' ];

	input.children().each(function(index) {
		var val = $(this).val();

		equal(opts[index], val, "Menu option '" + val + "' exists");
	});

	ok(input.val('18-24'), "Define valid value '18-24'");
});

test("Field 'Gender'", function() {
	var field = $(webform).find('div.field_gender'),
		input = field.find('input');

	equal(field.children('label').text(), 'Gender', "Label 'Gender'");

	var opts = ['Male','Female','N/A'];

	input.each(function(index) {
		var val = $(this).val();

		equal(opts[index], val, "Menu option '" + val + "' exists");

		checkFieldAttr($(this), {
			name     : 'gender',
			type     : 'radio',
			required : false
		});
	});
});

test("Field 'Comments'", function() {
	var field = $(webform).find('div.field_comments'),
		input = field.find('textarea');

	equal(field.children('label').text(), 'Comments', "Label 'Comments'");

	checkFieldAttr(input, {
		name     : 'comments',
		required : false
	});

	ok(input.val('desc!@#$%'), "Define invalid message 'desc!@#$%'");

	ok(input.trigger('mousemove'), "Mouse event 'move'");

	stop();

	setTimeout(function() {
		ok(input.hasClass('error_on'), "<input> contains required class 'error_on'");

		var mesg = field.children('p.error_mesg');

		ok(mesg[0], 'Error message should be visible');

		equal(mesg.text(), 'Supported characters: A-Z, 0-9, _ and spaces',
		   "Expected value: Supported characters: A-Z, 0-9, _ and spaces");

		var button = $(webform).find(':submit');

		equal(button.is(':disabled'), true, 'Submit button is disabled');

		start();

		ok(input.val('Lorem ipsum dolor sit amet'), "Define valid value 'Lorem ipsum dolor sit amet'");

		ok(input.trigger('mousemove'), "Mouse event 'move'");

		stop();

		setTimeout(function() {
			ok(!input.hasClass('error_on'), "<input> should not contain class 'error_on'");

			mesg = field.children('p.error_mesg');

			ok(!mesg[0], 'Error message should not be visible');

			start();
		}, 1000);
	}, 500);
});

test("Field 'I want to check this box because it's a box'", function() {
	var field = $(webform).find('div.field_confirm'),
		input = field.find('input');

	checkFieldAttr(input, {
		name     : 'confirm',
		required : false
	});

	ok(input.prop('checked', true), 'Checkbox is checked');

	ok(input.trigger('mousemove'), "Mouse event 'move'");

	stop();

	setTimeout(function() {
		var button = $(webform).find(':submit');

		equal(button.is(':disabled'), false, 'Submit button is enabled');

		start();
	}, 500);
});

test('Form Submit', function() {
	ok($(webform).submit(), "Form event 'submit'");

	stop();

	setTimeout(function() {
		equal(window.alert.message, "callback(form='example')", "Window alert message expected is 'callback(form='example')'");

		start();
	}, 500);
});

function checkFieldAttr(elm, data) {
	if (data.name) {
		equal(elm.attr('name'), data.name, "Name '" + data.name + "'");
	}

	if (data.type) {
		equal(elm.attr('type'), data.type, "Type '" + data.type + "'");
	}

	if (data.maxlength) {
		equal(elm.attr('maxlength'), data.maxlength, "Maxlength = '" + data.maxlength + "'");
	}

	if (data.required) {
		equal(elm.prop('required'), true, 'Required field');
	}
}
