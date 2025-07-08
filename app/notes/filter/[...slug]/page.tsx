// app/notes/filter/[...slug]/page.tsx

import NotesClient from "./Notes.client";
import { fetchNotes } from "@/lib/api";
import type { FetchNotesResponse } from "@/lib/api";
import { Tags } from "@/types/note";

interface NotesPageProps {
  params: Promise<{ slug: string[] }>;
}

export default async function NotesPage({ params }: NotesPageProps) {
  const { slug } = await params;
  const currentSlug = slug || [];
  let tag: Tags | undefined =
    currentSlug[0] === "All" ? undefined : (currentSlug[0] as Tags | undefined);
  const pageNumber = 1;
  const searchQuery = currentSlug[1] || "";

  if (searchQuery) {
    tag = "none" as Tags | undefined;
  }

  const initialData: FetchNotesResponse = await fetchNotes({
    page: pageNumber,
    query: searchQuery,
    perPage: 12,
    tag,
  });

  return <NotesClient initialData={initialData} tag={tag} />;
}
