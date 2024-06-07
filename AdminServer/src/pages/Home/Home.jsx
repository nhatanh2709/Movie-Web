import React from 'react'
import './home.scss'
import FeaturedInfo from '../../components/featuredInfo/FeaturedInfo'
import Chart from "../../components/chart/Chart.jsx";
import WidgetSm from "../../components/widgetSm/WidgetSm";
import WidgetLg from "../../components/widgetLg/WidgetLg";
import { useState, useMemo, useEffect } from 'react';
import axios from 'axios'
import Topbar from '../../components/topbar/Topbar.jsx';
import Slidebar from '../../components/sidebar/Slidebar.jsx';
const Home = () => {
  const MONTHS = useMemo(
    () => [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Agu",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    []
  );

  const [userStats, setUserStats] = useState([]);

  useEffect(() => {
    const getStats = async () => {
      try {
        const res = await axios.get("https://nodejs-server-1-o4q8.onrender.com/api/users/stats", {
          headers: {
            token:
              "Bearer "+JSON.parse(localStorage.getItem("user")).accessToken,
          },
        });
        const statsList = res.data.sort(function (a, b) {
          return a._id - b._id;
        });
        statsList.map((item) =>
          setUserStats((prev) => [
            ...prev,
            { name: MONTHS[item._id - 1], "New User": item.total },
          ])
        );
      } catch (err) {
        console.log(err);
      }
    };
    getStats();
  }, [MONTHS]);

  return (
    <>
      <Topbar />
      <div className='container'>
        <Slidebar/>
        <div className="home">
          <FeaturedInfo />
          <Chart data={userStats} title="User Analytics" grid dataKey="New User" />
          <div className="homeWidgets">
            <WidgetSm />
            <WidgetLg />
          </div>
        </div>
      </div>
    </>
  );
}

export default Home
