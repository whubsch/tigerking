import { Modal, ModalContent, Button } from "@nextui-org/react";

interface LocationProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (wikidataId: string) => void;
}

//const WikidataModal: FC<WikidataModalProps> = { isOpen, onClose, onSubmit };
const Location: React.FC<LocationProps> = ({ isOpen, onClose, onSubmit }) => {
  return (
    <>
      <Modal
        isDismissable={false}
        isKeyboardDismissDisabled={true}
        isOpen={isOpen}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Enter Wikidata ID</h2>

                <form onSubmit={onSubmit}>
                  <div className="mb-4">
                    <label
                      htmlFor="wikidataId"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Wikidata ID
                    </label>
                    <input
                      type="text"
                      id="wikidataId"
                      value={wikidataId}
                      onChange={(e) => setWikidataId(e.target.value)}
                      placeholder="Example: Q42"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {error && (
                      <p className="text-red-500 text-sm mt-1">{error}</p>
                    )}
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
