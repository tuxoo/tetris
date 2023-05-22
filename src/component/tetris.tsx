import {Box, Flex, Grid, GridItem, SimpleGrid, Text, useInterval} from "@chakra-ui/react";
import {useAppDispatch, useAppSelector} from "../hook/redux";
import Pixel from "./pixel";
import {boardActions} from "../store/slice/board";
import React, {useEffect} from "react";

interface TetrisProps {
    horizontal: number,
}

const Tetris = ({horizontal}: TetrisProps) => {

    const dispatch = useAppDispatch()
    const {grid, score} = useAppSelector(state => state.figure)

    useInterval(() => {
        dispatch(boardActions.down())
    }, 300)

    useEffect(() => {
        const handleKeyboardEvent = (e: KeyboardEvent) => {
            console.log(e.key)
            switch (e.key) {
                case "ArrowRight":
                    dispatch(boardActions.right())
                    break
                case "ArrowLeft":
                    dispatch(boardActions.left())
                    break
                case "ArrowDown":
                    dispatch(boardActions.down())
                    break
            }

        };

        document.addEventListener('keydown', handleKeyboardEvent)

        return () => {
            document.removeEventListener('keydown', handleKeyboardEvent);
        };
    })

    return (
        <Box bgGradient={'linear(to-b, orange.100, purple.300)'}>
            <Flex minHeight='100vh' width='full' align='center' justifyContent='center'>
                <Flex direction='column'>
                    <Grid
                        templateRows='repeat(12, 1fr)'
                        templateColumns='repeat(8, 1fr)'
                        gap={4}
                    >
                        <GridItem rowSpan={1} colSpan={8}>
                            <Flex
                                height='full'
                                width='full'
                                align='center'
                                justifyContent='center'
                                userSelect='none'
                                p='2'
                            >
                                <Text fontSize='2xl'>{score}</Text>
                            </Flex>
                        </GridItem>
                        <GridItem
                            rowSpan={10}
                            colSpan={1}
                            onClick={
                                () => dispatch(boardActions.left())
                            }>
                            <Flex
                                height='full'
                                width='full'
                                align='center'
                                justifyContent='center'
                                boxShadow='xl'
                                userSelect='none'
                                rounded={10}
                                p='2'
                            >
                                <Text>{'<<'}</Text>
                            </Flex>
                        </GridItem>
                        <GridItem
                            rowSpan={10}
                            colSpan={6}
                        >
                            <Flex
                                width='full'
                                bg='white'
                                p='2'
                                rounded={10}
                            >
                                <SimpleGrid columns={horizontal} onClick={() => {
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
                        </GridItem>
                        <GridItem
                            rowSpan={10}
                            colSpan={1}
                            onClick={() => dispatch(boardActions.right())}>
                            <Flex
                                height='full'
                                width='full'
                                align='center'
                                justifyContent='center'
                                p='2'
                                userSelect='none'
                                rounded={10}
                                boxShadow='xl'
                            >
                                <Text>{'>>'}</Text>
                            </Flex>
                        </GridItem>
                        <GridItem rowSpan={1} colSpan={8}>
                            <Flex
                                height='full'
                                width='full'
                                align='center'
                                justifyContent='center'
                                userSelect='none'
                                p='2'
                            >
                                <Text>_____</Text>
                            </Flex>
                        </GridItem>
                    </Grid>
                </Flex>
            </Flex>
        </Box>
    )
}

export default Tetris