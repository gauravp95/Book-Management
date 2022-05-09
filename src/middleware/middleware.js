const jwt = require('jsonwebtoken')

const middlewareAuthentication = async function (req, res, next) {
    
    try {         
        const token = req.headers['x-auth-token']

        if (!token) {            
            res.status(400).send({ status: false, msg: "Token Absent in header" })} 
        
        const decodedToken = jwt.verify(token, "Project3")
        
        if (!decodedToken) {          
            res.status(400).send({ status: false, msg: "user not found" })} 
        
        req.validToken = decodedToken
        
        next() 
    
    } catch (error) {
        
        res.status(400).send({ status: false, msg: error })}    
}
module.exports.middlewareAuthentication = middlewareAuthentication;