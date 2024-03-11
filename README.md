# Leantime OmniSearch

A plugin for Leantime that gives access to a plethora of shortcuts, to speed up
navigating the system.

## Development

This plugin requires an instance of Leantime running locally.

Git clone this repo into app/Plugins as follows:

```shell
git clone https://github.com/ITK-Leantime/leantime-omnisearch app/Plugins/OmniSearch
```

Install the plugin through Leantime in your web browser.

The install process symlinks the plugin assets to
`public/dist/css/omniSearch.css` and `public/dist/js/omniSearch.js`,
respectively, which are the files loaded in the frontend.

Changes should be made to the plugin assets files.

### Coding standards

Run prettier via the following command:

```shell
docker run -it --volume ${PWD}:/app --rm node:20 yarn --cwd /app install
docker run -it --volume ${PWD}:/app --rm node:20 yarn --cwd /app prettier assets --write
```


``` shell
docker run --tty --interactive --rm --volume ${PWD}:/app itkdev/php8.1-fpm:latest composer install
docker run --tty --interactive --rm --volume ${PWD}:/app itkdev/php8.1-fpm:latest composer coding-standards-check
```
