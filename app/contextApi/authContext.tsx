import React, { useState, createContext, ReactNode } from "react";

// Define the shape of the context state
interface AuthContextProps {
  userInfo: object;
  setUserInfo: React.Dispatch<React.SetStateAction<object>>;
}

// Create the context with an initial value
export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// Create a provider component with props type definition for children
interface AuthContextProviderProps {
  children: ReactNode;
}

export const AuthContextProvider: React.FC<AuthContextProviderProps> = ({ children }) => {
  const [userInfo, setUserInfo] = useState<object>({});

  return (
    <AuthContext.Provider value={{ userInfo, setUserInfo }}>
      {children}
    </AuthContext.Provider>
  );
};
