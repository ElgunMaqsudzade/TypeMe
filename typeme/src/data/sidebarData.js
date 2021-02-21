import {
  Icon20Users3Outline,
  Icon28Profile,
  Icon20NewsfeedOutline,
  Icon20MessageOutline,
  Icon20UsersOutline,
  Icon20PictureOutline,
  Icon20MusicOutline,
  Icon20VideoOutline,
} from "@vkontakte/icons";

const data = [
  {
    id: 1,
    icon: <Icon28Profile />,
    info: "My profile",
    link: "/profile",
  },
  { id: 2, icon: <Icon20NewsfeedOutline />, info: "News", link: "/" },
  { id: 3, icon: <Icon20MessageOutline />, info: "Messenger", link: "/messages" },
  { id: 4, icon: <Icon20UsersOutline />, info: "Friends", link: "/friends" },
  { id: 5, icon: <Icon20Users3Outline />, info: "Groups", link: "/groups" },
  { id: 6, icon: <Icon20PictureOutline />, info: "Photos", link: "/images" },
  { id: 7, icon: <Icon20MusicOutline />, info: "Music", link: "/music" },
  { id: 8, icon: <Icon20VideoOutline />, info: "Videos", link: "/video" },
];
export default data;
