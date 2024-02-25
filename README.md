# Webform Toolkit

[![npm version](https://badge.fury.io/js/webform-toolkit.svg)](https://badge.fury.io/js/webform-toolkit) [![](https://img.shields.io/npm/dm/webform-toolkit)](https://www.npmjs.com/package/webform-toolkit) [![Build Status](https://api.travis-ci.com/nuxy/webform-toolkit.svg?branch=master)](https://app.travis-ci.com/github/nuxy/webform-toolkit) [![Install size](https://packagephobia.com/badge?p=webform-toolkit)](https://packagephobia.com/result?p=webform-toolkit) [![](https://img.shields.io/github/v/release/nuxy/webform-toolkit)](https://github.com/nuxy/webform-toolkit/releases)

Create a HTML form with field validation and custom errors.

![Preview](https://raw.githubusercontent.com/nuxy/webform-toolkit/master/package.gif)

## Features

- Extensible HTML/CSS interface.
- Compatible with all modern desktop and mobile web browsers.
- Easy to set-up and customize.
- Provides form input validation using REGEX ([regular expressions](http://www.regular-expressions.info/reference.html))
- Supports synchronous form-data POST
- Supports FORM submit callback for custom AJAX handling.
- Supports dynamic ([on the fly](#adding-fields)) field creation.

## Dependencies

- [Node.js](https://nodejs.org)

## Installation

Install the package into your project using [NPM](https://npmjs.com), or download the [sources](https://github.com/nuxy/webform-toolkit/archive/master.zip).

    $ npm install webform-toolkit

## Usage

There are two ways you can use this package.  One is by including the JavaScript/CSS sources directly.  The other is by importing the module into your component.

### Script include

After you [build the distribution sources](#cli-options) the set-up is fairly simple..

```html
<script type="text/javascript" src="path/to/webform-toolkit.min.js"></script>
<link rel="stylesheet" href="path/to/webform-toolkit.min.css" media="all" />

<script type="text/javascript">
  webformToolkit(container, settings, callback);
</script>
```

### Module import

If your using a modern framework like [Aurelia](https://aurelia.io), [Angular](https://angular.io), [React](https://reactjs.org), or [Vue](https://vuejs.org)

```javascript
import WebFormToolkit from 'webform-toolkit';
import 'webform-toolkit/dist/webform-toolkit.css';

const webformToolkit = new WebformToolkit(container, settings, callback);
```

### HTML markup

```html
<div id="webform-toolkit"></div>
```

### Example

```javascript
const settings = {
  action: 'https://www.domain.com/handler',
  params: 'name1=value1&name2=value2',
  groups: [
    {
      legend: 'Login Form',
      fields: [
        {
          id:          'username',
          label:       'User Name',
          type:        'text',
          name:        'username',
          value:       null,
          maxlength:   15,
          filter:      '^\\w{0,15}$',
          description: null,
          placeholder: null,
          error:       'Supported characters: A-Z, 0-9 and underscore',
          required:    true
        },
        {
          id:          'password',
          label:       'Password',
          type:        'password',
          name:        'password',
          value:       null,
          maxlength:   15,
          filter:      '^(?!password)(.{0,15})$',
          description: null,
          placeholder: null,
          error:       'The password entered is not valid',
          required:    true
        }
      ]
    }
  ]
};

const container = document.getElementById('webform-toolkit');

const webformToolkit = new WebformToolkit(container, settings, callback);
```

## Field definitions

| Attribute   | Description                                                                                       | Required |
|-------------|---------------------------------------------------------------------------------------------------|----------|
| id          | Field ID value.                                                                                   | true     |
| label       | Field label value.                                                                                | true     |
| type        | Supported types (`text`, `hidden`, `password`, `checkbox`, `radio`, `file`, `select`, `textarea`) | true     |
| name        | Form element name.                                                                                | true     |
| value       | Default value.                                                                                    | false    |
| maxlength   | Input type maximum length.                                                                        | false    |
| filter      | Validate form input using REGEX                                                                   | false    |
| description | Custom field description.                                                                         | false    |
| placeholder | Input field type placeholder text.                                                                | false    |
| error       | Custom error message (Required, if `filter` is defined)                                           | false    |
| required    | Required field.                                                                                   | false    |

## Callback processing

When a callback function is defined a form object is returned. This allows you to define a custom AJAX handler based on the requirements of your application. The following function corresponds to the [example](#usage) provided above.

```javasctipt
function callback(form) {
  const xhr = new XMLHttpRequest();

  xhr.addEventListener('load', function() {
    if (this.status == 200) {
      alert(response);
    }
  });

  xhr.open('POST', form.getAttribute('action'));
  xhr.send(new FormData(form));
}
```

## Adding fields

I have added a method to dynamically create form fields that can be added to an existing webform. An optional callback has also been provided to for post-processing FORM and field elements. This makes it easy to show/hide fields using conditions and expressions.

```javascript
webformToolkit.create({
  id:          'new_field_id',
  label:       'New Field',
  type:        'text',
  name:        'new_field',
  value:       null,
  maxlength:   null,
  filter:      '^[a-zA-Z0-9_]{0,255}$',
  description: 'This is my new field',
  placeholder: null,
  error:       'Supported characters: A-Z, 0-9 and underscore',
  required:    true
},
function(form, elm) {
  form.appendChild(elm); // default: last in fieldset
});
```

## Best practices

Just because you are filtering form input on the client-side is NO EXCUSE to not do the same on the server-side.  Security is a two-way street, and BOTH ends should be protected.

## Unsupported releases

To install deprecated versions use [Bower](http://bower.io) or download the package [by tag](https://github.com/nuxy/webform-toolkit/tags).

### v2 (no dependencies)

    $ bower install webform-toolkit#2

### v1 (requires [jQuery 1.8.3](http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js))

Compatible with Firefox 3.6, Chrome, Safari 5, Opera, and Internet Explorer 7+ web browsers.

    $ bower install webform-toolkit#1

## Developers

### CLI options

Run [ESLint](https://eslint.org) on project sources:

    $ npm run lint

Transpile ES6 sources (using [Babel](https://babeljs.io)) and minify to a distribution:

    $ npm run build

Run [WebdriverIO](https://webdriver.io) E2E tests:

    $ npm run test

## Contributions

If you fix a bug, or have a code you want to contribute, please send a pull-request with your changes. (Note: Before committing your code please ensure that you are following the [Node.js style guide](https://github.com/felixge/node-style-guide))

## Versioning

This package is maintained under the [Semantic Versioning](https://semver.org) guidelines.

## License and Warranty

This package is distributed in the hope that it will be useful, but without any warranty; without even the implied warranty of merchantability or fitness for a particular purpose.

_webform-toolkit_ is provided under the terms of the [MIT license](http://www.opensource.org/licenses/mit-license.php)

## Author

[Marc S. Brooks](https://github.com/nuxy)
