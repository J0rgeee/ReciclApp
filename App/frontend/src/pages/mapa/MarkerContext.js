import React, { createContext, useContext, useState } from "react";

const MarkerContext = createContext();

export const useMarkers = () => {
  const context = useContext(MarkerContext);
  if (!context) {
    throw new Error("useMarkers must be used within a MarkerProvider");
  }
  return context;
};

export const MarkerProvider = ({ children }) => {
  const [markers, setMarkers] = useState([]);

  return (
    <MarkerContext.Provider value={{ markers, setMarkers }}>
      {children}
    </MarkerContext.Provider>
  );
};
