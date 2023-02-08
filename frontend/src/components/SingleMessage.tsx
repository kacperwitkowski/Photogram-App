import { Link } from "react-router-dom";
import { format } from "timeago.js";
import { singleMessage } from "../types/message";

const SingleMessage = ({
  message,
  own,
}: singleMessage) => {
  return (
    <div className={`flex flex-col mt-5 ${own && "items-end"}`}>
      <div className="flex">
        {own ? (
          ""
        ) : (
          <Link to={`/profile/${message.sender._id}`}>
            <img
              className="w-8 h-8 rounded-full object-cover mr-2.5"
              src={message.sender.photoUrl}
              alt="user"
            />
          </Link>
        )}
        <p
          className={`p-2.5 rounded-2xl break-all bg-indigo-400 max-w-[300px] ${
            own ? "bg-gray-200" : "text-white"
          }`}
        >
          {message.content}
        </p>
      </div>
      <div className="text-xs mt-3">{format(message.createdAt)}</div>
      <div className="text-xs mt-3">
      </div>
    </div>
  );
};

export default SingleMessage;
