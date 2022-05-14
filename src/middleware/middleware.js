const jwt = require('jsonwebtoken')

const authentication = async function (req, res, next) {
    try {         
        const token = req.header('x-auth-token');

        if (!token) {
            return res.status(403).send({ status: false, message: `Missing authentication token in request` });
        }

        const decoded = jwt.decode(token, 'Project3');

        if (!decoded) {
            return res.status(401).send({ status: false, message: "Invalid authentication token in request headers." });
        }
        if (Date.now() > (decoded.exp) * 1000) {
            return res.status(403).send({ status: false, message: "Session expired! Please login again." });
        }
        const verify = jwt.verify(token, 'Project3')

        if (!verify) {
            return res.status(401).send({ status: false, message: `Invalid authentication token in request` });//-------------------
        }
        req.userId = decoded.userId;
        next()
    
    } catch (error) {
        
        res.status(400).send({ status: false, message: error })}    
}

module.exports = {authentication}
