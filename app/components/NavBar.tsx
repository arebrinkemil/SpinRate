import { Form, Link } from "@remix-run/react";
import { GrLogin, GrLogout } from "react-icons/gr";
import { RiUser3Fill } from "react-icons/ri";
import { useEffect, useState } from "react";
import { MdOutlineHighlight, MdHighlight } from "react-icons/md";

interface NavBarProps {
  userId: string | null;
}

export const NavBar: React.FC<NavBarProps> = ({ userId }) => {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      return (
        localStorage.theme === "dark" ||
        (!localStorage.theme &&
          window.matchMedia("(prefers-color-scheme: dark)").matches)
      );
    }
    return false;
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.theme = isDark ? "dark" : "light";
  }, [isDark]);

  return (
    <div className="fixed top-0 z-20 flex w-screen items-center justify-between bg-black px-4 lg:px-8 py-4 max-h-16">
      <Link to="/" className="block w-1/3 leading-3">
        <div className="text-white text-xl lg:text-4xl font-black">
          SpinRate
        </div>
        <div className="text-silver">Rate music</div>
      </Link>
      <div className="flex w-1/3 justify-center">
        <Link to="/search" className="block text-center">
          <div className="text-silver hover:text-white">SEARCH</div>
        </Link>
      </div>
      <div className="flex w-1/3 justify-end md:gap-4">
        <button
          onClick={() => setIsDark((prev) => !prev)}
          className=""
          aria-label="Toggle Dark Mode"
        >
          {isDark ? (
            <MdOutlineHighlight color="white" size={40} className="rotate-90" />
          ) : (
            <MdHighlight color="white" size={40} className="rotate-90" />
          )}
        </button>
        {userId ? (
          <Link to={`/profile/${userId}`} className="block text-center">
            <RiUser3Fill color="white" size={40} />
          </Link>
        ) : null}
        {userId ? (
          <form method="post" action="/logout">
            <button className="flex flex-col items-center">
              <GrLogout color="white" size={40} />
            </button>
          </form>
        ) : (
          <Link to="/login" className="block text-center">
            <button className="flex flex-col items-center">
              <GrLogin color="white" size={40} />
            </button>
          </Link>
        )}
      </div>
    </div>
  );
};
