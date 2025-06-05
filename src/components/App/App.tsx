import { useState } from "react";
import fetchMovies from "../../services/movieService";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import Loader from "../Loader/Loader";
import MovieGrid from "../MovieGrid/MovieGrid";
import MovieModal from "../MovieModal/MovieModal";
import SearchBar from "../SearchBar/SearchBar";
import css from "./App.module.css";
import type { Movie } from "../../types/movie";
import toast, { Toaster } from "react-hot-toast";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useEffect } from "react";
import ReactPaginate from "react-paginate";

export default function App() {
  const [search, setSearch] = useState<string>("");
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [page, setPage] = useState<number>(1);
  const searchMovie = (value: string): void => {
    setSearch(value);
    setPage(1);
  };
  const { data, error, isPending, isError, isSuccess } = useQuery({
    queryKey: ["movies", search, page],
    queryFn: () => fetchMovies(search, page),
    enabled: search !== "",
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (data?.results.length === 0) {
      toast.error("No movies found for your request.");
    }
  }, [data]);

  const openModal = (): void => setModalOpen(true);
  const closeModal = (): void => {
    setSelectedMovie(null);
    setModalOpen(false);
  };
  const selectMovie = (movie: Movie): void => {
    setSelectedMovie(movie);
    openModal();
  };

  return (
    <div className={css.app}>
      <Toaster position="top-center" reverseOrder={false} />
      <SearchBar onSubmit={searchMovie} />
      {isError && error instanceof Error && <ErrorMessage error={error} />}
      {search !== "" && isPending && <Loader />}
      {isSuccess && data.total_pages > 1 && (
        <ReactPaginate
          pageCount={data.total_pages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={({ selected }) => setPage(selected + 1)}
          forcePage={page - 1}
          containerClassName={css.pagination}
          activeClassName={css.active}
          nextLabel="→"
          previousLabel="←"
        />
      )}
      {isSuccess && data.results.length > 0 && (
        <MovieGrid movies={data.results as Movie[]} onSelect={selectMovie} />
      )}
      {modalOpen && <MovieModal movie={selectedMovie} onClose={closeModal} />}
    </div>
  );
}
