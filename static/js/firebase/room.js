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
    $.get('_search', {'search_query': search}, function(data) {
      var query_set = $.parseJSON(data);
      $.each(query_set, function(i, obj) {
        var album_name = obj.AlbumName;
        var artist_name = obj.ArtistName;
        var song_name = obj.SongName;
        console.log('album name: ' + album_name);
        console.log('artist name: ' + artist_name);
        console.log('song name: ' + song_name);
      });
    });
    return false;
  }

  $('#search-form').submit(search_handler);
})

