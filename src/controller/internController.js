const internModel = require("../models/internModel")
const collegeModel = require("../models/collegeModel")
const { now } = require("mongoose")


const isValid = function (value) {
    if (typeof value === 'undefined' || typeof value === null) return false
    if (typeof value === 'string' && value.trim().length == 0) return false
    return true

}
const isValidRequestBody = function (req) {
    return Object.keys(req).length > 0
}

// ### POST /functionup/interns
// - Create a document for an intern. 
// - Also save the collegeId along with the document. Your request body contains the following fields - { name, mobile, email, collegeName}
// - Return HTTP status 201 on a succesful document creation. Also return the document. The response should be a JSON object like [this](#successful-response-structure) 

// - Return HTTP status 400 for an invalid request with a response body like [this](#error-response-structure)

const createIntern = async function (req, res) {
    try {
        let data = req.body
        let { name, email, mobile, collegeName } = data


        if(!isValidRequestBody(data)) return res.status(400).send({status:false, msg:"plx give intern data"})

        if(!isValid(name)) return res.status(400).send({status:false, msg:"plz enter valid name...!!"})

        if(!isValid(email)) return res.status(400).send({status:false, msg:"plz provide email ..!!"})

        if(! /^\w+([\.-]?\w)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) return res.status(400).send({status:false, msg:"plz provide a valid email"})

        const isEmailUnique = await internModel.findOne({email})

        if(isEmailUnique) return res.status(409).send({status:false, msg:"EMAIL already exist "})
        
        if(!isValid(mobile)) return res.status(400).send({status:false, msg:"plz provide mobile no...!!"})

        if(!/^[6-9]\d{9}$/.test(mobile)) return res.status(400).send({status:false , mag:" plz provide a valid mobilr now...!"})
        
        const isMobileUnique = await internModel.findOne({mobile})

        if(isMobileUnique) return res.status(409).send({status:false, msg:"mobile already exist "})


        let collegeData = await collegeModel.findOne({ name: collegeName })

        if(!collegeData) return res.status(404).send({status:false, msg:`no college found ${collegeName}`}) 

        let id = collegeData._id

        data.collegeId = id

        delete data.collegeName 
       
        let save = await internModel.create(data)

        res.status(201).send({ status: true, data: save })
    } catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }
}



module.exports.createIntern = createIntern
