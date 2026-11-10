import { useEffect } from "react";

// Sets the document title and meta description for a public page, and puts
// the previous values back when the page unmounts (so a page without its
// own meta never shows a stale one).
const usePageMeta = ({ title, description }) => {
  useEffect(() => {
    const previousTitle = document.title;
    if (title) document.title = title;

    let meta = document.head.querySelector('meta[name="description"]');
    const created = !meta;
    const previousDescription = meta?.getAttribute("content") ?? "";

    if (description) {
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("name", "description");
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", description);
    }

    return () => {
      document.title = previousTitle;
      if (!meta) return;
      if (created) meta.remove();
      else meta.setAttribute("content", previousDescription);
    };
  }, [title, description]);
};

export default usePageMeta;
