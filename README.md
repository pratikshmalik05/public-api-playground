# Public API Playground
live link - (https://public-api-playground-pink.vercel.app/)

A modern, responsive web application that integrates **7 public APIs** into a single, beautifully designed interface. Built with HTML, CSS, and Vanilla JavaScript.

## 🌟 Features
- **7 Unique API Integrations:** 
  1. Dog Finder
  2. Cat Finder
  3. Joke Generator
  4. Random User Profile
  5. Posts Explorer
  6. Advice Generator
  7. Activity Suggestion
- **Glassmorphism UI:** Clean, modern, responsive interface using CSS variables and dynamic animated floating background shapes.
- **Dark/Light Mode:** Automatically syncs with system preference and includes a manual toggle switch in the header. Saves preference to `localStorage`.
- **Robust Error Handling:** Pure `async/await` Fetch API calls with graceful error fallbacks, responsive loading states, and toast notifications.

## 🛠 Tech Stack
- **HTML5**
- **CSS3** (Variables, Flexbox, CSS Grid, Glassmorphism Filters, Keyframe Animations)
- **Vanilla JavaScript** (ES6+, Async/Await, Modular functions, DOM Manipulation)

## 📁 Project Structure
- `index.html`: Website structure, layout grid, and external library links (FontAwesome/Google Fonts).
- `style.css`: All application styling, responsive breakpoints, theming, and animations.
- `script.js`: Fetch logic handling API requests, toast notifications, loading states, and dark mode interactions.

---

## 🚀 How to Run Locally

You do not need a complex build pipeline to run this project!

1. **Clone or download** this project folder.
2. The simplest way to run it is to **double-click** `index.html` to open it directly in any modern web browser.
3. Alternatively, for a live development environment:
   - If using **VS Code**, install the **Live Server** extension.
   - Right-click `index.html` and select **"Open with Live Server"**.

---

## 🌐 Deployment Instructions

This app is purely static (HTML/CSS/JS) and can be easily deployed to modern CDNs.

### Deploying on Netlify (Easiest)
1. Go to [Netlify](https://www.netlify.com/) and register or log in.
2. In the Netlify dashboard, go to your **Sites** area.
3. Simply **Drag & Drop** the entire `public-api-playground` folder into the dotted deployment dropzone at the bottom.
4. Netlify will instantly process the files and provide a live production URL!

### Deploying on Vercel
1. Go to [Vercel](https://vercel.com/) and log in.
2. Push this local project folder to your preferred Git repository provider (e.g., GitHub, GitLab).
3. On Vercel, click **"Add New" -> "Project"**.
4. Import your newly created repository.
5. Vercel automatically detects standard HTML/CSS/JS frontend applications. No build commands or specific output directory configurations are needed. Keep default settings.
6. Click **Deploy**. Vercel will process it and provide a secure, live URL.

*(Note: If you don't want to use Git, you can globally install the Vercel CLI via `npm i -g vercel` and simply run the `vercel` command inside this directory to deploy from your terminal.)*
