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

      Roshambo.prototype.focus = function() {
        return this.el.focus();
      };

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

      Roshambo.prototype.highlightBoldButton = function() {
        return this.config.boldButton.addClass('active');
      };

      Roshambo.prototype.enableBold = function() {
        if (!this.isBold) document.execCommand('bold');
        this.highlightBoldButton();
        return this.isBold = true;
      };

      Roshambo.prototype.enableItalic = function() {
        if (!this.isItalic) document.execCommand('italic');
        this.config.italicButton.addClass('active');
        return this.isItalic = true;
      };

      Roshambo.prototype.disableBold = function() {
        if (this.isBold) {
          document.execCommand('bold');
          this.config.boldButton.removeClass('active');
          return this.isBold = false;
        }
      };

      Roshambo.prototype.disableItalic = function() {
        if (this.isItalic) document.execCommand('italic');
        this.config.italicButton.removeClass('active');
        return this.isItalic = false;
      };

      Roshambo.prototype.currentStyles = function() {
        return {
          bold: this.isBold,
          italic: this.isItalic
        };
      };

      Roshambo.prototype.currentTag = function(point) {
        var sel, tag;
        sel = window.getSelection();
        return tag = sel.baseNode.parentNode.tagName;
      };

      Roshambo.prototype.handleKeypress = function(event) {
        var handle_tag, parentTag, pos, sel, tag,
          _this = this;
        pos = this.getCursorPosition();
        tag = this.currentTag();
        sel = window.getSelection();
        handle_tag = function(tag) {
          if (tag === 'B' || tag === 'I' || tag === 'DIV') {
            if (tag === 'B') if (!_this.isBold) _this.enableBold();
            if (tag === 'I') if (!_this.isItalic) return _this.enableItalic();
          } else {
            _this.disableBold();
            return _this.disableItalic();
          }
        };
        parentTag = sel.baseNode.parentNode.parentNode.tagName;
        if (parentTag === 'B' || parentTag === 'I') {
          console.log("Handling parent tag");
          handle_tag(parentTag);
        }
        return handle_tag(tag);
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

      Roshambo.prototype.handleShortcuts = function(event) {
        if (event.metaKey && event.which === 66) {
          if (this.isBold) {
            return this.disableBold();
          } else {
            return this.enableBold();
          }
        } else {
          return false;
        }
      };

      Roshambo.prototype.setupBindings = function() {
        var _this = this;
        this.el.on({
          keydown: function(event) {
            if (!_this.handleShortcuts(event)) _this.handleKeypress(event);
            return true;
          }
        });
        this.config.boldButton.on('click', function(ev) {
          _this.focus();
          if (_this.isBold) {
            return _this.disableBold();
          } else {
            return _this.enableBold();
          }
        });
        return this.config.italicButton.on('click', function(ev) {
          _this.focus();
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
