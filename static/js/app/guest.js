$(document).ready(function() {
  // Get the current room name.
  var room = window.location.pathname.split('/')[1];

  // Create guests global reference and other database related stuff.
  var guests_db = db.child('rooms').child(room).child('guests');
  var guests_list;
  
  var post_load = setInterval(function() {
    if (typeof guests_list !== 'undefined' && guests_list != null) {
      // Add the user as a guest to the room.
      guests_list.push('Guest ' + Math.round(Math.random() * 1000));
      guests_db.set(guests_list);
      clearInterval(post_load);
    }
  }, 1000);
  
  guests_db.on('value', function(snapshot) {
    guests_list = snapshot.val();
    if (guests_list == null) {
      guests_list = [];
    }

    $('#guest-list').empty();
    // Loop through the entire list and put out the guest list.
    $.each(guests_list, function(i, element) {
      $('#guest-list').append('<li>' + element + '</li>');
    });
  });
});
