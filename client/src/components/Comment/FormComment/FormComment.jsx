import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { createComment } from '../../../redux/actions/commentAction'
import './formcomment.css'


function FormComment({ children, post, onReply, setOnReply }) {

    // Khởi tạo state content, để chứa content muốn comment mà người dùng nhập vào
    // textarea
    const [content, setContent] = useState('')

    const { authentication, socket } = useSelector(state => state)

    const dispatch = useDispatch()

    // Hàm xử lý khi có sự thay đổi của textarea khi người dùng thay đổi content
    const handleOnChangeContent = (event) => {
        const newContent = event.target.value

        setContent(newContent)
    }

    // Hàm xử lý khi người dùng nhấn Enter sau khi nhập content của comment xong
    const handleEnter = async (event) => {
        // Nếu người dùng nhấn phím Enter nhưng không nhấn Shift
        if (event.charCode === 13 && event.shiftKey === false) {
            // Nếu người dùng không nhập gì vào content cả thì return 
            // Và đóng lại form create reply comment nếu người dùng đang ở trạng thái create reply comment
            if (!content.trim()) {
                if (setOnReply) {
                    return setOnReply(false)
                }
                return
            }

            // Nếu người dùng đã nhập content thì tiến hành gửi action createComment lên store
            // truyền vào các params: post(bao gồm tất cả thông tin của post muốn comment (hoặc reply comment))
            //                        authentication (bao gồm tất cả thông tin của người dùng như và token)
            //                        content (là content của comment mà người dùng nhập vào)
            //                        onReply (chứa thông tin của comment mà người dùng muốn reply)
            await dispatch(createComment({ post, authentication, content, onReply, socket }))

            // Sau khi createComment thành công thì set lại state content = rỗng
            setContent('')

            // Nếu người dùng đang ở trạng thái reply comment ( tức form reply comment đang hiện thì
            // thì set lại state onReply = false để đóng lại form reply)
            if (setOnReply) {
                return setOnReply(false)
            }
        }

        if (event.keyCode === 27) {
            if (setOnReply) {
                return setOnReply(false)
            }
        }
    }

    useEffect(() => {
        document.addEventListener("keydown", handleEnter, false);

        return () => {
            document.removeEventListener("keydown", handleEnter, false);
        };
    });

    const handleSubmitForm = async (event) => {
        event.preventDefault()

        if (!content.trim()) {
            if (setOnReply) {
                return setOnReply(false)
            }
            return;
        }

        await dispatch(createComment({ post, authentication, content, onReply, socket }))

        setContent('')

        if (setOnReply) {
            return setOnReply(false)
        }
    }

    return (
        <div className="form-comment-container">
            {children}

            <form className="form-input-comment" onSubmit={handleSubmitForm}>
                <textarea autoFocus={onReply ? true : false} onKeyPress={handleEnter} style={{ height: `${content.length > 150 ? '100px' : '45px'}` }} className="input-content textarea" required type="text" placeholder="Add a comment" value={content} onChange={handleOnChangeContent} />

                {
                    onReply
                        ?
                        ''
                        :
                        <button style={{ opacity: `${content ? '1' : '0.5'}` }} disabled={content ? false : true} className="button-post-comment" type="submit" >Post</button>
                }
            </form>
        </div>
    );
}

export default FormComment;