import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // A hash (e.g. "/#services" from the footer's Services link) means the
    // browser should land on that section, not the top of the page --
    // forcing scrollTo(0,0) here would win the race against the anchor
    // scroll and always dump the visitor back at the top.
    if (hash) return;

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth", // Change to "auto" if you don't want smooth scrolling
    });
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;