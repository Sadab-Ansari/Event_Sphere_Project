"use client";

const Dashboard = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-screen p-4 mb-8">
      {/* Sidebar (Sticky Left) */}
      <div className="lg:col-span-2 bg-pink-100 text-white p-4 h-full lg:sticky top-0 rounded-lg">
        Sidebar
      </div>

      {/* Main Content */}
      <div className="lg:col-span-10 flex flex-col gap-4">
        {/* Top Box */}
        <div className="bg-green-300 p-6 h-12"></div>

        {/* Main Grid with Right Box */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-grow">
          <div className="md:col-span-2 grid gap-4">
            {/* First Row: Two Equal Boxes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-red-300 h-60 p-4"></div>
              <div className="bg-green-300 h-60 p-4"></div>
            </div>

            {/* Second Row: Third Box (Wider) + Fourth Box */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-yellow-300 h-80 p-4 sm:col-span-2"></div>
              <div className="bg-purple-300 h-80 p-4"></div>
            </div>
          </div>

          {/* Right Box (Hidden on Small, Appears on md and above) */}
          <div className="bg-blue-300 h-full p-4 hidden md:block"></div>
        </div>

        {/* Bottom Box */}
        <div className="bg-gray-400 h-16 p-4"></div>
      </div>
    </div>
  );
};

export default Dashboard;
