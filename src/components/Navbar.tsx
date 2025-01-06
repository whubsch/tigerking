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
import { Chip } from "@nextui-org/chip";
import { Kbd } from "@nextui-org/kbd";
import { Tooltip } from "@nextui-org/tooltip";
import { useOsmAuthContext } from "../contexts/useOsmAuth";
import { OsmWay } from "../objects";
import logo from "../assets/tiger.svg";
import menu from "../assets/menu.svg";
import link from "../assets/link.svg";
import upload from "../assets/upload.svg";
import question from "../assets/question.svg";
import UserCard from "./UserCard";
import LoginModal from "./LoginModal";
import packageJson from "../../package.json";

interface NavbarProps {
  uploads: OsmWay[];
  setShowFinishedModal: React.Dispatch<React.SetStateAction<boolean>>;
  setShowHelpModal: (show: boolean) => void;
}

const LinkIcon = () => {
  return <img src={link} alt="link" className="w-6 h-6" />;
};

const MainNavbar: React.FC<NavbarProps> = ({
  uploads,
  setShowFinishedModal,
  setShowHelpModal,
}) => {
  const {
    loggedIn,
    osmUser,
    userImage,
    changesetCount,
    handleLogin,
    handleLogout,
  } = useOsmAuthContext();
  const [showLoginModal, setShowLoginModal] = React.useState(false);

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
    <>
      <Navbar maxWidth="full" position="static" className="shadow">
        <NavbarBrand className="gap-4">
          <img src={logo} alt="Logo" className="w-8 h-8" />
          <h1 className="text-xl font-bold">TIGER King</h1>
        </NavbarBrand>

        <NavbarContent justify="end">
          {loggedIn ? (
            <>
              <Tooltip
                content={
                  <div className="flex gap-2 items-center">
                    <p>Upload</p>
                    <Kbd>u</Kbd>
                  </div>
                }
                delay={250}
              >
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
                  onPress={() => setShowFinishedModal(true)}
                  aria-label="Upload"
                >
                  <Chip>{uploads ? uploads.length : 0}</Chip>
                </Button>
              </Tooltip>
              <Dropdown>
                <DropdownTrigger textValue="Menu">
                  <Button isIconOnly>
                    <img
                      src={menu}
                      alt="menu"
                      className="w-6 h-6 brightness-0 dark:brightness-100 dark:invert"
                    />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  aria-label="Navigation menu"
                  disabledKeys={["version"]}
                >
                  <DropdownSection title="Account">
                    <DropdownItem
                      key="user"
                      target="_blank"
                      href={`https://www.openstreetmap.org/user/${osmUser}`}
                      textValue={`User details for ${osmUser}`}
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
                        textValue={item.label}
                      >
                        {item.label}
                      </DropdownItem>
                    ))}
                  </DropdownSection>
                  <DropdownItem
                    key="help"
                    onPress={() => setShowHelpModal(true)}
                    endContent={
                      <img
                        src={question}
                        className="h-6 w-6 brightness-0 dark:brightness-100 dark:invert"
                      />
                    }
                    textValue="Help"
                  >
                    Help
                  </DropdownItem>
                  <DropdownItem key="version" className="text-sm">
                    version {packageJson.version}
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </>
          ) : (
            <Button
              color="primary"
              variant="solid"
              onPress={() => setShowLoginModal(true)}
            >
              Login
            </Button>
          )}
        </NavbarContent>
      </Navbar>
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={() => {
          handleLogin();
          setShowLoginModal(false);
        }}
      />
    </>
  );
};

export default MainNavbar;
