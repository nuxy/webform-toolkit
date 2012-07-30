/*
 *  Webform-Toolkit
 *  Generate an interactive HTML FORM from JSON
 *
 *  Copyright 2012, Marc S. Brooks (http://mbrooks.info)
 *  Licensed under the MIT license:
 *  http://www.opensource.org/licenses/mit-license.php
 *
 *  Dependencies:
 *    jquery.js
 */

(function($) {
	var methods = {
		init : function(options, config, callback) {

			// default options
			var settings = {};

			if (arguments.length > 1) {
				$.extend(settings, options);
			}
			else {
				config = options;
			}

			return this.each(function() {
				var $this = $(this),
					data  = $this.data();

				if ( $.isEmptyObject(data) ) {
					$this.data({
						options : settings
					});
				}

				$this.append( createForm(config, callback) );
			});
		},

		destroy : function() {
			return this.each(function() {
				$(this).removeData();
			});
		}
	};

	$.fn.WebformToolkit = function(method) {
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1) );
		}
		else
		if (typeof method === 'object' || ! method) {
			return methods.init.apply(this, arguments);
		}
		else {
			$.error('Method ' +  method + ' does not exist on jQuery.WebformToolkit');
		}
	};

	/*
	 * Create FORM field elements
	 */
	function createForm(config, callback) {
		var form = $('<FORM></FORM>')
			.attr('id', config.id)
			.addClass('webform');

		// set POST action URI/URL
		if (config.action) {
			form.attr('method','POST')
				.attr('enctype','multipart/form-data');
		}

		var set = $('<FIELDSET></FIELDSET>');

		// create hidden elements, if POST parameters exist
		if (config.params) {
			var pairs = config.params.split('&');

			for (var i = 0; i < pairs.length; i++) {
				var name = pairs[i].split('=');

				var hidden = $('<INPUT></INPUT>')
					.attr('type','hidden')
					.attr('name',  name[0])
					.attr('value', name[1]);

				set.append(hidden);
			}
		}

		// create each field
		if (config.fields) {
			for (var j = 0; j < config.fields.length; j++) {
				var data = config.fields[j];

				var div = $('<DIV></DIV>');

				// .. label, if exists
				if (data.label) {
					var label = $('<LABEL>' + data.label + '</LABEL>');
					div.append(label);
				}

				var elm = new Object;

				// .. field element
				switch (data.type) {
					case 'text' :
						elm = createInputElm(data);
					break;

					case 'password' :
						elm = createInputElm(data);
					break;

					case 'textarea' :
						elm = createTextAreaElm(data);
					break;

					case 'select' :
						elm = createMenuElm(data);
					break;

					case 'radio' :
						elm = createRadioElm(data);
					break;

					default :
						$.error('Invalid or missing field type');
					break;
				}

				if (data.required == 1) {
					elm.attr('required', true);
				}

				// filter with REGEX
				if (data.filter) {
					elm.regex  = data.filter;
					elm.mesg   = data.error;
					elm.error  = false;

					// attach field events
					elm.bind('mousedown mousemove mouseout change', function() {
						validateField( $(this) );
					});

					// attach key events
					elm.keypress(function(event) {
						if (event.keyCode == 0) {
							validateField( $(this) );
						}
					});
				}

				div.append(elm);
				set.append(div);
			}
		}

		// create the submit button
		var div = $('<DIV></DIV>')
			.addClass('webform_submit');

		var button = $('<INPUT></INPUT>');

		// use callback to process the form values
		if (callback) {
			button.attr('type','button');

			button.click(function() {
				callback(form);
			});
		}
		// use standard POST method
		else {
			button.attr('type','submit');
		}

		div.append(button);
		set.append(div);
		form.append(set);

		return form;
	}

	/*
	 * Create INPUT elements
	 */
	function createInputElm(config) {
		var input = $('<INPUT></INPUT>');

		// .. text field attributes
		if (config.type) {
			input.attr('type', config.type);
		}

		if (config.name) {
			input.attr('name', config.name);
		}

		if (config.type == 'text' && config.value) {
			input.attr('value', config.value);
		}

		if (config.size) {
			input.attr('maxlength', config.size);
		}

		return input;
	}

	/*
	 * Create SELECT menu elements
	 */
	function createMenuElm(config) {
		var select = $('<SELECT></SELECT>');

		var opts = config.filter.split('|');

		for (var i = 0; i < opts.length; i++) {
			var value = opts[i];

			var option = $('<OPTION>' + value + '</OPTION>')
				.attr('value', value);

			if (value == config.value) {
				option.attr('selected', true);
			}

			select.append(option);
		}

		return select;
	}

	/*
	 * Create radio button elements
	 */
	function createRadioElm(config) {
		var div = $('<DIV></DIV>')
			.addClass('radios');

		var opts = config.filter.split('|');

		for (var i = 0; i < opts.length; i++) {
			var value = opts[i];

			var input = $('<INPUT></INPUT>')
				.attr('type', 'radio')
				.attr('name', config.name)
				.attr('value', value);

			var span = $('<SPAN>' + value + '</SPAN>');

			div.append(input);
			div.append(span);
		}

		return div;
	}

	/*
	 * Create TEXTAREA elements
	 */
	function createTextAreaElm(config) {
		return $('<TEXTAREA></TEXTAREA>')
			.attr('name', config.name);
	}

	/*
	 * Validate the form element value
	 */
	function validateField(elm) {
		var value = elm.val();
		if (!value) { return }

		var regex = new RegExp(elm.regex);
		var match;

		// REGEX by field type
		switch( elm.attr('name') ) {
			case 'INPUT' :
				match = regex.test(value);
			break;

			case 'SELECT' :
				match = regex.test(value);
			break;

			case 'TEXTAREA' :
				match = regex.test(value);
			break;
		}

		var error = elm.data('error');
		var set   = elm.parent();

		// toggle the error message visibility
		if (match === false && error === false) {
			var p = $('<P>' + elm.mesg + '</P>')
				.addClass('error');

			set.append(p);

			elm.addClass('error_on')
				.data('error', true);
		}
		else
		if (match === true && error === true) {
			set.filter(':last').remove();

			elm.addClass('error_off')
				.data('error', false);
		}

		// toggle the submit button visibility
		setButtonState( set.parent() );

		return true;
	}

	/*
	 * Enable/Disable submit button
	 */
	function setButtonState(form) {
		var elm = form.find('input:submit') || form.find('input:button');
		if (!elm) { return };

		if ( checkErrors(form) ) {
			elm.attr('disabled', true);
		}
		else {
			elm.attr('disabled', false);
		}
	}

	/*
	 * Check each form element for errors
	 */
	function checkErrors(form) {
		form.each(function() {
			var elm = this;

			// supported elements
			if (elm.nodeName != 'INPUT' && elm.nodeName != 'SELECT' && elm.nodeName != 'TEXTAREA') {
				return;
			}

			if (elm.nodeName == 'INPUT' &&
				(elm.type != 'text' && elm.type != 'password' && elm.type != 'radio') ) {
				return;
			}

			var data = $(this).data();

			// does errors exist?
			if ( (data('required') && !elm.value) || data('error') ) {
				return false;
			}
		});

		return false;
	}

	/*
	 * POST the form name/value pairs to the server
	 */
	function submitForm() {}
})(jQuery);
