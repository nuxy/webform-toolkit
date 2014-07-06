test("Field 'User Name'", function() {
	var field = $(webform).find('div.field_username'),
		input = field.children('input');

	equal(field.children('label').text(), 'User Name', "Label 'User Name'");

	checkFieldAttr(input, {
		name      : 'username',
		type      : 'text',
		maxlength : '15',
		required  : true
	});

	ok(input.val('user!@#$%'), "Define invalid value 'user!@#$%'");

	ok(input.trigger('mousemove'), "Mouse event 'move'");
	ok(input.trigger('mouseover'), "Mouse event 'over'");
	ok(input.trigger('mouseout'),  "Mouse event 'out'");

	stop();

	setTimeout(function() {
		ok(input.hasClass('error_on'), "<input> contains required class 'error_on'");

		var mesg = field.children('p.error_mesg');

		ok(mesg[0], 'Error message should be visible');

		equal(mesg.text(), 'Supported characters: A-Z, 0-9 and underscore',
		   "Expected value 'Supported characters: A-Z, 0-9 and underscore'");

		start();

		ok(input.val('newuser'), "Define valid value 'newuser'");

		ok(input.trigger('mousemove'), "Mouse event 'move'");
		ok(input.trigger('mouseover'), "Mouse event 'over'");
		ok(input.trigger('mouseout'),  "Mouse event 'out'");

		stop();

		setTimeout(function() {
			ok(!input.hasClass('error_on'), "<input> should not contain class 'error_on'");

			mesg = field.children('p.error_mesg');

			ok(!mesg[0], 'Error message should not be visible');

			start();
		}, 1000);
	},500);
});

test("Field 'Password'", function() {
	var field = $(webform).find('div.field_password'),
		input = field.children('input');

	equal(field.children('label').text(), 'Password', "Label 'Password'");

	checkFieldAttr(input, {
		name      : 'password',
		type      : 'password',
		maxlength : '15',
		required  : true
	});

	ok(input.val('password'), "Define invalid value 'password'");

	ok(input.trigger('mousemove'), "Mouse event 'move'");
	ok(input.trigger('mouseover'), "Mouse event 'over'");
	ok(input.trigger('mouseout'),  "Mouse event 'out'");

	stop();

	setTimeout(function() {
		ok(input.hasClass('error_on'), "<input> contains required class 'error_on'");

		var mesg = field.children('p.error_mesg');

		ok(mesg[0], 'Error message should be visible');

		equal(mesg.text(), 'The password entered is not valid',
		   "Expected value: The password entered is not valid");

		start();

		ok(input.val('pass!@#$%'), "Define valid value 'pass!@#$%'");

		ok(input.trigger('mousemove'), "Mouse event 'move'");
		ok(input.trigger('mouseover'), "Mouse event 'over'");
		ok(input.trigger('mouseout'),  "Mouse event 'out'");

		stop();

		setTimeout(function() {
			ok(!input.hasClass('error_on'), "<input> should not contain class 'error_on'");

			mesg = field.children('p.error_mesg');

			ok(!mesg[0], 'Error message should not be visible');

			start();
		}, 1000);
	},500);
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

test("Field 'Age'", function() {
	var field = $(webform).find('div.field_age'),
		input = field.find('select');

	equal(field.children('label').text(), 'Age', "Label 'Age'");

	checkFieldAttr(input, {
		name     : 'age',
		required : false
	});

	var opts = [ 'Select One', 10, 11, 12, 13, 14, 15 ];

	input.children().each(function(index) {
		var val = $(this).val();

		equal(opts[index], val, "Menu option '" + val + "' exists");
	});
});

test("Field 'Gender'", function() {
	var field = $(webform).find('div.field_gender'),
		input = field.find('input');

	equal(field.children('label').text(), 'Gender', "Label 'Gender'");

	var opts = ['Male','Female'];

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

test("Field 'Message'", function() {
	var field = $(webform).find('div.field_message'),
		input = field.find('textarea');

	equal(field.children('label').text(), 'Message', "Label 'Message'");

	checkFieldAttr(input, {
		name     : 'message',
		required : true
	});

	ok(input.val('desc!@#$%'), "Define invalid message 'desc!@#$%'");

	ok(input.trigger('mousemove'), "Mouse event 'move'");
	ok(input.trigger('mouseover'), "Mouse event 'over'");
	ok(input.trigger('mouseout'),  "Mouse event 'out'");

	stop();

	setTimeout(function() {
		ok(input.hasClass('error_on'), "<input> contains required class 'error_on'");

		var mesg = field.children('p.error_mesg');

		ok(mesg[0], 'Error message should be visible');

		equal(mesg.text(), 'Supported characters: A-Z, 0-9, _ and spaces',
		   "Expected value: Supported characters: A-Z, 0-9, _ and spaces");

		start();

		ok(input.val('Lorem ipsum dolor sit amet'), "Define valid value 'Lorem ipsum dolor sit amet'");

		ok(input.trigger('mousemove'), "Mouse event 'move'");
		ok(input.trigger('mouseover'), "Mouse event 'over'");
		ok(input.trigger('mouseout'),  "Mouse event 'out'");

		stop();

		setTimeout(function() {
			ok(!input.hasClass('error_on'), "<input> should not contain class 'error_on'");

			mesg = field.children('p.error_mesg');

			ok(!mesg[0], 'Error message should not be visible');

			start();
		}, 1000);
	},500);
});

test("Field 'I want to check this box because it's a box'", function() {
	var field = $(webform).find('div.field_confirm'),
		input = field.find('input');

	checkFieldAttr(input, {
		name     : 'confirm',
		required : false
	});
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
