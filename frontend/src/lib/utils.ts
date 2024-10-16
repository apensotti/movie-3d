import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatAIResponse(content: string): string {
  // Split the content into paragraphs
  const paragraphs = content.split('\n');

  // Process each paragraph
  const formattedParagraphs = paragraphs.map((paragraph, index) => {
    // Trim whitespace
    paragraph = paragraph.trim();

    // Check for existing headers
    if (paragraph.startsWith('# ')) return paragraph;
    if (paragraph.startsWith('## ')) return paragraph;
    if (paragraph.startsWith('### ')) return paragraph;

    // Check for bullet points or numbered lists
    if (paragraph.match(/^(\d+\.|-|\*)\s/)) return paragraph;

    // Add headers to the first few paragraphs if they don't already have them
    if (index === 0 && !paragraph.startsWith('#')) return `# ${paragraph}`;
    if (index === 1 && !paragraph.startsWith('#')) return `## ${paragraph}`;

    // Return paragraph as is for other cases
    return paragraph;
  });

  // Join the formatted paragraphs with newlines
  return formattedParagraphs.join('\n\n');
}
