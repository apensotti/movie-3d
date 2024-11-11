import { useCallback, useEffect } from "react";
import { resourceLimits } from "worker_threads";

const MWAPI = process.env.NEXT_PUBLIC_MWAPI!;
const OMBDAPI = process.env.NEXT_PUBLIC_OMDBAPI_URL!;
const OMDB_API_KEY = process.env.NEXT_PUBLIC_OMDBAPI_KEY!;

export const getRecommendations = async (setRecommendations:React.Dispatch<React.SetStateAction<string[]>>, email?:string | null | undefined, library_bool?:boolean, exclusive?:boolean, ) => {
    useEffect(() => {
        const get = async () => {
            const recs = await fetch(`${MWAPI}/search/recommendations/?email=${email}&library_bool=${library_bool}&exclusive=${exclusive}`) 
            const res = await recs.json();
            const movies = res.map(async (id:string) => {
                const response = await fetch(`${OMBDAPI}?=${id}&plot=full&apikey=${OMDB_API_KEY}`)
            })
            setRecommendations(movies)
        };

        if (email) {
            get()
        }        
        else {
            console.error("No Email")
        }
    }, [email, library_bool, exclusive])

}