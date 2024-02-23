'use strict';

import {browser, expect, $} from '@wdio/globals';

describe('Input text elements', function() {
  let fieldset;

  beforeEach(async function() {
    await browser.url(`${process.cwd()}/demo/index.html`);

    fieldset = await $('.field-group0');
  });

  describe('Label', function() {
    it('should contain attributes', async function() {
      const attrValues = ['username', 'password'];

      const containers = await fieldset.$$('div');

      for (let i = 0; i < containers.length; i++) {
        const container = containers[i];
        const attrValue = attrValues[i];

        const label = await container.$('label');

        await expect(label).toHaveAttribute('for', attrValue, {
          message: `Attribute for="${attrValue}" is defined`
        });
      }
    });

    it('should contain text', async function() {
      const textValues = ['User Name', 'Password'];

      const containers = await fieldset.$$('div');

      for (let i = 0; i < containers.length; i++) {
        const container = containers[i];
        const textValue = textValues[i];

        const label = await container.$('label');

        await expect(label).toHaveText(textValue);
      }
    });
  });

  describe('Field', function() {
    it('should contain attributes', async function() {
      const attrValues = ['username', 'password'];
      const fieldTypes = ['text', 'password'];

      const containers = await fieldset.$$('div');

      for (let i = 0; i < containers.length; i++) {
        const container = containers[i];
        const attrValue = attrValues[i];
        const fieldType = fieldTypes[i];

        const field = await container.$('input');

        await expect(field).toHaveAttribute('id', attrValue, {
          message: `Attribute id="${attrValue}" is defined`
        });

        await expect(field).toHaveAttribute('type', fieldType, {
          message: `Attribute type="${fieldType}" is defined`
        });

        await expect(field).toHaveAttribute('name', attrValue, {
          message: `Attribute name="${attrValue}" is defined`
        });

        await expect(field).toHaveAttribute('maxlength', '15', {
          message: 'Sttribute maxlength="15" is defined'
        });

        await expect(field).toHaveAttribute('required', 'true', {
          message: 'Attribute required="true" is defined'
        });
      }
    });

    it('should validate input', async function() {
      const container1 = await fieldset.$('div:first-child');
      const container2 = await fieldset.$('div:last-child');

      const field1 = await container1.$('#username');
      const error1 = await container1.$('.error-message');

      await field1.setValue('john3$%&');
      await field1.click();
      await error1.waitForExist({timeout: 3000});

      await expect(error1).toHaveText('Supported characters: A-Z, 0-9 and underscore');

      await field1.setValue('john_doe');
      await field1.click();
      await error1.waitForExist({timeout: 3000, reverse: true});

      await expect(error1).not.toBePresent();

      const field2 = await container2.$('#password');
      const error2 = await container2.$('.error-message');

      await field2.setValue('password');
      await field2.click();
      await error2.waitForExist({timeout: 3000});

      await expect(error2).toHaveText('The password entered is not valid');

      await field2.setValue('my$ecr3t');
      await field2.click();
      await error2.waitForExist({timeout: 3000, reverse: true});

      await expect(error2).not.toBePresent();
    });
  });
});
