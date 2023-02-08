import React from "react";
import { AiFillGithub } from "react-icons/ai";
import { BiTrendingUp } from "react-icons/bi";
import { BsChatLeftText, BsInstagram } from "react-icons/bs";
import { GiShadowFollower } from "react-icons/gi";
import { IoMdBriefcase } from "react-icons/io";
import { MdEmail, MdPostAdd } from "react-icons/md";
import about from "../assets/about.png";
import creatorPhoto from "../assets/myphoto.jpg";

const About: React.FC = () => {
  return (
    <div className="mx-auto items-center bg-blue-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-semibold text-3xl text-center mb-4">
          Everything you need to know
        </h1>
      </div>

      <div className="bg-[#ebf8ff] py-24 rounded-t-xl">
        <div className="container mx-auto px-2">
          <div className="flex flex-wrap items-center">
            <div className="mb-5 lg:mb-0 w-full lg:w-1/2">
              <h2 className="mb-12 text-2xl text-gray-700 font-bold">
                Learn More About Us
              </h2>
              <div className="flex flex-wrap">
                <div className="w-full sm:w-1/2 lg:w-1/2">
                  <div className="m-3">
                    <div className="icon">
                      <MdPostAdd />
                    </div>
                    <div>
                      <h4 className="text-gray-800 block mb-3 font-semibold">
                        Add posts
                      </h4>
                      <p className="gray">
                        {" "}
                        Create your own posts in various categories. Add catchy
                        hastags to get more likes and comments under your posts.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="w-full sm:w-1/2 lg:w-1/2">
                  <div className="m-3">
                    <div className="icon">
                      <GiShadowFollower />
                    </div>
                    <div>
                      <h4 className="text-gray-800 block mb-3 font-semibold">
                        Follow your friends
                      </h4>
                      <p className="gray">
                        Find your friends on Photogram and start to follow each
                        other. If you don't want others to see your posts make
                        your account private and visible only to your followers!
                      </p>
                    </div>
                  </div>
                </div>
                <div className="w-full sm:w-1/2 lg:w-1/2">
                  <div className="m-3">
                    <div className="icon">
                      <BiTrendingUp />
                    </div>
                    <div>
                      <h4 className="text-gray-800 block mb-3 font-semibold">
                        Explore trending posts
                      </h4>
                      <p className="gray">
                        {" "}
                        Looking for the inspiration? Explore posts by the
                        categories and find ones which interests you the most!
                      </p>
                    </div>
                  </div>
                </div>
                <div className="w-full sm:w-1/2 lg:w-1/2">
                  <div className="m-3">
                    <div className="icon">
                      <BsChatLeftText />
                    </div>
                    <div>
                      <h4 className="text-gray-800 block mb-3 font-semibold">
                        Chat with other users
                      </h4>
                      <p className="gray">
                        {" "}
                        Wants to chat with your friends? On Photogram you can
                        chat with everyone who has account!{" "}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full lg:w-1/2">
              <div className="mx-3 lg:mr-0 lg:ml-3">
                <img src={about} alt="about us" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full bg-white rounded-b-xl">
        <h1 className="text-center text-2xl text-gray-700 font-bold py-3">
          And Our Creator...
        </h1>
        <div className="max-w-4xl flex items-center h-auto lg:h-screen flex-wrap mx-auto my-32 lg:my-0 ">
          <div className="w-full lg:w-3/5 rounded-lg lg:rounded-l-lg lg:rounded-r-none shadow-2xl bg-white mx-6 lg:mx-0">
            <div className="p-4 md:p-12 text-center lg:text-left">
              <img
                alt="Kacper Witkowski"
                src={creatorPhoto}
                className="block object-cover lg:hidden rounded-full shadow-xl mx-auto -mt-16 h-48 w-48"
              />
              <h1 className="text-3xl font-bold pt-8 lg:pt-0">
                Kacper Witkowski
              </h1>
              <div className="mx-auto lg:mx-0 w-4/5 pt-3 border-b-2 border-green-700 opacity-25"></div>
              <p className="pt-4 text-base font-bold flex items-center justify-center lg:justify-start">
                <IoMdBriefcase className="text-2xl mr-2 text-green-700" />
                CEO of Photogram
              </p>
              <p className="pt-8 text-md">
                Ambitious, passionate, full of great ideas creator of the
                photogram you are currently on. I hope you like my app and you
                are going to stay here as long as possible!
              </p>
              <div className="pt-12 pb-8">
                <p className="border-green-700 border-b-2 font-bold py-2 inline-block px-4 rounded-md">
                  Get In Touch:
                </p>
              </div>
              <div className="mt-3 pb-16 lg:pb-0 w-4/5 lg:w-full mx-auto flex flex-wrap items-center justify-center lg:justify-start">
                <a
                  href="https://github.com/kacperwitkowski"
                  target="_blank"
                  rel="noreferrer"
                  className="mx-2"
                >
                  <AiFillGithub className=" fill-current text-gray-600 hover:text-green-700 text-3xl" />
                </a>
                <a
                  href="https://www.instagram.com/wiitkowsky/"
                  target="_blank"
                  rel="noreferrer"
                  className="mx-2"
                >
                  <BsInstagram className=" fill-current text-gray-600 hover:text-green-700 text-3xl" />
                </a>
                <a
                  target="_blank"
                  rel="noreferrer"
                  href="mailto:witkowskik46@gmail.com"
                  className="mx-2"
                >
                  <MdEmail className=" fill-current text-gray-600 hover:text-green-700 text-3xl" />
                </a>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-2/5">
            <img
              src={creatorPhoto}
              className="rounded-none lg:rounded-lg shadow-2xl hidden lg:block"
              alt="kacper witkowski"
            />
          </div>
          <div className="w-full text-center p-5 lg:p-0">
            Photogram is fully made by{" "}
            <a
              className="underline"
              target={"_blank"}
              href="https://github.com/kacperwitkowski"
              rel="noreferrer"
            >
              Kacper Witkowski
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
