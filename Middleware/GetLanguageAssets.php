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
        // @phpstan-ignore-next-line
        $language = session('usersettings.language') ?? $this->config->language;

        // The cache key must vary by language (a shared key would leak the
        // first user's language to everyone) and by plugin version, so new
        // language keys show up after an update without a manual cache clear.
        $cacheKey = 'omniSearch.languageArray.' . urlencode('%%VERSION%%') . '.' . $language;

        $languageArray = Cache::get($cacheKey, []);

        if (empty($languageArray)) {
            $languageArray = parse_ini_file(__DIR__ . '/../Language/en-US.ini', true);

            if ($language !== 'en-US') {
                $languageFile = __DIR__ . '/../Language/' . $language . '.ini';

                if (file_exists($languageFile)) {
                    $languageArray = array_merge($languageArray, parse_ini_file($languageFile, true));
                }
            }

            Cache::put($cacheKey, $languageArray);
        }

        $this->language->ini_array = array_merge($this->language->ini_array, $languageArray);
        return $next($request);
    }
}
