$(document).ready(function() { 
  $('button#name-form-submit').click(function() {
    var guests = 1;
    // replace globally
    var name = $('#name').val().replace(/ /g, '_');
    db.child('rooms').child(name).set(guests);
  });
})
