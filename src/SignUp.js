import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  HStack,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
} from '@chakra-ui/react';

import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useState, useCallback, useRef } from 'react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { initializeApp } from 'firebase/app';
import { FIREBASE_CONFIG } from './Utils/CONSTANTS';
import { getAuth, createUserWithEmailAndPassword,signOut } from "firebase/auth";

const firebaseApp = initializeApp(FIREBASE_CONFIG);
const firebaseAuth = getAuth(firebaseApp);

function SignupCard() {

  const history = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('test@unfold2022.com');
  const [password, setPassword] = useState("unfawpeokwqepo");
  const emailRef = useRef(null);
  const onSignUp = useCallback(() => {
    if (!emailRef.current.validity.valid) {
      alert("Please enter a valid email id");
      return;
    }
    if (password.length < 5) {
      alert("Password should be of minimum length 5");
      return;
    }
    createUserWithEmailAndPassword(firebaseAuth, email, password).then(({user})=>{
      user.getIdToken().then((idToken) => {
        console.log("IDTOKEN ",JSON.stringify({ idToken }));

        return fetch("https://40.113.171.199:8443/sessionSignup", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ idToken }),
        }).then((resp)=>{
            console.log(resp);
            if(resp.status ==='success'){
              signOut();
              history.push("/encryptionMethod");
            }
        })
    }).then(() => {
    
      return signOut();
    })
    .then(() => {
      console.log("Nav to home");
      history.push("/listing");
    });
  },(msg)=>{
    alert(msg)
  })

  }, [password, email, history])
  return (
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}
      bg={useColorModeValue('gray.50', 'gray.800')}>
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'} textAlign={'center'}>
            Sign up
          </Heading>
          <Text fontSize={'lg'} color={'gray.600'}>
            to enjoy all of our cool features ✌️
          </Text>
        </Stack>
        <Box
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow={'lg'}
          p={8}>
          <Stack spacing={4}>
            <HStack>
              <Box>
                <FormControl id="firstName" isRequired>
                  <FormLabel>First Name</FormLabel>
                  <Input type="text" />
                </FormControl>
              </Box>
              <Box>
                <FormControl id="lastName">
                  <FormLabel>Last Name</FormLabel>
                  <Input type="text" />
                </FormControl>
              </Box>
            </HStack>
            <FormControl id="email" isRequired>
              <FormLabel>Email address</FormLabel>
              <Input ref={emailRef} type="email" value={email} onChange={(event) => {
                setEmail(event.target.value);
              }} />
            </FormControl>
            <FormControl id="password" isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input type={showPassword ? 'text' : 'password'}value={password} onChange={(event) => {
                  setPassword(event.target.value);
                }} />
                <InputRightElement h={'full'}>
                  <Button
                    variant={'ghost'}
                    onClick={() =>
                      setShowPassword((showPassword) => !showPassword)
                    }>
                    {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <Stack spacing={10} pt={2}>

              <Button onClick={onSignUp}
                loadingText="Submitting"
                size="lg"
                bg={'blue.400'}
                color={'white'}
                _hover={{
                  bg: 'blue.500',
                }}>
                Sign up
              </Button>

            </Stack>
            <Stack pt={6}>
              <Text align={'center'}>
                Already a user?<RouterLink to='/#signin'><Link color={'blue.400'}>Login</Link></RouterLink>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}
export { SignupCard }