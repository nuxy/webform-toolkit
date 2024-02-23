'use strict';

import {browser, expect, $} from '@wdio/globals';

describe('Select menu element', function() {
  let fieldset, container;

  beforeEach(async function() {
    await browser.url(`${process.cwd()}/demo/index.html`);

    fieldset  = await $('.field-group2');
    container = await fieldset.$$('div')[0];
  });

  describe('Label', function() {
    it('should contain attributes', async function() {
      const label = await container.$('label');

      await expect(label).toHaveAttribute('for', 'age', {
        message: 'Attribute for="age" is defined'
      });
    });

    it('should contain text', async function() {
      const label = await container.$('label');

      await expect(label).toHaveText('Age Group');
    });
  });

  describe('Field', function() {
    it('should contain attributes', async function() {
      const field = await fieldset.$('select');

      await expect(field).toHaveAttribute('id', 'age', {
        message: `Attribute id="age" is defined`
      });

      await expect(field).toHaveAttribute('name', 'age', {
        message: `Attribute name="age" is defined`
      });

      await expect(field).toHaveAttribute('required', 'true', {
        message: `Attribute required="true" is defined`
      });
    });

    it('should validate input', async function() {
      const field = await fieldset.$('select');
      const error = await fieldset.$('.error-message');

      await field.selectByIndex(0);
      await error.waitForExist({timeout: 3000});

      await expect(error).toHaveText('Must select a valid age group');

      await field.selectByVisibleText('18-24');
      await error.waitForExist({timeout: 3000, reverse: true});

      await expect(error).not.toBePresent();
    });
  });
});
