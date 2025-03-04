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

## [3.0.1] - 2024-02-25

- Support WCAG 2.1 aria roles

## [3.0.2] - 2024-02-29

### Updated

- Replaced Travis-CI with Github workflow

## [3.1.0] - 2024-04-02

### Added

- Support extended INPUT types

## [3.1.1] - 2024-04-19

### Added

- Support submit button INPUT type
- Ability to override submit button (`submit: false`)

### Updated

- Removed DIV wrapper on hidden/submit elements

## [3.1.2] - 2024-04-23

- Fixed [message fadeOut](https://github.com/nuxy/webform-toolkit/commit/adc5b339d5451f443136b3a25027463cbf7ad38b), when multiple `<p>` exist.
- Updated field filter/error message
- Added descriptor to error responses

## [3.1.3] - 2024-06-07

### Added

- Support tokens in [description field](https://github.com/nuxy/webform-toolkit/tree/master?tab=readme-ov-file#supported-text-tokens)

### Updated

- Upgraded outdated NPM dependencies

## [3.1.4] - 2024-07-13

- NPM security updates ([ws override](https://github.com/advisories/GHSA-3h5v-q93c-6h6q))

## [3.1.5] - 2025-03-01

- NPM security updates ([cross-spawn](https://github.com/advisories/GHSA-3xgq-45jj-v275)/[micromatch](https://github.com/advisories/GHSA-952p-6rrq-rcjv))
- Updated demo - Added device only responsice overrides
