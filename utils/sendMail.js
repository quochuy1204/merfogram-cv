const nodemailer = require('nodemailer')

const { MERFOGRAM_GMAIL, MERFOGRAM_GMAIL_PASSWORD } = process.env

const transporter = nodemailer.createTransport({
    service: 'gmail',
    type: "SMTP",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: MERFOGRAM_GMAIL,
        pass: MERFOGRAM_GMAIL_PASSWORD
    }
})

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

    transporter.sendMail(mailOptions, (error, infor) => {
        if (error) {
            console.log(error)
        } else {
            console.log('Email sent successfully. ')
        }
    })
}

module.exports = sendMail