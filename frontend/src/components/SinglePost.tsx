import axios from "axios";
import React, { useEffect, useState } from "react";
import { AiFillDelete, AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { BsFolderMinus, BsFolderPlus } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { RootState } from "../redux/store";
import { savePosts } from "../redux/userSlice";
import { format } from "timeago.js";
import {
  EmailIcon,
  EmailShareButton,
  FacebookIcon,
  FacebookShareButton,
  TwitterIcon,
  TwitterShareButton,
} from "react-share";
import PostsProps from "../types/posts";
import SingleComment from "./Comments";
import { Puff } from "react-loader-spinner";
import RenderUsers from "../utils/renderUsers";

const SinglePost = (props: { posts: PostsProps[] }) => {
  const [posts, setPosts] = useState<PostsProps[]>([]);
  const [disableBtn, setDisableBtn] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [spinner, setSpinner] = useState<boolean>(false);
  const [showUsers, setShowUsers] = useState<boolean>(false);
  const { user } = useSelector((state: RootState) => state);
  const [open, setOpen] = useState(
    Array.from(
      posts.map((el) => el._id),
      () => false
    )
  );
  const [openOptions, setOpenOptions] = useState(
    Array.from(
      posts.map((el) => el._id),
      () => false
    )
  );
  const [openLikes, setOpenLikes] = useState(
    Array.from(
      posts.map((el) => el._id),
      () => false
    )
  );
  const shareUrl = window.location.href;
  const dispatch = useDispatch();
  const navigation = useNavigate();

  useEffect(() => {
    setPosts(props.posts);
  }, [props.posts]);

  const renderUsers = (likes: string[]) => {
    return (
      <RenderUsers usersList={likes} setShowUsers={setShowUsers} type="Likes" />
    );
  };

  const handleSavePost = async (id: number) => {
    await fetch(`/users/saved/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("pgToken"),
      },
    })
      .then((result) => result.json())
      .then(() => {
        dispatch(savePosts(id));
      })
      .catch((err) => {
        throw err;
      });
  };

  const handleLikePost = async (id: number) => {
    setDisableBtn(true);
    await fetch(`/posts/like/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("pgToken"),
      },
    })
      .then((result) => result.json())
      .then((data) => {
        setSpinner(false);
        const newData = posts.map((el: PostsProps) =>
          el._id === data._id ? data : el
        );
        setPosts(newData);
      })
      .catch((err) => {
        throw err;
      });
    setDisableBtn(false);
  };
  const handleDislikePost = async (id: number) => {
    await fetch(`/posts/dislike/${id}`, {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("pgToken"),
      },
    })
      .then((result) => result.json())
      .then((data) => {
        const newData = posts.map((el: PostsProps) =>
          el._id === data._id ? data : el
        );
        setPosts(newData);
      })
      .catch((err) => {
        throw err;
      });
  };

  const handleUnsavedPost = async (id: number) => {
    await fetch(`/users/unsaved/${id}`, {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("pgToken"),
      },
    })
      .then((result) => result.json())
      .then(() => {
        dispatch(savePosts(id));
      })
      .catch((err) => {
        throw err;
      });
  };

  const handleAddComment = async (text: string, postID: number) => {
    if (text.length !== 0) {
      fetch(`/comments/${postID}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("pgToken"),
        },
        body: JSON.stringify({
          text,
        }),
      })
        .then((res) => res.json())
        .then((result) => {
          setErrorMsg("");
          toggleComments(postID);
          const newData = posts.map((item) => {
            if (item._id === result._id) {
              return result;
            } else {
              return item;
            }
          });
          setPosts(newData);
        })
        .catch((err) => {
          setErrorMsg("You can't add comment right now, try later");
        });
    } else {
      setErrorMsg("You can't sumbit empty comment!");
    }
  };

  const handleDeleteComment = async (postID: number, commentID: number) => {
    const { data } = await axios.put(
      `/comments/delete/${postID}`,
      {
        commentID,
      },
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("pgToken"),
        },
      }
    );

    const newData = posts.map((item) => {
      if (item._id === data._id) {
        return data;
      } else {
        return item;
      }
    });
    setPosts(newData);
  };

  const deletePost = async (id: number) => {
    await axios.delete(`/posts/${id}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("pgToken"),
      },
    });
  };

  const toggleComments = (index: number, value?: boolean) => {
    const newOpenState = [...open];
    newOpenState[index] = value ?? !newOpenState[index];
    setOpen(newOpenState);
  };
  const toggleLikes = (index: number, value?: boolean) => {
    const newOpenState = [...openLikes];
    newOpenState[index] = value ?? !newOpenState[index];
    setOpenLikes(newOpenState);
  };
  const toggleShare = (index: number, value?: boolean) => {
    const newOpenState = [...openOptions];
    newOpenState[index] = value ?? !newOpenState[index];
    setOpenOptions(newOpenState);
  };

  return (
    <div className="flex justify-center py-5 bg-[#F8F8F8] min-h-[calc(100vh-64px)]">
      <div className="flex flex-col w-full items-center mb-12 sm:mb-0">
        {spinner ? (
          <div className="flex w-full justify-center mt-8">
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
        ) : posts.length !== 0 ? (
          posts.map((el: PostsProps) => (
            <div key={el._id} className="p-4 max-w-2xl h-full w-full">
              <div className="bg-white border rounded-sm ">
                <div className="flex justify-between items-center px-4 py-3 relative">
                  <Link to={`/profile/${el.postedBy._id}`} className="contents">
                    <div className="flex items-center">
                      <img
                        className="h-8 w-8 rounded-full"
                        src={el.postedBy?.photoUrl}
                        alt="user"
                      />
                      <span className="ml-3 text-sm font-semibold antialiased block leading-tight">
                        {el.postedBy?.name}
                      </span>
                    </div>
                  </Link>

                  {!openOptions[el._id] && (
                    <HiOutlineDotsVertical
                      onClick={() => toggleShare(el._id)}
                      className="text-2xl cursor-pointer"
                    />
                  )}
                  {openOptions[el._id] && (
                    <div className="w-full h-full flex justify-between items-center absolute top-0 left-0 bg-white">
                      <div className="flex  flex-col xs:flex-row">
                        <p className="font-semibold mx-1">
                          Share this post on:
                        </p>
                        <div className="flex">
                          <FacebookShareButton url={shareUrl} className="mx-1">
                            <FacebookIcon size={30} round={true} />
                          </FacebookShareButton>
                          <TwitterShareButton url={shareUrl} className="mx-1">
                            <TwitterIcon size={30} round={true} />
                          </TwitterShareButton>
                          <EmailShareButton url={shareUrl} className="mx-1">
                            <EmailIcon size={30} round={true} />
                          </EmailShareButton>
                        </div>
                      </div>
                      {el.postedBy._id === user._id && (
                        <AiFillDelete
                          title="Delete post"
                          onClick={() => {
                            const filteredPosts = posts.filter((el2) => {
                              return el2._id !== el._id;
                            });
                            setPosts(filteredPosts);
                            deletePost(el._id);
                            navigation("/");
                          }}
                          className="text-2xl cursor-pointer text-black  mr-1"
                        />
                      )}
                    </div>
                  )}
                </div>
                <div className="bg-[#29303b] flex justify-center lg:max-h-[600px]">
                  <img className="object-contain " src={el.photo} alt="post" />
                </div>
                <div className="flex items-center justify-between mx-4 mt-3 mb-2">
                  <div className="flex gap-4 cursor-pointer">
                    {el.likes?.includes(user?._id) ? (
                      <button onClick={() => handleDislikePost(el._id)}>
                        <AiFillHeart className="text-3xl text-red-600" />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleLikePost(el._id)}
                        disabled={disableBtn ? true : false}
                      >
                        <AiOutlineHeart className="text-3xl" />
                      </button>
                    )}
                  </div>
                  <div className="flex cursor-pointer">
                    {user?.savedPosts?.includes(el._id) ? (
                      <BsFolderMinus
                        onClick={() => handleUnsavedPost(el._id)}
                        className="text-3xl"
                        title="unsave post"
                      />
                    ) : (
                      <BsFolderPlus
                        onClick={() => handleSavePost(el._id)}
                        className="text-3xl"
                        title="save post"
                      />
                    )}
                  </div>
                </div>
                <div className="flex justify-between font-semibold text-sm mx-4 mt-2 mb-4">
                  <p
                    className="cursor-pointer"
                    onClick={() => {
                      setShowUsers(true);
                      toggleLikes(el._id);
                    }}
                  >
                    {el.likes?.length} like(s)
                  </p>
                  <p>{format(el.createdAt)}</p>
                </div>
                {openLikes[el._id] && showUsers && el.likes?.length !== 0
                  ? renderUsers(el.likes!)
                  : ""}
                <div className="flex flex-col xs:flex-row items-baseline">
                  <Link
                    to={`/profile/${el.postedBy._id}`}
                    className="pt-3 ml-2 font-semibold"
                  >
                    {el.postedBy.name}
                  </Link>
                  <p className="ml-2">{el.desc}</p>
                </div>
                {el.hashtags.length >= 1 && !el.hashtags.includes("") ? (
                  <p className="text-blue-400 px-3 py-1">
                    {el.hashtags.map((el: string) => (
                      <span
                        className="cursor-pointer"
                        onClick={() => navigation(`/hash/search?q=${el}`)}
                      >
                        {" "}
                        #{el}
                      </span>
                    ))}
                  </p>
                ) : (
                  ""
                )}
                <div className="p-3">
                  <p className="text-sm mb-2 text-gray-400 cursor-pointer font-medium">
                    {!open[el._id] ? (
                      <button onClick={() => toggleComments(el._id)}>
                        View all {el.comments?.length} comment(s)
                      </button>
                    ) : (
                      <button onClick={() => toggleComments(el._id, false)}>
                        Hide all {el.comments?.length} comment(s){" "}
                      </button>
                    )}
                  </p>
                  <SingleComment
                    _id={el._id}
                    comments={el.comments}
                    open={open}
                    handleDeleteComment={handleDeleteComment}
                  />
                </div>
                <form
                  onSubmit={(e: any) => {
                    e.preventDefault();
                    handleAddComment(e.target[0].value, el._id);
                    e.target[0].value = "";
                  }}
                  className="w-full items-center flex p-3"
                >
                  <div className="flex">
                    <img
                      className="h-8 w-8 mr-2 rounded-full"
                      src={
                        user?.photoUrl
                          ? user.photoUrl
                          : "https://cdn-icons-png.flaticon.com/512/17/17004.png"
                      }
                      alt="user"
                    />

                    <input
                      type={"text"}
                      className="border-blue-500"
                      placeholder="Write comment..."
                      minLength={1}
                    />
                  </div>
                  <button className="border px-3 py-[2px]">Post</button>
                </form>
              </div>
            </div>
          ))
        ) : (
          <>
            {user ? (
              <div className="text-center flex flex-col justify-center items-center font-semibold text-2xl">
                <p>Follow first user to see their posts here</p>
                <span>or</span>
                <Link className="underline" to={"/all"}>
                  explore trending posts
                </Link>
              </div>
            ) : (
              <div className="text-center font-semibold text-2xl sm:w-3/5 p-3">
                <p>
                  In order to use all of the features of photogram, e.g. follow
                  friends accounts, chat with other users, search for posts
                  using hashtags or for the users by their name, like posts and
                  comment them (if theirs account it's not private) and even
                  save them!
                  <Link
                    className="block border-b-2 border-[#EC5252] tracking-wider mx-auto w-fit pt-5 pb-3"
                    to={"/login"}
                  >
                    Create your account now!
                  </Link>
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SinglePost;
