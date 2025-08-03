import { createContext, useContext, useEffect, useState } from "react";

export interface Dataset {
    id: number;
    filename: string;
    uploaded_at: string;
    path: string;
}

interface DatasetContextType {
    selectedDataset: Dataset | null;
    setSelectedDataset: (dataset: Dataset | null) => void;
}

const DatasetContext = createContext<DatasetContextType | undefined>(undefined);

export const DatasetProvider = ({ children }: { children: React.ReactNode }) => {
    const [selectedDataset, setSelectedDatasetState] = useState<Dataset | null>(() => {
        if (typeof window !== "undefined") {
            const stored = localStorage.getItem("selectedDataset");
            return stored ? JSON.parse(stored) : null;
        }
        return null;
    });

    useEffect(() => {
        if (typeof window !== "undefined") {
            if (selectedDataset) {
                localStorage.setItem("selectedDataset", JSON.stringify(selectedDataset));
            } else {
                localStorage.removeItem("selectedDataset");
            }
        }
    }, [selectedDataset]);

    const setSelectedDataset = (dataset: Dataset | null) => {
        setSelectedDatasetState(dataset);
    };

    return (
        <DatasetContext.Provider value={{ selectedDataset, setSelectedDataset }}>
            {children}
        </DatasetContext.Provider>
    );
};

export const useDataset = () => {
    const context = useContext(DatasetContext);
    if (!context) {
        throw new Error("useDataset must be used within a DatasetProvider");
    }
    return context;
};
