import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Send, MessageSquare } from 'lucide-react';

const ContactForm = () => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate sending email by opening mailto link
    const body = `Name: ${formState.name}\nEmail: ${formState.email}\nMessage: ${formState.message}`;
    window.location.href = `mailto:balarsh40@gmail.com?subject=Portfolio Contact&body=${encodeURIComponent(body)}`;
    // Reset form after submission
    setFormState({
      name: '',
      email: '',
      message: ''
    });
    setIsSubmitting(false);
  };

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const inputVariants = {
    focus: {
      scale: 1.02,
      boxShadow: "0 4px 6px -1px rgba(99, 102, 241, 0.1), 0 2px 4px -1px rgba(99, 102, 241, 0.06)",
      transition: { duration: 0.2 }
    }
  };

  return (
    <section id="contact" className="py-20 bg-white relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-indigo-100/50 blur-3xl"></div>
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-purple-100/50 blur-3xl"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="text-center mb-16"
          variants={fadeIn}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold text-gray-900 inline-flex items-center justify-center">
            <MessageSquare className="mr-3 text-indigo-600" /> 
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent ">
              Get in Touch
            </span>
          </h2>
          <div className="mt-4 w-24 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 mx-auto rounded-full"></div>
          <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
            Have a question or want to work together? I'd love to hear from you.
            Feel free to reach out and I'll respond as soon as possible.
          </p>
        </motion.div>

        <motion.div
          className="max-w-2xl mx-auto"
          variants={fadeIn}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                  <motion.div
                    className="relative"
                    variants={inputVariants}
                    whileFocus="focus"
                  >
                    <motion.input
                      type="text"
                      name="name"
                      id="name"
                      value={formState.name}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField('name')}
                      onBlur={() => setFocusedField(null)}
                      required
                      className="peer w-full px-4 py-3 rounded-lg border-2 border-gray-200 placeholder-transparent focus:outline-none focus:border-indigo-500 transition-colors"
                      placeholder="Your Name"
                    />
                    <label
                      htmlFor="name"
                      className={`absolute left-4 -top-2.5 bg-white px-1 text-sm transition-all
                        ${focusedField === 'name' || formState.name
                          ? 'text-indigo-600'
                          : 'text-gray-500'}`}
                    >
                      Your Name
                    </label>
                    <User size={16} className="absolute right-4 top-4 text-gray-400" />
                  </motion.div>

                  <motion.div
                    className="relative"
                    variants={inputVariants}
                    whileFocus="focus"
                  >
                    <motion.input
                      type="email"
                      name="email"
                      id="email"
                      value={formState.email}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                      required
                      className="peer w-full px-4 py-3 rounded-lg border-2 border-gray-200 placeholder-transparent focus:outline-none focus:border-indigo-500 transition-colors"
                      placeholder="Your Email"
                    />
                    <label
                      htmlFor="email"
                      className={`absolute left-4 -top-2.5 bg-white px-1 text-sm transition-all
                        ${focusedField === 'email' || formState.email
                          ? 'text-indigo-600'
                          : 'text-gray-500'}`}
                    >
                      Your Email
                    </label>
                    <Mail size={16} className="absolute right-4 top-4 text-gray-400" />
                  </motion.div>
                </div>

                <motion.div
                  className="relative"
                  variants={inputVariants}
                  whileFocus="focus"
                >
                  <motion.textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={formState.message}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField('message')}
                    onBlur={() => setFocusedField(null)}
                    required
                    className="peer w-full px-4 py-3 rounded-lg border-2 border-gray-200 placeholder-transparent focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                    placeholder="Your Message"
                  />
                  <label
                    htmlFor="message"
                    className={`absolute left-4 -top-2.5 bg-white px-1 text-sm transition-all
                      ${focusedField === 'message' || formState.message
                        ? 'text-indigo-600'
                        : 'text-gray-500'}`}
                  >
                    Your Message
                  </label>
                </motion.div>

                <div className="text-right">
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 font-medium text-white shadow-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors disabled:opacity-70"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                    <Send size={16} className="ml-2" />
                  </motion.button>
                </div>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactForm;
