import { Search, X } from "lucide-react";
import { Field } from "./ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group";
import { Button } from "./ui/button";
import { normalize } from "@/lib/utils";

export default function SearchBar({ query, onSearch, onClear }: {
  query: string;
  onSearch: (q: string) => void;
  onClear: () => void;
}) {
  const hasQuery = normalize(query).length > 0;

  return (
    <Field className="mb-12 max-w-lg relative">
      <InputGroup>
        <InputGroupAddon>
          <Search />
        </InputGroupAddon>
        <InputGroupInput
          value={query}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search by title, author, or topic..."
          aria-label="Search posts"
        />
        {hasQuery && (
          <InputGroupAddon align="inline-end">
            <Button variant="ghost" size="icon-sm" onClick={onClear} aria-label="Clear search">
              <X />
            </Button>
          </InputGroupAddon>
        )}
      </InputGroup>
    </Field>
  )
}