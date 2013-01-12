class Fade extends SimpleTransition
  id: "fade"
  properties: ["opacity"]
  execute: (options) ->
    super options
    state = options.state || "in"
    class_name = "jfx-fade-#{state}"
    return if @element.is ".#{class_name}"
    @state = state
    if @element.is(":hidden") && state == "in"
      @element.css("display","block")
    @defer ->
      @element
        .addClass(class_name)
        .removeClass("jfx-fade-#{if state == "in" then "out" else "in"}")
    return
    
  on_transition_end: (event) ->
    if @properties.indexOf(event.originalEvent.propertyName) != 1
      if @element.is(".jfx-fade-out")
        @element.css("display", "none")
    super event

JFX.register_effect "fade", Fade