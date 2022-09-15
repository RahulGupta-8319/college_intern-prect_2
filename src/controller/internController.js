const internModel = require('../models/internModel')
const collegeModel = require('../models/collegeModel')

const emailValidation = function (email) {
  let regexForEmail = /^\w+([\.-]?\w)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
  return regexForEmail.test(email)
}

const mobileValidation = function (mobile) {
  let regexForMobile = /^[6-9]\d{9}$/
  return regexForMobile.test(mobile)
}

const stringChecking = function (data) {
  if (typeof data !== 'string') {
    return false;
  } else if (typeof data === 'string' && data.trim().length == 0) {
    return false;
  } else {
    return true;
  }
}

const intern = async function (req, res) {
  try {
    let data = req.body
    if (Object.keys(data) === 0) {
      return res.status(400).send({ status: false, message: "Please provied required details" })
    }
    let { name, email, mobile, collegeName } = data
    if (!stringChecking(name)) {
      return res.status(400).send({ status: false, msg: "Please Provide your name" })
    }
    if (!stringChecking(email)) {
      return res.status(400).send({ status: false, message: "Please provie a email id" })
    }
    if (!stringChecking(mobile)) {
      return res.status(400).send({ status: false, message: "Please provie a mobile number" })
    }
    if (!emailValidation(email)) {
      return res.status(400).send({ status: false, message: "Please Use a  Valid email Id" })
    }
    if (!mobileValidation(mobile)) {
      return res.status(400).send({ status: false, message: "Enter a valid moblie number" })
    }
    const duplicateemail = await internModel.findOne({ email: email })
    if (duplicateemail) {
      return res.status(409).send({ status: false, msg: "This Email Id is already register" })
    }
    const duplicatePhone = await internModel.findOne({ mobile: mobile })
    if (duplicatePhone) {
      return res.status(409).send({ status: false, message: "This mobile is already registerd" })
    }
    let collegeData = await collegeModel.findOne({ name: collegeName })
    if (!collegeData) return res.status(404).send({ status: false, message: `No college found ${collegeName}` })
    let Id = collegeData._id
    data.collegeId = Id
    delete data.collegeName

    let savedata = await internModel.create(data)
    return res.status(201).send({ status: true, message: "Registratin Done", data: savedata })
  }
  catch (err) {
    return res.status(500).send({ status: false, error: err.message })
  }

}

const collegeDetails = async function (req, res) {
  try {
    let queryParams = req.query
    if (Object.keys(queryParams) === 0) {
      return res.status(400).send({ status: false, message: "plz enter input for getting college details" })
    }
    let collegeName = queryParams.collegeName

    if (!stringChecking(collegeName)) return res.status(400).send({ status: false, mag: "plz enter college name" })


    // let collegeBycollegeName = await collegeModel.findOne({ collegeName }).select({ name: 1, fullName: 1, logoLink: 1 })


    // let getInternsByCollegeId = await internModel.find({ collegeId: collegeBycollegeName._id })

    // delete collegeBycollegeName._id

    // res.status(200).send({ status: true, data: collegeBycollegeName, interns: getInternsByCollegeId })

    const collegeBycollegeName = await collegeModel.findOne({ name: collegeName })

    const collegeId = collegeBycollegeName._id

    const getInternsByCollegeId = await internModel.find({ collegeId }).select({ name: 1, email: 1, mobile: 1 })


    const { name, fullName, logoLink } = collegeBycollegeName

    const data = {
      name: name,
      fullName: fullName,
      logoLink: logoLink,
      inter: getInternsByCollegeId

    }

    res.status(200).send({ status: true, data: data })

  } catch (error) {
    res.status(500).send({ status: false, msg: error.message })
  }

}


module.exports.intern = intern
module.exports.collegeDetails = collegeDetails