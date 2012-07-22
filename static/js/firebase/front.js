$(document).ready(function() { 
  $('button#name-form-submit').click(function() {
    var guest = 'guest_' + Math.round(Math.random() * 1000);
    var name = $('#name').val().replace(/ /g, '_');
    //db.child('rooms').child(name).child('guests').set(guest);
  });
})

