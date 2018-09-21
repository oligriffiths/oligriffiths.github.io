title: 11-Environment
date: 2018-04-27
---

Environment configuration allows us to include or not include certain things in the build given certain
configuration options. For example, we probably want to not include live reload for production builds,
for this we need to have different environments. When building, we can provide an environment flag option.
So lets go ahead and configure things to support this.

```sh
yarn add --dev broccoli-env@^0.0.1
```

Note, the `broccoli-stew` package also comes with an `env` utility, with a slightly different API, but it doesn't expose
the environment name, and I want to be able to print it to the console, so I'm using the `broccoli-env` package instead.

```js
// Brocfile.js
const funnel = require('broccoli-funnel');
const merge = require('broccoli-merge-trees');
const compileSass = require('broccoli-sass-source-maps')(require('sass'));
const esLint = require("broccoli-lint-eslint");
const sassLint = require("broccoli-sass-lint");
const Rollup = require("broccoli-rollup");
const LiveReload = require('broccoli-livereload');
const log = require('broccoli-stew').log;
const babel = require("rollup-plugin-babel");
const nodeResolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
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
js = new Rollup(js, {
  inputFiles: ["**/*.js"],
  annotation: "JS Transformation",
  rollup: {
    input: "app.js",
    output: {
      file: "assets/app.js",
      format: "iife",
      sourcemap: !isProduction,
    },
    plugins: [
      nodeResolve({
        jsnext: true,
        browser: true,
      }),
      commonjs({
        include: 'node_modules/**',
      }),
      babel({
        exclude: "node_modules/**",
      }),
    ],
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

// Copy public files into destination
const public = funnel('public', {
  annotation: "Public files",
});

// Remove the existing module.exports and replace with:
let tree = merge([html, js, css, public], {annotation: "Final output"});

// Include live reaload server
if (!isProduction) {
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

What we've done here is wrapped the `debug` and `LiveReload` section in an `env === "development"`, this ensures the
`debug` and `LiveReload` trees are not included in the build when making a production build.

In order to pass in a different environment, simply add `BROCCOLI_ENV=production` before the build command, e.g.
`BROCCOLI_ENV=production broccoli build dist`. To make this simpler, lets add a new run command in `package.json`:

```json
{
  "scripts": {
    "build": "node $NODE_DEBUG_OPTION $(which broccoli) build --overwrite",
    "serve": "node $NODE_DEBUG_OPTION $(which broccoli) serve",
    "build-prod": "BROCCOLI_ENV=production node $NODE_DEBUG_OPTION $(which broccoli) build --overwrite"
  }
}
```

Now, running `yarn build-prod` will build in "production" mode.

Completed Branch: [11-environment](https://github.com/oligriffiths/broccolijs-tutorial/tree/11-environment)

Next: [12-minify](12-minify.html)
