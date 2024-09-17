import React from 'react'
import { Input } from './ui/input'

interface QueryInputProps {
    query: string
    setQuery: (query: string) => void
}

function QueryInput({query, setQuery}: QueryInputProps) {
  return (
    <>
    <Input
            type="text"
            className="w-full rounded-full align-middle"
            placeholder="Summon the Wizard..."
            value={query}
            onInput={(e) => setQuery(e.currentTarget.value)}  // Update query directly
          />
    </>
  )
}

export default QueryInput