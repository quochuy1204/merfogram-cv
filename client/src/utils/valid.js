// const valid = ({ full_name, user_name, email, password }) => {
//     const error = {}
//     if (!validateEmail(email)) {
//         error.email = "Enter a valid email address."
//     }

//     if (full_name.length > 30) {
//         error.full_name = "Enter a name under 30 characters."
//     }

//     if (user_name.replace(/ /g, '').length > 30) {
//         error.user_name = "Enter a username under 30 characters."
//     }

//     if (password.length < 8) {
//         error.password = "Please create a new one with more than 8 characters."
//     }

//     return {
//         errorMessage: error,
//         errorLength: Object.keys(error).length
//     }
// }

// function validateEmail(email) {
//     // eslint-disable-next-line no-useless-escape
//     const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
//     return re.test(email);
// }

// export default valid

const valid = ({ full_name, user_name, email, password }) => {
    const err = {}

    if (!full_name) {
        err.full_name = "Enter a name."
    } else if (full_name.length > 30) {
        err.full_name = "Enter a name under 30 characters."
    }

    if (!user_name) {
        err.user_name = "Enter a username"
    } else if (user_name.replace(/ /g, '').length > 20) {
        err.user_name = "Enter a username under 20 characters."
    }

    if (!email) {
        err.email = "Enter an email."
    } else if (!validateEmail(email)) {
        err.email = "Enter a valid email address."
    }

    if (!password) {
        err.password = "Enter a password"
    } else if (password.length < 8) {
        err.password = "Please create a password with more than 8 characters."
    }

    return {
        errMsg: err,
        errLength: Object.keys(err).length
    }
}



function validateEmail(email) {
    // eslint-disable-next-line
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

export default valid