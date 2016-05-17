;(function ($, window, document, undefined) {
  'use strict';

  var body = $('body'),
      loadingClass = 'loading',
      blocksWithTemplates = body.find('[data-has-template]'),
      blockHasGallery = body.find('[data-has-scroll-gallery]'),
      hasOptionalLoad = body.find('[data-optional-load]'),
      hasOptionalLoadSchedule = body.find('[data-schedule]'),
      elementHiddenWhileImageLoads  = body.find('[data-is-hidden-while-image-loads]'),
      dataConfig = [],
      localScope = window.localScope,
      configuration = window.config,
      infoData;

  if ($('[data-item-visual]').length) {
    new Vue ({
      el: '[data-item-visual]',
      data: configuration
    });
  }

  $.ajax({
    url: 'http://www.juicer.io/api/feeds/xperior?per=100&page=1',
    dataType: 'json',
    success: function (response) {
      console.log(response);
    },
    error: function (xhr, status, errorThrown) {
      console.log(xhr, status, errorThrown);
    }
   });

  if (blocksWithTemplates.length) {
    blocksWithTemplates.each(function () {
      var currentBlock = $(this),
          currentData,
          dataRequest = configuration.requestData;

      $.each(dataRequest, function (i, obj) {
       if (obj.name === currentBlock.attr('data-name')) {
          currentData = {
            name: obj.name,
            scope: '#' + obj.name,
            type: obj.type,
            url: obj.url
          };
       }
     });
      dataConfig.push(currentData);
    });
  }

  if (hasOptionalLoad.length) {
    var currentUrl = document.URL,
        filename  = currentUrl.substring(currentUrl.lastIndexOf('?') + 1),
        dataBlock = hasOptionalLoad.find('[data-loaded-block]'),
        dataTitle = hasOptionalLoad.find('[data-title]'),
        dataPhone = hasOptionalLoad.find('[data-phone]'),
        dataCategory = hasOptionalLoad.find('[data-category]'),
        dataAddTitle = hasOptionalLoad.find('[data-add-title]'),
        dataImage = hasOptionalLoad.find('[data-image]'),
        dataRequestUrl = hasOptionalLoad.data('request-url'),
        dataDescription = hasOptionalLoad.find('[data-description]');
        infoData = filename;

    $.ajax({
      url: dataRequestUrl + filename +'.json',
      dataType: 'json',
      beforeSend: function () {
        dataBlock.addClass(loadingClass);
      },
      success: function (response) {
        dataBlock.removeClass(loadingClass);
        dataDescription.html(response.body);
        if (response.directory_image_url && response.name) {
          dataImage.attr('src', response.directory_image_url);
          dataTitle.html(response.name);
        } else {
          dataImage.attr('src', response.landscape_image_url);
          dataTitle.html(response.title);
        }
        dataAddTitle.html(response.description);
        dataPhone.attr('href', 'tel:' + response.phone).html(response.phone);
        dataCategory.html(response.category_name);
      },
      error: function (xhr, status, errorThrown) {
        console.log(xhr, status, errorThrown);
      }
     });
  }

  // scroll gallery initialization
  function initGallery (dataScope) {
    var scopeObject = $(dataScope);

    if (typeof $.fn.scrollGallery === 'function') {
      if (scopeObject.length) {
        scopeObject.scrollGallery({
          mask: 'div.holder',
          slider: '.slider',
          slides: '> li',
          generatePagination: 'div.pagination',
          circularRotation: true,
          maskAutoSize: true,
          autoRotation: true,
          switchTime: 5000,
          animSpeed: 600,
          step: 1
        });
      }
    }
  }
  
  function srcChange () {

    var imagesList = body.find('[data-src]'),
        setInterval;

    if (imagesList.length) {
      clearInterval(setInterval);
      imagesList.each(function () {
        var currentElement = $(this),
            dataLink = currentElement.data('src');
        currentElement.attr('src', dataLink);
      });
    } else {
      setInterval = setTimeout(srcChange, 500);
    }
  }

  if (elementHiddenWhileImageLoads.length) {
    var loadingImage = elementHiddenWhileImageLoads.find('img');

    srcChange();
    loadingImage.load(function () {
      elementHiddenWhileImageLoads.removeClass('hidden');
    });
  }

  function parseData (data) {
    var collection = data.schedule.subChannel.feedItem;

    for (var i = 0; i < collection.length; i++) {
      if (collection[i].data.longformId === infoData) {
        new Vue ({
          el: '[data-schedule]',
          data: collection[i]
        });
      }
    }
    srcChange();
  }

  function idChange (dataScope) {
    var videoList = $(dataScope).find('[data-image-id]');
    videoList.each(function () {
      var currentElement = $(this),
          dataId = currentElement.data('image-id'),
          curLastItem = dataId.lastIndexOf('/'),
          curLastId = dataId.substring(curLastItem + 1);
          currentElement.addClass('wistia_async_' + curLastId);
    });
  }

  function extractCategories (response) {
    var categoriesDataArray = [],
        categoryNames = [];

    if (response.subChannel) {
      response.subChannel.feedItem.forEach(function (item) {
        var currentCategoryName = item.data.category,
            currentCategoryClassName = currentCategoryName.replace(/ /g,'').replace(/\//g,'').replace('&','-').toLowerCase();
        if ($.inArray(currentCategoryName, categoryNames) < 0) {
          categoriesDataArray.push({
            name: currentCategoryName,
            className: currentCategoryClassName
          });
          categoryNames.push(currentCategoryName);
        }
      });
    }



    return categoriesDataArray;
  }

  function groupByCategory (response) {
    var categoriesGroups = [],
        uniqueCategories = extractCategories(response),
        currentGroupLength = 0,
        maxGroupLength = 10;

    uniqueCategories.forEach(function (item, index) {
      var subGroup = $.grep(response.subChannel.feedItem, function(obj) {
        return obj.data.category === item.name;
      });

      currentGroupLength += subGroup.length;

      if (index === 0) {
         categoriesGroups.push({
          group: [{
            name: item.name,
            items: subGroup,
            className: item.className
          }]
        });
      }
      else {
        if (currentGroupLength > maxGroupLength) {
          categoriesGroups.push({
            group: [{
              name: item.name,
              items: subGroup,
              className: item.className
            }]
          });

          currentGroupLength = 0;
        }
        else {
          categoriesGroups[categoriesGroups.length - 1].group.push({
            name: item.name,
            items: subGroup,
            className: item.className
          });
        }
      }
    });

    return categoriesGroups;
  }

  function storeFilter(dataScope) {
    var newArr = [],
        types = {},
        orig = dataScope.store ? dataScope.store.subChannel.feedItem : [],
        i, j, cur;

    for (i = 0, j = orig.length; i < j; i++) {
        cur = orig[i];
        var curData = $(cur.data);

        if (!(cur.data.title.charAt(0) in types)) {
            types[cur.data.title.charAt(0)] = {
              letter: cur.data.title.charAt(0),
              stores: []
            };
            newArr.push(types[cur.data.title.charAt(0)]);
        }
        if (curData.attr('longformId')) {
          types[cur.data.title.charAt(0)].stores.push({
            "title": curData.attr('title'),
            "img": curData.attr('imageUrl'),
            "phone": curData.attr('phone'),
            "category": curData.attr('category').replace(/ /g,'').replace('&','-').toLowerCase(),
            "web": curData.attr('longformId'),
            "link": curData.attr('web')
          });
        } else {
          types[cur.data.title.charAt(0)].stores.push({
            "title": curData.attr('title'),
            "img": curData.attr('imageUrl'),
            "phone": curData.attr('phone'),
            "category": curData.attr('category').replace(/ /g,'').replace('&','-').toLowerCase()
          });
        }
    }

    newArr.sort(function(a, b) {
      var textA = a.letter.toUpperCase();
      var textB = b.letter.toUpperCase();
      return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
    });

    return newArr;
  }

  function dataConst (data) {

    function uniqueData (array) {
        var uniqueObj = {},
          localArray = [];

      array.forEach(function(item) {
        if (!uniqueObj[item.title]) {
            localArray.push(item);
            uniqueObj[item.title] = item;
        }
      });

      return localArray;
    }

    var jsonData = {},
        newArray = [],
        itemCollection;

    itemCollection = data.mapplic.subChannel.feedItem;

    for (var i = 0; i < itemCollection.length; i++) {
      var curItem = $(itemCollection[i].data);

      newArray.push({
        "id": curItem.attr('category'),
        "title": curItem.attr('category'),
        "color": "#f16045",
        "show": "false"
      });
    }

    function transformArr(orig) {
      var newArr = [],
          types = {},
          i, j, cur;

      for (i = 0, j = orig.length; i < j; i++) {
          cur = orig[i];
          var curData = $(cur.data);
          if (!(cur.data.mapLevel in types)) {
            if (cur.data.mapLevelName && cur.data.mapLevel) {
              types[cur.data.mapLevel] = {
                id: cur.data.mapLevel,
                title: cur.data.mapLevel,
                map: "maps/map-large.png",
                minimap: "maps/map-small.png",
                locations: []
              };
              newArr.push(types[cur.data.mapLevel]);
            }
          }
          if (cur.data.mapLevelName && cur.data.mapLevel) {
            if (curData.attr('phone') && cur.data.hasLongform === '1') {
              types[cur.data.mapLevel].locations.push({
                "id": curData.attr('mapStoreId'),
                "about": "",
                "title": curData.attr('title'),
                "description": "<a href='store-page.html?"+curData.attr('longformId')+"' class='title'>" + curData.attr('title') + "</a> <a href='tel:" + curData.attr('phone') + "' class='phone'>" + curData.attr('phone') + "</a> <span class='name'>SHOP " + curData.attr('mapStoreId') + " " + cur.data.mapLevelName + "</span>",
                "pin": "circular",
                "category": curData.attr('category'),
                "fill": "#687e91",
                "x": curData.attr('mapCoordinateX'),
                "y": curData.attr('mapCoordinateY')
              });
            } else if (!curData.attr('phone') && cur.data.hasLongform === '1') {
              types[cur.data.mapLevel].locations.push({
                "id": curData.attr('mapStoreId'),
                "about": "",
                "title": curData.attr('title'),
                "description": "<a href='store-page.html?"+curData.attr('longformId')+"' class='title'>" + curData.attr('title') + "</a> <span class='name'>SHOP " + curData.attr('mapStoreId') + " " + cur.data.mapLevelName + "</span>",
                "pin": "circular",
                "category": curData.attr('category'),
                "fill": "#687e91",
                "x": curData.attr('mapCoordinateX'),
                "y": curData.attr('mapCoordinateY')
              });
            } else if (curData.attr('phone')) {
              types[cur.data.mapLevel].locations.push({
                "id": curData.attr('mapStoreId'),
                "about": "",
                "title": curData.attr('title'),
                "description": "<span class='title'>" + curData.attr('title') + "</span> <a href='tel:" + curData.attr('phone') + "' class='phone'>" + curData.attr('phone') + "</a> <span class='name'>SHOP " + curData.attr('mapStoreId') + " " + cur.data.mapLevelName + "</span>",
                "pin": "circular",
                "category": curData.attr('category'),
                "fill": "#687e91",
                "x": curData.attr('mapCoordinateX'),
                "y": curData.attr('mapCoordinateY')
              });
            } else {
              types[cur.data.mapLevel].locations.push({
                "id": curData.attr('mapStoreId'),
                "about": "",
                "title": curData.attr('title'),
                "description": "<span class='title'>" + curData.attr('title') + "</span> <span class='name'>SHOP " + curData.attr('mapStoreId') + " " + cur.data.mapLevelName + "</span>",
                "pin": "circular",
                "category": curData.attr('category'),
                "fill": "#687e91",
                "x": curData.attr('mapCoordinateX'),
                "y": curData.attr('mapCoordinateY')
              });
            }
          }
      }

      return newArr;
    }

    jsonData = {
      "mapwidth": "1000",
      "mapheight": "760",
      "categories": uniqueData(newArray),
      "levels": transformArr(itemCollection)
    };

    // mapplic initialization
    if (typeof $.fn.mapplic === 'function') {
      var mapArea = body.find('.mapplic');

      if (mapArea.length) {
        mapArea.mapplic({
          source: jsonData,
          fullscreen: true,
          height : 700,
          minimap: true,
          sidebar: true,
          search : true,
          hovertip: true,
          developer: false,
          clearbutton: true,
          maxscale: 2,
          zoombuttons: true,
          deeplinking: true,
          zoom: true,
          animate: true
        });
      }
    }
  }

  function checkIsShown (data) {
    if (data.subChannel) {
        var newArray = [],
          dataArray = data.subChannel.feedItem,
          curDate = Date.parse(new Date());
      if (dataArray[0].expires.length && dataArray[0].starts.length) {
        for (var i = 0; i < dataArray.length; i++) {
          var dataExpiresString = dataArray[i].expires.substring(0,10),
              dataStartsString = dataArray[i].starts.substring(0,10);
          if (curDate >= Date.parse(dataStartsString) && curDate <= Date.parse(dataExpiresString)) {
            newArray.push(dataArray[i]);
          }
        }
        dataArray = [];
        data.subChannel.feedItem = newArray;
        return data;
      } else {
        return data;
      }
    } else {
      return data;
    }
  }

  function getData (dataUrl, dataType, dataScope) {
    var dfd = $.Deferred(),
        scopeObject = $(dataScope);

    if (hasOptionalLoadSchedule.length) {
      scopeObject = body.find('#wrapper');
    }

    $.ajax({
      url: dataUrl,
      dataType: dataType,
      beforeSend: function () {
        console.log('data request to path "' + dataUrl + '" has been sent');
        scopeObject.addClass(loadingClass);
      },
      success: function (response) {
        scopeObject.removeClass(loadingClass);
        if (dataType === 'xml') {
          dfd.resolve($.xml2json(response));
        } else {
          dfd.resolve(response);
        }
      },
      error: function (xhr, status, errorThrown) {
        console.log(xhr, status, errorThrown);
      }
    });

    return dfd.promise();
  }

  function loadData (config, callback) {
    var templatesCollection = {};
    
    config.forEach(function (data) {
      var promise = getData(data.url, data.type, data.scope),
          vueInstance;

      promise.then(function (response) {
        var dataToBind = {},
            dataScope = $(data.scope);
        dataToBind[data.name] = checkIsShown(response);

        vueInstance = new Vue ({
          el: data.scope,
          data: dataToBind
        });
        console.log(dataToBind);

        if (dataToBind.mapplic) {
          dataConst(dataToBind);
        }
        templatesCollection[data.name] = vueInstance;
        if (body.find('[data-stores-list]').length) {
          vueInstance.stores = groupByCategory(response);
        }
        if (body.find('[data-store]').length) {
          vueInstance.store = {
            marks: storeFilter(dataToBind),
            categories: extractCategories(response)
          };

          localScope = data.scope;
          srcChange();
        }
        if (dataScope.find('[data-src]').length) {
          localScope = data.scope;
          srcChange();
        }
        if (dataScope.find('[data-image-id]').length) {
          idChange(data.scope);
        }
        if (blockHasGallery.length) {
          callback(data.scope);
        }
        if (data.name === 'schedule' && hasOptionalLoadSchedule.length) {
          parseData(dataToBind);
        }
        if (body.find('[data-checkbox-list]').length) {
          // selection checkbox items utility initialization
          if (typeof window.utilities.checkboxItemsSelection === 'function') {
            window.utilities.checkboxItemsSelection({
              itemCollection: '[data-checkbox-list]',
              checkAllItem: '[data-above]'
            });
          }
        }
      });
    });

    return templatesCollection;
  }

  if (blockHasGallery.length) {
    loadData(dataConfig, initGallery);
  } else {
    loadData(dataConfig);
  }
}(jQuery, window, window.document));
