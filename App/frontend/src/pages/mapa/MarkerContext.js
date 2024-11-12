import React, { createContext, useContext, useState } from "react";

const MarkerContext = createContext();

export const MarkerProvider = ({ children }) => {
  const [markers, setMarkers] = useState([]);

  return (
    <MarkerContext.Provider value={{ markers, setMarkers }}>
      {children}
    </MarkerContext.Provider>
  );
};

export const useMarkers = () => useContext(MarkerContext);
