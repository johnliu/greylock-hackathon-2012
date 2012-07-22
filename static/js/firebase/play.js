var i = 0;
var song_list = [24925833, 33123639];


$(document).ready(function() {
  var song_data;

  var play_song = function(song_id) {
    $.getJSON('/_play', {'song_id': song_id}, function(data) {
      song_data = data;

      var audioPlayer = document.getElementById('player');
      audioPlayer.src = song_data.url;
      audioPlayer.load();
      audioPlayer.play();

      audioPlayer.addEventListener('ended', function() {
        // Send callback to grooveshark.
        console.log('Sent song complete.');
        past_30 = false;
        $.post('/_complete', song_data);

        play_song(song_list[++i]);
      });

      audioPlayer.addEventListener('timeupdate', function() {
        // Send callback to GS.
        if (audioPlayer.currentTime > 30 && !past_30) {
          console.log('Marked over 30');
          past_30 = true;
          $.post('/_over_30', song_data);
        }
      });
    });
  }

  var past_30 = false;
  play_song(song_list[i]);
})
