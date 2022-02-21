export const GLOBALTYPES = {
    SOCKET: 'SOCKET'
}

export const editData = (data, id, post) => {
    const newData = data.map(item => (item._id === id ? post : item))

    return newData
}

export const deleteData = (data, id) => {
    const newData = data.filter(item => item._id !== id)

    return newData;
}