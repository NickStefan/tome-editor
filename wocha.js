var fs = require('fs');

// var jsdom = require('jsdom');
var Mocha = require('mocha');
var webpack = require('webpack');
var testConfig = require('./webpack.test.config');

var wochaWebpackDescription = [
    'Run mocha Tests in ES6 and with webpack!\n',
    'To quickly run all the tests under a directory,',
    'create a file called wocha.webpack.js and save it to a specific directory.\n',
    'wocha.webpack.js',
    '    var context = require.context(\'.\', true, /\.bc-spec\.js/);',
    '    context.keys().forEach(context);',
    '    module.exports = context;\n',
    'If saved to /ex/dir, this will run all ex/dir test files ending in .bc-spec.js:',
    '$ node -f ex/dir/wocha.webpack.js'
].join('\n');

var argv = require('yargs')
    .usage('Usage: node $0 --file [path-to-entry] [options]')
    .example('node $0 -f dir/webpack.wocha.js')
    .describe('w', 'watch entry file and dependencies')
    .alias('w', 'watch')
    .demand('f')
    .describe('f', 'entry file')
    .alias('f', 'file')
    .epilog(wochaWebpackDescription)
    .argv;

/**
 ************************
 * Get args
 ************************
 */

var entry = argv.file;
var watch = argv.watch;

/**
 ************************
 * Build Webpack Config
 ************************
 */
testConfig.entry = './' + entry;
testConfig.target = 'node';
testConfig.output = {
    path: entryTransform(entry).outputpath,
    filename: entryTransform(entry).filename,
    libraryTarget: 'commonjs2'
}
console.log(testConfig)
var compiler = webpack(testConfig);

/**
 ************************
 * Build jsdom
 ************************
 */

// we have to set up jsdom outside mocha,
// the first time React is required (webpack? etc), it caches document
// jsdomSetup();

global.expect = require('chai').expect;

/**
 ***********************
 * Run once, or run watcher
 ************************
 */
if (watch){
    var watchOptions = {};
    compiler.watch(watchOptions, afterBuild);
} else {
    compiler.run(afterBuild);
}

function afterBuild(err, stats){
    if (err){
        console.log(err);
    }
    console.log('\n');
    console.log(stats.toString({
        colors:true,
        chunks:false
    }));
    console.log('    +', stats.toJson().modules.length,'hidden modules');

    runTests();
}


function runTests(){
    var mocha = new Mocha();
    mocha.suite.on('pre-require', function(context, file){
        uncache(file);
    });
    var file = entryTransform(entry).output;

    mocha.addFile(file);
    mocha.run();
}

/**
 **********************************************
 ****************   UTILITIES *****************
 **********************************************
 */

function propagateToGlobal (window, blacklist) {
    for (var key in window) {
        if (!window.hasOwnProperty(key)) continue;
        if (~blacklist.indexOf(key)) continue
        if (key in global) continue;

        global[key] = window[key];
    }
}

function jsdomSetup(){
    var blacklist = Object.keys(global);
    blacklist.push('constructor');

    var doc = jsdom.jsdom('<!doctype html><html><body></body></html>');
    var win = doc.defaultView;

    global.document = doc;
    global.window = win;

    propagateToGlobal(win, blacklist);

    global.navigator = {
        userAgent: 'node.js'
    };
}

/**
 ***********************
 * file path util
 ************************
 */

function entryTransform(entry){
    var filename = entry.split('/').slice(-1)[0];
    var path = entry.split('/').slice(0,-1).join('/');
    return {
        outputpath: 'temp-wocha/' + path,
        path: path,
        filename: filename,
        output: 'temp-wocha/' + entry
    };
}

/**
 ***********************
 * Clear node require cache,
 * so that Mocha can re-run tests on watch
 ************************
 */

/**
 * Removes a module from the cache.
 * Based on this snippet: http://stackoverflow.com/questions/9210542/node-js-require-cache-possible-to-invalidate/14801711#14801711
 * @param {string} moduleName
 */
function uncache(moduleName) {
  searchCache(moduleName, function(mod) {
    // dont clear jsdom or jsdom related require cache!!!
    if (/jsdom/.test(mod.filename)){ return; }
    delete require.cache[mod.id];
  });
};

/**
 * Runs over the cache to search for all the cached files.
 */
var searchCache = function(moduleName, callback) {
  var module = require.resolve(moduleName);
  // Check if the module has been resolved and found within the cache.
  if (module && ((module = require.cache[module]) !== undefined)) {
    (function run(module) {
      module.children.forEach(run);
      callback(module);
    })(module);
  }
};
