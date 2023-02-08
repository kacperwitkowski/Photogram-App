import axios from "axios";
import React, { useEffect, useState } from "react";
import { Puff } from "react-loader-spinner";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { RootState } from "../redux/store";
import PostsProps from "../types/posts";

const SavedPosts = () => {
  const { user } = useSelector((state: RootState) => state);
  const [savedPosts, setSavedPosts] = useState<PostsProps[]>([]);
  const [spinner, setSpinner] = useState<boolean>(false);

  const simulateFetchData = async (id: string) => {
    try {
      const data = await axios.get(`/users/saved/${id}`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("pgToken"),
        },
      });
      return data;
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    const handleGetSavedPosts = async () => {
      setSpinner(true);

      const data: PostsProps[] = [];

      let promises = user?.savedPosts.map((id: string) => {
        return simulateFetchData(id);
      });

      let responses = Promise.allSettled(promises);

      responses.then((response) => {
        response.map((el: any) => {
          if (el.value?.data) {
            return data.push(el.value.data);
          }
        });
        setSpinner(false);
      });
      setSavedPosts(data);
    };
    handleGetSavedPosts();
  }, []);

  return (
    <>
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
      ) : savedPosts.length !== 0 ? (
        savedPosts.map((el: PostsProps) => (
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
          <h3 className="text-3xl">You haven't save any post yet</h3>
        </div>
      )}
    </>
  );
};

export default SavedPosts;
