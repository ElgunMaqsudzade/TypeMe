import { IoMdHome, IoIosCompass, IoIosPeople } from "react-icons/io";

const data = [
  {
    id: 1,
    img: "https://res.cloudinary.com/diqqf3eq2/image/upload/v1586883334/person-1_rfzshl.jpg",
    info: "Elgun",
    children: [{ info: "hello" }],
    link: "/profile",
  },
  { id: 2, icon: <IoMdHome />, info: "Home", children: [], link: "/" },
  { id: 3, icon: <IoIosCompass />, info: "All", children: [], link: "/all" },
  { id: 4, icon: <IoIosPeople />, info: "Groups", children: [], link: "/groups" },
];
export default data;
