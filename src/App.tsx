import React from 'react';
import Tetris from "./component/tetris";
import {WEIGHT} from "./store/slice/board";

function App() {
    return (
        <>
            <Tetris horizontal={WEIGHT}/>
        </>
    );
}

export default App;
