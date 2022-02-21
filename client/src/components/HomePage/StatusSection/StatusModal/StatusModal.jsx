import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import './statusmodal.css'
import Avarta from '../../../Avarta/Avarta';
import { createPost } from '../../../../redux/actions/postAction'

function StatusModal(props) {
    // Khởi tạo state caption cho component
    // State này sẽ chứa dữ liệu về caption mà người dùng nhập vào form create new post
    const [caption, setCaption] = useState('')

    // Khởi tạp state images cho component
    // State này sẽ chứa Array các hình ảnh mà người dùng muốn đăng tải lên post
    const [images, setImages] = useState([])

    const { authentication, socket } = useSelector(state => state)

    const dispatch = useDispatch()

    // Hàm handleCloseStatusModal dùng để đóng modal create new post khi người dùng nhấn vào nút close
    // Hàm này sẽ gọi action type STATUS để thay đổi stat status ở store
    const handleCloseStatudModal = () => {
        dispatch({
            type: 'STATUS',
            payload: false
        })
    }

    // Hàm này sẽ chạy khi có bất cứ thay đổi nào ở input caption
    const handleOnChangeCaption = (event) => {
        const value = event.target.value
        setCaption(value)
    }

    // Hàm này sẽ chạy khi có bất cứ thay đổi nào ở input images, khi người dùng thêm mới 1 hay nhiều hình ảnh
    const handleOnChangeImages = (event) => {
        // Clone lại toàn bộ thông tin của array images mà người dùng nhận vào từ button input file
        const files = [...event.target.files]

        // Khởi tạo biến err để gán vào error message khi file hình ảnh tải lên của người dùng ko hợp lệ
        let err = ""

        // Khởi tạo Array newImages để chứa Array hình ảnh tải lên của người dùng nếu hình đó hợp lệ
        let newImages = []

        // Dùng hàm forEach chạy qua từng hình ảnh có trong array files
        files.forEach(file => {
            // Nếu không tìm thấy hình ảnh thì gán cho biến err một message
            if (!file) {
                return err = "Choose an image."
            }

            // Nếu format của file tải lên không phải là một trong những format file hợp lệ dưới đây thì gán cho biến err một message
            if (file.type !== "image/jpeg" && file.type !== "image/png" && file.type !== "image/jpg") {
                return err = "File format is not valid."
            }

            // Nếu file hợp lệ thì thêm file đó vào mảng newImages
            return newImages.push(file)
        })

        // Nếu err tồn tại một message được gán vào ở các phép thử valid trên thì gọi action ALERT 
        // để hiện lên Toast Error thông báo lỗi cho người dùng
        if (err) {
            dispatch({
                type: 'ALERT',
                payload: {
                    error: err
                }
            })
        }

        // Set stat image, clone lại toàn bộ state cũ và thêm vào tất cả phần tử trong state newImages
        setImages([...images, ...newImages])
    }

    // Hàm này sẽ chạy khi người dùng xóa đi hình ảnh trong form create new post
    // Hàm này sẽ nhận vào vị trí của hình ảnh người dùng muốn xóa trong Array state images
    const handleDeleteImage = (index) => {
        // Khởi tạo một array mới newArrImages và clone lại toàn bộ dữ liệu trong state images
        const newArrImages = [...images]

        // Dùng hàm splice xóa đi phần từ thứ index 
        newArrImages.splice(index, 1)

        // Set lại state cho state images
        setImages(newArrImages)
    }

    // Hàm này sẽ được gọi khi người dùng nhấn vào button submit form 
    const handleSubmitForm = async (event) => {
        event.preventDefault()

        // Kiểm tra xem người dùng đã thêm ảnh vào form chưa,
        // nếu chưa thì gọi action alert thông báo cho người dùng và return
        if (images.length === 0) {
            return dispatch({
                type: 'ALERT',
                payload: {
                    error: "Select an image."
                }
            })
        }

        // Nếu người dùng đã thêm ảnh thì gọi action createPost, truyền vào caption, images và state authentication
        await dispatch(createPost({ caption, images, authentication, socket }))

        // Sau khi submit form thành công thì set lại state caption và images
        setCaption('')
        setImages([])

        // Gửi action STATUS lên Reducer để set lại state STATE = false để tự động đóng modal create new post
        dispatch({
            type: 'STATUS',
            payload: false
        })
    }

    return (
        <div className="status-modal">
            <span className="close-status-modal" role="button" onClick={handleCloseStatudModal}>&times;</span>
            <form onSubmit={handleSubmitForm} className="form-status">
                <div className="status-header">
                    <h1>Create new post</h1>
                    <button id='button-create-post' type="submit" >Share</button>
                </div>

                <div className="status-body">
                    <div className="user-card">
                        <Avarta className="user-avarta" src={authentication.user.photo} size="small-avarta" />
                        <span className="user_name">{authentication.user.user_name}</span>
                    </div>

                    <textarea name="caption" value={caption} placeholder="Write a caption..." onChange={handleOnChangeCaption} />
                </div>

                <div className="show-images">
                    {
                        images.map((image, index) => (
                            <div className="show-images-item" key={index}>
                                <img className="img-thumbnail" src={URL.createObjectURL(image)} alt="Review images" />
                                <span onClick={() => handleDeleteImage(index)} className="delete-image">&times;</span>
                            </div>
                        ))
                    }
                </div>

                <div className="upload-images">
                    <div className="file-upload">
                        <i className="far fa-image" />
                        <button type="button">Select from computer</button>
                        <input type="file" name="file" id="file" multiple accept="image/*" onChange={handleOnChangeImages} />
                    </div>
                </div>
            </form>
        </div>
    );
}

export default StatusModal;