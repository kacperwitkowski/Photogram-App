import { Link } from "react-router-dom";
import { UserProps } from "../types/user";

const UserList = ({ props }: { props: UserProps[] }) => {
  return (
    <>
      {props.map((el: UserProps) => (
        <Link
          key={el._id}
          to={`/profile/${el._id}`}
          className="flex flex-col md:flex-row m-3 justify-between w-4/5 lg:w-1/2 p-5 border rounded-2xl shadow-md"
        >
          <div className="flex flex-col md:flex-row items-center">
            <img
              className="w-[70px] h-[70px] object-cover rounded-full"
              src={el.photoUrl}
              alt="User"
            />
            <p className="md:ml-3 font-semibold uppercase">{el.name}</p>
          </div>
          <div className="text-right flex md:flex-col justify-between md:justify-center px-3">
            <p className="font-semibold">
              Followers: {el.whoIsFollowingMe.length}
            </p>
            <p className="font-semibold">Following: {el.whoIFollow.length}</p>
          </div>
        </Link>
      ))}
    </>
  );
};

export default UserList;
