"use client";

import React, { createContext, useContext, useState } from "react";

type ModalContextType = {
    isOpen: boolean;
    openModal: () => void;
    closeModal: () => void;
  };

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <ModalContext.Provider
      value={{
        isOpen,
        openModal: () => {setIsOpen(true); console.log("open") },
        closeModal: () => setIsOpen(false),
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error("useModal must be used inside ModalProvider");
  return ctx;
};