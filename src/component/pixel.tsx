import {Box} from "@chakra-ui/react";

interface PixelProps {
    isActive: boolean
}

const Pixel = ({isActive}: PixelProps) => {
    return (
        <Box
            border='1px'
            borderColor={isActive ? 'white' : 'transparent'}
            bg={isActive ? 'orange.200' : 'transparent'}
            color='transparent'
            h='full'
            width='full'
            p='4'
            justifyContent='center'
            rounded='4'
            userSelect='none'
        />
    )
}

export default Pixel