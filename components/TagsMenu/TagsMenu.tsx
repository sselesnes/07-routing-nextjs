// TagsMenu.tsx

"use client";

import React, { useState } from "react";
import Link from "next/link";
import css from "./TagsMenu.module.css";
import { Note } from "../../types/note";

type Props = {};

export default function TagsMenu({}: Props) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedTag, setSelectedTag] =
    useState<(typeof tagsMenuList)[number]>("All notes");
  const tagsMenuList = [
    "All notes",
    "Todo",
    "Work",
    "Personal",
    "Meeting",
    "Shopping",
  ] as const;

  const filterPath = (
    tag: (typeof tagsMenuList)[number],
  ): Note["tag"] | "none" => {
    return tag === "All notes" ? "none" : (tag as Note["tag"]);
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleTagClick = (tag: (typeof tagsMenuList)[number]) => {
    setSelectedTag(tag);
    setIsMenuOpen(false);
  };

  return (
    <div className={css.menuContainer}>
      <button className={css.menuButton} onClick={toggleMenu}>
        {selectedTag} ▾
      </button>
      {isMenuOpen && (
        <ul className={css.menuList}>
          {tagsMenuList.map((tag) => (
            <li key={tag} className={css.menuItem}>
              <Link
                href={`/notes/filter/${filterPath(tag)}`}
                className={css.menuLink}
                onClick={() => handleTagClick(tag)}
              >
                {tag}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
