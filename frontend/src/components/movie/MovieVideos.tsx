import React from 'react';

export interface Video {
  iso_639_1: string;
  iso_3166_1: string;
  name: string;
  key: string;
  site: string;
  size: number;
  type: string;
  official: boolean;
  published_at: string;
  id: string;
}

export interface MovieVideosProps {
  results: Video[]; // Expecting an array of Video objects
}

const MovieVideos = ({ results }: MovieVideosProps) => {
  return (
    <div className="ml-80 mr-80">
      <h1 className="text-white text-4xl pb-6">Videos</h1>
      <div className="flex flex-wrap gap-4">
        {results.map((video) => (
          <div key={video.id} className="w-96 flex">
            <iframe
              width="450"
              height="315"
              src={`https://www.youtube.com/embed/${video.key}`}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="rounded-lg"
            ></iframe>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MovieVideos;
