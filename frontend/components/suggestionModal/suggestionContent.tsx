import { useEffect, useRef, useState } from "react";
import axios from "@/utils/getServerAxios";
import { capitalizeFirstCharacter } from "@/utils/capitalizeFirstCharacter";
import Button from "@/components/button";
import {
  MultiSelectDropdown,
  MultiSelectDropdownHandle,
} from "@/components/multiSelectDropdown";
import { MiniFoodCard } from "./miniFoodCard";

interface IngredientsOption {
  label: string;
  value: string;
}

interface SuggestedProps {
  id: number;
  name: string;
  ingredients: string;
}

interface SuggestionModalContentProps {
  handleCloseSuggestOnClick: () => void;
}

// suggestionModalContent
export const SuggestionModalContent: React.FC<SuggestionModalContentProps> = ({
  handleCloseSuggestOnClick,
}) => {
  const [ingredients, setIngredients] = useState<IngredientsOption[]>([]);
  const [ingredientFetchStatus, setIngredientsFetchStatus] =
    useState<string>("LOADING");
  const [suggestedFoods, setSuggestedFoods] = useState<SuggestedProps[]>([]);
  const [suggestedFoodsFetchStatus, setSuggestedFoodsFetchStatus] =
    useState<string>("IDLE");

  async function fetchIngredients() {
    try {
      const { data } = await axios.get("/ingredients");
      setIngredients(
        data.data.map((eachIngredient: string) => ({
          label: capitalizeFirstCharacter(eachIngredient),
          value: eachIngredient,
        }))
      );
      setIngredientsFetchStatus("SUCCESSES");
    } catch (err) {
      setIngredientsFetchStatus("ERROR");
    }
  }

  useEffect(() => {
    (async function () {
      await fetchIngredients();
    })();
  }, []);

  const multiSelectionRef = useRef<MultiSelectDropdownHandle>(null);

  const handleFindSuggestions = async () => {
    try {
      setSuggestedFoodsFetchStatus("LOADING");
      const selectedOptions = multiSelectionRef.current?.selectedOptions;

      const mapSelectedIngredients = selectedOptions
        ?.map((eachOption) => eachOption.value)
        .join(",");

      const { data } = await axios.get(
        "/items/suggest" + `?ingredients=${mapSelectedIngredients}`
      );

      setSuggestedFoods(data.data);
      setSuggestedFoodsFetchStatus("IDLE");
    } catch (err) {
      console.log("suggested food find error", err);
      setSuggestedFoodsFetchStatus("ERROR");
    }
  };

  return (
    <div className="relative z-[100] bg-slate-200 w-2/3 h-2/3 rounded-md p-4 flex flex-col items-center overflow-scroll">
      <Button
        onClick={handleCloseSuggestOnClick}
        className="absolute top-4 right-4 bg-transparent dark:bg-transparent dark:text-black dark:hover:bg-transparent border-2 border-black"
      >
        x
      </Button>
      <div className="sticky top-0">
        <MultiSelectDropdown options={ingredients} ref={multiSelectionRef} />
        <Button onClick={handleFindSuggestions}>Find</Button>
      </div>
      <div>
        {suggestedFoodsFetchStatus === "LOADING" && <p>Loading...</p>}
        {suggestedFoodsFetchStatus === "ERROR" && <p>Something went wrong!</p>}
        {suggestedFoodsFetchStatus === "IDLE" && suggestedFoods.length > 0
          ? suggestedFoods.map((eachFood) => (
              <MiniFoodCard key={eachFood.id} food={eachFood} />
            ))
          : null}
      </div>
    </div>
  );
};
