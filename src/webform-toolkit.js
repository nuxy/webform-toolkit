/**
 *  webform-toolkit
 *  Create a HTML form with field validation and custom errors.
 *
 *  Copyright 2012-2024, Marc S. Brooks (https://mbrooks.info)
 *  Licensed under the MIT license:
 *  http://www.opensource.org/licenses/mit-license.php
 */

'use strict';

/**
 * @param {Element} container
 *   Containing HTML element.
 *
 * @param {Function} setttings
 *   Webform form settings.
 *
 * @param {Function} callback
 *   Returns defined webform values.
 */
function WebformToolkit(container, settings, callback) {
  const self = this;

  (function() {
    const {action, groups} = settings;

    if (action && groups.length) {
      renderWebform();
    } else {
      throw new Error('Failed to initialize (missing settings)');
    }
  })();

  /**
   * Create new instance of Webform-Toolkit
   */
  function renderWebform() {
    const form = createForm();
    container.appendChild(form);
    setButtonState(form);
  }

  /**
   * Create form field elements.
   *
   * @return {Element}
   */
  function createForm() {
    const form = document.createElement('form');
    form.classList.add('webform');

    // Set POST action URI/URL
    if (settings?.action) {
      form.setAttribute('method', 'POST');
      form.setAttribute('enctype', 'multipart/form-data');
      form.setAttribute('action', settings.action);
    }

    // Create hidden elements, if POST parameters exist.
    if (settings?.params) {
      const params = settings.params.split('&');

      for (let i = 0; i < params.length; i++) {
        const param = params[i].split('=');

        const elm = createInputElm({
          type: 'hidden',
          name: param[0],
          value: param[1]
        });

        form.appendChild(elm);
      }
    }

    // Create field elements.
    for (let i = 0; i < settings.groups.length; i++) {
      const group = settings.groups[i];

      const fieldset = document.createElement('fieldset');
      fieldset.classList.add('field-group' + i);

      // .. Legend, if exists.
      if (group.legend) {
        const legend = document.createElement('legend');
        legend.textContent = group.legend;

        fieldset.appendChild(legend);
      }

      for (let j = 0; j < group.fields.length; j++) {
        const elm = createField(form, group.fields[j]);

        fieldset.appendChild(elm);
      }

      form.appendChild(fieldset);
    }

    // Create submit button.
    if (settings?.submit !== false) {
      const div = document.createElement('div');
      div.classList.add('form-submit');

      const button = document.createElement('input');
      button.setAttribute('type',  'submit');
      button.setAttribute('value', 'Submit');

      div.appendChild(button);

      form.appendChild(div);
    }

    // Bind form submit event.
    form.addEventListener('submit', function(event) {
      event.preventDefault();

      if (checkErrorsExist(form)) { return }

      // Return callback with form object response.
      if (typeof callback === 'function') {
        callback(Object.fromEntries(new FormData(form)));
      }

      // POST form values.
      else {
        self.submit();
      }
    });

    return form;
  }

  /**
   * Create field elements.
   *
   * @param {Element} form
   *   HTML form element.
   *
   * @param {Object} config
   *   Field configuration.
   *
   * @return {Element}
   */
  function createField(form, config) {
    let elm = null;

    // Supported elements
    switch (config.type) {
      case 'color':
      case 'date':
      case 'email':
      case 'hidden':
      case 'number':
      case 'password':
      case 'quantity':
      case 'range':
      case 'submit':
      case 'text':
      case 'time':
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
        throw new Error('Invalid or missing field type');
    }

    config?.id && elm.setAttribute('id', config.id);

    if (config.type === 'hidden' || config.type === 'submit') {
      return elm;
    }

    const div = document.createElement('div');

    // .. Label, if exists.
    if (config.type !== 'checkbox') {
      const label = document.createElement('label');
      label.setAttribute('for', config.id);

      if (config.required) {
        const span = document.createElement('span');
        span.classList.add('required');

        label.appendChild(span);
      }

      label.textContent = config.label;

      div.appendChild(label);
    }

    // Filter with REGEX
    if (config?.filter) {
      elm.regex   = config.filter;
      elm.message = config.error;
      elm.error   = false;

      // Attach field events.
      const handler = function() {
        validateField(this),
        setButtonState(form);
      };

      if (config.type === 'select') {

        // .. Select menu
        elm.addEventListener('change', handler);
      } else {

        // .. Everything else.
        elm.addEventListener('focusout', handler);
        elm.addEventListener('keypress', handler);
        elm.addEventListener('keyup',    handler);
        elm.addEventListener('mouseout', handler);
      }
    }

    div.appendChild(elm);

    // .. Description, if exists.
    if (config?.description) {
      const block = document.createElement('p');
      block.classList.add('description');
      block.setAttribute('role', 'info');
      block.textContent = config.description;

      div.appendChild(block);
    }

    return div;
  }

  /**
   * Create input element.
   *
   * @param {Object} config
   *   Field configuration.
   *
   * @return {Element}
   */
  function createInputElm(config) {
    const input = document.createElement('input');

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

    if (config?.maxlength
      && (config.type === 'password' || config.type === 'text')) {
      input.setAttribute('maxlength', config.maxlength);
    }

    if (config?.max || config?.min || config?.step
      && (config.type === 'number' || config.type === 'quantity')) {
      input.setAttribute('max', config.max);
      input.setAttribute('min', config.min);

      if (config.type === 'step') {
        input.setAttribute('step', config.step);
      }
    }

    if (config?.placeholder) {
      input.setAttribute('placeholder', config.placeholder);
    }

    input.required = !!config.required;

    return input;
  }

  /**
   * Create file element.
   *
   * @param {Object} config
   *   Field configuration.
   *
   * @return {Elememt}
   */
  function createFileElm(config) {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');

    // .. Field attributes
    if (config.name) {
      input.setAttribute('name', config.name);
    }

    return input;
  }

  /**
   * Create select menu element.
   *
   * @param {Object} config
   *   Field configuration.
   *
   * @return {Element}
   */
  function createMenuElm(config) {
    const select = document.createElement('select');
    select.classList.add('menu');
    select.setAttribute('name', config.name);

    const opts = config.filter.split('|');

    let first = false;

    // .. First option (custom)
    if (config?.value) {
      opts.unshift(config.value);

      first = true;
    }

    // .. Select options
    for (let i = 0; i < opts.length; i++) {
      const val = opts[i];

      const option = document.createElement('option');
      option.textContent = val;

      if (!first) {
        option.setAttribute('value', val);
      }
      else {
        first = false;
      }

      if (val == config.value) {
        option.selected = true;
      }

      select.appendChild(option);
    }

    select.required = !!config.required;

    return select;
  }

  /**
   * Create radio button elements.
   *
   * @param {Object} config
   *   Field configuration.
   *
   * @return {Element}
   */
  function createRadioElm(config) {
    const div = document.createElement('div');
    div.classList.add('radios');

    const opts = config.filter.split('|');

    for (let i = 0; i < opts.length; i++) {
      const val = opts[i];

      const input = document.createElement('input');
      input.setAttribute('type', 'radio');
      input.setAttribute('name', config.name);
      input.setAttribute('value', val);

      if (val == config.value) {
        input.checked = true;
      }

      const span = document.createElement('span');
      span.textContent = val;

      div.appendChild(input);
      div.appendChild(span);
    }

    return div;
  }

  /**
   * Create checkbox element.
   *
   * @param {Object} config
   *   Field configuration.
   *
   * @return {Element}
   */
  function createCheckBoxElm(config) {
    const div = document.createElement('div');
    div.classList.add('checkbox');

    const label = document.createElement('span');
    label.textContent = config.label;

    const input = document.createElement('input');
    input.setAttribute('type',  'checkbox');
    input.setAttribute('name',  config.name);
    input.setAttribute('value', config.value);

    if (config.value) {
      input.checked = true;
    }

    input.required = !!config.required;

    div.appendChild(input);
    div.appendChild(label);

    return div;
  }

  /**
   * Create textarea element.
   *
   * @param {Object} config
   *   Field configuration.
   *
   * @return {Element}
   */
  function createTextAreaElm(config) {
    const textarea = document.createElement('textarea');
    textarea.setAttribute('name', config.name);

    if (config.placeholder) {
      textarea.setAttribute('placeholder', config.placeholder);
    }

    textarea.required = !!config.required;

    return textarea;
  }

  /**
   * Validate form element value.
   *
   * @param {Element} elm
   *   HTML input element.
   *
   * @return {Boolean}
   */
  function validateField(elm) {
    const val = elm?.value;

    if (!val) {
      return;
    }

    const {regex, error, message} = elm;

    const search = new RegExp(regex, 'g');

    let match = false;

    // .. REGEX by type
    switch(elm.tagName) {
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

    const field = elm.parentNode;
    const label = field.querySelector('label');

    let block = null;

    // Toggle error message visibility.
    if (match === false && error === false) {
      const errorId = `error-${elm.id}`;

      label.setAttribute('aria-invalid', 'true');

      block = document.createElement('p');
      block.classList.add('error-message');
      block.setAttribute('id', errorId);
      block.setAttribute('aria-invalid', 'true');
      block.textContent = message;

      field.appendChild(block);

      elm.classList.add('error-on');
      elm.setAttribute('aria-describedBy', errorId);
      elm.setAttribute('aria-invalid', 'true');
      elm.error = true;

      block.style.display = 'block';
      block.style.opacity = 0;

      // Show error message.
      (function fadeIn() {
        let val = parseFloat(block.style.opacity);

        if (((val += 0.1) > 1) === false) {
          block.style.opacity = val;

          window.requestAnimationFrame(fadeIn);
        }
      })();
    }
    else
    if (match === true && error === true) {
      block = field.querySelector('p');

      elm.error = false;

      // Hide error message.
      (function fadeOut() {
        if ((block.style.opacity -= 0.1) < 0.1) {
          label.removeAttribute('aria-invalid');

          elm.classList.remove('error-on');
          elm.removeAttribute('aria-describedBy');
          elm.removeAttribute('aria-invalid');

          block.style.display = 'none';
          block.remove();
        }
        else {
          window.requestAnimationFrame(fadeOut);
        }
      })();
    }

    return true;
  }

  /**
   * Enable/Disable submit button.
   *
   * @param {Element} form
   *   HTML form element.
   */
  function setButtonState(form) {
    const button = form.querySelector('input[type="submit"]');

    button.disabled = checkErrorsExist(form);
  }

  /**
   * Return true, if form errors exist.
   *
   * @param {Element} form
   *   HTML form element.
   *
   * @return {Boolean}
   */
  function checkErrorsExist(form) {
    const fields = form.querySelectorAll('input, select, textarea');

    for (let i = 0; i < fields.length; i++) {
      const field = fields[i];

      // Supported elements.
      if (field.tagName == 'INPUT' &&
        !/text|password|radio|checkbox/.test(field.type)) {
        continue;
      }

      // Do errors exist?
      if ((field?.required && (!field.value || field?.selectedIndex <= 0)) || field.error) {
        return true;
      }
    }
  }

  /**
   * Protected members.
   */
  self.create = function(config, callback) {
    const form = container.querySelector('form');

    const elm = createField(form, config);

    if (form && elm && typeof callback === 'function') {
      callback(form, elm);
    } else {
      throw new Error('Failed to create (malformed config)');
    }
  };

  return self;
}

/**
 * Set global/exportable instance, where supported.
 */
window.webformToolkit = function(container, settings, options) {
  return new WebformToolkit(container, settings, options);
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = WebformToolkit;
}
