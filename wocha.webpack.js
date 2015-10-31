// point wocha.js at this file to bundle all test files in this directory
var context = require.context('.', true, /\.tome-spec\.js/);
context.keys().forEach(context);
module.exports = context;