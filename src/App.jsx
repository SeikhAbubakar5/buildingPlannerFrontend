import React, { useState } from "react";
import DrawingCanvas from "./components/Canvas";
import Navbar from "./components/Navbar";
import DrawingList from "./components/DrawingList";

function App() {
  const [refresh, setRefresh] = useState(false);

  return (
    <>
      <Navbar />
      <div style={{ display: "flex", gap: "20px" }}>
        <div>
          <DrawingCanvas triggerRefresh={() => setRefresh(!refresh)} />
        </div>
        <div style={{ width: "250px" }}>
          <DrawingList loadDrawing={(d) => window.loadDrawingToCanvas(d)} refresh={refresh} />
        </div>
      </div>
    </>

  );
}

export default App;

