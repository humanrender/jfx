#= require ./effect
class Transition extends Effect      
  # Public Methods
  update_styles: (styles, prefixed, webkit = true, moz = true, ms = true, opera = true) ->
    if prefixed
      for property_name, property_val of styles
        @prefixed_style(property_name, property_val, webkit, moz, ms, opera, styles)
    @element.css styles
    return

  prefixed_style: (name, value, webkit = true, moz = true, ms = true, opera = true, obj = {}) ->
    return if typeof value == "undefined"
    obj["-webkit-"+name] = value if webkit
    obj["-moz-"+name] = value if moz
    obj["-ms-"+name] = value if ms
    obj["-o-"+name] = value if opera
    return obj