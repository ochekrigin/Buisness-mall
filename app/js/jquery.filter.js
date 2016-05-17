(function ($, window, document, undefined) {
  'use strict';

  var body = $('body'),
    filterBox = body.find('[data-filter-box]'),
    filterItemsSelector = '[data-filter]',
    searchForm,
    dataRow,
    searchFormField,
    categoryRow,
    letterList,
    dataArray = [],
    hiddenClass = 'hidden',
    activeClass = 'active',
    disabledClass = 'disabled',
    counter = 0,
    filterByText,
    i, j, inputElement, setInterval;

  
  // disable active items if no corresponding block has been found
  function disableItems (collection) {
    return collection.map(function () {
      var currentElement = $(this),
        categoryText = currentElement.text(),
        correspondingBlock = body.find('[data-letter="' + categoryText + '"]');

      if (!correspondingBlock.length) {
        return currentElement;
      }
    });
  }

  // set active item
  function setActiveClass (addClassFlag, elements, className) {
    var i, currentElement;

    if (elements.length) {

      for (i = 0; i < elements.length; i++) {
        currentElement = $(elements[i]);

        if (addClassFlag) {
          currentElement.addClass(className);
        } else {
          currentElement.removeClass(className);
        }
      }
    }
  }

  // set data
  function setData (element, property) {
    if (element.hasClass(activeClass)) {
      for (var i = 0; i < dataArray.length; i++) {

        if (dataArray[i] === property) {

          if (dataArray.length !== 1) {
            dataArray.splice(i, 1);
          } else {
            dataArray = [];
          }
        }
      }
    } else {
      dataArray.push(property);
    }

    return dataArray;
  }

  // validation the category
  function filterByCategory (collection, checkingCollection) {
    var checkingItems = [],
      checkingCollectionItem;

    for (i = 0; i < checkingCollection.length; i++) {
      checkingCollectionItem = checkingCollection.eq(i);

      for (j = 0; j < collection.length; j++) {

        if (checkingCollectionItem.data('filterItem') === collection[j] &&
          checkingCollectionItem.hasClass(hiddenClass)) {
          checkingItems.push(checkingCollectionItem);
        }
      }
    }

    return checkingItems;
  }

  // check if the row is empty
  function checkIfEmpty (collection, items) {
    collection.each(function () {
      var currentRow = $(this),
        currentElement = currentRow.find(items),
        temp = 0;

      for (i = 0; i < currentElement.length; i++) {
        if ($(currentElement[i]).hasClass(hiddenClass)) {
          temp++;
        }
      }

      if (temp === currentElement.length) {
        setActiveClass (true, currentRow, hiddenClass);
      } else {
        setActiveClass (false, currentRow, hiddenClass);
      }
    });
  }

  // filter by letter
  function filterByLetter (currentEl, correspEl, dataRow, e) {
    if (currentEl.hasClass('disabled')) {
      e.preventDefault();
    } else {
      if (counter !== categoryRow.length) {
        if (correspEl.hasClass(activeClass)) {
          setActiveClass(false, correspEl, activeClass);
          setActiveClass(true, correspEl, hiddenClass);

          if (!dataRow.hasClass(activeClass)) {
            setActiveClass(false, dataRow, hiddenClass);
          }
        } else {
          setActiveClass(true, correspEl, activeClass);

          for (i = 0; i < dataRow.length; i++) {
            var curDataRow = body.find(dataRow[i]);
            if (!curDataRow.hasClass(activeClass)) {
              setActiveClass(true, curDataRow, hiddenClass);
            }
          }
          setActiveClass(false, correspEl, hiddenClass);

        }

        if (currentEl.hasClass(activeClass)) {
          setActiveClass(false, currentEl, activeClass);
        } else {
          setActiveClass(true, currentEl, activeClass);
        }

      } else {
        setActiveClass(false, dataRow, hiddenClass);
        setActiveClass(false, dataRow, activeClass);
        setActiveClass(false, letterList, activeClass);
        counter = 0;
      }

      for (i = 0; i < dataRow.length; i++) {
        if ($(dataRow[i]).hasClass(hiddenClass)) {
          counter++;
        }
      }
    }
  }

  function checkIfLength () {
    var dataSearchItems = filterBox.find('[data-filter-item]');

    function changeClassState (item, data) {
      if (item.hasClass(activeClass)) {
        setActiveClass (false, item, activeClass);
      } else {
        setActiveClass (true, item, activeClass);
      }

      if (data.length) {
        setActiveClass (true, dataSearchItems, hiddenClass);
        setActiveClass (false, filterByCategory(data, dataSearchItems), hiddenClass);
      } else {
        setActiveClass (false, dataSearchItems, hiddenClass);
      }
    }
    if (dataSearchItems.length > 10) {
      clearInterval(checkIfLength);
        searchForm = filterBox.find('.search-form');
        dataRow = filterBox.find('[data-row]');
        searchFormField = searchForm.find('input[type="text"]');
        categoryRow = filterBox.find('[data-letter]');
        letterList = filterBox.find('[data-anchor-filter]');
        searchFormField = searchForm.find('input[type="text"]');

      // filter action filterByText
      filterByText = (function (Arr) {

        function filter (row) {
          var text = $(row).text().toLowerCase(),
              val = $(inputElement).val().toLowerCase(),
              parentElement = $(row).closest('[data-filter-item]');

          if (text.indexOf(val) === -1) {
            parentElement.addClass(hiddenClass);
          } else {
            parentElement.removeClass(hiddenClass);
          }
          checkIfEmpty(dataRow, dataSearchItems);
        }

        function onInputEvent (e) {
          inputElement = e.target;
          Arr.forEach.call(filterBox, function (table) {
            Arr.forEach.call($(table).find('[data-row]').find('h3'), filter);
          });
          dataArray = [];
          filterBox.find(filterItemsSelector).removeClass(activeClass);
        }

        return {
          init: function () {
            Arr.forEach.call(searchFormField, function (input) {
              input.oninput = onInputEvent;
            });
          }
        };
      })(Array.prototype);

      // bind filter on type
      letterList.on('click', function (e) {
        e.preventDefault();

        var currentElement = $(this),
          categoryText = currentElement.text(),
          correspondingBlock = body.find('[data-letter="' + categoryText + '"]').closest('[data-row]');

        if (currentElement.hasClass(disabledClass)) {
          e.preventDefault();
        } else {
          filterByLetter(currentElement, correspondingBlock, dataRow, e);
        }

      });

      // bind letter filter
      filterBox.find(filterItemsSelector).on('click', function (e) {
        e.preventDefault();
        var currentItem = $(this),
          filterProperty = currentItem.data('filter-property'),
          dataArray = setData(currentItem, filterProperty);

        changeClassState(currentItem, dataArray);
        checkIfEmpty(dataRow, dataSearchItems);
      });

      // bind type filter
      searchFormField.on('keyup', function () {
        filterByText.init();
      });

      setActiveClass (true, disableItems(letterList), disabledClass);

    } else {
      setInterval = setTimeout(checkIfLength, 3000);
    }
  }

  checkIfLength();

})(jQuery, window, window.document);
