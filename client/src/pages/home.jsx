import React from "react";

function Home() {
  console.log("Home component rendered"); // Debugging message

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
      <h1 className="text-4xl font-semibold text-gray-800">Welcome to the LMS</h1>
      <p className="mt-4 text-lg text-gray-600">Your Learning Management System</p>
    </div>
  );
}

export default Home;
