import { useEffect, useState } from "react";
import StarRating from "./StarRating";

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const apiKey = process.env.REACT_APP_API_KEY;

function App() {
  const [movie, setMovie] = useState([]);
  const [WatchedMovie, setWatchedmovie] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [query, setQuery] = useState("");
  const [isError, setIsError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function handleSelectedId(id) {
    setSelectedId((selectedId) => (id === selectedId ? null : id));
  }
  function handleAddWatchedMovie(newMovie) {
    setWatchedmovie((movie) => [...movie, newMovie]);
    // console.log(WatchedMovie);
  }
  function handleCloseMovie() {
    setSelectedId(null);
  }

  useEffect(
    function () {
      const controller = new AbortController();

      async function getMovie() {
        try {
          setIsLoading(true);
          setIsError("");

          const res = await fetch(
            `https://www.omdbapi.com/?apikey=${apiKey}&s=${query}`,
            { signal: controller.signal }
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
          if (err.name !== "AbortError") {
            // console.error(err.message);
            setIsError(err.message);
          }
        } finally {
          setIsLoading(false);
          // console.log("done");
        }

        if (query.length < 3) {
          setMovie([]);
          setIsError("");
          return;
        }
      }

      getMovie();
      handleCloseMovie();

      return function () {
        controller.abort();
      };
    },
    [query]
  );

  return (
    <>
      <NavBar>
        <Search query={query} setQuery={setQuery} />
        <NumResult movie={movie} />
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
            <SelectedMovie
              selectedId={selectedId}
              key={selectedId}
              onAddWatchedMovie={handleAddWatchedMovie}
              onCloseMovie={handleCloseMovie}
              WatchedMovie={WatchedMovie}
            />
          ) : (
            <>
              <Statistics movie={WatchedMovie} />
              <WatchedMovies movie={WatchedMovie} />
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

function NumResult({ movie }) {
  return (
    <p>
      Discovered <span className="bold">{movie.length}</span> results
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
        <div>
          <p className="bold">{movie.Title}</p>
        </div>

        <div>
          <p>
            {/* <span>📅</span>  */}
            {movie.Year}
          </p>
        </div>
      </div>
    </li>
  );
}

function Statistics({ movie }) {
  const avgWatchTime = average(movie.map((movie) => movie.runtime));
  const avgRating = average(movie.map((movie) => movie.imdbRating));

  // console.log(avgWatchTime);

  return (
    <div className="stat">
      <h2>Movies you watched</h2>
      <div>
        <div className="stat-pa">
          <p>
            <span className="emj-spc">🔢</span> {movie.length}Movies
          </p>
          <p>
            <span className="emj-spc">⭐</span> {avgRating.toFixed(0)}
          </p>
          <p>
            <span className="emj-spc">⌛</span> {avgWatchTime.toFixed(1)}Mins
          </p>
        </div>
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
        <img src={movie.poster} alt="poster" />
      </div>

      <div className="ttl-yyr">
        <p>
          <span className="bold">{movie.title}</span>
        </p>

        <div className="ttl-details">
          <p>
            <span>⭐</span> {movie.imdbRating}
          </p>
          <p>
            <span className="emj-spc">🌟</span> {movie.userRating}
          </p>
          <p>
            <span className="emj-spc">⌛</span> {movie.runtime}mins
          </p>
        </div>
      </div>
    </li>
  );
}

// const tempId = "tt1375666";

function SelectedMovie({
  selectedId,
  onAddWatchedMovie,
  onCloseMovie,
  WatchedMovie,
}) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState(0);

  const isListed = WatchedMovie.map((movie) => movie.imdbID).includes(
    selectedId
  );
  const alreadyUserRated = WatchedMovie?.find(
    (movie) => movie?.imdbID === selectedId
  )?.userRating;

  // console.log(isListed);
  const {
    Title: title,
    Year: year,
    Poster: poster,
    Plot: plot,
    Runtime: runtime,
    Actors: actors,
    Director: director,
    Genre: genre,
    imdbRating,
  } = movie;

  function addToWatchedList() {
    const newWatched = {
      title,
      poster,
      imdbID: selectedId,
      year,
      imdbRating: Number(imdbRating),
      userRating,
      runtime: Number(runtime.split(" ").at(0)),
    };
    onAddWatchedMovie(newWatched);
    onCloseMovie();
  }

  useEffect(function () {
    if (!title) return;

    document.title = `Movie || ${title}`;

    return function () {
      document.title = "Vcinema";
    };
  });

  useEffect(
    function () {
      async function selectedMovieDetails() {
        try {
          setIsLoading(true);
          const res = await fetch(
            `https://www.omdbapi.com/?apikey=${apiKey}&i=${selectedId}`
          );
          if (!res.ok) throw new Error("Problem encountered when searching");
          const data = await res.json();
          // console.log(data);
          setMovie(data);
        } catch (err) {
          console.log(err.message);
        } finally {
          // console.log("done");
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
      <div className="bck-btn">
        <button onClick={onCloseMovie}>&larr;</button>
      </div>
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
            <span>⭐</span>
            {imdbRating} imdb rating
          </p>
          <p>
            <span>✈</span> {year}
          </p>
          <p>
            <span>🎬</span> {genre}
          </p>
        </div>
      </div>

      <div className="star-rate">
        {isListed ? (
          <p>
            <em>You have rated it {alreadyUserRated}/10 </em>
            <span>🌟</span>
          </p>
        ) : (
          <>
            <StarRating
              maxRating={10}
              size={24}
              onSetRating={setUserRating}
              color="#FFFFC7"
            />
            {userRating > 0 && (
              <button onClick={addToWatchedList}>Add to watched</button>
            )}
          </>
        )}
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
