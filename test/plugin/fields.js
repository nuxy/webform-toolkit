test("Field 'User Name'", function() {
  var event = new Event('mouseout'),
      field = document.querySelector(webform).querySelector('div.field_username'),
      input = field.querySelector('input');

  equal(field.querySelector('label').textContent, 'User Name', "Label 'User Name'");

  checkFieldAttr(input, {
    id:        'username',
    name:      'username',
    type:      'text',
    maxlength: '15',
    required:  true
  });

  ok(input.value = 'user!@#$%', "Define invalid value 'user!@#$%'");

  ok(input.dispatchEvent(event), "Mouse event 'out'");

  stop();

  setTimeout(function() {
    ok(input.className == 'error_on', "<input> contains required class 'error_on'");

    var mesg = field.querySelector('p.error_mesg');

    ok(mesg, 'Error message should be visible');

    if (mesg) {
      equal(mesg.textContent, 'Supported characters: A-Z, 0-9 and underscore',
        "Expected value 'Supported characters: A-Z, 0-9 and underscore'");
    }

    var button = document.querySelector(webform).querySelector('input[type="submit"]');

    equal(button.disabled, true, 'Submit button is disabled');

    start();

    ok(input.value = 'newuser', "Define valid value 'newuser'");

    ok(input.dispatchEvent(event), "Mouse event 'out'");

    stop();

    setTimeout(function() {
      ok(input.className != 'error_on', "<input> should not contain class 'error_on'");

      mesg = field.querySelector('p.error_mesg');

      ok(!mesg, 'Error message should not be visible');

      start();

      equal(button.disabled, true, 'Submit button is disabled');
    }, 1000);
  }, 500);
});

test("Field 'Password'", function() {
  var event = new Event('mouseout'),
      field = document.querySelector(webform).querySelector('div.field_password'),
      input = field.querySelector('input');

  equal(field.querySelector('label').textContent, 'Password', "Label 'Password'");

  checkFieldAttr(input, {
    name:       'password',
    type:       'password',
    maxlength:  '15',
    required:   true
  });

  ok(input.value = 'password', "Define invalid value 'password'");

  ok(input.dispatchEvent(event), "Mouse event 'out'");

  stop();

  setTimeout(function() {
    ok(input.className == 'error_on', "<input> contains required class 'error_on'");

    var mesg = field.querySelector('p.error_mesg');

    ok(mesg, 'Error message should be visible');

    if (mesg) {
      equal(mesg.textContent, 'The password entered is not valid',
        "Expected value: The password entered is not valid");
    }

    var button = document.querySelector(webform).querySelector('input[type="submit"]');

    equal(button.disabled, true, 'Submit button is disabled');

    start();

    ok(input.value = 'pass!@#$%', "Define valid value 'pass!@#$%'");

    ok(input.dispatchEvent(event), "Mouse event 'out'");

    stop();

    setTimeout(function() {
      ok(input.className != 'error_on', "<input> should not contain class 'error_on'");

      mesg = field.querySelector('p.error_mesg');

      ok(!mesg, 'Error message should not be visible');

      equal(button.disabled, false, 'Submit button is disabled');

      start();
    }, 1000);
  }, 500);
});

test("Field 'Profile Image'", function() {
  var field = document.querySelector(webform).querySelector('div.field_upload'),
      input = field.querySelector('input');

  equal(field.querySelector('label').textContent, 'Profile Image', "Label 'Profile Image'");

  checkFieldAttr(input, {
    name:     'upload',
    type:     'file',
    required: false
  });

  var desc = field.querySelector('p.field_desc');

  ok(desc, 'Field description should be visible');

  if (desc) {
    equal(desc.textContent, 'You can upload a JPG, GIF or PNG (File size limit is 2 MB)',
      "Expected value: You can upload a JPG, GIF or PNG (File size limit is 2 MB)");
  }
});

