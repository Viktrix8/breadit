"use client";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Subreddit } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { usePathname, useRouter } from "next/navigation";
import debounce from "lodash.debounce";
import { useCallback, useEffect, useRef, useState } from "react";
import { useOnClickOutside } from "@/hooks/useOnClickOutside";

type Props = {};

export default function SearchBar({}: Props) {
  const [search, setSearch] = useState<string>("");
  const router = useRouter();
  const pathname = usePathname();
  const ref = useRef(null);

  const request = debounce(async () => {
    refetch();
  }, 300);

  const debounceRequest = useCallback(() => {
    request();
  }, []);

  const {
    data: queryResult,
    isLoading,
    refetch,
    isFetched,
  } = useQuery({
    queryKey: ["search"],
    queryFn: async () => {
      if (search) {
        const { data } = await axios.get(`/api/subreddit/search?q=${search}`);
        return data as Subreddit[] | [];
      }
      return [];
    },
    enabled: false,
  });

  useEffect(() => {
    setSearch("");
  }, [pathname]);

  const handleClickOutside = () => {
    setSearch("");
  };

  useOnClickOutside(ref, handleClickOutside);

  return (
    <Command ref={ref} className="w-1/2 shadow-lg relative overflow-visible">
      <CommandInput
        placeholder="Search communities..."
        value={search}
        onValueChange={(value) => {
          setSearch(value);
          debounceRequest();
        }}
      />
      {search.length > 0 && (
        <CommandList className="absolute bg-white top-full inset-x-0 shadow rounded-b-md">
          {isFetched && <CommandEmpty>No results found.</CommandEmpty>}
          {(queryResult?.length ?? 0) > 0 ? (
            <CommandGroup heading="Communities">
              {queryResult?.map((subreddit) => (
                <CommandItem
                  onSelect={(e) => {
                    router.push(`/r/${e}`);
                    router.refresh();
                  }}
                  key={subreddit.id}
                  value={subreddit.title}
                >
                  <a href={`/r/${subreddit.title}`}>r/{subreddit.title}</a>
                </CommandItem>
              ))}
            </CommandGroup>
          ) : null}
        </CommandList>
      )}
    </Command>
  );
}
