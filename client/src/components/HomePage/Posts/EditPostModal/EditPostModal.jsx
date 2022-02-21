import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import Avarta from '../../../Avarta/Avarta';
import './editpostmodal.css'
import { updatePost } from '../../../../redux/actions/postAction'

function EditPostModal(props) {
    const [caption, setCaption] = useState('')

    const { authentication, homepagePost } = useSelector(state => state)

    const [images, setImages] = useState([])

    const dispatch = useDispatch()

    // Mỗi khi modal Edit Post được gọi thì setCaption = caption của post muốn edit
    // setImages = images của post muốn edit
    useEffect(() => {
        setCaption(homepagePost.editPost.caption)
        setImages(homepagePost.editPost.images)
    }, [homepagePost.editPost])

    // Hàm handle close edit post modal
    // Khi người dùng nhấn vào button close 
    // thì gửi action OPEN_EDIT_MODAL lên store cập nhật lại state openEditModal = false
    const handleCloseStatudModal = () => {
        dispatch({
            type: 'OPEN_EDIT_MODAL',
            payload: false
        })

        // Đồng thời gửi action EDIT_POST lên store để xóa đi thông tin của post edit đã lưu trên state
        // editPost trước đó
        dispatch({
            type: 'EDIT_POST',
            payload: {}
        })

    }

    const handleOnChangeCaption = (event) => {
        const value = event.target.value
        setCaption(value)
    }

    const handleSubmitForm = async (event) => {
        event.preventDefault()

        let err;

        if (images.length === 0) {
            return err = "Choose your image."
        }

        if (err) {
            dispatch({
                type: 'ALERT',
                payload: {
                    error: err
                }
            })
        }

        await dispatch(updatePost({ caption, images, homepagePost, authentication }))

        setCaption('')
        setImages([])

        dispatch({
            type: 'OPEN_EDIT_MODAL',
            payload: false
        })

        dispatch({
            type: 'EDIT_POST',
            payload: {

            }
        })
    }
    return (
        <div className="status-modal">
            <span className="close-status-modal" role="button" onClick={handleCloseStatudModal}>&times;</span>
            <form onSubmit={handleSubmitForm} className="form-status">
                <div className="status-header">
                    <h1>Update post</h1>
                    <button type="submit" className="button-create-post">Save</button>
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
                                <img className="img-thumbnail" src={image.url} alt="Review images" />
                            </div>
                        ))
                    }
                </div>
            </form>
        </div>
    );
}

export default EditPostModal;