const { mongo, default: mongoose } = require("mongoose")
const collegeModel = require("../models/collegeModel")
const internModel = require("../models/internModel")

//==================================validator function==============================

const isValid= function (value){
    if(typeof value==='undefined' || value === null) return false;
    if(typeof value ==='string' && value.trim().length===0) return false;
    return true;
    }
    
    //==========================Create College=====================================
    
    
    const createCollege = async function (req,res){
        try {
            // validation for Mandatory >
    
    const data = req.body
    
    if(Object.keys(data).length == 0){
      return  res.status(400).send({ status:false,message:"Invalid request,Please Provide college Details"})
    }
    
    if(!isValid(data.name)){
        return  res.status(400).send({ status:false,message:"college name is mandatory"})
    }
    
    if(!isValid(data.fullName)){
        return  res.status(400).send({ status:false,message:"college fullName is mandatory"})
    }
    
    if(!isValid(data.logoLink)){
        return  res.status(400).send({ status:false,message:"logo link is mandatory"})
    }
    
    //===============validation for unique=====================
    
    let usedName=await collegeModel.findOne({name:data.name})
    if (usedName){
        return  res.status(400).send({ status:false,message:"This name is already exist"})
    }
    
    let usedFullName= await collegeModel.findOne({fullName:data.fullName})
    if (usedFullName){
        return  res.status(400).send({ status:false,message:"This full name is already exist"})
    }
            
    let college = await collegeModel.create(data);
            return res.status(201).send({status:true, msg: college });
        }
        catch (err) {
            return res.status(500).send({ status: false, msg: err.message })
        }
    };

module.exports.createCollege=createCollege
    
    

