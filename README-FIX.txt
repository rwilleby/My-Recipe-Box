Upload these files to GitHub using these exact paths:

src/App.jsx
src/App.css
src/data/recipes.js
src/utils/planning.js
src/utils/storage.js
src/main.jsx
index.html
package.json
vite.config.js

Important: recipe cards will only appear in Browse Recipes / category filters if they are listed in src/data/recipes.js inside recipeRows.

Your current uploaded recipes.js only has AS-001 through AS-024 active. Other category images may exist in GitHub, but browsers cannot auto-read a public folder list. Add rows such as:
["SF-001", "Baked Cod"],
["MX-001", "Beef Enchilada Bake"],
["CS-001", "Chicken Casserole"],

Then make sure matching images exist:
public/images/recipes/SF-001.png
public/images/heroes/SF-001.png

This fix adds CS / Casseroles, syncs category counts, and fixes category filtering in the Rolodex and planner.
