import React from "react";
import { getInitials } from "../../utils/helper";
import DarkModeToggle from "../../pages/DarkModeToggle";

const ProfileInfo = ({ userInfo, onLogout }) => {
  return (
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 flex items-center justify-center rounded-full text-slate-950 font-medium bg-slate-100">
        {userInfo ? getInitials(userInfo.fullName) : "?"}
      </div>
      <p className="text-sm font-medium">
        {userInfo ? userInfo.fullName : "Guest"}
      </p>
      <button
        className=" logout text-sm underline cursor-pointer"
        onClick={onLogout}
      >
        Logout
      </button>
      <div>
        <DarkModeToggle />
      </div>
    </div>
  );
};

export default ProfileInfo;
