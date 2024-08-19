import './about.css';

//
// do not remove this
import React from 'react';
import { createRoot } from 'react-dom/client';

const About = () => {
    return <div>about from react</div>;
};

const domNode = document.getElementById('root');
if (domNode !== null) {
    const root = createRoot(domNode);
    root.render(<About />);
}
