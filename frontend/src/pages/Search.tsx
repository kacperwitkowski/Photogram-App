import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Discover from "../components/Discover";
import SinglePost from "../components/SinglePost";
import UserList from "../components/UserList";
import Posts from "../types/posts";
import { UserProps } from "../types/user";

const Search: React.FC = () => {
  const query = useLocation().search;
  const pathname = useLocation().pathname.split("/")[1];
  const [posts, setPosts] = useState<Posts[]>([]);
  const [users, setUsers] = useState<UserProps[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      if (pathname === "users") {
        const { data } = await axios.get(`/posts/search/users${query}`);
        return setUsers(data);
      }

      if (pathname === "hash") {
        const { data } = await axios.get(`/posts/search/hash${query}`);
        return setPosts(data);
      }
    };
    fetchPosts();
  }, [query]);

  return (
    <>
      <Discover />
      <div className="sm:pl-64">
        {pathname === "hash" && <SinglePost posts={posts} />}
        {pathname === "users" && (
          <div className="flex flex-col items-center bg-[#F8F8F8] min-h-[calc(100vh-64px)]">
            <h2 className="py-4 text-center text-2xl">
              I found {users.length} user(s) matching your query
            </h2>
            <UserList props={users} />
          </div>
        )}{" "}
      </div>
    </>
  );
};

export default Search;
