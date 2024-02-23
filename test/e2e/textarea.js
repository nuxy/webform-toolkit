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

      await expect(label).toHaveAttribute('for', 'comments', {
        message: 'Attribute for="comments" is defined'
      });
    });

    it('should contain text', async function() {
      const label = await fieldset.$('label');

      await expect(label).toHaveText('Comments');
    });
  });

  describe('Field', function() {
    it('should contain attributes', async function() {
      const field = await fieldset.$('textarea');

      await expect(field).toHaveAttribute('id', 'comments', {
        message: `Attribute id="comments" is defined`
      });

      await expect(field).toHaveAttribute('name', 'comments', {
        message: `Attribute name="comments" is defined`
      });
    });


    it('should validate input', async function() {
      const field = await fieldset.$('textarea');
      const error = await fieldset.$('.error-message');

      await field.setValue('Lorem ipsum $%&^');
      await field.click();
      await error.waitForExist({timeout: 3000});

      await expect(error).toHaveText('Supported characters: Alphanumeric and ,.? characters');

      await field.setValue('Lorem ipsum dolor sit amet, consectetur adipiscing.');
      await field.click();
      await error.waitForExist({timeout: 3000, reverse: true});

      await expect(error).not.toBePresent();
    });
  });
});
