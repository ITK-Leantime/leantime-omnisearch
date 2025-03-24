import 'select2';
import 'select2/dist/css/select2.css';
import './omniSearch.css';
import FuzzySearch from 'fuzzy-search';

$(document).ready(function ($) {
  window.searchSettings = getSearchSettings(omniSearch.settings.searchSettings);

  const allComments = JSON.parse(omniSearch.settings.allComments);
  const allTimelogDescriptions = JSON.parse(
    omniSearch.settings.allTimelogDescription
  );

  const key = {
    escape: 27,
    period: 190,
    backspace: 8,
  };
  let isFetching = false; // Is data being fetched
  let isVisible = false; // Is overlay visible

  fetchOmnisearchData();

  // Append overlay
  $('body').append(`
      <div class="omni-search hidden">
          <div class="search-wrapper">
            <select class="js-example-basic-multiple" name="actions[]"></select>
            <div class="settings-button ${window.searchSettings?.length > 0 ? 'active' : ''}">
              <i class="fa fa-sliders" aria-hidden="true"></i>
            </div>
          </div>
          <div class="omni-search-panel"></div>
      </div>`);

  const settingsTippy = tippy('.settings-button', {
    content: `
<div class="omnisearch-checkbox">
  <input type="checkbox" name="usersetting_omnisearch_searchin_beskrivelse" id="checkbox1" class="dynamic-checkbox" ${window.searchSettings.includes('usersetting_omnisearch_searchin_beskrivelse') ? 'checked' : ''}>
  <label for="checkbox1">Søg i beskrivelse</label>
</div>
<div class="omnisearch-checkbox">
  <input type="checkbox" name="usersetting_omnisearch_searchin_kommentarer" id="checkbox2" class="dynamic-checkbox" data-id="2" ${window.searchSettings.includes('usersetting_omnisearch_searchin_kommentarer') ? 'checked' : ''}>
  <label for="checkbox2">Søg i kommentarer</label>
</div>
<div class="omnisearch-checkbox">
  <input type="checkbox" name="usersetting_omnisearch_searchin_tidsregistreringer" id="checkbox3" class="dynamic-checkbox" data-id="3" ${window.searchSettings.includes('usersetting_omnisearch_searchin_tidsregistreringer') ? 'checked' : ''}>
  <label for="checkbox3">Søg i tidslogninger</label>
</div>
<button class="omnisearch-settings-save">Gem</button>
`,

    allowHTML: true,
    trigger: 'click',
    interactive: true,
    theme: 'omnisearch',
  });

  // Listen for checkbox changes using jQuery
  $(document).on('click', '.omnisearch-settings-save', function (e) {
    $(e.target).html(
      '<i class="fa fa-refresh fa-spin" aria-hidden="true"></i>'
    );

    const checkboxes = $('.dynamic-checkbox');
    const checkboxData = {};

    // Collect keys and values from all inputs
    checkboxes.each(function () {
      const name = $(this).attr('name');
      const value = $(this).is(':checked') ? '1' : '0';
      checkboxData[name] = value;
    });

    // Fire AJAX to post the collected data
    $.ajax({
      url: '/OmniSearch/OmniSearch',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(checkboxData),
      success: function (data) {
        setOmnisearchData();
        window.searchSettings = getSearchSettings(data);
        window.searchSettings.length > 0
          ? $(document).find('.settings-button').addClass('active')
          : $(document).find('.settings-button').removeClass('active');
        settingsTippy[0].hide();
        setTimeout(() => {
          $(e.target).html('Gem');
        }, 500);
      },
      error: function (error) {
        console.error('Error:', error);
      },
    });
  });

  const omniSelectElement = $('body .omni-search > .search-wrapper > select');
  const omniSelectPanelElement = $('body .omni-search > .omni-search-panel');
  $('div.omni-search').on('click', function (e) {
    // Close overlay when clicking outside.
    if ($(e.target).hasClass('omni-search')) {
      destroyOmniSearch();
    }
  });

  $('div.content-container').on('click', function (e) {
    // Close overlay when clicking outside (when logging time).
    if ($(e.target).hasClass('content-container')) {
      destroyOmniSearch();
    }
  });

  function getSearchSettings(settings) {
    const result = [];

    $.each(settings, function (key, value) {
      if (value === '1') {
        result.push(key);
      }
    });
    window.searchSettings = result;
    return result;
  }

  function onSearchSettingsUpdate(updatedValue) {
    const settingsButton = $(document).find('.settings-button');
    updatedValue.length > 0
      ? settingsButton.addClass('active')
      : settingsButton.removeClass('active');
  }

  // Event for init and destroy
  $('body').on('keydown', function (e) {
    const keyCode = e.keyCode;
    switch (keyCode) {
      case key.escape:
        destroyOmniSearch();
        break;

      case key.period:
        if (!$('input, textarea').is(':focus')) {
          initOmniSearch();
          // Check if its december
          if (new Date().getMonth() === 11) {
            // Stolen from: https://pajasevi.github.io/CSSnowflakes/
            $('body').append(`
            <div class="snowflakes" aria-hidden="true">
                <div class="snowflake">
                    <div class="inner">❅</div>
                </div>
                <div class="snowflake">
                    <div class="inner">❅</div>
                </div>
                <div class="snowflake">
                    <div class="inner">❅</div>
                </div>
                <div class="snowflake">
                    <div class="inner">❅</div>
                </div>
                <div class="snowflake">
                    <div class="inner">❅</div>
                </div>
                <div class="snowflake">
                    <div class="inner">❅</div>
                </div>
                <div class="snowflake">
                    <div class="inner">❅</div>
                </div>
                <div class="snowflake">
                    <div class="inner">❅</div>
                </div>
                <div class="snowflake">
                    <div class="inner">❅</div>
                </div>
                <div class="snowflake">
                    <div class="inner">❅</div>
                </div>
                <div class="snowflake">
                    <div class="inner">❅</div>
                </div>
                <div class="snowflake">
                    <div class="inner">❅</div>
                </div>
            </div>`);
          }
        }
        break;
    }
  });

  function setOmnisearchPreviewText() {
    // Extract and format the readable parts of the array
    const readableFields = window.searchSettings.map((field) =>
      field.split('_').pop()
    );

    let previewText;

    if (readableFields.length === 0) {
      previewText = 'Du søger nu i ID, titel, projektnavn og tags.';
    } else if (readableFields.length === 1) {
      previewText = `Du søger nu i ID, titel, projektnavn, tags og ${readableFields[0]}.`;
    } else {
      const lastField = readableFields.pop();
      previewText = `Du søger nu i ID, titel, projektnavn, tags, ${readableFields.join(', ')}, og ${lastField}.`;
    }

    // Update the element with the dynamic text
    $('.select2-results').attr('data-text', previewText);
  }

  // Init select2, get data, set events.
  function initOmniSearch() {
    isFetching = false;
    isVisible = true;
    $('body').addClass('prevent-scroll');
    if ($('.omni-search').hasClass('hidden') === false) {
      return false;
    }

    $.fn.select2.amd.require(['select2/selection/search'], function (Search) {
      var oldRemoveChoice = Search.prototype.searchRemoveChoice;

      Search.prototype.searchRemoveChoice = function () {
        oldRemoveChoice.apply(this, arguments);
        this.$search.val('');
      };

      // Init select2
      omniSelectElement
        .select2({
          multiple: true,
        })
        .on('select2:select', function (e) {
          const data = e.params.data;
          const action = e.params.data.action;
          const id = e.params.data.id;
          $('.select2-search__field').val(data.text);
          switch (data.type) {
            case 'project':
              $('.selected-value').text(data.text);
              reinitOmniSearchForType('project', data);
              break;

            case 'task':
              $('.selected-value').text(data.text);
              reinitOmniSearchForType('task', data);
              break;

            case 'taskAction':
              switch (action) {
                case 'goto':
                  const gotoTaskPath =
                    '?tab=ticketdetails#/tickets/showTicket/' + id;
                  window.location.href = gotoTaskPath;
                  destroyOmniSearch();
                  break;

                case 'logtime':
                  const logTimeTodoPath =
                    '?tab=timesheet#/tickets/showTicket/' + id;
                  window.location.href = logTimeTodoPath;
                  destroyOmniSearch();
                  break;
              }
              break;
            case 'projectAction':
              switch (action) {
                case 'goto':
                  const gotoProjectPath =
                    '/projects/changeCurrentProject/' + id;
                  window.location.href = gotoProjectPath;
                  destroyOmniSearch();
                  break;

                case 'createnew':
                  const createNewProjectPath =
                    '/projects/changeCurrentProject/' +
                    id +
                    '#/tickets/newTicket';
                  window.location.href = createNewProjectPath;
                  destroyOmniSearch();
                  break;
              }
              break;
          }
        });
      setOmnisearchData();
      omniSelectElement.on('select2:select', function (e) {
        var selection = e.params.data;
        const { text } = e.params.data;
        switch (selection.type) {
          case 'task':
            $(omniSelectElement)
              .next('.select2.select2-container')
              .attr('data-visible-selected', `To-do / ${text} /`);
            break;

          case 'project':
            $(omniSelectElement)
              .next('.select2.select2-container')
              .attr('data-visible-selected', `Projekter / ${text} /`);
            break;
        }

        const elm = e.params.data.element;
        const $element = $(elm);
        const $this = $(this);
        $this.append($element);
        $this.trigger('change.select2');
      });
      $('.omni-search').removeClass('hidden');
    });
  }

  // Close overlay.
  function destroyOmniSearch() {
    omniSelectElement.off();
    $('body').removeClass('prevent-scroll');
    omniSelectElement.empty().trigger('change');
    $('body .omni-search').addClass('hidden');
    $('body .select2-container').remove();
    omniSelectPanelElement.empty();
    isVisible = false;
  }

  // Set up select content based on selected element.
  function reinitOmniSearchForType(type, data) {
    switch (type) {
      case 'task':
        reinitOmniSearchWithData([
          {
            id: '',
            text: 'Actions',
            children: [
              {
                id: data.id,
                text: 'Open',
                type: 'taskAction' || 'projectAction',
                action: 'goto',
              },
              {
                id: data.id,
                text: 'Log Time',
                type: 'taskAction' || 'projectAction',
                action: 'logtime',
              },
            ],
          },
        ]);
        break;

      case 'project':
        reinitOmniSearchWithData([
          {
            id: '',
            text: 'Actions',
            children: [
              {
                id: data.id,
                text: 'Go to',
                type: 'projectAction',
                action: 'goto',
              },
              {
                id: data.id,
                text: 'Create To-Do',
                type: 'projectAction',
                action: 'createnew',
              },
            ],
          },
        ]);
        break;
    }
  }

  // Almost entirely stolen from:
  // https://forums.select2.org/t/how-can-i-highlight-the-results-on-a-search/52/2
  function markMatch(text, term) {
    // Find where the match is
    const match = text?.toUpperCase().indexOf(term?.toUpperCase());

    let $result = $('<span></span>');
    // If there is no match, move on
    if (match < 0) {
      return $result.text(text);
    }

    // Put in whatever text is before the match
    $result.text(text.substring(0, match));

    // Mark the match
    let $match = $('<span class="select2-rendered__match"></span>');
    $match.text(text.substring(match, match + term.length));

    // Append the matching text
    $result.append($match);

    // Put in whatever is after the match
    $result.append(text.substring(match + term.length));

    return $result;
  }

  function isAction(data) {
    return (
      data.type?.toLowerCase() === 'taskaction' ||
      data.type?.toLowerCase() === 'projectaction'
    );
  }

  // Set data and refresh select2.
  function reinitOmniSearchWithData(data) {
    if (!isVisible || data.length === 0) {
      return false;
    }
    omniSelectElement
      .select2('destroy')
      .empty()
      .select2({
        data: data,
        templateResult: function (data) {
          const term = jQuery('.select2-search__field').val() || '';
          if (
            // This magic number decides how many characters a user has to type to see data. Now, 3.
            term.length >= 3 ||
            isAction(data)
          ) {
            // Tags to html, as they each need a separate span.
            let tagshtml = $('<span></span>');
            if (data.tags) {
              data.tags.split(',').forEach((tag) => {
                tagshtml.append(
                  `<span class="select2-tag">${markMatch(tag, term).html()}</span>`
                );
              });
            }

            const isTodoDoneStyling = data.isDone ? 'select2-is-done' : '';

            const $resultingHtml = data.projectName
              ? $(
                  `
                  <div class="select2-results__option-container ${isTodoDoneStyling}">
                    <div class="select2-flex-container">
                      <div class="select2-flex-container">
                        <div class="select2-todo">${markMatch(data.text, term).html()}</div>
                        <div>
                          <div class="select2-project-name"><small>${markMatch(data.projectName, term).html()}</small></div>
                        </div>
                      </div>
                    </div>
                    <div>${tagshtml.html()}</div>
                  </div>
                  `
                )
              : $(`
                  <div class="select2-results__option-container">
                    <div class="select2-todo">${markMatch(data.text, term).html()}</div>
                  </div>
                  `);

            return $resultingHtml;
          }
        },
        matcher: window.searchSettings.length > 0 ? advancedMatcher : matcher,
      })
      .trigger('change')
      .select2('open');

    setOmnisearchPreviewText();

    // Listens for escape key to close omni-search overlay when select2 is in focus.
    $('body .select2-search__field').on('keydown', (e) => {
      var searchFieldInputLength = $('body .select2-search__field').val()
        .length;
      var hasSelection =
        $('.select2.select2-container').attr('data-visible-selected') &&
        $('.select2.select2-container').attr('data-visible-selected').length >
          0 &&
        searchFieldInputLength === 0;
      switch (e.keyCode) {
        case key.backspace:
          if (hasSelection) {
            destroyOmniSearch();
            initOmniSearch();
          }
          break;

        case key.escape:
          destroyOmniSearch();
          break;
      }
    });

    $('body .select2-search__field').on('keyup', (e) => {
      console.log($('.select2-results__options > li > ul > li:visible').length);
      $(document)
        .find('.select2-dropdown > .select2-results')
        .toggleClass(
          'has-results',
          $('.select2-results__options > li > ul > li:visible').length > 0
        );
    });

    setTimeout(() => {
      const pseudoWidth = window
        .getComputedStyle($('.select2.select2-container')[0], '::after')
        .getPropertyValue('width');
      $('.select2-search__field').css(
        'margin-left',
        parseFloat(pseudoWidth) + 25 + 'px'
      );
      $(document)
        .find('.select2-dropdown > .select2-results')
        .toggleClass(
          'has-results',
          $('.select2-results__options > li > ul > li:visible').length > 0
        );
    }, 1);
  }

  // Api
  function getAllProjects() {
    return callApi('leantime.rpc.projects.getAll', {});
  }

  function getAllTickets() {
    return callApi('leantime.rpc.tickets.getAll', {});
  }

  function callApi(method, params) {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: leantime.appUrl + '/api/jsonrpc/',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        data: JSON.stringify({
          method: method,
          jsonrpc: '2.0',
          id: '1',
          params: params,
        }),
        success: resolve,
        error: reject,
      });
    });
  }

  async function fetchOmnisearchData() {
    let projectPromise;
    let ticketPromise;
    isFetching = true;

    projectPromise = getAllProjects().then((data) => {
      var projects = data.result;
      const projectGroup = {
        id: 'project',
        text: 'Projekter',
        children: [],
        index: 1,
      };
      projects.forEach((project) => {
        let option = {
          id: project.id,
          text: project.name,
          type: 'project',
          client: project.clientName,
        };
        projectGroup.children.push(option);
      });
      return projectGroup;
    });

      ticketPromise = getAllTickets().then((data) => {
        var result = data.result;
        let tickets = result.filter(
          (result) => result.type.toLowerCase() === 'task'
        );
        const ticketGroup = {
          id: 'task',
          text: 'To-do',
          children: [],
          index: 2,
        };

        let childrenForTicketGroup = [];
        tickets.forEach((ticket) => {
          let option = {
            // status 0 is done, I found out through this commit message
            // https://github.com/ITK-Leantime/leantime/commit/122a08ea0cc61c65aa57fd1d73f0948d46744055
            isDone: ticket.status === 0,
            id: ticket.id,
            text: ticket.headline,
            description: restoreString(ticket.description),
            type: ticket.type,
            tags: ticket.tags,
            sprintName: ticket.sprintName,
            projectId: ticket.projectId,
            projectName: ticket.projectName,
            ...(allComments[ticket.id] && { comments: allComments[ticket.id] }),
            ...(allTimelogDescriptions[ticket.id] && {
              timelogDescriptions: allTimelogDescriptions[ticket.id],
            }),
          };
          childrenForTicketGroup.push(option);
        });

        // Sort, so the done tasks appear in the bottom of the search.
        const sortedByDone = [...childrenForTicketGroup].sort(
          (a, b) => Number(a.isDone) - Number(b.isDone)
        );
        ticketGroup.children = sortedByDone;
        return ticketGroup;
      });

    const promises = [projectPromise, ticketPromise];
    const results = await Promise.allSettled(promises);
    const data = results
      .filter((result) => result.status === 'fulfilled')
      .map((result) => result.value)
      .sort(function (a, b) {
        // Sort by index.
        return a.index - b.index;
      });

    return data;
  }

  function setOmnisearchData() {
    omniSelectElement.addClass('loading');
      fetchOmnisearchData().then((availableTags) => {
        isFetching = false;
        reinitOmniSearchWithData(availableTags);
        omniSelectElement.removeClass('loading');
      });
  }

  function restoreString(htmlString) {
    return $('<div>').html(htmlString).text();
  }

  function matcher(params, data) {
    const term = params.term ? params.term.toLowerCase() : '';
    const searcher = new FuzzySearch(
      data.children,
      ['id', 'parentText', 'text', 'tags', 'projectName'],
      {
        caseSensitive: false,
      }
    );
    const result = searcher.search(term);

    return {
      ...data,
      children: result,
    };
  }

  function advancedMatcher(params, data) {
    const term = params.term?.toLowerCase() || '';
    const searchFields = [
      'id',
      'parentText',
      'text',
      'tags',
      'projectName',
      'description',
      'comments',
      'timelogDescriptions',
    ];

    const searcher = new FuzzySearch(data.children, searchFields, {
      caseSensitive: false,
    });
    const result = searcher.search(term).map((item) => {
      const score = searchFields.reduce((score, field) => {
        const value = item[field];
        if (typeof value === 'string' && value.toLowerCase().includes(term)) {
          score++;
        }
        return score;
      }, 0);
      return { ...item, score };
    });

    const sortedResults = result.sort((a, b) => b.score - a.score);

    return { ...data, children: sortedResults };
  }
});
