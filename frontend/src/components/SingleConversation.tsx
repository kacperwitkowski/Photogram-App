import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { MdSend } from "react-icons/md";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import SingleMessage from "./SingleMessage";
import ActiveUsers from "./ActiveUsers";
import { Conversation, Friends, Message, OnlineUsers } from "../types/message";
let selectedChatCompare: Conversation;

interface ConversationProps {
  socket: any;
  onlineUsers: OnlineUsers[];
  onlineFriends: Friends[];
}

interface BeforeLastMessage {
  data?: Message;
}

const SingleConversation = ({
  socket,
  onlineUsers,
  onlineFriends,
}: ConversationProps) => {
  const [newMessage, setNewMessages] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const scrollRef = useRef<null | HTMLDivElement>(null);
  const [arrivalMessage, setArrivalMessage] = useState<Message | null>(null);
  const { user, selectedConv } = useSelector(
    (state: RootState) => state
  );

  const fetchMessages = async () => {
    if (!selectedConv) return;

    try {
      const { data } = await axios.get(`/message/${selectedConv._id}`, {
        headers: {
          "Content-type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("pgToken"),
        },
      });

      const filterMessages = data.filter(
        (msg: Message) => msg.sender._id !== user._id && msg.read === false
      );

      filterMessages.forEach((msg: Message) => {
        axios.put(`/message/${msg._id}`);
      });

      setMessages(data);
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    fetchMessages();

    selectedChatCompare = selectedConv;
  }, [selectedConv]);

  useEffect(() => {
    socket?.emit("setup", user);
    socket?.on("getMessage", (data: Message) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== data.conversation._id
      ) {
        const receiver = data.conversation.users.find(
          (usr: Friends) => usr._id !== user._id
        );

        return sendNotification(user._id, receiver!._id, data.conversation);
      }

      if (selectedChatCompare._id === data.conversation._id) {
        makeNewMessageRead(data);
      }
    });
  }, [socket]);

  useEffect(() => {
    if (
      arrivalMessage &&
      selectedConv?.users?.some(
        (el: Friends) => el._id === arrivalMessage?.sender._id
      )
    ) {
      setMessages((prev) => [...prev, arrivalMessage]);
    }
  }, [selectedConv, arrivalMessage]);

  const makeNewMessageRead = async (newMessage: Message) => {
    const { data } = await axios.put(`/message/${newMessage._id}`);
    setArrivalMessage(data);
  };

  const sendNotification = async (
    receiverId: string,
    senderId: string,
    currConversation: Conversation
  ) => {
    await axios.put(
      `/message/sendNotification/${receiverId}`,
      {
        selectedConv: currConversation,
        senderId,
      },
      {
        headers: {
          "Content-type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("pgToken"),
        },
      }
    );
  };

  const handleSumbitMessage = async (e: any) => {
    if (e.key === "Enter" || e.type === "click") {
      e.preventDefault();

      // IS USER ACTIVE (SOCKET)
      const receiver = selectedConv.users.find(
        (usr: Friends) => usr._id !== user._id
      );

      //Can't be onlineFriends because it would require user1 to follow user2
      const isUserActive = onlineUsers.some(
        (e: OnlineUsers) => e.userId === receiver._id
      );

      let isBeforeLastMessageRead: BeforeLastMessage | undefined;

      try {
        const { data } = await axios.post(
          "/message",
          {
            content: newMessage,
            convId: selectedConv._id,
          },
          {
            headers: {
              "Content-type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("pgToken"),
            },
          }
        );

        socket.emit("newMessage", data);

        setMessages((prev) => [...prev, data]);
        setNewMessages("");

        //FETCHING BEFORE LAST MESSAGE FROM DB BECAUSE I DONT HAVE AN ACTUAL INFO IF THE SECOND USER READ THE LAST MESSAGE

        if (messages.length !== 0) {
          isBeforeLastMessageRead = await axios.get(
            `/message/singleMessage/${messages[messages.length - 1]._id}`
          );
        }

        if (
          !isBeforeLastMessageRead?.data!.read ||
          (!isUserActive && isBeforeLastMessageRead?.data.read) ||
          !isBeforeLastMessageRead
        ) {
          sendNotification(receiver._id, user._id, selectedConv);
        }
      } catch (err) {
        throw err;
      }
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  return (
    <div className="flex w-full h-full">
      <div className="w-full h-full justify-between xl:w-3/5 p-2.5 flex flex-1 flex-col">
        {selectedConv ? (
          <>
            <div className="h-full overflow-scroll py-2 px-5 bg-white rounded-lg">
              {messages.length !== 0 ? (
                messages.map((el: Message) => (
                  <div key={el._id} ref={scrollRef}>
                    <SingleMessage
                      message={el}
                      own={el.sender._id === user._id}
                    />
                  </div>
                ))
              ) : (
                <h1 className="p-2 text-5xl break-all text-center font-serif text-gray-300">
                  Write your first message
                </h1>
              )}
            </div>
            <form
              onKeyDown={handleSumbitMessage}
              className="mt-2 flex bg-white rounded-lg items-center"
            >
              <textarea
                className="w-full rounded-lg flex-1 p-2.5 h-20 flex-grow border-none focus:outline-none resize-none"
                placeholder="Write message..."
                onChange={(e) => setNewMessages(e.target.value)}
                value={newMessage}
              />
              <button
                className="mr-8 bg-[#EC5252] h-1/2 border rounded-md px-4 py-2"
                onClick={handleSumbitMessage}
                title="Send Message"
              >
                <MdSend className="text-2xl" />
              </button>
            </form>
          </>
        ) : (
          <div className="flex justify-center text-center mt-5">
            <span className="text-[rgb(224,220,220)] text-5xl">
              Open a conversation to start a chat.
            </span>
          </div>
        )}
      </div>
      <div className="hidden xl:flex flex-col  xl:m-4 rounded-lg xl:overflow-auto xl:w-1/5 p-2 bg-white">
        <h2 className="text-center font-medium mb-2 w-full">Active users: </h2>
        <ActiveUsers onlineFriends={onlineFriends} />
      </div>
    </div>
  );
};

export default SingleConversation;
