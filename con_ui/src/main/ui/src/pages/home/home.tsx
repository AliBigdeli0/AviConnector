import "./home.css";

//
import { createRoot } from "react-dom/client";

const Home = () => {
  return <div>home from react</div>;
};

const domNode = document.getElementById("root");
if (domNode !== null) {
  const root = createRoot(domNode);
  root.render(<Home />);
}
