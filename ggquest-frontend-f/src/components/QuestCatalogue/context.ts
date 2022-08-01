import React from "react";

const initialState = {
  active: "overview",
  setActive: (active: string) => {},
};

export const CardContext = React.createContext(initialState);
