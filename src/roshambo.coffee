$ = jQuery

class Roshambo

  # Pass it the root element that will serve as the text editor.
  # Optionally, you can give it an autosave_key which will be used to
  # make backups to local storage.
  #
  # autosave_key defaults to roshambo.

  constructor: (el, autosave_key) -> 
    @el = $(el)
    if @el.length == 0
      console.log("Failed to bind to supplied element.")
      return false        

    this.enableEditing()

    @autoSaveKey ?= "roshambo"
    this.lookupAutosavedData()

    this.setupBindings()

  enableEditing: ->
    @el.attr 'contenteditable', true

  html: -> @el.html()

  focus: ->
    if document.activeElement != @el
      @el.focus()

  toggleBold: ->
    this.focus()
    if document.execCommand 'bold'
      if @isBold
        this.isBold = false
      else
        this.isBold = true

  toggleItalic: ->
    this.focus()
    if document.execCommand 'italic'
      if @isItalic
        @isItalic = false
      else
        @isItalic = true

  insertOrderedList: ->
    this.focus()
    document.execCommand 'insertOrderedList'

  insertUnorderedList: ->
    this.focus()
    document.execCommand 'insertUnorderedList'

  lookupAutosavedData: ->
    autosaved = localStorage.getItem(@autoSaveKey)
    if autosaved
      @el.html(autosaved)

  setupBindings: ->
    @el.on 'keydown', (ev) =>

      # Store the user's data on it's element.
      $el = $(ev.target)
      html = $el.html()
      $el.attr 'data-raw', html

      # Shove it in local storage for autosave.
      localStorage.setItem @autoSaveKey, html

    $('#toolbar button').on 'click', (ev) ->
      $button = $(ev.target)
      $button.toggleClass('active')

    $('#bold').on 'click', (ev) =>
      this.toggleBold()

    $('#italic').on 'click', (ev) =>
      this.toggleItalic()

    $('#ul').on 'click', (ev) =>
      this.insertUnorderedList()    

$.roshambo = (el, key) -> new Roshambo(el, key)

$.fn.roshambo = (el, key) -> new Roshambo(el, key)