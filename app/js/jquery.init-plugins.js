(function ($, window, document, undefined) {
  'use strict';

  var body = $('body'),
      hasOptionalScroll = body.find('[data-optional-scroll]'),
      isTouchDevice = /MSIE 10.*Touch/.test(navigator.userAgent) || ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch;

  if (!isTouchDevice) {
    body.addClass('is-desktop');
  }

  // add class utility initialization
  if (typeof window.utilities.addClass === 'function') {
    window.utilities.addClass({
      selector: '[data-add-class]',
      parentToAddSelector: '[data-add-class-parent]',
      removeOnOutsideClick: true
    });
  }

  // smooth scrollTo utility initialization
  if (typeof window.utilities.smoothScrollTo === 'function') {
    var scrollToElement = body.find('[data-anchor]');

    if (scrollToElement.length) {
        scrollToElement.on('click', function (event) {
          event.preventDefault();
          window.utilities.smoothScrollTo($(this).attr('href'), 15);
        });
    }
  }

  // clear items form utility initialization
  if (typeof window.utilities.clearItems === 'function') {
    window.utilities.clearItems({
      itemCollection: '[data-search-field]'
    });
  }

  // custom select initialization
  if (typeof $ == 'function' && typeof $.fn.customSelect == 'function') {
    var customSelect = body.find('.custom-select');

    if (customSelect.length) {
      customSelect.customSelect({
        selectStructure: '<div class="selectArea"><div class="left"></div><div class="center"></div><a href="#" class="selectButton"><i class="ico"> </i></a><div class="disabled"></div></div>',
        defaultText: function(select){
          return select.getAttribute('data-placeholder');
        }
      });
    }
  }

  // form validator initialization
  if (typeof $ == 'function' && typeof $.fn.formValidator == 'function') {
    var formToValidate = body.find('[data-form-to-validate]');

    if (formToValidate.length) {

      var collectionParent = formToValidate.find('[data-form-to-validate-parent]'),
          radioButtonsCollection = collectionParent.find('input[type="radio"]'),
          formRequestUrl = formToValidate.data('request-url'),
          interestsArray = [],
          i;

      formToValidate.formValidator({
        items: '[data-type-required]',
        eventObj: 'input[data-type-required], textarea[data-type-required]',
        validAttr: 'type',
        addValidFunc: function (item) {
          if (!$(item).is(':submit')) {
            return item.value !== $(item).attr('placeholder');
          } else {
            return true;
          }
        },
        onSubmit: function (e) {
          e.preventDefault();
          var curForm = $(this)[0],
              formData = curForm.dataItem.serializeArray(),
              checkboxCollection = collectionParent.find('input[type="checkbox"]').not('[data-all]'),
              dataObject = {};

          collectionParent.each(function () {
            var currentList = $(this),
              itemsList = currentList.find('[data-type-item]');
            for (var i = 0; i < itemsList.length; i++) {
              var curItem = $(itemsList[i]);
              if (curItem.is(':checked') || curItem.attr('checked') === 'checked') {
                curItem.closest(collectionParent).removeClass('error');
                return true;
              } else {
                curItem.closest(collectionParent).addClass('error');
              }
            }
          });

          if (curForm.dataItem.find('.error').length === 0) {
            for (i = 0; i < formData.length; i++) {
              if (formData[i].value !== '') {
                dataObject[formData[i].name] = formData[i].value;
              }
            }
            if (curForm.dataItem.find('[data-interest]').length) {
              for (i = 0; i < checkboxCollection.length; i++) {
                var curItem = $(checkboxCollection[i]);
                if (curItem.prop('checked') === true && curItem.prop('checked') !== undefined) {
                  interestsArray.push(curItem.data('id'));
                }
              }
              dataObject.interests = interestsArray;
            }
            // data request function
            if (typeof window.utilities.dataRequest === 'function') {
              var stringifyObject = JSON.stringify(dataObject),
                  promise = window.utilities.dataRequest({
                    typeRequest: 'POST',
                    url: formRequestUrl,
                    dataType: 'json',
                    data: stringifyObject
                  });

              if (formToValidate.is('[data-add-class-on-recieved-response]')) {
                promise.then(
                  function() {
                    formToValidate.addClass('show-message');
                  },
                  function() {
                    console.log("Request on " + formRequestUrl + " has failed!");
                  }
                );
              }

            }
            curForm.dataItem.trigger('reset');
            interestsArray = [];
          }
        }
      });

      radioButtonsCollection.on('change', function () {
        var validParent = $(this).closest(collectionParent);
        if (validParent.length) {
          validParent.removeClass('error');
        }
      });
    }
  }

  if (hasOptionalScroll.length) {
    var currentUrl = document.URL,
        filename = decodeURIComponent(currentUrl.substring(currentUrl.lastIndexOf('?') + 1)),
        setInterval, collectionCheck, mapplicLinks;


      collectionCheck = function () {
        mapplicLinks = body.find('.mapplic-list a');
        if (mapplicLinks.length) {
          clearInterval(setInterval);
          for (var i = 0; i < mapplicLinks.length; i++) {
            var item = $(mapplicLinks[i]);

            if (item.find('h4').text() === filename) {
              item.trigger('click').addClass('active');
            }
          }
          // smooth scrollTo utility initialization
          if (typeof window.utilities.smoothScrollTo === 'function') {
            window.utilities.smoothScrollTo($('#mapplic'), 15);
          }
        } else {
          setInterval = setTimeout(collectionCheck, 1000);
        }
      };
      collectionCheck();
    }

})(jQuery, window, window.document);
