import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'

// Styles
import './managereport.css'

// Action Types

// Actions
import { getReports, getReportDetail } from '../../../redux/actions/adminAction'

const ManageReport = () => {
    // Get state Authentication from Store
    const authentication = useSelector(state => state.authentication)

    // Get the Report List from Store
    const reports = useSelector(state => state.administrator.all_reports)

    // Create state status to store the status value of report
    const [status, setStatus] = useState('')

    // Create state search to store the search _id value
    const [search, setSearch] = useState('')

    // Create state sort to store the sort by createdAt value
    const [sort, setSort] = useState('')

    const dispatch = useDispatch()

    // Get all reports when user access the Manage Report Page
    useEffect(() => {
        dispatch(getReports({ authentication, status, search, sort }))
    }, [authentication, dispatch, status, search, sort])

    // Function to update manage_report state when admin click on to the Show Detail Report Button
    // - If manage_report: open_modal === true => open Manage Report Modal
    // - Assign manage_report: report_detail = report
    const handleOnClickDetail = (report) => {
        if (report) {
            dispatch(getReportDetail({ report: report, token: authentication.token }))
        } else {
            return dispatch({
                type: 'ALERT',
                payload: {
                    error: 'Please choose a report.'
                }
            });
        }
    }

    // Function to handle on change status event listener
    const handleOnChangeStatus = (event) => {
        setStatus(event.target.value)
    }

    // Function to handle on change search 
    const handleOnChangeSearch = (event) => {
        setSearch(event.target.value)
    }

    // Function to handle on change sort
    const handleOnChangeSort = (event) => {
        setSort(event.target.value)
    }

    // useEffect(() => {
    //     console.log(status)
    // }, [status])

    return (
        <div className='manage_container'>
            <div className='manage_header'>
                <div className='manage_title'>
                    <span className='span_manage'>Report Post
                        <i style={{ marginLeft: '6px', fontSize: '24px', color: '#ff7f50' }} className="fas fa-flag"></i>
                    </span>
                </div>

                <div className='manage_search'>
                    <form className='form_manage'>
                        <span className='span_manage_search'>Search: </span>

                        <input autoComplete='disable' className='formManageInput' type="text" placeholder="Enter report's ID" name='search' value={search} onChange={handleOnChangeSearch} ></input>

                        <button id="button_search_manage" type='submit'><i className="fas fa-search"></i></button>
                    </form>

                    <select className='sort-status' name='status' value={status} onChange={handleOnChangeStatus}>
                        <option value="">Choose status</option>
                        <option value="status=1" >Checked</option>
                        <option value="status=0" >Uncheck</option>
                    </select>

                    <select className='sort-date' name='sort' value={sort} onChange={handleOnChangeSort}>
                        <option value="">Newest</option>
                        <option value="sort=oldest" >Oldest</option>
                    </select>
                </div>
            </div>

            <div className='manage_body'>
                <div className='manage_table'>
                    <table style={{ position: 'relative' }} className="table table-borderless table-hover">
                        <thead style={{ position: 'sticky', top: '0', backgroundColor: '#FFFFFF', zIndex: '1' }}>
                            <tr >
                                <th scope="col" className='text-center'>ID</th>
                                <th scope="col" className='text-center'>Target ID</th>
                                <th scope="col" className='text-center'>Image</th>
                                <th scope="col" className='text-center'>Report Content</th>
                                <th scope="col" className='text-center'>Status</th>
                                <th scope="col" className='text-center'>Created Date</th>
                                <th scope="col" className='text-center'>Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {/* Check if user if administrator or not
                                if user is administrator => show report manage page
                                otherwise show notification "Administrator Resources"
                            */}
                            {
                                authentication.role === 1
                                    ?
                                    reports.map((report) => (
                                        <tr key={report._id} style={{ textAlign: 'center' }}>
                                            <td style={{
                                                maxWidth: '145px',
                                                overflow: 'hidden'
                                            }} className='text-center'>
                                                <p style={{
                                                    color: '#262626',
                                                    fontSize: '10px',
                                                    fontWeight: '500',
                                                }}>{report._id}</p>
                                            </td>

                                            <td style={{
                                                maxWidth: '145px',
                                                overflow: 'hidden'
                                            }} className='text-center'>
                                                <p style={{
                                                    color: '#262626',
                                                    fontSize: '10px',
                                                    fontWeight: '500',
                                                }}>{report.target_id}</p>
                                            </td>

                                            <td>
                                                <img style={{
                                                    width: '70px',
                                                    height: '70px',
                                                    objectFit: 'cover'
                                                }} src={report.target_images[0].url} alt={report.target_images[0].public_id} />
                                            </td>

                                            <td className='text-center' style={{
                                                maxWidth: '250px',
                                                overflow: 'hidden',
                                                color: '#262626',
                                                fontSize: '14px'
                                            }}>{report.report_content}</td>

                                            <td className='text-center'>
                                                {
                                                    report.status === 0
                                                        ?
                                                        <i className="fa-solid fa-triangle-exclamation text-warning"></i>
                                                        :
                                                        <i className="fas fa-check-circle text-success"></i>
                                                }
                                            </td>

                                            <td className='text-center' style={{
                                                color: '#262626',
                                                fontSize: '12px'
                                            }}>{moment(report.createdAt).format("ll")}</td>

                                            <td className='text-center'>
                                                <button onClick={() => handleOnClickDetail(report)} className='m-auto'>Detail</button>
                                            </td>
                                        </tr>
                                    ))
                                    :
                                    <div>Administrator Resources</div>
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div >
    )
}

export default ManageReport