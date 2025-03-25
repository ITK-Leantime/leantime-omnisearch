<?php

namespace Leantime\Plugins\OmniSearch\Repositories;

use Leantime\Core\Db\Db as DbCore;
use PDO;

/**
 * OmniSearch Repository - Handles database queries relevant to OmniSearch.
 */
class OmniSearch
{
    /**
     * @var DbCore - Database connection.
     */
    private DbCore $db;

    /**
     * Constructor.
     *
     * @param DbCore $db Database connection instance.
     */
    public function __construct(DbCore $db)
    {
        $this->db = $db;
    }

    /**
     * getTickets - Retrieves tickets, filters them based on their the search ,
     * depending on input it joins with comments and timesheets to search in descriptions.
     *
     * @access public
     * @return array<int<0, max>,mixed> An array of filtered tickets with their associated details.
     */
    public function getTickets(string $searchTerm, bool $searchInDescription, bool $searchInTimeregistrations, bool $searchInComments): array
    {
        // Empty where, so if neither of the additional search params are true, nothing will be added
        $whereTerm = '';
        $userIdWhere = '';

        // Empty join clauses, so if neither of the additional search params are true, the tables will not be joined
        $joinTimesheet = '';
        $jointComments = '';

        // Selectmore is to make sure we also select the stuff to search in in the select clause.
        $selectMore = '';

        if ($searchInDescription) {
            // If we are to search in the description, this can be added, as the select already has ticket description
            $whereTerm = ' OR ticket.description LIKE CONCAT("%", :searchTerm, "%")';
        }

        if ($searchInTimeregistrations) {
            // Additional select, left join and where clause added for timesheets
            $selectMore = 'timesheet.description, ';
            $joinTimesheet = 'LEFT JOIN zp_timesheets as timesheet ON ticket.id = timesheet.ticketId';
            $whereTerm = $whereTerm . ' OR timesheet.description LIKE CONCAT("%", :searchTerm, "%")';
        }

        if ($searchInComments) {
            // Additional select, left join and where clause added for comments
            $selectMore = 'comment.text, comment.userId, ';
            $jointComments = 'LEFT JOIN zp_comment as comment ON ticket.id = comment.moduleId';
            $whereTerm = $whereTerm . ' OR comment.text LIKE CONCAT("%", :searchTerm, "%")';
            $userIdWhere = ' comment.userId = :userId AND ';
        }

        $sql = 'SELECT ' . $selectMore . 'ticket.id,
            ticket.headline,
            LOWER(ticket.type) as type,
            ticket.tags,
            ticket.projectId,
            ticket.description,
            p.name as projectName,
            ticket.status
        FROM zp_tickets as ticket
        ' . $jointComments . '
        ' . $joinTimesheet . '
        LEFT JOIN zp_projects p ON ticket.projectId = p.id
        WHERE '.$userIdWhere.' ticket.type = "task" AND (ticket.id LIKE CONCAT("%", :searchTerm, "%") OR ticket.tags LIKE CONCAT("%", :searchTerm, "%") OR ticket.headline LIKE CONCAT("%", :searchTerm, "%")' . $whereTerm . ')
        ORDER BY ticket.status DESC';

        $stmn = $this->db->database->prepare($sql);
        $stmn->bindValue(':searchTerm', $searchTerm, PDO::PARAM_STR);
        $stmn->bindValue(':userId', session('userdata.id'), PDO::PARAM_INT);
        $stmn->execute();
        $values = $stmn->fetchAll();
        $stmn->closeCursor();

        return $values;
    }

    /**
     * getProjects - Retrieves projects, filters them based on their name or id
     *
     * @access public
     * @return array<int<0, max>,mixed> An array of filtered tickets with their associated details.
     */
    public function getProjects(string $searchTerm): array
    {
            $sql = 'SELECT
            project.id,
            project.name,
            project.modified
        FROM zp_projects as project
        WHERE (project.id LIKE CONCAT("%", :searchTerm, "%") OR project.name LIKE CONCAT("%", :searchTerm, "%"))
        ORDER BY project.modified ASC';

        $stmn = $this->db->database->prepare($sql);
        $stmn->bindValue(':searchTerm', $searchTerm, PDO::PARAM_STR);
        $stmn->execute();
        $values = $stmn->fetchAll();
        $stmn->closeCursor();

        return $values;
    }
}
