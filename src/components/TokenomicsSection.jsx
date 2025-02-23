// src/components/TokenomicsSection.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Text,
  Flex,
  VStack,
  HStack,
  Image,
  useBreakpointValue,
} from '@chakra-ui/react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Sector,
  Legend,
} from 'recharts';
import { AnimatePresence, motion } from 'framer-motion';
import CoinsmallR from '../images/coinsmallR.webp';
import Pointer from '../images/pointer.webp';

const MotionImage = motion.create(Image);
const MotionBox = motion.create(Box);

const distributionData = [
  {
    name: 'Company',
    value: 27.5,
    explanation: 'This is the supply held by the company.',
  },
  {
    name: 'Bet Mining',
    value: 25,
    explanation: 'The Bet Mining algorithm will distribute these tokens gradually to players over 10 years.',
  },
  {
    name: 'Platform',
    value: 20,
    explanation: 'Since all the GGR is distributed to Mianus Stakers, the platform needs to stake 20% of the supply in order to fund operations, pay salaries and office costs.',
  },
  {
    name: 'Airdrop',
    value: 10,
    explanation: 'Supply shared by Tap Mianus Players.',
  },
  {
    name: 'ICO',
    value: 10,
    explanation: 'ICO maybe coming soon if the community demands it.',
  },
  {
    name: 'Liquidity',
    value: 5,
    explanation: 'Initial LP on Dex.',
  },
  {
    name: 'Presale',
    value: 2.5,
    explanation: 'Tokens offered in the presale event to early supporters. (already closed)',
  },
];

const gradientConfigs = [
  { start: '#FF6F91', end: '#FFBC42' },
  { start: '#FFCFEF', end: '#0A97B0' },
  { start: '#D4AF37', end: '#8E44AD' },
  { start: '#2ECC71', end: '#FFFF66' },
  { start: '#FFA500', end: '#FFD700' },
  { start: '#FF6347', end: '#FF4500' },
  { start: '#42A1FF', end: '#6FD2FF' },
];

