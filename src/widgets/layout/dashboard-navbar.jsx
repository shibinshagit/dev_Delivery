import { useLocation, Link } from "react-router-dom";
import {
  Navbar,
  Typography,
  Button,
  IconButton,
  Breadcrumbs,
  Input,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
} from "@material-tailwind/react";
import {
  UserCircleIcon,
  Cog6ToothIcon,
  BellIcon,
  ClockIcon,
  CreditCardIcon,
  Bars3Icon,
  PlusCircleIcon,
} from "@heroicons/react/24/solid";
import {
  useMaterialTailwindController,
  setOpenConfigurator,
  setOpenSidenav,
  setSearchTerm,
} from "@/context";
import { useEffect, useState } from "react";

export function DashboardNavbar() {
  const [controller, dispatch] = useMaterialTailwindController();
  const { fixedNavbar } = controller;
  const { pathname, searchTerm } = useLocation();
  const [layout, page] = pathname.split("/").filter((el) => el !== "");

  const handleSearch = (event) => {
    setSearchTerm(dispatch, event.target.value);
  };





  return (
  <Navbar
  color={fixedNavbar ? "white" : "transparent"}
  className={`rounded-xl transition-all ${
    fixedNavbar
      ? "sticky top-0 z-40 py-3 shadow-md shadow-blue-gray-500/5"
      : "px-0 py-1"
  } ${page === 'viewOrder' ? 'hidden' : ''}`}
  fullWidth
  blurred={fixedNavbar}
>
 
      <div className="flex flex-col-reverse justify-between gap-6 md:flex-row md:items-center">
        <div className="capitalize">
          <Typography variant="h6" color="blue-gray">
            {page === 'tables' ? 'costomer data' : page === 'viewOrder' ? '' : page === 'edit' ? '' : page === 'home' ? 'Delivery Points' : page}
          </Typography>
        </div>
        <div className="flex items-center">
          <div className="mr-auto md:mr-4 md:w-56">
            <Input
      type="text"
      label="Search" 
      value={searchTerm}
      onChange={handleSearch}
      className="bg-white"
    />
          </div>
          <Menu>
            <MenuHandler>
              <IconButton variant="text" color="blue-gray">
                <BellIcon className="h-5 w-5 text-blue-gray-500" />
              </IconButton>
            </MenuHandler>
          </Menu>
          <IconButton
            variant="text"
            color="blue-gray"
            onClick={() => setOpenConfigurator(dispatch, true)}
          >
            <Cog6ToothIcon className="h-5 w-5 text-blue-gray-500" />
          </IconButton>
        </div>
      </div>
    </Navbar>
  );
}

DashboardNavbar.displayName = "/src/widgets/layout/dashboard-navbar.jsx";

export default DashboardNavbar;
