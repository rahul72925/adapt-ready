import { capitalizeFirstCharacter } from "@/utils/capitalizeFirstCharacter";
import axios from "../../../utils/getServerAxios";

export default async function FoodPage({
  params: { foodId },
}: {
  params: { foodId: number };
}) {
  const { success, food } = await getFood(foodId);
  const {
    name,
    ingredients,
    diet,
    prep_time,
    cook_time,
    flavor_profile,
    course,
    region,
  } = food;
  return (
    <div className="h-screen flex justify-center items-center p-4">
      <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white">
        <div className="px-6 py-4">
          <div className="font-bold text-xl mb-2 text-black">
            {capitalizeFirstCharacter(name)}
          </div>
          <p className="text-gray-700 text-base">
            <strong>Ingredients:</strong> {ingredients}
          </p>
          <p className="text-gray-700 text-base">
            <strong>Diet:</strong> {diet}
          </p>
          <p className="text-gray-700 text-base">
            <strong>Preparation Time:</strong> {prep_time} minutes
          </p>
          <p className="text-gray-700 text-base">
            <strong>Cook Time:</strong> {cook_time} minutes
          </p>
          <p className="text-gray-700 text-base">
            <strong>Flavor Profile:</strong> {flavor_profile}
          </p>
          <p className="text-gray-700 text-base">
            <strong>Course:</strong> {course}
          </p>
          <p className="text-gray-700 text-base">
            <strong>Region:</strong> {region}
          </p>
        </div>
      </div>
    </div>
  );
}

async function getFood(id: number) {
  try {
    const { data } = await axios.get(`/items/${id}`);
    return {
      success: true,
      food: data.data,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      food: {},
      error,
    };
  }
}
