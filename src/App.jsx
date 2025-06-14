import { useEffect, useState, useRef, } from "react";
import { motion, AnimatePresence, useScroll, useTransform,useInView } from "framer-motion";
import { FaVideo, FaCamera, FaFeatherAlt, FaEnvelope, FaLinkedin, FaInstagram } from 'react-icons/fa';
import "./App.css";
import { storage } from './firebase.js';
import { ref, getDownloadURL } from 'firebase/storage';
import mainvid from '../src/assets/0525.mp4';
import { g } from "framer-motion/client";


// Add styles for glow effect
const glowStyles = `
  @keyframes glow {
    0% { opacity: 0.5; }
    50% { opacity: 0.8; }
    100% { opacity: 0.5; }
  }

  .animate-glow {
    animation: glow 3s ease-in-out infinite;
  }

  .glow-effect {
    box-shadow: 0 0 100px 3px rgba(139, 92, 246, 0.3);
    transition: box-shadow 0.3s ease-in-out;
  }
`;

// Add style tag to head (ensures it's added only once in a browser environment)
if (typeof document !== 'undefined' && !document.getElementById('glow-styles')) {
  const style = document.createElement('style');
  style.id = 'glow-styles'; // Add an ID to prevent multiple additions
  style.textContent = glowStyles;
  document.head.appendChild(style);
}

const greetings = [
  "• Hello", "• 안녕", "• Bonjour", "• Hola", "• Ciao", "• こんにちは",
  "• नमस्ते", "• 你好", "• Guten Tag", "• Merhaba", "• Wassup",
  "• Hallo", "• سَلَامٌ", "• Sawatdee", "• Merhaba", "• Olá",
  "• Здравствуйте", "• Hello"
];

// Data for Project Showcase
const projects = [
  {
    id: 1,
    title: "Property Videos",
    category: "Videography | Choreography",
    thumbnail: "https://placehold.co/600x400/8b5cf6/FFFFFF?text=Project+1", // Replace with your video/image
    description: "A captivating dance film exploring human connection through contemporary movement."
  },
  {
    id: 2,
    title: "Urban Rhythms",
    category: "Photography | Storytelling",
    thumbnail: "https://placehold.co/600x400/3b82f6/FFFFFF?text=Project+2",
    description: "A photo series documenting the unspoken narratives of city life."
  },
  {
    id: 3,
    title: "Narrative Landscapes",
    category: "Content Creation | Videography",
    thumbnail: "https://placehold.co/600x400/ec4899/FFFFFF?text=Project+3",
    description: "Crafting visual stories for brands, blending cinematic flair with impactful messaging."
  },
  {
    id: 4,
    title: "Ephemeral Beauty",
    category: "Choreography | Photography",
    thumbnail: "https://placehold.co/600x400/06b6d4/FFFFFF?text=Project+4",
    description: "Still captures of fleeting dance moments, revealing the artistry in motion."
  },
];

// Data for Creative Services
const services = [
  {
    icon: <FaVideo className="text-purple-400 text-6xl mb-4" />,
    title: "Cinematic Videography",
    description: "From concept to final cut, I bring your vision to life with compelling visuals and evocative narratives. Specializing in dance films, brand stories, and event coverage."
  },
  {
    icon: <FaCamera className="text-blue-400 text-6xl mb-4" />,
    title: "Artistic Photography",
    description: "Capturing the essence of moments, people, and places. Portraiture, architectural, event, and conceptual photography with a unique artistic perspective."
  },
  {
    icon: <FaCamera className="text-pink-400 text-6xl mb-4" />,
    title: "Choreographic Direction",
    description: "Crafting dynamic and expressive movement sequences for film, stage, and digital content. Blending storytelling with innovative physical expression."
  },
  {
    icon: <FaFeatherAlt className="text-green-400 text-6xl mb-4" />,
    title: "Narrative & Content Creation",
    description: "Weaving impactful stories across various platforms. From scriptwriting to social media campaigns, I create content that resonates and engages your audience."
  },
];

