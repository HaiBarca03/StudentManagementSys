const Complain = require('../models/complainSchema.js')

const complainCreate = async (req, res) => {
  try {
    const userType = req.user.role
    const complain = new Complain({ ...req.body, userType: userType })
    const result = await complain.save()
    res.send(result)
  } catch (err) {
    res.status(500).json(err)
  }
}

const complainList = async (req, res) => {
  try {
    let complains = await Complain.find({ school: req.params.id }).populate({
      path: 'user',
      select: 'name'
    })
    if (complains.length > 0) {
      res.send(complains)
    } else {
      res.send({ message: 'No complains found' })
    }
  } catch (err) {
    res.status(500).json(err)
  }
}

module.exports = { complainCreate, complainList }
