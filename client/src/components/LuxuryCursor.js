import { useEffect } from "react";

const LuxuryCursor = () => {
  useEffect(() => {
    const cursor = document.createElement("div");
    cursor.className = "luxury-cursor";
    document.body.appendChild(cursor);

    document.addEventListener("mousemove", (e) => {
      cursor.style.left = e.clientX + "px";
      cursor.style.top = e.clientY + "px";
    });
  }, []);

  return null;
};

export default LuxuryCursor;