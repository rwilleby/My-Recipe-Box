ROBERT'S RECIPE BOX — STANDALONE MEAL PLANNER TEST

This package is intentionally isolated from the main website.
It does not need a database, login system, build process, or changes to existing site files.

SAFE TESTING OPTIONS

OPTION 1 — TEST LOCALLY
1. Unzip the package.
2. Open index.html in Safari, Chrome, or Firefox.
3. Drag recipe cards into the weekly planner.

OPTION 2 — UPLOAD TO A SEPARATE TEST FOLDER
1. Create a new folder on the web server, such as:
   /meal-planner-test/
2. Upload only these files into that folder:
   index.html
   styles.css
   app.js
3. Visit:
   https://your-domain.com/meal-planner-test/

OPTION 3 — GITHUB PAGES / TEST BRANCH
Upload the folder to a separate branch or test repository and enable GitHub Pages for that location.

IMPORTANT
- Do not overwrite the site's existing index.html.
- Do not place these files in the live site's root directory unless they stay inside their own folder.
- The planner saves test selections only in the visitor's browser using localStorage.
- The sample food images are placeholders. Replace the image URLs in app.js with the website's real thumbnail hero paths when ready.

REPLACING SAMPLE RECIPES
Open app.js and edit the RECIPES array near the top of the file.
Each recipe uses this structure:

{ id: 'AM-001', name: 'Salisbury Steak', type: 'main', balance: 7, image: 'images/AM-001.webp' }

Valid type values:
main
side

This is a prototype and does not modify the main recipe database or live navigation.
