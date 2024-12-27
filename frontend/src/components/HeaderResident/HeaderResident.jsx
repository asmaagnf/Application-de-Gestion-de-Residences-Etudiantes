import React, { useState } from "react";
import "./HeaderResident.css";
import { BiMenuAltRight } from "react-icons/bi";
import { getMenuStyles } from "../../utils/common";
import OutsideClickHandler from "react-outside-click-handler";
import { Link, NavLink, useNavigate } from "react-router-dom";
import home from "../../assets/home.png";
import Avatar from "../Avatar";

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
        <Link to="/resident-dash">
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
            
             <NavLink to="/resident-dash/ListRooms">votre chambres</NavLink>
             <NavLink to="/resident-dash/paiement">historique paiements</NavLink>
             <NavLink to="/resident-dash/profil">votre profil</NavLink>
             <NavLink to="/resident-dash/resident">incident</NavLink>
             <button
            className="button"
            onClick={handleLogout}
          >
            Se déconnecter
          </button>
          <Avatar/>
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