// Data for Storyteller's Journal
const journalEntries = [
  {
    id: 1,
    title: "The Art of Imperfection: Finding Beauty in Unplanned Moments",
    date: "May 20, 2025",
    excerpt: "Sometimes, the most captivating shots are those that defy expectations. A glimpse into my philosophy on embracing the unexpected...",
    link: "#"
  },
  {
    id: 2,
    title: "Behind the Lens: Choreographing 'Urban Echoes' Film",
    date: "April 15, 2025",
    excerpt: "A deep dive into the creative process behind my latest dance film, from conceptualization to the challenges of filming on location.",
    link: "#"
  },
  {
    id: 3,
    title: "Writing with Light: My Approach to Visual Storytelling",
    date: "March 08, 2025",
    excerpt: "Exploring how narrative principles guide my photography and videography, turning mere visuals into compelling stories.",
    link: "#"
  },
];


export default function App() {
  const { scrollYProgress } = useScroll(); // For global scroll progress

  // State and refs for the Hero Section
  const [greetingIndex, setGreetingIndex] = useState(0);
  const [firstWordShown, setFirstWordShown] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const videoRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSection, setCurrentSection] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const { scrollY } = useScroll();
  const aboutRef = useRef(null);
  const servicesRef = useRef(null);
  const contactRef = useRef(null);
    const portraitRef = useRef(null); // <-- Add this line
  
  const isAboutInView = useInView(aboutRef, { amount: 0.2 });
  const isServicesInView = useInView(servicesRef, { amount: 0.2 });
  const isContactInView = useInView(contactRef, { amount: 0.2 });

  const sections = [
    'hero',
    'about',
    'gallery',
    'contact'
  ];

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const heroVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 2,
        ease: [0.25, 0.1, 0.25, 1]
      }
    }
  };

  const textVariants = {
    hidden: { y: 100, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 1.2,
        ease: [0.25, 0.1, 0.25, 1]
      }
    }
  };

  const imageVariants = {
    hidden: { scale: 1.2, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 1.5,
        ease: [0.25, 0.1, 0.25, 1]
      }
    },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1]
      }
    }
  };

  const galleryImages = [
    { src: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800&h=1000&fit=crop', alt: 'Architecture' },
    { src: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=800&fit=crop', alt: 'Wedding' },
    { src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop', alt: 'Landscape' },
    { src: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&h=900&fit=crop', alt: 'Portrait' },
    { src: 'https://images.unsplash.com/photo-1464822759844-d150baec53c1?w=800&h=600&fit=crop', alt: 'Mountain' },
    { src: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=700&h=900&fit=crop', alt: 'Street' }
  ];

  const parallaxY = useTransform(scrollY, [0, 500], [0, -150]);

  useEffect(() => {
    const loadVideo = async () => {
      try {
        setIsLoading(true);
        const videoRef = ref(storage, 'Videos/0525.mp4');
        console.log('Loading video from:', videoRef);
        
        const url = await getDownloadURL(videoRef);
        console.log('Video URL obtained:', url);
        
        setVideoUrl(url);
        setIsLoading(false);
      } catch (err) {
        console.error('Error loading video:', err);
        setError(err.message);
        setIsLoading(false);
      }
    };

    loadVideo();
  }, []);

  useEffect(() => {
    const firstWordTimer = setTimeout(() => {
      setFirstWordShown(true);
    }, 1500); // First word fades in after 1.5 seconds

    return () => clearTimeout(firstWordTimer);
  }, []);

  useEffect(() => {
    if (!firstWordShown) return;

    let intervalId;
    let timeoutId;

    if (greetingIndex === greetings.length - 1) {
      timeoutId = setTimeout(() => {
        setGreetingIndex(0); // Reset to the first word
      }, 1000); // Last word fades out for 1 second
    } else {
      intervalId = setInterval(() => {
        setGreetingIndex((prevIndex) => (prevIndex + 1) % greetings.length);
      }, greetingIndex === 0 ? 1500 : 150); // First word fades in slower, others change quickly
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [greetingIndex, firstWordShown]);


  // Transformations for scroll effects (can be adjusted per section)
  const xTransformProjects = useTransform(scrollYProgress, [0.1, 0.4], ['-100%', '0%']); // Example for projects
  const scaleImageAbout = useTransform(scrollYProgress, [0.3, 0.6], [0.8, 1]);
  const opacityTextAbout = useTransform(scrollYProgress, [0.4, 0.7], [0, 1]);


  return (
    <div className="min-h-screen bg-black text-white relative overflow-x-hidden font-sans">
      {/* Hero Section - DO NOT CHANGE THIS PART */}
      <div className="h-screen w-full bg-black text-white flex flex-col justify-center items-center relative px-4 sm:px-0">

        {/* Navigation */}
  <motion.div className="absolute top-4 left-4 text-xl sm:text-2xl font-bold cursor-pointer"
    whileHover={{ scale: 1.1, color: "#8b5cf6" }}
    transition={{ duration: 0.2 }}
  >Saurabh.Verse</motion.div>

          <motion.div className="absolute top-4 right-4 text-xs sm:text-sm cursor-pointer"
    whileHover={{ scale: 1.1, color: "#8b5cf6" }}
    transition={{ duration: 0.2 }}>Labs ↗</motion.div>
  
        <motion.div className="absolute top-4 flex gap-8 text-sm justify-center">
          <motion.span className="cursor-pointer"
            whileHover={{ scale: 1.1, color: "#8b5cf6" }}
            transition={{ duration: 0.2 }}>Home</motion.span >
          <motion.span className="cursor-pointer"
            whileHover={{ scale: 1.1, color: "#8b5cf6" }}
            transition={{ duration: 0.2 }}>About us</motion.span >
          <motion.span className="cursor-pointer"
            whileHover={{ scale: 1.1, color: "#8b5cf6" }}
            transition={{ duration: 0.2 }}>Projects</motion.span >
        </motion.div>

        {/* Video Container with Rounded Frame */}
        <div className="relative w-[1350px] h-[570px] bg-gray-900 rounded-3xl overflow-hidden z-10 glow-effect">
          {/* Add the glow container */}
          <div className="absolute inset-0 -z-10 animate-glow">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-200 via-blue-200 to-purple-100 opacity-30 blur-2xl transform scale-110"></div>
          </div>
          {isLoading && <div className="absolute inset-0 flex items-center justify-center text-white">Loading...</div>}
      {error && <div className="absolute inset-0 flex items-center justify-center text-red-500">{error}</div>}
      {videoUrl && (
        <video
          ref={videoRef}
          className="w-full h-full object-cover background-video"
          autoPlay
          loop
          muted
          playsInline
          onError={(e) => console.error('Video error:', e)}
          onLoadStart={() => console.log('Video loading started')}
          onLoadedData={() => console.log('Video loaded successfully')}
        >
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
          {/* Video with ref */}
          {/* <video
            ref={videoRef}
            className="w-full h-full object-cover background-video"
            autoPlay
            loop
            muted
            playsInline
            onError={(e) => console.log('Video error:', e)}
            onLoadStart={() => console.log('Video loading started')}
            onLoadedData={() => console.log('Video loaded successfully')}
          >
            {/* Try multiple source paths */}
            {/* <source src={mainvid} type="video/mp4" /> */}
            {/* <source src="/assets/0525.mp4" type="video/mp4" />
            <source src="./assets/0525.mp4" type="video/mp4" />
            <source src="/src/assets/0525.mp4" type="video/mp4" /> */}
            {/* If you import the video, uncomment this line: */}
            {/* <source src={mainvid} type="video/mp4" /> */}
            {/* Your browser does not support the video tag. */}
          {/* </video> */}



          <div className="absolute inset-0 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.h1
                key={greetings[greetingIndex]}
                className="text-4xl md:text-6xl "
                style={{ transform: "translateX(-46px)" }} // Shift left by 46px
                initial={{ opacity: greetingIndex === 0 ? 0 : 1, y: greetingIndex === 0 ? 20 : 0 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: greetingIndex === greetings.length - 1 ? 0 : 1, y: greetingIndex === greetings.length - 1 ? -20 : 0 }}
                transition={{ duration: greetingIndex === 0 || greetingIndex === greetings.length - 1 ? 1 : 0.2 }}
              >
                {greetings[greetingIndex]}
              </motion.h1>
            </AnimatePresence>
          </div>
        </div>

        <motion.p
          className="absolute bottom-10 text-sm text-gray-300"
          animate={{
            y: [0, -10, 0], // Jumping animation: moves up and down
          }}
          transition={{
            duration: 1, // Duration of one cycle
            repeat: Infinity, // Infinite repetition
            ease: "easeInOut", // Smooth easing
          }}
        >
          Scroll down
        </motion.p>
        <motion.p
          className="absolute left-7 bottom-2/1 transform -rotate-90 origin-left text-xs tracking-widest text-gray-400 p-t"
        >
          SCROLL TO EXPLORE
        </motion.p>
      </div>
<div className="bg-black text-white overflow-hidden">
      {/* Navigation and Logo - Only visible when About section in view */}
      {isAboutInView && (
        <>
          <motion.nav 
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="fixed top-0 right-0 z-50 p-8"
          >
            <div className="flex flex-col gap-4 text-right">
              {['Home', 'Service', 'About', 'Product'].map((item, index) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                  className="text-gray-400 hover:text-white cursor-pointer transition-colors duration-300"
                >
                  {item}
                </motion.div>
              ))}
            </div>
          </motion.nav>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="fixed top-8 left-8 z-50"
          >
            <div className="w-12 h-12 border-2 border-white flex items-center justify-center text-xl font-bold">
              M
            </div>
          </motion.div>
</>
      )}
   
      {/* About Section */}
      <motion.section 
      ref={aboutRef}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className="min-h-screen bg-gray-50 text-black py-20"
      >
        <div className="max-w-7xl mx-auto px-8">
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.2 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <div className="text-sm text-gray-500 mb-4">01</div>
            <div className="text-sm text-gray-500 mb-8">
              CHERISH YOUR SPECIAL DAY<br />
              WITH STUNNING,
            </div>
            <h2 className="text-6xl lg:text-7xl font-light leading-tight mb-12">
              I Specialize In<br />
              Transforming Fleeting<br />
              Moments Into Timeless Memories.<br />
              Whether It's A Wedding, Family<br />
              Portrait, Or A Personal Milestone
            </h2>
          </motion.div>

          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start"
          >
            <div>
              <h3 className="text-2xl font-medium mb-6">My Goal Is To Make Every Session Enjoyable</h3>
              <p className="text-gray-600 mb-8">
                a passionate photographer with 10 years of experience in capturing life's most precious 
                moments. My journey began [brief personal story or inspiration].
              </p>

              <div className="mb-12">
                <h3 className="text-2xl font-medium mb-6">Let My Lens Capture The Beauty Of Your Moments.</h3>
                <p className="text-gray-600">
                  Explore my gallery to see a collection of my favorite works. From weddings and 
                  engagements to portraits and events, each photo tells a unique story.
                </p>
              </div>
            </div>

            <div className="space-y-8">
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="relative overflow-hidden rounded-lg"
              >
                <img 
                  src="https://images.unsplash.com/photo-1583394838876-c4b6757b9f20?w=600&h=400&fit=crop"
                  alt="Photography work"
                  className="w-full h-64 object-cover"
                />
                <div className="absolute top-4 right-4 text-white text-sm">(First)</div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="relative overflow-hidden rounded-lg"
              >
                <img 
                  src="https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600&h=400&fit=crop"
                  alt="Photography work"
                  className="w-full h-64 object-cover"
                />
                <div className="absolute top-4 right-4 text-white text-sm">(Prad)</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Gallery Section */}
      <motion.section 
            ref={servicesRef}

        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className="py-20 bg-gray-50 text-black"
      >
        <div className="max-w-7xl mx-auto px-8">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="text-sm font-medium mb-2">Bringing The</h2>
              </div>
              <div className="text-sm text-gray-500">1/15</div>
            </div>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {galleryImages.map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                whileHover="hover"
                variants={imageVariants}
                viewport={{ once: true }}
                className="relative overflow-hidden rounded-lg cursor-pointer group"
              >
                <img 
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-64 lg:h-80 object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    whileHover={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="text-white text-center"
                  >
                    <div className="text-2xl font-light mb-2">Let My Lens</div>
                    <div className="text-2xl font-light">Capture</div>
                    <div className="text-xs mt-4 opacity-80">
                      CHERISH YOUR SPECIAL DAY<br />
                      WITH STUNNING,
                    </div>
                  </motion.div>
                </motion.div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="flex justify-between items-end">
              <div className="text-left">
                <div className="text-sm font-medium mb-2">Bringing The</div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-sm border-b border-black pb-1"
                >
                  See All
                </motion.button>
              </div>
              <div className="text-right">
                <div className="text-2xl font-light mb-2">Let My Lens</div>
                <div className="text-2xl font-light mb-4">Capture</div>
                <div className="text-xs text-gray-500">
                  CHERISH YOUR SPECIAL DAY<br />
                  WITH STUNNING,
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Contact Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className="py-20 bg-gray-50 text-black"
      >
        <div className="max-w-7xl mx-auto px-8">
          <motion.div
          ref={contactRef}
            initial={{ y: 100, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.2 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="text-sm text-gray-500 mb-4">(Prad)</div>
            <h2 className="text-6xl lg:text-8xl font-light mb-8">
              Candid Shots<br />
              That Capture<br />
              The Best Part<br />
              And Joy
            </h2>
            
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 100, delay: 0.5 }}
              viewport={{ once: true }}
              className="inline-block"
            >
              <svg width="60" height="60" viewBox="0 0 60 60" className="transform rotate-12">
                <path d="M30 5L35 25L55 30L35 35L30 55L25 35L5 30L25 25Z" fill="black"/>
              </svg>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-16"
          >
            <div>
              <h3 className="text-sm font-medium mb-8">Have Something<br />Unique In Mind?</h3>
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="relative overflow-hidden rounded-lg mb-8"
              >
                <img 
                  src="https://images.unsplash.com/photo-1554048612-b6a482b224ca?w=600&h=400&fit=crop"
                  alt="Contact"
                  className="w-full h-64 object-cover"
                />
              </motion.div>
            </div>

            <div className="space-y-8">
              <div>
                <div className="text-xs text-gray-500 mb-4">
                  CHERISH YOUR SPECIAL DAY<br />
                  WITH STUNNING,
                </div>
                
                <div className="space-y-6 text-right">
                  <p>
                    Explore my gallery to see a collection of my favorite works. 
                    From weddings and engagements to portraits and events, each photo 
                    tells a unique story.
                  </p>
                  
                  <p className="font-medium">
                    Let my lens capture the beauty of your moments.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
{/* --- About Section - Cinematic Portrait --- */}
<section id="about" className="py-40 bg-black min-h-screen flex items-center relative overflow-hidden">
  {/* Film grain overlay */}
  <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none"></div>
  
  {/* Floating light effects */}
  <motion.div 
    className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full bg-purple-900 blur-3xl opacity-10"
    animate={{
      scale: [1, 1.1, 1],
      x: [0, -50, 0]
    }}
    transition={{
      duration: 15,
      repeat: Infinity,
      ease: "easeInOut"
    }}
  />

  <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center gap-24 relative z-10">
    {/* Portrait with film reel effect */}
    <motion.div 
    ref={portraitRef}
      className="relative lg:w-1/2"
      initial={{ opacity: 0, x: -100 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="relative">
        <motion.img
          src="https://placehold.co/800x1000/6d28d9/FFFFFF?text=Portrait"
          alt="Artist Portrait"
          className="w-full h-auto max-h-[90vh] object-cover grayscale hover:grayscale-0 transition-all duration-1000"
          initial={{ scale: 0.9 }}
          whileInView={{ scale: 1 }}
          transition={{ duration: 2 }}
        />
        <motion.div 
          className="absolute inset-0 border border-white border-opacity-10 pointer-events-none"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        />
        <motion.div 
          className="absolute -bottom-8 -left-8 w-32 h-32 border-t-2 border-l-2 border-purple-400 opacity-80"
          initial={{ opacity: 0, x: -20, y: -20 }}
          whileInView={{ opacity: 0.8, x: 0, y: 0 }}
          transition={{ delay: 0.8 }}
        />
        <motion.div 
          className="absolute -top-8 -right-8 w-32 h-32 border-b-2 border-r-2 border-blue-400 opacity-80"
          initial={{ opacity: 0, x: 20, y: 20 }}
          whileInView={{ opacity: 0.8, x: 0, y: 0 }}
          transition={{ delay: 1.0 }}
        />
      </div>
    </motion.div>

    {/* Text content - film credit style */}
    <motion.div 
      className="lg:w-1/2"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <motion.p
        className="text-sm uppercase tracking-[0.5em] text-gray-500 mb-8"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        The Visionary
      </motion.p>
      
      <motion.h2 
        className="text-7xl font-normal text-white mb-12 tracking-tight font-serif leading-tight"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
      >
        <span className="block text-2xl text-gray-400 mb-6 font-sans">Chapter One</span>
        Through The Lens <br/>Of A Storyteller
      </motion.h2>

      <motion.div 
        className="space-y-6 text-gray-300 font-light text-lg leading-relaxed max-w-2xl"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 1.1, staggerChildren: 0.1 }}
      >
        <motion.p>
          My journey began not with a camera, but with a curiosity about the spaces between moments—the unspoken narratives that linger just beyond perception.
        </motion.p>
        <motion.p>
          Trained in both <span className="text-purple-300">visual arts</span> and <span className="text-blue-300">movement theory</span>, I approach each project as a choreographed experience, where light, composition, and motion converge to reveal deeper truths.
        </motion.p>
        <motion.p>
          The camera is my pen, the frame my page. Whether crafting brand narratives or personal art pieces, I seek that alchemical moment when technique transcends into <span className="italic">poetry</span>.
        </motion.p>
      </motion.div>

      <motion.div 
        className="mt-16 flex gap-6"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
      >
        <motion.a
          href="#"
          className="px-8 py-4 bg-transparent border border-gray-700 text-white hover:border-purple-500 hover:text-purple-300 transition-all duration-500 flex items-center gap-3 group"
          whileHover={{ backgroundColor: 'rgba(139, 92, 246, 0.1)' }}
        >
          <span className="block w-4 h-px bg-gray-400 transition-all duration-300 group-hover:w-8 group-hover:bg-purple-400"></span>
          Full Biography
        </motion.a>
        <motion.a
          href="#"
          className="px-8 py-4 bg-transparent border border-gray-700 text-white hover:border-blue-500 hover:text-blue-300 transition-all duration-500 flex items-center gap-3 group"
          whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
        >
          <span className="block w-4 h-px bg-gray-400 transition-all duration-300 group-hover:w-8 group-hover:bg-blue-400"></span>
          CV & Awards
        </motion.a>
      </motion.div>
    </motion.div>
  </div>
</section>

{/* --- Services Section - Film Reel Style --- */}
<section id="services" className="py-40 bg-gradient-to-br from-black to-gray-950 min-h-screen flex items-center relative overflow-hidden">
  {/* Moving light effect */}
  <motion.div 
  ref={servicesRef}
    className="absolute top-0 left-0 w-full h-full pointer-events-none"
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 0.3 }}
    transition={{ duration: 2 }}
  >
    <motion.div
      className="absolute top-1/2 left-1/2 w-1/2 h-1/2 bg-gradient-radial from-purple-900 to-transparent rounded-full"
      animate={{
        x: ['-20%', '20%', '-20%'],
        y: ['-10%', '10%', '-10%']
      }}
      transition={{
        duration: 25,
        repeat: Infinity,
        ease: "linear"
      }}
    />
  </motion.div>

  <div className="container mx-auto px-4 relative z-10">
    {/* Section title - Film opening credits style */}
    <motion.div 
      className="text-center mb-32"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
    >
      <motion.p
        className="text-sm uppercase tracking-[0.5em] text-gray-500 mb-6"
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Craft & Vision
      </motion.p>
      <motion.h2
        className="text-8xl font-normal text-white mb-6 tracking-tight font-serif"
        initial={{ y: 40, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ 
          duration: 1.5, 
          delay: 0.6,
          ease: [0.16, 1, 0.3, 1]
        }}
      >
        <span className="block text-4xl font-light mb-4 text-gray-400">Specialized In</span>
        The Art of Visual Alchemy
      </motion.h2>
    </motion.div>

    {/* Services grid - Film strip style */}
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
      {services.map((service, index) => (
        <motion.div
          key={index}
          className="bg-gradient-to-b from-gray-900 to-gray-950 p-8 border border-gray-800 hover:border-purple-500 transition-all duration-500 relative overflow-hidden group"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 1, 
            delay: 0.2 + index * 0.15,
            ease: [0.16, 1, 0.3, 1]
          }}
        >
          {/* Perforation effect */}
          <div className="absolute -top-3 left-4 right-4 flex justify-between">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-1 h-3 bg-gray-950 rounded-full"></div>
            ))}
          </div>
          
          <motion.div
            className="mb-8"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.5 }}
          >
            {service.icon}
          </motion.div>
          <h3 className="text-2xl font-light mb-4 text-white font-serif">{service.title}</h3>
          <p className="text-gray-400 leading-relaxed mb-6">{service.description}</p>
          <motion.a
            href="#"
            className="text-sm text-gray-500 hover:text-purple-300 transition-colors duration-500 flex items-center gap-2 group"
            whileHover={{ x: 5 }}
          >
            <span className="block w-4 h-px bg-gray-500 transition-all duration-300 group-hover:w-8 group-hover:bg-purple-400"></span>
            Explore Service
          </motion.a>
        </motion.div>
      ))}
    </div>
  </div>
</section>

{/* --- Journal Section - Classic Notebook Style --- */}
<section id="journal" className="py-40 bg-black min-h-screen flex items-center relative overflow-hidden">
  {/* Animated writing line effect */}
  <motion.div 
    className="absolute top-0 left-0 w-full h-full pointer-events-none"
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 0.05 }}
    transition={{ duration: 2 }}
  >
    <motion.div
      className="absolute top-0 left-0 w-full h-full bg-[url('https://assets.codepen.io/13471/ink-texture.png')] opacity-30 mix-blend-overlay"
      animate={{
        backgroundPosition: ['0% 0%', '0% 100%']
      }}
      transition={{
        duration: 120,
        repeat: Infinity,
        ease: "linear"
      }}
    />
  </motion.div>

  <div className="container mx-auto px-4 relative z-10">
    {/* Section title - Vintage notebook style */}
    <motion.div 
      className="text-center mb-32"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
    >
      <motion.p
        className="text-sm uppercase tracking-[0.5em] text-gray-500 mb-6"
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Reflections & Musings
      </motion.p>
      <motion.h2
        className="text-8xl font-normal text-white mb-6 tracking-tight font-serif"
        initial={{ y: 40, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ 
          duration: 1.5, 
          delay: 0.6,
          ease: [0.16, 1, 0.3, 1]
        }}
      >
        <span className="block text-4xl font-light mb-4 text-gray-400">Volume II</span>
        The Creator's Journal
      </motion.h2>
    </motion.div>

    {/* Journal entries - Notebook paper style */}
    <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
      {journalEntries.map((entry, index) => (
        <motion.div
          key={entry.id}
          className="relative bg-gradient-to-b from-gray-900 to-gray-950 p-8 border border-gray-800 hover:border-blue-500 transition-all duration-500 group"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 1, 
            delay: 0.2 + index * 0.15,
            ease: [0.16, 1, 0.3, 1]
          }}
        >
          {/* Notebook paper lines */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(10)].map((_, i) => (
              <div 
                key={i} 
                className="absolute left-8 right-8 h-px bg-gray-800"
                style={{ top: `${8 + i * 2}rem` }}
              />
            ))}
          </div>
          
          {/* Entry content */}
          <motion.p 
            className="text-blue-400 text-sm mb-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3 + index * 0.15 }}
          >
            {entry.date}
          </motion.p>
          <motion.h3
            className="text-3xl font-light mb-6 text-white leading-tight font-serif"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.4 + index * 0.15 }}
          >
            {entry.title}
          </motion.h3>
          <motion.p
            className="text-gray-400 mb-8 leading-relaxed relative z-10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5 + index * 0.15 }}
          >
            {entry.excerpt}
          </motion.p>
          <motion.a
            href={entry.link}
            className="text-sm text-gray-500 hover:text-blue-300 transition-colors duration-500 flex items-center gap-2 group"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.6 + index * 0.15 }}
          >
            <span className="block w-4 h-px bg-gray-500 transition-all duration-300 group-hover:w-8 group-hover:bg-blue-400"></span>
            Continue Reading
          </motion.a>
        </motion.div>
      ))}
    </div>

    {/* Vintage notebook footer */}
    <motion.div 
      className="text-center mt-40"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ delay: 1.0 }}
    >
      <motion.p 
        className="text-gray-500 mb-8 tracking-widest text-sm"
        animate={{
          opacity: [0.5, 1, 0.5]
        }}
        transition={{
          duration: 4,
          repeat: Infinity
        }}
      >
        MORE PAGES TO FILL
      </motion.p>
      <motion.a
        href="#"
        className="inline-block px-12 py-5 border border-gray-800 text-white text-lg tracking-wider hover:border-blue-500 hover:text-blue-300 transition-all duration-700 relative overflow-hidden group"
        whileHover={{
          backgroundColor: 'rgba(59, 130, 246, 0.05)'
        }}
      >
        <span className="relative z-10">View All Entries</span>
        <motion.span
          className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-900/30 to-transparent opacity-0 group-hover:opacity-100"
          initial={{ x: '-100%' }}
          whileHover={{ x: '100%' }}
          transition={{ duration: 1.2 }}
        />
      </motion.a>
    </motion.div>
  </div>
