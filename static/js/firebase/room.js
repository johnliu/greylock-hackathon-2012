$(document).ready(function() { 
  // create guest
  var room = window.location.pathname.split('/')[1];
  var guests = ['guest_' + Math.round(Math.random() * 1000)];
  db.child('rooms').child(room).child('guests').set(guests);

  db.child('rooms').child(room).on('child_added', function(snapshot) {
    //if (snapshot.val().guests === null) guests = [];
    //else guests = new Array(snapshot.val().guests);
    console.log(guests);
    guests.concat(snapshot.val().guests);
    console.log(guests);
  });

  guests.push(name);
  db.child('rooms').child(room).child('guests').set(name);

  // song search field
  var room = window.location.pathname;

  var search_handler = function() {
    var search = $("input#search-box").val();
    var song_list = $('#song-list');
    song_list.empty();
    $.get('_search', {'search_query': search}, function(data) {
      var query_set = $.parseJSON(data);
      $.each(query_set, function(i, obj) {
        var song = $('<tr />');
        $("<td />", {text: obj.AlbumName}).appendTo(song);
        $("<td />", {text: obj.ArtistName}).appendTo(song);
        $("<td />", {text: obj.SongName}).appendTo(song);
        song.appendTo(song_list);
      });
    });
    return false;
  }

  $('#search-form').submit(search_handler);
})

