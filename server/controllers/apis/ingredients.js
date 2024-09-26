import path from "node:path";
import fs from "node:fs";

export const getIngredients = async (req, res) => {
  try {
    const allAvailableIngredients = ingredients();

    return res.status(200).json({
      data: allAvailableIngredients,
      success: true,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: err,
    });
  }
};

const ingredients = () => {
  const dataPath = path.join(process.cwd(), "./data/ingredients.json");
  const seedData = fs.readFileSync(dataPath, "utf-8");
  const { ingredients } = JSON.parse(seedData);

  return ingredients;
};
