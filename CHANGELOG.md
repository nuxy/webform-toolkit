# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0) and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.0.0] - 2024-02-24

### Changed

The following items are **breaking changes** and not supported in prior releases.

- Updated future releases to be installed via [NPM](https://npmjs.com) vs [Bower](https://bower.io) (legacy only).
- Refactored instance arguments `new WebformToolkit(container, settings, callback)`
- Replaced [QUnit](https://qunitjs.com) testing with [WebdriverIO](https://webdriver.io) framework.
- Integrated [Babel](https://babeljs.io) transpilation build process.
