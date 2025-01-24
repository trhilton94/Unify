import React, { createContext, useState, useContext, Dispatch, SetStateAction, ReactNode } from 'react';

// Define the type for the context state
type GeneralState = {
    categoryDropdownState: boolean;
    settingsIconVisibilityState: boolean;
    settingsDropdownState: boolean;
    darkModeState: boolean;
};

// Define the type for the context value
type GeneralContextType = {
    general: GeneralState;
    setGeneral: Dispatch<SetStateAction<GeneralContextType['general']>>;
};

// Default state
const defaultGeneralState = {
    categoryDropdownState: false,
    settingsIconVisibilityState: true,
    settingsDropdownState: false,
    darkModeState: true,
};

// Default context value
const defaultContextValue: GeneralContextType = {
    general: defaultGeneralState,
    setGeneral: () => {},
};

// Create the context with the default value
const GeneralContext = createContext<GeneralContextType>(defaultContextValue);

// Custom hook to use the GeneralContext
export const useGeneral = () => useContext(GeneralContext);

// Define the props for the GeneralProvider
type GeneralProviderProps = {
    children: ReactNode;
};

export const GeneralProvider: React.FC<GeneralProviderProps> = ({ children }) => {
    const [general, setGeneral] = useState<GeneralState>(defaultGeneralState);

    return <GeneralContext.Provider value={{ general, setGeneral }}>{children}</GeneralContext.Provider>;
};