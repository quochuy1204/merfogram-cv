import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'

// Components
import Carousel from '../../../Carousel/Carousel'

// Utils

// Action Types
import { ADMIN_TYPES, unblockPostOnReport } from '../../../../redux/actions/adminAction'

// Action
import { checkedReport, uncheckedReport, blockPostOnReport } from '../../../../redux/actions/adminAction'

// Styles
import './managereportmodal.css'

const ManageReportModal = () => {
    // Get the report_detail state from store
    const report_detail = useSelector(state => state.administrator.manage_report.report_detail)

    // Get the authentication token state from store
    const token = useSelector(state => state.authentication.token)

    // Create reportDetail state to store the 
    const [reportDetail, setReportDetail] = useState({})

    const dispatch = useDispatch()

    // When admin click on button Show Report Detail
    // Application will request the get request to server 
    // and set the res to reportDetail state to get all of the information about the Report
    useEffect(() => {
        if (report_detail) {
            setReportDetail(report_detail)
        }
    }, [report_detail])

    // Function to close Manage Report Modal
    // When administrator click on the close modal button
    // => dispatch MANAGE_REPORT action to store to update the manage_report state
    const handleCloseManageReportModal = () => {
        dispatch({
            type: ADMIN_TYPES.MANAGE_REPORT,
            payload: {
                open_modal: false,
                report_detail: {}
            }
        })
    }

    // Function to handle when admin click on the Checked Report
    // When admin click to the Checked Report button then send the report_id to server to update report's status attribute
    const handleCheckedReport = (reportDetail) => {
        if (reportDetail) {
            dispatch(checkedReport({ report: reportDetail, token: token }))
        } else {
            return null;
        }
    }

    // Function to handle when admin click to the Uncheck Report button
    const handleUncheckedReport = (reportDetail) => {
        if (reportDetail) {
            dispatch(uncheckedReport({ report: reportDetail, token: token }))
        } else {
            return null;
        }
    }

    // Function to handle when admin click to the Block Post button
    const handleBlockPost = (reportDetail) => {
        if (reportDetail) {
            dispatch(blockPostOnReport({ report: reportDetail, token: token }))
        } else {
            return dispatch({
                type: 'ALERT',
                payload: {
                    error: 'Please choose a post.'
                }
            })
        }
    }

    // Function to handle when admin click to the unblock post button
    const handleUnblockPostButton = (reportDetail) => {
        if (reportDetail) {
            dispatch(unblockPostOnReport({ report: reportDetail, token: token }))
        } else {
            return dispatch({
                type: 'ALERT',
                payload: {
                    error: "Please choose a post."
                }
            })
        }
    }

    useEffect(() => {
        console.log(reportDetail)
    }, [reportDetail])

    return (
        <div className='report-detail-modal'>
            <div>
                <span onClick={handleCloseManageReportModal} role="button" className='button-close-modal'>&times;</span>
            </div>

            <div className="row report-detail-modal-container">
                <div className="left-container col-lg-6">
                    <div className='post-images'>

                        {
                            reportDetail.target_images && <Carousel images={reportDetail.target_images} id={reportDetail.target_id._id} />
                        }

                    </div>
                    {
                        reportDetail.target_id ?
                            <div className="button-handle-report">
                                {
                                    reportDetail.status === 1
                                        ?
                                        <button className="d-inline-block btn btn-danger ignore-report" onClick={() => handleUncheckedReport(reportDetail)}>Uncheck Report</button>
                                        :
                                        <button className="d-inline-block btn btn-success ignore-report" onClick={() => handleCheckedReport(reportDetail)}>Checked Report</button>

                                }
                                {/* <button className="d-inline-block ignore-report">Checked All Similar Reports</button> */}
                                {
                                    reportDetail.target_id ?
                                        <>
                                            {
                                                reportDetail.target_id.isDeleted === false ?
                                                    <button className="d-inline-block btn btn-danger block-report" onClick={() => handleBlockPost(reportDetail)}>Block Post</button>
                                                    :
                                                    <button className="d-inline-block btn btn-success block-report" onClick={() => handleUnblockPostButton(reportDetail)} >Unblock Post</button>

                                            }
                                        </>
                                        :
                                        null
                                }
                            </div>
                            :
                            null
                    }
                </div>

                <div className="right-container col-lg-6">
                    <div className="row top-right-container">
                        <div className="right-container-header">
                            <h1 className='heading'>Target Information</h1>
                        </div>

                        <div className="right-container-body">
                            <div className="row">
                                <p className='text'> <b>ID:</b> {reportDetail.target_id ? reportDetail.target_id._id : null}</p>
                            </div>

                            <div className="row">
                                <p className="text"> <b>Owner:</b> {reportDetail.target_id ? reportDetail.target_id.owner_username : null} </p>
                            </div>

                            <div className="row">
                                <p className="text"> <b>Content:</b> {reportDetail.target_id ? reportDetail.target_id.caption : null} </p>
                            </div>

                            <div className="row">
                                <p className="text"> <b>Status:</b> {reportDetail.target_id ? reportDetail.target_id.isDeleted ? <i className="fas fa-ban text-danger"></i> : <i className="fas fa-check-circle text-success"></i> : null} </p>
                            </div>

                            <div className="row">
                                <p className="text"> <b>Created Date:</b> {reportDetail.target_id ? moment(reportDetail.target_id.createdAt).format('ll') : null} </p>
                            </div>
                        </div>
                    </div>

                    <div className="row bottom-right-container">
                        <div className="right-container-header">
                            <h1 className="heading">Report Information</h1>
                        </div>

                        <div className="right-container-body">
                            <div className="row">
                                <p className='text'> <b>ID:</b> {reportDetail ? reportDetail._id : null}</p>
                            </div>

                            <div className="row">
                                <p className="text"> <b>Reporter:</b> {reportDetail.reporter_id ? reportDetail.reporter_id.user_name : null} </p>
                            </div>

                            <div className="row">
                                <p className="text"> <b>Content:</b> {reportDetail ? reportDetail.report_content : null} </p>
                            </div>

                            <div className="row">
                                <p className="text"> <b>Status:</b> {reportDetail ? reportDetail.status === 0 ? <i className="fa-solid fa-triangle-exclamation text-warning"></i> : <i className="fas fa-check-circle text-success"></i> : null} </p>
                            </div>

                            <div className="row">
                                <p className="text"> <b>Created Date:</b> {reportDetail ? moment(reportDetail.createdAt).format('ll') : null} </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default ManageReportModal