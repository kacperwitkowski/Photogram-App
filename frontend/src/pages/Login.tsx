import axios from "axios";
import React, { useEffect, useState } from "react";
import { loginStart, loginSuccess, loginFailure } from "../redux/userSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import mockup from "../assets/mockup.jpg";
import { Puff } from "react-loader-spinner";

const Login = () => {
  const [registerName, setRegisterName] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [registerEmail, setRegisterEmail] = useState<string>("");
  const [registerPassword, setRegisterPassword] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [img, setImg] = useState<string>("");
  const [show, setShow] = useState<boolean>(false);
  const [url, setUrl] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loadingCreatingAccount, setLoadingCreatingAccount] =
    useState<boolean>(false);
  const [signInVisible, setSignInVisible] = useState<boolean>(true);
  const dispatch = useDispatch();
  const navigation = useNavigate();

  const inputClass = "border border-[#29303b] my-1 p-3 bg-transparent w-full";
  const acceptButton =
    "text-white rounded-[3px] border-none mt-[20px] py-[10px] px-5 font-medium cursor-pointer bg-[#EC5252] disabled:bg-gray-200";

  const handleLogin = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    dispatch(loginStart());
    try {
      const { data } = await axios.post("/auth/signin", {
        email,
        password,
      });

      dispatch(loginSuccess(data.others));
      localStorage.setItem("pgToken", data.token);
      navigation("/");
    } catch (err) {
      dispatch(loginFailure());
    }
  };

  useEffect(() => {
    if (url) {
      uploadFields();
    }
  }, [url]);

  const handleSignUp = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoadingCreatingAccount(true);
    if (img) {
      uploadImage();
    } else {
      uploadFields();
    }
  };

  const uploadFields = async () => {
    try {
      const data = await axios.post("/auth/signup", {
        name: registerName,
        email: registerEmail,
        password: registerPassword,
        photoUrl: url
          ? url
          : "https://res.cloudinary.com/dyd3wa61e/image/upload/v1659811297/user_caclxn.png",
      });

      if (data.status === 200) {
        setLoadingCreatingAccount(false);
        setShowModal(true);

        const timeId = setTimeout(() => {
          setShowModal(false);
          return () => {
            clearTimeout(timeId);
          };
        }, 2000);
      }
    } catch (err) {
      throw err;
    }
  };

  const uploadImage = async () => {
    const formData = new FormData();
    formData.append("file", img);
    formData.append("upload_preset", "photogram");
    formData.append("cloud_name", "dyd3wa61e");

    await fetch("https://api.cloudinary.com/v1_1/dyd3wa61e/image/upload", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((result) => {
        setUrl(result.url);
        setLoadingCreatingAccount(false);
      })
      .catch((err) => {
        throw err;
      });
  };

  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] relative">
      {showModal && (
        <div className="py-2 px-4 bg-[#51a843] text-[#ffffff] animate-fadingOut text-md uppercase absolute right-3= bottom-3">
          You've succesfully created account!
        </div>
      )}
      <div className="flex xl:w-1/2 md:w-4/5 w-[90%] h-5/6">
        <div className="object-cover hidden lg:block h-full w-full">
          <img src={mockup} className="w-full h-full" alt="mockup" />
        </div>
        <div className="flex m-2 lg:m-0 text-center items-center flex-col text-[#29303b] w-full bg-white p-2 sm:px-12 gap-2">
          <h1 className="text-xl">Sign in</h1>
          <h2 className="text-lg my-1">to continue with Photogram</h2>
          <div className={signInVisible ? "hidden" : "block w-full"}>
            <input
              className={inputClass}
              type="email"
              value={email}
              placeholder="email"
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="w-full relative">
              <input
                className={inputClass}
                type={show ? "text" : "password"}
                value={password}
                placeholder="password"
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-[#EC5252] py-1 px-2 text-white"
                onClick={() => setShow(!show)}
              >
                {show ? "Hide" : "Show"}
              </button>
            </div>
            <button
              disabled={!email || !password}
              onClick={handleLogin}
              className={acceptButton}
            >
              Log in
            </button>
          </div>

          <div className={signInVisible ? "block" : "hidden"}>
            <input
              className={inputClass}
              type="text"
              value={registerName}
              placeholder="name"
              maxLength={14}
              onChange={(e) => setRegisterName(e.target.value)}
            />
            <input
              className={inputClass}
              type="email"
              value={registerEmail}
              placeholder="email"
              onChange={(e) => setRegisterEmail(e.target.value)}
            />
            <div className="relative">
              <input
                className={inputClass}
                type={show ? "text" : "password"}
                value={registerPassword}
                placeholder="password"
                onChange={(e) => setRegisterPassword(e.target.value)}
              />
              <button
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-[#EC5252] py-1 px-2 text-white"
                onClick={() => setShow(!show)}
              >
                {show ? "Hide" : "Show"}
              </button>
            </div>
            <div className="my-3">
              <label className="mb-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                Upload profile picture
              </label>
              <input
                onChange={(e: any) => setImg(e.target.files[0])}
                className="block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                type={"file"}
              />
              <p
                className="mt-1 text-sm text-gray-500 dark:text-gray-300"
                id="file_input_help"
              >
                SVG, PNG, JPG or GIF (MAX. 800x400px).
              </p>
              <button
                disabled={!registerEmail || !registerPassword || !registerName}
                onClick={handleSignUp}
                className={acceptButton}
              >
                {loadingCreatingAccount ? (
                  <div className="flex w-full items-center justify-center">
                    <Puff
                      height="25"
                      color="#ffffff"
                      ariaLabel="puff-loading"
                      wrapperStyle={{}}
                      wrapperClass=""
                      visible={true}
                    />
                  </div>
                ) : (
                  "Sign up"
                )}
              </button>
            </div>
          </div>
          <div className="mt-3">
            {signInVisible ? (
              <button onClick={() => setSignInVisible(!signInVisible)}>
                or if you already have account,{" "}
                <span className="underline text-red-400">log in!</span>
              </button>
            ) : (
              <button onClick={() => setSignInVisible(!signInVisible)}>
                or if you don't have account yet,
                <span className="underline text-red-400 ml-1 ">
                  create one now!
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
