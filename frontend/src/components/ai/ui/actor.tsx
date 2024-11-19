import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import MovieCardSm from '@/components/component/MovieCardSm';
import { calculateAge, convertMetersToFeetAndInches, formatCurrency } from "@/lib/utils";

interface ActorInfoProps {
  actor: {
    name: string;
    profile_path: string | null;
    known_for_department: string;
    popularity: number;
    known_for: Array<{ title?: string; name?: string }>;
  };
  imageUrl: string | null;
  movies: any[];
  data: {
    birthday?: string;
    height?: number;
    net_worth?: number;
    nationality?: string;
  }[];
}

export const ActorInfo: React.FC<ActorInfoProps> = ({ actor, imageUrl, movies, data }) => {
  return (
    <div className="flex flex-col gap-6 p-4 bg-neutral-850 rounded-lg shadow-lg">
      <div className="flex items-start gap-8">
        {imageUrl && <img src={imageUrl} width={200} alt={actor.name} className="h-auto rounded-lg shadow-lg" />}
        <div className="flex flex-col gap-6">
          <h1 className="text-3xl font-bold mt-4">{actor.name}</h1>
          <ul className="space-y-2">
            {data[0].birthday && <li><span className="font-semibold">Age:</span> {calculateAge(new Date(data[0].birthday))}</li>}
            {data[0].height && <li><span className="font-semibold">Height:</span> {convertMetersToFeetAndInches(data[0].height)}</li>}
            {data[0].net_worth && <li><span className="font-semibold">Net Worth:</span> {formatCurrency(data[0].net_worth)}</li>}
            <li><span className="font-semibold">Popularity:</span> {actor.popularity}</li>
            <li><span className="font-semibold">Notable works:</span> {actor.known_for.map((work) => work.title || work.name).join(', ')}</li>
          </ul>
        </div>
      </div>
      <Accordion type="single" collapsible className="w-full mt-6 ">
        <AccordionItem value="item-1" className="border-none ">
          <AccordionTrigger className="text-lg font-bold bg-neutral-800 rounded-lg px-4 mb-4 shadow-lg">Movies</AccordionTrigger>
          <AccordionContent className="">
            <MovieCardSm movies={movies} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
