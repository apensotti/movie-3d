'use client';

import { StreamableValue, useStreamableValue } from 'ai/rsc';

export function MessageTest({ textStream }: { textStream: StreamableValue }) {
  const [text] = useStreamableValue(textStream);

  return <div>{text}</div>;
}