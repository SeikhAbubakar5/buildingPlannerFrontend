const Toolbar = ({ setDrawingMode, toggleAnnotations, saveDrawing, clearCanvas }) => {
    return (
        <div style={{ margin: "10px 0" }}>
            <button onClick={() => setDrawingMode("select")}>Select</button>

            <button onClick={() => setDrawingMode("rect")}>Rectangle</button>

            <button onClick={() => setDrawingMode("circle")}>Circle</button>

            <button onClick={() => setDrawingMode("line")}>Line</button>

            <button onClick={toggleAnnotations}>Toggle Annotations</button>

            <button onClick={saveDrawing}>Save</button>

            <button onClick={clearCanvas} style={{ color: "red" }}>
                Clear
            </button>
        </div>
    );
};

export default Toolbar;

