# roshambo - a tiny rich-text edtior.

Roshambo aims to provide a beautiful design by default and the simplest 
usage as possible.

*Dependencies:*

- jQuery
- Backbone

*Installation:*

- Load roshambo.js and roshambo.css in your page.


  // latch onto a <textarea> in the DOMn.
  var $editor = $.roshambo('textarea')

  $editor.bind('submit', function(data) {
    // Play with the user's text.
  }

*Ideally it will provide interesting events that you can listen for.*


*Browser Support:*

I have no idea right now.