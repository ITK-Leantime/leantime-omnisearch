<?php
// phpcs:ignoreFile

namespace Leantime\Plugins\OmniSearch\Middleware;

use Closure;
use Illuminate\Support\Facades\Cache;
use Leantime\Core\Configuration\Environment as Configuration;
use Leantime\Core\Http\IncomingRequest;
use Symfony\Component\HttpFoundation\Response;
use Leantime\Core\Language;

/**
 * https://github.com/Leantime/plugin-template/blob/main/Middleware/GetLanguageAssets.php
 */
class GetLanguageAssets
{
    /**
     * Constructor.
     */
    public function __construct(
        private Language $language,
        private Configuration $config,
    ) {
    }

    /**
     * @param \Closure(IncomingRequest): Response $next
     **/
    public function handle(IncomingRequest $request, Closure $next): Response
    {

        $languageArray = Cache::get('omniSearch.languageArray', []);

        if (!empty($languageArray)) {
            $this->language->ini_array = array_merge($this->language->ini_array, $languageArray);
            return $next($request);
        }
        if (! Cache::store('installation')->has('omniSearch.language.en-US')) {
            $languageArray += parse_ini_file(__DIR__ . '/../Language/en-US.ini', true);
        }

        // @phpstan-ignore-next-line
        if (($language = $this->config->language ?? session('usersettings.language')) !== 'en-US') {
            if (!Cache::store('installation')->has('timeTable.language.' . $language)) {
                $languageIniPath = __DIR__ . '/../Language/' . $language . '.ini';
                if (!file_exists($languageIniPath)) {
                    $languageIniPath = __DIR__ . '/../Language/en-US.ini';
                }
                Cache::store('installation')->put(
                    'timeTable.language.' . $language,
                    parse_ini_file($languageIniPath, true)
                );
            }

            $languageArray = array_merge($languageArray, Cache::store('installation')->get('timeTable.language.' . $language));
        }

        Cache::put('omniSearch.languageArray', $languageArray);

        $this->language->ini_array = array_merge($this->language->ini_array, $languageArray);
        return $next($request);
    }
}
