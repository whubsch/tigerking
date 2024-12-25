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
import { useOsmAuthContext } from "../contexts/useOsmAuth";
import { OsmWay } from "../objects";
import logo from "../assets/tiger.svg";
import upload from "../assets/upload.svg";
import menu from "../assets/menu.svg";
import link from "../assets/link.svg";
import UserCard from "./UserCard";
import { uploadChanges } from "../services/upload";

interface NavbarProps {
  uploads: OsmWay[];
  setUploadWays: React.Dispatch<React.SetStateAction<OsmWay[]>>;
  location: string;
  setChangeset: React.Dispatch<React.SetStateAction<number>>;
}

const LinkIcon = () => {
  return <img src={link} alt="link" className="w-6 h-6" />;
};

// const getButtonColor = (count: number) => {
//   if (count >= 180) return "bg-red-600";
//   if (count >= 150) return "bg-red-500";
//   if (count >= 120) return "bg-red-400";
//   if (count >= 90) return "bg-red-300";
//   if (count >= 60) return "bg-orange-400";
//   if (count >= 30) return "bg-orange-300";
//   return "bg-default";
// };

const MainNavbar: React.FC<NavbarProps> = ({
  uploads,
  setUploadWays,
  location,
  setChangeset,
}) => {
  const {
    loggedIn,
    osmUser,
    userImage,
    changesetCount,
    handleLogin,
    handleLogout,
  } = useOsmAuthContext();

  const handleUpload = async (uploads: OsmWay[]) => {
    const changeset = await uploadChanges(uploads, location);
    setChangeset(changeset);
    setUploadWays([]);
  };

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
              isDisabled={uploads.length === 0}
              startContent={
                <img
                  src={upload}
                  alt="upload"
                  className="w-6 h-6 brightness-0 dark:brightness-100 dark:invert"
                />
              }
              onPress={() => handleUpload(uploads)}
            >
              <Chip>{uploads ? uploads.length : 0}</Chip>
            </Button>
            <Dropdown>
              <DropdownTrigger>
                <Button isIconOnly>
                  <img
                    src={menu}
                    alt="menu"
                    className="w-6 h-6 brightness-0 dark:brightness-100 dark:invert"
                  />
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Navigation menu">
                <DropdownItem
                  key="user"
                  target="_blank"
                  href={`https://www.openstreetmap.org/user/${osmUser}`}
                >
                  <UserCard
                    name={osmUser}
                    imageUrl={userImage}
                    changes={changesetCount}
                  />
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
            Login
          </Button>
        )}
      </NavbarContent>
    </Navbar>
  );
};

export default MainNavbar;
