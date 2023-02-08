import React, { useState } from "react";
import { topics } from "../utils/constants";
import { useLocation, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { RiUserFollowFill } from "react-icons/ri";
import { BiCategory } from "react-icons/bi";
import { RootState } from "../redux/store";
import { FaInfoCircle, FaUserCircle, FaSearch } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/userSlice";
import { MdPostAdd, MdOutlineReadMore } from "react-icons/md";
import { IoMdNotifications } from "react-icons/io";
import { FiInbox } from "react-icons/fi";
import { AiFillLock } from "react-icons/ai";
import Notification from "./Notification";

const Discover: React.FC = () => {
  const topic = useLocation().pathname.slice(1);
  const [openCategory, setOpenCategory] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [q, setQ] = useState<string>("");
  const [isChecked, setIsChecked] = useState<string>("");
  const [openMore, setOpenMore] = useState<boolean>(false);
  const dispatch = useDispatch();
  const navigation = useNavigate();
  const { user } = useSelector((state: RootState) => state);

  const activeTopicStyle =
    "w-1/2 hover:text-[#EC5252] sm:px-3 sm:py-2 rounded xl:rounded-full flex items-center sm:mt-4 gap-2 justify-center cursor-pointer text-[#EC5252]";

  const topicStyle =
    "w-1/2 hover:text-[#EC5252] sm:px-3 sm:py-2 rounded xl:rounded-full flex items-center sm:mt-4 gap-2 justify-center cursor-pointer text-white sm:text-black";

  const linkToOther =
    "hover:text-[#EC5252] text-white cursor-pointer font-bold text-2xl xl:text-md  w-[30px]";

  const handleChange = (item: string) => {
    item === isChecked ? setIsChecked("") : setIsChecked(item);
  };

  return (
    <div className="menu">
      {openCategory && (
        <div className="sm:hidden flex gap-4 flex-wrap justify-center bg-[#29303b] p-3 w-4/5 m-auto">
          {topics.map((el) => (
            <Link
              key={el.name}
              to={`/${el.name}`}
              onClick={() => setOpenCategory(false)}
              className={`${
                !user && el.name !== "all" && "pointer-events-none"
              }`}
            >
              <div
                title={el.name}
                className={topic === el.name ? activeTopicStyle : topicStyle}
              >
                <span
                  className={`font-bold text-2xl xl:text-md relative ${
                    !user && el.name !== "all" && "text-gray-600"
                  }`}
                >
                  {el.icon}
                  {!user && el.name !== "all" && (
                    <AiFillLock
                      title={el.name}
                      className="w-4 h-4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#EC5252]"
                    />
                  )}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
      {showSearch && (
        <div className="sm:hidden flex gap-4 flex-wrap justify-center bg-[#29303b] p-2  w-full m-auto relative">
          <form
            className="flex justify-evenly w-full"
            onSubmit={(e) => {
              e.preventDefault();
              if (isChecked !== "") {
                navigation(
                  `${isChecked === "user" ? "/users" : "/hash"}/search?q=${q}`
                );
                setQ("");
              }
            }}
          >
            <input
              className="text-white"
              onChange={() => handleChange("hashtag")}
              type={"checkbox"}
              checked={isChecked === "hashtag"}
            />
            <label>Hash</label>
            <input
              type={"text"}
              className="border capitalize border-black rounded-lg text-black"
              placeholder={isChecked}
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <label>User</label>
            <input
              className="text-white"
              onChange={() => handleChange("user")}
              type={"checkbox"}
              checked={isChecked === "user"}
            />
          </form>
        </div>
      )}
      {openMore && (
        <div className="sm:hidden text-3xl mx-auto flex justify-evenly bg-[#29303b] relative p-2 w-1/2">
          {user?.privateAccount && (
            <Link
              to={"/requestFollows"}
              className={linkToOther}
              title="request follows"
            >
              <RiUserFollowFill />
            </Link>
          )}
          <Link to={"/about"} className={linkToOther} title="about us">
            <FaInfoCircle />
          </Link>
          {user && (
            <div className={`${linkToOther} relative`}>
              <Link to={"/notifications"}>
                <IoMdNotifications />
              </Link>
              <Notification type="desktop" />
            </div>
          )}
        </div>
      )}
      <div className="sm:px-[26px] bg-[#29303b] sm:bg-white py-[18px] flex flex-row sm:flex-col justify-evenly sm:justify-center items-center w-full sm:block">
        <Link to={"/"} className="hidden sm:flex flex-col items-center">
          <h1 className=" text-2xl text-center py-4 font-bold cursor-pointer text-[#EC5252]">
            Photogram
          </h1>
        </Link>
        <form
          className="hidden sm:flex flex-col justify-center items-center"
          onSubmit={(e) => {
            e.preventDefault();
            if (isChecked !== "") {
              navigation(
                `${isChecked === "user" ? "/users" : "/hash"}/search?q=${q}`
              );
            }
          }}
        >
          <h4 className="text-black">Search by:</h4>
          <div className="text-black flex items-center pb-2">
            <div className="flex items-center mr-2">
              <label className="mr-2">Hashtag</label>
              <input
                className="text-black"
                onChange={() => handleChange("hashtag")}
                type={"checkbox"}
                checked={isChecked === "hashtag"}
              />
            </div>
            <div className="flex items-center">
              <label className="mr-2">User</label>
              <input
                className="text-black"
                onChange={() => handleChange("user")}
                type={"checkbox"}
                checked={isChecked === "user"}
              />
            </div>
          </div>
          <input
            type={"text"}
            className="border capitalize border-black rounded-lg text-black"
            placeholder={isChecked}
            onChange={(e) => setQ(e.target.value)}
          />
        </form>
        <p className="pb-5 text-white-500 font-semibold mt-4 xl:block text-center hidden sm:block">
          Explore by:
        </p>
        {!user ||
          (Object.entries(user).length !== 0 && (
            <div className="sm:flex flex-col hidden  text-center font-semibold">
              <Link
                className="mb-2 bg-[#EC5252] text-white rounded-full p-2"
                to={"/"}
              >
                Users you follow
              </Link>
              <p className="mb-3">or</p>
            </div>
          ))}
        <p className="hidden sm:block border-t-2 font-semibold text-center pt-2">
          One of the topics:
        </p>
        <div className="py-2 hidden sm:flex justify-center items-center flex-wrap">
          {topics.map((el) => (
            <Link
              key={el.name}
              to={`/${el.name}`}
              onClick={() => setOpenCategory(false)}
              className={`flex justify-center ${
                !user && el.name !== "all" && "pointer-events-none"
              }`}
            >
              <div
                title={el.name}
                className={topic === el.name ? activeTopicStyle : topicStyle}
              >
                <span
                  className={`font-bold text-2xl xl:text-md relative ${
                    !user && el.name !== "all" && "text-gray-600"
                  }`}
                >
                  {el.icon}
                  {!user && el.name !== "all" && (
                    <AiFillLock
                      title={el.name}
                      className="w-4 h-4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#EC5252]"
                    />
                  )}
                </span>
              </div>
            </Link>
          ))}
        </div>
        <p className="  border-b-2 pb-6 mt-4 text-white-500 font-semibold xl:block text-center hidden sm:block">
          Others
        </p>
        <div className="hidden sm:flex  gap-4 flex-wrap  justify-center p-3 w-full m-auto">
          {user && Object.entries(user).length !== 0 && (
            <Link
              to={"/messages"}
              className={`${linkToOther} text-black`}
              title="messages"
            >
              <FiInbox />
            </Link>
          )}
          {user?.privateAccount && (
            <Link
              to={"/requestFollows"}
              className={`${linkToOther} text-black`}
              title="request follows"
            >
              <RiUserFollowFill />
            </Link>
          )}
          <Link
            to={"/about"}
            className={`${linkToOther} text-black`}
            title="about us"
          >
            <FaInfoCircle />
          </Link>
        </div>
        {user && Object.entries(user).length !== 0 ? (
          <button
            onClick={() => {
              localStorage.removeItem("pgToken");
              dispatch(logout());
              navigation("/all");
            }}
            className="hidden sm:flex py-3 justify-center w-full mt-10 font-semibold bg-[#EC5252] rounded-full items-center text-white"
          >
            Logout
          </button>
        ) : (
          ""
        )}
        {user && Object.entries(user).length !== 0 && (
          <Link to={"/createpost"} className="sm:hidden">
            <MdPostAdd className="text-4xl" />
          </Link>
        )}
        <div
          className="sm:hidden"
          onClick={() => {
            setOpenMore(false);
            setShowSearch(false);
            setOpenCategory(!openCategory);
          }}
        >
          <BiCategory className="w-[35px] h-[35px] sm:text-black hover:text-[#EC5252] cursor-pointer" />
        </div>
        <FaSearch
          title="Search by"
          className="text-3xl sm:hidden cursor-pointer"
          onClick={() => {
            setOpenCategory(false);
            setOpenMore(false);
            setShowSearch(!showSearch);
          }}
        />
        <div className="relative sm:hidden">
          <MdOutlineReadMore
            className="w-[45px] h-[45px] cursor-pointer"
            title="more"
            onClick={() => {
              setShowSearch(false);
              setOpenCategory(false);
              setOpenMore(!openMore);
            }}
          />
          {user && <Notification type="desktop" />}
        </div>
        <div className="block sm:hidden">
          {user && Object.entries(user).length !== 0 ? (
            <Link to={`/profile/${user?._id}`}>
              <img
                src={user.photoUrl}
                alt="user"
                className="cursor-pointer h-[50px] object-cover rounded-full w-[50px] p-1 mr-4"
              />
            </Link>
          ) : (
            <Link to={"/login"}>
              <FaUserCircle className="cursor-pointer text-5xl p-1 mr-4 " />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Discover;
