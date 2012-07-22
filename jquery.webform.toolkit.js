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
						validateField( $(this) )
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
			.attr('id','webform_submit');

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
	function validateField(elm) {}
})(jQuery);
