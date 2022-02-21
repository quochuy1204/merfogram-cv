const conversationModel = require('../models/conversationModel')
const messageModel = require('../models/messageModel')

class APIfeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    paginating() {
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 9;
        const skip = (page - 1) * limit;
        this.query = this.query.skip(skip).limit(limit);
        return this;
    }
}

const messageController = {
    createMessage: async (req, res) => {
        try {
            const { recipent, textMessage, media } = req.body

            if (!recipent || (!textMessage.trim() && media.length === 0)) return;

            const newConversation = await conversationModel.findOneAndUpdate({
                $or: [
                    { recipents: [req.user._id, recipent] },
                    { recipents: [recipent, req.user._id] }
                ]
            }, {
                recipents: [req.user._id, recipent],
                textMessage,
                media
            }, {
                new: true,
                upsert: true
            })

            const newMessage = new messageModel({
                conversation: newConversation._id,
                sender: req.user._id,
                recipent,
                textMessage,
                media
            })

            await newMessage.save()

            res.json({
                newConversation,
                newMessage
            })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    },
    getConversations: async (req, res) => {
        try {
            const features = new APIfeatures(conversationModel.find({
                recipents: req.user._id
            }), req.query).paginating()

            const conversations = await features.query.sort('-updatedAt').populate('recipents', 'photo user_name full_name isBlocked')

            res.json({
                conversations,
                result: conversations.length
            })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    },
    getMessages: async (req, res) => {
        try {
            const features = new APIfeatures(messageModel.find({
                $or: [
                    { sender: req.user._id, recipent: req.params.id },
                    { sender: req.params.id, recipent: req.user._id }
                ]
            }), req.query).paginating()

            const messages = await features.query.sort('-createdAt')

            res.json({
                messages,
                result: messages.length
            })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    },
    deleteMessage: async (req, res) => {
        try {
            const message = await messageModel.findOneAndDelete({ _id: req.params.id, sender: req.user._id })

            res.json({ message: "Unsend message!", message })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    },
    deleteConversation: async (req, res) => {
        try {
            const newConversation = await conversationModel.findOneAndDelete({
                $or: [
                    { recipents: [req.user._id, req.params.id] },
                    { recipents: [req.params.id, req.user._id] }
                ]
            })

            await messageModel.deleteMany({
                conversation: newConversation._id
            })

            res.json({
                message: "Deleted inbox chat."
            })
        } catch (error) {
            return res.status(500).json({
                message: error.message
            })
        }
    }
}

module.exports = messageController