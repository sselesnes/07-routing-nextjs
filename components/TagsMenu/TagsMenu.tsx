// TagsMenu

"use client";

import React, { useState } from "react";
import css from "./TagsMenu.module.css";
import { Note } from "../../types/note";

type Props = {};

export default function TagsMenu({}: Props) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const tags = [
    "All notes",
    "Todo",
    "Work",
    "Personal",
    "Meeting",
    "Shopping",
  ] as const;

  const filterPath = (tag: (typeof tags)[number]): Note["tag"] | "All" => {
    return tag === "All notes" ? "All" : (tag as Note["tag"]);
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <div className={css.menuContainer}>
      <button className={css.menuButton} onClick={toggleMenu}>
        Notes ▾
      </button>
      {isMenuOpen && (
        <ul className={css.menuList}>
          {tags.map((tag) => (
            <li key={tag} className={css.menuItem}>
              <a
                href={`/notes/filter/${filterPath(tag)}`}
                className={css.menuLink}
                onClick={() => setIsMenuOpen(false)} // Закривати меню після кліку на тег
              >
                {tag}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
