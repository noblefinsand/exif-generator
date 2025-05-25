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
import { useEffect, useState } from "react";

const ExifTable = () => {
  const { exifData, handleReset, formatCellValue } = useExifContext();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
      UNSAFE_style={{ padding: '20px' }}
    >
      <h2>Exif Data</h2>
      <TableView
        overflowMode="wrap"
        height="auto"
        maxHeight={isMobile ? "70vh" : "50vh"}
        width={isMobile ? "90vw" : "60vw"}
        density={isMobile ? "compact" : "regular"}
      >
        <TableHeader columns={columns}>
          {columns.map((column) => (
            <Column 
              key={column.uid} 
              align="start" 
              allowsSorting
              minWidth={isMobile ? 100 : 150}
            >
              {column.name}
            </Column>
          ))}
        </TableHeader>
        <TableBody items={rows}>
          {(item: { key: string; value: unknown }) => (
            <Row>
              {(columnKey) => (
                <Cell>
                  <div
                    style={{ 
                      whiteSpace: "normal", 
                      wordBreak: "break-word",
                      padding: isMobile ? '4px' : '8px'
                    }}
                  >
                    {formatCellValue(item[columnKey as keyof typeof item])}
                  </div>
                </Cell>
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
