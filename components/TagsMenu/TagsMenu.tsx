// TagsMenu.tsx

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import css from "./TagsMenu.module.css";
import { TAGS, Tags } from "../../types/note";

export default function TagsMenu({}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState<
    "Notes" | (typeof tagsMenuList)[number]
  >("Notes");
  const pathname = usePathname();
  const tagsMenuList = ["All notes", ...TAGS] as const;

  // При зміні маршруту на Home або "/notes/filter/none" встановлюємо selectedTag у "Notes" == "All notes"
  useEffect(() => {
    if (pathname === "/" || pathname === "/notes/filter/none") {
      setSelectedTag("Notes");
    }
  }, [pathname]);

  const filterPath = (tag: (typeof tagsMenuList)[number]): Tags | "none" => {
    return tag === "All notes" ? "none" : (tag as Tags);
  };

  const handleTagClick = (tag: (typeof tagsMenuList)[number]) => {
    setSelectedTag(tag === "All notes" ? "Notes" : tag);
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
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
                className={`${css.menuLink} ${
                  (tag === "All notes" && selectedTag === "Notes") ||
                  selectedTag === tag
                    ? css.active
                    : ""
                }`}
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
