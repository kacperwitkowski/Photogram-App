import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import SinglePost from "../../components/SinglePost";
import PostsProps from "../../types/posts";
import { Puff } from "react-loader-spinner";

const PostPage = () => {
  const location = useLocation();
  const [singlePost, setSinglePost] = useState<PostsProps[]>([]);
  const [spinner, setSpinner] = useState<boolean>(false);

  useEffect(() => {
    const fetchSinglePost = async () => {
      setSpinner(true);
      try {
        const { data } = await axios.get(
          `/posts/getpost/${location.pathname.split("/")[2]}`
        );

        setSpinner(false);
        setSinglePost([data]);
      } catch (err) {
        throw err;
      }
    };
    fetchSinglePost();
  }, [location.pathname]);

  return (
    <div>
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
        <SinglePost posts={singlePost} />
      )}
    </div>
  );
};

export default PostPage;
