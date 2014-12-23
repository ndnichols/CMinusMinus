# A (very small) subset of C that compiles to Javascript

A toy implementation of a toy language.

## Goal

This project tries to demonstrate some of the core concepts of "Compile-to-JavaScript" languages in a simple, straightforward way. There's no practical use (that I can imagine) for the project itself.

## Known issues

Oh, loads.

* Mathematical expressions need to be wrapped in parentheses
* Type-checking throws false negatives and positives
* No arrays, loops, conditionals, #includes, etc.
* No tests

## Usage

1. `npm install`
2. `jison grammars/main.jison -o parser.js`
3. `node lib/cmm.js test.cmm`
