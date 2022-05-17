export const isMatch = (password, confirm_password) => {
    if (confirm_password === password) return true
    return false
}

export const minLength8 = (data) => {
    if (data.length < 8) return true
    return false
}

export const isEmpty = (data) => {
    if (!data) return true
    return false
}