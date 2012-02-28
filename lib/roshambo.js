
  $(function() {
    var $, Roshambo;
    $ = jQuery;
    Roshambo = (function() {
      var defaults;

      defaults = {
        boldButton: $('button#bold'),
        italicButton: $('button#italic'),
        should_autosave: false
      };

      function Roshambo(el, options) {
        this.config = $.extend(options, defaults);
        this.el = $(el);
        this.el.attr('contentEditable', true);
        this.isBold = false;
        this.isItalic = false;
        this.setupBindings();
      }

      Roshambo.prototype.enableBold = function() {
        document.execCommand('bold');
        this.config.boldButton.addClass('active');
        return this.isBold = true;
      };

      Roshambo.prototype.enableItalic = function() {
        document.execCommand('italic');
        this.config.italicButton.addClass('active');
        return this.isItalic = true;
      };

      Roshambo.prototype.disableBold = function() {
        document.execCommand('bold');
        this.config.boldButton.removeClass('active');
        return this.isBold = false;
      };

      Roshambo.prototype.disableItalic = function() {
        document.execCommand('italic');
        this.config.italicButton.removeClass('active');
        return this.isItalic = false;
      };

      Roshambo.prototype.setupBindings = function() {
        var _this = this;
        this.config.boldButton.on('click', function(ev) {
          if (_this.isBold) {
            return _this.disableBold();
          } else {
            return _this.enableBold();
          }
        });
        return this.config.italicButton.on('click', function(ev) {
          if (_this.isItalic) {
            return _this.disableItalic();
          } else {
            return _this.enableItalic();
          }
        });
      };

      return Roshambo;

    })();
    $.roshambo = function(el, key) {
      return new Roshambo(el, key);
    };
    return $.fn.roshambo = function(el, key) {
      return new Roshambo(el, key);
    };
  });
