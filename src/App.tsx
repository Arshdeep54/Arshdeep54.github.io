import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Github, Linkedin, Instagram, Mail, ExternalLink, 
  Code2, Briefcase, User, ChevronDown, Menu, X, 
  Terminal, Globe, Wrench, Send, MessageSquare 
} from 'lucide-react';
import ProjectCard from './components/ProjectCard';
import ContactForm from './components/ContactForm';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const Index = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSkillCategory, setActiveSkillCategory] = useState('programming');

  const projects = [
    {
      name: "CineQuest",
      date: "January, 2024",
      description: "Movies Website where a viewer can review the movies or even make a favorite movies list. One can also interact with other users on the websites via likes, dislike and comments in the reviews.",
      tech: ["React js", "Django", "MySql", "Beautiful Soup"],
      link: "https://github.com/Arshdeep54/CineQuest_IMG"
    },
    {
      name: "Shelflove",
      date: "June, 2024",
      description: "Full Stack Library Management system. Written in Golang, following the MVC architecture, fully dockerised, hosted locally on apache",
      tech: ["Golang", "MySQL", "docker", "apache2"],
      link: "https://github.com/Arshdeep54/Shelflove-mvc"
    },
    {
      name: "Gasper",
      date: "August, 2024",
      description: "Written in Go, Gasper is an intelligent PaaS that deploys and manages applications & databases in any cloud topology directly from the source code in docker containers without creating application-specific docker images & pipelines.",
      tech: ["Golang", "Docker"],
      link: "https://github.com/sdslabs/gasper"
    },
    {
      name: "ZeroCabs",
      date: "September, 2024",
      description: "ZeroCabs, a Web3 taxi application designed to redefine urban mobility with decentralized technology. Powered by Dimo, ZeroCabs harnesses comprehensive car data, including real-time location, sensor readings, and storage metrics, to deliver an unparalleled driving experience. This project won the EthOnline Hackathon 2024",
      tech: ["NextJs", "TypeScript", "Solidity"],
      link: "https://github.com/varun-r-mallya/EthOnline"
    }
  ];


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.h1 
              className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-500 bg-clip-text"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              Portfolio
            </motion.h1>

            <div className="hidden md:flex space-x-8">
              {['About', 'Projects', 'Contact'].map((item) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-gray-700 hover:text-indigo-600 transition-colors font-medium relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:w-0 after:bg-indigo-600 after:transition-all hover:after:w-full"
                  whileHover={{ scale: 1.05 }}
                >
                  {item}
                </motion.a>
              ))}
              <motion.a
                href="https://drive.google.com/drive/folders/1lf9tlc-Yqi0cABihVkvecc711m3rgyYs?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-1.5 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition-colors font-medium"
                whileHover={{ scale: 1.05 }}
              >
                Resume
              </motion.a>
            </div>

            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 hover:text-indigo-600"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <motion.div
          className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}
          initial={{ height: 0, opacity: 0 }}
          animate={{ 
            height: isMenuOpen ? 'auto' : 0, 
            opacity: isMenuOpen ? 1 : 0 
          }}
          transition={{ duration: 0.3 }}
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg">
            {['About', 'Skills', 'Projects', 'Contact'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="block px-3 py-2 text-gray-700 hover:text-indigo-600 transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                {item}
              </a>
            ))}
            <a
              href="https://drive.google.com/drive/folders/1lf9tlc-Yqi0cABihVkvecc711m3rgyYs?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="block px-3 py-2 text-indigo-600 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Resume
            </a>
          </div>
        </motion.div>
      </nav>

      {/* Hero Section */}
      <section id="about" className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20">
        <div className="absolute inset-0 overflow-hidden z-0">
          <div className="absolute -top-[40%] -right-[40%] w-[80%] h-[80%] rounded-full bg-indigo-100/50 blur-3xl"></div>
          <div className="absolute -bottom-[40%] -left-[40%] w-[80%] h-[80%] rounded-full bg-purple-100/50 blur-3xl"></div>
        </div>
        
        <motion.div 
          className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center relative z-10"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          <motion.div 
            className="text-center md:text-left"
            variants={fadeIn}
          >
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Hi, I'm <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text ">Arshdeep Singh</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Pursuing Btech in Mechanical Engineering at{" "}
              <a href="https://iitr.ac.in/" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-700 font-medium">
                IIT Roorkee
              </a>
              , Developer at{" "}
              <a href="https://sdslabs.co/" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:text-red-700 font-medium">
                SDSLabs
              </a>
            </p>
            <div className="flex justify-center md:justify-start space-x-6 mb-8">
              <motion.a
                href="https://github.com/Arshdeep54"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-white shadow-md hover:shadow-lg rounded-full text-gray-600 hover:text-indigo-600 transition-all"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <Github size={22} />
              </motion.a>
              <motion.a
                href="https://www.linkedin.com/in/arshdeep-singh-326815292/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-white shadow-md hover:shadow-lg rounded-full text-gray-600 hover:text-indigo-600 transition-all"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <Linkedin size={22} />
              </motion.a>
              <motion.a
                href="https://www.instagram.com/_arsh.bal_/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-white shadow-md hover:shadow-lg rounded-full text-gray-600 hover:text-indigo-600 transition-all"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <Instagram size={22} />
              </motion.a>
              <motion.a
                href="mailto:balarsh40@gmail.com"
                className="p-3 bg-white shadow-md hover:shadow-lg rounded-full text-gray-600 hover:text-indigo-600 transition-all"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <Mail size={22} />
              </motion.a>
            </div>
            <div className="flex items-center justify-center md:justify-start space-x-2 text-gray-600">
              <Mail size={16} />
              <a href="mailto:balarsh40@gmail.com" className="hover:text-indigo-600">
                balarsh40@gmail.com
              </a>
            </div>
          </motion.div>

          <motion.div 
            className="relative"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative w-[280px] h-[280px] mx-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full opacity-50 blur-sm"></div>
              <motion.div 
                className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full"
                animate={{ 
                  scale: [1, 1.05, 1],
                  opacity: [0.5, 0.6, 0.5]
                }}
                transition={{ 
                  repeat: Infinity,
                  duration: 3,
                  ease: "easeInOut" 
                }}
              ></motion.div>
              <div className="relative z-10 w-full h-full rounded-full overflow-hidden border-4 border-white shadow-xl">
                <img
                  src="/assets/pfpavatar.jpg"
                  alt="Arshdeep Singh"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="text-center mt-6">
              <span className="inline-block px-4 py-2 bg-white/80 backdrop-blur-sm shadow-md rounded-full text-gray-700 font-mono">
                <span className="text-indigo-600 font-medium">alias</span> c o s i g n
              </span>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <ChevronDown size={24} className="text-gray-400" />
        </motion.div>
      </section>

      
      {/* Projects Section */}
      <section id="projects" className="py-20 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-gray-50 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            className="text-center mb-16"
            variants={fadeIn}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-900 inline-flex items-center">
              <Briefcase className="mr-3 text-indigo-600" /> 
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text ">Projects</span>
            </h2>
            <div className="mt-4 w-24 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 mx-auto rounded-full"></div>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {projects.map((project, index) => (
              <ProjectCard key={project.name} project={project} index={index} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <ContactForm />

      {/* Footer */}
      <footer className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4">Arshdeep Singh</h3>
              <p className="text-indigo-100 mb-4">
                Developer passionate about creating elegant solutions.
              </p>
              <div className="flex space-x-4">
                <a 
                  href="https://github.com/Arshdeep54" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white text-indigo-100 transition-colors"
                >
                  <Github size={20} />
                </a>
                <a 
                  href="https://www.linkedin.com/in/arshdeep-singh-326815292/" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white text-indigo-100 transition-colors"
                >
                  <Linkedin size={20} />
                </a>
                <a 
                  href="mailto:balarsh40@gmail.com"
                  className="hover:text-white text-indigo-100 transition-colors"
                >
                  <Mail size={20} />
                </a>
              </div>
            </div>
            <div className="text-right">
              <div className="flex flex-col space-y-2  md:items-end">
                {['About', 'Skills', 'Projects', 'Contact'].map((item) => (
                  <a 
                    key={item} 
                    href={`#${item.toLowerCase()}`}
                    className="hover:text-white text-indigo-600 transition-colors"
                  >
                    {item}
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className="border-t border-indigo-500 mt-8 pt-8 text-center text-indigo-100">
            <p>© {new Date().getFullYear()} Arshdeep Singh. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
