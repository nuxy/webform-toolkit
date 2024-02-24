'use strict';

import {browser, expect, $} from '@wdio/globals';

describe('Input hidden element', function() {
  let fieldset;

  beforeEach(async function() {
    await browser.url(`${process.cwd()}/demo/index.html`);

    fieldset = await $('.field-group0');
  });

  describe('Field', function() {
    it('should contain attributes', async function() {
      const field = await fieldset.$('input[type="hidden"]');

      await expect(field).toHaveAttribute('type', 'hidden', {
        message: 'Attribute type="hidden" is defined'
      });

      await expect(field).toHaveAttribute('name', 'token', {
        message: 'Attribute name="token" is defined'
      });

      await expect(field).toHaveAttribute('value', '00112233-4455-6677-8899-aabbccddeeff', {
        message: 'Attribute name="00112233-4455-6677-8899-aabbccddeeff" is defined'
      });
    });
  });
});
