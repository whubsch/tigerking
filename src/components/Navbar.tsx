import React from "react";
import {
  Navbar,
  NavbarContent,
  NavbarBrand,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import { useOsmAuthContext } from "../contexts/useOsmAuth";
import { OsmWay } from "../objects";
import logo from "../assets/tiger.svg";
import menu from "../assets/menu.svg";
import link from "../assets/link.svg";
import UserCard from "./UserCard";
import UploadButton from "./UploadButton";
import packageJson from "../../package.json";

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

  const dropdownItems = [
    {
      key: "github",
      href: "https://github.com/whubsch/tigerking",
      label: "GitHub",
    },
    {
      key: "tiger_map",
      href: "https://watmildon.github.io/TIGERMap/",
      label: "TIGER Map",
    },
    {
      key: "openstreetmap",
      href: "https://openstreetmap.org",
      label: "OpenStreetMap",
    },
  ];
  return (
    <Navbar maxWidth="full" position="static" className="shadow">
      <NavbarBrand className="gap-4">
        <img src={logo} alt="Logo" className="w-8 h-8" />
        <h1 className="text-xl font-bold">TIGER King</h1>
      </NavbarBrand>

      <NavbarContent justify="end">
        {loggedIn ? (
          <>
            <UploadButton
              uploads={uploads}
              setUploadWays={setUploadWays}
              location={location}
              setChangeset={setChangeset}
            />
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
                <>
                  {dropdownItems.map((item) => (
                    <DropdownItem
                      key={item.key}
                      href={item.href}
                      target="_blank"
                      endContent={<LinkIcon />}
                    >
                      {item.label}
                    </DropdownItem>
                  ))}
                </>
                <DropdownItem
                  key="logout"
                  className="text-danger"
                  color="danger"
                  onPress={handleLogout}
                >
                  Log Out
                </DropdownItem>
                <DropdownItem key="version" className="text-sm text-gray-500">
                  version {packageJson.version}
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