const TokenomicsSection = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [showLabels, setShowLabels] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowLabels(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  const outerRadiusValue = useBreakpointValue({ base: 100, md: 140 }) || 120;
  const innerRadiusValue = useBreakpointValue({ base: 50, md: 70 }) || 60;
  const isDesktop = useBreakpointValue({ base: false, md: true });

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    const percentage = percent * 100;
    const formattedPercentage =
      percentage % 1 === 0 ? percentage.toFixed(0) : percentage.toFixed(1);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        dominantBaseline="central"
        style={{ fontFamily: 'Raleway, sans-serif', fontSize: 14 }}
      >
        {`${formattedPercentage}%`}
      </text>
    );
  };

  const defaultLabelRenderer = (props) => {
    if (props.index === activeIndex) return null;
    return renderCustomizedLabel(props);
  };


  const renderActiveShape = (props) => {
    const {
      cx,
      cy,
      startAngle,
      endAngle,
      innerRadius,
      outerRadius,
      fill,
    } = props;
    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius - 10}
          outerRadius={outerRadius + 10}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        {renderCustomizedLabel({ ...props, outerRadius: outerRadius + 10 })}
      </g>
    );
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { when: 'beforeChildren', staggerChildren: 0.05 },
    },
    exit: { opacity: 0, transition: { duration: 0.3 } },
  };

  const letterVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.1 } },
  };

  const CustomLegendDesktop = ({
    distributionData,
    gradientConfigs,
    activeIndex,
    setActiveIndex,
  }) => (
    <VStack align="start" spacing={4}>
      {distributionData.map((entry, index) => {
        const isActive = activeIndex === index;
        return (
          <HStack
            key={`legend-item-${index}`}
            spacing={2}
            width="300px"
            p={1}
            borderRadius="md"
            cursor="pointer"
            onMouseEnter={() => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(null)}
            onClick={() => setActiveIndex(index)}
          >
            <Box
              width="30px"
              height="30px"
              borderRadius="md"
              border="1px solid #FFFFFF"
              style={{
                background: `linear-gradient(to right, ${gradientConfigs[index].start}, ${gradientConfigs[index].end})`,
              }}
            />
            <Text
              fontFamily="Slackey"
              fontSize="14px"
              color={isActive ? '#FFFF00' : '#FFFFFF'}
              mr="150px"
            >
              {entry.name}
            </Text>
            {isActive && (
              <Image
                src={Pointer}
                alt="Pointer"
                boxSize="30px"
                ml="150px"
                transform="rotate(45deg)"
              />
            )}
          </HStack>
        );
      })}
    </VStack>
  );

  return (
    <Box as="section" py={20} textAlign="center">
      <Container maxW="container.lg">
        <VStack spacing={4} mb={12}>
          <Flex
            direction={{ base: 'column', md: 'row' }}
            align="center"
            justify="center"
            gap={8}
            w="full"
          >
            <Box
              position="relative"
              width={{ base: '90%', md: '60%' }}
              height={{ base: '450px', md: '400px' }}
              mx="auto"
              pt={{ base: 6, md: 0 }}
              pb={{ base: 6, md: 0 }}
            >
              <Text fontFamily="Slackey" fontSize="16px" color="#FFFFFF" mt={6}>
                Mianus Token Distribution
              </Text>

              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <defs>
                    {gradientConfigs.map((cfg, idx) => (
                      <linearGradient
                        key={idx}
                        id={`gradient${idx}`}
                        x1="0"
                        y1="0"
                        x2="1"
                        y2="0"
                      >
                        <stop offset="0%" stopColor={cfg.start} />
                        <stop offset="100%" stopColor={cfg.end} />
                      </linearGradient>
                    ))}
                  </defs>

                  <Pie
                    data={distributionData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={outerRadiusValue}
                    innerRadius={innerRadiusValue}
                    minAngle={5}
                    isAnimationActive
                    animationDuration={1500}
                    label={showLabels ? defaultLabelRenderer : null}
                    labelLine={false}
                    activeIndex={activeIndex}
                    activeShape={renderActiveShape}
                  >
                    {distributionData.map((entry, idx) => (
                      <Cell
                        key={`cell-${idx}`}
                        fill={`url(#gradient${idx})`}
                        style={{ cursor: 'pointer', outline: 'none' }}
                        onMouseEnter={() => setActiveIndex(idx)}
                        onMouseLeave={() => setActiveIndex(null)}
                        onClick={() => setActiveIndex(idx)}
                      />
                    ))}
                  </Pie>

                  {!isDesktop && (
                    <Legend
                      verticalAlign="bottom"
                      align="center"
                      layout="horizontal"
                      content={(props) => (
                        <Flex justify="center" wrap="wrap" gap={4} mt={6}>
                          {props.payload?.map((entry, idx) => {
                            const isActive = activeIndex === idx;
                            return (
                              <HStack
                                key={`legend-item-${idx}`}
                                spacing={2}
                                border="2px solid"
                                borderColor={
                                  isActive ? '#FFFFFF' : 'transparent'
                                }
                                p={1}
                                borderRadius="md"
                                cursor="pointer"
                                onMouseEnter={() => setActiveIndex(idx)}
                                onMouseLeave={() => setActiveIndex(null)}
                                onClick={() => setActiveIndex(idx)}
                              >
                               <Box
                                  width="20px"
                                  height="20px"
                                  borderRadius="md"
                                  border="1px solid #FFFFFF"
                                  style={{
                                    background: `linear-gradient(to right, ${
                                      gradientConfigs[idx].start
                                    }, ${gradientConfigs[idx].end})`,
                                  }}
                                />
                                <Text
                                  fontFamily="Slackey"
                                  fontSize="14px"
                                  color={isActive ? '#FFFF00' : '#FFFFFF'}
                                >
                                  {entry.value}
                                </Text>
                              </HStack>
                            );
                          })}
                        </Flex>
                      )}
                    />
                  )}
                </PieChart>
              </ResponsiveContainer>

              <MotionImage
                src={CoinsmallR}
                alt="Rotating Coin"
                boxSize={{ base: '60px', md: '80px' }}
                position="absolute"
                top={{ base: '37%', md: '52%' }}
                left={{ base: '42%', md: '43.5%' }}
                transform="translate(-50%, -50%)"
                animate={{ rotate: 360 }}
                transition={{ duration: 4, ease: 'linear', repeat: Infinity }}
                sx={{
                    '@media (max-width: 400px)': {
                      top: '31.5%',    // Adjust these as needed
                      left: '41%'    // so the coin stays centered
                    }
                  }}
              />
            </Box>

            {isDesktop && (
              <Box
                width={{ base: '100%', md: '40%' }}
                order={{ base: 2, md: 2 }}
                textAlign="left"
                mt={{ base: 6, md: 0 }}
              >
                <CustomLegendDesktop
                  distributionData={distributionData}
                  gradientConfigs={gradientConfigs}
                  activeIndex={activeIndex}
                  setActiveIndex={setActiveIndex}
                />
              </Box>
            )}
          </Flex>

          <MotionBox height="60px" position="relative" mt="16px" maxW={{ base: '90%', md: '100%' }} mx="auto">
            <AnimatePresence mode="wait">
              {activeIndex !== null && (
                <MotionBox
                key={activeIndex}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                style={{
                  marginTop: '26px',
                  padding: '16px',
                  background: 'rgba(0, 0, 0, 0.6)',
                  borderRadius: '4px',
                  maxWidth: isDesktop ? '60%' : '90%',
                  minWidth: '300px', 
                  marginLeft: 'auto',
                  marginRight: 'auto',
                  }}
                >
                  {distributionData[activeIndex].explanation.split('').map((char, index) => (
                    <motion.span
                      key={index}
                      variants={letterVariants}
                      style={{ display: 'inline-block' }}
                    >
                      {char === ' ' ? '\u00A0' : char}
                    </motion.span>
                  ))}
                </MotionBox>
              )}
            </AnimatePresence>
          </MotionBox>
        </VStack>
      </Container>
    </Box>
  );
};

export default TokenomicsSection;
