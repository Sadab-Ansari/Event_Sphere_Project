"use client";

import { useEffect, useState } from "react";
import Footer1 from "./Footer1";
import Sidebar from "./Sidebar";
import TopNav from "./TopNav";
import Calendar from "./Calender";
import Clock from "./Clock";
import TrafficBarChart from "./TrafficBarChart";
import ProgressPieChart from "./ProgessPieChart";
// import UpcomingEvents from "./UpcomingEvents";
// import EventMessages from "./eMessage";

const Dashboard = () => {
  // const [userId, setUserId] = useState(null);

  // useEffect(() => {
  //   const fetchUserId = async () => {
  //     try {
  //       const response = await fetch("http://localhost:5000/api/user", {
  //         method: "GET",
  //         credentials: "include", // Needed if using cookies
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       });

  //       const data = await response.json();
  //       if (data.userId) {
  //         setUserId(data.userId);
  //       } else {
  //         console.warn("User ID not found in response");
  //       }
  //     } catch (error) {
  //       console.error("Error fetching user ID", error);
  //     }
  //   };

  //   fetchUserId();
  // }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-screen p-4 mb-8">
      {/* Sidebar (Sticky Left) */}
      <div className="lg:col-span-2">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="lg:col-span-10 flex flex-col gap-4">
        {/* Top Box */}
        <div className="">
          <TopNav />
        </div>

        {/* Main Grid with Right Box */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-grow">
          <div className="md:col-span-2 grid gap-4">
            {/* First Row: Two Equal Boxes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className=" bg-pink-400 rounded-lg shadow-lg">
                {/* <UpcomingEvents /> */}
              </div>
              <div className="">
                <TrafficBarChart />
              </div>
            </div>

            {/* Second Row: Third Box (Wider) + Fourth Box */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-gray-400 h-80 p-4 sm:col-span-2 shadow-lg rounded-lg">
                {/* {userId ? (
                  <EventMessages userId={userId} />
                ) : (
                  <p>Loading user data...</p>
                )} */}
              </div>
              <div className="h-80 flex justify-between items-center flex-col">
                <div>
                  <ProgressPieChart />
                </div>
                <div>
                  <div className="relative text-4xl font-[Dancing Script] italic flex items-center justify-center bg-white rounded-lg shadow-md w-64">
                    <span className="bg-black bg-clip-text text-transparent animate-gradient pb-1">
                      Progress
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Box (Hidden on Small, Appears on md and above) */}
          <div className="h-full rounded-lg flex flex-col md:flex justify-between">
            <div>
              <Calendar />
            </div>
            <div>
              <Clock />
            </div>
            <div className="relative text-4xl font-[Dancing Script] italic flex items-center justify-center bg-white rounded-lg shadow-md">
              <span className="bg-black bg-clip-text text-transparent animate-gradient pb-1">
                Date & Time
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Box */}
        <div className="">
          <Footer1 />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
