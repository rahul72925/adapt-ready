"use client";
import React, { useCallback, useState } from "react";
import axios from "@/utils/getServerAxios";
import { debounce } from "@/utils/debounce";
import { capitalizeFirstCharacter } from "@/utils/capitalizeFirstCharacter";
import { useRouter } from "next/navigation";

export const SearchBar: React.FC = () => {
  const router = useRouter();
  const [searchText, setSearchText] = useState<string>("");
  const [foodFetchStatus, setFoodFetchStatus] = useState<string>("IDLE");
  const [foods, setFoods] = useState<any[]>([]);

  const fetchData = async (query: string) => {
    if (!query) {
      setFoods([]);
      return;
    }
    try {
      setFoodFetchStatus("LOADING");
      const response = await axios.get(`/items?search=${query}`);
      setFoods(response.data.data);
      setFoodFetchStatus("SUCCESSES");
    } catch (error) {
      console.error("food data fetch error", error);
      setFoodFetchStatus("ERROR");
    } finally {
      setTimeout(() => {
        setFoodFetchStatus("IDLE");
      }, 5000);
    }
  };

  const debouncedFetch = useCallback(debounce(fetchData, 500), []);

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchText(value);
    debouncedFetch(value); // Call the debounced function
  };

  const handleResultClick = (id: number) => {
    router.push(`/food/${id}`);
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        placeholder="search food, city, ingredient..."
        value={searchText}
        onChange={handleSearchInputChange}
        className="w-full p-2 rounded-lg bg-gray-100 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300 ease-in-out border border-gray-300 shadow-sm text-black font-medium	"
      />
      <div className="absolute w-full z-40">
        {foodFetchStatus === "LOADING" && <InfoText text="Loading..." />}
        {foodFetchStatus === "ERROR" && (
          <InfoText text={"Something went wrong"} />
        )}

        {foods.length > 0 && (
          <ul className="mt-2 bg-white border border-gray-300 rounded-lg shadow-md w-full">
            {foods.map((food) => (
              <li
                key={food.name}
                onClick={() => handleResultClick(food.id)}
                className="cursor-pointer p-2 hover:bg-purple-200 transition-colors duration-200 text-black "
              >
                {capitalizeFirstCharacter(food.name)}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

interface InfoTextInterface {
  text: string;
}

const InfoText: React.FC<InfoTextInterface> = ({ text }) => (
  <p className="mt-2 p-2 text-center bg-white border border-gray-300 rounded-lg shadow-md w-full text-black">
    {text}
  </p>
);
