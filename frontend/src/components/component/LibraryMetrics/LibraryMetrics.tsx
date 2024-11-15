import { omdb } from '@/data/types'
import React from 'react'
import GenresChart from './Charts/GenresChart';
import { TotalMovies } from './Charts/TotalMovies';
import { AverageRating } from './Charts/AverageRating';
import BoxOffice from './Charts/BoxOffice';
import TopActors from './Charts/TopActors';
import TopDirectors from './Charts/TopDirectors';

const LibraryMetrics = ({library, watchlist}:{library?:omdb[], watchlist?:omdb[]}) => {
  return (
    <div className="flex flex-col gap-6 w-full pr-8">
      <div className="grid grid-cols-3 gap-3 h-[300px] w-full">
        <TotalMovies library={library} watchlist={watchlist} />
        <AverageRating library={library} />
        <BoxOffice library={library} />
      </div>
      <div className="grid grid-cols-3 gap-3 h-full w-full">
        <div className="h-full">
          <GenresChart movies={library} />
        </div>
        <div className="col-span-2 h-full flex flex-col gap-3">
          <TopActors library={library} />
          <TopDirectors library={library} />
        </div>
      </div>
    </div>
  )
}

export default LibraryMetrics