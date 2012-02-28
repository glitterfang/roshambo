$ ->
  $ = jQuery

  class Roshambo
    defaults =
      boldButton: $('button#bold')
      italicButton: $('button#italic')
      should_autosave: false

    constructor: (el, options) ->
      @config = $.extend options, defaults

      @el = $(el)
      @el.attr 'contentEditable', true

      @isBold = false
      @isItalic = false

      this.setupBindings()

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

    setupBindings: ->
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