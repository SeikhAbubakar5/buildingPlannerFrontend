import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "https://buildingplanner1.onrender.com/api/drawings";

const DrawingList = ({ loadDrawing, refresh }) => {
  const [drawings, setDrawings] = useState([]);

  const fetchDrawings = async () => {
    try {
      const res = await axios.get(API_BASE);
      setDrawings(res.data);
    } catch (err) {
      console.error("Failed to load drawings");
    }
  };

  const deleteDrawing = async (id) => {
    if (!window.confirm("Are you sure to delete this drawing?")) return;
    await axios.delete(`${API_BASE}/${id}`);
    fetchDrawings();
  };

  useEffect(() => {
    fetchDrawings();
  }, [refresh]);

  return (
    <div>
      <h3>Saved Drawings</h3>
      <ul>
        {drawings.map((d) => (
          <li key={d._id}>
            <span onClick={() => loadDrawing(d)} style={{ cursor: "pointer" }}>{d.title}</span>
            <button onClick={() => deleteDrawing(d._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DrawingList;
