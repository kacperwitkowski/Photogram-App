import React from "react";
import Messagebox from "../components/SingleFollowRequests";

const FollowRequests = () => {
  return (
    <div className="mx-auto lg:w-3/5 max-h-[calc(100vh-64px)]  flex flex-col items-center bg-blue-100 p-6">
      <h1 className="mb-2 text-lg uppercase">Follow Requests:</h1>
      <Messagebox />
    </div>
  );
};

export default FollowRequests;