</section>

{/* --- Contact Section - Cinematic Ending Credits --- */}
<section id="contact" className="py-40 bg-gradient-to-br from-black to-purple-950 min-h-screen flex items-center relative overflow-hidden">
  {/* Floating particles */}
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(20)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-1 h-1 bg-white rounded-full"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          opacity: Math.random() * 0.3
        }}
        animate={{
          y: [0, (Math.random() - 0.5) * 100],
          x: [0, (Math.random() - 0.5) * 50],
          opacity: [0.1, 0.3, 0.1]
        }}
        transition={{
          duration: 10 + Math.random() * 20,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    ))}
  </div>

  <div className="container mx-auto px-4 text-center relative z-10">
    {/* Ending credits style title */}
    <motion.div 
      className="mb-32"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
    >
      <motion.p
        className="text-sm uppercase tracking-[0.5em] text-gray-500 mb-6"
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        The Final Frame
      </motion.p>
      <motion.h2
        className="text-8xl font-normal text-white mb-6 tracking-tight font-serif"
        initial={{ y: 40, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ 
          duration: 1.5, 
          delay: 0.6,
          ease: [0.16, 1, 0.3, 1]
        }}
      >
        <span className="block text-4xl font-light mb-4 text-gray-400">Epilogue</span>
        Let's Create Together
      </motion.h2>
    </motion.div>

    {/* Contact form - Film submission style */}
    <motion.div
    ref={contactRef}
      className="max-w-2xl mx-auto bg-gradient-to-b from-gray-900 to-black p-12 border border-gray-800 rounded-lg"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
    >
      <motion.p
        className="text-gray-300 mb-12 text-lg leading-relaxed"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 1.0 }}
      >
        Whether you have a project in mind or just want to discuss the art of visual storytelling, I'd love to hear from you.
      </motion.p>

      <form className="space-y-8 text-left">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.2 }}
        >
          <label className="block text-gray-400 mb-2">Your Name</label>
          <input 
            type="text" 
            className="w-full bg-gray-950 border-b border-gray-700 py-3 px-1 text-white focus:border-purple-500 focus:outline-none transition-colors duration-500" 
            placeholder="Full name"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.3 }}
        >
          <label className="block text-gray-400 mb-2">Email Address</label>
          <input 
            type="email" 
            className="w-full bg-gray-950 border-b border-gray-700 py-3 px-1 text-white focus:border-purple-500 focus:outline-none transition-colors duration-500" 
            placeholder="hello@example.com"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.4 }}
        >
          <label className="block text-gray-400 mb-2">Project Details</label>
          <textarea 
            className="w-full bg-gray-950 border-b border-gray-700 py-3 px-1 text-white focus:border-purple-500 focus:outline-none transition-colors duration-500 min-h-32" 
            placeholder="Tell me about your vision..."
          />
        </motion.div>

        <motion.div
          className="pt-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
        >
          <motion.button
            type="submit"
            className="w-full py-5 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-lg font-light tracking-wider hover:opacity-90 transition-opacity duration-500 relative overflow-hidden group"
            whileHover={{ 
              background: 'linear-gradient(to right, #8b5cf6, #3b82f6)'
            }}
          >
            <span className="relative z-10">Send Message</span>
            <motion.span
              className="absolute inset-0 bg-gradient-to-r from-purple-700 to-blue-700 opacity-0 group-hover:opacity-100"
              initial={{ x: '-100%' }}
              whileHover={{ x: '100%' }}
              transition={{ duration: 0.8 }}
            />
          </motion.button>
        </motion.div>
      </form>
    </motion.div>

    {/* Social links - Film credit style */}
    <motion.div
      className="flex justify-center gap-8 mt-20"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ delay: 1.8 }}
    >
      <motion.a
        href="#"
        className="text-gray-400 hover:text-white transition-colors duration-500"
        whileHover={{ y: -5 }}
      >
        <FaInstagram className="text-2xl" />
      </motion.a>
      <motion.a
        href="#"
        className="text-gray-400 hover:text-white transition-colors duration-500"
        whileHover={{ y: -5 }}
      >
        <FaLinkedin className="text-2xl" />
      </motion.a>
      <motion.a
        href="#"
        className="text-gray-400 hover:text-white transition-colors duration-500"
        whileHover={{ y: -5 }}
      >
        <FaEnvelope className="text-2xl" />
      </motion.a>
    </motion.div>

    {/* Final copyright - End credits scroll */}
    <motion.div
      className="mt-32"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ delay: 2.0 }}
    >
      <motion.p
        className="text-gray-500 text-sm tracking-widest"
        animate={{
          y: [0, -10, 0],
          opacity: [0.7, 1, 0.7]
        }}
        transition={{
          duration: 4,
          repeat: Infinity
        }}
      >
        © {new Date().getFullYear()} MOTION.SAURABH. ALL RIGHTS RESERVED.
      </motion.p>
    </motion.div>
  </div>
</section>
    </div>
  );

}
