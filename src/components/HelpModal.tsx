import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@nextui-org/modal";
import { Button } from "@nextui-org/button";
import { Kbd } from "@nextui-org/kbd";
import { Code } from "@nextui-org/code";
import { Link } from "@nextui-org/link";

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      closeButton
      size="2xl"
      motionProps={{
        variants: {
          enter: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.3, ease: "easeOut" },
          },
          exit: {
            y: -20,
            opacity: 0,
            transition: { duration: 0.2, ease: "easeIn" },
          },
        },
      }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold">TIGER King Help Guide</h2>
        </ModalHeader>
        <ModalBody className="py-6">
          <div className="space-y-4">
            <section>
              <h3 className="text-lg font-semibold mb-2">Keyboard Shortcuts</h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-default-100 p-2 rounded flex flex-row">
                  <div className="flex gap-2">
                    <Kbd className="bg-default-200 px-2 py-1 rounded">1</Kbd>
                    <Kbd className="bg-default-200 px-2 py-1 rounded">2</Kbd>
                    <Kbd className="bg-default-200 px-2 py-1 rounded">3</Kbd>
                  </div>
                  <span className="ml-2">Use Quick Tags</span>
                </div>
                <div className="bg-default-100 p-2 rounded">
                  <Kbd className="bg-default-200 px-2 py-1 rounded">f</Kbd>
                  <span className="ml-2">Clear TIGER tags</span>
                </div>
                <div className="bg-default-100 p-2 rounded">
                  <Kbd className="bg-default-200 px-2 py-1 rounded">s</Kbd>
                  <span className="ml-2">Submit way</span>
                </div>
                <div className="bg-default-100 p-2 rounded">
                  <Kbd className="bg-default-200 px-2 py-1 rounded">u</Kbd>
                  <span className="ml-2">Open upload modal</span>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">Common Actions</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Skip:</strong> Skip the current way if you're unsure
                  about its attributes
                </li>

                <li>
                  <strong>Fix:</strong> Mark the way with a{" "}
                  <Code>fixme:tigerking</Code> tag when there are issues
                </li>
                <li>
                  <strong>Clear TIGER tags:</strong> Remove TIGER tags when{" "}
                  <Code>surface</Code> and <Code>lanes</Code> are unclear
                </li>
                <li>
                  <strong>Submit:</strong> Save the way with updated surface and
                  lane information
                </li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">Tips</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Use the satellite imagery dropdown to switch to the best
                  available imagery
                </li>
                <li>
                  Toggle lane direction inputs when you need to specify forward
                  and backward lanes
                </li>
                <li>
                  Upload your changes regularly to avoid losing work in case of
                  browser issues
                </li>
                <li>
                  <Code className="py-1" size="sm">
                    lanes=none
                  </Code>{" "}
                  is just shorthand that will be converted to{" "}
                  <Code className="py-1" size="sm">
                    lane_markings=no
                  </Code>
                </li>
              </ul>
            </section>
            <div className="flex justify-center pt-4 gap-2">
              <Button
                showAnchorIcon
                as={Link}
                href={"https://wiki.openstreetmap.org/wiki/Key:tiger:reviewed"}
                target="_blank"
              >
                What are TIGER tags?
              </Button>
              <Button
                showAnchorIcon
                as={Link}
                href={"https://watmildon.github.io/TIGERMap/"}
                target="_blank"
              >
                How can I find them?
              </Button>
            </div>
            <div className="flex justify-center pt-4">
              <Button color="primary" variant="flat" onPress={onClose}>
                Got it!
              </Button>
            </div>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default HelpModal;
