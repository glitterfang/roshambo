(function() {
  var $, Roshambo;

  $ = jQuery;

  Roshambo = (function() {

    function Roshambo(el, autosave_key) {
      var _ref;
      this.el = $(el);
      if (this.el.length === 0) {
        console.log("Failed to bind to supplied element.");
        return false;
      }
      this.enableEditing();
      if ((_ref = this.autoSaveKey) == null) this.autoSaveKey = "roshambo";
      this.lookupAutosavedData();
      this.setupBindings();
    }

    Roshambo.prototype.enableEditing = function() {
      return this.el.attr('contenteditable', true);
    };

    Roshambo.prototype.html = function() {
      return this.el.html();
    };

    Roshambo.prototype.focus = function() {
      if (document.activeElement !== this.el) return this.el.focus();
    };

    Roshambo.prototype.toggleBold = function() {
      this.focus();
      if (document.execCommand('bold')) {
        if (this.isBold) {
          return this.isBold = false;
        } else {
          return this.isBold = true;
        }
      }
    };

    Roshambo.prototype.toggleItalic = function() {
      this.focus();
      if (document.execCommand('italic')) {
        if (this.isItalic) {
          return this.isItalic = false;
        } else {
          return this.isItalic = true;
        }
      }
    };

    Roshambo.prototype.insertOrderedList = function() {
      this.focus();
      return document.execCommand('insertOrderedList');
    };

    Roshambo.prototype.insertUnorderedList = function() {
      this.focus();
      return document.execCommand('insertUnorderedList');
    };

    Roshambo.prototype.lookupAutosavedData = function() {
      var autosaved;
      autosaved = localStorage.getItem(this.autoSaveKey);
      if (autosaved) return this.el.html(autosaved);
    };

    Roshambo.prototype.setupBindings = function() {
      var _this = this;
      this.el.on('keydown', function(ev) {
        var $el, html;
        $el = $(ev.target);
        html = $el.html();
        $el.attr('data-raw', html);
        return localStorage.setItem(_this.autoSaveKey, html);
      });
      $('#toolbar button').on('click', function(ev) {
        var $button;
        $button = $(ev.target);
        return $button.toggleClass('active');
      });
      $('#bold').on('click', function(ev) {
        return _this.toggleBold();
      });
      $('#italic').on('click', function(ev) {
        return _this.toggleItalic();
      });
      return $('#ul').on('click', function(ev) {
        return _this.insertUnorderedList();
      });
    };

    return Roshambo;

  })();

  $.roshambo = function(el, key) {
    return new Roshambo(el, key);
  };

  $.fn.roshambo = function(el, key) {
    return new Roshambo(el, key);
  };

}).call(this);
