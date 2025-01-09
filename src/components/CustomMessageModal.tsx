import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/modal";
import { Button } from "@nextui-org/button";
import { Textarea } from "@nextui-org/input";

interface CustomMessageModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  customMessage: string;
  setCustomMessage: (message: string) => void;
  onSubmit: () => void;
}

const CustomMessageModal: React.FC<CustomMessageModalProps> = ({
  isOpen,
  onOpenChange,
  customMessage,
  setCustomMessage,
  onSubmit,
}) => (
  <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center">
    <ModalContent>
      {(onClose) => (
        <>
          <ModalHeader>Custom Fix Message</ModalHeader>
          <ModalBody>
            <Textarea
              label="Message"
              placeholder="Enter your custom fix message"
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
              Cancel
            </Button>
            <Button color="primary" onPress={onSubmit}>
              Submit
            </Button>
          </ModalFooter>
        </>
      )}
    </ModalContent>
  </Modal>
);

export default CustomMessageModal;
