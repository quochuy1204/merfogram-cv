const nodemailer = require('nodemailer')

const { MERFOGRAM_GMAIL, MERFOGRAM_GMAIL_PASSWORD } = process.env

let transporter = nodemailer.createTransport({
    service: 'gmail',
    type: "SMTP",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: MERFOGRAM_GMAIL,
        pass: MERFOGRAM_GMAIL_PASSWORD
    },
    tls: {
        // do not fail on invalid certs
        rejectUnauthorized: false,
    },
})

// let transporter = nodemailer.createTransport({
//     host: "smtp.gmail.com",
//     port: 465,
//     secure: true,
//     auth: {
//         type: "OAuth2",
//         user: "merfogram@gmail.com",
//         clientId: "451977096038-j696kqaq6kkgvd0qvq9p315huvvmsc5k.apps.googleusercontent.com",
//         clientSecret: "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",
//         refreshToken: "1//04jVB-V7zJllACgYIARAAGAQSNwF-L9IrD6K38ouRdr_NM1tpNz7UQzBuFkTVqNLUnGZODMSUZFMVwzw-FrHIfjRY_0nBP_OYeLs",
//         accessToken: "ya29.a0ARrdaM_0juHmRIj-6ZBwL543nl86AoNPvQerfNXexxQUA3-KjXBQ2HpWh--t4oPQ-jhnPQRHDKnnnu9TsrnfBbUeer1FaWeL3ZD5Uiu1h7viABUceWL8J5ywi2kGgCUsSzSnpI74XMDCnP7f9f1ou3TowtZw",
//         expires: 3599,
//     },
// });

const sendMail = (to, url, text, title) => {
    const text2 = text.toLowerCase()

    const mailOptions = {
        from: MERFOGRAM_GMAIL,
        to: to,
        subject: `Merfogram - ${text2}`,
        html: `<div
        style="width: 600px; height: 500px;margin: auto;font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;">

        <div
            style="line-height: 2; letter-spacing: 0.5px; position: relative; padding: 10px 20px; width: 540px;min-height: 360px; margin: auto; border: 1px solid #DDD; border-radius: 14px;">
            <h3>Welcome to Merfogram - an awesome social network!</h3>
            <p>${title}
                <br>
                If you are not doing that action, please feel free to ignore this email. <br>
                Otherwise, click on the button below in order to ${text2}.
            </p>

            <a style="cursor: pointer;text-align: center; display: block; width: 160px; margin: 30px auto; padding: 10px 10px; border: 1px solid #DDD; border-radius: 14px; color: #262626; text-decoration: none; font-size: 1rem; font-weight: 500;"
                href="${url}">${text}</a>

            <span style="display: block;">If you have any problem, please contact via: <span
                    style="color: #4D96FF;">merfogram@gmail.com</span></span>
            <span style="display: block;">Thank you for your time!</span>
        </div>
    </div>`

    }

    transporter.verify((error, success) => {
        if (error) {
            console.log(error)
        } else {
            console.log("Server is ready to take our message.")
        }
    })

    transporter.sendMail(mailOptions, (error, infor) => {
        if (error) {
            console.log(error)
        } else {
            console.log('Email sent successfully. ')
        }
    })
}

module.exports = sendMail