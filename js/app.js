var API_ENDPOINT = 'http://en.wikipedia.org/w/api.php?';
var $searchButton = $('.search-button');
var $searchField = $('.search-query');

$searchButton.on('click', searchForArticles);
$searchField.keyup(function(event) {
    if(event.keyCode === 13){
        searchForArticles();
    }
});

function displayExtract(data) {
  
  if ($('.extract').hasClass('empty')) {
    animateExtractIn(data);
  } else {
    animateExtractOut(data);
  }
  
}

function animateExtractIn(data) {
  var title = "<h1 class='extract-title'><a href='" + data.fullurl + "'>" + data.title + " <span class='icon-link'></span></a></h1>";
  $('.extract').html(title + data.extract);
  $('.extract').removeClass('empty');
  
  $('.extract').animate({
    opacity: 1,
    color: '#000',
  }, 500);
}

function animateExtractOut(data) {
  $('.extract').animate({
    color: '#FFF',
  }, 400);
  
  setTimeout(function() {
    animateExtractIn(data)
  },400);
}

function getArticleByTitle(title) {
  
  $.ajax({
    url: API_ENDPOINT,
    jsonp: "callback",
    dataType: "jsonp",
    
    data: {
      action: "query",
      format: 'json',
      titles: title,
      prop: "extracts|info",
      inprop: "url",
      redirects: true
    },
    success: function(response) {
      
      console.log(response);
      var data = response.query.pages;
      for(var id in data) {
        data = (data[id]);
      }
      displayExtract(data);
    }
  });
}

function searchForArticles() {
  var query = $('.search-query').val();
    $.ajax({
    url: API_ENDPOINT,
 
    // The name of the callback parameter
    jsonp: "callback",
 
    // Tell jQuery we're expecting JSONP
    dataType: "jsonp",
    
    data: {
      action: 'opensearch',
      search: query,
      format: 'json'
    },
 
    // Work with the response
    success: function( response ) {
      clearPreviousResults();
      
      if (response[1].length === 0) {
        noResultsFound();
      }
      
      for (var i = 0; i < response[1].length; i++) {
        var html = '<li class="result-item">';
//        html += '<a href="' + response[3][i] + '">'
        html += '<span class="result-item-heading">' + response[1][i] + '</span>';
        html += '</li>';
        $('.results').append(html);
        $('.result-item:last-child').css({
          opacity: 0,
          left: '-10px'
        });
        
        animateListItem(i);
        
        if( i === 0) {
          $('.results .result-item-heading').addClass('active');
          getArticleByTitle($('.results .result-item-heading').text());
        }
        
        $('.results .result-item:last-child').on('click', function() {
          $('.active').removeClass('active');
          $(this).children(".result-item-heading").addClass('active');
          getArticleByTitle($(this).children(".result-item-heading").text());
        });
      }
    },
    error: function() {
      console.log('error');
    }
  });
}

function noResultsFound() {
  $('.no-results').css({display: 'inline'});
  $('.extract').animate({
    opacity: 0,
  }, 200, function(){
    $('.extract').children().remove();
  });
}
function animateListItem(itemNumber) {
  setTimeout(function() {
    // Make the element fully transparent.
    $('.result-item:nth-child(' + (itemNumber + 1) + ')').animate({
      opacity: 1,
      left: '0px'
    }, 700, 'easeOutQuint', function() {
    });
  }, 100 * itemNumber);
}
function clearPreviousResults() {
  $('.start-search').css({display: 'none'});
  $('.no-results').css({display: 'none'});
  $('.results').children().remove();
}