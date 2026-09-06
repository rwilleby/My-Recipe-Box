import assert from "node:assert/strict";
import { recipes } from "../src/data/recipes.js";
import { STANDARD_COOKING_UNITS } from "../src/data/ingredientStandards.js";
import { consolidateShoppingItems } from "../src/utils/ingredientNormalization.js";
const audited=recipes.filter(r=>/^DN-00[1-7]$/.test(r.id)&&!r.originalRecipeId); const rows=audited.flatMap(r=>r.ingredients.map(ingredient=>({recipeId:r.id,ingredient}))); const get=(id,name)=>recipes.find(r=>r.id===id).ingredients.find(i=>i.originalName===name);
assert.equal(audited.length,7); assert.equal(rows.length,100); assert.ok(rows.every(({ingredient})=>ingredient.standardVersion==="1.37")); assert.equal(rows.filter(({ingredient})=>ingredient.reviewStatus==="needs-review").length,0); assert.deepEqual(rows.filter(({ingredient})=>ingredient.cookingUnit&&!STANDARD_COOKING_UNITS.includes(ingredient.cookingUnit)),[]);
for(const id of ["DN-001","DN-002","DN-003","DN-004","DN-005","DN-006","DN-007"]){const oil=get(id,"Vegetable oil for frying");assert.equal(oil.cookingQuantity,null,null);assert.equal(oil.includeInShopping,false);}
assert.equal(get("DN-002","Milk").recipeQuantityText,"3–4"); assert.equal(get("DN-007","Milk").recipeQuantityText,"2–3"); assert.equal(get("DN-006","Peeled and diced apples (small dice)").shoppingQuantity,2); assert.equal(get("DN-007","Fresh blueberries (or frozen, thawed)").shoppingQuantity,6);
for(const name of ["Pastry cream or vanilla pudding","Strawberry or raspberry jam","Chocolate hazelnut spread"]){const filling=get("DN-005",name);assert.equal(filling.includeInShopping,false);assert.equal(consolidateShoppingItems([filling]).length,0);}
console.log("DN-001 through DN-007 ingredient checkpoint passed with zero review flags.");
