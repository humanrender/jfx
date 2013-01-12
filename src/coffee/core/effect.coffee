class Effect
  id: null
  constructor: (element) ->
    @element = element
    @init()
  init: ->
    @init_styles()
    @init_events()
    return
  init_styles: ->
    @element.addClass(if @css_class then @css_class else "jfx-#{@id}")
    return
  init_events: ->
    return
  defer: (fn) -> # Defer function, useful when waiting for styles to apply
    setTimeout((=>
      fn.call(this)
    ),0)
  execute: ->
    throw "Use a subinstance of Effect"
    return