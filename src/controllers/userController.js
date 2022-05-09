const userModel = require("../models/collegeModel");



const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value != "string" || value.trim().length == 0) return false
    return true
} 

const isValidRequestBody = function(requestBody) {
    return Object.keys(requestBody).length > 0
}

const isValidObjectId = function(objectId) {
    return mongoose.Types.ObjectId.isValid(objectId)
}


const createIntern = async function (req, res) {
    try {
        let requestBody = req.body;
        const {name, email, mobile, collegeName} = requestBody
        if (!isValidRequestBody(requestBody)) {
          res.status(400).send({status: false , msg: 'Please provide details of the intern'}) 
        }
        const data = await collegeModel.findOne({ name: collegeName }).select({ _id: 1 })
        if (!data)
            res.status(400).send({ status: false, msg: "invalid college name" })
        const collegeId = data._id;
        if (!isValidObjectId(collegeId)) {
          return res.status(400).send({ status: false, msg: "Invalid Object-Id" });
        }
        if (!isValid(name)) {
          res.status(400).send({status: false , msg : 'Enter appropriate name' })
        }
        if (!isValid(mobile)) {
          res.status(400).send({status: false , msg : 'Enter appropriate mobile number  ' })
        }
        if (!isValid(email)) {
          res.status(400).send({status: false , msg : 'Enter appropriate email Id' })
        }
        if(!( /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))) {
          res.status(400).send({status: false , msg: 'Please enter valid email Id'})
        }
        if (!(mobile.length == 10)) {
          res.status(400).send({status: false, msg: 'Enter 10 digit mobile no.'})
        }
        
        const isEmailAlreadyUsed = await internModel.findOne({email})  
        if (isEmailAlreadyUsed) {
          res.status(400).send({status: false, msg: 'Email Address already registered'})
        }
  
        const internData = {name, email, mobile, collegeId}
        const newIntern = await internModel.create(internData);
        return res.status(201).send({ status: true, data: newIntern });
    } catch (error) {
        
    }