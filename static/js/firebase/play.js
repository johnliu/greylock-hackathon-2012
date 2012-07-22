var i = 0;
var song_list = [24925833, 33123639];
//var song_list = [
  //'/static/test/02.mp3',
  //'/static/test/04.mp3',
  //'/static/test/03.mp3',
  //'/static/test/01.mp3',
  //'/static/test/05.mp3'
//];


$(document).ready(function() {
  var song_data;

  var play_song = function(song_id) {
    $.getJSON('/_play', {'song_id': song_id}, function(data) {
      song_data = data;

      var audioPlayer = document.getElementById('player');
      audioPlayer.src = song_data.url;
      console.log('playing ' + song_id);
    });
  }

  var audioPlayer = document.getElementById('player');

  audioPlayer.addEventListener('ended', function() {
    // Send callback to grooveshark.
    console.log('Sent song complete.');
    past_30 = false;
    $.post('/_complete', song_data);

    i = (i + 1) % song_list.length;
    play_song(song_list[i]);
  });

  audioPlayer.addEventListener('timeupdate', function() {
    // Send callback to GS.
    if (audioPlayer.currentTime > 30 && !past_30) {
      console.log('Marked over 30');
      past_30 = true;
      $.post('/_over_30', song_data);
    } else {
      console.log(audioPlayer.currentTime);
    }
  });

  var past_30 = false;
  play_song(song_list[i]);
});
