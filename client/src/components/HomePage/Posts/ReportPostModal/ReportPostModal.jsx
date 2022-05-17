import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

//Import Action
import { reportPost } from '../../../../redux/actions/postAction'

//Import CSS
import './reportpostmodal.css'

function ReportPostModal() {
    const postDetail = useSelector(state => state.homepagePost.openReportModal.data)

    const { authentication } = useSelector(state => state)

    const dispatch = useDispatch()

    const handleCloseReportModal = () => {
        dispatch({
            type: 'OPEN_REPORT_MODAL',
            payload: {
                open: false,
                data: {}
            }
        })
    }

    const handleOnClickReport = (report_content) => {
        dispatch(reportPost({ authentication, postDetail, report_content }))
    }

    return (
        <div className='report-post-modal'>
            <span className='close-report-modal' role='button' onClick={handleCloseReportModal}>&times;</span>

            <div className="report-post-container">
                <div className="form-report-post-header">
                    <h3>Why are you reporting this post?</h3>
                </div>

                <div role="list" className="form-report-post-body">
                    <button className='button-report-post' onClick={() => handleOnClickReport("It's spam")}>
                        <div className='report-button-div'>
                            <span className='report-content'> It's spam</span>
                            <i className="fa-solid fa-angle-right"></i>
                        </div>
                    </button>

                    <button className='button-report-post' onClick={() => handleOnClickReport("I just don't like it")}>
                        <div className='report-button-div'>
                            <span className='report-content'>I just don't like it</span>
                            <i className="fa-solid fa-angle-right"></i>
                        </div>
                    </button>

                    <button className='button-report-post' onClick={() => { handleOnClickReport("Nudity or sexual activity") }}>
                        <div className='report-button-div'>
                            <span className='report-content'>Nudity or sexual activity</span>
                            <i className="fa-solid fa-angle-right"></i>
                        </div>
                    </button>

                    <button className='button-report-post' onClick={() => { handleOnClickReport("Violence or dangerous organizations") }}>
                        <div className='report-button-div'>
                            <span className='report-content'>Violence or dangerous organizations</span>
                            <i className="fa-solid fa-angle-right"></i>
                        </div>
                    </button>

                    <button className='button-report-post' onClick={() => { handleOnClickReport("False information") }}>
                        <div className='report-button-div'>
                            <span className='report-content'>False information</span>
                            <i className="fa-solid fa-angle-right"></i>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ReportPostModal