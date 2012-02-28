$ ->
  $ = jQuery

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
      console.log("Cursor now at #{this.getCursorPosition()}")

    getCursorPosition: ->
      sel = window.getSelection()
      sel.getRangeAt().startOffset

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