import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@nextui-org/modal";
import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/link";
import UploadButton from "./UploadButton";
import { OsmWay } from "../objects";
import ChangesetTagTable from "./ChangesetTags";
import { useOsmAuthContext } from "../contexts/useOsmAuth";
import { useChangesetStore } from "../stores/useChangesetStore";

interface FinishedModalProps {
  show: boolean;
  ways: number;
  onClose: () => void;
  uploads: OsmWay[];
  setUploadWays: React.Dispatch<React.SetStateAction<OsmWay[]>>;
  setChangeset: React.Dispatch<React.SetStateAction<number>>;
  setError: React.Dispatch<React.SetStateAction<string>>;
}

const FinishedModal: React.FC<FinishedModalProps> = ({
  show,
  ways,
  onClose,
  uploads,
  setUploadWays,
  setChangeset,
  setError,
}) => {
  const { source, description } = useChangesetStore();
  const { osmUser } = useOsmAuthContext();

  return (
    <Modal
      isOpen={show}
      onClose={onClose}
      isDismissable={true}
      motionProps={{
        variants: {
          enter: {
            y: 0,
            opacity: 1,
            transition: {
              duration: 0.3,
              ease: "easeOut",
            },
          },
          exit: {
            y: -20,
            opacity: 0,
            transition: {
              duration: 0.2,
              ease: "easeIn",
            },
          },
        },
      }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold text-blue-600">
            Ready to Upload? 🚀
          </h2>
          <p className="text-sm text-gray-500">
            Time to make your changes permanent!
          </p>
        </ModalHeader>

        <ModalBody className="py-6">
          <div className="space-y-6">
            {/* <div className="bg-blue-50 p-4 rounded-lg"></div> */}

            <div className="flex flex-col items-center gap-2">
              <div className="bg-gray-100 px-6 py-3 rounded-full">
                <span className="text-2xl font-bold text-gray-700">{ways}</span>
                <span className="text-gray-600 ml-2">
                  {ways > 1 ? "ways" : "way"} reviewed
                </span>
              </div>
            </div>

            <p className="text-center text-medium font-medium">
              The changes you upload as
              <Link
                className="px-1 text-medium font-medium hover:underline"
                target="_blank"
                href={`https://www.openstreetmap.org/user/${osmUser}`}
              >
                {osmUser}
              </Link>
              will be visible on all maps that use OpenStreetMap data.
            </p>

            <ChangesetTagTable source={source} description={description} />

            <div className="flex flex-col gap-2">
              <UploadButton
                uploads={uploads}
                setUploadWays={setUploadWays}
                setChangeset={setChangeset}
                setError={setError}
              />

              <Button onPress={onClose} variant="light" className="w-full">
                Cancel
              </Button>
              <Button
                color="danger"
                variant="light"
                onPress={() => {
                  setUploadWays([]);
                  onClose();
                }}
                className="pt-2"
              >
                Clear
              </Button>
            </div>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default FinishedModal;
