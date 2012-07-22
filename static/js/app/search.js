$(document).ready(function() {
  var room = window.location.pathname.split('/')[1];
  var songs_db = db.child('rooms').child(room).child('songs');
  var songs_list;

  var search_results;

  var current_song_data;
  var current_song_past_30 = false;
  
  // Get the audio player.
  var audio_player = document.getElementById('player');

  var stream_song = function(song_id, album_id) {
    $.getJSON('/_play', {'song_id': song_id, 'album_id': album_id}, function(data) {
      // Set the current song data.
      current_song_data = data;
      current_song_data['song_id'] = song_id;
      audio_player.src = current_song_data.url;
    });
  }

  var next = function() {
    if (songs_list.length > 0) {
      var current_song_meta = songs_list.shift();
      songs_db.set(songs_list);

      stream_song(current_song_meta.SongID, current_song_meta.AlbumID);
    } else {
      // Top 400 thing.
    }
  }

  var play_pause = function() {
    if (audio_player.paused) {
      audio_player.play();
    } else {
      audio_player.pause();
    }
  }

  // Add event listeners for the audio player.
  audio_player.addEventListener('ended', function() {
    current_song_past_30 = false;
    $.post('/_complete', current_song_data);

    // TODO(johnliu): check popping songs?
    // Play the next song.
    next();
  });

  audio_player.addEventListener('timeupdate', function() {
    if (audio_player.currentTime > 30 && !current_song_past_30) {
      current_song_past_30 = true;
      $.post('/_over_30', current_song_data);
    }
  });

  $('#play-pause').click(function() {
    play_pause();
  });

  $('#next').click(function() {
    next();
  });
  
  songs_db.on('value', function(snapshot) {
    songs_list = snapshot.val();
    if (typeof songs_list === 'undefined' || songs_list == null) {
      songs_list = [];
    }

    var queue_table =  $('#queue-table');
    queue_table.empty(); 
    
    $.each(songs_list, function(element_id, element) {
      var inserted_element = '\
      <tr>\
      <td class="queue-song-name">\
      <a href="#" class="song-link" rel="tooltip" title="' +
      element.SongName + '">' + element.SongName + '</a>\
      </td>\
      <td class="queue-song-artist">\
      <a href="#" class="song-link" rel="tooltip" title="' +
      element.ArtistName + '">' + element.ArtistName + '</a>\
      </td>\
      <td class="queue-song-actions"><div class="action-buttons">\
      <a class="btn btn-mini btn-success">\
      <i class="icon-thumbs-up icon-white"></i>\
      </a>\
      <a class="btn btn-mini btn-danger">\
      <i class="icon-thumbs-down icon-white"></i>\
      </a>\
      <a class="btn btn-mini btn-warning">\
      <i class="icon-star icon-white"></i>\
      </a>\
      </td>\
      </tr>'

      queue_table.append(inserted_element);

      if (typeof current_song_data === 'undefined') {
        next();
      }
    });
  });

  // push songs to the playlist
  $('.add-to-queue').live('click', function() {
    var element_id = parseInt($(this)[0].id.split('-')[2]);
    var element = search_results[element_id];

    // Add to songs list
    songs_list.push(element);
    songs_db.set(songs_list);
  });

  var search_handler = function() {
    // Get the search string
    var search = $("input#search-box").val();
    $('.search-result-text').find('span').text(search);
    
    var search_list = $('#song-list');
    search_list.empty();

    $.get('_search', {'search_query': search}, function(data) {
      search_results = $.parseJSON(data);
      
      // Create a DOM element for each json object.
      $.each(search_results, function(i, element) {
        var inserted_element = '\
            <tr>\
              <td class="search-result-song">' + element.SongName + '</td>\
              <td class="search-result-artist">' + element.ArtistName + '</td>\
              <td class="search-result-album">' + element.AlbumName + '</td>\
              <td class="search-result-actions">\
                <div class="action-buttons">\
                  <a href="#" id="search-result-' + i +  '" class="btn btn-primary btn-mini add-to-queue">\
                  <i class="icon-plus icon-white"></i>\
                  </a>\
                  <a href="#" class="btn btn-warning btn-mini add-to-queue">\
                  <i class="icon-star icon-white"></i>\
                  </a>\
                </div>\
              </td>\
            <tr>\
        '

        search_list.append(inserted_element);
      });

    });

    return false;
  }

  $('#search-form').submit(search_handler);

})

