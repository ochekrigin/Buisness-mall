(function ($, window, document, undefined) {
  'use strict';

  var html = $('html'),
    body = html.find('body'),
    htmlBody = html.add(body),
    utilities;

  utilities = (function utils() {
    function addClass (config) {
      if (config.selector) {
        var isTouchDevice = /MSIE 10.*Touch/.test(navigator.userAgent) || ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch,
          collection = $(config.selector),
          eventByDefault = isTouchDevice ? 'touchstart' : 'click',
          eventToBind = config.eventName || eventByDefault,
          classNameToAdd = config.classNameToAdd || 'active';

        collection.on(eventToBind, function (e) {
          if (eventToBind === 'click' || eventToBind === 'touchstart') {
            e.preventDefault();
          }

          if (config.removeOnOutsideClick) {
            e.stopPropagation();
          }
          var currentElement = config.parentToAddSelector ? $(this).closest(config.parentToAddSelector) : $(this);

          if (currentElement.hasClass(classNameToAdd)) {
            currentElement.removeClass(classNameToAdd);
          } else {
            currentElement.addClass(classNameToAdd);
          }
        });

        if (config.removeOnOutsideClick) {
          html.on(eventToBind, function (event) {
            if (collection.closest(config.parentToAddSelector)[0] != event.target && !collection.closest(config.parentToAddSelector).has(event.target).length) {
              collection.closest(config.parentToAddSelector).removeClass(classNameToAdd);
            }
          });
        }
      } else {
        console.log('You need to specify a selector for add class utility method');
      }
    }

    function checkboxItemsSelection (config) {

      var dataAll,
          checkboxCollection;

      function checkItems () {
        var i = 0, j = 0;

        for (; i < checkboxCollection.length; i++) {
          if ($(checkboxCollection[i]).is(':checked')) {
            j++;
          }
        }

        if (checkboxCollection.length === j) {
          dataAll.prop('checked', true);
        } else {
          dataAll.prop('checked', false);
        }
      }

      if (config.itemCollection) {
        var collection = $(config.itemCollection);
            checkboxCollection = collection.find('input[type="checkbox"]').not(dataAll);
            dataAll = collection.find($(config.checkAllItem)).find('input[type="checkbox"]');

        dataAll.on('change', function () {
          if ($(this).prop('checked') === true) {
            checkboxCollection.prop('checked', true);
          } else {
            checkboxCollection.prop('checked', false);
            $(this).prop('checked', false);
          }
        });

        checkboxCollection.on('change', function () {
          checkItems();
        });
      }
    }

    function clearItems (config) {

      if (config.itemCollection) {
        var collection = $(config.itemCollection),
            currentText;

        collection.on({
          'focus': function () {
            var cur = $(this);
            if (cur.attr('placeholder').length > 1) {
              currentText = cur.attr('placeholder');
            }
            cur.attr('placeholder', '');
          },
          'blur': function () {
            var cur = $(this);
            if (cur.val() === '') {
              cur.attr('placeholder', currentText);
            }
          }
        });
      }
    }

    function smoothScrollTo(anchorSelector, diff, callback) {
      var anchor = body.find(anchorSelector);

      if (anchor.length) {
        htmlBody.stop()
          .animate({
            scrollTop: anchor.offset().top - (diff || 0)
          }, 750, function () {
            if (typeof callback === 'function') {
              callback();
            }
          });

        return anchor;
      } else {
        return $();
      }
    }

    function dataRequest(config) {
      var deffered = $.Deferred();

      $.ajax({
        type: config.typeRequest,
        url: config.url,
        beforeSend: function(xhr){
          xhr.setRequestHeader('Access-Control-Allow-origin', '*');
        },
        headers : {
          'Access-Control-Allow-origin': '*'
        },
        contentType: 'application/json',
        async: false,
        dataType: config.dataType,
        data: config.data,
        success: function(data){
          deffered.resolve(data);
        },
        error: function(textStatus){
          deffered.reject(textStatus);
        }
      });

      return deffered.promise();
    }

    return {
      addClass: addClass,
      clearItems: clearItems,
      smoothScrollTo: smoothScrollTo,
      checkboxItemsSelection: checkboxItemsSelection,
      dataRequest: dataRequest
    };
  }());

  window.utilities = utilities;
})(jQuery, window, window.document);
