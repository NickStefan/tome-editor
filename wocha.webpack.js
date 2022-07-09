/*
Circa 2015: this glob style code dynamically loaded all test files.
Circa 2022: webpack is 4 versions ahead and the same package.json from 2016 no longer works perfectly.
Temporary solution: hard code the imports into this file.
Better solution: upgrade to webpack 2, then webpack 3, then webpack 4 etc or maybe typescript.

// point wocha.js at this file to bundle all test files in this directory
var context = require.context('.', true, /\.tome-spec\.js/);
context.keys().forEach(context);
module.exports = context;
*/

// temporarily hard code to get test runner working again
import './model/specs/apply-range.tome-spec.js';
import './model/specs/clean.tome-spec.js';
import './model/specs/insert-text.tome-spec.js';
import './model/specs/merge-blocks.tome-spec.js';
import './model/specs/remove-text.tome-spec.js';
import './model/specs/split-block.tome-spec.js';
import './model/specs/update-ranges.tome-spec.js';
import './render/specs/render.tome-spec.js';
import './utils/specs/priority.tome-spec.js';
