$ = jQuery

$ ->
  class Roshambo
    defaults:
      boldButton: $('button#bold')
      italicButton: $('button#italic')
      should_autosave: false
      autosave_key: 'roshambo'

    constructor: (el, options) ->
      @config = $.extend @defaults, options

      @el = $(el)
      @el.attr 'contentEditable', true

      @isBold = false
      @isItalic = false

      @textMap = {}

      if @config.should_autosave
        this.loadAutosavedData()

      this.setupBindings()

    focus: -> @el.focus()

    # Autosaving

    loadAutosavedData: ->
      html = localStorage.getItem(@config.autosave_key)
      @el.html html

    autosaveData: ->
      html = @el.html()
      localStorage.setItem @config.autosave_key, html

    # Formatting.

    highlightBoldButton: ->
      @config.boldButton.addClass('active')

    enableBold: ->
      if not @isBold
        document.execCommand('bold')
      this.highlightBoldButton()
      @isBold = true

    enableItalic: ->
      if not @isItalic
        document.execCommand('italic')
      @config.italicButton.addClass('active')
      @isItalic = true

    disableBold: ->
      if @isBold
        document.execCommand('bold')
        @config.boldButton.removeClass('active')
        @isBold = false

    disableItalic: ->
      if @isItalic
        document.execCommand('italic')
      @config.italicButton.removeClass('active')
      @isItalic = false

    currentStyles: ->
      bold: @isBold
      italic: @isItalic


    currentTag: (point) ->
      sel = window.getSelection()
      tag = sel.baseNode.parentNode.tagName

    # Key events

    # if the user is typing, then the user's current styles take precendence.
    # if the user is navigating with the arrow keys, then archived styles take precedence.

    handleKeypress: (event) ->
      pos = this.getCursorPosition()
      tag = this.currentTag()
      sel = window.getSelection()

      handle_tag = (tag) =>
        if tag != 'DIV'
          if tag is 'B'
            if not @isBold
              this.enableBold()
          if tag is 'I'
            if not @isItalic
              this.enableItalic()
        else
          this.disableBold()
          this.disableItalic()

      parentTag = sel.baseNode.parentNode.parentNode.tagName
      if parentTag is 'B' or parentTag is 'I'
        handle_tag(parentTag)

      handle_tag(tag)

    # Original javascript version:
    # http://stackoverflow.com/questions/4767848/get-caret-cursor-position-in-contenteditable-area-containing-html-content
    #
    # translated to coffeescript with a few tweaks.

    getCursorPosition: ->
      range = window.getSelection().getRangeAt(0)

      # this.el is a jQuery object so pull out the raw dom object
      el = this.el[0]

      # filter function that tree walker uses to qualify a node.
      node_filter = (node) ->
        nodeRange = document.createRange()
        nodeRange.selectNode(node)
        if nodeRange.compareBoundaryPoints(Range.END_TO_END, range) < 1
          NodeFilter.FILTER_ACCEPT
        else
          NodeFilter.FILTER_REJECT

      treeWalker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, node_filter, false)

      count = 0

      while treeWalker.nextNode()
        count += treeWalker.currentNode.length

      # 3 is the text mode.
      if range.startContainer.nodeType == Node.TEXT_NODE
        count += range.startOffset

      count

    setupBindings: ->
      @el.on
        keypress: (event) =>
          # this.handleKeypress(event)
        keyup: (event) =>
          this.handleKeypress(event)

       @config.boldButton.on 'click', (ev) =>
        this.focus()
        if @isBold
         this.disableBold()
        else
          this.enableBold()

       @config.italicButton.on 'click', (ev) =>
         this.focus()
         if @isItalic
            this.disableItalic()
          else
            this.enableItalic()



  $.roshambo = (el, key) -> new Roshambo(el, key)

  $.fn.roshambo = (el, key) -> new Roshambo(el, key)