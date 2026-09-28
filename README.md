# For Miss Little 5 Feet ♡

A tiny scrapbook website — HTML, CSS, and vanilla JS only. No build tools, no npm, no backend. Works immediately on GitHub Pages.

## Files
- `index.html` — all 8 pages
- `style.css` — all styling (colors, fonts, layout)
- `script.js` — PIN code, page navigation, animations (all easy settings at the top)
- `assets/` — put your photos here

## Add your photos
Drop these files into the `assets` folder, using these exact names (or edit the `src=` in `index.html` to match your own filenames):
- `her-eyes.jpg` — the wide eyes photo on page 1
- `cat1.jpg` (entrance page) and `cat2.jpg` (page 2) — cat pictures
- `paris.jpg` — the Paris photo
- `memory1.jpg` — the photo on the "Miss Little 5 Feet" page
- `memory2.jpg` … `memory7.jpg` — the six scrapbook gallery photos
- `music.mp3` — the background song (optional, see below)

That's 11 photo spots in total.

If a file is missing, a soft placeholder appears instead of a broken image — nothing breaks.

## Change the 4-digit code
Open `script.js` and edit the very first real line:
```js
const SECRET_CODE = "1234";
```
Replace `"1234"` with any 4 digits.

## Publish with GitHub Pages
1. Create a new GitHub repository.
2. Upload `index.html`, `style.css`, `script.js`, and the `assets` folder (with your photos inside).
3. Go to the repo's **Settings → Pages**.
4. Under "Build and deployment", set the source to **Deploy from a branch**, pick the `main` branch and `/ (root)` folder, then save.
5. Wait a minute or two — GitHub will give you a live URL like `https://yourusername.github.io/repo-name/`.

## Background music
**Best way:** put your own audio file in the `assets` folder and name it exactly `music.mp3`. That's it — the ♪ button will play it (never autoplays, loops softly).
If `music.mp3` isn't there, the site tries the YouTube link set at the top of `script.js` (`YOUTUBE_VIDEO_ID`), and if that fails too it plays a soft built-in hum. Keep the file under about 20 MB (GitHub's web upload limit is 25 MB).

## Animals
The bears, teddies, foxes and bunnies are drawn in `script.js` and are tappable. Change what they say in `CRITTER_SAYS`.
