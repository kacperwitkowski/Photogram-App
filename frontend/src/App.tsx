import Navbar from "./components/Navbar";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import { io } from "socket.io-client";
import About from "./pages/About";
import Login from "./pages/Login";
import FollowRequests from "./pages/FollowRequests";
import AddPost from "./pages/AddPost";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./redux/store";
import { topics } from "./utils/constants";
import PostPage from "./pages/post/[id]";
import UserProfile from "./pages/userProfile/[profile]";
import Search from "./pages/Search";
import Messages from "./pages/Messages";
import MobileNotifications from "./pages/MobileNotifications";
import { useEffect, useState } from "react";
import { setSelectedConv } from "./redux/userSlice";
const ENDPOINT = "https://photogram-app.herokuapp.com";

const App = () => {
  const location = useLocation();
  const [socket, setSocket] = useState<any>();
  const isLoggedIn = localStorage.getItem("pgToken");
  const { user } = useSelector((state: RootState) => state);
  const dispatch = useDispatch();

  useEffect(() => {
    const connectToSocket = async () => {
      if (location.pathname === "/messages") {
        setSocket(io(ENDPOINT));
      }
      if (location.pathname !== "/messages") {
        dispatch(setSelectedConv(""));
        socket?.disconnect();
      }
    };
    connectToSocket();
  }, [location]);

  return (
    <>
      <div className="flex flex-col sm:flex-row w-full">
        <div className="flex flex-col w-full">
          <Navbar />
          <div className="main">
            <Routes>
              <Route path="/">
                <Route index element={<Home />} />
                <Route path="about" element={<About />} />
                <Route path="messages" element={<Messages socket={socket} />} />
                <Route path="notifications" element={<MobileNotifications />} />
                {user?.privateAccount && (
                  <Route path="requestFollows" element={<FollowRequests />} />
                )}
                <Route
                  path="login"
                  element={isLoggedIn ? <Home /> : <Login />}
                />
                <Route
                  path="createpost"
                  element={
                    user && Object.entries(user).length !== 0 ? (
                      <AddPost />
                    ) : (
                      <Home />
                    )
                  }
                />
                {topics.map((el) => (
                  <Route
                    key={el.name}
                    path={el.name}
                    element={<Home type={el.name} />}
                  />
                ))}
                <Route path="/hash/search" element={<Search />} />
                <Route path="/users/search" element={<Search />} />
                <Route path="post">
                  <Route path=":id" element={<PostPage />} />
                </Route>
                <Route path="profile">
                  <Route
                    path=":id"
                    element={<UserProfile type={"myposts"} />}
                  />
                </Route>
                <Route path="saved">
                  <Route path=":id" element={<UserProfile type={"save"} />} />
                </Route>
              </Route>
            </Routes>
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
