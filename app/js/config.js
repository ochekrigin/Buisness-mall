(function (window) {
  'use strict';

  var currentYear = new Date().getFullYear();

  window.config = {
    requestData: [
      {
        url: 'https://assets.inlink.io/content/' + currentYear + '/channels/web-location-public-news-long/web-location-public-news-long-939.xml',
        // url: 'https://assets.inlink.io/content/' + currentYear + '/channels/web-carousel/web-carousel-939.xml',
        // url: 'http://www.juicer.io/api/feeds/xperior?per=100&page=1',
        type: 'xml',
        name: 'news'
      },
      {
        // url: 'inc/data-store.xml',
        url: 'https://assets.inlink.io/content/' + currentYear + '/channels/web-local-directory/web-local-directory-939.xml',
        type: 'xml',
        name: 'mapplic'
      },
      {
        url: 'https://cms.inlink.com.au/feeds/locations/' + 939 + '.xml',
        // url: 'inc/about.xml',
        type: 'xml',
        name: 'map'
      },
      {
        url: 'https://xperior-services.herokuapp.com/interests',
        type: 'json',
        name: 'items'
      },
      {
        url: 'https://assets.inlink.io/content/' + currentYear + '/channels/web-local-directory/web-local-directory-939.xml',
        type: 'xml',
        name: 'store'
      },
      {
        url: 'https://assets.inlink.io/content/' + currentYear + '/channels/web-local-directory/web-local-directory-939.xml',
        type: 'xml',
        name: 'stores'
      },
      {
        url: 'https://assets.inlink.io/content/' + currentYear + '/channels/web-local-directory/web-local-directory-939.xml',
        type: 'xml',
        name: 'filter-items'
      },
      {
        url: 'https://assets.inlink.io/content/' + currentYear + '/channels/web-local-directory/web-local-directory-939.xml',
        type: 'xml',
        name: 'schedule'
      }
    ],
    visual: {
      isPromotion: false,
      img: {
        url: 'images/content/img-visual-1.png',
        width: '1400',
        height: '422',
        alt: 'img-description'
      },
      title: {
        text: 'For the busy, the hungry, the stylish people of the northern CBD. Only the MetCentre can be your everyday destination for food, fashion & services and only seconds from your door and Wynyard Station'
      },
      heading: {
        text: 'Your Centre for',
        subtext: 'Everything'
      },
      showSearchBar: true
    }
};

})(window);