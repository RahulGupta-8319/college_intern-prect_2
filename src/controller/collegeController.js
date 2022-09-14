const { mongo, default: mongoose } = require("mongoose")
const collegeModel = require("../models/collegeModel")
const internModel = require("../models/internModel")

const isValid = function (value) {
    if (typeof value === 'undefined' || typeof value === null) return false
    if (typeof value === 'string' && value.trim().length == 0) return false
    return true

}
const isValidRequestBody = function (req) {
    return Object.keys(req).length > 0
}

const isValidObjectId = function (id) {
    return mongoose.Schema.Types.isValid(id)
}



// ### POST /functionup/colleges
// - Create a college - a document for each member of the group
// - The logo link will be provided to you by the mentors. This link is a s3 (Amazon's Simple Service) url. Try accessing the link to see if the link is public or not.

//   `Endpoint: BASE_URL/functionup/colleges`

const createCollleges = async function (req, res) {
    try {
        let data = req.body
        let { name, fullName, logoLink } = data

        if (!isValidRequestBody(data)) return res.status(400).send({ status: false, msg: "plz provide college data" })
        if (!isValid(name)) return res.status(400).send({ status: false, msg: "name is required" })
        if (!isValid(fullName)) return res.status(400).send({ status: false, msg: "fullName is required" })
        if (!isValid(logoLink)) return res.status(400).send({ status: false, msg: "logoLink is required" })

        const nameUnique = await collegeModel.findOne({ name: name })
        if (nameUnique) return res.status(400).send({ status: false, msg: "name already exist" })

        let college = await collegeModel.create(data)
        res.status(201).send({ status: true, data: college })
    } catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }
}


// ### GET /functionup/collegeDetails
// - Returns the college details for the requested college (Expect a query parameter by the name `collegeName`. 
//This is anabbreviated college name. For example `iith`)
// - Returns the list of all interns who have applied for internship at this college.
// - The response structure should look like [this](#college-details)

const collegeDetails = async function (req, res) {
    try {
        let queryParams = req.query

        let collegeName = queryParams.collegeName

        if(!isValidRequestBody(queryParams)) return res.status(400).send({status:false, mag:"plz enter input for getting college details"})

        if(!isValid(collegeName)) return res.status(400).send({status:false, mag:"plz enter college name"})


        let collegeBycollegeName = await collegeModel.findOne({ collegeName }).select({ name: 1, fullName: 1, logoLink: 1 })


        let getInternsByCollegeId = await internModel.find({ collegeId: collegeBycollegeName._id })

        delete collegeBycollegeName._id

        res.status(200).send({ status: true, data: collegeBycollegeName, interns: getInternsByCollegeId })

    //    const collegeBycollegeName = await collegeModel.findOne({name:collegeName})

    //    const collegeId = collegeBycollegeName._id

    //    const getInternsByCollegeId = await internModel.find({collegeId}).select({name:1, email:1,mobile:1})


    //    const {name , fullName, logoLink } = collegeBycollegeName

    //    const data = {
    //               name : name,
    //               fullName : fullName,
    //               logoLink : logoLink,
    //               inter : getInternsByCollegeId

    //    }

    //    res.status(200).send({ status: true, data:data})

    } catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }

}

module.exports = {
    createCollleges,
    collegeDetails
}