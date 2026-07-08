# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

* [PR-46](https://github.com/ITK-Leantime/leantime-omnisearch/pull/46)
  Fix trigger rule for new leantime editor.
* [PR-45](https://github.com/ITK-Leantime/leantime-omnisearch/pull/45)
  Taller, scrollable result dropdown and a result count per group.

## [3.0.2] - 2026-01-23

* [PR-43](https://github.com/ITK-Leantime/leantime-omnisearch/pull/43)
  Scope assets to only affect plugin code.

## [3.0.1] - 2025-04-03

* [PR-41](https://github.com/ITK-Leantime/leantime-omnisearch/pull/41)
  Added subtask and bug to searched ticket types
  Added autofocus to search field post init

## [3.0.0] - 2025-03-28

* [PR-38](https://github.com/ITK-Leantime/leantime-omnisearch/pull/38)
  Remove dist from gitignore to make build script work

* [PR-35](https://github.com/ITK-Leantime/leantime-omnisearch/pull/35)
  * Upgrade omnisearch plugin leantime 3 4 3
  * Added the itkdev markdownlinter (and markdownlinter ignore file)
  * Removed use of the api
  * Updated leantime in composer and removed rimi repository
  * Removed dist files from github

## [2.1.0] - 2025-01-28

* [PR-33](https://github.com/ITK-Leantime/leantime-omnisearch/pull/33)
  * Added user settings to determine search scope
* [PR-32](https://github.com/ITK-Leantime/leantime-omnisearch/pull/32)
  * Add snow

## [2.0.0] - 2024-09-18

## [1.2.7] - 2024-09-13

* [PR-28](https://github.com/ITK-Leantime/leantime-omnisearch/pull/29)
  * Streamline with template repository

* [PR-27](https://github.com/ITK-Leantime/leantime-omnisearch/pull/27)
  * Added compatability for Leantime 3.2

* [PR-25](https://github.com/ITK-Leantime/leantime-omnisearch/pull/25)
  * Document deploy script and `%%VERSION%%` replacement.
  * Update release.yml to do both release and pre-release

* [PR-24](https://github.com/ITK-Leantime/leantime-omnisearch/pull/24)
  * Added deploy script
  * Removed prerelease flag from release.yml

* [PR-12](https://github.com/ITK-Leantime/leantime-omnisearch/pull/12)
  * Fixed settins controller file name. Cleaned up.

* [PR-23](https://github.com/ITK-Leantime/leantime-omnisearch/pull/23)
  * Markdown linter added

* [PR-22](https://github.com/ITK-Leantime/leantime-omnisearch/pull/22)
  * Change yarn to npm
  * Add build script
  * Add check-create-release to pr.yml
  * Add pre-release.yml and release.yml to github workflows
  * Add dockerfile + install of rsync and node
  * Add dev/prod mode to webpack
  * Update version in package to reflect latest tag

* [PR-20](https://github.com/ITK-Leantime/leantime-omnisearch/pull/20)
  * Build with webpack
  * Use npm package fuzzy-search (<https://www.npmjs.com/package/fuzzy-search>)
  * Change folder structure
  * Setup yarn audit on pr
  * Update readme
  * Only show todo/project when user has typed 3 characters

## [1.2.3] 2024-06-05

* Make it possible to search on todo id
* Make done todos visually stand out, and sort the array so they appear at the bottom

## [1.2.2] 2024-06-03

* Add projectname in parentheses to search result on todos/tickets
* Expand filter results by tolowercase'ing, because the result from the leantime has type set to be either "Task" and "task".
* remove sprintname/client from searcher to simplify result
* add tags to omnisearch

## [1.2.1] 2024-04-29

* Used `APP_ROOT` for installing assets.
* Moved Select2 dependency from CDN to files in plugin.

## [1.2.0] 2024-02-12

### Fixed

* Typo in cache constant.

### Added

* Settings page.
* Added github actions

## [1.1.0] 2024-02-01

### Added

* Added caching.

### Fixed

* Bug where data would load in after overlay close.

## [1.0.1] 2024-01-31

### Fixed

* Readded searchCriteria api parameter for LT 2.4.8.

## [1.0.0] 2024-01-30

### Added

* Added OmniSearch plugin.
* Added fuzzy search.
* Install, uninstall script.

[Unreleased]: https://github.com/ITK-Leantime/leantime-omnisearch/compare/3.0.2...HEAD
[3.0.2]: https://github.com/ITK-Leantime/leantime-omnisearch/compare/3.0.1...3.0.2
[3.0.1]: https://github.com/ITK-Leantime/leantime-omnisearch/compare/3.0.0...3.0.1
[3.0.0]: https://github.com/ITK-Leantime/leantime-omnisearch/compare/2.1.0...3.0.0
[2.1.0]: https://github.com/ITK-Leantime/leantime-omnisearch/compare/2.0.0...2.1.0
[2.0.0]: https://github.com/ITK-Leantime/leantime-omnisearch/compare/1.2.7...2.0.0
[1.2.7]: https://github.com/ITK-Leantime/leantime-omnisearch/compare/1.2.3...1.2.7
[1.2.3]: https://github.com/ITK-Leantime/leantime-omnisearch/compare/1.2.2...1.2.3
[1.2.2]: https://github.com/ITK-Leantime/leantime-omnisearch/compare/1.2.1...1.2.2
[1.2.1]: https://github.com/ITK-Leantime/leantime-omnisearch/compare/1.2.0...1.2.1
[1.2.0]: https://github.com/ITK-Leantime/leantime-omnisearch/compare/1.1.0...1.2.0
[1.1.0]: https://github.com/ITK-Leantime/leantime-omnisearch/compare/1.0.1...1.1.0
[1.0.1]: https://github.com/ITK-Leantime/leantime-omnisearch/compare/1.0.0...1.0.1
[1.0.0]: https://github.com/ITK-Leantime/leantime-omnisearch/releases/tag/1.0.0
