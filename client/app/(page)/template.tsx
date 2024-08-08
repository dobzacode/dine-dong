'use client';

const variants = {
  hidden: { opacity: 1, x: 0, y: 0 },
  enter: { opacity: 1, x: 0, y: 0 }
};

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    // <motion.div
    //   variants={variants}
    //   initial="hidden"
    //   exit="hidden"
    //   animate="enter"
    //   transition={{ type: 'easeIn', duration: 0.5 }}
    //   key="LandingPage"
    //   className="overflow-x-hidden"
    // >
    <> {children}</>
    // </motion.div>
  );
}
