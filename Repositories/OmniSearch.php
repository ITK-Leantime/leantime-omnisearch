<?php

namespace Leantime\Plugins\OmniSearch\Repositories;

use Illuminate\Database\Query\Builder;
use Leantime\Core\Db\Db;
use Leantime\Core\Db\Db as DbCore;

/**
 * OmniSearch Repository - Handles database queries relevant to OmniSearch.
 */
class OmniSearch
{
    private ?DbCore $db = null;
    /**
     * Executes a database query using the specified database connection.
     *
     * @return Builder Returns an instance of the query builder.
     */
    private function query(): Builder
    {
        return app('db')->connection()->query();
    }

    /**
     * getTickets - Retrieves tickets, filters them based on their the search ,
     * depending on input it joins with comments and timesheets to search in descriptions.
     *
     * @access public
     * @return array<int<0, max>,mixed> An array of filtered tickets with their associated details.
     */
    public function getTickets(
        string $searchTerm,
        bool $searchInDescription,
        bool $searchInTimeregistrations,
        bool $searchInComments
    ): array {
        $query = $this->query()
            ->from('zp_tickets AS ticket')
            ->select([
                app('db')->connection()->raw('DISTINCT ticket.id'),
                'ticket.headline',
                app('db')->connection()->raw('LOWER(ticket.type) AS type'),
                'ticket.tags',
                'ticket.projectId',
                'ticket.description',
                'p.name AS projectName',
                'ticket.status',
            ])
            ->leftJoin('zp_projects AS p', 'ticket.projectId', '=', 'p.id')
            ->whereIn('ticket.type', ['task', 'subtask', 'bug'])
            ->where(function ($q) use ($searchTerm, $searchInDescription, $searchInTimeregistrations, $searchInComments) {

                $q->where('ticket.id', 'LIKE', '%' . $searchTerm . '%')
                    ->orWhere('ticket.tags', 'LIKE', '%' . $searchTerm . '%')
                    ->orWhere('ticket.headline', 'LIKE', '%' . $searchTerm . '%');

                if ($searchInDescription) {
                    $q->orWhere('ticket.description', 'LIKE', '%' . $searchTerm . '%');
                }

                if ($searchInTimeregistrations) {
                    $q->orWhereExists(function ($sub) use ($searchTerm) {
                        $sub->selectRaw('1')
                            ->from('zp_timesheets AS timesheet')
                            ->whereColumn('timesheet.ticketId', 'ticket.id')
                            ->where('timesheet.description', 'LIKE', '%' . $searchTerm . '%');
                    });
                }

                if ($searchInComments) {
                    $q->orWhereExists(function ($sub) use ($searchTerm) {
                        $sub->selectRaw('1')
                            ->from('zp_comment AS comment')
                            ->whereColumn('comment.moduleId', 'ticket.id')
                            ->where('comment.text', 'LIKE', '%' . $searchTerm . '%');
                    });
                }
            })
            ->orderBy('ticket.status', 'DESC');

        return $query->get()->toArray();
    }




    /**
     * getProjects - Retrieves projects, filters them based on their name or id
     *
     * @access public
     * @return array<int<0, max>,mixed> An array of filtered tickets with their associated details.
     */
    public function getProjects(string $searchTerm): array
    {
        return $this->query()
            ->from('zp_projects AS project')
            ->select([
                'project.id',
                'project.name',
                'project.modified',
            ])
            ->where(function ($q) use ($searchTerm) {
                $q->where('project.id', 'LIKE', '%' . $searchTerm . '%')
                    ->orWhere('project.name', 'LIKE', '%' . $searchTerm . '%');
            })
            ->orderBy('project.modified', 'ASC')
            ->get()
            ->toArray();
    }

}
