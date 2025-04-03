<?php

namespace Leantime\Plugins\OmniSearch\Services;

use Leantime\Plugins\OmniSearch\Repositories\OmniSearch as OmniSearchRepository;

/**
 * OmniSearch plugin.
 */
final class OmniSearch
{
    private OmniSearchRepository $omniSearchRepository;

    /**
     * constructor
     *
     * @param  OmniSearchRepository $omniSearchRepository
     * @return void
     */
    public function __construct(OmniSearchRepository $omniSearchRepository)
    {
        $this->omniSearchRepository = $omniSearchRepository;
    }

    /**
     * @var array<string, string> $assets Array of source => target paths.
     */
    private static array $assets = [
        // source => target
        __DIR__ . '/../dist/js/omniSearch.js' => APP_ROOT . '/public/dist/js/omniSearch.v%%VERSION%%.js',
    ];

    /**
     * Retrieves all tickets from the omnisearch service and returns them formatted.
     *
     * @return array<int<0, max>, array<string, mixed>> the list of tickets or an empty array.
     */
    public function getTickets(string $searchTerm, bool $searchInDescription, bool $searchInTimeregistrations, bool $searchInComments): array
    {
        $tickets = $this->omniSearchRepository->getTickets($searchTerm, $searchInDescription, $searchInTimeregistrations, $searchInComments);

        $formattedTickets = array_map(function ($ticket) {
                return [
                    'id' => $ticket['id'],
                    'text' => $ticket['headline'],
                    'status' => $ticket['status'],
                    'type' => $ticket['type'],
                    'tags' => $ticket['tags'],
                    'projectName' => $ticket['projectName'],
                    'description' => $ticket['description'],
                ];
        }, $tickets);

        return $formattedTickets;
    }

    /**
     * Retrieves all projects from the omnisearch repository and returns them formatted.
     *
     * @return array<int<0, max>, array<string, mixed>> the list of tickets or an empty array.
     */
    public function getProjects(string $searchTerm): array
    {
        $projects = $this->omniSearchRepository->getProjects($searchTerm);

        $formattedProjects = array_map(function ($project) {
                return [
                    'id' => $project['id'],
                    'text' => $project['name'],
                    'type' => 'project',
                ];
        }, $projects);

        return $formattedProjects;
    }

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
