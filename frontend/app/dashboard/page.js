"use client";
// import { useEffect } from "react";
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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-screen p-4 mb-8">
        <div className="lg:col-span-2">
          <Sidebar />
        </div>

        <div className="lg:col-span-10 flex flex-col gap-4">
          <div>
            <TopNav />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-grow">
            <div className="md:col-span-2 grid gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-lg shadow-lg">
                  <UpcomingEvent />
                </div>
                <div>
                  <TrafficBarChart />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="h-80 sm:col-span-2">
                  <EventMessages />
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

            <div className="h-full rounded-lg flex flex-col md:flex md:justify-between space-y-3">
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

          <div>
            <Footer1 />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Dashboard;
