import React from "react";

function Space({ height = "100px" }: { height?: string }) {
  return <div style={{ height }}></div>;
}

export default Space;
