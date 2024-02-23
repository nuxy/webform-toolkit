'use strict';

import {browser, expect, $} from '@wdio/globals';

describe('Radio element', function() {
  let fieldset, container;

  beforeEach(async function() {
    await browser.url(`${process.cwd()}/demo/index.html`);

    fieldset  = await $('.field-group2');
    container = await fieldset.$$('div')[1];
  });

  describe('Field', function() {
    const values = ['Male', 'Female', 'N/A'];

    it('should contain attributes', async function() {
      const fields = await container.$$('input[type="radio"]');

      for (let i = 0; i < fields.length; i++) {
        const field = fields[i];
        const value = values[i];

        await expect(field).toHaveAttribute('name', 'gender', {
          message: "Field name 'gender' is defined"
        });

        await expect(field).toHaveAttribute('value', value, {
          message: `Field value '${value}' is defined`
        });
      }
    });

    it('should show value', async function() {
      const messages = await container.$$('span');

      for (let i = 0; i < messages.length; i++) {
        const message = messages[i];

        await expect(message).toHaveText(values[i]);
      }
    });

    it('should handle event', async function() {
      const fields = await container.$$('input[type="radio"]');

      for (let field of fields) {
        await expect(field).toBeClickable({
          message: 'Radio is clickable'
        });

        await field.click();

        await expect(field).toBeChecked({
          message: 'Radio is checked'
        });
      }
    });
  });
});
