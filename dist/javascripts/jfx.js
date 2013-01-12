var JFX;

JFX = {
  effects: {
    end: function() {
      return JFX.elements;
    }
  },
  register_effect: function(name, effect) {
    return this.effects[name] = this.new_effect_function(name, effect);
  },
  new_effect_function: function(name, effect) {
    var _this;
    _this = this;
    if (effect.new_effect_function) {
      return effect.new_effect_function(this, JFX.effects, name, effect);
    } else {
      return function(options) {
        if (options == null) {
          options = {};
        }
        _this.elements.each(function() {
          var effect_instance, self;
          self = $(this);
          if (!(effect_instance = self.data("cfx-" + name))) {
            effect_instance = new effect(self);
            self.data("cfx-" + name, effect_instance);
          }
          return effect_instance.execute(options);
        });
        return JFX.effects;
      };
    }
  }
};

$.fn.jfx = function() {
  JFX.elements = this;
  return JFX.effects;
};
var Effect;

Effect = (function() {

  Effect.prototype.id = null;

  function Effect(element) {
    this.element = element;
    this.init();
  }

  Effect.prototype.init = function() {
    this.init_styles();
    this.init_events();
  };

  Effect.prototype.init_styles = function() {
    this.element.addClass(this.css_class ? this.css_class : "jfx-" + this.id);
  };

  Effect.prototype.init_events = function() {};

  Effect.prototype.defer = function(fn) {
    var _this = this;
    return setTimeout((function() {
      return fn.call(_this);
    }), 0);
  };

  Effect.prototype.execute = function() {
    throw "Use a subinstance of Effect";
  };

  return Effect;

})();
var Chain,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Chain = (function(_super) {

  __extends(Chain, _super);

  function Chain() {
    return Chain.__super__.constructor.apply(this, arguments);
  }

  Chain.prototype.init_styles = function() {};

  Chain.prototype.execute = function() {};

  Chain.prototype.end = function() {
    return this._end;
  };

  return Chain;

})(Effect);

Chain.new_effect_function = function(context, end, name, effect) {
  Chain._end = end;
  return function(options) {
    var chain, id, self;
    if (options == null) {
      options = {};
    }
    if (!options.id) {
      throw "Each chain must have a unique id";
    }
    self = $(this);
    id = "cfx-" + name + options.id;
    chain = new effect(self, options);
    self.data(id, chain);
    return chain;
  };
};

JFX.register_effect("chain", Chain);
var Transition,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Transition = (function(_super) {

  __extends(Transition, _super);

  function Transition() {
    return Transition.__super__.constructor.apply(this, arguments);
  }

  Transition.prototype.update_styles = function(styles, prefixed, webkit, moz, ms, opera) {
    var property_name, property_val;
    if (webkit == null) {
      webkit = true;
    }
    if (moz == null) {
      moz = true;
    }
    if (ms == null) {
      ms = true;
    }
    if (opera == null) {
      opera = true;
    }
    if (prefixed) {
      for (property_name in styles) {
        property_val = styles[property_name];
        this.prefixed_style(property_name, property_val, webkit, moz, ms, opera, styles);
      }
    }
    this.element.css(styles);
  };

  Transition.prototype.prefixed_style = function(name, value, webkit, moz, ms, opera, obj) {
    if (webkit == null) {
      webkit = true;
    }
    if (moz == null) {
      moz = true;
    }
    if (ms == null) {
      ms = true;
    }
    if (opera == null) {
      opera = true;
    }
    if (obj == null) {
      obj = {};
    }
    if (typeof value === "undefined") {
      return;
    }
    if (webkit) {
      obj["-webkit-" + name] = value;
    }
    if (moz) {
      obj["-moz-" + name] = value;
    }
    if (ms) {
      obj["-ms-" + name] = value;
    }
    if (opera) {
      obj["-o-" + name] = value;
    }
    return obj;
  };

  return Transition;

})(Effect);
var SimpleTransition,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

SimpleTransition = (function(_super) {

  __extends(SimpleTransition, _super);

  function SimpleTransition() {
    this.on_transition_end = __bind(this.on_transition_end, this);
    return SimpleTransition.__super__.constructor.apply(this, arguments);
  }

  SimpleTransition.prototype.properties = null;

  SimpleTransition.prototype.init_events = function() {
    this.element.on("webkitTransitionEnd", this.on_transition_end);
  };

  SimpleTransition.prototype.on_transition_end = function(event) {
    var property;
    property = event.originalEvent.propertyName;
    if (this.properties.indexOf(property) !== -1) {
      this.element.trigger($.Event("jfx-" + this.id + "end", {
        property: property,
        effect: this.id
      }));
    }
  };

  SimpleTransition.prototype.execute = function(options) {
    var styles;
    this.element.removeAttr("style");
    styles = {};
    if (options.duration) {
      styles["transition-duration"] = "" + options.duration + "s";
    }
    if (options.duration) {
      styles["transition-delay"] = "" + options.delay + "s";
    }
    if (options.duration) {
      styles["transition-timing-function"] = options.ease;
    }
    this.update_styles(styles, true);
  };

  return SimpleTransition;

})(Transition);
var Fade,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Fade = (function(_super) {

  __extends(Fade, _super);

  function Fade() {
    return Fade.__super__.constructor.apply(this, arguments);
  }

  Fade.prototype.id = "fade";

  Fade.prototype.properties = ["opacity"];

  Fade.prototype.execute = function(options) {
    var class_name, state;
    Fade.__super__.execute.call(this, options);
    state = options.state || "in";
    class_name = "jfx-fade-" + state;
    if (this.element.is("." + class_name)) {
      return;
    }
    this.state = state;
    if (this.element.is(":hidden") && state === "in") {
      this.element.css("display", "block");
    }
    this.defer(function() {
      return this.element.addClass(class_name).removeClass("jfx-fade-" + (state === "in" ? "out" : "in"));
    });
  };

  Fade.prototype.on_transition_end = function(event) {
    if (this.properties.indexOf(event.originalEvent.propertyName) !== 1) {
      if (this.element.is(".jfx-fade-out")) {
        this.element.css("display", "none");
      }
    }
    return Fade.__super__.on_transition_end.call(this, event);
  };

  return Fade;

})(SimpleTransition);

JFX.register_effect("fade", Fade);
var Translate,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Translate = (function(_super) {

  __extends(Translate, _super);

  function Translate() {
    return Translate.__super__.constructor.apply(this, arguments);
  }

  Translate.prototype.id = "translate";

  Translate.prototype.properties = ["-webkit-transform"];

  Translate.prototype.x = null;

  Translate.prototype.y = null;

  Translate.prototype.execute = function(options) {
    var x_change, y_change;
    Translate.__super__.execute.call(this, options);
    x_change = !isNaN(options.x);
    y_change = !isNaN(options.y);
    if (x_change && y_change) {
      this.x = options.x;
      this.y = options.y;
      this.update_styles({
        "transform": "translate(" + this.x + "px, " + this.y + "px)"
      }, true);
    } else if (x_change) {
      if (this.x !== options.x) {
        this.x = options.x;
        this.update_styles({
          "transform": "translate(" + this.x + "px)"
        }, true);
      }
    } else if (y_change) {
      if (this.y !== options.y) {
        this.y = options.y;
        this.update_styles({
          "transform": "translate(" + this.y + "px)"
        }, true);
      }
    }
  };

  return Translate;

})(SimpleTransition);

JFX.register_effect("translate", Translate);
