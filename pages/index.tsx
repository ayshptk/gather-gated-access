import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { ConnectWallet } from "@3rdweb/react";
import { useWeb3 } from "@3rdweb/hooks";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import { Center } from "@3rdweb/react/node_modules/@chakra-ui/layout";
import { useState } from "react";
const Home: NextPage = () => {
  const { address, chainId, provider } = useWeb3();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const validateEmail = (email: string) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };
  async function signMessage() {
    setLoading(true);
    try {
      if (!validateEmail(email)) {
        setLoading(false);
        toast({
          title: "Invalid email",
          description: "Please enter a valid email",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        throw new Error("Invalid email");
      }
      if (!name || name === "") {
        setLoading(false);
        toast({
          title: "Invalid name",
          description: "Please enter a name",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        throw new Error("Invalid name");
      }
      const signed = await provider
        ?.getSigner()
        .signMessage("I would like to get access to the gather event!")
        .catch((err) => {
          setLoading(false);
          toast({
            title: "Error",
            description: err.message,
            status: "error",
            duration: 9000,
            isClosable: true,
          });
          throw err;
        })
        .then(async (signed) => {
          await fetch(
            `/api/add?signature=${signed}&email=${email}&name=${name}`
          ).then((res) => {
            res.json().then((data) => {
              setLoading(false);
              if (data.success) {
                toast({
                  title: "Success",
                  description: data.message,
                  status: "success",
                  duration: 9000,
                  isClosable: true,
                });
              } else {
                toast({
                  title: "Error",
                  description: data.message,
                  status: "error",
                  duration: 9000,
                  isClosable: true,
                });
              }
            });
          });
        });
    } catch (e) {
      setLoading(false);
    }
  }
  return (
    <div className={styles.container}>
      <Head>
        <title>Request Access</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Request Access to Gather Event</h1>
        <p className={styles.description}>
          Connect your wallet and sign the message to get access to gather!
        </p>
        <div>
          {address ? (
            <>
              <Center>
                <form>
                  <FormControl isRequired>
                    <FormLabel>Email</FormLabel>
                    <Input
                      type="email"
                      placeholder="john@example.com"
                      size="lg"
                      onChange={(event) => setEmail(event.currentTarget.value)}
                    />
                  </FormControl>
                  <FormControl isRequired mt={6}>
                    <FormLabel>Name</FormLabel>
                    <Input
                      type="text"
                      placeholder="John Doe"
                      size="lg"
                      onChange={(event) => setName(event.currentTarget.value)}
                    />
                  </FormControl>
                  <Button
                    onClick={signMessage}
                    colorScheme={"blue"}
                    width="full"
                    mt={4}
                  >
                    {loading ? <Spinner /> : "Get Access"}
                  </Button>
                </form>
              </Center>
            </>
          ) : (
            <ConnectWallet />
          )}
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by
          <span className={styles.logo}>
            <Image src="/thirdweb.svg" alt="thirdweb Logo" width={29} height={18} />
          </span>
        </a>
      </footer>
    </div>
  );
};

export default Home;