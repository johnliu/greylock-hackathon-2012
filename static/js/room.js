$('.queue a.song-link').tooltip({delay:{show:500, hide:10}, placement:'top'})

$('#search-box').keypress(function (e) {
  if (e.keyCode == 13) {
    $('.nav-pills li').removeClass('active');
    $('.content-box .tab-pane').removeClass('active');
    $('#search-result-tab').addClass('active');
    $('#search-result-content').addClass('active');
  }
});

$('.nav-pills li a').click(function (e) {
  $('.nav-pills li').removeClass('active');
  $('.content-box .tab-pane').removeClass('active');
  $(this).addClass('active');
  $(this.getAttribute('href')).addClass('active');
  e.preventDefault();
});

$('.control-buttons a').click(function (e) {
  if ($(this).find('i').hasClass('icon-play')) {
    $(this).find('i').removeClass('icon-play').addClass('icon-pause');
  }
  else if ($(this).find('i').hasClass('icon-pause')) {
    $(this).find('i').removeClass('icon-pause').addClass('icon-play');
  }
});
