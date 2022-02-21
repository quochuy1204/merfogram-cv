export const checkAvarta = (file) => {
    let error = ""

    if (!file) {
        return error = "Choose an image."
    }

    if (file.size > 5242880) {
        return error = "File too large."
    }

    if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
        return error = "File format is not valid. The maximun size is 5MB"
    }

    return error;
}

// Hàm gửi ảnh lên server cloudinary
export const imageUpload = async (images) => {
    // khởi tạo array imgArr
    let imgArr = [];

    // Dùng vòng lặp for duyệt qua các phần tử có trong mảng images
    for (const item of images) {

        // Với mỗi phần tử tạo mới một formData và thêm vào các trường như file, update_preset, cloud_name
        const formData = new FormData()
        formData.append("file", item)
        formData.append("upload_preset", "lmhglub6")
        formData.append("cloud_name", "hcm-city-university-of-education-and-technology")

        // Gửi POST request về server của cloudinary
        const res = await fetch("https://api.cloudinary.com/v1_1/hcm-city-university-of-education-and-technology/image/upload", {
            method: 'POST',
            body: formData
        })

        // Lấy giá trị trả về dưới dạng là json
        const data = await res.json()

        // Thêm vào mảng imgArr một object mới có 2 trường là public_id và url của bức hình vừa tải lên server cloudinary
        imgArr.push({ public_id: data.public_id, url: data.secure_url })
    }
    return imgArr;
}