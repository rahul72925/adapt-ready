import { capitalizeFirstCharacter } from "@/utils/capitalizeFirstCharacter";

interface MiniCardProps {
  food: FoodInterface;
}

interface FoodInterface {
  name: string;
  id: number;
  ingredients: string;
}

export const MiniFoodCard: React.FC<MiniCardProps> = ({ food }) => {
  const { name, id, ingredients } = food;
  return (
    <a
      href={`/food/${id}`}
      target="_blank"
      className="bg-white p-4 border-black m-2 rounded-md cursor-pointer block"
    >
      <div className="font-bold text-xl mb-2 text-black">
        {capitalizeFirstCharacter(name)}
      </div>
      <p className="text-gray-700 text-base">
        <strong>Ingredients:</strong> {ingredients}
      </p>
    </a>
  );
};
