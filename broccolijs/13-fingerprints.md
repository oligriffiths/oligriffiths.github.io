title: 13-Fingerprinting
date: 2018-04-27
---

When deploying updates to your new shiny app, you're going to want the browser to fetch the latest version if there has
been an update, rather than using the cached version the browser may store. The simplest way we can do this is by
appending a content hash to the filename, to ensure that when you push a new update, a new hash will be created, thus
invalidating the previous cached versions.

To do this, we can use a simple plugin called [broccoli-asset-rev](https://github.com/rickharrison/broccoli-asset-rev):

```sh
yarn add --dev broccoli-asset-rev@^2.7.0
```

Now, update your `Brocfile.js`:

```js
// Brocfile.js
const funnel = require('broccoli-funnel');
const merge = require('broccoli-merge-trees');
const compileSass = require('broccoli-sass-source-maps')(require('sass'));
const esLint = require("broccoli-lint-eslint");
const sassLint = require("broccoli-sass-lint");
const Rollup = require("broccoli-rollup");
const LiveReload = require('broccoli-livereload');
const CleanCss = require('broccoli-clean-css');
const log = require('broccoli-stew').log;
const assetRev = require('broccoli-asset-rev');
const babel = require('rollup-plugin-babel');
const nodeResolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const uglify = require('rollup-plugin-uglify').uglify;
const env = require('broccoli-env').getEnv() || 'development';
const isProduction = env === 'production';

// Status
console.log('Environment: ' + env);

const appRoot = "app";

// Copy HTML file from app root to destination
const html = funnel(appRoot, {
  files: ["index.html"],
  annotation: "Index file",
});

// Lint js files
let js = esLint(appRoot, {
  persist: true
});

// Compile JS through rollup
const rollupPlugins = [
  nodeResolve({
    jsnext: true,
    browser: true,
  }),
  commonjs({
    include: 'node_modules/**',
  }),
  babel({
    exclude: 'node_modules/**',
  }),
];

// Uglify the output for production
if (isProduction) {
  rollupPlugins.push(uglify());
}

js = new Rollup(js, {
  inputFiles: ['**/*.js'],
  rollup: {
    input: 'app.js',
    output: {
      file: 'assets/app.js',
      format: 'es',
      sourcemap: !isProduction,
    },
    plugins: rollupPlugins,
  }
});

// Lint css files
let css = sassLint(appRoot + '/styles', {
  disableTestGenerator: true,
});

// Copy CSS file into assets
css = compileSass(
  [appRoot],
  'styles/app.scss',
  'assets/app.css',
  {
    sourceMap: !isProduction,
    sourceMapContents: true,
    annotation: "Sass files"
  }
);

// Compress our CSS
if (isProduction) {
  css = new CleanCss(css);
}

// Copy public files into destination
const public = funnel('public', {
  annotation: "Public files",
});

// Remove the existing module.exports and replace with:
let tree = merge([html, js, css, public], {annotation: "Final output"});

// Include asset hashes
if (isProduction) {
  tree = assetRev(tree);
} else {
  // Log the output tree
  tree = log(tree, {
    output: 'tree',
  });

  tree = new LiveReload(tree, {
    target: 'index.html',
  });
}

module.exports = tree;
```

What we've done here, is add the `AssetRev` plugin as the last plugin to the tree, for production builds only. It will
auto-hash `js`, `css`, `png`, `jpg`, `gif` and `map` files, and will update `html`, `css` and `js` files with any
references to the original un-hashed file, with the new hashed file. There are additional options to specify a prefix
so that files can be hosted on a CDN if you wish, see the plugin github page.

Completed Branch: [13-fingerprints](https://github.com/oligriffiths/broccolijs-tutorial/tree/13-fingerprints)

Next: [14-complete](14-complete.html)
