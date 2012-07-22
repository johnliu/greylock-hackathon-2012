$(document).ready(function() {
  $('button#name-form-submit').click(function() {
    var guests = 1;
    var name = $('#name').val();
    db.child('rooms').child(name).set(guests);
  });
})
