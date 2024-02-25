'use strict';

import {browser, expect, $} from '@wdio/globals';

describe('Textarea element', function() {
  let fieldset;

  beforeEach(async function() {
    await browser.url(`${process.cwd()}/demo/index.html`);

    fieldset = await $('.field-group3');
  });

  describe('Label', function() {
    it('should contain attributes', async function() {
      const label = await fieldset.$('label');

      await expect(label).toHaveAttribute('for', 'description', {
        message: 'Attribute for="description" is defined'
      });
    });

    it('should contain text', async function() {
      const label = await fieldset.$('label');

      await expect(label).toHaveText('Description');
    });
  });

  describe('Field', function() {
    it('should contain attributes', async function() {
      const field = await fieldset.$('textarea');

      await expect(field).toHaveAttribute('id', 'description', {
        message: `Attribute id="description" is defined`
      });

      await expect(field).toHaveAttribute('name', 'description', {
        message: `Attribute name="description" is defined`
      });
    });


    it('should validate input', async function() {
      const label = await fieldset.$('label');
      const field = await fieldset.$('textarea');
      const error = await fieldset.$('.error-message');

      await field.setValue('Lorem ipsum $%&^');
      await field.click();
      await error.waitForExist({timeout: 3000});

      await expect(label).toHaveAttribute('aria-invalid', 'true', {
        message: 'Attribute aria-invalid="true" is defined'
      });

      await expect(field).toHaveAttribute('aria-invalid', 'true', {
        message: 'Attribute aria-invalid="true" is defined'
      });

      await expect(field).toHaveAttribute('aria-describedBy', 'error-description', {
        message: 'Attribute aria-describedBy="error-description" is defined'
      });

      await expect(error).toHaveText('Supported characters: Alphanumeric and ,.? characters');

      await field.setValue('Lorem ipsum dolor sit amet, consectetur adipiscing.');
      await field.click();
      await error.waitForExist({timeout: 3000, reverse: true});

      await expect(error).not.toBePresent();
    });
  });
});
