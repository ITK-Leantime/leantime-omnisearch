<?php

namespace Leantime\Plugins\OmniSearch\Controllers;

use Leantime\Core\Controller;
use Leantime\Core\Frontcontroller;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Response;
use Leantime\Domain\Setting\Repositories\Setting as SettingRepository;

/**
 * Settings Controller for Omnisearch plugin
 *
 * @package    leantime
 * @subpackage plugins
 */
class Settings extends Controller {

  private SettingRepository $settingsRepo;

  /**
   * constructor
   * @access public
   */
  public function init(
    SettingRepository $settingsRepo,
  ) {
    $this->settingsRepo = $settingsRepo;
  }

  /**
   * get method
   * @return void
   */
  public function get(): Response {
    $projectCacheExpiration = $this->settingsRepo->getSetting("omnisearchsettings.projectscache") ?: '2400';
    $ticketCacheExpiration = $this->settingsRepo->getSetting("omnisearchsettings.ticketscache") ?: '1200';

    $this->tpl->assign("projectCacheExpiration", $projectCacheExpiration);
    $this->tpl->assign("ticketCacheExpiration", $ticketCacheExpiration);

    return $this->tpl->display("omniSearch.settings");
  }

  /**
   * post method
   * @param array $params
   * @return void
   */
  public function post(array $params): RedirectResponse {
    $this->settingsRepo->saveSetting("omnisearchsettings.projectscache", htmlspecialchars(addslashes($params['projectCacheExpiration'])));
    $this->settingsRepo->saveSetting("omnisearchsettings.ticketscache", htmlspecialchars(addslashes($params['ticketCacheExpiration'])));
    $this->tpl->setNotification("The settings were successfully saved.", "success");

    return Frontcontroller::redirect(BASE_URL . "/OmniSearch/settings");
  }
}
