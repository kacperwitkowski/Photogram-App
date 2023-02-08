import { useEffect, useState } from "react";
import ConversationComponent from "../components/Conversation";
import axios from "axios";
import { setSelectedConv, updateUserData } from "../redux/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import SingleConversation from "../components/SingleConversation";
import { Conversation, Friends, OnlineUsers } from "../types/message";

const Messages = ({ socket }: any) => {
  const dispatch = useDispatch();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const { user, selectedConv } = useSelector(
    (state: RootState) => state
  );
  const [onlineUsers, setOnlineUsers] = useState<OnlineUsers[]>([]);
  const [friends, setFriends] = useState<Friends[]>([]);
  const [onlineFriends, setOnlineFriends] = useState<Friends[]>([]);

  useEffect(() => {
    socket?.emit("addUser", user._id);
    socket?.on("getUsers", (users: OnlineUsers[]) => {
      setOnlineUsers(users);
    });
  }, [selectedConv, socket]);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const { data } = await axios.get(`/users/profile/${user?._id}`);
        dispatch(updateUserData(data[0]));
      } catch (err) {
        throw err;
      }
    };
    getUserData();
  }, []);

  useEffect(() => {
    const fetchConversations = async () => {
      const { data } = await axios.get("/conv", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("pgToken"),
        },
      });
      setConversations(data);
    };
    fetchConversations();
  }, []);

  useEffect(() => {
    const getFriends = async () => {
      const { data } = await axios.get(`
      /users/onlineFriends/${user._id}
      `);

      setFriends(data);
    };
    getFriends();
  }, [user._id]);

  useEffect(() => {
    setOnlineFriends(
      friends.filter((o1: Friends) =>
        onlineUsers.some((o2: OnlineUsers) => o1._id === o2.userId)
      )
    );
  }, [friends, onlineUsers]);

  return (
    <div className="h-[calc(100vh-64px)] bg-[#F8F8F8] w-screen flex justify-between flex-col xl:flex-row relative">
      <div className=" w-full xl:w-1/5 xl:bg-transparent bg-[#96ADCF] xl:m-4 xl:rounded-lg xl:overflow-y-scroll">
        <div className="flex xl:flex-col overflow-x-scroll xl:overflow-x-hidden sticky">
          {conversations.map((conversation) => (
            <div
              className="flex items-center"
              key={conversation._id}
              onClick={() => {
                dispatch(setSelectedConv(conversation));
              }}
            >
              <ConversationComponent
                conversation={conversation}
                currUser={user}
                selectedConv={selectedConv}
                onlineFriends={onlineFriends}
              />
            </div>
          ))}
        </div>
      </div>
      <SingleConversation
        socket={socket}
        onlineUsers={onlineUsers}
        onlineFriends={onlineFriends}
      />
    </div>
  );
};

export default Messages;
