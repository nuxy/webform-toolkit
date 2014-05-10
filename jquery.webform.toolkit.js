/**
 *  Webform-Toolkit
 *  Generate an interactive HTML FORM from JSON
 *
 *  Copyright 2012-2014, Marc S. Brooks (http://mbrooks.info)
 *  Licensed under the MIT license:
 *  http://www.opensource.org/licenses/mit-license.php
 *
 *  Dependencies:
 *    jquery.js
 */

(function($) {
	var methods = {
		"init" : function(config, callback) {
			return this.each(function() {
				var $this = $(this),
					data  = $this.data();

				var webform = createForm(config, callback);
				$this.append(webform);

				if ( $.isEmptyObject(data) ) {
					$this.data({
						container : webform
					});
				}

				setButtonState(webform);

				return webform;
			});
		},
		"create" : function(config, callback) {
			return this.each(function() {
				var webform = $(this).data().container,
					field   = null;

				field = createField(webform, config);

				// return callback with form and field objects
				if (typeof callback === 'function') {
					callback(webform.find('fieldset'), field);
				}

				// append to existing form
				else {
					webform.find('div.webform_submit').before(field);
				}
			});
		},
		"destroy" : function() {
			return this.each(function() {
				$(this).removeData();
			});
		}
	};

	$.fn.WebformToolkit = function(method) {
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		}
		else
		if (typeof method === 'object' || !method) {
			return methods.init.apply(this, arguments);
		}
		else {
			$.error('Method ' +  method + ' does not exist on jQuery.WebformToolkit');
		}
	};

	/**
	 * Create form field elements
	 * @param {Object} config
	 * @param {Function} callback
	 * @returns {Object}
	 */
	function createForm(config, callback) {
		var form = $('<form></form>')
			.attr('id', config.id)
			.addClass('webform');

		// set POST action URI/URL
		if (config.action) {
			form.attr({
				method  : 'POST',
				enctype : 'multipart/form-data',
				action  : config.action
			});
		}

		var set = $('<fieldset></fieldset>');

		// create hidden elements, if POST parameters exist
		if (config.params) {
			var pairs = config.params.split('&');

			for (var i = 0; i < pairs.length; i++) {
				var name = pairs[i].split('=');

				var hidden = $('<input></input>')
					.attr({
						type  : 'hidden',
						name  : name[0],
						value : name[1]
					});

				set.append(hidden);
			}
		}

		// create each field
		if (config.fields) {
			for (var j = 0; j < config.fields.length; j++) {
				set.append( createField(form, config.fields[j]) );
			}
		}

		// create the submit button
		var div = $('<div></div>')
			.addClass('webform_submit');

		var button = $('<input></input>')
			.attr({
				type  : 'submit',
				value : 'Submit'
			});

		// bind form submit event
		form.submit(function(event) {
			event.preventDefault();

			var $this = $(this);

			if (!errorsExist($this)) {

				// return callback with form object response
				if (typeof callback === 'function') {
					callback($this);
				}

				// POST form values
				else {
					$this.get(0).submit();
				}
			}
		});

		div.append(button);
		set.append(div);
		form.append(set);

		return form;
	}

	/**
	 * Create field elements
	 * @param {Object} form
	 * @param {Object} config
	 * @returns {Object}
	 */
	function createField(form, config) {
		var div = $('<div></div>');

		// .. label, if exists
		if (config.label && config.type != 'checkbox') {
			div.append( $('<label>' + config.label + '</label>') );
		}

		var elm = jQuery.obj;

		// supported elements
		switch (config.type) {
			case 'text':
				elm = createInputElm(config);
			break;

			case 'password':
				elm = createInputElm(config);
			break;

			case 'hidden':
				elm = createInputElm(config);
			break;

			case 'file':
				elm = createFileElm(config);
			break;

			case 'textarea':
				elm = createTextAreaElm(config);
			break;

			case 'select':
				elm = createMenuElm(config);
			break;

			case 'radio':
				elm = createRadioElm(config);
			break;

			case 'checkbox':
				elm = createCheckBoxElm(config);
			break;

			default:
				$.error('Invalid or missing field type');
			break;
		}

		if (config.required == 1) {
			elm.attr('required', true);
		}

		// filter with REGEX
		if (config.filter && config.type != 'hidden') {
			elm.data({
				regex : config.filter,
				mesg  : config.error,
				error : false
			});

			// attach form events
			elm.on('mousedown mousemove mouseout change', function() {
				validateField(this);
				setButtonState(form);
			});

			form.on('mouseover mousemove', function() {
				validateField(elm);
				setButtonState( $(this) );
			});

			// attach key events
			elm.keypress(function(event) {
				if (event.keyCode != 0) return;
			});
		}

		div.append(elm);

		return div;
	}

	/**
	 * Create input elements
	 * @param {Object} config
	 * @returns {Object}
	 */
	function createInputElm(config) {
		var input = $('<input></input>');

		// .. field attributes
		if (config.type) {
			input.attr('type', config.type);
		}

		if (config.name) {
			input.attr('name', config.name);
		}

		if (config.value) {
			input.attr('value', config.value);
		}

		// config.size to be removed in future release
		if (config.maxlength || config.size) {
			input.attr('maxlength', (config.maxlength) ? config.maxlength : config.size);
		}

		return input;
	}

	/**
	 * Create FILE element
	 * @param {Object} config
	 * returns {Object}
	 */
	function createFileElm(config) {
		var input = $('<input></input>')
			.attr('type','file');

		// .. field attributes
		if (config.name) {
			input.attr('name', config.name);
		}

		return input;
	}

	/**
	 * Create select menu elements
	 * @param {Object} config
	 * @returns {Object}
	 */
	function createMenuElm(config) {
		var select = $('<select></select>');

		var opts = config.filter.split('|');

		for (var i = 0; i < opts.length; i++) {
			var value = opts[i];

			var option = $('<option>' + value + '</option>')
				.attr('value', value);

			if (value == config.value) {
				option.attr('selected', true);
			}

			select.append(option);
		}

		return select;
	}

	/**
	 * Create RADIO button elements
	 * @param {Object} config
	 * @returns {Object}
	 */
	function createRadioElm(config) {
		var div = $('<div></div>')
			.addClass('radios');

		var opts = config.filter.split('|');

		for (var i = 0; i < opts.length; i++) {
			var value = opts[i];

			var input = $('<input></input>')
				.attr({
					type  : 'radio',
					name  : config.name,
					value : value
				});

			if (value == config.value) {
				input.attr('checked', true);
			}

			var span = $('<span>' + value + '</span>');

			div.append(input);
			div.append(span);
		}

		return div;
	}

	/**
	 * Create CHECKBOX elements
	 * @param {Object} config
	 * @returns {Object}
	 */
	function createCheckBoxElm(config) {
		var div = $('<div></div>')
			.addClass('checkbox');

		var label = $('<span>' + config.label + '</span>'),
			input = $('<input></input>')
			.attr({
				type  : 'checkbox',
				name  : config.name,
				value : config.value
			});

		if (config.value) {
			input.attr('checked', true);
		}

		div.append(input, label);

		return div;
	}

	/**
	 * Create textarea elements
	 * @param {Object} config
	 * @returns {Object}
	 */
	function createTextAreaElm(config) {
		return $('<textarea></textarea>')
			.attr('name', config.name);
	}

	/**
	 * Validate the form element value
	 * @param {Object} elm
	 * @returns {Boolean}
	 */
	function validateField(elm) {
		var $this = $(elm);

		var value = elm.value;
		if (!value) return;

		var regex = $this.data('regex'),
			error = $this.data('error'),
			mesg  = $this.data('mesg');

		var search = new RegExp(regex, 'g'),
			match  = null;

		// .. REGEX by type
		switch(elm.nodeName) {
			case 'input' :
				match = search.test(value);
			break;

			case 'select' :
				match = search.test(value);
			break;

			case 'textarea' :
				match = search.test(value);
			break;
		}

		var field = $this.parent();

		// toggle the error message visibility
		if (match === false && error === false) {
			var p = $('<p>' + mesg + '</p>')
				.addClass('error_mesg');

			// .. arrow elements
			var span1 = $('<span></span>'),
				span2 = $('<span></span>');

			span1.addClass('arrow_lft');
			span2.addClass('arrow_rgt');

			p.prepend(span1).append(span2);

			field.append(p);

			$this.addClass('error_on')
				.data('error', true);

			p.fadeIn('slow');
		}
		else
		if (match === true && error === true) {
			var p = field.children('p');

			p.fadeOut('slow', function() {
				$this.removeClass('error_on')
					.data('error', false);

				p.remove();
			});
		}

		return true;
	}

	/**
	 * Enable/Disable submit button
	 * @param {Object} form
	 */
	function setButtonState(form) {
		var button = form.find('input:submit');
		if (!button) return;

		if (errorsExist(form)) {
			button.attr('disabled', true);
		}
		else {
			button.attr('disabled', false);
		}
	}

	/**
	 * Return true if form errors exist
	 * @param {Object} form
	 * @returns {Boolean}
	 */
	function errorsExist(form) {
		var fields = form[0].elements;

		for (var i = 0; i < fields.length; i++) {
			var elm = fields[i];

			// supported elements
			if (!/input|select|textarea/.test(elm.nodeName)) {
				continue;
			}

			if (elm.nodeName == 'input' &&
				!/text|password|radio/.test(elm.type)) {
				continue;
			}

			// do errors exist?
			if ((elm.required && !elm.value) || $(elm).data('error')) {
				return true;
			}
		}
	}
})(jQuery);
