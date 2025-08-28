"use client";

import Footer1 from "./Footer1";
import Sidebar from "./Sidebar";
import TopNav from "./TopNav";
import Calendar from "./Calender";
import Clock from "./Clock";
import TrafficBarChart from "./TrafficBarChart";
import ProgressPieChart from "./ProgessPieChart";
import EventMessages from "./eMessage";
import UpcomingEvent from "./UpcomingEvents";
import ProtectedRoute from "@/components/ProtectedRoute";

const Dashboard = () => {
  return (
    <ProtectedRoute>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-screen p-4 mb-8">
        {/* Sidebar */}
        <div className="lg:col-span-2">
          <Sidebar />
        </div>

        {/* Main content */}
        <div className="lg:col-span-10 flex flex-col gap-4">
          {/* Top Navigation */}
          <TopNav />

          {/* Dashboard Grids */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-grow">
            {/* Left & Center Section */}
            <div className="md:col-span-2 grid gap-4">
              {/* Upcoming Event + Traffic Chart */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-lg shadow-lg w-full">
                  <UpcomingEvent />
                </div>
                <div className="w-full">
                  <TrafficBarChart />
                </div>
              </div>

              {/* Event Messages + Progress */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="h-80 sm:col-span-2 w-full">
                  <EventMessages />
                </div>
                <div className="h-80 flex flex-col justify-between items-center w-full">
                  <ProgressPieChart />
                  <div className="relative text-3xl sm:text-4xl font-[Dancing Script] italic flex items-center justify-center bg-white rounded-lg shadow-md w-full max-w-xs">
                    <span className="bg-black bg-clip-text text-transparent animate-gradient pb-1">
                      Progress
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Section */}
            <div className="h-full rounded-lg flex flex-col justify-between space-y-3 w-full">
              <Calendar />
              <Clock />
              <div className="relative text-3xl sm:text-4xl font-[Dancing Script] italic flex items-center justify-center bg-white rounded-lg shadow-md w-full">
                <span className="bg-black bg-clip-text text-transparent animate-gradient pb-1">
                  Date & Time
                </span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <Footer1 />
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Dashboard;
