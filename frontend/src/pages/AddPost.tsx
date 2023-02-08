import axios from "axios";
import { useState } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";
import { topics } from "../utils/constants";
import { useNavigate } from "react-router-dom";
import { Puff } from "react-loader-spinner";

const AddPost = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isWrongFormat, setIsWrongFormat] = useState(false);
  const [desc, setDesc] = useState("");
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [category, setCategory] = useState("coding");
  const [url, setURL] = useState("");
  const navigation = useNavigate();

  const createPost = async () => {
    await axios.post(
      "/posts/",
      {
        category,
        hashtags,
        desc,
        photo: url,
      },
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("pgToken"),
        },
      }
    );
    navigation("/");
  };

  const uploadImage = async (e: any) => {
    const formData = new FormData();
    formData.append("file", e.target.files?.[0]);
    formData.append("upload_preset", "photogram");
    formData.append("cloud_name", "dyd3wa61e");

    await fetch("https://api.cloudinary.com/v1_1/dyd3wa61e/image/upload", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((result) => {
        setURL(result.url);
      })
      .catch((err) => {
        throw err;
      });
  };

  return (
    <div className="flex w-full min-h-[calc(100vh-64px)] bg-[#F8F8F8] justify-center items-center">
      <div className="w-full lg:w-5/6 xl:w-[80%] border-gray-300 border-2 bg-white rounded-lg h-[calc(100vh-64px)]lg:h-[85vh] flex gap-6 justify-evenly items-center p-14 py-7 landscape:flex-row flex-col">
        <div>
          <div>
            <p className="text-2xl font-bold">Upload image</p>
            <p className="text-md text-gray-400 mt-1">
              Post a image to your account
            </p>
          </div>
          <div className="border-dashed rounded-xl border-4 border-gray-200 flex justify-center items-center outline-none flex-col mt-10 max-w-[600px] max-h-[360px] p-10 cursor-pointer hover:border-red-300 hover:bg-gray-100">
            {isLoading ? (
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
              <div className="max-w-[400px] max-h-[360px]">
                {url ? (
                  <div className="rounded-xl h-full w-full">
                    <img
                      src={url}
                      alt="img to post"
                      className="object-cover max-w-[400px] max-h-[360px] rounded-xl"
                    />
                  </div>
                ) : (
                  <label className="cursor-pointer">
                    <div className="flex flex-col items-center justify-center h-full">
                      {" "}
                      <div className="flex flex-col items-center justify-center">
                        <p className="font-bold text-xl">
                          <FaCloudUploadAlt className="text-gray-300 text-6xl" />
                        </p>
                        <p className="text-xl font-semibold">Upload image</p>
                      </div>
                      <p className="text-gray-400 text-center mt-10 text-sm leading-10">
                        JPG/PNG/WEBP
                        <br />
                        720x1280 or higher <br />
                        Less than 2GB
                      </p>
                      <p className="text-center rounded text-white p-2 text-md outline-none bg-[#EC5252] mt-10 font-medium w-52">
                        Select file
                      </p>
                    </div>
                    <input
                      required
                      type={"file"}
                      name="upload-video"
                      className="w-0 h-0"
                      onChange={uploadImage}
                    />
                  </label>
                )}
              </div>
            )}
            {isWrongFormat && (
              <p className="text-[#EC5252] font-semibold text-center text-xl mt-4 w-[250px]">
                Please select a image file
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-3 pb-10">
          <label className="text-md font-medium">Description</label>
          <textarea
            maxLength={150}
            required
            value={desc}
            onChange={(e) => {
              setDesc(e.target.value);
            }}
            className="border-2 text-md max-h-36 rounded outline-none border-gray-200 p-2"
          />
          <label className="text-md font-medium">Choose a category</label>
          <select
            required
            className="outline-none border-2 border-gray-200 text-md capitalize p-2 rounded cursor-pointer"
            onChange={(e) => {
              setCategory(e.target.value);
            }}
          >
            {topics
              .filter((el) => el.exclude !== true)
              .map((topic) => (
                <option
                  className="outline-none text-gray-700 capitalize bg-white text-md p-2 hover:bg-slate-300"
                  key={topic.name}
                  value={topic.name}
                >
                  {topic.name}
                </option>
              ))}
          </select>
          <label className="text-md font-medium">Type hashtags (max. 5)</label>
          <p className="text-gray-400 text-xs">Seperate them with a space</p>
          <input
            type={"text"}
            className="border-2 text-md max-h-36 rounded outline-none border-gray-200 p-2"
            onChange={(e) => {
              const hashes = e.target.value.split(" ");
              hashes.length = hashes.length < 5 ? hashes.length : 5;
              setHashtags(hashes);
            }}
          />
          <div className="flex gap-6 mt-10">
            <button
              type="button"
              className="border-gray-300 border-2 text-md font-medium lg:w-44 outline-none p-2 rounded w-28"
              onClick={() => setURL("")}
            >
              Discard
            </button>
            <button
              type="button"
              className="bg-[#EC5252] text-white border-2 text-md font-medium lg:w-44 outline-none p-2 rounded w-28"
              onClick={createPost}
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPost;
