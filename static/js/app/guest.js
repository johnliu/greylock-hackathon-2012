$(document).ready(function() {
  // create guest
  var room = window.location.pathname.split('/')[1];
  var guests = ['guest_' + Math.round(Math.random() * 1000)];
  db.child('rooms').child(room).child('guests').set(guests);

  db.child('rooms').child(room).on('child_added', function(snapshot) {
    //if (snapshot.val().guests === null) guests = [];
    //else guests = new Array(snapshot.val().guests);
    console.log(guests);
    guests.concat(snapshot.val().guests);
    console.log(guests);
  });

  guests.push(name);
  db.child('rooms').child(room).child('guests').set(name);
});
