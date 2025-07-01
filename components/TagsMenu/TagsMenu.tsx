// TagsMenu.tsx

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import css from "./TagsMenu.module.css";
import { TAGS, Tags } from "../../types/note";

const ALL_NOTES = "All Notes" as const;
const tagsMenuList = [ALL_NOTES, ...TAGS] as const;
type TagsMenuOption = (typeof tagsMenuList)[number];

export default function TagsMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState<TagsMenuOption>(ALL_NOTES);
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/" || pathname === "/notes/filter/none") {
      setSelectedTag(ALL_NOTES);
    } else {
      const match = pathname.match(/^\/notes\/filter\/(.+)$/);
      const tag = match?.[1] as Tags | undefined;
      if (tag && TAGS.includes(tag)) {
        setSelectedTag(tag as TagsMenuOption);
      }
    }
  }, [pathname]);

  const getFilterPath = (tag: TagsMenuOption): Tags | "none" => {
    return tag === ALL_NOTES ? "none" : tag;
  };

  const handleTagClick = (tag: TagsMenuOption) => {
    setSelectedTag(tag);
    setIsMenuOpen(false);
  };

  const getMenuButtonLabel = (tag: TagsMenuOption) => {
    return tag === ALL_NOTES ? "Notes" : tag;
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <div className={css.menuContainer}>
      <button className={css.menuButton} onClick={toggleMenu}>
        {getMenuButtonLabel(selectedTag)} ▾
      </button>
      {isMenuOpen && (
        <ul className={css.menuList}>
          {tagsMenuList.map((tag) => (
            <li key={tag} className={css.menuItem}>
              <Link
                href={`/notes/filter/${getFilterPath(tag)}`}
                className={`${css.menuLink} ${
                  selectedTag === tag ? css.active : ""
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
