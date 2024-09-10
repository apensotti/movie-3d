import { omdb } from "../../../data/types";
import ReactPlayer from 'react-player'

const OMBDAPI = process.env.NEXT_PUBLIC_OMBDAPI;

export default async function Page({ params }: { params: { id: string } }) {
    const response1 = await fetch(`${OMBDAPI}&i=${params.id}`);
    const ombd_data: omdb = await response1.json();
  
    // Define the type for production companies
    interface ProductionCompany {
      id: number;
      name: string;
    }

    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmMWE3NGI0MzVmZTA1NmM5N2YzNmI0YjMwYzBiZTE2ZSIsIm5iZiI6MTcyNTk0MTE2Ny4wMDI1MDQsInN1YiI6IjY2ZGZjMjExMDAwMDAwMDAwMGE0Njc4YiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.X2vbZBvx_zpU1edEZv8La2ky2vhgPU2mfzsjnqlZLIk'
      }
    };
    
    const response2 = await fetch(`https://api.themoviedb.org/3/find/${params.id}?external_source=imdb_id`, options)
    let data = await response2.json();
    data = data.movie_results[0];
    const id = data.id;
    console.log(data)

    const video_response = await fetch(`https://api.themoviedb.org/3/movie/${id}/videos`, options)
    const video_data = await video_response.json();
    console.log(video_data.results)

    const poster = "https://image.tmdb.org/t/p/w500" + data.poster_path;
    console.log(poster)
    

    return (
        <div className="bg-gradient-to-tr from-neutral-950 to-neutral-800 min-h-screen h-full flex items-center justify-between gap-10">
            <div className="ml-80 mr-80 flex justify-between gap-10">
                <img src={poster} alt={data.Title} width={275} height={275} className='rounded-lg'/>
                <div className="flex-col">
                    <h1 className="text-white pt-5 text-5xl">{data.title}</h1>        
                    <div className="flex space-x-2 items-center text-white pt-2 pl-2">
                        <span>{new Date(data.release_date).getFullYear()}</span>
                        <span>&bull;</span>
                        <span>{ombd_data.Rated}</span>
                        <span>&bull;</span>
                        
                        {/* Converting Runtime from string to integer */}
                        <span>
                          {(() => {
                            // Extract the numeric part from the string (e.g., "120 min")
                            const runtimeInMinutes = parseInt(ombd_data.Runtime); // Assuming Runtime is in the format "120 min"
                            
                            // Convert runtime to hours and minutes
                            const hours = Math.floor(runtimeInMinutes / 60);
                            const minutes = runtimeInMinutes % 60;
    
                            return `${hours}h ${minutes}m`; // Return formatted time
                          })()}
                        </span>
                    </div>
                </div>
            </div>
            <div className=" ml-80 mr-80">
              <iframe
                  width="550" // Make the video responsive
                  height="300"
                  src="https://imdb-video.media-imdb.com/vi518890521/1434659607842-pgv4ql-1616202839638.mp4?Expires=1726023705&Signature=M8hHzURyOvY95QWhzAOKOcmTLWNaxzxk65PhGmA9YeOFZhvmuIkY7-sxugmj4F0E3mqXYCAol7We9zYvcvV3yXX19bnq1VUsMyyqLmOhMBt-JMYN4OUfZZn1qS93ZRbj~kBt5L9n0pwkPbboLwSEZ1IyCo7mwtpZWhPZP~TpqUG~yOL4eud4xuhuyTm52WGYrVWsyopX4SLbvheH6uPpZQ4cK-w6Del3hC8NLe~zGEKMEtXlzNP5~QOfvUyGr2Q9pZjBNzEh38~3Cv8O-xJCiUqaHLXCTPV~mbKDSuja7~T54BtnlPwvO0qaDks1giz7-fh5AzsFY7cvSPkyUe72fA__&Key-Pair-Id=APKAIFLZBVQZ24NQH3KA"
                  title="YouTube video player"
                  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="flex justify-end"
               ></iframe>
             </div>
          </div>
    );
    }
  
  