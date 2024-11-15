import { omdb } from "../../../../data/types";
import MovieVideos, { MovieVideosProps } from "../../../../components/movie/MovieVideos";
import PageNav from "../../../../components/movie/PageNav";
import { Video } from "../../../../components/movie/MovieVideos";
import { auth } from "@/lib/auth/authConfig";

const OMBDAPI = process.env.NEXT_PUBLIC_OMDBAPI_URL;
const MWAPI = process.env.NEXT_PUBLIC_MWAPI!;

export default async function Page({ params }: { params: { id: string } }) {
  const session = await auth()
  const userEmail = session?.user?.email;

  const response1 = await fetch(`${OMBDAPI}?i=${params.id}&plot=full&apikey=${process.env.NEXT_PUBLIC_OMDBAPI_KEY}`);
  const ombd_data: omdb = await response1.json();

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization:
        'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmMWE3NGI0MzVmZTA1NmM5N2YzNmI0YjMwYzBiZTE2ZSIsIm5iZiI6MTcyNTk0MTE2Ny4wMDI1MDQsInN1YiI6IjY2ZGZjMjExMDAwMDAwMDAwMGE0Njc4YiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.X2vbZBvx_zpU1edEZv8La2ky2vhgPU2mfzsjnqlZLIk',
    },
  };

  const response2 = await fetch(
    `https://api.themoviedb.org/3/find/${params.id}?external_source=imdb_id`,
    options
  );  
  let data = await response2.json();
  data = data.movie_results[0];
  const id = data.id;
  
  const video_response = await fetch(
    `https://api.themoviedb.org/3/movie/${id}/videos`,
    options
  );

  const video_data: MovieVideosProps = await video_response.json();
  const poster = 'https://image.tmdb.org/t/p/w500' + data.poster_path;

  // Pass data to the client-side component
  return (
    <PageNav 
      ombd_data={ombd_data} 
      poster={poster} 
      video_data={video_data} 
      userEmail={userEmail}
      imdbID={params.id}
      mwapiUrl={MWAPI}
    />    
  );
}
