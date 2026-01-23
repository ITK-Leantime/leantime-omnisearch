<?php

namespace Leantime\Plugins\OmniSearch\Repositories;

use Illuminate\Database\Query\Builder;
use Illuminate\Support\Facades\DB;

class OmniSearch
{
    /**
     * Executes a database query using the specified database connection.
     */
    private function query(): Builder
    {
        return app('db')->connection()->query();
    }

    /**
     * Retrieves tickets filtered by search term and optional related data.
     *
     * @return array<int, mixed>
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
                'ticket.id',
                'ticket.headline',
                DB::raw('LOWER(ticket.type) as type'),
                'ticket.tags',
                'ticket.projectId',
                'ticket.description',
                'p.name as projectName',
                'ticket.status',
            ])
            ->leftJoin('zp_projects AS p', 'ticket.projectId', '=', 'p.id')
            ->whereIn('ticket.type', ['task', 'subtask', 'bug']);

        /**
         * Optional joins + selects
         */
        if ($searchInTimeregistrations) {
            $query
                ->leftJoin('zp_timesheets AS timesheet', 'ticket.id', '=', 'timesheet.ticketId')
                ->addSelect('timesheet.description AS timesheetDescription');
        }

        if ($searchInComments) {
            $query
                ->leftJoin('zp_comment AS comment', 'ticket.id', '=', 'comment.moduleId')
                ->addSelect([
                    'comment.text AS commentText',
                    'comment.userId AS commentUserId',
                ])
                ->where('comment.userId', '=', session('userdata.id'));
        }

        /**
         * Search conditions (properly grouped)
         */
        $query->where(function ($q) use (
            $searchTerm,
            $searchInDescription,
            $searchInTimeregistrations,
            $searchInComments
        ) {
            $like = '%' . $searchTerm . '%';

            $q->where('ticket.id', 'LIKE', $like)
                ->orWhere('ticket.tags', 'LIKE', $like)
                ->orWhere('ticket.headline', 'LIKE', $like);

            if ($searchInDescription) {
                $q->orWhere('ticket.description', 'LIKE', $like);
            }

            if ($searchInTimeregistrations) {
                $q->orWhere('timesheet.description', 'LIKE', $like);
            }

            if ($searchInComments) {
                $q->orWhere('comment.text', 'LIKE', $like);
            }
        });

        return $query
            ->orderBy('ticket.status', 'DESC')
            ->get()
            ->toArray();
    }

    /**
     * Retrieves projects filtered by ID or name.
     *
     * @return array<int, mixed>
     */
    public function getProjects(string $searchTerm): array
    {
        $like = '%' . $searchTerm . '%';

        return $this->query()
            ->from('zp_projects AS project')
            ->select([
                'project.id',
                'project.name',
                'project.modified',
            ])
            ->where(function ($q) use ($like) {
                $q->where('project.id', 'LIKE', $like)
                    ->orWhere('project.name', 'LIKE', $like);
            })
            ->orderBy('project.modified', 'ASC')
            ->get()
            ->toArray();
    }
}
