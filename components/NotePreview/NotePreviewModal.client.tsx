// components/NotePreviewModal/NotePreviewModal.client.tsx

"use client";

import Modal from "@/components/Modal/Modal";
import NotePreview from "@/components/NotePreview/NotePreview";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

interface NotePreviewModalProps {
  id: number;
  // onClose більше не передається як пропс з Server Components
  // Логіка закриття інкапсульована тут
}

export default function NotePreviewModal({ id }: NotePreviewModalProps) {
  const router = useRouter();

  const handleClose = useCallback(() => {
    // При закритті модалки завжди перенаправляємо на головний список.
    // Це забезпечує послідовну поведінку як при перехоплених маршрутах, так і при прямому доступі.
    router.push("/notes/filter/All");
  }, [router]);

  return (
    <Modal onClose={handleClose}>
      <NotePreview id={id} onClose={handleClose} />
    </Modal>
  );
}
