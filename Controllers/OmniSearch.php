<?php

namespace Leantime\Plugins\OmniSearch\Controllers;

use Leantime\Core\Controller\Controller;
use Leantime\Core\Controller\Frontcontroller;
use Leantime\Domain\Users\Services\Users;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Leantime\Plugins\OmniSearch\Services\OmniSearch as OmniSearchService;

/**
 * OmniSearch controller class - Handle post requests.
 */
class OmniSearch extends Controller
{
    private OmniSearchService $omniSearchService;
    private Users $userService;
    /**
     * Constructor for the ClassName.
     * @return void
     */
    public function init(OmniSearchService $omniSearchService, Users $userService): void
    {
        $this->omniSearchService = $omniSearchService;
        $this->userService = $userService;
    }

    /**
     * Retrieves all tickets from the omnisearch service and returns them as a JSON response.
     * @param string[] $input The input for creating search, and defining what to search in, which should contain:
     *                     - 'searchInDescription': If the users wants to search in ticket descriptions.
     *                     - 'searchInTimeregistrations': If the users wants to search in time registrations.
     *                     - 'searchInComments': If the users wants to search in comments.
     *                     - 'q': search query.
     * @return JsonResponse The JSON response containing the list of tickets or an empty array.
     */
    public function searchTicketsAndProjects(array $input): JsonResponse
    {
        $ticketsResult = $this->omniSearchService->getTickets($input['q'], $input['searchInDescription'] === 'true', $input['searchInTimeregistrations'] === 'true', $input['searchInComments'] === 'true');
        $projectsResult = $this->omniSearchService->getProjects($input['q']);
        return response()->json(['tickets' => $ticketsResult, 'projects' => $projectsResult]);
    }

    /**
     * Retrieves all tickets from the omnisearch service and returns them as a JSON response.
     *
     * @return JsonResponse The JSON response containing the list of tickets or an empty array.
     */
    public function post(): JsonResponse
    {
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $input = file_get_contents('php://input');
            $data = json_decode($input, true);

            foreach ($data as $id => $checkedValue) {
                $enabled = $checkedValue ? 1 : 0;

                $savedSuccessfully = $this->userService->updateUserSettings('omnisearch', $id, $enabled);

                if (!$savedSuccessfully) {
                    return new JsonResponse(['error' => sprintf($this->language->__('omnisearch.setting_save_error'), $id)], 400);
                }
            }
        }
        // Return updated usersettings
        return new JsonResponse(session('usersettings.omnisearch'));
    }

    /**
     * Get method.
     *
     * @return RedirectResponse
     */
    public function get(): RedirectResponse
    {
        return Frontcontroller::redirect('/');
    }
}
