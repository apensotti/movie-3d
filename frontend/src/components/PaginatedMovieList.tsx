'use client';

import React, { useState } from 'react';
import MovieCardMd from '@/components/component/MovieCardMd';
import { omdb, MovieDatabase } from '@/data/types';

interface PaginatedMovieListProps {
  movies: omdb[];
  itemsPerPage: number;
}

const PaginatedMovieList: React.FC<PaginatedMovieListProps> = ({ movies, itemsPerPage }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const indexOfLastMovie = currentPage * itemsPerPage;
  const indexOfFirstMovie = indexOfLastMovie - itemsPerPage;
  const currentMovies = movies.slice(indexOfFirstMovie, indexOfLastMovie);

  const totalPages = Math.ceil(movies.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {currentMovies.map((movie) => (
          <MovieCardMd key={movie.imdbID} movie={movie} />
        ))}
      </div>
      <div className="mt-4 flex justify-center">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
          <button
            key={pageNumber}
            onClick={() => handlePageChange(pageNumber)}
            className={`mx-1 px-3 py-1 rounded ${
              currentPage === pageNumber ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            {pageNumber}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PaginatedMovieList;
