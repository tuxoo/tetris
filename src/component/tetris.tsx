import {Box, Button, Flex, GridItem, SimpleGrid, useInterval} from "@chakra-ui/react";
import {useAppDispatch, useAppSelector} from "../hook/redux";
import Pixel from "./pixel";
import {boardActions} from "../store/slice/board";

interface TetrisProps {
    horizontal: number,
}

const Tetris = ({horizontal}: TetrisProps) => {

    const dispatch = useAppDispatch()
    const {grid} = useAppSelector(state => state.figure)

    // useInterval(() => {
    //     dispatch(figureActions.down())
    // }, 500)

    return (
        <Box bgGradient={'linear(to-b, blue.200, teal.500)'}>
            <Flex minHeight='100vh' width='full' align='center' justifyContent='center'>
                <Flex direction='column' bgColor='transparent'>
                    <Button size='md' bgColor='white' onClick={() => dispatch(boardActions.left())}>{'<<'}</Button>
                </Flex>
                <Flex direction='column' bgColor='white' boxShadow='xl' p={4} rounded={10}>
                    <SimpleGrid columns={horizontal} spacing={1} onClick={() => {
                        dispatch(boardActions.down())
                    }}>
                        {
                            grid.map((raws, iy) => raws.map((cell, ix) => (
                                    <GridItem key={`${iy}${ix}`}>
                                        <Pixel isActive={cell} key={`${iy}${ix}`}/>
                                    </GridItem>
                                ))
                            )
                        }
                    </SimpleGrid>
                </Flex>
                <Flex direction='column' bgColor='transparent'>
                    <Button size='md' bgColor='white' onClick={() => dispatch(boardActions.right())}>{'>>'}</Button>
                </Flex>
            </Flex>
        </Box>
    )
}

// Array<number>(vertical).fill(0).map((_, y) => (
//     Array<number>(horizontal).fill(0).map((_, x) => (
//         <GridItem key={`${x}${y}`}>
//             <Pixel isActive={raws.includes(x) && columns.includes(y)} key={`${x}${y}`}/>
//         </GridItem>
//     ))
// ))

export default Tetris