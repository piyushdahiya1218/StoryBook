const mongoose = require('mongoose')

const connectDB = async() => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useUnifiedTopology: true,
        })
        console.log(`MongoDB connected : ${conn.connection.host}`)
    } catch (e) {
        console.error(e)
        process.exit(1)
    }
}

module.exports = connectDB