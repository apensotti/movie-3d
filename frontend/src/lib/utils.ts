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

export function calculateAge(birthday: Date): number {
  const today = new Date();
  let age = today.getFullYear() - birthday.getFullYear();
  const monthDiff = today.getMonth() - birthday.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthday.getDate())) {
    age--;
  }
  
  return age;
}

export function convertMetersToFeetAndInches(heightInMeters: number): string {
  const totalInches = heightInMeters * 39.3701;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);

  return `${feet}' ${inches}"`;
}

export function formatCurrency(amount: number): string {
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(0)}M`;
  } else if (amount >= 1000) {
    return `$${amount.toLocaleString()}`;
  } else {
    return `$${amount}`;
  }
}
