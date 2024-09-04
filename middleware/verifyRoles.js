const verifyRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req?.roles) return res.sendStatus(401);
        const rolesArray = [...allowedRoles];
        // console.log(rolesArray);
        // console.log(req.roles);
        // const result = req.roles.map(role => rolesArray.includes(role)).find(val => val === true)
        const mapArray = req.roles.map(role => rolesArray.includes(role))
        // console.log("mapArray: ", mapArray)
        const result = mapArray.find(val => val === true)
        // console.log("result: ", result)
        if(!result) return res.sendStatus(401);
        next()
    }
}

module.exports = verifyRoles