import React from 'react';
import Tetris from "./component/tetris";
import {Slide, ToastContainer} from "react-toastify";
import {WEIGHT} from "./store/slice/board";
import {injectStyle} from "react-toastify/dist/inject-style";

function App() {
    injectStyle()

    return (
        <>
            <ToastContainer
                draggable={false}
                transition={Slide}
                autoClose={1000}
            />
            <Tetris horizontal={WEIGHT}/>
        </>
    );
}

export default App;
