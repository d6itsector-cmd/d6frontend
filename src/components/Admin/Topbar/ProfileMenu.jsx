import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
FaUserCircle,
FaChevronDown,
FaCog,
FaSignOutAlt,
FaUser
} from "react-icons/fa";

import "./ProfileMenu.css";
import { useAuth } from "../../../context/AuthContext";

const ProfileMenu=()=>{

const [open,setOpen]=useState(false);
const { currentUser, logout } = useAuth();
const navigate = useNavigate();

const displayName =
  currentUser?.displayName ||
  currentUser?.email?.split("@")[0] ||
  "User";

const handleLogout = async () => {
  try {
    await logout();
  } finally {
    navigate("/");
  }
};

return(

<div className="profile">

<div
className="profile-box"
onClick={()=>setOpen(!open)}
role="button"
tabIndex={0}
aria-haspopup="true"
aria-expanded={open}
aria-label="Account menu"
onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setOpen(!open); }}
>

<FaUserCircle className="profile-avatar"/>

<div>

<h3>{displayName}</h3>

<p>Administrator</p>

</div>

<FaChevronDown/>

</div>

{open &&(

<div className="profile-dropdown">

<div
  className="profile-item"
  role="button"
  tabIndex={0}
  onClick={() => { setOpen(false); navigate("/admin/settings"); }}
  onKeyDown={(e) => { if (e.key === "Enter") { setOpen(false); navigate("/admin/settings"); } }}
>

<FaUser/>

<span>My Profile</span>

</div>

<div
  className="profile-item"
  role="button"
  tabIndex={0}
  onClick={() => { setOpen(false); navigate("/admin/settings"); }}
  onKeyDown={(e) => { if (e.key === "Enter") { setOpen(false); navigate("/admin/settings"); } }}
>

<FaCog/>

<span>Settings</span>

</div>

<div
  className="profile-item logout"
  role="button"
  tabIndex={0}
  onClick={handleLogout}
  onKeyDown={(e) => { if (e.key === "Enter") handleLogout(); }}
>

<FaSignOutAlt/>

<span>Logout</span>

</div>

</div>

)}

</div>

);

};

export default ProfileMenu;