import React from "react";
import { SearchBar } from "./searchBar";
import { Suggestion } from "./suggestionModal";

export const Header: React.FC = () => {
  return (
    <header className="h-16 bg-purple-800 flex items-center justify-between px-4 md:px-8 lg:px-16">
      <div className="hidden md:block md:flex-grow lg:flex-grow-0">
        <a href="/">
          <img
            src="https://images.unsplash.com/photo-1541980294979-572cb9d973fd?q=80&w=3192&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            width={40}
            height={40}
          />
        </a>
      </div>
      <div className="flex-grow max-w-md w-full flex">
        <SearchBar />
        <Suggestion />
      </div>
      <div className="hidden md:block md:flex-grow lg:flex-grow-0"></div>
    </header>
  );
};
