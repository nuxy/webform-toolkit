'use strict';

import {browser, expect, $} from '@wdio/globals';

describe('Input file element', function() {
  let fieldset;

  beforeEach(async function() {
    await browser.url(`${process.cwd()}/demo/index.html`);

    fieldset = await $('.field-group1');
  });

  describe('Legend', function() {
    it('should contain text', async function() {
      const legend = fieldset.$('legend');

      await expect(legend).toHaveText('User Profile');
    });
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

      await expect(label).toHaveText('Avatar Image');
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

  describe('Description', function() {
    it('should contain text', async function() {
      const text = await fieldset.$('.description');

      await expect(text).toHaveHTML('You can upload a <a href="https://en.wikipedia.org/wiki/JPEG">JPEG</a>, <a href="https://en.wikipedia.org/wiki/GIF">GIF</a> or <a href="https://en.wikipedia.org/wiki/PNG">PNG</a> <em>(2 MB max)</em>', {includeSelectorTag: false});
    });
  });
});
