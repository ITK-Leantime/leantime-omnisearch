import 'select2';
import 'select2/dist/css/select2.css';
import './omniSearch.css';

$(document).ready(function ($) {
  window.searchSettings = getSearchSettings(omniSearch.settings.searchSettings);

  const key = {
    escape: 27,
    period: 190,
    backspace: 8,
  };
  let isVisible = false; // Is overlay visible

  // Look up a translation in the dictionary exposed by /api/i18n. The plugin
  // language files are merged into it by the GetLanguageAssets middleware.
  function translate(key) {
    return window.leantime?.i18n?.__(key) ?? key;
  }

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
        <label for="checkbox1">${translate('omnisearch.search_in_description')}</label>
      </div>
      <div class="omnisearch-checkbox">
        <input type="checkbox" name="usersetting_omnisearch_searchin_kommentarer" id="checkbox2" class="dynamic-checkbox" data-id="2" ${window.searchSettings.includes('usersetting_omnisearch_searchin_kommentarer') ? 'checked' : ''}>
        <label for="checkbox2">${translate('omnisearch.search_in_comments')}</label>
      </div>
      <div class="omnisearch-checkbox">
        <input type="checkbox" name="usersetting_omnisearch_searchin_tidsregistreringer" id="checkbox3" class="dynamic-checkbox" data-id="3" ${window.searchSettings.includes('usersetting_omnisearch_searchin_tidsregistreringer') ? 'checked' : ''}>
        <label for="checkbox3">${translate('omnisearch.search_in_timeregistrations')}</label>
      </div>
      <button class="omnisearch-settings-save">${translate('omnisearch.save')}</button>
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
        initOmniSearch();
        window.searchSettings = getSearchSettings(data);
        window.searchSettings.length > 0
          ? $(document).find('.settings-button').addClass('active')
          : $(document).find('.settings-button').removeClass('active');
        settingsTippy[0].hide();
        setTimeout(() => {
          $(e.target).html(translate('omnisearch.save'));
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

  function isAction(data) {
    return (
      data.type?.toLowerCase() === 'taskaction' ||
      data.type?.toLowerCase() === 'projectaction'
    );
  }

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

  // Whether the keystroke happened inside a field the user is typing into, so
  // the global "." shortcut must not fire. Covers native fields plus
  // contenteditable rich-text editors (Tiptap/ProseMirror), which render an
  // editable <div> rather than a textarea and are missed by an input/textarea
  // check.
  function isTypingContext(target) {
    const el = target || document.activeElement;
    if (!el || el === document.body) {
      return false;
    }
    const tagName = (el.tagName || '').toLowerCase();
    return (
      tagName === 'input' ||
      tagName === 'textarea' ||
      tagName === 'select' ||
      el.isContentEditable === true
    );
  }

  // Event for init and destroy
  $('body').on('keydown', function (e) {
    const keyCode = e.keyCode;
    switch (keyCode) {
      case key.escape:
        destroyOmniSearch();
        break;

      case key.period:
        if (!isTypingContext(e.target)) {
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

  function getOmnisearchPreviewText() {
    // The fields that are always searched, plus a translated label for each
    // enabled search setting (keyed by the last part of the setting name).
    const fields = [
      translate('omnisearch.field_id'),
      translate('omnisearch.field_title'),
      translate('omnisearch.field_projectname'),
      translate('omnisearch.field_tags'),
      ...window.searchSettings.map((setting) =>
        translate('omnisearch.field_' + setting.split('_').pop())
      ),
    ];

    const lastField = fields.pop();
    const fieldList = `${fields.join(', ')} ${translate('omnisearch.and')} ${lastField}`;

    return translate('omnisearch.search_preview').replace('%s', fieldList);
  }

  // Init select2, get data, set events.
  function initOmniSearch() {
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
          dropdownCssClass: 'omnisearch-dropdown',
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
            case 'subtask':
            case 'bug':
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
      startOmniSearch();

      omniSelectElement.on('select2:select', function (e) {
        var selection = e.params.data;
        const { text } = e.params.data;
        switch (selection.type) {
          case 'task':
          case 'subtask':
          case 'bug':
            $(omniSelectElement)
              .next('.select2.select2-container')
              .attr(
                'data-visible-selected',
                `${translate('omnisearch.group_todos')} / ${text} /`
              );
            break;

          case 'project':
            $(omniSelectElement)
              .next('.select2.select2-container')
              .attr(
                'data-visible-selected',
                `${translate('omnisearch.group_projects')} / ${text} /`
              );
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
    $('.select2-container:has(.omnisearch-dropdown)').remove();
    $('.omnisearch-dropdown.select2-dropdown').remove();
    omniSelectPanelElement.empty();
    isVisible = false;
  }

  // Set up select content based on selected element.
  function reinitOmniSearchForType(type, data) {
    switch (type) {
      case 'task':
      case 'subtask':
      case 'bug':
        reinitOmniSearchWithData([
          {
            id: '',
            text: translate('omnisearch.actions'),
            children: [
              {
                id: data.id,
                text: translate('omnisearch.action_open'),
                type: 'taskAction' || 'projectAction',
                action: 'goto',
              },
              {
                id: data.id,
                text: translate('omnisearch.action_logtime'),
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
            text: translate('omnisearch.actions'),
            children: [
              {
                id: data.id,
                text: translate('omnisearch.action_goto'),
                type: 'projectAction',
                action: 'goto',
              },
              {
                id: data.id,
                text: translate('omnisearch.action_create_todo'),
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
  function startOmniSearch() {
    if (!isVisible) {
      return false;
    }

    omniSelectElement
      .select2('destroy')
      .empty()
      .select2({
        dropdownCssClass: 'omnisearch-dropdown',
        ajax: {
          dataType: 'json',
          url: '/OmniSearch/OmniSearch/searchTicketsAndProjects',
          method: 'POST',
          delay: 250,
          data: function (params) {
            const readableFields = window.searchSettings.map((field) =>
              field.split('_').pop()
            );
            return {
              q: params.term,
              searchInDescription: readableFields.includes('beskrivelse'),
              searchInTimeregistrations:
                readableFields.includes('tidsregistreringer'),
              searchInComments: readableFields.includes('kommentarer'),
            };
          },
          processResults: function (data) {
            return {
              results: [
                {
                  id: 'project',
                  text: translate('omnisearch.group_projects'),
                  children: data['projects'],
                  index: 1,
                },
                {
                  text: translate('omnisearch.group_todos'),
                  id: 'task',
                  children: data['tickets'],
                  index: 2,
                },
              ],
            };
          },
          cache: true,
        },
        language: {
          searching: function () {
            return translate('omnisearch.searching');
          },
          noResults: function () {
            return translate('omnisearch.no_results');
          },
          inputTooShort: function () {
            return translate('omnisearch.input_too_short');
          },
          errorLoading: function () {
            return translate('omnisearch.error_loading');
          },
        },
        placeholder: getOmnisearchPreviewText(),
        minimumInputLength: 3,
        templateResult: function (data) {
          const term = jQuery('.select2-search__field').val() || '';

          if (data.children) {
            return $(`
                  <div class="select2-group-header">
                    <span>${data.text}</span>
                    <span class="select2-group-count">${data.children.length} ${translate('omnisearch.results')}</span>
                  </div>
                  `);
          }
          // Tags to html, as they each need a separate span.
          let tagshtml = $('<span></span>');
          if (data.tags) {
            data.tags.split(',').forEach((tag) => {
              tagshtml.append(
                `<span class="select2-tag">${markMatch(tag, term).html()}</span>`
              );
            });
          }

          const isTodoDoneStyling = data.status === 0 ? 'select2-is-done' : '';
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
        },
      })
      .trigger('change')
      .select2('open');

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

    $('body .select2-search__field').on('keyup', () => {
      $(document)
        .find('.select2-dropdown > .select2-results')
        .toggleClass(
          'has-results',
          $('.select2-results__options > li > ul > li:visible').length > 0
        );
    });

    setTimeout(() => {
      $('body .select2-search__field').focus();

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

  function reinitOmniSearchWithData(data) {
    if (!isVisible || data.length === 0) {
      return false;
    }
    omniSelectElement
      .select2('destroy')
      .empty()
      .select2({
        dropdownCssClass: 'omnisearch-dropdown',
        data: data,
        language: {
          noResults: function () {
            return translate('omnisearch.no_results');
          },
        },
        templateResult: function (data) {
          if (isAction(data)) {
            return $(`
                <div class="select2-results__option-container">
                  <div class="select2-todo">${data.text}</div>
                </div>
                `);
          }
        },
      })
      .trigger('change')
      .select2('open');

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
});
