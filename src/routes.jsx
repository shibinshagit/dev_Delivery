import {
  HomeIcon,
  UserCircleIcon,
  TableCellsIcon,
  InformationCircleIcon,
  ServerStackIcon,
  RectangleStackIcon,
} from "@heroicons/react/24/solid";
import { Home, Profile, Tables, Notifications } from "@/pages/dashboard";
import { SignIn, SignUp } from "@/pages/auth";
import Add from "./pages/dashboard/add";
import Edit from "./pages/dashboard/edit";

const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  {
    layout: "dashboard",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "dashboard",
        path: "/home",
        element: <Home />,
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "users",
        path: "/tables",
        element: <Tables />,
      },{
        icon: <UserCircleIcon {...icon} />,
        name: "add",
        path: "/add",
        element: <Add />,
      },
      {
        icon: <InformationCircleIcon {...icon} />,
        name: "delivery",
        path: "/notifications",
        element: <Notifications />,
      },{
        icon: <UserCircleIcon {...icon} />,
        name: "update",
        path: "/edit",
        element: <Edit />,
      },
    ],
  },
  {
    title: "auth pages",
    layout: "auth",
    pages: [
      {
        icon: <ServerStackIcon {...icon} />,
        name: "sign in",
        path: "/sign-in",
        element: <SignIn />,
      },
      {
        icon: <RectangleStackIcon {...icon} />,
        name: "sign up",
        path: "/sign-up",
        element: <SignUp />,
      },
    ],
  },
];

export default routes;
