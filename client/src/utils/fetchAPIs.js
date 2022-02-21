import axios from 'axios'

// getAPIs function để gửi get request về server
export const getAPIs = async (url, token) => {
    // Dùng axios gửi get request lên server rồi đón response gửi về 
    const dataAPI = await axios.get(`/api/${url}`, {
        headers: {
            Authorization: token
        }
    })

    return dataAPI;
}


export const postAPIs = async (url, data, token) => {
    const dataAPI = await axios.post(`/api/${url}`, data, {
        headers: {
            Authorization: token
        }
    })

    return dataAPI;
}

export const putAPIs = async (url, data, token) => {
    const dataAPI = await axios.put(`/api/${url}`, data, {
        headers: {
            Authorization: token
        }
    })

    return dataAPI;
}

export const patchAPIs = async (url, data, token) => {
    const dataAPI = await axios.patch(`/api/${url}`, data, {
        headers: {
            Authorization: token
        }
    })

    return dataAPI;
}

export const deleteAPIs = async (url, token) => {
    const result = await axios.delete(`/api/${url}`, {
        headers: {
            Authorization: token
        }
    })

    return result;
}