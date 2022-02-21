import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import './editinformation.css'
import { updateUserProfile } from '../../redux/actions/profileAction'
import Avarta from '../Avarta/Avarta'

function EditInformation({ user, setEdit }) {
    // Tạo initialState object với các attribute
    const initialState = {
        full_name: '',
        website: '',
        story: '',
        email: '',
        mobile: '',
        gender: ''
    }

    // Khởi tạo state userInformation
    const [userInformation, setUserInformation] = useState(initialState)

    // Lấy các giá trị tương ứng có trong state userInformation ra để call
    const { full_name, website, story, email, mobile, gender } = userInformation

    // Khởi tạo state avarta
    const [avarta, setAvarta] = useState('')

    // Lấy về state authentication từ Store
    const { authentication } = useSelector(state => state)

    // Dùng hàm dispatch()
    const dispatch = useDispatch()

    // Dùng hàm useEffect()
    // Hàm này sẽ được gọi ít nhất một lần mỗi khi component được gọi
    // hoặc sẽ được gọi mỗi khi có sự thay đổi của state authentication.user
    useEffect(() => {
        //set giá trị cho state userInformation với thông tin người dùng có trong state authentication.user
        setUserInformation(authentication.user)
    }, [authentication.user])

    // Hàm này sẽ lấy ra thông tin của bức ảnh mà người dùng muốn đổi làm ảnh đại diện
    // sau đó set cho state avarta = thông tin của bức ảnh đó
    const onChangePhoto = (event) => {
        const file = event.target.files[0]
        setAvarta(file)
    }

    // Mỗi khi người dùng nhập bất kì thay đổi nào ở form input thì cập nhật lại state userInformation
    const onChangeInput = (event) => {
        const { name, value } = event.target
        setUserInformation({ ...userInformation, [name]: value })
    }

    // Hàm submit form
    const onSubmit = (event) => {
        event.preventDefault()
        dispatch(updateUserProfile({ userInformation, avarta, authentication, setEdit }))
    }

    return (
        <div className="edit_profile">
            <form onSubmit={onSubmit} autoComplete="off" autoCorrect="off" >
                <div className="infor-avarta">
                    <Avarta size="large-avarta" src={avarta ? URL.createObjectURL(avarta) : authentication.user.photo} alt="Avarta" />
                    <span className="overlay">
                        <i className="fas fa-camera" />
                        <p>Change Avarta</p>
                        <input type="file" name="file" id="file_up" accept="image/*" onChange={onChangePhoto} ></input>
                    </span>
                </div>

                <div className="form-group">
                    <label htmlFor="full_name">Name</label>
                    <div className="position-relative">
                        <input className="form-control" type="text" name="full_name" value={full_name} id="full_name" onChange={onChangeInput} autoComplete="off" />
                        {/* <small className="position-absolute" style={{ top: '100%', right: '5px' }}>Help people discover your account by using the name you're known by: either your full name, nickname, or business name.</small> */}
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="website">Website</label>
                    <input className="form-control" type="text" name="website" value={website} id="website" onChange={onChangeInput} />
                </div>

                <div className="form-group">
                    <label htmlFor="story">Bio</label>
                    <textarea className="form-control" type="text" name="story" value={story} id="story" onChange={onChangeInput} />
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input disabled className="form-control" type="email" name="email" value={email} id="email" onChange={onChangeInput} />
                </div>

                <div className="form-group">
                    <label htmlFor="mobile">Phone Number</label>
                    <input className="form-control" type="text" name="mobile" value={mobile} id="mobile" onChange={onChangeInput} />
                </div>

                <div className="form-group">
                    <label htmlFor="gender">Gender</label>
                    <div className="input-group-prepend px-0 mb-4">
                        <select name="gender" id="gender" value={gender} className="form-select text-capitalize" onChange={onChangeInput}>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Prefer Not To Say</option>
                        </select>
                    </div>
                </div>

                <div className="button">
                    <button className="btn btn-primary" type="submit">Submit</button>
                    <button className="btn btn-danger" onClick={() => setEdit(false)}>Cancel</button>
                </div>
            </form>
        </div>
    );
}

export default EditInformation;