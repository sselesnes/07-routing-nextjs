//NotePreviewModal.client.tsx

"use client";

import Modal from "@/components/Modal/Modal";
import NotePreview from "@/components/NotePreview/NotePreview";

interface NotePreviewModalProps {
  id: number;
  tag?: string; // Current filter tag
  page?: number; // Current page number
}

export default function NotePreviewModal({
  id,
  tag,
  page,
}: NotePreviewModalProps) {
  const handleCloseModal = () => {
    // Close modal without changing URL
  };

  return (
    <Modal onClose={handleCloseModal}>
      <NotePreview id={id} onClose={handleCloseModal} tag={tag} page={page} />
    </Modal>
  );
}
