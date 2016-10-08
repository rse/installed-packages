
installed-packages
==================

Determine names of all installed packages.

<p/>
<img src="https://nodei.co/npm/installed-packages.png?downloads=true&stars=true" alt=""/>

<p/>
<img src="https://david-dm.org/rse/installed-packages.png" alt=""/>

About
-----

This is a small JavaScript library for use in Node.js environments,
providing the possibility to determine all installed packages.

The packages to be considered are: all built-in modules, all packages in the
global NPM directory, all packages in all `node_modules` directories of the
current and all parent directories and all packages in the directories
of environment variable `NODE_PATH`.

The motivation for this module is the following scenario: a tool
`foo` wants to allow plugins to extend itself. The plugins, by
convention, have to be named `foo-plugin-xxx`. On startup, `foo` uses
`installed-packages` to determine all available packages, filters the
list via pattern `foo-plugin-*` and then `require`s all found plugin
packages and give them a chance to hook into the processing of `foo`.

Example
-------

```
const installedPackages = require("installed-packages")

installedPackages().then((packages) => {
    console.log(packages)
}, (err) => {
    console.log(`ERROR: ${err}`)
})
```

Installation
------------

```shell
$ npm install installed-packages
```

License
-------

Copyright (c) 2016 Ralf S. Engelschall (http://engelschall.com/)

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be included
in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

