import { Link } from "react-router-dom";
import { Friends } from "../types/message";

const ActiveUsers = ({ onlineFriends }: { onlineFriends: Friends[] }) => {
  return (
    <div>
      {onlineFriends?.map((el: Friends) => (
        <Link
          key={el._id}
          to={`/profile/${el._id}`}
          className="w-full ml-2 justify-start flex items-center break-all relative my-6"
        >
          <img
            className="w-12 h-12 mr-2 object-cover rounded-full"
            src={el.photoUrl}
            alt="active user"
          />
          <p>{el.name}</p>
          <span className="w-4 h-4 bg-green-400 rounded-full absolute -top-1 -left-1"></span>
        </Link>
      ))}
    </div>
  );
};

export default ActiveUsers;
