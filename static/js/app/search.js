$(document).ready(function() { 
  var room = window.location.pathname;

  // push songs to the playlist
  $('.add-to-queue').click(function() {
  });

  // song search field
  var search_handler = function() {
    var search = $("input#search-box").val();
    $('.search-result-text').find('span').text(search);
    var song_list = $('#song-list');
    song_list.empty();
    $.get('_search', {'search_query': search}, function(data) {
      var query_set = $.parseJSON(data);
      $.each(query_set, function(i, obj) {
        var song = $('<tr />');
        $("<td />", {text: obj.AlbumName}).appendTo(song);
        $("<td />", {text: obj.ArtistName}).appendTo(song);
        $("<td />", {text: obj.SongName}).appendTo(song);
        var link = "<a href='#' class='btn btn-success add-to-queue'>Add</a>";
        var add_link = $("<td />");
        add_link.append(link);
        add_link.appendTo(song);
        song.appendTo(song_list);
      });
    });
    return false;
  }

  $('#search-form').submit(search_handler);
})

