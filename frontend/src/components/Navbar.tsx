import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { FaUserCircle } from "react-icons/fa";
import { MdPostAdd } from "react-icons/md";
import { topics } from "../utils/constants";
import { FiInbox, FiLogOut } from "react-icons/fi";
import { logout } from "../redux/userSlice";
import { IoMdNotifications } from "react-icons/io";
import Notification from "./Notification";

const Navbar: React.FC = () => {
  const { user } = useSelector((state: RootState) => state);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav
      className={`fixed bg-[#29303b] top-0 inset-x-0 z-50 h-16 text-white w-screen font-medium flex justify-between items-center shadow-lg ${
        location.pathname === "/" ||
        topics.some((el) => el.name === location.pathname.slice(1))
          ? "md:pl-64"
          : "sm:pl-0"
      }`}
    >
      <div className="relative flex h-full w-full items-center justify-center">
        {user && Object.entries(user).length !== 0 && (
          <div className="sm:hidden absolute left-3">
            {" "}
            <Link to={"/messages"}>
              <FiInbox className="text-3xl" />
            </Link>{" "}
          </div>
        )}
        <Link to={"/"} className="text-center flex">
          <h1 className="uppercase font-serif text-2xl">Photogram</h1>
        </Link>
        {user !== null && Object.entries(user).length !== 0 && (
          <div className="sm:hidden absolute right-3">
            <FiLogOut
              onClick={() => {
                localStorage.removeItem("pgToken");
                dispatch(logout());
                navigate("/all");
              }}
              title="Logout"
              className="text-2xl cursor-pointer"
            />
          </div>
        )}
        <div className="absolute right-0 text-right flex h-full items-center">
          <div className="hidden sm:flex h-full items-center">
            {user && Object.entries(user).length !== 0 ? (
              <div className="flex items-center h-full">
                <div className="relative mx-2 navbar-message h-full items-center hidden sm:flex">
                  <IoMdNotifications className="text-3xl cursor-pointer" />
                  <Notification type="desktop" />
                </div>
                <Link to={"/createpost"} className="mx-2">
                  <MdPostAdd className="text-4xl" />
                </Link>
                <Link to={`/profile/${user._id}`}>
                  <img
                    src={user.photoUrl}
                    alt="user"
                    className="w-[50px] h-[50px] object-cover rounded-full p-1 mr-4 "
                  />
                </Link>
              </div>
            ) : (
              <Link to={"/login"}>
                <FaUserCircle className="cursor-pointer text-5xl p-1 mr-4" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
