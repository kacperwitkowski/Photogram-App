import { useEffect, useState } from "react";
import axios from "axios";
import { topics } from "../utils/constants";
import Discover from "../components/Discover";
import SinglePost from "../components/SinglePost";
import PostsProps from "../types/posts";
import { updateUserData } from "../redux/userSlice";
import { RootState } from "../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { Puff } from "react-loader-spinner";
import { useLocation } from "react-router-dom";

const Home = ({ type }: { type?: string }) => {
  const [posts, setPosts] = useState<PostsProps[]>([]);
  const [spinner, setSpinner] = useState<boolean>(false);
  const location = useLocation();
  const { user } = useSelector((state: RootState) => state);
  const dispatch = useDispatch();
  
  useEffect(() => {
    const getUserData = async () => {
      try {
        const { data } = await axios.get(`/users/profile/${user?._id}`, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("pgToken"),
          },
        });
        dispatch(updateUserData(data[0]));
      } catch (err) {
        throw err;
      }
    };
    getUserData();
  }, []);

  const simulateFetchData = (id: string) => {
    setSpinner(true);
    const data = fetch(`/users/myfollowed/${id}`, {
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
    for (const id of user?.whoIFollow) {
      let followersPosts = await simulateFetchData(id);
      userPosts.push(followersPosts);
    }
    setPosts(
      userPosts.flat(1).sort((a, b) => {
        const date1 = new Date(a.updatedAt);
        const date2 = new Date(b.updatedAt);

        return date2.getTime() - date1.getTime();
      })
    );
  };

  useEffect(() => {
    const getPosts = async () => {
      const findTopic = topics.find((el) => el.name === type);
      if (findTopic && findTopic.name !== "all") {
        setSpinner(true);
        try {
          const { data } = await axios.get(`/posts/bytopic/${type}`, {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("pgToken"),
            },
          });
          setSpinner(false);

          return setPosts(data);
        } catch (err) {
          throw err;
        }
      }

      if (findTopic?.name === "all") {
        setSpinner(true);
        try {
          const { data } = await axios.get(`/posts/all`);
          setSpinner(false);
          return setPosts(data);
        } catch (err) {
          throw err;
        }
      }

      if (location.pathname === "/") {
        setSpinner(true);
        handleGetFollowersPosts();
        setSpinner(false);
      }
    };

    getPosts();
  }, [type]);

  return (
    <>
      <Discover />
      <div className="sm:pl-64">
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
        ) : (
          <SinglePost posts={posts} />
        )}
      </div>
    </>
  );
};

export default Home;
