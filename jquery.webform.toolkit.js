/*
 *  Webform-Toolkit
 *  Generate an interactive HTML FORM from JSON
 *
 *  Copyright 2012-2013, Marc S. Brooks (http://mbrooks.info)
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

				var form = createForm(config, callback);
				$(this).append(form);
				setButtonState(form);

				if ( $.isEmptyObject(data) ) {
					$this.data({
						container : form
					});
				}

				return form;
			});
		},
		"create" : function(config) {
			return this.each(function() {
				var $this = $(this),
					data  = $this.data(),
					form  = data.container;

				form.append( createField(form, config) );
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

	/*
	 * Create FORM field elements
	 */
	function createForm(config, callback) {
		var form = $('<FORM></FORM>')
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

		var set = $('<FIELDSET></FIELDSET>');

		// create hidden elements, if POST parameters exist
		if (config.params) {
			var pairs = config.params.split('&');

			for (var i = 0; i < pairs.length; i++) {
				var name = pairs[i].split('=');

				var hidden = $('<INPUT></INPUT>')
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
				var data = config.fields[j];

				var div = $('<DIV></DIV>');

				// .. label, if exists
				if (data.label && data.type != 'checkbox') {
					div.append( $('<LABEL>' + data.label + '</LABEL>') );
				}

				elm = createField(form, data);

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

	/*
	 * Create field elements
	 */
	function createField(form, config) {
		var elm = jQuery.obj;

		// supported elements
		switch (config.type) {
			case 'text':
				elm = createInputElm(config);
			break;

			case 'password':
				elm = createInputElm(config);
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
		if (config.filter) {
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

		return elm;
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
	 * Create RADIO button elements
	 */
	function createRadioElm(config) {
		var div = $('<DIV></DIV>')
			.addClass('radios');

		var opts = config.filter.split('|');

		for (var i = 0; i < opts.length; i++) {
			var value = opts[i];

			var input = $('<INPUT></INPUT>')
				.attr({
					type  : 'radio',
					name  : config.name,
					value : value
				});

			if (value == config.value) {
				input.attr('checked', true);
			}

			var span = $('<SPAN>' + value + '</SPAN>');

			div.append(input);
			div.append(span);
		}

		return div;
	}

	/*
	 * Create CHECKBOX elements
	 */
	function createCheckBoxElm(config) {
		var div = $('<DIV></DIV>')
			.addClass('checkbox');

		var label = $('<SPAN>' + config.label + '</SPAN>'),
			input = $('<INPUT></INPUT>')
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
		if (!value) return;

		var regex = $this.data('regex'),
			error = $this.data('error'),
			mesg  = $this.data('mesg');

		var search = new RegExp(regex, 'g'),
			match  = null;

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
			var p = $('<P>' + mesg + '</P>')
				.addClass('error_mesg');

			// .. arrow elements
			var span1 = $('<SPAN></SPAN>'),
				span2 = $('<SPAN></SPAN>');

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

	/*
	 * Enable/Disable submit button
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

	/*
	 * Return true if form errors exist
	 */
	function errorsExist(form) {
		var fields = form[0].elements;

		for (var i = 0; i < fields.length; i++) {
			var elm = fields[i];

			// supported elements
			if (!/INPUT|SELECT|TEXTAREA/.test(elm.nodeName)) {
				continue;
			}

			if (elm.nodeName == 'INPUT' &&
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
