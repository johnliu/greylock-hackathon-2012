$(document).ready(function() {
  $('button#export').click(function() {

    $.getJSON('http://gamma.firebase.com/bling/rooms/helo/guests.json', function(data) {
      console.log(data); 
      return data;
    });

    //  $.each(data, function(key, val) {
    //    items.push('<li id="' + key + '">' + val + '</li>');
    //  });

    //  $('<ul/>', {
    //    'class': 'my-new-list',
    //    html: items.join('')
    //  }).appendTo('body');
    //});   

    //$.post('_queue_list', function(data){
    //  console.log('test');
    //  console.log(data);
    //});
  });
})
