import React from "react";
import {
  Navbar,
  NavbarContent,
  NavbarBrand,
  Button,
  Chip,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import { useOsmAuthContext } from "../contexts/AuthContext";
import logo from "../assets/tiger.svg";
import upload from "../assets/upload.svg";
import menu from "../assets/menu.svg";
import link from "../assets/link.svg";
import UserCard from "./UserCard";

interface NavbarProps {
  uploadCount: number;
}

const LinkIcon = () => {
  return <img src={link} alt="link" className="w-6 h-6" />;
};

const getButtonColor = (count: number) => {
  if (count >= 180) return "bg-red-600";
  if (count >= 150) return "bg-red-500";
  if (count >= 120) return "bg-red-400";
  if (count >= 90) return "bg-red-300";
  if (count >= 60) return "bg-orange-400";
  if (count >= 30) return "bg-orange-300";
  return "bg-default";
};

const MainNavbar: React.FC<NavbarProps> = ({ uploadCount }) => {
  const { loggedIn, osmUser, userImage, handleLogin, handleLogout } =
    useOsmAuthContext();
  return (
    <Navbar maxWidth="full" position="static" className="shadow">
      <NavbarBrand className="gap-4">
        <img src={logo} alt="Logo" className="w-8 h-8" />
        <h1 className="text-xl font-bold">TIGER King</h1>
      </NavbarBrand>

      <NavbarContent justify="end">
        {loggedIn ? (
          <>
            <Button
              variant="flat"
              startContent={
                <img
                  src={upload}
                  alt="upload"
                  className={`w-6 h-6 ${getButtonColor(uploadCount)}`}
                />
              }
            >
              <Chip>{uploadCount}</Chip>
            </Button>
            <Dropdown>
              <DropdownTrigger>
                <Button isIconOnly>
                  <img src={menu} alt="menu" className="w-6 h-6" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Navigation menu">
                <DropdownItem
                  key="user"
                  target="_blank"
                  href={`https://www.openstreetmap.org/user/${osmUser}`}
                >
                  <UserCard name={osmUser} imageUrl={userImage} changes={0} />
                </DropdownItem>
                <DropdownItem
                  key="tiger_map"
                  href="https://watmildon.github.io/TIGERMap/"
                  target="_blank"
                  endContent={<LinkIcon />}
                >
                  TIGER Map
                </DropdownItem>
                <DropdownItem
                  key="openstreetmap"
                  href="https://openstreetmap.org"
                  target="_blank"
                  endContent={<LinkIcon />}
                >
                  OpenStreetMap
                </DropdownItem>
                <DropdownItem
                  key="logout"
                  className="text-danger"
                  color="danger"
                  onPress={handleLogout}
                >
                  Log Out
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </>
        ) : (
          <Button color="primary" variant="solid" onPress={handleLogin}>
            Login with OpenStreetMap
          </Button>
        )}
      </NavbarContent>
    </Navbar>
  );
};

export default MainNavbar;
