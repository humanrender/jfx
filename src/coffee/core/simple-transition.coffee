#= require ./transition
class SimpleTransition extends Transition
  properties: null
  init_events: ->
    @element.on("webkitTransitionEnd", @on_transition_end)
    return
  on_transition_end: (event) =>
    property = event.originalEvent.propertyName
    if(@properties.indexOf(property) != -1)
      @element.trigger $.Event("jfx-#{@id}end", {property:property, effect:@id})
    return

  # Public Methods
  execute: (options) ->
    @element.removeAttr("style")
    styles = {}
    styles["transition-duration"] = "#{options.duration}s" if options.duration
    styles["transition-delay"] = "#{options.delay}s" if options.duration
    styles["transition-timing-function"] = options.ease if options.duration
    @update_styles(styles, true)
    return