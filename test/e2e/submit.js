'use strict';

import {browser, expect, $} from '@wdio/globals';
import {join} from 'path'

describe('Submit button', function() {
  let form;

  beforeEach(async function() {
    await browser.url(`${process.cwd()}/demo/index.html`);

    form = await $('.webform');
  });

  describe('Callback', function() {
    it('should return data', async function() {
      const field1 = await form.$('#username');
      await field1.setValue('john_doe');

      const field2 = await form.$('#password');
      await field2.setValue('my$ecr3t');

      const field3 = await form.$('#age');
      await field3.selectByVisibleText('18-24');

      const field4 = await form.$('#gender input[value="N/A"]');
      await field4.click();

      const field5 = await form.$('#image');
      await field5.setValue(join(process.cwd(), 'package.gif'));

      const field6 = await form.$('#comments');
      await field6.setValue('Lorem ipsum dolor sit amet, consectetur adipiscing.');

      const field7 = await form.$('#confirm input');
      await field7.click();
    });
  });
});
