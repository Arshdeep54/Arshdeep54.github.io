import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';

interface Project {
  name: string;
  date: string;
  description: string;
  tech: string[];
  link: string;
}

interface ProjectCardProps {
  project: Project;
  index: number;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, index }) => {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { delay: index * 0.1, duration: 0.5 } }
  };

  const techVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: (i: number) => ({ 
      opacity: 1, 
      scale: 1,
      transition: { delay: index * 0.05 + i * 0.05, duration: 0.3 } 
    }),
    hover: { 
      scale: 1.05,
      backgroundColor: "rgba(99, 102, 241, 0.2)",
      transition: { duration: 0.2 }
    }
  };

  return (
    <motion.div
      variants={fadeIn}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true }}
      className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all group"
    >
      <div className="p-6 border-b border-gray-100">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text  group-hover:from-purple-600 group-hover:to-indigo-600 transition-all duration-500">
            {project.name}
          </h3>
          <span className="text-sm font-medium px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full">
            {project.date}
          </span>
        </div>
        <p className="text-gray-600 mb-6 leading-relaxed">{project.description}</p>
      </div>
      
      <div className="p-6 bg-gray-50">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Technologies:</h4>
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tech.map((tech, i) => (
            <motion.span
              key={tech}
              className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-sm"
              variants={techVariants}
              custom={i}
              initial="initial"
              whileInView="animate"
              whileHover="hover"
              viewport={{ once: true }}
            >
              {tech}
            </motion.span>
          ))}
        </div>
        <motion.a
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-indigo-600 hover:text-indigo-700 font-medium"
          whileHover={{ x: 5 }}
        >
          View Project <ExternalLink size={16} className="ml-1" />
        </motion.a>
      </div>
    </motion.div>
  );
};

export default ProjectCard;