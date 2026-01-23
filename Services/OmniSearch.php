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
     * @return array<int<0, max>, array<string, mixed>>
     */
    public function getTickets(
        string $searchTerm,
        bool $searchInDescription,
        bool $searchInTimeregistrations,
        bool $searchInComments
    ): array {
        $tickets = $this->omniSearchRepository->getTickets(
            $searchTerm,
            $searchInDescription,
            $searchInTimeregistrations,
            $searchInComments
        );

        return array_map(function ($ticket) {
            $ticket = (array) $ticket; // 👈 FIX

            return [
                'id' => $ticket['id'] ?? null,
                'text' => $ticket['headline'] ?? '',
                'status' => $ticket['status'] ?? null,
                'type' => $ticket['type'] ?? null,
                'tags' => $ticket['tags'] ?? null,
                'projectName' => $ticket['projectName'] ?? null,
                'description' => $ticket['description'] ?? null,
            ];
        }, $tickets);
    }

    /**
     * Retrieves all projects from the omnisearch repository and returns them formatted.
     *
     * @return array<int<0, max>, array<string, mixed>>
     */
    public function getProjects(string $searchTerm): array
    {
        $projects = $this->omniSearchRepository->getProjects($searchTerm);

        return array_map(function ($project) {
            $project = (array) $project; // 👈 FIX

            return [
                'id' => $project['id'] ?? null,
                'text' => $project['name'] ?? '',
                'type' => 'project',
            ];
        }, $projects);
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
