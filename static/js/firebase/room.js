// add new guest for each page landing

$(document).ready(function() {
  var room = window.location.pathname;
  //db.child('rooms').child(room).child('guests').child(guest_name

  var search_handler = function() {
    var search = $("input#search-box").val();
    $.post(window.location.pathname, {'search_query': search}, function(data) {
      //$('.result').html(data);
      alert(data);
    });
    return false;
  }

  $('#search-form').submit(search_handler);

})

