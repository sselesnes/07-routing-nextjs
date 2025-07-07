// app/@modal/(.)notes/[id]/NotePreview.client.tsx

"use client";

import { usePathname, useRouter } from "next/navigation";
import Modal from "@/components/Modal/Modal";
import NoteDetailsClient from "@/app/notes/[id]/NoteDetails.client";

export default function NoteDetailsPageModal() {
  const currentPath = usePathname();
  const router = useRouter();

  const handleCloseModal = () => {
    router.back();
  };

  const segments = currentPath.split("/");
  const lastSegment = segments[segments.length - 1];
  const penultSegment = segments[segments.length - 2];

  const isNoteDetailsPath =
    !isNaN(parseFloat(lastSegment)) && penultSegment === "notes";

  if (!isNoteDetailsPath) {
    console.log("Path does not match /notes/[id], current path:", currentPath);
    return null;
  }

  const noteId: number = parseFloat(lastSegment);

  return (
    <Modal onClose={handleCloseModal}>
      <NoteDetailsClient id={noteId} />
    </Modal>
  );
}
