import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Mail, User, Building2, MessageSquare } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error('Please fill in all required fields');
      return;
    }

    const emailBody = `Name: ${formData.name}\nEmail: ${formData.email}\nCompany: ${formData.company || 'Not specified'}\nSubject: ${formData.subject}\n\nMessage:\n${formData.message}`;
    
    window.location.href = `mailto:info@autimind.com?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(emailBody)}`;
    
    toast.success('Opening email client...');
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      company: '',
      subject: '',
      message: ''
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const inputVariants = {
    focus: { scale: 1.02, transition: { duration: 0.2 } },
    blur: { scale: 1, transition: { duration: 0.2 } }
  };

  return (
    <motion.form
      className="max-w-2xl mx-auto bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8"
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Toaster position="top-right" />
      
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <motion.div 
          className="relative"
          variants={inputVariants}
          whileFocus="focus"
        >
          <label className="block text-sm font-medium text-teal-400 mb-2">
            <User className="inline w-4 h-4 mr-2" />
            Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 text-white placeholder-gray-400 transition-all duration-300"
            placeholder="Your full name"
          />
        </motion.div>
        
        <motion.div 
          className="relative"
          variants={inputVariants}
          whileFocus="focus"
        >
          <label className="block text-sm font-medium text-teal-400 mb-2">
            <Mail className="inline w-4 h-4 mr-2" />
            Email *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 text-white placeholder-gray-400 transition-all duration-300"
            placeholder="your.email@company.com"
          />
        </motion.div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <motion.div 
          className="relative"
          variants={inputVariants}
          whileFocus="focus"
        >
          <label className="block text-sm font-medium text-teal-400 mb-2">
            <Building2 className="inline w-4 h-4 mr-2" />
            Company
          </label>
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 text-white placeholder-gray-400 transition-all duration-300"
            placeholder="Your company name"
          />
        </motion.div>
        
        <motion.div 
          className="relative"
          variants={inputVariants}
          whileFocus="focus"
        >
          <label className="block text-sm font-medium text-teal-400 mb-2">
            <MessageSquare className="inline w-4 h-4 mr-2" />
            Subject *
          </label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 text-white placeholder-gray-400 transition-all duration-300"
            placeholder="What's this about?"
          />
        </motion.div>
      </div>
      
      <motion.div 
        className="mb-6"
        variants={inputVariants}
        whileFocus="focus"
      >
        <label className="block text-sm font-medium text-teal-400 mb-2">
          <MessageSquare className="inline w-4 h-4 mr-2" />
          Message *
        </label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={6}
          className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 text-white placeholder-gray-400 transition-all duration-300 resize-vertical"
          placeholder="Tell us about your learning and training needs..."
        />
      </motion.div>
      
      <motion.button
        type="submit"
        className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:from-teal-600 hover:to-cyan-600 transition-all duration-300 flex items-center justify-center gap-2 group"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Send className="w-5 h-5 transition-transform group-hover:translate-x-1" />
        Send Message
      </motion.button>
    </motion.form>
  );
};

export default ContactForm;