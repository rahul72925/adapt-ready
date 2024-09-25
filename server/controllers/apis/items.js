import fs from "node:fs";
import path from "node:path";

function filterFoodsFn(items, filters) {
  return items.filter((item) => {
    const { price, flavor_profile, search, diet } = filters;
    const { gte, lte } = price || {};
    let isValid = true;
    if (gte !== undefined) isValid = isValid && item.price >= gte;
    if (lte !== undefined) isValid = isValid && item.price <= lte;
    if (flavor_profile !== undefined)
      isValid =
        isValid &&
        item.flavor_profile !== -1 &&
        item.flavor_profile.toLowerCase() === flavor_profile.toLowerCase();
    if (diet !== undefined)
      isValid =
        isValid &&
        item.diet !== -1 &&
        item.diet.toLowerCase() === diet.toLowerCase();

    if (search !== undefined) {
      const regex = new RegExp(search, "i");
      // check for name
      const isValidForName =
        isValid && item.name !== -1 && regex.test(item.name);

      // check for ingredient
      const isValidForIngredient =
        isValid && item.ingredients !== -1 && regex.test(item.ingredients);

      // course
      const isValidForCourse =
        isValid && item.course !== -1 && regex.test(item.course);

      // check for state or region
      const isValidForRegion =
        isValid && item.region !== -1 && regex.test(item.region);
      const isValidForState =
        isValid && item.state !== -1 && regex.test(item.state);

      isValid =
        isValidForName ||
        isValidForIngredient ||
        isValidForCourse ||
        isValidForRegion ||
        isValidForState;
    }
    return isValid;
  });
}

export const getItems = async (req, res) => {
  try {
    const {
      limit = 10,
      offset = 0,
      price,
      flavor_profile,
      diet,
      search,
    } = req.query;

    const dataPath = path.join(process.cwd(), "seed-data.json");
    const seedData = fs.readFileSync(dataPath, "utf-8");
    const { indian_food } = JSON.parse(seedData);

    let filteredFoods = indian_food;

    filteredFoods = filterFoodsFn(filteredFoods, {
      price,
      flavor_profile,
      diet,
      search,
    });

    let limitedFood = filteredFoods.slice(offset, offset + limit);

    res.json({
      data: limitedFood,
      pagination: {
        total: filteredFoods.length,
        limit,
        offset,
      },
    });
  } catch (err) {
    console.log(err);
    res.send("something went wrong");
  }
};

export const getItem = async (req, res) => {
  try {
    const { foodId } = req.params;
    if (foodId === undefined) {
      res.statusCode = 400;
      throw new Error("foodId required");
    }

    const food = foods().find((eachFood) => eachFood.id === +foodId);
    return res.status(200).json({
      data: food || {},
      success: true,
    });
  } catch (error) {
    if (!res.statusCode) {
      res.statusCode = 500;
    }
    res.json({
      message: error.message || "Something went wrong",
      success: false,
    });
  }
};

const foods = () => {
  const dataPath = path.join(process.cwd(), "seed-data.json");
  const seedData = fs.readFileSync(dataPath, "utf-8");
  const { indian_food } = JSON.parse(seedData);

  return indian_food;
};
