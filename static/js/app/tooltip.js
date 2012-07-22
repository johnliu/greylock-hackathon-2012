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
