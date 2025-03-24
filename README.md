# Leantime OmniSearch

A plugin for Leantime that gives access to a plethora of shortcuts, to speed up navigating the system.

## Development

This plugin requires an instance of Leantime running locally.

Git clone this repo into app/Plugins as follows:

```shell
git clone https://github.com/ITK-Leantime/leantime-omnisearch app/Plugins/OmniSearch
```

Install the plugin through Leantime in your web browser.

The install process symlinks the built file `dist/omniSearch.js` with `public/dist/js/omniSearch.js`in leantime.

Run this to watch files

```shell
docker compose run --rm php npm install
docker compose run --rm php npm run dev
```

Run composer install

```shell name=development-install
docker run --interactive --rm --volume ${PWD}:/app itkdev/php8.3-fpm:latest composer install
```

### Composer normalize

```shell name=composer-normalize
docker run --rm --volume ${PWD}:/app itkdev/php8.3-fpm:latest composer normalize
```

### Coding standards

#### Check and apply with phpcs

```shell name=check-coding-standards
docker run --interactive --rm --volume ${PWD}:/app itkdev/php8.3-fpm:latest composer coding-standards-check
```

```shell name=apply-coding-standards
docker run --interactive --rm --volume ${PWD}:/app itkdev/php8.3-fpm:latest composer coding-standards-apply
```

#### Check and apply with prettier

```shell name=prettier-check
docker run --rm -v "$(pwd):/work" tmknom/prettier:latest --check assets
```

```shell name=prettier-apply
docker run --rm -v "$(pwd):/work" tmknom/prettier:latest --write assets
```

#### Check and apply markdownlint

```shell name=markdown-check
docker run --rm --volume "$PWD:/md" itkdev/markdownlint '**/*.md'
```

```shell name=markdown-apply
docker run --rm --volume "$PWD:/md" itkdev/markdownlint '**/*.md' --fix
```

#### Check with shellcheck

```shell name=shell-check
docker run --rm --volume "$PWD:/app" --workdir /app peterdavehello/shellcheck shellcheck bin/create-release
docker run --rm --volume "$PWD:/app" --workdir /app peterdavehello/shellcheck shellcheck bin/deploy
docker run --rm --volume "$PWD:/app" --workdir /app peterdavehello/shellcheck shellcheck bin/local.create-release
```

### Code analysis

```shell name=code-analysis
docker run --interactive --rm --volume ${PWD}:/app itkdev/php8.3-fpm:latest composer code-analysis
```

## Test release build

```shell name=test-create-release
docker compose build && docker compose run --rm php bin/create-release dev-test
```

The create-release script replaces `@@VERSION@@` in
[register.php](https://github.com/ITK-Leantime/leantime-omnisearch/blob/develop/register.php#L13) and
[Services/OmniSearch.php](https://github.com/ITK-Leantime/leantime-omnisearch/blob/develop/Services/OmniSearch.php#L12)
with the tag provided (in the above it is `dev-test`).

## Deploy

The deploy script downloads a [release](https://github.com/ITK-Leantime/leantime-omnisearch/releases) from Github and
unzips it. The script should be passed a tag as argument. In the process the script deletes itself, but the script
finishes because it [is still in memory](https://linux.die.net/man/3/unlink).
