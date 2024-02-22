'use strict';

import {browser, expect, $} from '@wdio/globals';

describe('Input checkbox element', function() {
  let fieldset, container;

  beforeEach(async function() {
    await browser.url(`${process.cwd()}/demo/index.html`);

    fieldset  = await $('.field-group4');
    container = await fieldset.$('.checkbox');
  });

  describe('Container', function() {
    it('should show message', async function() {
      const message = await container.$('span');
      const text    = "I want to check this box because it's a box";

      await expect(message).toHaveText(text, {
        message: `Contains value '${text}'`
      });
    });
  });

  describe('Field', function() {
    it('should contain attributes', async function() {
      const field = await container.$('input[type="checkbox"]');

      await expect(field).toHaveAttribute('name', 'confirm', {
        message: "Field name 'confirm' is defined"
      });

      await expect(field).toHaveAttribute('value', '1', {
        message: "Field value '1' is defined"
      });
    });

    it('should handle event', async function() {
      const field = await container.$('input[type="checkbox"]');

      await expect(field).toBeClickable({
        message: 'Checkbox is clickable'
      });

      await expect(field).toBeChecked({
        message: 'Checkbox is checked'
      });

      await field.click();

      await expect(field).not.toBeChecked({
        message: 'Checkbox is unchecked'
      });
    });
  });
});
