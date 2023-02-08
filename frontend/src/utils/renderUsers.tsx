import { useEffect, useState } from "react";
import { FiLock } from "react-icons/fi";
import { Puff } from "react-loader-spinner";
import { Link } from "react-router-dom";
import { Friends } from "../types/message";

interface usersProps {
  usersList?: string[];
  setShowUsers: React.Dispatch<React.SetStateAction<boolean>>;
  type: string;
}

const RenderUsers = ({ usersList, setShowUsers, type }: usersProps) => {
  const [users, setUsers] = useState<Friends[]>([]);
  const [spinner, setSpinner] = useState<boolean>(false);

  useEffect(() => {
    handleGetFollowersPosts();
  }, [usersList]);

  const simulateFetchData = (id: string) => {
    setSpinner(true);
    const data = fetch(`/users/profile/${id}`, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("pgToken"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setSpinner(false);
        return result;
      })
      .catch((err) => {
        throw err;
      });
    return data;
  };

  const handleGetFollowersPosts = async () => {
    const userPosts = [];
    for (const id of usersList!) {
      let followersPosts = await simulateFetchData(id);
      const { _id, name, photoUrl, privateAccount } = followersPosts[0];

      userPosts.push({ _id, name, photoUrl, privateAccount });
    }

    setUsers(userPosts);
  };

  return (
    <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 bg-[rgba(0,0,0,0.6)]">
      <div className="relative my-6 mx-auto border-0 rounded-lg shadow-lg flex flex-col bg-white w-4/5  sm:w-3/5 xl:w-1/5">
        {spinner ? (
          <div className="flex items-center h-full w-full justify-center">
            <Puff
              height="80"
              width="80"
              color="#EC5252"
              ariaLabel="puff-loading"
              wrapperStyle={{}}
              wrapperClass=""
              visible={true}
            />
          </div>
        ) : (
          <div className="">
            <div className="flex justify-between mx-2 p-2 font-semibold text-xl">
              <p>{type}:</p>
              <span
                className="cursor-pointer"
                onClick={() => setShowUsers(false)}
              >
                X
              </span>
            </div>
            {users.map(({ _id, name, photoUrl, privateAccount }: Friends) => (
              <Link
                to={`/profile/${_id}`}
                onClick={() => setShowUsers(false)}
                className="flex items-center p-3"
                key={_id}
              >
                <img
                  className="w-8 h-8 mx-2 rounded-full"
                  src={photoUrl}
                  alt="user"
                />
                <p className="flex items-center">
                  {name}
                  <span className="ml-1">
                    {privateAccount ? <FiLock className="text-sm" /> : ""}
                  </span>
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RenderUsers;
