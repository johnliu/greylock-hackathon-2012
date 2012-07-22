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
  if ($(this).firstChild.hasClass('icon-play')) {
    $(this).firstChild.removeClass('icon-play').addClass('icon-pause');
  }
  if ($(this).firstChild.hasClass('icon-pause')) {
    $(this).firstChild.removeClass('icon-pause').addClass('icon-play');
  }
});
