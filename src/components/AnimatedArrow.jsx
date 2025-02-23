import { useBreakpointValue, Box } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { MdArrowForward } from 'react-icons/md';

const MotionBox = motion.create(Box);


function AnimatedArrow() {

  const arrowMovement = useBreakpointValue({
    base: { y: [0, 10, 0] },
    md: { x: [0, 10, 0] }
  });
 
  const arrowRotation = useBreakpointValue({ base: 90, md: 0 });

  return (
    <MotionBox
   
      style={{ rotate: `${arrowRotation}deg` }}

      animate={arrowMovement}
      transition={{ duration: 1, ease: 'easeInOut', repeat: Infinity }}
    >
      <MdArrowForward size={50} color="#FFFFFF" />
    </MotionBox>
  );
}

export default AnimatedArrow;
