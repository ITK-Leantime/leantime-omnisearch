<?php

use Leantime\Core\Events\EventDispatcher;
use Leantime\Domain\Setting\Services\Setting as SettingsService;
use Leantime\Plugins\OmniSearch\Middleware\GetLanguageAssets;
use Leantime\Plugins\OmniSearch\Services\OmniSearch as OmniSearchService;
use Leantime\Core\Language;

EventDispatcher::add_filter_listener(
    'leantime.core.http.httpkernel.handle.plugins_middleware',
    fn(array $middleware) => array_merge($middleware, [GetLanguageAssets::class]),
);

EventDispatcher::add_event_listener(
    'leantime.core.template.tpl.*.afterScriptLibTags',
    function () {
        if (session('userdata.id') !== null) {
            $userId  = session('userdata.id');
            $searchSettings = session('usersettings.omnisearch') ?: [];

            // %%VERSION%% is substituted during release packaging. In dev the
            // placeholder is left as-is, which would freeze the URL and let the
            // browser cache forever; fall back to the bundle's mtime so every
            // rebuild produces a fresh URL.
            $jsPath = __DIR__ . '/dist/js/omniSearch.js';
            $jsVersion = '%%VERSION%%';
            if ($jsVersion === '%' . '%VERSION%' . '%' && is_file($jsPath)) {
                $jsVersion = (string) filemtime($jsPath);
            }
            $jsUrl = '/dist/js/omniSearch.js?' . http_build_query(['v' => $jsVersion]);

            echo '<script>const omniSearch = ' . json_encode(['settings' => ['userId' => $userId, 'searchSettings' => $searchSettings]]) . '</script>';
            echo '<script src="' . htmlspecialchars($jsUrl) . '"></script>';
        }
    },
    5
);
