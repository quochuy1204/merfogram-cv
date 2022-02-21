require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const SocketServer = require('./socketServer')
const path = require('path')

const app = express();

// Sử dụng function json() có sẵn trong express làm middleware
// tất cả request và respone chỉ nhận dữ liệu dưới dạng json
app.use(express.json());

// Sử dụng cors() function làm middleware 
app.use(cors());

// Sử dụng cookie-parser() function làm middelware
// Phân tích lại cú pháp của cookie được gửi lên từ client cho dễ đọc
app.use(cookieParser());

//Socket IO
const http = require('http').createServer(app)
const io = require('socket.io')(http)
io.on('connection', (socket) => {
    SocketServer(socket)
})

// Set up Router
app.use('/api', require('./routes/authenticationRoute'));
app.use('/api', require('./routes/userRoute'));
app.use('/api', require('./routes/testRoute'));
app.use('/api', require('./routes/postRoute'));
app.use('/api', require('./routes/commentRoute'))
app.use('/api', require('./routes/notifyRoute'))
app.use('/api', require('./routes/messageRouter'))
app.use('/api', require('./routes/adminRoute'))

// Cấu hình cho connection MongoDB
const URI = process.env.MONGODB_URL

mongoose.connect(URI, function (error) {
    if (error) {
        throw error;
    }
    console.log("Connected to MongoDB!")
})

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'))
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'))
    })
}

// Sử dụng biên PORT được cung cấp bởi Hosting Platform hoặc
// dùng port 8080 ở local environemnt development
const port = process.env.PORT || 5000;

http.listen(port, () => {
    console.log("Server running on port: ", port);
});