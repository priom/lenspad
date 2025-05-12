"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search as SearchIcon, SearchX as SearchClearIcon } from "lucide-react";
import { useRef, useState } from "react";

export function Search() {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [searchValue, setSearchValue] = useState<string>("");

  const handleSearchClear = () => {
    setSearchValue("");

    if (searchInputRef.current) searchInputRef.current.focus();
  };

  return (
    <div className="relative flex items-center bg-muted text-foreground">
      <Input
        type="search"
        placeholder="Search..."
        className="w-full pl-4 pr-28 py-6 bg-muted text-foreground border-none placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
        ref={searchInputRef}
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
      />
      {searchValue && (
        <Button
          type="submit"
          className="absolute right-12 top-0 bottom-0 w-12 py-6 bg-muted text-foreground hover:bg-muted-foreground hover:text-muted animate-in slide-in-from-right duration-300"
          aria-label="Clear search"
          onClick={handleSearchClear}
          tabIndex={-1}
        >
          <SearchClearIcon className="size-5" />
        </Button>
      )}
      <Button
        type="submit"
        className="absolute right-0 top-0 bottom-0 w-12 py-6 bg-muted text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
        aria-label="Search"
      >
        <SearchIcon className="size-5" />
      </Button>
    </div>
  );
}
