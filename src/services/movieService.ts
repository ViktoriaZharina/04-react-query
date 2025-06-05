import axios from "axios";
import { type Movie } from "../types/movie";

interface TMDBHTTPResponse {
  results: Movie[];
  total_pages: number;
}

interface TMDBSearchParams {
  params: {
    query: string;
    page: number;
  };
  headers: {
    Authorization: string;
  };
}

export default async function fetchMovies(
  movieName: string,
  page: number
): Promise<TMDBHTTPResponse> {
  const myToken = import.meta.env.VITE_TMDB_TOKEN;
  const TMDBSearchParams: TMDBSearchParams = {
    params: {
      query: movieName,
      page: page,
    },
    headers: {
      Authorization: `Bearer ${myToken}`,
    },
  };
  const response = await axios.get<TMDBHTTPResponse>(
    `https://api.themoviedb.org/3/search/movie`,
    TMDBSearchParams
  );
  console.log(response.data);

  return response.data;
}
