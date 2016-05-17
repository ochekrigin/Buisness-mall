// Generated on 2015-10-14 using generator-sliceart 2.0.0
'use strict';

module.exports = function (grunt) {

  var bowerJSON = grunt.file.readJSON('bower.json'),
    bowerFolder = 'bower_components/';

  function copyBowerFiles(fileType, target, returnArr, uglify) {
    'use strict';

    var mainPaths = [],
      plgBowerObj = {},
      postfix = '',
      result = [],
      i,
      j,
      destString = '',
      plgName = '',
      tempObj = {},
      folder = '',
      regExpParam = {
        'js': /\.js$/,
        'css': /\.css$/,
        'images': /(\.(png|jpg|jpeg|gif|svg|ico|cur)$)|((\.\{)+((png|jpg|jpeg|gif|svg|ico|cur)+\})$)/,
        'other': /\w/
      },
      renameFunc = function (dest, src) { // add .min.js for all css and js files
        src = src.replace('.src.', '.');
        return dest + (new RegExp('\\.min\\.' + fileType + '$').test(src) ? src : src.replace('.' + fileType, '.min.' + fileType));
      };
    // setup variables
    fileType = (typeof fileType === 'string' && /^(css|js|images|other)/.test(fileType)) ? fileType : 'js';
    target = (typeof target === 'string' && /^(markup|build|default)/.test(target)) ? target : 'markup';
    returnArr = returnArr ? true : false;
    uglify = uglify ? true : false;
    folder = target === 'build' ? '<%=config.build.folder%>' : '<%=config.markup.folder%>';
    // start
    for (plgName in bowerJSON.dependencies) {
      if (bowerJSON.dependencies.hasOwnProperty(plgName)) {
        if (grunt.file.exists(bowerFolder + plgName + '/bower.json') && !(bowerJSON.files[plgName] && bowerJSON.files[plgName][fileType])) { // plugin bower exist and project bower files, for this plugin, is empty
          plgBowerObj = grunt.file.readJSON(bowerFolder + plgName + '/bower.json');
          if (plgBowerObj.hasOwnProperty('main')) {
            mainPaths = plgBowerObj.main; // get main path(s) from bower json
            if (typeof mainPaths === 'string') { // check string or array
              mainPaths = [mainPaths]; // transform main path to array
            }
            if (fileType === 'js' || fileType === 'css') { // only css and js file types
              if (returnArr) { // setup result array. return type is array with path(s)
                for (i = 0; i < mainPaths.length; i++) {
                  if (regExpParam[fileType].test(mainPaths[i]) && plgName !== 'respond') {
                    // setup result array
                    result.push(bowerFolder + plgName + '/' + mainPaths[i]);
                  }
                }
              } else if (plgName !== 'respond') { // setup result array. return type is array with object(s)
                switch (target) {
                case 'build':
                case 'markup': // setup result array for BUILD and MARKUP version
                  for (i = 0; i < mainPaths.length; i++) {
                    if (regExpParam[fileType].test(mainPaths[i])) {
                      postfix = '';
                      if (/\b/.test(mainPaths[i]) && !returnArr) { // get clear file and postfix file
                        if (mainPaths[i].lastIndexOf('/') !== -1) {
                          postfix = mainPaths[i].slice(0, mainPaths[i].lastIndexOf('/'));
                        }
                        mainPaths[i] = mainPaths[i].slice(mainPaths[i].lastIndexOf('/') + 1, mainPaths[i].length);
                      }
                      if (fileType === 'js') {
                        destString = folder + (target === 'markup' ? '<%=config.dev.js.plgFolder%>' : '<%=config.dev.js.folder%>');
                      } else {
                        destString = folder + '<%=config.dev.css.folder%>';
                      }
                      tempObj = {
                        expand: true,
                        cwd: bowerFolder + plgName + '/' + postfix,
                        src: mainPaths[i],
                        dest: destString
                      };
                      if (uglify) {
                        tempObj.rename = renameFunc;
                      }
                      // setup result array
                      result.push(tempObj);
                    }
                  }
                  break;
                default:
                  result = [];
                }
              }
            }
          }
        } else if (grunt.file.isDir(bowerFolder + plgName) && bowerJSON.files[plgName] && bowerJSON.files[plgName][fileType]) { // plugin bower not exist, but we have folder and files path(s)
          tempObj = bowerJSON.files[plgName][fileType];
          if (!(tempObj instanceof Array)) { // check array or object
            tempObj = [tempObj];
          }
          if (returnArr) { // setup result array. return type is array with path(s)
            for (i = 0; i < tempObj.length; i++) {
              var innerTempObj = tempObj[i];
              if (typeof innerTempObj.paths === 'string') { // check string or array
                innerTempObj.paths = [innerTempObj.paths];
              }
              for (j = 0; j < innerTempObj.paths.length; j++) {
                if (regExpParam[fileType].test(innerTempObj.paths[j]) && plgName !== 'respond') {
                  // setup result array
                  result.push(bowerFolder + plgName + '/' + innerTempObj.cwd + innerTempObj.paths[j]);
                }
              }
            }
          } else if (plgName !== 'respond') { // setup result array. return type is array with object(s)
            switch (target) {
            case 'build': // setup result array for BUILD version
            case 'markup': // setup result array for MARKUP version
              for (i = 0; i < tempObj.length; i++) {
                var innerTempObj = tempObj[i];
                mainPaths = [];
                if (typeof innerTempObj.paths === 'string') { // check string or array
                  innerTempObj.paths = [innerTempObj.paths];
                }
                for (j = 0; j < innerTempObj.paths.length; j++) {
                  if (regExpParam[fileType].test(innerTempObj.paths[j])) {
                    mainPaths.push(innerTempObj.paths[j]);
                  }
                }
                innerTempObj.dest = innerTempObj.dest || '';
                destString = folder + (target === 'build' ? '' : (fileType === 'js' && !innerTempObj.dest ? '<%=config.dev.js.plgFolder%>' : '')) + innerTempObj.dest;
                innerTempObj = {
                  expand: true,
                  cwd: bowerFolder + plgName + '/' + innerTempObj.cwd,
                  src: mainPaths,
                  dest: destString
                };
                if (uglify && /^(css|js)/.test(fileType)) {
                  innerTempObj.rename = renameFunc;
                }
                // setup result array
                result.push(innerTempObj);
              }
              break;
            default:
              result = [];
            }
          }
        } else if (!grunt.file.isDir(bowerFolder + plgName)) { // plugin is not install
          grunt.fail.warn('Please run "bower install ' + plgName + '" or "bower update".');
        } else {
          // grunt.fail.warn('Please check yours bower.json');
        }
      }
    }

    return result;
  }

  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    config: {
      dev: {
        folder: 'app/',
        css: {
          folder: 'css/',
          files: '{,**/}*.css',
          pathToFolder: '<%=config.dev.folder%><%=config.dev.css.folder%>',
          pathToFiles: '<%=config.dev.css.pathToFolder%><%=config.dev.css.files%>'
        },
        sass: {
          folder: 'sass/',
          files: '{,**/}*.{scss,sass}',
          pathToFolder: '<%=config.dev.folder%><%=config.dev.sass.folder%>',
          pathToFiles: '<%=config.dev.sass.pathToFolder%><%=config.dev.sass.files%>'
        },
        less: {
          folder: 'less/',
          files: '{,**/}*.less',
          pathToFolder: '<%=config.dev.folder%><%=config.dev.less.folder%>',
          pathToFiles: '<%=config.dev.less.pathToFolder%><%=config.dev.less.files%>'
        },
        js: {
          folder: 'js/',
          plgFolder: '<%=config.dev.js.folder%>plugins/',
          files: '{,**/}*.js',
          ourFiles: '*.js',
          pathToFolder: '<%=config.dev.folder%><%=config.dev.js.folder%>',
          pathToFiles: '<%=config.dev.js.pathToFolder%><%=config.dev.js.files%>',
          ourPathToFolder: '<%=config.dev.folder%><%=config.dev.js.folder%>',
          ourPathToFiles: '<%=config.dev.js.ourPathToFolder%><%=config.dev.js.ourFiles%>'
        },
        images: {
          folder: 'images/',
          files: '{,**/}*.{gif,jpeg,jpg,png,ico,cur}',
          pathToFolder: '<%=config.dev.folder%><%=config.dev.images.folder%>',
          pathToFiles: '<%=config.dev.images.pathToFolder%><%=config.dev.images.files%>'
        },
        fonts: {
          folder: 'fonts/',
          files: '{,**/}*.{woff,eot,ttf,svg}',
          pathToFolder: '<%=config.dev.folder%><%=config.dev.fonts.folder%>',
          pathToFiles: '<%=config.dev.fonts.pathToFolder%><%=config.dev.fonts.files%>'
        },
        html: {
          folder: '',
          files: '{,**/}*.html',
          pathToFolder: '<%=config.dev.folder%><%=config.dev.html.folder%>',
          pathToFiles: '<%=config.dev.html.pathToFolder%><%=config.dev.html.files%>'
        },
        jade: {
          folder: 'jade/',
          files: '{,**/}*.jade',
          pathToFolder: '<%=config.dev.folder%><%=config.dev.jade.folder%>',
          pathToFiles: '<%=config.dev.jade.pathToFolder%><%=config.dev.jade.files%>'
        }
      },
      markup: {
        folder: 'markup/',
        css: {
          folder: 'css/',
          files: '{,**/}*.css',
          pathToFolder: '<%=config.markup.folder%><%=config.markup.css.folder%>',
          pathToFiles: '<%=config.markup.css.pathToFolder%><%=config.markup.css.files%>'
        },
        sass: {
          folder: 'sass/',
          files: '{,**/}*.{scss,sass}',
          pathToFolder: '<%=config.markup.folder%><%=config.markup.sass.folder%>',
          pathToFiles: '<%=config.markup.sass.pathToFolder%><%=config.markup.sass.files%>'
        },
        js: {
          folder: 'js/',
          plgFolder: '<%=config.markup.js.folder%>plugins/',
          files: '{,**/}*.js',
          ourFiles: '*.js',
          pathToFolder: '<%=config.markup.folder%><%=config.markup.js.folder%>',
          pathToFiles: '<%=config.markup.js.pathToFolder%><%=config.markup.js.files%>',
          ourPathToFolder: '<%=config.markup.folder%><%=config.markup.js.folder%>',
          ourPathToFiles: '<%=config.markup.js.ourPathToFolder%><%=config.markup.js.ourFiles%>'
        },
        images: {
          folder: 'images/',
          files: '{,**/}*.{gif,jpeg,jpg,png,ico,cur}',
          pathToFolder: '<%=config.markup.folder%><%=config.markup.images.folder%>',
          pathToFiles: '<%=config.markup.images.pathToFolder%><%=config.markup.images.files%>'
        },
        fonts: {
          folder: 'fonts/',
          files: '{,**/}*.{woff,eot,ttf,svg}',
          pathToFolder: '<%=config.markup.folder%><%=config.markup.fonts.folder%>',
          pathToFiles: '<%=config.markup.fonts.pathToFolder%><%=config.markup.fonts.files%>'
        }
      },
      build: {
        folder: 'dist/',
        css: {
          folder: 'css/',
          files: '{,**/}*.css',
          pathToFolder: '<%=config.build.folder%><%=config.build.css.folder%>',
          pathToFiles: '<%=config.build.css.pathToFolder%><%=config.build.css.files%>'
        },
        sass: {
          folder: 'sass/',
          files: '{,**/}*.{scss,sass}',
          pathToFolder: '<%=config.build.folder%><%=config.build.sass.folder%>',
          pathToFiles: '<%=config.build.sass.pathToFolder%><%=config.build.sass.files%>'
        },
        js: {
          folder: 'js/',
          files: '{,**/}*.js',
          pathToFolder: '<%=config.build.folder%><%=config.build.js.folder%>',
          pathToFiles: '<%=config.build.js.pathToFolder%><%=config.build.js.files%>'
        },
        images: {
          folder: 'images/',
          files: '{,**/}*.{gif,jpeg,jpg,png,ico,cur}',
          pathToFolder: '<%=config.build.folder%><%=config.build.images.folder%>',
          pathToFiles: '<%=config.build.images.pathToFolder%><%=config.build.images.files%>'
        },
        fonts: {
          folder: 'fonts/',
          files: '{,**/}*.{woff,eot,ttf,svg}',
          pathToFolder: '<%=config.build.folder%><%=config.build.fonts.folder%>',
          pathToFiles: '<%=config.build.fonts.pathToFolder%><%=config.build.fonts.files%>'
        },
        html: {
          folder: '',
          files: '{,**/}*.html',
          pathToFolder: '<%=config.build.folder%><%=config.build.html.folder%>',
          pathToFiles: '<%=config.build.html.pathToFolder%><%=config.build.html.files%>'
        }
      }
    },
    compass: {
      dev: {
        options: {
          relativeAssets: true,
          outputStyle: 'expanded',
          noLineComments: true,
          sassDir: '<%=config.dev.sass.pathToFolder%>',
          cssDir: '<%=config.dev.css.pathToFolder%>',
          imagesDir: '<%=config.dev.images.pathToFolder%>',
          fontsDir: '<%=config.dev.fonts.pathToFolder%>'
        }
      },
      markup: {
        options: {
          relativeAssets: true,
          outputStyle: 'expanded',
          noLineComments: true,
          sassDir: '<%=config.dev.sass.pathToFolder%>',
          cssDir: '<%=config.markup.css.pathToFolder%>',
          imagesDir: '<%=config.markup.images.pathToFolder%>',
          fontsDir: '<%=config.markup.fonts.pathToFolder%>'
        }
      },
      build: {
        options: {
          relativeAssets: true,
          outputStyle: 'compressed',
          sassDir: '<%=config.dev.sass.pathToFolder%>',
          cssDir: '<%=config.build.css.pathToFolder%>',
          imagesDir: '<%=config.build.images.pathToFolder%>',
          fontsDir: '<%=config.build.fonts.pathToFolder%>'
        }
      }
    },
    cssmin: {
      combine: {
        options: {
          banner: '/*! <%=pkg.name%> - v<%=pkg.version%> - ' + '<%=grunt.template.today("yyyy-mm-dd")%> */',
          keepSpecialComments: 0
        },
        files: {
          '<%=config.build.css.pathToFolder%><%=pkg.name%>.min.css': copyBowerFiles('css', 'build', true).concat(['<%=config.dev.css.pathToFiles%>', '!<%=config.dev.css.pathToFolder%>ie{,9}.css']),
          '<%=config.build.css.pathToFolder%>ie.css': ['<%=config.dev.css.pathToFolder%>ie.css'],
          '<%=config.build.css.pathToFolder%>ie9.css': ['<%=config.dev.css.pathToFolder%>ie9.css']
        }
      }
    },
    connect: {
      options: {
        port: 9000,
        open: true,
        livereload: 35729,
        // Change this to '0.0.0.0' to access the server from outside
        hostname: 'localhost'
      },
      livereload: {
        options: {
          open: {
            target: 'http://localhost:9000/<%=config.dev.folder%>'
          }
        }
      }
    },
    imagemin: {
      markup: {
        files: [{
          expand: true,
          cwd: '<%=config.dev.images.pathToFolder%>',
          src: '<%=config.dev.images.files%>',
          dest: '<%=config.markup.images.pathToFolder%>'
        }]
      },
      build: {
        files: [{
          expand: true,
          cwd: '<%=config.dev.images.pathToFolder%>',
          src: '<%=config.dev.images.files%>',
          dest: '<%=config.build.images.pathToFolder%>'
        }]
      }
    },
    concat: {
      options: {
        separator: '\n\r;'
      },
      build: {
        src: copyBowerFiles('js', 'dist', true).concat([
          '<%=config.dev.js.pathToFolder%>plugins/*.js',
          '<%=config.dev.js.pathToFolder%>config.js',
          '<%=config.dev.js.pathToFolder%>jquery.analytics.js',
          '<%=config.dev.js.pathToFolder%>jquery.utilities.js',
          '<%=config.dev.js.pathToFolder%>jquery.carousel.js',
          '<%=config.dev.js.pathToFolder%>jquery.custom-select.js',
          '<%=config.dev.js.pathToFolder%>jquery.form-validator.js',
          '<%=config.dev.js.pathToFolder%>jquery.init-maps.js',
          '<%=config.dev.js.pathToFolder%>jquery.tabs.js',
          '<%=config.dev.js.pathToFolder%>jquery.init-plugins.js',
          '<%=config.dev.js.pathToFolder%>jquery.data-bind.js',
          '<%=config.dev.js.pathToFolder%>jquery.filter.js',
          '<%=config.dev.js.pathToFolder%>jquery.autocomplete.init.js'
        ]),
        dest: '<%=config.build.js.pathToFolder%><%=pkg.name%>.min.js'
      }
    },
    uglify: {
      build: {
        files: [{
          expand: true,
          cwd: '<%=config.build.folder%>',
          src: ['<%=config.build.js.folder%><%=pkg.name%>.min.js'],
          dest: '<%=config.build.folder%>'
        }]
      },
      markup: {
        files: copyBowerFiles('js', 'markup', false, true)
      }
    },
    jshint: {
      options:{
        jshintrc: '.jshintrc'
      },
      src: ['<%=config.dev.js.ourPathToFiles%>']
    },
    csslint: {
      options: {
        csslintrc: '.csslintrc'
      },
      dev: {
        src: ['<%=config.dev.css.pathToFiles%>']
      },
      markup: {
        src: ['<%=config.markup.css.pathToFiles%>']
      },
      build: {
        src: ['<%=config.build.css.pathToFiles%>']
      }
    },
    clean: {
      markup: ['<%=config.markup.folder%>'],
      build: ['<%=config.build.folder%>'],
      css: ['<%=config.dev.css.pathToFolder%>']
    },
    copy: {
      allB: {
        files: [{
          expand: true,
          cwd: '<%=config.dev.folder%>',
          src: [
            '**', '!<%=config.dev.html.files%>', '!<%=config.dev.css.folder%>**', '!<%=config.dev.jade.folder%>**', '!<%=config.dev.images.folder%>**', '!<%=config.dev.js.folder%>**', '!<%=config.dev.sass.folder%>**', '!<%=config.dev.less.folder%>**'],
          dest: '<%=config.build.folder%>'
        }].concat(copyBowerFiles('images', 'build'), copyBowerFiles('other', 'dist'))
      },
      jsB: {
        files: []
      },
      allImages: {
        files: [{
          expand: true,
          cwd: '<%=config.dev.folder%>',
          src: ['<%=config.dev.images.folder%>**'],
          dest: '<%=config.markup.folder%>'
        }]
      },
      allM: {
        files: [{
          expand: true,
          cwd: '<%=config.dev.folder%>',
          src: ['**', '!<%=config.dev.html.files%>', '!<%=config.dev.css.folder%>**', '!<%=config.dev.jade.folder%>**', '!<%=config.dev.images.folder%>**'],
          dest: '<%=config.markup.folder%>'
        }].concat(copyBowerFiles('css', 'markup'), copyBowerFiles('images', 'markup'), copyBowerFiles('other', 'markup'))
      },
      jsM: {
        files: copyBowerFiles('js', 'markup')
      }
    },
    processhtml: {
      options: {
        strip: true
      },
      markup: {
        options: {
          data: {
            ie: ''
          }
        },
        expand: true,
        cwd: '<%=config.dev.folder%>',
        src: ['<%=config.dev.html.files%>'],
        dest: '<%=config.markup.folder%>'
      },
      build: {
        options: {
          data: {
            ie: ''
          }
        },
        expand: true,
        cwd: '<%=config.dev.folder%>',
        src: ['<%=config.dev.html.files%>'],
        dest: '<%=config.build.folder%>'
      }
    },
    jade: {
      options: {
        pretty: true
      },
      dev: {
        expand: true,
        cwd: '<%=config.dev.jade.pathToFolder%>',
        src: ['*.jade', '!modules/**', '!dev/**'],
        dest: '<%=config.dev.folder%>',
        ext: '.html'
      },
      markup: {
        expand: true,
        cwd: '<%=config.dev.jade.pathToFolder%>',
        src: ['*.jade', '!modules/**', '!dev/**'],
        dest: '<%=config.markup.folder%>',
        ext: '.html'
      },
      build: {
        expand: true,
        cwd: '<%=config.dev.jade.pathToFolder%>',
        src: ['*.jade', '!modules/**', '!dev/**'],
        dest: '<%=config.build.folder%>',
        ext: '.html'
      }
    },
    watch: {
      livereload: {
        options: {
          livereload: '<%=connect.options.livereload%>'
        },
        files: [
          '<%=config.dev.html.pathToFiles%>',
          '<%=config.dev.css.pathToFiles%>',
          '<%=config.dev.js.ourPathToFiles%>',
          '<%=config.dev.images.pathToFiles%>'
        ]
      },
      jade: {
        files: ['<%=config.dev.jade.pathToFiles%>'],
        tasks: ['jade:dev']
      },
      scripts: {
        files: ['<%=config.dev.js.ourPathToFiles%>'],
        tasks: ['jshint']
      },
      css: {
        files: ['<%=config.dev.css.pathToFiles%>'],
        tasks: ['csslint:dev']
      },
      compass: {
        files: ['<%=config.dev.sass.pathToFiles%>'],
        tasks: ['clean:css', 'compass:dev']
      }
    }
  });

  grunt.registerTask('default', function () {
    grunt.task.run([
      'jshint',
      'clean:css',
      'compass:dev',
      'csslint:dev',
      'connect',
      'jade:dev',
      'watch'
    ]);
  });
  grunt.registerTask('markup', function () {
    grunt.task.run([
      'clean:markup',
      'jade:dev',
      'processhtml:markup',
      'jshint',
      'imagemin:markup',
      'compass:markup',
      'csslint:markup',
      'copy:allM',
      'uglify:markup'
    ]);
  });
  grunt.registerTask('build', function () {
    grunt.task.run([
      'clean:build',
      'jade:dev',
      'processhtml:build',
      'jshint',
      'imagemin:build',
      'concat:build',
      'uglify:build',
      'clean:css',
      'compass:dev',
      'csslint:dev',
      'cssmin',
      'copy:allB',
      'copy:jsB'
    ]);
  });
};