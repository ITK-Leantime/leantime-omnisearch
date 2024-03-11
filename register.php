<?php

use Leantime\Core\Events;
use Leantime\Domain\Setting\Services\Setting as SettingsService;

Events::add_event_listener(
    'leantime.core.template.tpl.*.afterScriptLibTags',
    function () {
        if (isset($_SESSION['userdata']['id']) && !is_null($_SESSION['userdata']['id'])) {
            /** @var SettingsService $settings */
            $settings = app()->make(SettingsService::class);
            $options = [
                'settings' => [
                    'userId' => (int) $_SESSION['userdata']['id'],
                    'projectCacheExpiration' => (int) ($settings->getSetting('omnisearchsettings.projectscache') ?: 2400),
                    'ticketCacheExpiration' => (int) ($settings->getSetting('omnisearchsettings.ticketscache') ?: 1200),
                ],
            ];
            echo '<script>const omniSearch = ' . json_encode($options) . '</script>';
            echo '<link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" rel="stylesheet" />';
            echo '<script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>';
            echo '<link rel="stylesheet" href="/dist/css/omniSearch.css"></link>';
            echo '<script src="/dist/js/omniSearch.js"></script>';
        }
    },
    5
);
