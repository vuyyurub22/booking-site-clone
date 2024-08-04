import { useContext } from "react";
import { UserContext } from "../UserContext";
import { useState } from "react";
import axios from "axios";
import { Navigate, Link, useParams } from "react-router-dom";
import Places from "./Places";
import AccountNav from "./AccountNav";

export default function Account() {
  const [toHome, setToHome] = useState(null);
  const { user, isLoading, setUser } = useContext(UserContext);
  const { subpage } = useParams();
  if (isLoading) {
    return "Loading...";
  }
  if (!user && !isLoading && !toHome) {
    console.log("here");
    return <Navigate to={"/login"}></Navigate>;
  }

  async function logout() {
    console.log("here");
    await axios.post("/logout");
    setToHome("/");
    setUser(null);
  }
  if (toHome) {
    return <Navigate to={toHome} />;
  }
  return (
    <div>
      <AccountNav />
      {!subpage && (
        <div className="text-center max-w-lg mx-auto">
          Logged in as {user.name}
          <button className="primary max-w-sm mt-2" onClick={logout}>
            Log Out
          </button>
        </div>
      )}
      {subpage === "places" && <Places />}
    </div>
  );
}
