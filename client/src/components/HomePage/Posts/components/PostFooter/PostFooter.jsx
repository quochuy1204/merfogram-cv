import React from 'react';
import FormComment from '../../../../Comment/FormComment/FormComment';
import ListComment from '../../../../Comment/ListComment/ListComment';
import moment from 'moment';
import './postfooter.css'

function PostFooter({ post }) {
    return (
        <div className="post-footer-container">
            {
                post.isHidden === true || post.isDeleted === true
                    ?
                    ''
                    :
                    <>
                        {/* Render ra Component ListComment và truyền vào props là post (chứa tất cả thông tin của post đó) */}
                        <ListComment post={post} />
                        <div style={{ borderBottom: '1px solid #DDDDDD', paddingBottom: '10px' }} className="post-body-timestamp">
                            <span className="timestamp">
                                {/* Render ra ngày tạo ra post */}
                                {moment(post.createdAt).fromNow()}
                            </span>
                        </div>
                        {/* Phần cuối cùng của 1 post là render ra form comment để người dùng nhập vào comment cho post đó
                và truyền vào props là post
            */}
                        <FormComment post={post} />
                    </>
            }

        </div>
    );
}

export default PostFooter;