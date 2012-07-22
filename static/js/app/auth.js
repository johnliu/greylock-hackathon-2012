$(document).ready(function() { 
  
  // authenticate form field
  var authenticate_handler = function() {
    var username = $("input#username-input").val();
    var password = $("input#password-input").val();
    var library_list = $('#library-list');
    library_list.empty();
    $.get('_authenticate', {'username': username, 'password': password}, function(data) {
      var query_set = $.parseJSON(data);
      $.each(query_set, function(i, obj) {
        var song = $('<tr />');
        $("<td />", {text: obj.SongName}).appendTo(song);
        $("<td />", {text: obj.ArtistName}).appendTo(song);
        $("<td />", {text: obj.AlbumName}).appendTo(song);
        var div = $("<div />", {class: 'action-buttons'});
        var first_link = "<a href='#' class='btn btn-primary btn-mini add-to-queue'><i class='icon-plus icon-white'></i></a>";
        div.append(first_link);
        var second_link = "<a href='#' class='btn btn-warning btn-mini add-to-queue'><i class='icon-star icon-white'></i></a>";
        div.append(second_link);
        var add_link = $("<td />");
        add_link.append(div);

        add_link.appendTo(song);
        song.appendTo(library_list);
      });
    });
    return false;
  }

  $('#login-form').submit(authenticate_handler);
})

