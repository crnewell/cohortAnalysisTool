import React, { useState } from "react";
import axios from "axios";
import { getLoggedInUser, logoutUser } from "../utils/auth";
import { useNavigate } from "react-router-dom";

export default function CohortPage() {
  const user = getLoggedInUser();
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  if (!user) {
    navigate("/");
    return null;
  }

  const handleFetch = async () => {
    const res = await axios.get("/api/cohort/compare", {
      params: { diseaseConceptId: 201826, measurementConceptId: 3004501 },
    });
    setData(res.data);
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>Welcome, {user}</h2>
      <button onClick={() => { logoutUser(); navigate("/"); }}>
        Logout
      </button>
      <button onClick={handleFetch} style={{ marginLeft: 10 }}>
        Fetch Cohort Data
      </button>
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
}
