import React, { useEffect, useState } from "react";
import { GraphData, omdb, Messages } from "@/data/types";

// Custom hook for loading the query from localStorage
export const useLoadQueryFromLocalStorage = (setQuery: React.Dispatch<React.SetStateAction<string>>) => {
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedQuery = window.localStorage.getItem("query");
      if (savedQuery) {
        setQuery(savedQuery);
      }
    }
  }, [setQuery]);
};

// Custom hook for fetching graph data
export const useFetchGraphData = (ids: string[], MWAPI: string, setData: React.Dispatch<React.SetStateAction<GraphData>>) => {
  useEffect(() => {
    if (ids.length > 0) {
      const fetchGraphData = async () => {
        try {
          const response = await fetch(`${MWAPI}/data/generate_graph/?ids=[${ids.map((id) => `"${id}"`).join(",")}]`);
          if (!response.ok) throw new Error("Failed to fetch graph data");
          const data = await response.json();
          setData(data);
        } catch (error) {
          console.error(error);
        }
      };

      fetchGraphData();
    }
  }, [ids, MWAPI, setData]);
};

// Custom hook for fetching movie IDs based on query
export const useFetchMovieIDs = (query: string, MWAPI: string, setIds: React.Dispatch<React.SetStateAction<string[]>>) => {
  useEffect(() => {
    const fetchMovieIDs = async () => {
      try {
        const response = await fetch(`${MWAPI}/search/?query=${encodeURIComponent(query)}&k=50`);
        if (!response.ok) throw new Error("Error fetching movie IDs");
        const data = await response.json();
        setIds(data);
      } catch (error) {
        console.error("Error fetching movie IDs:", error);
      }
    };

    if (query) {
      fetchMovieIDs();
    }
  }, [query, MWAPI, setIds]);
};

// Custom hook for fetching movie details based on movie IDs
export const useFetchMovies = (ids: string[], OMBDAPI: string, OMBDKEY: string, setMovies: React.Dispatch<React.SetStateAction<omdb[]>>) => {
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const moviePromises = ids.map(async (id) => {
          const response = await fetch(`${OMBDAPI}?i=${id}&plot=full&apikey=${OMBDKEY}`);
          return response.json();
        });
        const movieData = await Promise.all(moviePromises);
        setMovies(movieData);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };

    if (ids.length > 0) {
      fetchMovies();
    }
  }, [ids, OMBDAPI, OMBDKEY, setMovies]);
};

// Custom hook for saving the query to the server with debouncing
export const useChat = (query: string, MWAPI: string, setMessages: React.Dispatch<React.SetStateAction<Messages[]>>) => {
  useEffect(() => {
    const saveQueryToServer = async () => {
      try {
        const response = await fetch(`${MWAPI}/chat/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: [{content: query}], email: "alexpensotti@gmail.com", session_id: "" }),
        });
        if (!response.ok) throw new Error("Failed to save query");
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error("Error saving query:", error);
      }
    };

    if (query) {
      const timer = setTimeout(() => saveQueryToServer(), 500); // Debouncing for 500ms
      return () => clearTimeout(timer); // Clear the timeout on cleanup
    }
  }, [query, MWAPI, setMessages]);
};
