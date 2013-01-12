var mincer = require("Mincer"),
    mincer_env = new mincer.Environment();

    mincer_env.unregisterPostProcessor('application/javascript', mincer.DebugComments);
    mincer_env.appendPath("src/coffee");

/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: '<json:package.json>',
    meta: {
      banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '<%= pkg.homepage ? "* " + pkg.homepage + "\n" : "" %>'+
        '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
        '*/'
    },
    watch: {
      coffee:{
        files:["**/*.coffee"],
        tasks:"coffeelint mince"
      },
      sass:{
        files:["src/scss/*","examples/stylesheets/scss/*"],
        tasks:"sass"
      }
    },
    uglify: {},
    mince:{
      files:{
        "jfx.coffee":"dist/javascripts/jfx.js"
      }
    },
    sass:{
      dist:{
        files:{
          "dist/stylesheets/jfx.css":"src/scss/jfx.scss",
          "examples/stylesheets/styles.css":"examples/stylesheets/scss/styles.scss"
        }
      }
    },
    coffeelint: {
      app: ['src/*.coffee']
    }
  });

  // Default task.
  grunt.registerTask("mince", "Use mincer to concat files",function(a,b){
    var conf = grunt.config.get("mince"),
        done = this.async(),
        files = conf.files,
        file, dest;
    for(file in files){
      dest = files[file];
      console.log(file, dest, mincer_env.findAsset(file))
      mincer_env.findAsset(file).compile(function(error,asset){
        if(error)
          console.log(error)
        else
          grunt.file.write(dest, asset.toString());
        done()
      });
    }
  });

  grunt.loadNpmTasks('grunt-coffeelint');
  grunt.loadNpmTasks('grunt-sass');
  grunt.registerTask('default', 'coffeelint mince sass watch');

};
