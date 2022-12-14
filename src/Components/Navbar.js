import { Box, Spacer, Flex, Button, Link } from "@chakra-ui/react";
import { useEffect, useRef } from "react";
import { Search } from "./Search";

import './Navbar.css';
import {  UploadImages } from "../Utils/processUtils";

import {useNavigate} from 'react-router-dom'
import { firebaseAuth } from "../Utils/loginUtils";



function NavBar() {
    const fileRef = useRef({});
    const history = useNavigate();

    useEffect(() => {
        console.log(fileRef.current)
        if (fileRef.current) {
            fileRef.current.onchange = () => {
                const selectedFiles = [...fileRef.current.files];
                UploadImages(selectedFiles)
            }
        }
    }, [])
    return (<Box as={'header'} py={6} borderColor='#E7EBF0' className="header">

        <Flex alignItems={'center'}>
            <Flex alignItems={'strech'} px={4} alignContent={'center'}>
                <Box w='14px' height='14px' scale={'1.2'} >⭐</Box>
                <Link paddingInlineStart={2} color='#007FFF'>
                    Decentralized Drive
                </Link>
            </Flex>
            <Spacer></Spacer>
            <Box>
                <Search></Search>
            </Box>
            <Spacer />
            <Box>
                <Button colorScheme='blue' id='uploadBtn'
                    onClick={() => {
                        fileRef.current.click();
                        fileRef.current.value = '';
                    }}>Upload</Button>
                <input type={'file'} multiple style={{ display: "none" }} ref={fileRef}></input>
            </Box>
            <Link>
            
            <Button mx={3} onClick={
                ()=>{
                    firebaseAuth.signOut();
                    history("/signin");
                }
            }>Sign Out</Button>
           
            </Link>
            <img style={{ position: "absolute", top: "-20000px", left: "-20000px" }} id='tfsjs'></img>
        </Flex>
    </Box>)
}
export { NavBar }
