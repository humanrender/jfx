#= require_self
#= require_tree ./core
#= require_tree ./fx

JFX = 
  effects:
    end: ->
      return JFX.elements

  register_effect: (name, effect) ->
    @effects[name] = @new_effect_function name, effect

  new_effect_function: (name, effect) ->
    _this = this
    if effect.new_effect_function
      return effect.new_effect_function this, JFX.effects, name, effect
    else
      return (options = {})->
        _this.elements.each ->
          self = $(this)
          if(!(effect_instance = self.data("cfx-"+name)))
            effect_instance = new effect(self)
            self.data("cfx-"+name, effect_instance)
          effect_instance.execute(options)
        return JFX.effects
$.fn.jfx = ->
  JFX.elements = this
  return JFX.effects 