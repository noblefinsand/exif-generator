import {
  Button,
  Cell,
  Column,
  Flex,
  Row,
  TableBody,
  TableHeader,
  TableView,
} from "@adobe/react-spectrum";
import { useExifContext } from "../context/context";

const ExifTable = () => {
  const { exifData, handleReset, formatCellValue} = useExifContext();

  const columns = [
    { name: "Tag", uid: "key" },
    { name: "Value", uid: "value" },
  ];
  
  const rows = Object.entries(exifData).map(([key, value]) => ({
    key,
    value,
  }));

  return (
    <Flex
      height="100vh"
      alignItems="center"
      justifyContent="center"
      direction="column"
      gap={10}
    >
      <h2>Exif Data</h2>
      <TableView
        overflowMode="wrap"
        height="auto"
        maxHeight={"50vh"}
        width="50vw"
      >
        <TableHeader columns={columns}>
          {columns.map((column) => (
            <Column key={column.uid} align="start" allowsSorting>
              {column.name}
            </Column>
          ))}
        </TableHeader>
        <TableBody items={rows}>
          {(item: { key: string; value: unknown }) => (
            <Row>
              {(columnKey) => (
                <Cell>{formatCellValue(item[columnKey as keyof typeof item])}</Cell>
              )}
            </Row>
          )}
        </TableBody>
      </TableView>
      <Button onPress={handleReset} variant="primary">
        Reset
      </Button>
    </Flex>
  );
};

export default ExifTable;
