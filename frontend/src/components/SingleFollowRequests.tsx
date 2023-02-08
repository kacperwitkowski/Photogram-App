import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { RootState } from "../redux/store";
import { updateUserData } from "../redux/userSlice";
import { WaitingToAcceptUsers } from "../types/user";

const FollowRequest = () => {
  const [awaitingUsers, setAwaitingUsers] = useState<WaitingToAcceptUsers[]>(
    []
  );
  const { user } = useSelector((state: RootState) => state);
  const dispatch = useDispatch();

  useEffect(() => {
    setAwaitingUsers(user?.waitingToAcceptUsers);
  }, []);

  const handleAcceptFRequest = async (id: string) => {
    const { data } = await axios.put(
      `/users/approvefollow/${id}`,
      {},
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("pgToken"),
        },
      }
    );

    dispatch(updateUserData(data));
    setAwaitingUsers(
      awaitingUsers.filter((el: WaitingToAcceptUsers) => el.postedBy._id !== id)
    );
  };

  const handleDeclineFRequest = async (id: string) => {
    const { data } = await axios.put(
      `/users/declinefollow/${id}`,
      {},
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("pgToken"),
        },
      }
    );

    dispatch(updateUserData(data));
    setAwaitingUsers(
      awaitingUsers.filter((el: WaitingToAcceptUsers) => el.postedBy._id !== id)
    );
  };

  return (
    <div className="w-4/5">
      {awaitingUsers.length !== 0 ? (
        awaitingUsers.map((el: WaitingToAcceptUsers) => (
          <div
            key={el.postedBy._id}
            className="flex flex-col p-2 justify-between bg-light-white border rounded-2xl shadow-md"
          >
            <Link to={`/profile/${el.postedBy._id}`}>
              <div className="flex flex-col md:flex-row items-center flex-wrap justify-center">
                <img
                  className="w-[65px] h-[65px] object-cover rounded-full"
                  src={el.postedBy.photoUrl}
                  alt="User"
                />
                <p className="md:ml-3 font-semibold uppercase">
                  {el.postedBy.name}
                </p>
              </div>
            </Link>
            <div className="text-right mx-1 flex justify-between md:justify-center px-3">
              <button
                className="follow__buttons bg-green-300"
                onClick={() => handleAcceptFRequest(el.postedBy._id)}
              >
                Accept
              </button>
              <button
                className="follow__buttons bg-red-400"
                onClick={() => handleDeclineFRequest(el.postedBy._id)}
              >
                Decline
              </button>
            </div>
          </div>
        ))
      ) : (
        <>
          {user?.privateAccount ? (
            <p className="text-center">You dont have any follow requests</p>
          ) : (
            <p className="text-center">Your account is not private</p>
          )}
        </>
      )}
    </div>
  );
};

export default FollowRequest;
