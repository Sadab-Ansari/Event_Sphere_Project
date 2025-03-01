"use client";

import Footer1 from "./Footer1";
import Sidebar from "./Sidebar";
import TopNav from "./TopNav";
import Calendar from "./Calender";
import Clock from "./Clock";
import TrafficBarChart from "./TrafficBarChart";
import ProgressPieChart from "./ProgessPieChart";
import UpcomingEvents from "./UpcomingEvents";

const Dashboard = () => {
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
              <div className="">
                <UpcomingEvents />
              </div>
              <div className="">
                <TrafficBarChart />
              </div>
            </div>

            {/* Second Row: Third Box (Wider) + Fourth Box */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-yellow-300 h-80 p-4 sm:col-span-2"></div>
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
