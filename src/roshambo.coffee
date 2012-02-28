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

    # Autosaving

    loadAutosavedData: ->
      html = localStorage.getItem(@config.autosave_key)
      @el.html html

    autosaveData: ->
      html = @el.html()
      localStorage.setItem @config.autosave_key, html

    # Formatting.

    enableBold: ->
      document.execCommand('bold')
      @config.boldButton.addClass('active')
      @isBold = true

    enableItalic: ->
      document.execCommand('italic')
      @config.italicButton.addClass('active')
      @isItalic = true

    disableBold: ->
      document.execCommand('bold')
      @config.boldButton.removeClass('active')
      @isBold = false

    disableItalic: ->
      document.execCommand('italic')
      @config.italicButton.removeClass('active')
      @isItalic = false

    currentStyles: ->
      bold: @isBold
      italic: @isItalic


    # Key events

    handleKeypress: (event) ->
      console.log this.getCursorPosition()

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
        keypress: (event ) => this.handleKeypress()

       @config.boldButton.on 'click', (ev) =>
        if @isBold
         this.disableBold()
        else
          this.enableBold()

       @config.italicButton.on 'click', (ev) =>
         if @isItalic
            this.disableItalic()
          else
            this.enableItalic()



  $.roshambo = (el, key) -> new Roshambo(el, key)

  $.fn.roshambo = (el, key) -> new Roshambo(el, key)