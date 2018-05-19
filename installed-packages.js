/*
**  installed-packages -- Determine names of all installed packages
**  Copyright (c) 2016-2017 Ralf S. Engelschall <rse@engelschall.com>
**
**  Permission is hereby granted, free of charge, to any person obtaining
**  a copy of this software and associated documentation files (the
**  "Software"), to deal in the Software without restriction, including
**  without limitation the rights to use, copy, modify, merge, publish,
**  distribute, sublicense, and/or sell copies of the Software, and to
**  permit persons to whom the Software is furnished to do so, subject to
**  the following conditions:
**
**  The above copyright notice and this permission notice shall be included
**  in all copies or substantial portions of the Software.
**
**  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
**  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
**  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
**  IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
**  CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
**  TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
**  SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

/*  built-in requirements  */
var path           = require("path")
var childProcess   = require("child_process")

/*  external requirements  */
var fs             = require("mz/fs")
var co             = require("co")
var builtinModules = require("builtin-modules")
var npmExecute     = require("npm-execute")

/*  the single API method  */
const installedPackages = co.wrap(function * (cache) {
    let packages = []

    /*  initialize optional cache  */
    if (typeof cache !== "object")
        cache = {}

    /*  determine all packages in a particular directory  */
    const findAllPackagesInDir = co.wrap(function * (dir) {
        let packages = []

        /*  iterate over all files in directory  */
        let items = yield fs.readdir(dir).catch(() => [])
        for (let i = 0; i < items.length; i++) {

            /*  in case the file is a directory  */
            let stat = yield fs.stat(path.join(dir, items[i]))
            if (stat.isDirectory()) {

                /*  take the directory if a file "package.json" is also present in it  */
                stat = yield fs.stat(path.join(dir, items[i], "package.json"))
                    .catch(() => null)
                if (stat !== null && stat.isFile())
                    packages.push(items[i])
            }
        }
        return packages
    })

    /*  determine all built-in modules  */
    packages = packages.concat(builtinModules)

    /*  determine all globally installed NPM packages  */
    let result = yield npmExecute([ "--loglevel=silent", "root", "-g" ])
    let globalDir = result.stdout.replace(/^\s+/, "").replace(/\s+$/, "")
    let p = yield findAllPackagesInDir(globalDir)
    packages = packages.concat(p)

    /*  iterate over all paths up to the root directory...  */
    let dirPrev
    let dirNow = process.cwd()
    while (dirNow !== dirPrev) {

        /*  check whether a "node_modules" directory exists inside it  */
        let dir = path.join(dirNow, "node_modules")
        let s = yield fs.stat(dir)
            .catch(() => null)
        if (s !== null && s.isDirectory()) {

            /*  determine all locally installed NPM packages  */
            let p = yield findAllPackagesInDir(dir)
            packages = packages.concat(p)
        }

        /*  walk to the parent directpry  */
        dirPrev = dirNow
        dirNow = path.resolve(dirNow, "..")
    }

    /*  iterate over all custom NPM module paths  */
    let nodePath = process.env.NODE_PATH
    if (typeof nodePath === "string" && nodePath !== "") {
        nodePath = nodePath.split(path.delimiter)
        for (let i = 0; i < nodePath.length; i++) {

            /*  check whether item is a directory  */
            let s = yield fs.stat(nodePath[i])
                .catch(() => null)
            if (s !== null && s.isDirectory()) {

                /*  determine all locally installed NPM packages  */
                let p = yield findAllPackagesInDir(nodePath[i])
                packages = packages.concat(p)
            }
        }
    }

    /*  de-duplicate packages  */
    packages = packages.filter((elem, pos) => {
        return packages.indexOf(elem) === pos
    }).sort()

    return packages
})

/*  export API method  */
module.exports = installedPackages

