import axios from "axios";
import React, { useEffect, useState } from "react";
import { AiOutlineFolder } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { RootState } from "../../redux/store";
import { useLocation } from "react-router-dom";
import { BiCategory } from "react-icons/bi";
import SavedPosts from "../../components/SavedPosts";
import {
  follow,
  followPrivate,
  setSelectedConv,
  updateUserData,
} from "../../redux/userSlice";
import { BsChatText } from "react-icons/bs";
import Multiselect from "multiselect-react-dropdown";
import { FiLock } from "react-icons/fi";
import { UserProps, WaitingToAcceptUsers } from "../../types/user";
import PostsProps from "../../types/posts";
import RenderUsers from "../../utils/renderUsers";

const UserProfile = ({ type }: { type: string }) => {
  const [posts, setPosts] = useState<PostsProps[]>([]);
  const [image, setImage] = useState("");
  const [updatedName, setUpdatedName] = useState("");
  const location = useLocation();
  const { user } = useSelector((state: RootState) => state);
  const [isTheUser, setIsTheUser] = useState<boolean>();
  const [desc, setDesc] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showMyFollowers, setShowMyFollowers] = useState<boolean>(false);
  const [showFolllowing, setShowFollowing] = useState<boolean>(false);
  const [showPrivAccModal, setShowPrivAccModal] = useState<boolean>(false);
  const [userData, setUserData] = useState<UserProps>({} as UserProps);
  const [privateAccount, setPrivateAccount] = useState<boolean>(false);
  const [followChange, setFollowChange] = useState<boolean>(false);
  const categoryFromUrl = location.pathname.split("/")[1];
  const [items, setItems] = useState([
    "Travel",
    "Nature",
    "Music",
    "Sports",
    "Acting",
    "Games",
    "Yoga",
    "Fitness",
    "Gym",
    "Painting",
    "Animals",
    "Trading",
    "Writing",
    "Cooking",
    "Cycling",
    "Photography",
    "Singing",
  ]);
  const [selectedItems, setSelected] = useState<string[]>([]);
  const dispatch = useDispatch();
  const navigation = useNavigate();

  useEffect(() => {
    if (image) {
      const formData = new FormData();
      formData.append("file", image);
      formData.append("upload_preset", "photogram");
      formData.append("cloud_name", "dyd3wa61e");

      fetch("https://api.cloudinary.com/v1_1/dyd3wa61e/image/upload", {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .then((result) => {
          const newUser = { ...user, photoUrl: result.url };
          setUserData(newUser);
          dispatch(updateUserData(newUser));

          axios.put(
            `/users/updatephoto`,
            { photoUrl: result.url },
            {
              headers: {
                Authorization: "Bearer " + localStorage.getItem("pgToken"),
              },
            }
          );
        });
    }
  }, [image]);

  useEffect(() => {
    if (location.pathname.split("/")[2] === user?._id) {
      setIsTheUser(true);
    } else {
      setIsTheUser(false);
    }
  }, [location.pathname, user]);

  useEffect(() => {
    const getOtherUserData = async () => {
      try {
        const { data } = await axios.get(
          `/users/userprofile/${location.pathname.split("/")[2]}`
        );

        setUserData(data[0]);
        setPrivateAccount(data[0].privateAccount);
      } catch (err) {
        throw err;
      }
    };

    const getMyData = async () => {
      try {
        const { data } = await axios.get(`/users/profile/${user?._id}`);
        console.log(data);
        dispatch(updateUserData(data[0]));
        setUserData(data[0]);
        setPrivateAccount(data[0].privateAccount);
      } catch (err) {
        throw err;
      }
    };

    if (user._id !== location.pathname.split("/")[2]) {
      getOtherUserData();
    } else {
      getMyData();
    }
  }, [location.pathname, followChange, user._id, privateAccount, dispatch]);

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
  };

  useEffect(() => {
    if (!user?.privateAccount && user?.waitingToAcceptUsers?.length > 0) {
      user?.waitingToAcceptUsers?.forEach((el: WaitingToAcceptUsers) => {
        handleAcceptFRequest(el.postedBy._id);
      });
    }
  }, [user?.privateAccount]);

  useEffect(() => {
    const getAllPosts = async () => {
      try {
        const { data } = await axios.get(`/users/${userData._id}`);
        setPosts(data);
      } catch (err) {
        throw err;
      }
    };
    if (
      (userData && !userData.privateAccount) ||
      user?.whoIFollow?.includes(userData?._id) ||
      isTheUser
    ) {
      getAllPosts();
    }
  }, [userData, user?.whoIFollow]);

  const handleFollowPrivateAcc = async () => {
    if (
      !user?.whoIFollow?.includes(userData._id) &&
      !userData.waitingToAcceptUsers?.find(
        (el: WaitingToAcceptUsers) => el.postedBy?._id === user?._id
      )
    ) {
      await axios.put(
        `/users/followprivate/${userData._id}`,
        {},
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("pgToken"),
          },
        }
      );
    } else {
      await axios.put(
        `/users/unfollowprivate/${userData._id}`,
        {},
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("pgToken"),
          },
        }
      );
      setPosts([]);
    }

    setFollowChange(!followChange);
    dispatch(followPrivate(userData));
  };

  const renderUsers = (
    followers: string[],
    setState: React.Dispatch<React.SetStateAction<boolean>>,
    type: string
  ) => {
    return (
      <RenderUsers usersList={followers} setShowUsers={setState} type={type} />
    );
  };

  const handleFollow = async () => {
    user?.whoIFollow?.includes(userData._id)
      ? await axios.put(
          `/users/unfollow/${userData._id}`,
          {},
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("pgToken"),
            },
          }
        )
      : await axios.put(
          `/users/follow/${userData._id}`,
          {},
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("pgToken"),
            },
          }
        );
    setFollowChange(!followChange);
    dispatch(follow(userData._id));
  };

  const createBio = async () => {
    try {
      if (desc.length !== 0) {
        const { data } = await axios.put(
          "/users/createbio",
          {
            desc,
          },
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("pgToken"),
            },
          }
        );
        setUserData(data);
      }
    } catch (err) {
      throw err;
    }
  };

  const makePrivateAccount = async () => {
    try {
      await axios.put(
        "/users/accountprivate",
        {
          privateAccount: !privateAccount,
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("pgToken"),
          },
        }
      );
      setPrivateAccount(!privateAccount);
      setShowPrivAccModal(false);
    } catch (err) {
      throw err;
    }
  };

  const createUserCategories = async () => {
    try {
      if (selectedItems.length !== 0) {
        const { data } = await axios.put(
          "/users/createhobbies",
          {
            hobbies: selectedItems,
          },
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("pgToken"),
            },
          }
        );

        setSelected([]);
        setUserData(data);
      }
    } catch (err) {
      throw err;
    }
  };

  const onSelect = (selectedItem: string) => {
    if (selectedItems.includes(selectedItem)) return;
    setSelected(selectedItems.concat(selectedItem));
  };
  const onRemove = (selectedList: string[], selectedItem: string) => {
    const filtered = selectedList.filter((e: string) => e !== selectedItem);
    setSelected(filtered);
  };

  const updateName = async () => {
    try {
      if (updatedName.length >= 3) {
        const { data } = await axios.put(
          `/users/updateUser`,
          { name: updatedName },
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("pgToken"),
            },
          }
        );
        setUserData(data);
        dispatch(updateUserData(data));
      }
    } catch (err) {
      throw err;
    }
  };

  const createNewConv = async () => {
    try {
      const { data } = await axios.post(
        `/conv/`,
        {
          userId: userData._id,
        },
        {
          headers: {
            "Content-type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("pgToken"),
          },
        }
      );

      dispatch(setSelectedConv(data));
      navigation("/messages");
    } catch (err) {
      throw err;
    }
  };

  return (
    <>
      <main className="bg-gray-100 bg-opacity-25 min-h-[calc(100vh-64px)]">
        <div className="lg:w-8/12 lg:mx-auto">
          <header className=" md:border-b flex flex-col justify-between items-center p-4 md:py-8 md:flex-row">
            <div className="md:w-3/12 md:ml-16">
              <div className="relative w-28 h-28 md:w-40 md:h-40">
                <img
                  className="object-cover rounded-full
                border-2 border-[#29303b] p-1 w-full h-full"
                  src={userData.photoUrl}
                  alt="profile"
                />
                {!isTheUser && user ? (
                  <BsChatText
                    title="Message me!"
                    className="absolute -top-3 -right-10 md:-right-8 text-slate-700 text-5xl cursor-pointer"
                    onClick={() => createNewConv()}
                  />
                ) : (
                  ""
                )}
              </div>
            </div>

            <div className="w-full flex md:inline justify-center md:w-7/12 break-all">
              <div className="flex flex-col md:flex-row items-center mb-4 text-center">
                <h2 className="text-3xl inline-block font-light mr-2 mb-2 ">
                  {userData.name}
                </h2>
                {isTheUser ? (
                  <>
                    <button
                      onClick={() => setShowModal(true)}
                      className="bg-[#EC5252] px-2 py-1 
                        text-white font-semibold text-sm rounded block text-center 
                       sm:inline-block"
                    >
                      Edit profile
                    </button>
                  </>
                ) : (
                  <button
                    onClick={
                      !userData.privateAccount
                        ? handleFollow
                        : handleFollowPrivateAcc
                    }
                    className="bg-blue-500 px-2 py-1 
                        text-white font-semibold text-sm rounded block text-center 
                       sm:inline-block"
                  >
                    {userData.privateAccount &&
                    userData.waitingToAcceptUsers?.find(
                      (el: WaitingToAcceptUsers) =>
                        el.postedBy?._id === user?._id
                    )
                      ? "Requested"
                      : userData.whoIsFollowingMe?.includes(user?._id)
                      ? "Unfollow"
                      : "Follow"}
                  </button>
                )}
              </div>

              {/* MODAL */}

              {showModal && (
                <>
                  <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                    <div className="relative w-auto my-6 mx-auto max-w-3xl">
                      {/*content*/}
                      <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                        {/*header*/}
                        <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                          <h3 className="text-3xl font-semibold">
                            Edit profile
                          </h3>
                          <button
                            className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                            onClick={() => setShowModal(false)}
                          >
                            <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                              ×
                            </span>
                          </button>
                        </div>
                        <div
                          className={`flex justify-start items-center p-8 border border-t-gray-500 ${
                            showPrivAccModal && "rounded-b-lg"
                          }`}
                        >
                          {showPrivAccModal ? (
                            <div className="flex flex-col">
                              <p className="text-xl font-semibold text-center">
                                {user?.privateAccount
                                  ? "Do you want to make your account visible? Yor posts will be again shown for the other users and in the trending categories"
                                  : "Are you sure you want to make your account private? Your posts will be no longer shown in the trending categories."}
                              </p>
                              <div className="flex justify-evenly sm:w-2/5 mx-auto py-4">
                                <button
                                  className="profile__button !bg-[#EC5252]"
                                  onClick={() => setShowPrivAccModal(false)}
                                >
                                  Cancel
                                </button>
                                <button
                                  className="profile__button"
                                  onClick={makePrivateAccount}
                                >
                                  Confirm
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex flex-col">
                              <div className="flex flex-col">
                                <label className="font-semibold py-2">
                                  Update your profile picture
                                </label>
                                <input
                                  type={"file"}
                                  onChange={(e: any) =>
                                    setImage(e.target.files[0])
                                  }
                                />
                              </div>
                              <div className="flex flex-col">
                                <label className="font-semibold py-2">
                                  Update your profile name
                                </label>
                                <input
                                  className="w-full rounded border-2 border-[#ccc] py-2"
                                  minLength={3}
                                  maxLength={25}
                                  type={"text"}
                                  onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                  ) => setUpdatedName(e.target.value)}
                                />
                              </div>
                              <div>
                                <h4 className="font-semibold py-2">
                                  Choose your hobbies:
                                </h4>
                                <Multiselect
                                  isObject={false}
                                  options={items}
                                  onSelect={onSelect}
                                  onRemove={onRemove}
                                  selectionLimit={3}
                                />
                              </div>

                              <div>
                                <h4 className="font-semibold py-2">
                                  Create your bio:
                                </h4>
                                <textarea
                                  onChange={(e) => setDesc(e.target.value)}
                                  className="w-full rounded border-2 border-[#ccc]"
                                  minLength={1}
                                  maxLength={100}
                                />
                              </div>
                              <div className="flex flex-col justify-center">
                                <h4 className="font-semibold py-2">
                                  Make your account private:
                                </h4>
                                <button
                                  className="text-black border rounded  hover:bg-[#EC5252] duration-500 border-[#ccc] p-3"
                                  onClick={() => setShowPrivAccModal(true)}
                                >
                                  {user.privateAccount
                                    ? "Set able to see"
                                    : "Set private"}
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                        {!showPrivAccModal && (
                          <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                            <button
                              className="profile__button !bg-[#EC5252]"
                              type="button"
                              onClick={() => setShowModal(false)}
                            >
                              Close
                            </button>
                            <button
                              className="profile__button"
                              type="button"
                              onClick={() => {
                                createBio();
                                createUserCategories();
                                updateName();
                                setShowModal(false);
                              }}
                            >
                              Save Changes
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                </>
              )}
              {showMyFollowers && userData.whoIsFollowingMe?.length !== 0
                ? renderUsers(
                    userData.whoIsFollowingMe,
                    setShowMyFollowers,
                    "Followers"
                  )
                : ""}
              {showFolllowing && userData.whoIFollow?.length !== 0
                ? renderUsers(
                    userData.whoIFollow,
                    setShowFollowing,
                    "Following"
                  )
                : ""}
              <ul className="hidden md:flex space-x-8 mb-4">
                <li>
                  <span className="font-semibold mr-1">
                    {posts.length
                      ? posts.length
                      : !userData.whoIsFollowingMe?.includes(user?._id) &&
                        !isTheUser &&
                        userData.privateAccount
                      ? "?"
                      : 0}
                  </span>
                  Posts
                </li>
                <li
                  onClick={() => {
                    setShowMyFollowers(true);
                  }}
                  className="cursor-pointer"
                >
                  <span className="font-semibold mr-1">
                    {userData.whoIsFollowingMe?.length}
                  </span>
                  Followers
                </li>
                <li
                  onClick={() => setShowFollowing(true)}
                  className="cursor-pointer"
                >
                  <span className="font-semibold mr-1">
                    {userData.whoIFollow?.length}
                  </span>
                  Following
                </li>
              </ul>

              <div className="hidden md:block">
                <h3 className="font-semibold">About me:</h3>
                <span>
                  {userData.hobbies
                    ? `${userData.hobbies[0] ? userData.hobbies[0] : ""} ${
                        userData.hobbies[1] ? `, ${userData.hobbies[1]}` : ""
                      }  ${
                        userData.hobbies[2] ? `And ${userData.hobbies[2]}` : ""
                      }`
                    : ""}
                </span>
                <p>{userData.desc !== "" && userData.desc}</p>
              </div>
            </div>

            <div className="md:hidden text-sm my-2 text-center flex flex-col w-[70%] justify-center items-center break-all">
              <h1 className="font-semibold">{userData.name}</h1>
              {userData.hobbies
                ? `${userData.hobbies[0] ? userData.hobbies[0] : ""} ${
                    userData.hobbies[1] ? `, ${userData.hobbies[1]}` : ""
                  }  ${userData.hobbies[2] ? `And ${userData.hobbies[2]}` : ""}`
                : ""}
              <p className="pt-2">{userData.desc !== "" && userData.desc}</p>
            </div>
          </header>

          {isTheUser ? (
            <ul
              className="flex items-center justify-around md:justify-center space-x-12  
                    uppercase tracking-widest font-semibold text-xs text-gray-600
                "
            >
              <li
                className={`md:-mt-px md:text-gray-700 ${
                  categoryFromUrl === "profile"
                    ? "md:border-[#29303b] md:border-t text-[#EC5252]"
                    : "border-none"
                }`}
              >
                <Link className="inline-block p-3" to={`/profile/${user._id}`}>
                  <span className="flex items-center">
                    <BiCategory className="mr-1" /> posts
                  </span>
                </Link>
              </li>
              <li
                className={` md:-mt-px md:text-gray-700 ${
                  categoryFromUrl === "saved"
                    ? "md:border-[#29303b] md:border-t text-[#EC5252]"
                    : "border-none"
                }`}
              >
                <Link className="inline-block p-3" to={`/saved/${user._id}`}>
                  <span className="flex items-center">
                    <AiOutlineFolder className="mr-1" /> saved
                  </span>
                </Link>
              </li>
            </ul>
          ) : (
            ""
          )}

          <div className="px-px md:px-3">
            <ul
              className="flex md:hidden justify-around space-x-8 border-t 
                text-center p-2 text-gray-600 leading-snug text-sm"
            >
              <li>
                <span className="font-semibold text-gray-800 block">
                  {posts.length
                    ? posts.length
                    : !userData.whoIsFollowingMe?.includes(user?._id) &&
                      !isTheUser &&
                      userData.privateAccount
                    ? "?"
                    : 0}
                </span>
                Posts
              </li>

              <li
                onClick={() => {
                  setShowMyFollowers(true);
                }}
                className="cursor-pointer"
              >
                <span className="font-semibold text-gray-800 block">
                  {userData.whoIsFollowingMe?.length}
                </span>
                Followers
              </li>
              <li
                onClick={() => setShowFollowing(true)}
                className="cursor-pointer"
              >
                <span className="font-semibold text-gray-800 block">
                  {userData.whoIFollow?.length}
                </span>
                Following
              </li>
            </ul>

            <div
              className="flex items-center justify-around md:justify-center space-x-12  
                    uppercase tracking-widest font-semibold text-xs text-gray-600
                 "
            ></div>
            <div className="flex flex-wrap -mx-px md:-mx-3">
              {userData.privateAccount &&
              !userData.whoIsFollowingMe?.includes(user?._id) &&
              !isTheUser ? (
                <div className="mx-auto pt-20">
                  <div className="flex flex-col justify-center items-center text-center break-words">
                    <FiLock className="text-8xl mb-6" />
                    <h1 className="text-xl">This account is private</h1>
                    <h2 className="text-xl">
                      Follow this account to see their photos
                    </h2>
                  </div>
                </div>
              ) : type === "myposts" ? (
                posts.length !== 0 ? (
                  posts.map((el: PostsProps) => (
                    <div key={el._id} className="w-1/3">
                      <Link to={`/post/${el._id}`}>
                        <div className="post bg-gray-100 text-white relative pb-[100%] md:mb-6">
                          <img
                            className="w-full h-full absolute left-0 top-0 object-cover"
                            src={el.photo}
                            alt="otherUser post"
                          />
                        </div>
                      </Link>
                    </div>
                  ))
                ) : (
                  <div className="text-center w-full mt-28">
                    <h3 className="text-3xl">There are no posts yet</h3>
                  </div>
                )
              ) : (
                <SavedPosts />
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default UserProfile;
