const notifyModel = require('../models/notifyModel')

const notifyController = {
    createNotify: async (req, res) => {
        try {
            const { recognize_id, type, recipents, text, caption, url, image } = req.body

            if (recipents.includes(req.user._id.toString())) return;

            const notify = new notifyModel({
                recognize_id, type, recipents, text, caption, url, image, user: req.user._id
            })

            await notify.save()

            return res.json({
                notify
            })
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },
    deleteNotify: async (req, res) => {
        try {
            const notify = await notifyModel.findOneAndDelete({
                recognize_id: req.params.id, url: req.query.url, user: req.user._id, recipents: [req.query.recipents]
            })

            if (!notify) {
                return;
            }

            return res.json({
                message: 'Deleted notify.',
                notify
            })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    },
    getNotifies: async (req, res) => {
        try {
            const notifies = await notifyModel.find({ recipents: req.user._id })
                .sort("-createdAt isRead").populate("user", "photo user_name isBlocked")

            res.json({ notifies })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    },
    isReadNotify: async (req, res) => {
        try {
            const notifies = await notifyModel.findOneAndUpdate({ _id: req.params.id }, {
                isRead: true
            })

            return res.json({ notifies })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    },
    deleteAllNotifies: async (req, res) => {
        try {
            const notifies = await notifyModel.deleteMany({ recipents: req.user._id })

            return res.json({ notifies })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    },
    markReadAll: async (req, res) => {
        try {
            const notify = await notifyModel.findOneAndUpdate({ _id: req.params.id }, {
                isRead: true
            })

            return res.json({ notify })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }
}

module.exports = notifyController