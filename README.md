# 🎬 Vcinema

A sleek and interactive movie search platform powered by the OMDb API.

## 📽️ Overview

**Vcinema** is a movie search and tracking web app that allows users to search for films, view detailed information, rate and favorite them, and track their personal viewing stats—all in a clean, user-friendly interface. It uses the OMDb API to fetch real movie data and demonstrates strong use of component composition and state management in React.

## 🌟 Features

- 🔍 Search for movies by title (real-time results)
- 🎞️ View detailed movie info (poster, plot, actors, year, etc.)
- ⭐ Add movies to a “Watched” list with personal rating
- 📊 View stats like total number of watched movies and total time spent
- ♻️ Built with reusable and composable components
- 🧠 Uses `useEffect` cleanup and controlled component patterns

## 🧰 Tech Stack

- **React.js** – Built with Create React App (CRA)
- **OMDb API** – Movie data source
- **CSS** – Styling
- **JavaScript (ES6+)** – Logic and interactivity
- **Context API (optional enhancement)** – For scalable state if needed

## 🧪 Project Highlights

- Component composition for modular and maintainable code
- Local state management with useState and useEffect
- Smart cleanup logic in `useEffect` to handle API calls
- Responsive UI with conditional rendering and loading states
- Placeholder for GitHub repo link inside the app

## ⚙️ Getting Started

### Prerequisites

- Node.js and npm installed

### Installation

```bash
git clone https://github.com/your-username/vcinema.git
cd vcinema
npm install
```

### Running the app

- 1. npm start
- 2. This app uses Omdb API and you'll need an API key
- 3. Create a .env file and add REACT_APP_OMDB_KEY=your_api_key_here
- 4. You can get a free key from http://www.omdbapi.com/apikey.aspx
