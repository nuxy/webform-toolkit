/**
 *  Webform-Toolkit
 *  Dynamically generate an HTML form with field validation and custom errors
 *  from JSON
 *
 *  Copyright 2012-2016, Marc S. Brooks (https://mbrooks.info)
 *  Licensed under the MIT license:
 *  http://www.opensource.org/licenses/mit-license.php
 */

(function() {
 "use strict";

  /**
   * @namespace WebformToolkit
   */
  var methods = {

    /**
     * Create new instance of Webform-Toolkit
     *
     * @memberof WebformToolkit
     * @method init
     *
     * @example
     * document.getElementById('container').WebformToolkit(config, callback);
     *
     * @param {Object} config
     * @param {Function} callback
     *
     * @returns {Object} DOM element
     */
    "init": function(config, callback) {
        var _self = this;

        if (typeof _self.data === 'undefined') {
          _self.data = {
            config: config
          };
        }

        var webform = _self.WebformToolkit('_createForm', callback);
        _self.appendChild(webform);
        _self.WebformToolkit('_setButtonState', webform);
        return webform;
    },

    /**
     * Create new instance of Webform-Toolkit
     *
     * @memberof WebformToolkit
     * @method create
     *
     * @example
     * document.getElementById('container').WebformToolkit('create', config, callback);
     *
     * @param {Object} config
     * @param {Function} callback
     *
     * @returns {Object} DOM element
     */
    "create": function(config, callback) {
      return this.forEach(function(_self) {
        var field = _self.WebformToolkit('_createField', _self.querySelector('form'), config);

        // Return callback with form and field objects.
        if (typeof data === 'function') {
          callback(_self, field);
        }
      });
    },

    /**
     * Perform cleanup
     *
     * @memberof WebformToolkit
     * @method destroy
     *
     * @example
     * document.getElementById('container').WebformToolkit('destroy');
     */
    "destroy": function() {
      return this.forEach(function(_self) {
        _self.remove();
      });
    },

    /**
     * Create form field elements.
     *
     * @memberof WebformToolkit
     * @method _createForm
     * @private
     *
     * @param {Function} callback
     * @returns {Object} DOM element
     */
    "_createForm": function(callback) {
      var _self = this,
          data  = _self.data;

      var form = document.createElement('form');
      form.setAttribute('id', data.config.id);
      form.className = 'webform';

      // Set POST action URI/URL
      if (data.config.action) {
        form.setAttribute('method', 'POST');
        form.setAttribute('enctype', 'multipart/form-data');
        form.setAttribute('action', data.config.action);
      }

      // Create hidden elements, if POST parameters exist.
      if (data.config.params) {
        var pairs = data.config.params.split('&');

        for (var i = 0; i < pairs.length; i++) {
          var name = pairs[i].split('=');

          var hidden = document.createElement('input');
          hidden.setAttribute('type', 'hidden');
          hidden.setAttribute('name',  name[0]);
          hidden.setAttribute('value', name[1]);

          form.appendChild(hidden);
        }
      }

      // Create form field elements.
      if (data.config.fields) {
        var fields = (data.config.fields[0][0]) ? data.config.fields : new Array(data.config.fields);

        for (var j = 0; j < fields.length; j++) {
          var group = document.createElement('fieldset');
          group.className = 'field_group' + j;

          for (var k = 0; k < fields[j].length; k++) {
            group.appendChild(_self.WebformToolkit('_createField', form, fields[j][k]));
          }

          form.appendChild(group);
        }
      }

      // Create the submit button.
      var div = document.createElement('div');
      div.className = 'form_submit';

      var button = document.createElement('input');
      button.setAttribute('type', 'submit');
      button.setAttribute('value', 'Submit');

      // Bind form submit event
      form.addEventListener('submit', function(event) {
        event.preventDefault();

        var _self = this;

        if (!_self.WebformToolkit('_errorsExist', _self)) {

          // Return callback with form object response.
          if (typeof callback === 'function') {
            callback(_self);
          }

          // POST form values.
          else {
            _self.submit();
          }
        }
      });

      div.appendChild(button);

      form.appendChild(div);

      return form;
    },

    /**
     * Create field elements.
     *
     * @memberof WebformToolkit
     * @method _createField
     * @private
     *
     * @param {Object} form
     * @param {Object} config
     *
     * @returns {Object} DOM element
     */
    "_createField": function(form, config) {
      var _self = this;

      var div = document.createElement('div');
      div.className = 'field_' + config.name;

      // .. Label, if exists
      if (config.label && config.type != 'checkbox') {
        var label = document.createElement('label');
        label.setAttribute('for', config.name);

        if (config.required == 1) {
          var span = document.createElement('span');
          span.className = 'required';

          label.appendChild(span);
        }

        label.textContent = config.label;

        div.appendChild(label);
      }

      var elm = [];

      // Supported elements
      switch (config.type) {
        case 'text':
          elm = _self.WebformToolkit('_createInputElm', config);
        break;

        case 'password':
          elm = _self.WebformToolkit('_createInputElm', config);
        break;

        case 'hidden':
          elm = _self.WebformToolkit('_createInputElm', config);
        break;

        case 'file':
          elm = _self.WebformToolkit('_createFileElm', config);
        break;

        case 'textarea':
          elm = _self.WebformToolkit('_createTextAreaElm', config);
        break;

        case 'select':
          elm = _self.WebformToolkit('_createMenuElm', config);
        break;

        case 'radio':
          elm = _self.WebformToolkit('_createRadioElm', config);
        break;

        case 'checkbox':
          elm = _self.WebformToolkit('_createCheckBoxElm', config);
        break;

        default:
          throw new Error('Invalid or missing field type');
      }

      // Assign element ID, if exists.
      if (config.id) {
        elm.setAttribute('id', config.id);
      }

      // Filter with REGEX
      if (config.filter && config.type != 'hidden') {
        elm.data = [];
        elm.data.regex = config.filter;
        elm.data.mesg  = config.error;
        elm.data.error = false;

        // Attach form events
        var formEvents = function() {
          this.WebformToolkit('_validateField',  elm);
          this.WebformToolkit('_setButtonState', this);
        };

        form.addEventListener('mouseover', formEvents);
        form.addEventListener('mousemove', formEvents);

        // Attach field events
        var fieldEvents = function() {
          this.WebformToolkit('_validateField',  this);
          this.WebformToolkit('_setButtonState', form);
        };

        elm.addEventListener('mousedown', fieldEvents);
        elm.addEventListener('mouseout',  fieldEvents);
        elm.addEventListener('focusout',  fieldEvents);
        elm.addEventListener('keypress', function(event) {
          if (event.keyCode == 9) {
            this.WebformToolkit('_validateField', this);
          }

          this.WebformToolkit('_setButtonState', form);
        });

        // Attach select menu events
        var select = elm.querySelector('select');
        if (select) {
          select.addEventListener('change', function() {
            this.WebformToolkit('_validateField',  this);
            this.WebformToolkit('_setButtonState', form);
          });
        }
      }

      div.appendChild(elm);

      // .. Description, if exists
      if (config.description) {
        var block = document.createElement('p');
        block.className   = 'field_desc';
        block.textContent = config.description;

        div.appendChild(block);
      }

      return div;
    },

    /**
     * Create input elements.
     *
     * @memberof WebformToolkit
     * @method _createInputElm
     * @private
     *
     * @param {Object} config
     * @returns {Object} DOM element
     */
    "_createInputElm": function(config) {
      var input = document.createElement('input');

      // .. Field attributes
      if (config.type) {
        input.setAttribute('type', config.type);
      }

      if (config.name) {
        input.setAttribute('name', config.name);
      }

      if (config.value) {
        input.setAttribute('value', config.value);
      }

      if (config.maxlength) {
        input.setAttribute('maxlength', config.maxlength);
      }

      if (config.required == 1) {
        input.required = true;
      }

      return input;
    },

    /**
     * Create FILE element.
     *
     * @memberof WebformToolkit
     * @method _createFileElm
     * @private
     *
     * @param {Object} config
     * @returns {Object} DOM element
     */
    "_createFileElm": function(config) {
      var input = document.createElement('input');
      input.setAttribute('type', 'file');

      // .. Field attributes
      if (config.name) {
        input.setAttribute('name', config.name);
      }

      if (config.maxlength) {
        input.setAttribute('size', config.maxlength);
      }

      return input;
    },

    /**
     * Create select menu elements.
     *
     * @memberof WebformToolkit
     * @method _createMenuElm
     * @private
     *
     * @param {Object} config
     *
     * @returns {Object} DOM element
     */
    "_createMenuElm": function(config) {
      var div = document.createElement('div');
      div.className = 'menu';

      var select = document.createElement('select');
      select.setAttribute('name', config.name);

      var opts  = config.filter.split('|'),
          first = null;

      // .. First option (custom)
      if (config.value) {
        opts.unshift(config.value);

        first = true;
      }

      // .. Select options
      for (var i = 0; i < opts.length; i++) {
        var val = opts[i];

        var option = document.createElement('option');
        option.textContent = val;

        if (!first) {
          option.setAttribute('value', val);
        }
        else {
          first = null;
        }

        if (val == config.value) {
          option.selected = true;
        }

        select.appendChild(option);
      }

      if (config.required == 1) {
        select.required = true;
      }

      div.appendChild(select);

      return div;
    },

    /**
     * Create RADIO button elements.
     *
     * @memberof WebformToolkit
     * @method _createRadioElm
     * @private
     *
     * @param {Object} config
     *
     * @returns {Object} DOM element
     */
    "_createRadioElm": function(config) {
      var div = document.createElement('div');
      div.className = 'radios';

      var opts = config.filter.split('|');

      for (var i = 0; i < opts.length; i++) {
        var val = opts[i];

        var input = document.createElement('input');
        input.setAttribute('type', 'radio');
        input.setAttribute('name', config.name);
        input.setAttribute('value', val);

        if (val == config.value) {
          input.checked = true;
        }

        var span = document.createElement('span');
        span.textContent = val;

        div.appendChild(input);
        div.appendChild(span);
      }

      return div;
    },

    /**
     * Create CHECKBOX elements.
     *
     * @memberof WebformToolkit
     * @method _createCheckBoxElm
     * @private
     *
     * @param {Object} config
     *
     * @returns {Object} DOM element
     */
    "_createCheckBoxElm": function(config) {
      var div = document.createElement('div');
      div.className = 'checkbox';

      var label = document.createElement('span');
      label.textContent = config.label;

      var input = document.createElement('input');
      input.setAttribute('type',  'checkbox');
      input.setAttribute('name',  config.name);
      input.setAttribute('value', config.value);

      if (config.value) {
        input.checked = true;
      }

      if (config.required == 1) {
        input.required = true;
      }

      div.appendChild(input);
      div.appendChild(label);

      return div;
    },

    /**
     * Create textarea elements.
     *
     * @memberof WebformToolkit
     * @method _createTextAreaElm
     * @private
     *
     * @param {Object} config
     *
     * @returns {Object} DOM element
     */
    "_createTextAreaElm": function(config) {
      var textarea = document.createElement('textarea');
      textarea.setAttribute('id',   config.name);
      textarea.setAttribute('name', config.name);

      if (config.required == 1) {
        textarea.required = true;
      }

      return textarea;
    },

    /**
     * Validate the form element value.
     *
     * @memberof WebformToolkit
     * @method _validateField
     * @private
     *
     * @param {Object} elm
     *
     * @returns {Boolean}
     */
    "_validateField": function(elm) {
      var data = elm.data,
          val  = elm.value;

      if (typeof val === 'undefined') return;

      var regex = data.regex,
          error = data.error,
          mesg  = data.mesg;

      var search = new RegExp(regex, 'g'),
          match  = null;

      // .. REGEX by type
      switch(elm.nodeName) {
        case 'INPUT' :
          match = search.test(val);
        break;

        case 'SELECT' :
          match = search.test(val);
        break;

        case 'TEXTAREA' :
          match = search.test(val);
        break;
      }

      var field = elm.parentNode,
          block = null;

      // Toggle the error message visibility.
      if (match === false && error === false) {
        block = document.createElement('p');
        block.className   = 'error_mesg';
        block.textContent = mesg;

        // .. Arrow elements
        var span1 = document.createElement('span'),
            span2 = document.createElement('span');

        span1.className = 'arrow_lft';
        span2.className = 'arrow_rgt';

        block.insertBefore(span1, block.firstChild);
        block.appendChild(span2);

        field.appendChild(block);

        elm.className = 'error_on';
        elm.data.error = true;

        block.style.display = 'block';
        block.style.opacity = 0;

        // Show error message.
        (function fadeIn() {
          var val = parseFloat(block.style.opacity);

          if (!((val += .1) > 1)) {
            block.style.opacity = val;

            requestAnimationFrame(fadeIn);
          }
        })();
      }
      else
      if (match === true && error === true) {
        block = field.querySelector('p');

        // Hide error message.
        (function fadeOut() {
          if ((block.style.opacity -= .1) < 0) {
            elm.className  = '';
            elm.data.error = false;

            block.style.display = 'none';
            block.remove();
          }
          else {
            requestAnimationFrame(fadeOut);
          }
        })();
      }

      return true;
    },

    /**
     * Enable/Disable submit button.
     *
     * @memberof WebformToolkit
     * @method _setButtonState
     * @private
     *
     * @param {Object} form
     */
    "_setButtonState": function(form) {
      var button = form.querySelector('input[type="submit"]');
      if (!button) return;

      if (this.WebformToolkit('_errorsExist', form)) {
        button.disabled = true;
      }
      else {
        button.disabled = false;
      }
    },

    /**
     * Return true if form errors exist.
     *
     * @memberof WebformToolkit
     * @method _errorsExist
     * @private
     *
     * @param {Object} form
     *
     * @returns {Boolean}
     */
    "_errorsExist": function(form) {
      var fields = form[0].elements;

      for (var i = 0; i < fields.length; i++) {
        var elm = fields[i];

        // Supported elements
        if (!/INPUT|SELECT|TEXTAREA/.test(elm.nodeName)) {
          continue;
        }

        if (elm.nodeName == 'INPUT' &&
          !/text|password|radio/.test(elm.type)) {
          continue;
        }

        // Do errors exist?
        if ((elm.required && (!elm.value || elm.selectedIndex <= 0)) || elm.data.error) {
          return true;
        }
      }
    }
  };

  Element.prototype.WebformToolkit = function(method) {
    if (methods[method]) {
      return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    }
    else
    if (typeof method === 'object' || !method) {
      return methods.init.apply(this, arguments);
    }
    else {
      throw new Error('Method ' +  method + ' does not exist in WebformToolkit');
    }
  };
})();
