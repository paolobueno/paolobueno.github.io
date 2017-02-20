---
title: To Type a Module
tagline: Add TypeScript goodness to your NPM modules without breaking stuff
lang: en
date: "2017-02-19"
tags: ["typescript", "intermediate", "npm", "module"]
---

TypeScript can offer a lot of robustness to your code via static analysis, moving some of Javascript s notorious run time errors to compile time.

In our team at the **Red Hat Mobile Application Platform**, where we're challenged to build tools that are to be used by the development teams of our customers, having type annotations for our libraries can act as a perfect add-on to standalone documentation, giving developers confidence when utilizing our APIs, and the great user experience of browsing them through autocompletion features from various editors and IDEs.

But Types are so Java
---

The thought of adding type annotations to such a dynamic language as JS can sound blasphemous and counter-productive. Why, of course, would we want to 'give up the flexibility' that the language gives us by restraining ourselves again by actually writing **more** code?

Like all things software, we end up finding out that our forefathers were right all along, and sometimes we get down from giants' shoulders just to having to climb up all over again. Stronger typing in your JavaScript code can be very helpful, from the get go one can think of the following advantages:

1. Less of shooting yourself in the foot
1. Less of others shooting themselves in the foot with your code
1. Docs that people will actually look at
1. A lot of the typing is automagical

This article is in the context of adding type annotations to an existing module that is supposed to be consumed by developers outside the team that built it, so the second point is actually very relevant.

And also keeping internal code better documented can improve time for new teammates to get up to speed, and reduce a project's [bus factor](https://en.wikipedia.org/wiki/Bus_factor)

### TypeScript is a good guesser

So, obviously we start by adding type annotations to everything in our codebase, right? Not quite, consider the following:

```typescript
let myString = "Hello";
let multiply = (one, two) => one * two
```

In the above example the type of `myString` is correctly inferred as `string`, and `multiply` is set as `(any, any) => number`, because the `*` operator will do type coercion, but it will always try to return a `number`:

```typescript
multiply(3, 2) // 6
multiply("3", "3") // 9
multiply("foo", "bar") // NaN
```

You can see the [official documentation for TypeScript's type inference](https://www.typescriptlang.org/docs/handbook/type-inference.html) for more details. In fact, the basic type inference is so useful by itself that Visual Studio Code enables it by default even on 'plain' JavaScript projects so it can help out the user.

### So, many, options!

In addition to the lovely duck typing, it is very common for libraries to be configured through a plain `Object` with each key meaning sometimes requiring lots of different types, and most of the time the only documentation available for them is frm the project's README!

TypeScript can easily come to your aid by not only allowing you to describe each option through [JSDoc](http://usejsdoc.org/) annnotations, but also going further into any functions and callback parameters:



### Our Target is JS

JavaScript is the language of Node and more importantly NPM and will remain so until v8 implements WebAssembly and the ecosystem adjusts to having Python or Ruby showing up in your Chrome DevTools debugger from embedded source maps.

So, for our module to work as a NPM dependency we have to publish the compiled JavaScript version of it. Luckily, TypeScript was designed with this in mind, that's why the compiler can spit out both `d.ts` declaration files and source maps for debugging on top of the original source.

### Setting up compilation


So we have our old JavaScript sources, and we want the clients downloading our NPM module to get the new, typed version transparently. Let's say our current `package.json` looks like this:

```javascript
{
  "main": "lib/index.js"
  // ...
}
```

But clients currently not only require the base `require('our-module')` file, but also directly some sub file like `require('our-module\lib\utils')`, so we can't move the JavaScript code out of `lib/`.

#### New Source Directory

The easiest way to handle this is moving all code to a new directory, let's say `src/`, and setup the `tsc` compiler to output the results to `lib/`.

##### tsconfig.json
```javascript
{
  "outDir": "lib/",
  "include": "src/**/*.ts"
}
```

For more information on configuring the TypeScript compiler, check out the [documentation](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html).

Then expose the compilation as a npm script (or through grunt/gulp or whatever task runner you use):

##### package.json
```javascript
{
  "devDependencies": {
    "tsc": "x.x.x"
  },
  "scripts": {
    "build": "rm -rf lib/; tsc"
  }
}
```

Clearing the `lib/` directory is optional: using `;` instead of `&&` will allow the first command to fail but npm will stil run `tsc`. Now you can remove `lib/` from source control and [`.gitignore`](https://git-scm.com/docs/gitignore) it.

Finally, we set up npm so it will only include the compiled sources under `lib/` when compiling our module through either the [files property](https://docs.npmjs.com/files/package.json#files) or through a [`.npmignore file`](https://docs.npmjs.com/misc/developers#keeping-files-out-of-your-package)

##### package.json
```javascript
{
  // ...
  "files": "lib/"
}
```

Tools and Tips
---

### Prepublish NPM script

You can opt for using the `prepublish` key for the script we setup earlier for compiling our TypeScript. This will make it run on `npm publish` so other developers don't have to worry about building manually before publishing.

### Linting and editor support

TypeScript has a pretty mature linting tool in [`tslint`](https://palantir.github.io/tslint/), an [`eslint`](http://eslint.org/)-equivalent that unfortunately still uses the old `{ "rules": { "rule-name": [true, options] } }` style from `eslint`.

If you're wondering what's the point of a linter on top of a compiled extension, the linter will help you enforce style and code rules that range from purely stylistic to potential bugs and [code smells](https://blog.codinghorror.com/code-smells/).

### Unit testing

There's two approaches for running your unit tests if migrating them to TypeScript (assuming you had some before!):

- Running them on top of the compiled version of the code
- Make your test runner use a loader to compile them in the spot

For the first option, you guarantee you're running the unit tests on top of the actual code that is going to be installed and run by users, however I'm not aware of any test runner yet that will pick up source maps and give you a stack trace pointing to the original sources.

For the second one, some test runners support additional compilers or transformations in general to be done to code before executing unit tests. For those, you can use [`ts-node`](https://github.com/TypeStrong/ts-node#mocha) (example with Mocha).

## Caveats

This section contains some gotchas you'll face when converting existing JavaScript modules to TypeScript.

### ES6 vs CommonJS modules

TypeScript implements a lot of ES6 features including the [new module syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import), but it does not have a 1:1 translation to the CommonJS style that Node.js uses.

More specifically, you might do this:

```javascript
let foo = "123";
export default foo;
```

And, after compiling it to ES5 JavaScript, expect to be able to do this:

```javascript
var foo = require('./foo');
console.log(foo);
```

But here's what the compiled version looks like:

```javascript
define(["require", "exports"], function (require, exports) {
    "use strict";
    var foo = "123";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = foo;
});
```

As you can see, the property we defined gets attached to the `exports.default` property, so you'd need to do `var foo = require('./foo').default;`. It also attaches a special `__esModule` property, that among other things allows for ES6-enabled consumers to consider the default property when you `import foo from './foo'`.

The reason for this behavior is that [ES6 module exports should be static](http://www.2ality.com/2014/09/es6-modules-final.html#static-module-structure) and as such you can't use this special syntax inside conditional statements, for instance. This is opposed to CommonJS modules, where `module.exports` and `require()` are just special globals and not new syntax.