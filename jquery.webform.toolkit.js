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
		init : function(config, callback) {
			return this.each(function() {
				var $this = $(this),
					data  = $this.data();

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
				.attr('action', config.action)
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
					div.append( $('<LABEL>' + data.label + '</LABEL>') );
				}

				var elm = jQuery.obj;

				// supported elements
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
					elm.data({
						regex : data.filter,
						mesg  : data.error,
						error : false
					});

					// attach field events
					elm.bind('keyup keydown mousedown mousemove mouseout change', function() {
						validateField(this);
					});

					// attach key events
					elm.keypress(function(event) {
						if (event.keyCode == 0) {
							validateField(this);
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

		var button = $('<INPUT></INPUT>')
			.attr({
				type  : 'submit',
				value : 'Submit'
			});

		// bind form submit event
		form.submit(function(event) {
			event.preventDefault();

			var $this = $(this);

			if ( checkErrors($this) ) {

				// POST using AJAX call, return callback with form object
				if (callback) {
					$.post(config.url, $this.serialize(), callback($this) );
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
		var $this = $(elm);

		var value = elm.value;
		if (!value) { return }

		var regex = $this.data('regex');
		var error = $this.data('error');

		var search = new RegExp(regex, 'g');
		var match;

		// .. REGEX by type
		switch(elm.nodeName) {
			case 'INPUT' :
				match = search.test(value);
			break;

			case 'SELECT' :
				match = search.test(value);
			break;

			case 'TEXTAREA' :
				match = search.test(value);
			break;
		}

		var field = $this.parent();

		// toggle the error message visibility
		if (match === false && error === false) {
			var p = $('<P>' + $this.data('mesg') + '</P>')
				.addClass('error');
			field.append(p);

			$this.addClass('error_on')
				.data('error', true);
		}
		else
		if (match === true && error === true) {
			field.children('p').remove();

			$this.removeClass('error_on')
				.data('error', false);
		}

		// toggle the submit button visibility
		setButtonState( field.parent() );

		return true;
	}

	/*
	 * Enable/Disable submit button
	 */
	function setButtonState(form) {
		var button = form.find('input:submit');

		if (!button) { return };

		if ( checkErrors(form) ) {
			button.attr('disabled', true);
		}
		else {
			button.attr('disabled', false);
		}
	}

	/*
	 * Check each form element for errors
	 */
	function checkErrors(form) {
		form.each(function() {
			var $this = this;

			// supported elements
			if (! /(INPUT|SELECT|TEXTAREA)/.exec($this.nodeName) ) {
				return true;
			}

			if ($this.nodeName == 'INPUT' &&
				! /(text|password|radio)/.exec($this.type) ) {
				return true;
			}

			// do errors exist?
			if ( ($this.required && !$this.value) || $(this).data('error') ) {
				return true;
			}
		});
	}
})(jQuery);
