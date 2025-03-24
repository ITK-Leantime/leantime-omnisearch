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
            $allComments = json_encode(app()->make(OmniSearchService::class)->getAllComments());
            $userId  = session('userdata.id'); // you need to set the value for $userId
            $searchSettings =  session('usersettings.omnisearch') ?: [];
            $allTimelogDescriptions = json_encode(app()->make(OmniSearchService::class)->getAllTimelogDescriptions());
            echo '<script>const omniSearch = ' . json_encode(['settings' => ['userId' => $userId, 'allComments' => $allComments, 'allTimelogDescription' => $allTimelogDescriptions, 'searchSettings' => $searchSettings]]) . '</script>';
            echo '<script src="/dist/js/omniSearch.v' . urlencode('%%VERSION%%') . '.js"></script>';
        }
    },
    5
);
