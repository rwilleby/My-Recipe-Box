JPEG THUMBNAIL + HERO IMAGE CODE UPDATE — SUBFOLDER VERSION

Upload/replace:
src/App.jsx
src/App.css

Your current folder setup is supported:
public/images/thumbs/recipes/
public/images/thumbs/heroes/

Photoshop recipe-card thumbnail export:
Input:   public/images/recipes
Output:  public/images/thumbs/recipes
Type:    JPEG
Quality: 7 or 8
Resize:  900 x 600

Expected examples:
public/images/thumbs/recipes/AS-001.jpg
public/images/thumbs/recipes/QP-001.jpg
public/images/thumbs/recipes/SG-001.jpg

Photoshop hero export:
Input:   public/images/heroes
Output:  public/images/thumbs/heroes
Type:    JPEG
Quality: 7 or 8
Resize:  1600 x 900

Expected examples:
public/images/thumbs/heroes/hero-grill-wide.jpg
public/images/thumbs/heroes/hero-pasta-wide.jpg
public/images/thumbs/heroes/hero-salad-wide.jpg
public/images/thumbs/heroes/hero-brisket-wide.jpg
public/images/thumbs/heroes/hero-cake-wide.jpg
public/images/thumbs/heroes/hero-shrimp-wide.jpg

How the code works:
- Browse Recipes uses images/thumbs/recipes/CODE.jpg first.
- Homepage Rolodex uses images/thumbs/recipes/CODE.jpg first.
- Homepage hero rotation uses images/thumbs/heroes/hero-name.jpg.
- Full recipe viewer, print, and download still prefer images/recipes/CODE.png.
- Code still includes fallback for accidental filename spaces: SG-001 .jpg / SG-001 .png.
