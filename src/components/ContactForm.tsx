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

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Message sent successfully! We\'ll get back to you soon.');
        // Reset form
        setFormData({
          name: '',
          email: '',
          company: '',
          subject: '',
          message: ''
        });
      } else {
        toast.error(result.error || 'Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
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
        disabled={isSubmitting}
        className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-2 group ${
          isSubmitting
            ? 'bg-gray-600 cursor-not-allowed'
            : 'bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600'
        } text-white`}
        whileHover={!isSubmitting ? { scale: 1.02 } : {}}
        whileTap={!isSubmitting ? { scale: 0.98 } : {}}
      >
        {isSubmitting ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <Send className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            Send Message
          </>
        )}
      </motion.button>
    </motion.form>
  );
};

export default ContactForm;