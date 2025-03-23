const Topic = require('../models/topicSchema')
const slugify = require('slugify')

const createTopic = async (req, res) => {
  const { name, description } = req.body
  const slug = slugify(name, { lower: true, strict: true })
  try {
    const existingTopic = await Topic.findOne({ slug })
    if (existingTopic) {
      return res.status(400).json({ message: 'Topic already exists' })
    }
    const topic = await Topic.create({ name, description, slug })
    res.status(201).json(topic)
  } catch (error) {
    res.status(500).json(error)
  }
}
const getAllTopics = async (req, res) => {
  try {
    const topics = await Topic.find().sort({ createdAt: -1 })
    res.status(200).json(topics)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const getTopicDetails = async (req, res) => {
  const { slug } = req.params
  console.log(slug)
  try {
    const topic = await Topic.findOne({ slug })
    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' })
    }
    res.status(200).json(topic)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const updateTopic = async (req, res) => {
  const { name, description } = req.body
  const { id } = req.params
  const slug = slugify(name, { lower: true, strict: true })

  try {
    const existingTopic = await Topic.findById(id)
    if (!existingTopic) {
      return res.status(404).json({ message: 'Topic not found' })
    }

    existingTopic.name = name
    existingTopic.description = description
    existingTopic.slug = slug

    await existingTopic.save()

    res.status(200).json(existingTopic)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const deleteTopic = async (req, res) => {
  const { id } = req.params
  try {
    const existingTopic = await Topic.findById(id)
    if (!existingTopic) {
      return res.status(404).json({ message: 'Topic not found' })
    }
    await existingTopic.deleteOne()
    res.status(200).json({ message: 'Topic deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = {
  createTopic,
  getAllTopics,
  updateTopic,
  deleteTopic,
  getTopicDetails
}
