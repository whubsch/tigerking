import React from "react";
import { Navbar, NavbarContent, NavbarBrand } from "@nextui-org/navbar";
import { Button } from "@nextui-org/button";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  DropdownSection,
} from "@nextui-org/dropdown";
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
  setChangeset: React.Dispatch<React.SetStateAction<number>>;
  setError: React.Dispatch<React.SetStateAction<string>>;
}

const LinkIcon = () => {
  return <img src={link} alt="link" className="w-6 h-6" />;
};

const MainNavbar: React.FC<NavbarProps> = ({
  uploads,
  setUploadWays,
  setChangeset,
  setError,
}) => {
  const {
    loggedIn,
    osmUser,
    userImage,
    changesetCount,
    handleLogin,
    handleLogout,
  } = useOsmAuthContext();

  const externalLinks = [
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
              setChangeset={setChangeset}
              setError={setError}
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
                <DropdownSection title="Account">
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
                    key="logout"
                    className="text-danger"
                    color="danger"
                    onPress={handleLogout}
                  >
                    Log Out
                  </DropdownItem>
                </DropdownSection>
                <DropdownSection title="Links">
                  {externalLinks.map((item) => (
                    <DropdownItem
                      key={item.key}
                      href={item.href}
                      target="_blank"
                      endContent={<LinkIcon />}
                    >
                      {item.label}
                    </DropdownItem>
                  ))}
                </DropdownSection>
                <DropdownItem key="version" className="text-sm" isDisabled>
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
