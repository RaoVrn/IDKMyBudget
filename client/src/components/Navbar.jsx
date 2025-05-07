import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Navbar as MTNavbar,
  Typography,
  IconButton,
  Collapse,
} from "@material-tailwind/react";

function Navbar() {
  const [openNav, setOpenNav] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const user = localStorage.getItem("user");

  useEffect(() => {
    window.addEventListener("resize", () => window.innerWidth >= 960 && setOpenNav(false));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const navList = (
    <ul className="mt-2 mb-4 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
      <Typography as="li" variant="small" color="blue-gray" className="p-1 font-normal">
        <Link to="/" className={`flex items-center ${location.pathname === "/" ? "text-primary-500" : "hover:text-primary-500"}`}>
          Home
        </Link>
      </Typography>
      {user ? (
        <>
          <Typography as="li" variant="small" color="blue-gray" className="p-1 font-normal">
            <Link to="/dashboard" className={`flex items-center ${location.pathname === "/dashboard" ? "text-primary-500" : "hover:text-primary-500"}`}>
              Dashboard
            </Link>
          </Typography>
          <Typography as="li" variant="small" color="blue-gray" className="p-1 font-normal">
            <button onClick={handleLogout} className="flex items-center text-red-500 hover:text-red-700">
              Logout
            </button>
          </Typography>
        </>
      ) : (
        <>
          <Typography as="li" variant="small" color="blue-gray" className="p-1 font-normal">
            <Link to="/login" className={`flex items-center ${location.pathname === "/login" ? "text-primary-500" : "hover:text-primary-500"}`}>
              Login
            </Link>
          </Typography>
          <Typography as="li" variant="small" color="blue-gray" className="p-1 font-normal">
            <Link to="/signup" className={`flex items-center ${location.pathname === "/signup" ? "text-primary-500" : "hover:text-primary-500"}`}>
              Sign Up
            </Link>
          </Typography>
        </>
      )}
    </ul>
  );

  return (
    <MTNavbar className="mx-auto max-w-screen-xl px-4 py-2">
      <div className="flex items-center justify-between text-blue-gray-900">
        <Typography
          as={Link}
          to="/"
          className="mr-4 cursor-pointer py-1.5 font-bold text-xl text-primary-500"
        >
          IDKMyBudget <span className="text-2xl">💰</span>
        </Typography>
        <div className="flex items-center gap-4">
          <div className="hidden lg:block">{navList}</div>
          <IconButton
            variant="text"
            className="ml-auto h-6 w-6 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
            ripple={false}
            onClick={() => setOpenNav(!openNav)}
          >
            {openNav ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                className="h-6 w-6"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </IconButton>
        </div>
      </div>
      <Collapse open={openNav}>
        {navList}
      </Collapse>
    </MTNavbar>
  );
}

export default Navbar;
