const collegeModel = require('../models/collegeModel')
const stringChecking = function (data) {
  if (typeof data !== 'string') {
    return false;
  } else if (typeof data === 'string' && data.trim().length == 0) {
    return false;
  } else {
    return true;
  }
}

const College = async function (req, res) {
  try {
    let data = req.body
    if (Object.keys(data) === 0) {
      return res.status(400).send({ status: false, message: "Please Provie some details" })
    }
    let name = data.name
    let fullName = data.fullName
    let logoLink = data.logoLink
    if (!stringChecking(name)) {
      return res.status(400).send({ status: false, msg: "Name must be present in the data" })
    }
    if (!stringChecking(fullName)) {
      return res.status(400).send({ status: false, msg: "Please Provide Your college Full Name" })
    }
    if (!stringChecking(logoLink)) {
      return res.status(400).send({ status: false, msg: "Logolink is mandatory" })
    }
    const duplicatename = await collegeModel.findOne({ name: name })
    if (duplicatename) {
      return res.status(400).send({ status: "false", msg: "This college name is already register" })
    }
    const savedata = await collegeModel.create(data)
    return res.status(201).send({ status: true, data: savedata, message: "College details registerd completed" })
  }
  catch (err) {
    return res.status(500).send({ msg: "Error", status: false, error: err.message })
  }
}







module.exports.College = College