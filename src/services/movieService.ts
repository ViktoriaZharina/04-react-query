import axios from "axios";
import { type Movie } from "../types/movie";

const BASE_URL = "https://api.themoviedb.org/3/search/movie";
const TOKEN = import.meta.env.VITE_TMDB_TOKEN;

interface FetchMoviesParams {
  query: string;
}

export default async function fetchMovies({
  query,
}: FetchMoviesParams): Promise<Movie[]> {
  const response = await axios.get<{ results: Movie[] }>(BASE_URL, {
    params: {
      query,
    },
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  });

  return response.data.results;
}
