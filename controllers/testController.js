
const testController = {
    test: async (req, res) => {
        try {

        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
}

module.exports = testController