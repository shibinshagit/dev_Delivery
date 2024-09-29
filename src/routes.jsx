import {
  HomeIcon,
  UserCircleIcon,
  TableCellsIcon,
  InformationCircleIcon,
  ServerStackIcon,
  RectangleStackIcon,
  ChatBubbleOvalLeftIcon,
  IdentificationIcon,
} from "@heroicons/react/24/solid";
import { Home, Profile, Tables, ViewOrder } from "@/pages/dashboard";
import { SignUp } from "@/pages/auth";
import Add from "./pages/dashboard/add";
import Edit from "./pages/dashboard/edit";
import LeaveForm from "./pages/dashboard/leave";
import PasswordOtp from "./pages/auth/enter-password";
import CreatePassword from "./pages/auth/create-password";

const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  {
    layout: "dashboard",
    pages: [
      {
        icon: <RectangleStackIcon {...icon} />,
        name: "Orders",
        path: "/home",
        element: <Home />,
      },
      {
        icon: <IdentificationIcon {...icon} />,
        name: "Profile",
        path: "/profile",
        element: <Profile />,
      },
      {
        icon: <ChatBubbleOvalLeftIcon {...icon} />,
        name: "orders",
        path: "/viewOrder/:id",
        element: <ViewOrder />,
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "Progress",
        path: "/progress",
        element: <Tables />,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "update",
        path: "/edit",
        element: <Edit />,
      },{
        icon: <UserCircleIcon {...icon} />,
        name: "leave",
        path: "/leave",
        element: <LeaveForm />,
      },
    ],
  },
  {
    title: "auth pages",
    layout: "auth",
    pages: [
      {
        icon: <RectangleStackIcon {...icon} />,
        name: "sign up",
        path: "/sign-up",
        element: <SignUp />,
      },
      {
        icon: <RectangleStackIcon {...icon} />,
        name: "password otp",
        path: "/otp-password",
        element: <PasswordOtp />,
      },
      {
        icon: <RectangleStackIcon {...icon} />,
        name: "create password",
        path: "/create-password",
        element: <CreatePassword />,
      }
    ],
  },
];

export default routes;
