---
title: To Type a Module
tagline: Add TypeScript goodness to your NPM modules without breaking stuff
lang: en
---

TypeScript can offer a lot of robustness to your code via static analysis, moving some of Javascript s notorious run time errors to compile time.

In our team at the **Red Hat Mobile Application Platform**, where we're challenged to build tools that are to be used by the development teams of our customers, having type annotations for our libraries can act as a perfect add-on to standalone documentation, giving developers confidence when utilizing our APIs, and the great user experience of browsing them through autocompletion features from various editors and IDEs.

But Types are so Java
===

The thought of adding type annotations to such a dynamic language as JS can sound blasphemous and counter-productive. Why, of course, would we want to 'give up the flexibility' that the language gives us by restraining ourselves again by actually writing **more** code?

Like all things software, we end up finding out that our forefathers were right all along, and sometimes we get down from giants' shoulders just to having to climb up all over again. And stronger typing in your JavaScript code can be very helpful. From the get go one can think of the following advantages:

- Less of shooting yourself in the foot
- Less of others shooting themselves in the foot with your code

This article is in the context 

- Docs that people will actually look at
- A lot of the typing is automagical

TypeScript is a good guesser
---

Our Target is JS
===

JavaScript is the language of Node and more importantly NPM and will remain so until v8 implements WebAssembly and the ecosystem adjusts to having Python or Ruby showing up in your Chrome DevTools debugger from embedded source maps.

Examples

Tips
===
Code tips

Tools
===

Linting
---

Unit testing
---

Prepublish
---

Caveats
===

Es6 vs CommonJS modules

