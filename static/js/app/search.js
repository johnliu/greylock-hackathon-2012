$(document).ready(function() {
  var room = window.location.pathname.split('/')[1];
  var songs_db = db.child('rooms').child(room).child('songs');
  var songs_list;

  var current_song_db = db.child('rooms').child(room).child('current');
  var current_song_data;
  var current_song_meta;
  var current_song_timer;
  var current_song_status;
  var current_song_past_30 = false;

  var search_results;
  
  // Get the audio player.
  var audio_player = document.getElementById('player');

  var stream_song = function(song_id, album_id) {
    console.log('Server call attempted.');
    if ($.cookie(room) != 0) {
      console.log("Not playing, so it's fine.");
      return;
    }

    $.getJSON('/_play', {'song_id': song_id, 'album_id': album_id}, function(data) {
      // Set the current song data.
      current_song_data = data;
      current_song_data['song_id'] = song_id;
      current_song_db.child('data').set(current_song_data);

      audio_player.src = current_song_data.url;
    });
  }

  var next = function() {
    if (songs_list.length > 0) {
      current_song_meta = songs_list.shift();
      songs_db.set(songs_list);
      current_song_db.child('meta').set(current_song_meta);

      stream_song(current_song_meta.SongID, current_song_meta.AlbumID);
    } else {
      audio_player.src = '';
      current_song_db.child('meta').remove();
      current_song_db.child('data').remove();
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

    // Update the timer.
    current_song_timer =  current_song_data.duration/1000000 - audio_player.currentTime;
    current_song_db.child('timer').set(current_song_timer)
  });

  audio_player.addEventListener('play', function() {
    current_song_status = 'play';
    current_song_db.child('status').set(current_song_status);
  });

  audio_player.addEventListener('pause', function() {
    current_song_status = 'pause';
    current_song_db.child('status').set(current_song_status);
  });

  $('#play-pause').click(function() {
    if (current_song_status == 'play') {
      current_song_status = 'pause'
      current_song_db.child('status').set(current_song_status);
    } else {
      current_song_status = 'play'
      current_song_db.child('status').set(current_song_status);
    }
  });

  $('#next').click(function() {
    next();
  });
  
  current_song_db.child('data').child('song_id').on('value', function(snapshot) {
    var snap = snapshot.val();
    if (typeof song_list !== 'undefined') {
      next();
    }
  });

  current_song_db.on('value', function(snapshot) {
    // Style current song.
    var snap = snapshot.val();
    if (typeof snapshot.val() !== 'undefined' && snapshot.val() != null) {
      current_song_data = snap.data;
      current_song_meta = snap.meta;
      current_song_timer = snap.timer;
      current_song_status = snap.status;
    }

    if (typeof current_song_data !== 'undefined' && current_song_data != null &&
        typeof current_song_meta !== 'undefined' && current_song_meta != null) {

      if ($('#player').attr('src') == '') {
        stream_song(current_song_meta.SongID, current_song_meta.AlbumID);
      } else if (current_song_data.song_id != current_song_meta.SongID) {
        stream_song(current_song_meta.SongID, current_song_meta.AlbumID);
      }

      $('#sidebar-cover-art').attr('src', current_song_data.cover_art_url);
      $('#sidebar-song-title').text(current_song_meta.SongName);
      $('#sidebar-song-artist').text(current_song_meta.ArtistName);
      $('#sidebar-song-album').text(current_song_meta.AlbumName);

      var mins = Math.floor(current_song_timer / 60);
      var secs = Math.floor(current_song_timer % 60);
      var secs_string = (secs < 10 ? '0' : '') + secs;
      $('.timer').text(mins + ':' + secs_string);

      if (current_song_status == 'play') {
        $('#play-pause').find('i').removeClass('icon-play').addClass('icon-pause');
        
        if (audio_player.paused) {
          audio_player.play();
        }
      } else {
        $('#play-pause').find('i').removeClass('icon-pause').addClass('icon-play');

        if (!audio_player.paused) {
          audio_player.pause();
        }
      }

    } else {
      $('#sidebar-cover-art').attr('src', '/static/img/default_cover_art.png');
      $('#sidebar-song-title').text('No song playing.');
      $('#sidebar-song-artist').text('--');
      $('#sidebar-song-album').text('--');
      $('.timer').text('--:--');
    }
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
            </tr>\
        '

        search_list.append(inserted_element);
      });

    });

    return false;
  }

  $('#search-form').submit(search_handler);

})

