title: Eat your greens! A beginners guide to Broccoli.js
date: 2017-01-26 16:17:54
tags: 
- javascript
- broccoli
---

Welcome to the world of Broccoli.js. So, I'm sure you're wondering, what *is* Broccoli.js?

Well, per the [Broccoli.js website](http://broccolijs.com)

> The asset pipeline for ambitious applications

Cool, wait, what the hell does that mean? 

<!-- more -->

"Ambitious applications"? That sounds scary, I just wanna make a 
simple JS app, with ES6 transpilation, SCSS pre-processing, asset concatenation, live reload, uglification,
vendor npm module inclusion, developement server, and, oh, wait, perhaps it's ambitious. 

Oh, yeah, and I want all that to be fast.

Historically, we had grunt, and decided we didn't like configuration files.
Then we had gulp, because we wanted to write code to compile our code, then it got slow.
Then we had webpack that does bundling, minifaction, source maps, but, it's kinda hard to configure.

## Follow along

here's a talk I gave at EmberNYC meetup in Jan 2017 that covers most of this article.

<div style="padding-bottom: 56%; position: relative"><iframe style="position: absolute; width: 100%; height: 100%;" src="https://www.youtube.com/embed/JTzvYJBxwyI?start=141&end=1377" frameborder="0" allowfullscreen></iframe></div>

## Enter Broccoli.js.

So, how is Broccoli any different. Well, all the aforementioned tools work on the basis of running commands on
a set of files, usually applied through some kind of `glob()` type file finder, perhaps writing to temp files
post processing, and ultimately working on files/streams directly. Broccoli on the other hand works on the
concept of `trees`.

### What is a tree?

A Broccoli tree can be thought of much like a file system tree. Think of a directory, that contains files, and
directories, that also contains files, and so on, much like the branches of a tree. 

Trees can then be manipulated via various broccoli plugins, to do things like copy files to the destination 
directory, pre-process files within a tree and convert them from one format to another (e.g. .scss to .css), 
merge trees together (think rsync'ing one directory into another), concatenate files of a certain type into 
one (bundling), uglifying, and so on.

### How do trees work?

Trees themselves don't actually contain file contents, and manipulations to the trees don't happen when you
create or change them. They're essentially representations of state, once all declared manipulations have been 
done on the tree, it gets processed, and at this point, the files are actually read and operations performed.
This means that the setup for the trees and the operations that will be performed are very fast.

Additionally, when files are changed, Broccoli only needs to rebuild certain trees and not the entire 
application, this makes rebuilds *crazy* fast. Additionally, trees can be cached for extra speeds.

For example, say you only change an image that is just being copied verbatim from a source directory to the 
target directory, only that specific subtree needs to be re-built, however javascript doesn't need to be 
compiled, scss files don't need to be parsed, etc.

It sounds like a lot, but it's actually quite simple, so let's get started with a simple Broccoli app.

## Setup:
```
mkdir broccoli-demo
cd broccoli-demo
npm install -g broccoli
npm init
npm install --save-dev broccoli
mkdir app
touch Brocfile.js
echo 'hello world' > app/index.html
```

This is the basic setup for our broccoli app. We've installed the broccoli CLI tool, this will actually build our
application, and provide a built in express local development server.
 
The Brocfile.js will contain all our build instructions, and the `app` directory will contain our source files.

Next, we'll start building out our Brocfile.js to add some basic build instructions.


## Copying files

Now, let's perform a simple copy operation, copying our index.html from out app directory to the destination.
This is done via a broccoli filter called [broccoli-funnel](https://github.com/broccolijs/broccoli-funnel)

```
npm install --save-dev broccoli-funnel
```
 
```js
// Brocfile.js
const funnel = require('broccoli-funnel');

const appRoot = 'app';

// Copy HTML file from app root to destination
const html = funnel(appRoot, {
  files   : ['index.html'],
  destDir : '/'
});

module.exports = html;
```

What we're doing here should be fairly self explanatory, although the "funnel" bit seems a bit misleading. 

Per the docs:

> The funnel plugin takes an input node, and returns a new node with only a subset of the files from the input
node. The files can be moved to different paths. You can use regular expressions to select which files to include 
or exclude.

Basically, this is taking an input node, which can be a string representing a directory or another tree,
selecting only the `index.html` file (this can be a regex match also) and moving it to the `destDir`, the root.

Finally, we return the tree as the module export, and Broccoli handles all the rest.

Cool, let's try running this:

```
broccoli build dist
```

Assuming no errors are output, your `dist` directory should look like:

```
index.html
```

Simple.

Note: when re-running the build command, you must remove the existing target dir (dist);

```
rm -rf dist && broccoli build dist
```


## Built in build server

Broccoli comes with a built in build server, that watches files and will rebuild trees as appropriate. 
To use it, simply:

```
broccoli serve
```

Open a browser and point to:

```
http://localhost:4200
```

And you should see your "Hello World" HTML page rendered. Try changing the content of the `index.html` file, you 
should see Broccoli rebuild once you save the file, and output the build time for each of the slowest trees it built 
(there's only one right now). Once it's rebuilt, refresh your browser to see your changes.

Well done, you've now built your first Broccoli powered app!

### Note:

From now on, I will refer to running the build command, and the serve command as `build & serve` to keep things short:

```
rm -rf dist && broccoli build dist && broccoli serve
```

And assume you know to refresh the browser on `localhost:4200`.


## Multiple trees

The first example is fairly contrived and not that useful. We'll want to be able to work with multiple trees, and
ultimately have them written to our target directory.

Introducing, [broccoli-merge-trees](https://github.com/broccolijs/broccoli-merge-trees)

```
npm install --save-dev broccoli-merge-trees
```

Now let's add a JS and a CSS file that'll be the root of our web app and copy that into an `assets` folder.

```
mkdir app/styles
echo 'html{ background: palegreen; }' > app/styles/app.css
echo 'alert("Eat your greens");' > app/app.js
echo '<!doctype html><html>
<head>
    <link rel="stylesheet" href="/assets/app.css" />
</head>
<body>
hello world
<script src="/assets/app.js"></script>
</body>
</html>' > app/index.html
```

```js
// Brocfile.js
const funnel = require('broccoli-funnel');
const merge = require('broccoli-merge-trees');

const appRoot = 'app';

// Copy HTML file from app root to destination
const html = funnel(appRoot, {
  files : ['index.html'],
  destDir : '/'
});

// Copy JS file into assets
const js = funnel(appRoot, {
  files : ['app.js'],
  destDir : '/assets'
});

// Copy CSS file into assets
const css = funnel(appRoot, {
  srcDir: 'styles',
  files : ['app.css'],
  destDir : '/assets'
});

module.exports = merge([html, js, css]);
```

Again, pretty simple. We've added 2 more trees, a `js` tree and a `css`, that's taken an input node `appRoot`, 
filtered out all files except the `app.js` and `app.css` and will copy the files to the `destDir` of `/assets` 
within the target directory. Then, we take all trees, and merge them together, so all files end up in the 
target directory.

Now `build & serve`, you should get an alert message saying `Eat your greens` with a nice pale green background.

And the target `dist` directory should contain:
 
```
assets/app.js
assets/app.css
index.html
```

## SCSS Preprocessing

So our app is coming along, we have an index page that loads a javascript file and a lovely green background.
But css is so old school, we want to be able to write some fancy scss and have a preprocessor convert that to
css for us.

For the purposes of this tutorial, I am going to use SCSS, however there are sass, less and other preprocessors
available to use in a Broccoli build. Check NPM.

For this, we will use the excellent [broccoli-sass-source-maps](https://github.com/aexmachina/broccoli-sass-source-maps)
plugin.

```
npm install --save-dev broccoli-sass-source-maps
mv app/styles/app.css app/styles/app.scss
echo "$body-color: palegreen;
html{
  background: \$body-color;
  border: 5px solid green;
}" > app/styles/app.scss
```

```js
// Brocfile.js
const funnel = require('broccoli-funnel');
const merge = require('broccoli-merge-trees');
const compileSass = require('broccoli-sass-source-maps');

const appRoot = 'app';

// Copy HTML file from app root to destination
const html = funnel(appRoot, {
  files : ['index.html'],
  destDir : '/'
});

// Copy JS file into assets
const js = funnel(appRoot, {
  files : ['app.js'],
  destDir : '/assets'
});

// Copy SCSS file into assets
const css = compileSass(
  [appRoot],
  'styles/app.scss',
  'assets/app.css',
  {}
);

module.exports = merge([html, js, css]);
```

As you can see, we're now using the `compileSass` plugin to transform our `scss` file into a `css` file, and
emit it into the `/assets` directory. The last parameter is an options hash that we will cover in a moment.

Now `build & serve` and you should see the newly compiled `scss` file has generated a `css` file with the addition
of the green border on the `html` element. Pretty neat. You can now use this `app/styles/app.scss` file as your
entrypoint for scss/sass compilation.

### Source maps

As the name of the plugin suggests, it supports source maps. Source maps are a great way during development
to be able see where styles have come from in the source `scss` document, rather than the compiled `css` document.

Try inspecting the html tag right now, you should see the `html` style is defined in `app.css` on line 1, however
it's actually defined in the `app.scss` on line 2. This is a fairly trivial example but gets way complicated
when you have imported files and lots of scss processing being done.

To enable source maps, add the following to the options hash that's the last parameter to `compileSass()`.

```js
// Brocfile.js
// ...
const css = compileSass(
  [appRoot],
  'styles/app.scss',
  'assets/app.css',
  {
    sourceMap: true,
    sourceMapEmbed: true,
    sourceMapContents: true,
  }
);
```

Now `build & serve` and you should see that when inspecting the html tag, the line has changed to line 2 and the
file is now `app.scss`. If you click the file name in the inspector, it should take you to the source `app.scss` 
file, showing the original scss, complete with variables.

See the Github repo for more details on further configuration options.


## ES6 Transpilation

So, our javascript is just your run-of-the-mill, runs in the browser, ES5, boring old javascript. But we're making
a shiny new, state-of-the-art javascript application, so we should really be pushing the latest and greatest ES6
syntax. Step up [Babel](https://babeljs.io).

`Babel` is a javascript compiler. It will transpile (convert from one format to another), ES6 syntax javascript, to
ES5 syntax javascript that is runnable in the browser. For this, we will require 
[broccoli-babel-transpiler](https://github.com/babel/broccoli-babel-transpiler).
 
```
npm install --save-dev broccoli-babel-transpiler
```

Now open `app/app.js` and set the contents to:

```js
// app/app.js
const message = 'Eat your greens';
function foo() {
    setTimeout(() => {
        alert(message);
        console.log(this);
    });
}
new foo();
```

```js
// Brocfile.js
const funnel = require('broccoli-funnel');
const merge = require('broccoli-merge-trees');
const compileSass = require('broccoli-sass-source-maps');
const babel = require('broccoli-babel-transpiler');

const appRoot = 'app';

// Copy HTML file from app root to destination
const html = funnel(appRoot, {
  files : ['index.html'],
  destDir : '/'
});

// Copy JS file into assets
let js = funnel(appRoot, {
  files : ['app.js'],
  destDir : '/assets'
});

// Transpile JS files to ES5
js = babel(js, { 
  browserPolyfill: true,
  sourceMap: 'inline',
});

// Copy CSS file into assets
const css = compileSass(
  [appRoot],
  'styles/app.scss',
  'assets/app.css',
  {
    sourceMap: true,
    sourceMapEmbed: true,
    sourceMapContents: true,
  }
);

module.exports = merge([html, js, css]);
```

So what's happening here? First off, we've declared `js` as a mutable variable (`let`) rather than an immutable
variable (`cosnt`) so we can re-assign it. Next, we pass the `js` tree into the babel transpiler, this will 
transpile the ES6 syntax to ES5.

If you `build` this now, and open `dist/assets/app.js`, you should see:

```js
// dist/assets/app.js
'use strict';

var message = 'Eat your greens';
function foo() {
    var _this = this;

    setTimeout(function () {
        alert(message);
        console.log(_this);
    });
}
new foo();
//# sourceMappingURL=...
```

So, a few things have happened here:

* `const` has been changed to `var`
* The arrow function `() => {}` inside the setTimeout has been converted to a regular function.
* The use of `this` within the arrow function refers to the correct `this` context.
* You should also notice the sourcemap at the bottom

If you run this in the browser, you'll see the alert and the correct `this` is logged to the console.

Now try adding a `debugger;` statement into the function and notice that the console stops at the breakpoint.
The presented source code should be the original ES6 version, *not* the transpiled ES5 version.

## JS imports

ES6 allows you to import code from other Javascript files using the following syntax:

```js
import foo from './foo'; 
```

Try creating a file `app/foo.js` with the contents:

```js
// app/foo.js
export const bar = 'bar';
export default 'foo';
```

and set the contents of `app/app.js` to:

```js
// app/app.js
import foo from './foo';
import bar from './foo';

console.log(foo);
```

Now `build & serve`, refresh the browser, and:

```
app.js:5 Uncaught ReferenceError: require is not defined
    at app.js:5
```

Uh oh, what's going on? Well, babel will transpile ES6 to ES5, however `import` statements are converted to
node compatible `require()` AMD calls. The browser doesn't have a mechanism for resolving `require()` calls by default
so we need a way of handling this. There are a couple of solutions for this.

* Browserify via `broccoli-watchify`
* Requirejs via `broccoli-requirejs`
* Rollup via `broccoli-rollup`

We're going to focus on [Rollup](http://rollupjs.org/) here because aside from module loading, it has some fairly 
cool other features we will touch on.

Here's what the website says:

> Rollup is a next-generation JavaScript module bundler. Author your app or library using ES2015 modules, then 
efficiently bundle them up into a single file for use in browsers and Node.js

So, first off, install rollup:

```
npm install --save-dev broccoli-rollup
```

And set your `Broccoli.js` file to:

```js
// Brocfile.js
const funnel = require('broccoli-funnel');
const merge = require('broccoli-merge-trees');
const compileSass = require('broccoli-sass-source-maps');
const babel = require('broccoli-babel-transpiler');
const Rollup = require('broccoli-rollup');

const appRoot = 'app';

// Copy HTML file from app root to destination
const html = funnel(appRoot, {
  files : ['index.html'],
  destDir : '/'
});

// Rollup dependencies
let js = new Rollup(appRoot, {
  inputFiles: ['**/*.js'],
  rollup: {
    entry: 'app.js',
    dest: 'assets/app.js',
    sourceMap: 'inline'
  }
});

// Transpile to ES5
js = babel(js, {
  browserPolyfill: true,
  sourceMap: 'inline',
});

// Copy CSS file into assets
const css = compileSass(
  [appRoot],
  'styles/app.scss',
  'assets/app.css',
  {
    sourceMap: true,
    sourceMapEmbed: true,
    sourceMapContents: true,
  }
);

module.exports = merge([html, js, css]);
```

Here are the changes:

1. Removed the JS funnel, this is no longer needed
2. Now we pass `appRoot` to `Rollup`, pass it an input filter with `inputFiles` to include all JS files
3. Rollup is configured with an `entry` file, this is the first file that is `required`.
4. Define a destination for the resulting rolled up build, and enable sourceMaps.
5. Run this tree through babel to transpile to ES5

Now `build & serve` and notice that the `requre()` error has gone, and it console logs out `foo`, all is
good in the world!

But wait, there's more...

Whereas Browserify and Requirejs will wrap each module in a specialised function, rollup is more intelligent
and hoists modules up to first class citizens, producing the most efficient output.
Checkout `dist/assets/app.js`, you should see:

```js
// dist/assets/app.js
'use strict';

var foo = 'foo';

console.log(foo);
```

As you can see, even though `app.js` imports `foo.js`, the compiled output contains no wrapping functions,
no extraneous code, just the value imported from `foo.js` and the `console.log()` statement. 

** The audience gasps in amazement **

But wait, there's more?

### Tree shaking

This is not a euphamism, it's an actual term that refers to removing dead/unused imported code.

Open `app/foo.js`

Notice we're also exporting a constant:

```js
export const bar = 'bar';
```

Open `app/app.js`

Notice we're importing this constant:

```js
import bar from './foo';
```

Now open `dist/assets/app.js`, notice how the `bar` is nowhere to be seen? What is this witchcraft?

This is part of the magic of Rollup, it knows, through static analysis, what code is not being used
and dynamically removes it. Cool huh?


## Live Reload

Well, obviously in dev we'd quite like to not have to hit refresh all the time, because developers are,
well, we're lazy. So we can use a live reload server to do the job for us.

```
npm install --save-dev broccoli-livereload
```

```js
// Brocfile.js - add this line to the top
const LiveReload = require('broccoli-livereload');

// Remove the existing module.exports and replace with:
let tree = merge([html, js, css]);

// Include live reaload server
tree = new LiveReload(tree, {
  target: 'index.html',
});

module.exports = tree;
```

Now `build & serve`, try changing a `scss` file, notice how the css refreshes in place, no browser
refresh. Change a `.js` or `.html` file and the page will refresh. This doesn't support fancy hot
reloading like React and Webpack does, but that's a slightly different ballgame, and I'm sure someone
clever will work that out.

## Conclusion

Well that just about sums it up. As you can see, `Broccoli.js` is a pretty powerful tool, there are a 
bunch of other cool filters and plugins for broccoli [on npm](https://www.npmjs.com/search?q=broccoli-).
Mix and match, merge, concat, filter to your hearts content.

Hopefully this tutorial has helped you understand how to cook your
vegetables.

Peace.
