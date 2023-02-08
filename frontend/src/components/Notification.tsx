import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { RootState } from "../redux/store";
import { updateUserData } from "../redux/userSlice";
import { NotificationTypes } from "../types/notifications";
import { WaitingToAcceptUsers } from "../types/user";

const Notification = ({ type }: { type: string }) => {
  const { user } = useSelector((state: RootState) => state);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const typeOfNotification = (notif: NotificationTypes) => {
    const notificationColor = () => {
      if (notif.notifType === 1) {
        return "border-green-400";
      }
      if (notif.notifType === 2) {
        return "border-red-400";
      }
      if (notif.notifType === 3) {
        return "border-blue-400";
      }
    };
    return (
      <li
        className={`${notificationColor()} notification__element`}
        onClick={() => deleteNotification(notif)}
        key={notif._id}
      >
        <img
          className="w-[30px] h-[30px] object-cover rounded-full mr-1"
          src={notif.postedBy.photoUrl}
          alt="Sender"
        />

        {notif.notifType === 1 &&
          `You received a new like from ${notif.postedBy.name}`}
        {notif.notifType === 2 &&
          `You received a new comment from ${notif.postedBy.name}`}
        {notif.notifType === 3 &&
          `You received a new message from ${notif.postedBy.name}`}
      </li>
    );
  };

  const deleteNotification = async (notification: NotificationTypes) => {
    if (notification.notifType === 1 || notification.notifType === 2) {
      const { data } = await axios.put(
        `/users/deleteNotification/${notification._id}`,
        {},
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("pgToken"),
          },
        }
      );
      dispatch(updateUserData(data));
      navigate(`/post/${notification.postId}`);
    }
    if (notification.notifType === 3) {
      navigate(`/messages`);
    }
  };

  return (
    <>
      {user?.notifications?.length !== 0 ||
      user?.waitingToAcceptUsers?.length !== 0 ? (
        <>
          {type !== "mobile" && (
            <span
              title={user?.notifications?.length + " new notifications"}
              className="notification__span top-2 bg-green-400 -right-1"
            >
              {user?.notifications?.length + user?.waitingToAcceptUsers?.length}
            </span>
          )}
        </>
      ) : (
        ""
      )}
      {user?.notifications?.length !== 0 ||
      user?.waitingToAcceptUsers?.length !== 0 ? (
        <ul
          className={`${
            type === "mobile"
              ? "notification__list__mobile"
              : "dropdown notification__list__desktop"
          }`}
        >
          {user?.notifications?.map((notif: NotificationTypes) =>
            typeOfNotification(notif)
          )}
          {user?.waitingToAcceptUsers?.map((flw: WaitingToAcceptUsers) => (
            <Link
              key={flw.postedBy._id}
              to={"/requestFollows"}
              className="notification__element border-yellow-400"
            >
              <img
                className="w-[30px] h-[30px] object-cover rounded-full mr-1"
                src={flw.postedBy.photoUrl}
                alt="Sender"
              />
              You have a new follow request from {flw.postedBy.name}
            </Link>
          ))}
        </ul>
      ) : (
        <>
          {type === "mobile" && (
            <p className="text-center text-3xl font-semibold m-4">
              You don't have any new notifications
            </p>
          )}
        </>
      )}
    </>
  );
};

export default Notification;
