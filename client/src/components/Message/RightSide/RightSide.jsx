import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { useParams, Link, useHistory } from 'react-router-dom'

import Avatar from '../../Avarta/Avarta';
import MessageDisplay from '../MessageDisplay/MessageDisplay';

import './rightside.css'

import { imageShow, videoShow } from '../../../utils/mediaShow'
import { imageUpload } from '../../../utils/validAvartaUpload'

import { addMessage, getMessages, loadMoreMessages, deleteConversation } from '../../../redux/actions/messageAction';

import PlantGif from '../../../GIF/Plant.gif'
import Icon from '../../Icons/Icon';

import { confirmAlert } from 'react-confirm-alert'
import 'react-confirm-alert/src/react-confirm-alert.css'

function RightSide(props) {
    const [user, setUser] = useState([])

    const history = useHistory()

    const dispatch = useDispatch()

    const [textMessage, setTextMessage] = useState('')

    const { id } = useParams()

    const { authentication, message, socket } = useSelector(state => state)

    const [media, setMedia] = useState([])

    const [loadMedia, setLoadMedia] = useState(false)

    const refDisplay = useRef()
    const pageEnd = useRef()

    const [newDataMessage, setNewDataMessage] = useState([])

    const [result, setResult] = useState(9)

    const [page, setPage] = useState(0)

    const [isLoadMore, setIsLoadMore] = useState(0)

    useEffect(() => {
        const newData = message.data.find(item => item._id === id)

        if (newData) {
            setNewDataMessage(newData.messages)
            setResult(newData.result)
            setPage(newData.page)
        }
    }, [message.data, id])

    useEffect(() => {
        if (id && message.users.length > 0) {
            setTimeout(() => {
                refDisplay.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
            }, 50)

            const newUser = message.users.find(user => user._id === id)

            if (newUser) {
                setUser(newUser)
            }
        }
    }, [message.users, id])

    // H??m x??? khi ????? t???i l??n tin nh???n c???a ng?????i d??ng v???i user c?? id === id ??? params
    useEffect(() => {
        const getMessagesData = async () => {
            if (message.data.every(item => item._id !== id)) {
                await dispatch(getMessages({ authentication, id }))

                setTimeout(() => {
                    refDisplay.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
                }, 50)
            }
        }
        getMessagesData()
    }, [id, authentication, dispatch, message.data])

    //H??m x??? l?? khi c?? thay ?????i ??? file input h??nh ???nh ho???c video 
    const handleChangeMedia = (e) => {
        const files = [...e.target.files]
        let err = ""
        let newMedia = []

        files.forEach(file => {
            if (!file) return err = "Choose an image."

            if (file.size > 1024 * 1024 * 5) {
                return err = "An image or video largest size is 5Mb."
            }

            return newMedia.push(file)
        })

        if (err) {
            dispatch({
                type: 'ALERT',
                payload: {
                    error: err
                }
            })
        }

        setMedia([...media, ...newMedia])
    }

    // H??m x??? l?? khi ng?????i d??ng nh???n v??o n??t x??a image
    const handleDeleteMedia = (index) => {
        // Kh???i t???o m???t array m???i newArrImages v?? clone l???i to??n b??? d??? li???u trong state images
        const newArrImages = [...media]

        // D??ng h??m splice x??a ??i ph???n t??? th??? index 
        newArrImages.splice(index, 1)

        // Set l???i state cho state images
        setMedia(newArrImages)

    }

    // H??m x??? l?? khi ng?????i d??ng submit tin nh???n (message)
    const handleSubmitMessage = async (event) => {
        event.preventDefault()

        if (!textMessage.trim() && media.length === 0) return;

        setTextMessage('')
        setMedia([])
        setLoadMedia(true)

        let newArrayMedia = []

        if (media.length > 0) {
            newArrayMedia = await imageUpload(media)
        }

        const msg = {
            sender: authentication.user._id,
            recipent: id,
            textMessage,
            media: newArrayMedia,
            createdAt: new Date().toISOString()
        }

        setLoadMedia(false)

        await dispatch(addMessage({ authentication, socket, msg }))

        if (refDisplay.current) {
            refDisplay.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
        }
    }

    // H??m x??? l?? khi ng?????i d??ng nh???n v??o n??t t???i th??m tin nh???n c??
    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                setIsLoadMore(p => p + 1)
            }
        }, {
            threshold: 0.1
        })

        observer.observe(pageEnd.current)
    }, [setIsLoadMore])

    useEffect(() => {
        if (isLoadMore > 1) {
            if (result >= page * 9) {
                dispatch(loadMoreMessages({ authentication, page: page + 1, id }))

                setIsLoadMore(1)
            }
        }
        // eslint-disable-next-line
    }, [isLoadMore])

    // useEffect(() => {
    //     if (refDisplay.current) {
    //         refDisplay.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
    //     }
    // }, [textMessage, message.data])

    // H??m x??? l?? delete conversation
    const handleDeleteConversation = () => {
        confirmAlert({
            title: 'Delete chat',
            message: 'Are you want to delete this chat?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => {
                        dispatch(deleteConversation({ authentication, id }))

                        return history.push("/message")
                    }
                },
                {
                    label: 'No',
                    onClick: () => {
                        return
                    }
                }
            ]
        })

    }

    // H??m x??? l?? khi ng?????i d??ng nh???n Enter sau khi nh???p content c???a comment xong
    const handleEnter = async (event) => {
        // N???u ng?????i d??ng nh???n ph??m Enter nh??ng kh??ng nh???n Shift
        if (event.charCode === 13 && event.shiftKey === false) {
            // N???u ng?????i d??ng kh??ng nh???p g?? v??o message c??? th?? return 
            // V?? ????ng l???i form create reply comment n???u ng?????i d??ng ??ang ??? tr???ng th??i create reply comment
            if (!textMessage.trim() && media.length === 0) return;

            setTextMessage('')
            setMedia([])
            setLoadMedia(true)

            let newArrayMedia = []

            if (media.length > 0) {
                newArrayMedia = await imageUpload(media)
            }

            const msg = {
                sender: authentication.user._id,
                recipent: id,
                textMessage,
                media: newArrayMedia,
                createdAt: new Date().toISOString()
            }

            setLoadMedia(false)

            await dispatch(addMessage({ authentication, socket, msg }))

            if (refDisplay.current) {
                refDisplay.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
            }

            setTextMessage('')
            setMedia([])
        }
    }

    useEffect(() => {
        document.addEventListener("keydown", handleEnter, false);

        return () => {
            document.removeEventListener("keydown", handleEnter, false);
        };
    });


    return (
        <>
            <div className='message_header_right'>
                {
                    user.length !== 0 &&
                    <>
                        <Link style={{ textDecoration: 'none', color: '#262626', fontSize: '14px', fontWeight: '500' }} to={`/profile/${user._id}`}>
                            <Avatar src={user.photo} size="smaller-avarta" />
                            <span style={{ marginLeft: '6px' }}>{user.user_name}</span>
                        </Link>

                        <span onClick={handleDeleteConversation}><i style={{ color: '#8E8E8E' }} className="fas fa-trash"></i></span>
                    </>
                }
            </div >

            <div className='chat_container' style={{ height: media.length > 0 ? 'calc(100% - 320px)' : '' }}>
                <div className='chat_display' ref={refDisplay} >
                    <button style={{ marginTop: '-25px', opacity: '0' }} ref={pageEnd}>+</button>
                    {
                        newDataMessage.map((msg, index) => (
                            <div key={index}>
                                {
                                    msg.sender !== authentication.user._id &&
                                    <div className='chat_row other_message'>
                                        <MessageDisplay user={user} msg={msg} />
                                    </div>
                                }

                                {
                                    msg.sender === authentication.user._id &&
                                    <div className='chat_row you_message'>
                                        <MessageDisplay user={authentication.user} msg={msg} newDataMessage={newDataMessage} />
                                    </div>
                                }
                            </div>
                        ))
                    }

                    {
                        loadMedia &&
                        <div className='chat_row you_message'>
                            <img src={PlantGif} alt='loading-icon' />
                        </div>
                    }
                </div>
            </div>

            {/* ------Ph???n show tr?????c h??nh ???nh ho???c video ------ */}
            <div className='show_media' style={{ display: media.length > 0 ? 'grid' : 'none' }}>
                {
                    media.map((item, index) => (
                        <div key={index} id="file_media">
                            {
                                item.type.match(/video/i)
                                    ? videoShow(URL.createObjectURL(item))
                                    : imageShow(URL.createObjectURL(item))
                            }
                            <span role="button" className="delete-image" onClick={() => handleDeleteMedia(index)}>&times;</span>
                        </div>
                    ))
                }
            </div>

            <div className='chat_input_container'>
                <form className='chat_input' onSubmit={handleSubmitMessage}>
                    {/* --------Th??m icon v??o tin nh???n----- */}
                    <div className='icon_dropdown'>
                        <Icon setContent={setTextMessage} content={textMessage} />
                    </div>

                    <textarea onKeyPress={handleEnter} style={{ height: `${textMessage.length > 150 ? '48px' : '34px'}` }} id='inputMessageTextArea'
                        type="text" placeholder='Message...' value={textMessage} onChange={e => setTextMessage(e.target.value)} />

                    {/* ----N??t th??m h??nh ???nh ho???c video v??o tin nh???n message---- */}
                    <div className='file_upload'>
                        <i className="fas fa-camera-retro"></i>
                        <input type="file" name="file" id="file" multiple accept='image/*, video/*' onChange={handleChangeMedia} />
                    </div>

                    <button style={{ opacity: (textMessage || media.length > 0) ? '1' : '0.5' }} id='sendMessage' type="submit" disabled={(textMessage || media.length > 0) ? false : true} >Send</button>
                </form>
            </div>
        </>



    );
}

export default RightSide;