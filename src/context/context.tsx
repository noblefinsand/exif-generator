import React, { createContext, useContext } from "react";
import EXIF from "exifr";

interface ExifContextType {
  isFilled: boolean;
  setIsFilled: React.Dispatch<React.SetStateAction<boolean>>;
  file: File | null;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
  getExifData: (file: File) => Promise<any>;
  exifData: any;
  setExifData: React.Dispatch<React.SetStateAction<any>>;
  handleReset: () => void;
  formatCellValue: (value: unknown) => string;
}

const ExifContext = createContext<ExifContextType | null>(null);

export const ExifProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isFilled, setIsFilled] = React.useState(false);
  const [file, setFile] = React.useState<File | null>(null);
  const [exifData, setExifData] = React.useState<any>({});

  const handleReset = () => {
    setExifData({});
    setFile(null);
    setIsFilled(false);
  };

  const formatCellValue = (value: unknown) => {
    if (value instanceof Date) return value.toLocaleString();
    if (Array.isArray(value)) return value.join(", ");
    if (typeof value === "object" && value !== null)
      return JSON.stringify(value);
    return String(value);
  };

  const getExifData = (file: File): Promise<any> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = async (event) => {
        const arrayBuffer = event.target?.result;
        if (arrayBuffer) {
          try {
            // Configure exifr to parse additional metadata
            const options = {
              tiff: true,        // Standard TIFF metadata
              exif: true,        // Standard EXIF metadata
              gps: true,         // GPS information
              xmp: true,         // Adobe XMP metadata
              icc: true,         // Color profile information
              iptc: true,        // IPTC metadata
              jfif: true,        // JPEG metadata
              interop: true,     // Interoperability data
              makerNote: true,   // Camera manufacturer specific data
              userComment: true, // User comments
              multiSegment: true // Read from multiple segments
            };

            const exifData = await EXIF.parse(arrayBuffer, options);
            
            // Add file information
            const enhancedData = {
              ...exifData,
              fileInfo: {
                name: file.name,
                size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
                type: file.type,
                lastModified: new Date(file.lastModified).toLocaleString()
              }
            };

            resolve(enhancedData);
          } catch (err) {
            reject(err);
          }
        } else {
          reject(new Error("Failed to read file"));
        }
      };

      reader.onerror = () => {
        reject(new Error("Error reading file"));
      };

      reader.readAsArrayBuffer(file);
    });
  };

  return (
    <ExifContext.Provider
      value={{
        isFilled,
        setIsFilled,
        file,
        setFile,
        getExifData,
        exifData,
        setExifData,
        handleReset,
        formatCellValue
      }}
    >
      {children}
    </ExifContext.Provider>
  );
};

export const useExifContext = () => {
  const context = useContext(ExifContext);
  if (!context) {
    throw new Error("useExifContext must be used within an ExifProvider");
  }
  return context;
};