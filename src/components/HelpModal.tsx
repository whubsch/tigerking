import React from "react";
import { Button } from "@nextui-org/button";
import { Kbd } from "@nextui-org/kbd";
import { Code } from "@nextui-org/code";
import { Link } from "@nextui-org/link";
import BaseModal from "./BaseModal";

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const keyboardShortcuts = [
  {
    keys: ["1", "2", "3"],
    description: "Use Quick Tags",
  },
  {
    keys: ["f"],
    description: "Clear TIGER tags",
  },
  {
    keys: ["s"],
    description: "Submit way",
  },
  {
    keys: ["u"],
    description: "Open upload modal",
  },
];

const commonActions = [
  {
    title: "Skip",
    description: "Skip the current way if you're unsure about its attributes",
  },
  {
    title: "Fix",
    description:
      "Mark the way with a fixme:tigerking tag when there are issues",
  },
  {
    title: "Clear TIGER tags",
    description: "Remove TIGER tags when surface and lanes are unclear",
  },
  {
    title: "Submit",
    description: "Save the way with updated surface and lane information",
  },
];

const tips = [
  "Use the satellite imagery dropdown to switch to the best available imagery",
  "Toggle lane direction inputs when you need to specify forward and backward lanes",
  "Upload your changes regularly to avoid losing work in case of browser issues",
  <>
    <Code className="py-1" size="sm">
      lanes=none
    </Code>{" "}
    is just shorthand that will be converted to{" "}
    <Code className="py-1" size="sm">
      lane_markings=no
    </Code>
  </>,
];

const externalLinks = [
  {
    label: "What are TIGER tags?",
    href: "https://wiki.openstreetmap.org/wiki/Key:tiger:reviewed",
  },
  {
    label: "How can I find them?",
    href: "https://watmildon.github.io/TIGERMap/",
  },
];

const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      title={{
        label: "TIGER King Guide",
        emoji: "📖",
        colorClass: "text-blue-600",
      }}
      subtitle="Learn how to use TIGER King"
      actions={[
        {
          label: "Got it!",
          color: "primary",
          variant: "flat",
          onClick: onClose,
        },
      ]}
    >
      <div className="space-y-4">
        <section>
          <div className="gap-4 items-center mb-2">
            <h3 className="text-lg font-semibold">Keyboard Shortcuts</h3>
            <h4 className="text-sm text-gray-500">Not available on mobile</h4>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {keyboardShortcuts.map((shortcut, index) => (
              <div
                key={index}
                className="bg-default-100 p-2 rounded flex flex-row"
              >
                <div className="flex gap-2">
                  {shortcut.keys.map((key, keyIndex) => (
                    <Kbd
                      key={keyIndex}
                      className="bg-default-200 px-2 py-1 rounded"
                    >
                      {key}
                    </Kbd>
                  ))}
                </div>
                <span className="ml-2">{shortcut.description}</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold mb-2">Common Actions</h3>
          <ul className="list-disc pl-6 space-y-2">
            {commonActions.map((action, index) => (
              <li key={index}>
                <strong>{action.title}:</strong> {action.description}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h3 className="text-lg font-semibold mb-2">Tips</h3>
          <ul className="list-disc pl-6 space-y-2">
            {tips.map((tip, index) => (
              <li key={index}>{tip}</li>
            ))}
          </ul>
        </section>

        <div className="flex justify-center pt-4 gap-2 flex-col md:flex-row">
          {externalLinks.map((link, index) => (
            <Button
              key={index}
              showAnchorIcon
              as={Link}
              href={link.href}
              target="_blank"
            >
              {link.label}
            </Button>
          ))}
        </div>
      </div>
    </BaseModal>
  );
};

export default HelpModal;
