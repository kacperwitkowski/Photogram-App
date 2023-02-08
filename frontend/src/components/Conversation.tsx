import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { updateUserData } from "../redux/userSlice";
import { Conversation, Friends, OnlineUsers } from "../types/message";
import { NotificationTypes } from "../types/notifications";
import { UserProps } from "../types/user";

interface ConversationProps {
  conversation: Conversation;
  selectedConv: Conversation;
  currUser: UserProps;
  onlineFriends: Friends[];
}

const UsersConversation = ({
  conversation,
  selectedConv,
  currUser,
  onlineFriends,
}: ConversationProps) => {
  const [messageNotifications, setMessageNotifications] = useState<
    NotificationTypes[]
  >([]);
  const dispatch = useDispatch();

  useEffect(() => {
    const filterUserNotifications = currUser.notifications.filter(
      (el: NotificationTypes) => el.notifType === 3
    );

    setMessageNotifications(filterUserNotifications);
  }, [currUser.notifications, selectedConv]);

  const getSenderInfo = (loggedUser: UserProps, users: Friends[]) => {
    return users[0]._id === loggedUser._id ? users[1] : users[0];
  };

  const deleteMessageNotification = async (notificationID: string) => {
    const { data } = await axios.put(
      `/users/deleteNotification/${notificationID}`,
      {},
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("pgToken"),
        },
      }
    );
    dispatch(updateUserData(data));
  };

  return (
    <div className="flex flex-col w-[150px] xl:w-full break-all h-full relative">
      <button
        onClick={() => {
          let findNotificationID = messageNotifications.find(
            (el: NotificationTypes) => el.selectedConv?._id === conversation._id
          );
          findNotificationID &&
            deleteMessageNotification(findNotificationID._id);
        }}
        className={` ${
          conversation._id === selectedConv._id ? "bg-[#EC5252]" : "xl:bg-white"
        }  cursor-pointer flex flex-col xl:rounded-full h-full xl:flex-row items-center py-2.5 px-3 hover:bg-gray-300 w-full justify-start xl:justify-between xl:mt-5`}
      >
        <div className="flex flex-col xl:flex-row items-center ">
          <img
            src={getSenderInfo(currUser, conversation.users).photoUrl}
            alt="User img"
            className="w-10 h-10 object-cover xl:mr-1 rounded-full"
          />
          <h2 className="font-medium xl:ml-2 text-center">
            {getSenderInfo(currUser, conversation.users).name}
          </h2>
        </div>
        {messageNotifications.some(
          (el: NotificationTypes) => conversation._id === el.selectedConv._id
        ) && (
          <div className="rounded-full bg-blue-400 w-4 h-4 xl:w-8 xl:h-8 flex absolute xl:static right-12  justify-center items-center xl:text-xl font-semibold">
            !
          </div>
        )}
        {onlineFriends.some((el: Friends) =>
          conversation.users.some((item: Friends) => el._id === item._id)
        ) ? (
          <div className="flex xl:hidden w-4 h-4 bg-green-400 rounded-full absolute left-12"></div>
        ) : (
          <div
            title="offline"
            className="flex xl:hidden w-4 h-4 border border-red-400 rounded-full absolute left-12 items-center justify-center bg-white"
          >
            X
          </div>
        )}
      </button>
    </div>
  );
};

export default UsersConversation;
