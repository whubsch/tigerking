import React, { useState } from "react";
import { Navbar, NavbarContent, NavbarBrand } from "@heroui/navbar";
import { Button } from "@heroui/button";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  DropdownSection,
} from "@heroui/dropdown";
import { Chip } from "@heroui/chip";
import { Kbd } from "@heroui/kbd";
import { Tooltip } from "@heroui/tooltip";
import { Link } from "@heroui/link";
import { useOsmAuthContext } from "../contexts/useOsmAuth";
import { OsmWay } from "../objects";
import logo from "../assets/tiger_outline.svg";
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

const IconImage = ({
  src,
  alt,
  className = "",
}: {
  src: string;
  alt: string;
  className?: string;
}) => (
  <img
    src={src}
    alt={alt}
    className={`w-6 h-6 brightness-0 dark:brightness-100 dark:invert ${className}`}
  />
);

const EXTERNAL_LINKS = [
  {
    key: "github",
    href: "https://github.com/whubsch/tigerking",
    label: "GitHub",
  },
  {
    key: "openstreetmap",
    href: "https://openstreetmap.org",
    label: "OpenStreetMap",
  },
];

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

  const [showLoginModal, setShowLoginModal] = useState(false);

  const renderUploadButton = () => (
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
        startContent={<IconImage src={upload} alt="upload" />}
        onPress={() =>
          loggedIn ? setShowFinishedModal(true) : setShowLoginModal(true)
        }
        aria-label="Upload"
      >
        <Chip>{uploads.length || 0}</Chip>
      </Button>
    </Tooltip>
  );

  const renderDropdownMenu = () => (
    <Dropdown>
      <DropdownTrigger textValue="Menu">
        <Button isIconOnly>
          <IconImage src={menu} alt="menu" />
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Navigation menu" disabledKeys={["version"]}>
        <DropdownSection title="Account">
          {loggedIn ? (
            <>
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
            </>
          ) : (
            <DropdownItem key="login" onPress={() => setShowLoginModal(true)}>
              Login
            </DropdownItem>
          )}
        </DropdownSection>

        <DropdownSection title="Links">
          {EXTERNAL_LINKS.map((item) => (
            <DropdownItem
              key={item.key}
              href={item.href}
              target="_blank"
              endContent={<IconImage src={link} alt="link" />}
              textValue={item.label}
            >
              {item.label}
            </DropdownItem>
          ))}
        </DropdownSection>

        <DropdownItem
          key="help"
          onPress={() => setShowHelpModal(true)}
          endContent={<IconImage src={question} alt="help" />}
          textValue="Help"
        >
          Help
        </DropdownItem>

        <DropdownItem key="version" className="text-sm">
          version {packageJson.version}
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );

  return (
    <>
      <Navbar maxWidth="full" position="static" className="shadow">
        <NavbarBrand className="gap-4 flex-grow-0" as={Link} href="/tigerking/">
          <img src={logo} alt="Logo" className="w-8 h-8" />
          <h1 className="text-xl font-bold text-black dark:text-white">
            TIGER King
          </h1>
        </NavbarBrand>

        <NavbarContent justify="end">
          <>
            {renderUploadButton()}
            {renderDropdownMenu()}
          </>
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
