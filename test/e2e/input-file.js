'use strict';

import {browser, expect, $} from '@wdio/globals';

describe('Input file element', function() {
  let fieldset;

  beforeEach(async function() {
    await browser.url(`${process.cwd()}/demo/index.html`);

    fieldset = await $('.field-group1');
  });

  describe('Label', function() {
    it('should contain attributes', async function() {
      const label = await fieldset.$('label');

      await expect(label).toHaveAttribute('for', 'image', {
        message: 'Attribute for="image" is defined'
      });
    });

    it('should contain text', async function() {
      const label = await fieldset.$('label');

      await expect(label).toHaveText('Profile Image', {
        message: "Contains value 'Profile Image'"
      });
    });
  });

  describe('Field', function() {
    it('should contain attributes', async function() {
      const field = await fieldset.$('input');

      await expect(field).toHaveAttribute('type', 'file', {
        message: `Attribute type="file" is defined`
      });

      await expect(field).toHaveAttribute('id', 'image', {
        message: `Attribute id="image" is defined`
      });

      await expect(field).toHaveAttribute('name', 'upload', {
        message: `Attribute name="upload" is defined`
      });
    });
  });
});
