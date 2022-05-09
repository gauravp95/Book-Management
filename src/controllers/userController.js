const userModel = require("../models/userModel");
const jwt=require("jsonwebtoken")


//---------------------------------------Validadtor------------------------------------------
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

//-----------------------------------Validator----------------------------------------------------


const createUser = async function (req, res) {
    try {
        let requestBody = req.body;
        const {title, name, phone, email, password,address} = requestBody
        console.log(email);
        
        if (!isValidRequestBody(requestBody)) {
          res.status(400).send({status: false , msg: 'Please provide details of the intern'}) 
        }
        if (!isValid(title)) {
          res.status(400).send({status: false , msg : 'Enter appropriate name' })
        }
        if (!isValid(name)) {
          res.status(400).send({status: false , msg : 'Enter appropriate mobile number  ' })
        }
        console.log(email);
        
      
        if(!( /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))) {
          res.status(400).send({status: false , msg: 'Please enter valid email Id'})
        }
        if (!(phone.length == 10)) {
          res.status(400).send({status: false, msg: 'Enter 10 digit mobile no.'})
        }
        // if (!isValid(address)) {
        //     res.status(400).send({status: false , msg : 'Enter appropriate address' })
        // }
        if (!isValid(password)) {
            res.status(400).send({status: false , msg : 'Enter appropriate password' })
        }
        
        const isEmailAlreadyUsed = await userModel.findOne({email})  
        if (isEmailAlreadyUsed) {
          res.status(400).send({status: false, msg: 'Email Address already registered'})
        }
  
        const userData = {title, name, phone, email, password,address}
        const newUser = await userModel.create(userData);
        return res.status(201).send({ status: true, data: newUser });
    } catch (error) {
        return res.status(500).send({status:false ,msg: error.message})
    }
}


const userLogin= async function(req,res){
    try{
        let userDetails=req.body
        let user=await userModel.findOne(userDetails)
        if(!user)
        return res.status(404).send({status:false,msg:"Invalid email or Password"})

        let token=jwt.sign({
            email:user.email

        },
           "Project3"
        )

        res.status(200).send({status:true,msg:token})
    }
    catch(error){
        res.status(500).send({status:false,msg:error.message})
    }
}

//////////////////////////////////////////////////////////////////////////////////////////

const createBook=async function(req,res){
    try{
        let data=req.body
        let userData=await userModel.findById(data.userid)
        if(!userData)
          return res.status(400).send({status:false,msg:"Enter Valid user ID"})
          const createdBook = await blogModel.create(data)
          res.status(201).send({ status: true, msg: createdBook })
    }
    catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }
}
 
module.exports={createBook,createUser}