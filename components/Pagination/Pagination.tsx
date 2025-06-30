//Pagination.tsx

import css from "./Pagination.module.css";
import ReactPaginate from "react-paginate";

export interface PaginationProps {
  pageCount: number; // Загальна кількість сторінок
  onPageChange: (selectedItem: { selected: number }) => void; // Викликається при зміні сторінки, selectedItem - обрана сторінка
  currentPage: number; // Поточна сторінка
}

export default function Pagination({
  pageCount,
  onPageChange,
  currentPage,
}: PaginationProps) {
  if (pageCount <= 1) {
    return null;
  }

  return (
    <ReactPaginate
      pageCount={pageCount}
      onPageChange={onPageChange}
      forcePage={currentPage}
      containerClassName={css.pagination}
      activeClassName={css.active}
      previousLabel="←"
      nextLabel="→"
      disableInitialCallback={true}
    />
  );
}
