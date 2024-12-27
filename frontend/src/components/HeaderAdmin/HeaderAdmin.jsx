import React, { useState } from "react";
import "./HeaderAdmin.css";
import { BiMenuAltRight } from "react-icons/bi";
import { getMenuStyles } from "../../utils/common";
import OutsideClickHandler from "react-outside-click-handler";
import { Link, NavLink, useNavigate } from "react-router-dom";
import home from "../../assets/home.png";

const HeaderAdmin = ({ showServiceOption }) => {
  const navigate = useNavigate();
  const [menuOpened, setMenuOpened] = useState(false);
    const handleLogout = () => {
    localStorage.clear();
    navigate("/", { replace: true });
  };
   

  return (
    <section className="h-wrap"  >
      <div className="flexCenter innerWidth paddings h-container">
        {/* logo */}
        <Link to="/admin-dash">
        <img src={home} alt="logo" width={60} />
        </Link>
        {/* menu */}
        <OutsideClickHandler
          onOutsideClick={() => {
            setMenuOpened(false);
          }}
        >
          <div
            className="flexCenter h-menu"
            style={getMenuStyles(menuOpened)}
          >
            
             <NavLink to="/admin-dash/ListRooms">les chambres</NavLink>
             <NavLink to="/admin-dash/paiement">les paiements</NavLink>
             <NavLink to="/admin-dash/incidents">les incidents</NavLink>
             <NavLink to="/admin-dash/resident">les résidents</NavLink>
             <button
            className="button"
            onClick={handleLogout}
          >
            Se déconnecter
          </button>

          </div>
        </OutsideClickHandler>

        {/* for medium and small screens */}
        <div
          className="menu-icon"
          onClick={() => setMenuOpened((prev) => !prev)}
        >
          <BiMenuAltRight size={30} />
        </div>
      </div>
    </section>
  );
};

export default HeaderAdmin;
