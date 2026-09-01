import type {Variants} from 'framer-motion';

const ease=[0.22,1,0.36,1] as const;

export const fadeUp:Variants={hidden:{opacity:0,y:20},visible:{opacity:1,y:0,transition:{duration:.5,ease}}};
export const fadeIn:Variants={hidden:{opacity:0},visible:{opacity:1,transition:{duration:.35,ease}}};
export const scaleIn:Variants={hidden:{opacity:0,scale:.96},visible:{opacity:1,scale:1,transition:{duration:.35,ease}}};
export const staggerContainer:Variants={hidden:{},visible:{transition:{staggerChildren:.07,delayChildren:.04}}};
export const staggerItem:Variants=fadeUp;
export const pageTransition:Variants={hidden:{opacity:0,y:8},visible:{opacity:1,y:0,transition:{duration:.32,ease}},exit:{opacity:0,y:-5,transition:{duration:.18}}};
export const drawerTransition:Variants={hidden:{y:'100%'},visible:{y:0,transition:{type:'spring',damping:30,stiffness:300}},exit:{y:'100%',transition:{duration:.22,ease}}};
export const modalTransition:Variants={hidden:{opacity:0,scale:.97,y:10},visible:{opacity:1,scale:1,y:0,transition:{duration:.28,ease}},exit:{opacity:0,scale:.98,y:8,transition:{duration:.18}}};

