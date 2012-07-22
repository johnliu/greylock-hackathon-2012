$(document).ready(function() {
  var song_list;
  var current_song_data;
  var current_song_index = 0;
  var current_song_past_30 = false;
  
  // Get the audio player.
  var audio_player = document.getElementById('player');

  var stream_song = function(song_id) {
    $.getJSON('/_play', {'song_id': song_id}, function(data) {
      // Set the current song data.
      current_song_data = data;
      current_song_data['song_id'] = song_id;
    });
  }

  var next = function() {
    // Get the next song index.
    current_song_index++;

    if (song_list[current_song_index] !== 'undefined') {
      var current_song_meta = song_list[current_song_index];
      stream_song(current_song_meta.SongID);
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


});
