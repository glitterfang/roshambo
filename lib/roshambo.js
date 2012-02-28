(function() {
  var $;

  $ = jQuery;

  $(function() {
    var Roshambo;
    Roshambo = (function() {

      Roshambo.prototype.defaults = {
        boldButton: $('button#bold'),
        italicButton: $('button#italic'),
        should_autosave: false,
        autosave_key: 'roshambo'
      };

      function Roshambo(el, options) {
        this.config = $.extend(this.defaults, options);
        this.el = $(el);
        this.el.attr('contentEditable', true);
        this.isBold = false;
        this.isItalic = false;
        this.textMap = {};
        if (this.config.should_autosave) this.loadAutosavedData();
        this.setupBindings();
      }

      Roshambo.prototype.loadAutosavedData = function() {
        var html;
        html = localStorage.getItem(this.config.autosave_key);
        return this.el.html(html);
      };

      Roshambo.prototype.autosaveData = function() {
        var html;
        html = this.el.html();
        return localStorage.setItem(this.config.autosave_key, html);
      };

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

      Roshambo.prototype.currentStyles = function() {
        return {
          bold: this.isBold,
          italic: this.isItalic
        };
      };

      Roshambo.prototype.handleKeypress = function(event) {
        return console.log(this.getCursorPosition());
      };

      Roshambo.prototype.getCursorPosition = function() {
        var count, el, node_filter, range, treeWalker;
        range = window.getSelection().getRangeAt(0);
        el = this.el[0];
        node_filter = function(node) {
          var nodeRange;
          nodeRange = document.createRange();
          nodeRange.selectNode(node);
          if (nodeRange.compareBoundaryPoints(Range.END_TO_END, range) < 1) {
            return NodeFilter.FILTER_ACCEPT;
          } else {
            return NodeFilter.FILTER_REJECT;
          }
        };
        treeWalker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, node_filter, false);
        count = 0;
        while (treeWalker.nextNode()) {
          count += treeWalker.currentNode.length;
        }
        if (range.startContainer.nodeType === Node.TEXT_NODE) {
          count += range.startOffset;
        }
        return count;
      };

      Roshambo.prototype.setupBindings = function() {
        var _this = this;
        this.el.on({
          keypress: function(event) {
            return _this.handleKeypress();
          }
        });
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

}).call(this);
