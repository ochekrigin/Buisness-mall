;(function ($, window, document, undefined) {
  'use strict';

  var body = $('body'),
      searchField = body.find('[data-search-field]');

  if (searchField.length) {
    var infoText = searchField.data('note'),
        dataUrl = searchField.data('url'),
        i;

    var options = {
      url: dataUrl,
      dataType: 'xml',
      xmlElementName: 'feedItem',
      getValue: function (element) {
        return $(element).find('data > title').text();
      },
      template: {
        type: 'custom',
        method: function (value) {
          return '<a href="#"><span>' + value + '</span></a>';
        }
      },
      list: {
        maxNumberOfElements: 8,
        onLoadEvent: function () {
          var resultHolder = body.find('.easy-autocomplete ul'),
            resultItems = resultHolder.find('li'),
            mapplicLinks = body.find('.mapplic-list a'),
            infoLink = resultHolder.find('a');

          if (resultItems.length < 1) {
            resultHolder.find('.eac-category').remove();
            resultHolder.append('<li>' + infoText + '</li>');
          }

          infoLink.on('click', function () {
            var cur = $(this),
                curText = cur.find('span').text();

            for (i = 0; i < mapplicLinks.length; i++) {
              var item = $(mapplicLinks[i]);

              if (item.find('h4').text() === curText) {
                item.trigger('click').addClass('active');
              }
            }
            // smooth scrollTo utility initialization
            if (typeof window.utilities.smoothScrollTo === 'function') {
              var mapSection = body.find('#map-section');
              window.utilities.smoothScrollTo(mapSection, 15);
            }
          });
        },
        match: {
          enabled: true
        },
        sort: {
          enabled: false
        }
      },
      theme: 'square'
    };

    searchField.easyAutocomplete(options);
  }
}(jQuery, window, window.document));
