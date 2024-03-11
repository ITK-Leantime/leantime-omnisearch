<?php

namespace Leantime\Plugins\OmniSearch\Services;

/**
 * OmniSearch plugin.
 */
class OmniSearch
{
    private static $assets = [
    // source => target
    __DIR__ . '/../assets/js/omniSearch.js' => APP_ROOT . '/public/dist/js/omniSearch.js',
    __DIR__ . '/../assets/css/omniSearch.css' => APP_ROOT . '/public/dist/css/omniSearch.css',
    ];

  /**
   * Install plugin.
   *
   * @return void
   */
    public function install(): void
    {
        foreach (static::$assets as $source => $target) {
            if (file_exists($target)) {
                unlink($target);
            }
            symlink($source, $target);
        }
    }

  /**
   * Uninstall plugin.
   *
   * @return void
   */
    public function uninstall(): void
    {
        foreach (static::$assets as $target) {
            if (file_exists($target)) {
                unlink($target);
            }
        }
    }
}
