import { useEffect, useState } from "react";

const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const KEY = "10d88e2";
const tempquery = "money heist";

function App() {
  const [movie, setMovie] = useState([]);
  const [WatchedMovie, setWatchedmovie] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [query, setQuery] = useState("");
  const [isError, setIsError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function handleSelectedId(id) {
    setSelectedId((selectedId) => id);
    console.log(selectedId);
  }

  useEffect(
    function () {
      async function getMovie() {
        try {
          setIsLoading(true);
          setIsError("");

          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&s=${tempquery}`
          );
          if (!res.ok)
            throw new Error("Something went wrong when fetching the movies");

          const data = await res.json();

          if (data.Response === "False") throw new Error("Movie not found");
          // console.log(data.Search);
          setMovie(data.Search);
          // console.log(data);
          setIsError("");
        } catch (err) {
          console.error(err.message);
          setIsError(err.message);
        } finally {
          setIsLoading(false);
          // console.log("done");
        }

        // if (query.length < 3) {
        //   setMovie([]);
        //   setIsError("");
        //   return;
        // }
      }

      getMovie();
    },
    [query]
  );

  return (
    <>
      <NavBar>
        <Search query={query} setQuery={setQuery} />
        <NumResult />
      </NavBar>
      <Main>
        <Box>
          {isLoading && <Loader />}
          {isError && <MessageError error={isError} />}
          {!isLoading && !isError && (
            <Movie movie={movie} onAddSelectedId={handleSelectedId} />
          )}
        </Box>
        <Box>
          {selectedId ? (
            <SelectedMovie selectedId={selectedId} key={selectedId} />
          ) : (
            <>
              <Statistics />
              <WatchedMovies movie={tempWatchedData} />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

function Loader() {
  return (
    <div className="api-mess">
      <h3>Loading...</h3>
    </div>
  );
}

function MessageError() {
  return (
    <div className="api-mess">
      <h3>No movie found...</h3>
    </div>
  );
}

function NavBar({ children }) {
  return (
    <nav className="nav-bar">
      <Logo />
      {children}
    </nav>
  );
}

function Logo() {
  return (
    <p className="logo">
      <span>🎦</span> Vcinema
    </p>
  );
}

function Search({ query, setQuery }) {
  return (
    <div className="inp-wrap">
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
    </div>
  );
}

function NumResult() {
  return (
    <p>
      Discovered <span className="bold">10</span> results
    </p>
  );
}

function Main({ children }) {
  return <main className="main-des container">{children}</main>;
}

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="bx-des">
      <div className="close-btn">
        <button onClick={() => setIsOpen((cur) => !cur)}>
          {isOpen ? "-" : "+"}
        </button>
      </div>

      {isOpen && children}
    </div>
  );
}

function Movie({ movie, onAddSelectedId }) {
  return (
    <ul>
      {movie?.map((movie) => (
        <MovieList
          movie={movie}
          key={movie.imdbID}
          onAddSelectedId={onAddSelectedId}
        />
      ))}
    </ul>
  );
}

function MovieList({ movie, onAddSelectedId }) {
  return (
    <li className="list-des" onClick={() => onAddSelectedId(movie.imdbID)}>
      <div className="li-img">
        <img src={movie.Poster} alt="poster" />
      </div>

      <div className="ttl-yyr">
        <p>
          <span className="bold">{movie.Title}</span>
        </p>
        <p>{movie.Year}</p>
      </div>
    </li>
  );
}

function Statistics() {
  return (
    <div className="stat">
      <h2>Movies you watched</h2>
      <div>
        <p className="stat-pa">
          <span className="emj-spc">🔢</span>0 Movies
          <span className="emj-spc">⭐</span>0.0
          <span className="emj-spc">⌛</span>0 Min
        </p>
      </div>
    </div>
  );
}

function WatchedMovies({ movie }) {
  return (
    <ul>
      {movie.map((movie) => (
        <MovieListWatched movie={movie} key={movie.imdbID} />
      ))}
    </ul>
  );
}
function MovieListWatched({ movie }) {
  return (
    <li className="list-des">
      <div className="li-img">
        <img src={movie.Poster} alt="poster" />
      </div>

      <div className="ttl-yyr">
        <p>
          <span className="bold">{movie.Title}</span>
        </p>
        <p>{movie.Year}</p>
      </div>
    </li>
  );
}

const tempId = "tt1375666";

function SelectedMovie({ selectedId }) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const {
    Title: title,
    Year: year,
    Rated: rated,
    Released: released,
    Poster: poster,
    Plot: plot,
    Runtime: runtime,
    Actors: actors,
    Director: director,
    Genre: genre,
    imdbRating,
  } = movie;

  useEffect(
    function () {
      async function selectedMovieDetails() {
        try {
          setIsLoading(true);
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`
          );
          if (!res.ok) throw new Error("Problem encountered when searching");
          const data = await res.json();
          console.log(data);
          setMovie(data);
        } catch (err) {
          console.log(err.message);
        } finally {
          console.log("done");
          setIsLoading(false);
        }
      }
      selectedMovieDetails();
    },
    [selectedId]
  );

  return isLoading ? (
    <Loader />
  ) : (
    <div className="mv-dt">
      <div className="ps-tg">
        <div className="ps-im">
          <img src={poster} alt="the graphics" />
        </div>
        <div className="title-time-wrp">
          <h2>{title}</h2>
          <p>
            <span>⏲</span> {runtime}
          </p>
          <p>
            <span>✈</span> {year}
          </p>
          <p>
            <span>🎬</span> {genre}
          </p>
        </div>
      </div>

      <div className="more-dts">
        <p>
          <em>{plot}</em>
        </p>
        <p>Staring: {actors}</p>
        <p>Directed by: {director}</p>
      </div>
    </div>
  );
}
export default App;
