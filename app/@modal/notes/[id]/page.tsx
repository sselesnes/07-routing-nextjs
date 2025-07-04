// app/@modal/notes/[id]/page.tsx
"use client";

import { usePathname, useRouter } from "next/navigation";
import Modal from "@/components/Modal/Modal";
import NotePreviewClient from "@/components/NotePreview/NotePreview.client";

export default function NoteDetailsPageModal() {
  const currentPath = usePathname();
  const router = useRouter();

  if (currentPath) {
    const segments = currentPath.split("/");
    const noteId: number = parseFloat(segments[segments.length - 1]);

    const handleCloseModal = () => {
      router.back();
    };

    return (
      <Modal onClose={handleCloseModal}>
        <NotePreviewClient id={noteId} />
      </Modal>
    );
  }
}
