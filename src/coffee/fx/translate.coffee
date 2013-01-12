class Translate extends SimpleTransition
  id: "translate"
  properties: ["-webkit-transform"]
  x: null
  y: null
  execute: (options) ->
    super options
    x_change = !isNaN(options.x)
    y_change = !isNaN(options.y)
    if x_change && y_change
      @x = options.x
      @y = options.y
      @update_styles({
        "transform": "translate(#{@x}px, #{@y}px)"
      }, true)
    else if x_change
      if @x != options.x
        @x = options.x
        @update_styles({
          "transform": "translate(#{@x}px)"
        }, true)
    else if y_change
      if @y != options.y
        @y = options.y
        @update_styles({
          "transform": "translate(#{@y}px)"
        }, true)
    return
JFX.register_effect "translate", Translate