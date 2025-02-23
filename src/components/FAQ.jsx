import React, { useState } from "react";
import {
  Box,
  Text,
  Flex,
  Collapse,
  Image as ChakraImage
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import Pointer from "../images/pointer.webp";


const faqItemsData = [
    {
      question: "What is $Mianus and how does it power the Bet Mianus platform?",
      answer:
        "$Mianus is the native utility token that fuels the Bet Mianus ecosystem. It underpins all transactions on the platform—from placing bets to accessing premium gaming features—and is integral to the revenue-sharing mechanism, ensuring every wager is secure, transparent, and efficient."
    },
    {
      question: "How does Bet Mianus’s revenue-sharing model benefit token holders?",
      answer:
        "The platform redistributes 100% of its gaming revenue directly to token holders who stake $Mianus. This means that by holding and staking $Mianus, you receive a proportional share of the platform’s earnings, creating an ongoing income stream and strong incentive to support the ecosystem."
    },
    {
      question: "What does it mean that $Mianus is a natively multichain token?",
      answer:
        "Being natively multichain, $Mianus operates seamlessly across multiple blockchains—such as Ethereum, Base, BSC, and Solana—without the need for complex bridging. This ensures lower fees, faster transactions, and enhanced liquidity, offering a smooth, integrated user experience across diverse networks."
    },
    {
      question: "How does Bet Mining work and how can I earn $Mianus through qualifying bets?",
      answer:
        "Bet Mining is a reward mechanism built into the platform. Every qualifying bet you place earns you a share of $Mianus tokens. The algorithm is designed to gradually reduce the rewards over time, ensuring token scarcity while continuously incentivizing active, successful bettors."
    },
    {
      question: "What is the total supply of $Mianus and how is it distributed?",
      answer:
        "The total supply of $Mianus is capped at 100 billion tokens. These tokens are distributed across multiple segments, including company reserves, Bet Mining rewards, platform incentives, airdrops, the ICO, liquidity pools, and presale allocations, ensuring a balanced and sustainable ecosystem."
    },
    {
      question: "How can I buy, stake, or trade $Mianus tokens?",
      answer:
        "You can acquire $Mianus during the ICO or on secondary exchanges once it’s listed. After purchase, you can stake your tokens directly on the Bet Mianus platform to earn revenue share and additional rewards, or trade them as part of your broader crypto portfolio."
    },
    {
      question:
        "What security and transparency measures make Bet Mianus a provably fair crypto gambling platform?",
      answer:
        "Bet Mianus employs advanced cryptographic techniques and blockchain audit trails to ensure every bet is recorded on-chain and verifiable by players. Smart contracts govern game outcomes and revenue distribution, making the entire process provably fair and completely transparent."
    },
    {
      question:
        "Which blockchain networks support $Mianus and what are the benefits of cross-chain transactions?",
      answer:
        "$Mianus is built to be natively multichain and operates on several major networks including Ethereum, Base, BSC, and Solana. This cross-chain capability reduces transaction fees, speeds up confirmations, and increases liquidity, making it easier for users worldwide to interact with and benefit from the platform."
    }
  ];


const pointerVariants = {
    closed: { rotate: 45, transition: { duration: 0.5, ease: "easeInOut" } },
    open:   { rotate: 0,  transition: { duration: 0.5, ease: "easeInOut" } },
  };
  
  function FAQ() {

    const [openStates, setOpenStates] = useState(faqItemsData.map(() => false));
    const MotionImage = motion.create(ChakraImage);
  
    const handleToggle = (index) => {
      setOpenStates((prev) => {
        const newStates = [...prev];
        newStates[index] = !newStates[index];
        return newStates;
      });
    };
  
    return (
      <Box
      w="full"
      maxW="800px"
      mx="auto"
      mt={8}
      px={{ base: 4, md: 0 }} 
      display="flex"
      flexDirection="column"
      gap={6}
      id="faq"
      >
        <Text as="h2" fontSize="2xl" fontWeight="bold" color="white" mb={4}>
          Frequently Asked Questions
        </Text>
  
        {faqItemsData.map((item, idx) => {
          const isOpen = openStates[idx];
  
          return (
            <Box key={idx} borderBottom="1px solid #444" pb={3}>

              <Flex
                align="center"
                justify="space-between"
                cursor="pointer"
                onClick={() => handleToggle(idx)}
                tabIndex={0}
                _hover={{ background: "transparent" }}
                _focus={{ outline: "none" }}
                _focusVisible={{ outline: "none" }}
              >
                <Text fontSize="lg" fontWeight="semibold" color="white">
                  {item.question}
                </Text>
  
               
                <MotionImage
                  key={`pointer-${idx}`}   
                  src={Pointer}
                  alt="pointer"
                  boxSize="20px"
                  variants={pointerVariants}
                  initial={false}   
                  animate={isOpen ? "open" : "closed"}
                />
              </Flex>
  
              <Collapse
                in={isOpen}
                animateOpacity
                style={{ transition: "height 0.5s ease, opacity 0.5s ease" }}
              >
                <Box mt={2} color="gray.300">
                  {item.answer}
                </Box>
              </Collapse>
            </Box>
          );
        })}
      </Box>
    );
  }
  
  export default FAQ;