import fs from "node:fs";
import path from "node:path";

function filterFoodsFn(items, filters) {
  const {
    price: { gte, lte } = {},
    flavor_profile,
    search,
    diet,
    name,
    state,
  } = filters;

  const regexMatch = (value, pattern) =>
    pattern ? new RegExp(pattern, "i").test(value) : true;

  return items.filter((item) => {
    // Check price range
    if (gte !== undefined && item.price < gte) return false;
    if (lte !== undefined && item.price > lte) return false;

    // Check individual filters
    if (!regexMatch(item.flavor_profile, flavor_profile)) return false;
    if (!regexMatch(item.name, name)) return false;
    if (!regexMatch(item.state, state)) return false;
    if (diet && item.diet?.toLowerCase() !== diet.toLowerCase()) return false;

    // Handle search query across multiple fields
    if (search) {
      const searchFields = [
        item.name,
        item.ingredients,
        item.course,
        item.region,
        item.state,
      ];
      const matchesSearch = searchFields.some((field) =>
        regexMatch(field, search)
      );
      return matchesSearch;
    }

    return true;
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
      sortBy,
      orderBy,
      name,
      state,
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
      name,
      state,
    });
    if (orderBy && sortBy) {
      const numericKeys = ["cook_time", "prep_time"];
      filteredFoods = filteredFoods.sort((a, b) => {
        if (numericKeys.includes(sortBy)) {
          return orderBy === "ascend"
            ? a[sortBy] - b[sortBy]
            : b[sortBy] - a[sortBy];
        } else {
          return orderBy === "ascend"
            ? a[sortBy].localeCompare(b[sortBy])
            : b[sortBy].localeCompare(a[sortBy]);
        }
      });
    }

    let limitedFood = filteredFoods.slice(+offset, +offset + +limit);

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

export const suggestItem = async (req, res) => {
  try {
    const { ingredients, partialInclude = true } = req.query;
    // partialInclude:true all food can contain one or more ingredients
    // partialInclude:false all food strictly contain all ingredients

    if (ingredients === undefined) {
      res.statusCode = 400;
      throw new Error("ingredients parameter required");
    }

    const parseIngredients = ingredients.split(",");
    const filteredFoods = foods().filter((eachFood) => {
      const regexArr = parseIngredients.map((each) => new RegExp(each, "i"));
      let isValid = false;
      if (partialInclude) {
        regexArr.forEach(
          (eachRegex) =>
            (isValid = isValid || eachRegex.test(eachFood.ingredients))
        );
      } else {
        regexArr.forEach(
          (eachRegex) =>
            (isValid = isValid && eachRegex.test(eachFood.ingredients))
        );
      }

      return isValid;
    });

    const limitedKeysFoods = filteredFoods.map(({ id, name, ingredients }) => ({
      id,
      name,
      ingredients,
    }));
    res.status(200).json({
      data: limitedKeysFoods,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: err,
    });
  }
};
