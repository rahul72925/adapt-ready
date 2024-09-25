import React from "react";
import { SearchBar } from "./searchBar";

export const Header: React.FC = () => {
  return (
    <header className="h-16 bg-purple-800 flex items-center justify-between px-4 md:px-8 lg:px-16">
      <div className="hidden md:block md:flex-grow lg:flex-grow-0"></div>
      <div className="flex-grow max-w-md w-full">
        <SearchBar />
      </div>
      <div className="hidden md:block md:flex-grow lg:flex-grow-0"></div>
    </header>
  );
};
