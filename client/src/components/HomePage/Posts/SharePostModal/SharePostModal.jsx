import React, { useState, useEffect } from 'react';
import './sharepostmodal.css'
import { useSelector, useDispatch } from 'react-redux'

import {
    FacebookShareButton, FacebookIcon,
    LineShareButton, LineIcon,
    TelegramShareButton, TelegramIcon,
    TwitterShareButton, TwitterIcon,
    WhatsappShareButton, WhatsappIcon
} from 'react-share'

function SharePostModal(props) {
    const { homepagePost } = useSelector(state => state)

    // Khởi tạo state url để chứa url dùng cho việc truyền props vào share button API
    const [url, setUrl] = useState('')

    const dispatch = useDispatch()

    // Mỗi khi Share Post Modal được render thì set state url bằng giá trị của state url trong store
    useEffect(() => {
        setUrl(homepagePost.sharePost.url)
    }, [homepagePost.sharePost.url])

    // Hàm xử lý khi người dùng nhấn vào nút close 
    const handleCloseShareModal = () => {
        // Gửi action SHARE_POST lên store, cập nhật lại state sharePost
        // thành rỗng để đóng share post modal 
        dispatch({
            type: 'SHARE_POST',
            payload: {}
        })
    }
    return (
        <div className="share-post-container">
            <div className="share-post">
                <div className="share-post-header">
                    <span className="header-span">Share to</span>
                    <span onClick={handleCloseShareModal} role="button" className="close-button">&times;</span>
                </div>

                <div className="share-post-body">
                    <div className="share-post-detail">
                        <div className="share-button">
                            <FacebookShareButton url={url} >
                                <FacebookIcon size={32} round={true} />
                            </FacebookShareButton>
                        </div>

                        <span className="title-span">Share to Facebook</span>
                    </div>

                    <div className="share-post-detail">
                        <div className="share-button">
                            <LineShareButton url={url}>
                                <LineIcon size={32} round={true} />
                            </LineShareButton>
                        </div>

                        <span className="title-span">Share to Line</span>
                    </div>

                    <div className="share-post-detail">
                        <div className="share-button">
                            <TelegramShareButton url={url}>
                                <TelegramIcon size={32} round={true} />
                            </TelegramShareButton>
                        </div>

                        <span className="title-span">Share to Telegram</span>
                    </div>

                    <div className="share-post-detail">
                        <div className="share-button">
                            <TwitterShareButton url={url}>
                                <TwitterIcon size={32} round={true} />
                            </TwitterShareButton>
                        </div>

                        <span className="title-span">Share to Twitter</span>
                    </div>

                    <div className="share-post-detail">
                        <div className="share-button">
                            <WhatsappShareButton url={url}>
                                <WhatsappIcon size={32} round={true} />
                            </WhatsappShareButton>
                        </div>

                        <span className="title-span">Share to Whatsapp</span>
                    </div>

                </div>
            </div>
        </div >
    );
}

export default SharePostModal;