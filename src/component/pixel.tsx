import {Box} from "@chakra-ui/react";

interface PixelProps {
    isActive: boolean
}

const Pixel = ({isActive}: PixelProps) => {
    return (
        <Box
            bg={isActive ? 'orange.200' : 'transparent'}
            h='full'
            width='full'
            p='5'
            color='white'
            justifyContent='center'
            rounded='5'
            userSelect='none'
        >
        </Box>
    )
}

export default Pixel