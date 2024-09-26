import React from "react";
import { SearchBar } from "./searchBar";
import { Suggestion } from "./suggestionModal";

export const Header: React.FC = () => {
  return (
    <header className="h-16 bg-purple-800 flex items-center justify-between px-4 md:px-8 lg:px-16">
      <div className="hidden md:block md:flex-grow lg:flex-grow-0">
        <a href="/">
          <img
            src="https://pixabay.com/get/g581c0cf20f92a504bde4a6b71fc31fb501a16af9b6ed2e35b31991f7efad20a9808673197f6148e10fd97cbc9c2802f7503952781d666b103366b9131048cacafca874133fc68841a6b68b3168164bf5_640.png"
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
