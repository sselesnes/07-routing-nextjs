// app/@modal/(.)notes/[id]/NotePreview.client.tsx

"use client";

import NoteDetails from "@/app/notes/[id]/NoteDetails.client";

export default function NotePreview({ id }: { id: number }) {
  return <NoteDetails id={id} />;
}
