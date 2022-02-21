const authenticationAdmin = async (req, res, next) => {
    try {
        const user = req.user

        if (!user) {
            return res.status(400).json({ message: "Invalid account." })
        }

        if (user.role !== 1) {
            return res.status(400).json({ message: "Administrator resouces." })
        }

        req.user = user

        next()
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

module.exports = authenticationAdmin