test("Field 'Age Group'", function() {
  var field = document.querySelector(webform).querySelector('div.field_age_group'),
      menu  = field.querySelector('select');

  equal(field.querySelector('label').textContent, 'Age Group', "Label 'Age Group'");

  checkFieldAttr(menu, {
    name:     'age_group',
    required: true
  });

  var opts = ['Select One', '18-24', '25-34', '35-44', '45-54', '55-64', '65 or more'];

  for (var i = 0; i < menu.options.length; i++) {
    var val = menu.options[i].text;

    equal(opts[i], val, "Menu option '" + val + "' exists");
  }

  ok(menu.value = '18-24', "Define valid value '18-24'");
});

test("Field 'Gender'", function() {
  var field = document.querySelector(webform).querySelector('div.field_gender'),
      input = field.querySelectorAll('input');

  equal(field.querySelector('label').textContent, 'Gender', "Label 'Gender'");

  var opts = ['Male','Female','N/A'];

  for (var i = 0; i < input.length; i++) {
    var val = input[i].value;

    equal(opts[i], val, "Menu option '" + val + "' exists");

    checkFieldAttr(input[i], {
      name:     'gender',
      type:     'radio',
      required: false
    });
  }
});

test("Field 'Comments'", function() {
  var event = new Event('mouseout'),
      field = document.querySelector(webform).querySelector('div.field_comments'),
      input = field.querySelector('textarea');

  equal(field.querySelector('label').textContent, 'Comments', "Label 'Comments'");

  checkFieldAttr(input, {
    name:     'comments',
    required: false
  });

  ok(input.value = 'desc!@#$%', "Define invalid value 'desc!@#$%'");

  ok(input.dispatchEvent(event), "Mouse event 'out'");

  stop();

  setTimeout(function() {
    ok(input.className == 'error_on', "<input> contains required class 'error_on'");

    var mesg = field.querySelector('p.error_mesg');

    ok(mesg, 'Error message should be visible');

    if (mesg) {
      equal(mesg.textContent, 'Supported characters: A-Z, 0-9, _ and spaces',
        "Expected value: Supported characters: A-Z, 0-9, _ and spaces");
    }

    var button = document.querySelector(webform).querySelector('input[type="submit"]');

    equal(button.disabled, true, 'Submit button is disabled');

    start();

    ok(input.value = 'Lorem ipsum dolor sit amet', "Define valid value 'Lorem ipsum dolor sit amet'");

    ok(input.dispatchEvent(event), "Mouse event 'out'");

    stop();

    setTimeout(function() {
      ok(input.className != 'error_on', "<input> should not contain class 'error_on'");

      mesg = field.querySelector('p.error_mesg');

      ok(!mesg, 'Error message should not be visible');

      start();
    }, 1000);
  }, 500);
});

test("Field 'I want to check this box because it's a box'", function() {
  var event = new Event('mousemove'),
      field = document.querySelector(webform).querySelector('div.field_confirm'),
      input = field.querySelector('input');

  checkFieldAttr(input, {
    name:     'confirm',
    required: false
  });

  ok(input.checked, true, 'Checkbox is checked');

  ok(input.dispatchEvent(event), "Mouse event 'move'");
});

test('Form Submit', function() {
  var event  = new Event('submit', { cancelable: true }),
      form   = document.querySelector(webform),
      button = form.querySelector('input[type="submit"]');

  equal(button.disabled, false, 'Submit button is enabled');

  ok(form[0].dispatchEvent(event), "Form event 'submit'");

  form.dispatchEvent(event);

  stop();

  setTimeout(function() {
    equal(window.alert.message, "callback(form='example')", "Window alert message expected is 'callback(form='example')'");

    start();
  }, 500);
});

function checkFieldAttr(elm, data) {
  if (data.name) {
    equal(elm.name, data.name, "Name '" + data.name + "'");
  }

  if (data.type) {
    equal(elm.type, data.type, "Type '" + data.type + "'");
  }

  if (data.maxlength) {
    equal(elm.maxLength, data.maxlength, "Maxlength = '" + data.maxlength + "'");
  }

  if (data.required) {
    equal(elm.required, true, 'Required field');
  }
}
