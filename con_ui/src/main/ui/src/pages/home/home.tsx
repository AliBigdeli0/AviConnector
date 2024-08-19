import './home.css';

//
// do not remove this
import React from 'react';
import { createRoot } from 'react-dom/client';

const Home = () => {
    return <div>home from react 111</div>;
};

const domNode = document.getElementById('root');
if (domNode !== null) {
    const root = createRoot(domNode);
    root.render(<Home />);
}
