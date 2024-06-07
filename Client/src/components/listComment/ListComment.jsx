import React from 'react'
import './listComment.scss'
import logo1 from '../../assets/png1.png'
import axios from 'axios'
import { useState, useEffect } from 'react'
const ListComment = props => {
    const [info, setInfo] = useState();
   
    useEffect(() => {
        const getInfo = async () => {
            try {
                const res = await axios.get(
                    `${process.env.REACT_APP_URL}/api/users/find/` + props.data.id
                )
                setInfo(res.data)
            } catch (err) {
                console.log(err)
            }
        }
        getInfo();
    }, [props])
    console.log(info)
    const NowLogin = new Date();
    const LastLogin = new Date(props.data.timestamp);
    const millisecondsInMinute = 60000;
    const distance = Math.round((NowLogin - LastLogin) / millisecondsInMinute)
    return (
        <div className='comment'>
            <div className='comment-session'>
                <div className='post-comment'>
                    <div className='list'>
                        <div className='user'>
                            <div className='user-image'>
                                <img src={logo1} alt='image' />

                            </div>
                            <div className='user-meta'>
                                <div className='name'>
                                    {info?.username}
                                </div>
                                <div className='day'>
                                    {distance} minutes
                                </div>
                            </div>
                        </div>
                        <div className='comment-post'>
                            {props.data.comment}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ListComment
