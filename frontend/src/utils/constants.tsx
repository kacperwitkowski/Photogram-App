import { BsCode } from "react-icons/bs";
import { MdFace, MdLocalMovies, MdOutlineImageSearch } from "react-icons/md";
import { GiCakeSlice, GiGalaxy, GiLipstick } from "react-icons/gi";
import { FaPaw, FaMedal, FaGamepad } from "react-icons/fa";
import { FiMoreHorizontal } from "react-icons/fi";
import { AiFillCar } from "react-icons/ai";
import { SiYourtraveldottv } from "react-icons/si";
export const topics = [
  {
    name: "coding",
    icon: <BsCode />,
  },
  {
    name: "movies",
    icon: <MdLocalMovies />,
  },
  {
    name: "gaming",
    icon: <FaGamepad />,
  },
  {
    name: "food",
    icon: <GiCakeSlice />,
  },
  {
    name: "dance",
    icon: <GiGalaxy />,
  },
  {
    name: "beauty",
    icon: <GiLipstick />,
  },
  {
    name: "animals",
    icon: <FaPaw />,
  },
  {
    name: "sports",
    icon: <FaMedal />,
  },
  {
    name: "selfie",
    icon: <MdFace />,
  },
  {
    name: "cars",
    icon: <AiFillCar />,
  },
  {
    name: "travel",
    icon: <SiYourtraveldottv />,
  },
  {
    name: "other",
    icon: <MdOutlineImageSearch />,
  },
  {
    name: "all",
    icon: <FiMoreHorizontal />,
    exclude: true,
  },
];
