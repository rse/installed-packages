
const installedPackages = require(".")

installedPackages().then((packages) => {
    console.log("OK", packages)
}, (error) => {
    console.log("ERROR", error)
})

