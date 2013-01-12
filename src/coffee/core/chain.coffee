#= require ./effect
class Chain extends Effect
  init_styles: ->
    return
  execute: ->
  end: ->
    @_end

Chain.new_effect_function = (context, end, name, effect)->
  Chain._end = end
  return (options = {})->
    throw "Each chain must have a unique id" if !options.id
    self = $(this)
    id = "cfx-"+name+options.id
    chain = new effect(self, options)
    self.data id, chain
    return chain


JFX.register_effect "chain", Chain