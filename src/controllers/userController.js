const usermodel=require("../models/userModel")
const jwt=require("jsonwebtoken")

const userLogin= async function(req,res){
    try{
        let userDetails=req.body
        let user=await usermodel.findOne(userDetails)
        if(!user)
        return res.status(404).send({status:false,msg:"Invalid email or Password"})

        let token=jwt.sign({
            email:user.email

        },
           "Project2"
        )

        res.status(200).send({status:true,msg:token})
    }
    catch(error){
        res.status(500).send({status:false,msg:error.message})
    }
}