import {
  Button,
  Content,
  DropZone,
  FileTrigger,
  Flex,
  Heading,
  IllustratedMessage,
  ToastQueue,
} from "@adobe/react-spectrum";
import Upload from "@spectrum-icons/illustrations/Upload";
import { useExifContext } from "../context/context";
import { ExifTable } from "../components"
import { TIMEOUT_AMOUNT } from "../constants/constants";

const UploadFile = () => {
  const {
    isFilled,
    setIsFilled,
    setFile,
    file,
    getExifData,
    setExifData,
    handleReset,
    exifData,
  } = useExifContext();

  if (file && !exifData) {
    ToastQueue.negative('No Exif data found', {
        timeout: TIMEOUT_AMOUNT
    });
    handleReset();
  }

  if (exifData && Object.keys(exifData).length > 0) {
    return <ExifTable />;
  }

  return (
    <Flex
      direction="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      gap={10}
    >
      <h2>Exif Generator</h2>
      <DropZone
        width="50vw"
        height="50vh"
        isFilled={isFilled}
        onDrop={(e) => {
          e.items.find(async (item) => {
            if (item.kind === "file") {
              let file = await item.getFile();
              if (file) {
                setFile(file);
                setIsFilled(true);
              }
            }
          });
        }}
      >
        <IllustratedMessage>
          <Upload />
          <Heading>
            {isFilled ? "You dropped something!" : "Drag and drop here"}
          </Heading>
          <Content>
            <FileTrigger
              onSelect={async (files: FileList | null) => {
                const selectedFile = files?.[0];
                if (selectedFile) {
                  try {
                    const data = await getExifData(selectedFile);
                    setExifData(data);
                    setFile(selectedFile);
                    setIsFilled(true);
                  } catch (err) {
                    console.error(
                      "Failed to extract EXIF data from FileTrigger",
                      err
                    );
                  }
                }
              }}
            >
              <Button variant="primary">Browse</Button>
            </FileTrigger>
          </Content>
        </IllustratedMessage>
      </DropZone>
    </Flex>
  );
};

export default UploadFile;
