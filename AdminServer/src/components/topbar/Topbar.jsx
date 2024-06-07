import React from 'react'
import './topbar.scss'
import { NotificationsNone ,Language, Settings} from "@material-ui/icons";
const img = "https://images.pexels.com/photos/1526814/pexels-photo-1526814.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"
const Topbar = () => {
  return (
    <div className='topbar'>
        <div className='topbarWrapper'>
            <div className='topLeft'>
                <span className='logo'>admin</span>
            </div>
            <div className='topRight'>
                <div className='topbarIconsContainer'>
                <NotificationsNone/>
                <span className='topIconBadge'>2</span>
                </div>
                <div className='topbarIconsContainer'>
                <Language/>
                <span className='topIconBadge'>2</span>
                </div>
                <div className='topbarIconsContainer'>
                <Settings/>
                </div>
                <img src={img} alt='' className='topAvatar'/>
            </div>
        </div>
    </div>
  )
}

export default Topbar
