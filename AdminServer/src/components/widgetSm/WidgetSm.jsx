import { useEffect, useState } from "react";
import "./widgetSm.scss";
import { Visibility } from "@material-ui/icons";
import axios from "axios";
const imgUrl = "https://pbs.twimg.com/media/D8tCa48VsAA4lxn.jpg"
const WidgetSm = ()  =>{
  const [newUsers, setNewUsers] = useState([]);
  useEffect(() => {
    const getNewUser = async () => {
      try {
        const res = await axios.get("https://nodejs-server-1-o4q8.onrender.com/api/users?new=true", {
          headers: {
            token:
            "Bearer "+JSON.parse(localStorage.getItem("user")).accessToken,
          },
        });
        setNewUsers(res.data)
      } catch(err) {
        console.log(err)
      }
    }
    getNewUser();
  })
  return (
    <div className="widgetSm">
      <span className="widgetSmTitle">New Join Members</span>
      <ul className="widgetSmList">
        {newUsers.map(user => (
          <li className="widgetSmListItem">
          <img
            src={user.profilePic || imgUrl}
            alt=""
            className="widgetSmImg"
          />
          <div className="widgetSmUser">
            <span className="widgetSmUsername">{user.username}</span>
            <span className="widgetSmUserTitle">Movie User</span>
          </div>
          <button className="widgetSmButton">
            <Visibility className="widgetSmIcon" />
            Display
          </button>
        </li>
        ))}
      </ul>
    </div>
  );
}
export default WidgetSm
