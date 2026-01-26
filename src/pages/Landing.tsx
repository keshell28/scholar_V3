import { motion, useScroll, useTransform } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, MessageCircle, GraduationCap, MapPin, Award, Heart } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const features = [
    {
      icon: Users,
      title: 'Student Discovery',
      description: 'Connect with Zimbabwean students worldwide through our swipe-style matching system',
      gradient: 'from-green-600 to-emerald-500',
    },
    {
      icon: MessageCircle,
      title: 'City & Country Help',
      description: 'Get real advice from students already living in your destination country',
      gradient: 'from-yellow-500 to-amber-400',
    },
    {
      icon: GraduationCap,
      title: 'Communities',
      description: 'Join groups based on university, field of study, or country',
      gradient: 'from-red-600 to-rose-500',
    },
    {
      icon: MapPin,
      title: 'Local Resources',
      description: 'Find African shops, hair salons, and community spaces near you',
      gradient: 'from-green-500 to-teal-400',
    },
    {
      icon: Award,
      title: 'Scholarships',
      description: 'Discover verified scholarship opportunities tailored for Zimbabwean students',
      gradient: 'from-amber-500 to-yellow-400',
    },
    {
      icon: Heart,
      title: 'Recipes & Culture',
      description: 'Share traditional recipes and stay connected to home',
      gradient: 'from-rose-600 to-pink-500',
    },
  ];

  const stats = [
    { number: '10K+', label: 'Students Connected' },
    { number: '50+', label: 'Countries' },
    { number: '100+', label: 'Universities' },
    { number: '500+', label: 'Scholarships' },
  ];

  const testimonials = [
    {
      name: 'Tanaka M.',
      university: 'University of Cape Town',
      text: 'Scholar helped me find a study group in my first week. Made settling in so much easier!',
      avatar: '🇿🇼',
    },
    {
      name: 'Chipo K.',
      university: 'University of Manchester',
      text: 'Found the best African food shop thanks to this community. Feels like home.',
      avatar: '🇿🇼',
    },
    {
      name: 'Tendai R.',
      university: 'University of Toronto',
      text: 'Connected with mentors who guided me through scholarship applications. Grateful!',
      avatar: '🇿🇼',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 text-gray-900 dark:text-white overflow-hidden">
      {/* Animated Background Gradient */}
      <motion.div
        className="fixed inset-0 opacity-20 dark:opacity-30 pointer-events-none"
        style={{
          background: `radial-gradient(600px at ${mousePosition.x}px ${mousePosition.y}px, rgba(255, 144, 102, 0.2), transparent 80%)`,
        }}
      />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
        {/* Animated Circles */}
        <motion.div
          className="absolute w-96 h-96 bg-[var(--color-primary-400)]/20 dark:bg-[var(--color-primary-600)]/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          style={{ top: '10%', left: '10%' }}
        />
        <motion.div
          className="absolute w-96 h-96 bg-[var(--color-secondary-400)]/20 dark:bg-[var(--color-secondary-600)]/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -100, 0],
            y: [0, 50, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          style={{ bottom: '10%', right: '10%' }}
        />

        <motion.div
          className="relative z-10 max-w-6xl mx-auto text-center"
          style={{ y, opacity }}
        >
          {/* Flag Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-primary-100)] dark:bg-white/5 backdrop-blur-sm border border-[var(--color-primary-300)] dark:border-white/10 mb-8"
          >
            <span className="text-2xl">🇿🇼</span>
            <span className="text-sm font-medium text-[var(--color-primary-800)] dark:text-white">For Zimbabwean Students Worldwide</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            className="text-6xl md:text-8xl font-bold mb-6 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Your Global
            <br />
            <span className="bg-gradient-to-r from-[var(--color-primary-500)] via-[var(--color-secondary-500)] to-[var(--color-primary-500)] bg-clip-text text-transparent animate-gradient">
              Student Network
            </span>
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-gray-600 dark:text-slate-300 mb-12 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Connect with fellow Zimbabwean students, find scholarships, share culture, 
            and navigate student life abroad together.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <motion.button
              onClick={() => navigate('/login')}
              className="px-8 py-4 bg-gradient-to-r from-[var(--color-primary-500)] to-[var(--color-primary-600)] text-white rounded-full font-semibold text-lg shadow-lg shadow-[var(--color-primary-500)]/30 hover:shadow-[var(--color-primary-500)]/50 transition-all"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started Free
            </motion.button>
            <motion.button
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 bg-white dark:bg-white/5 backdrop-blur-sm border border-gray-200 dark:border-white/20 rounded-full font-semibold text-lg text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-white/10 transition-all"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              Learn More
            </motion.button>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <div className="w-6 h-10 border-2 border-gray-400 dark:border-white/30 rounded-full flex items-start justify-center p-2">
              <motion.div
                className="w-1.5 h-1.5 bg-[var(--color-primary-500)] dark:bg-white rounded-full"
                animate={{ y: [0, 16, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-transparent via-[var(--color-primary-100)]/30 dark:via-[var(--color-primary-950)]/10 to-transparent">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center"
            >
              <motion.div
                className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[var(--color-primary-600)] to-[var(--color-secondary-600)] bg-clip-text text-transparent mb-2"
                whileHover={{ scale: 1.1 }}
              >
                {stat.number}
              </motion.div>
              <div className="text-gray-600 dark:text-slate-400">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              Everything You Need
            </h2>
            <p className="text-xl text-gray-600 dark:text-slate-400 max-w-2xl mx-auto">
              A complete platform designed specifically for Zimbabwean students studying abroad
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative p-8 bg-white dark:bg-white/5 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-white/10 hover:border-[var(--color-primary-400)] dark:hover:border-white/20 shadow-sm hover:shadow-lg transition-all cursor-pointer overflow-hidden"
              >
                {/* Gradient Background on Hover */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 dark:group-hover:opacity-10 transition-opacity`}
                />

                <motion.div
                  className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6`}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <feature.icon className="w-7 h-7 text-white" />
                </motion.div>

                <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">{feature.title}</h3>
                <p className="text-gray-600 dark:text-slate-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-32 px-6 bg-gradient-to-b from-transparent via-[var(--color-secondary-100)]/20 dark:via-[var(--color-secondary-950)]/5 to-transparent">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              Loved by Students
            </h2>
            <p className="text-xl text-gray-600 dark:text-slate-400">
              Hear from Zimbabwean students around the world
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="p-8 bg-white dark:bg-white/5 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-white/10 hover:border-[var(--color-primary-400)] dark:hover:border-[var(--color-primary-500)]/30 shadow-sm hover:shadow-lg transition-all"
              >
                <div className="text-4xl mb-4">{testimonial.avatar}</div>
                <p className="text-lg mb-6 text-gray-700 dark:text-slate-300 italic">"{testimonial.text}"</p>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</div>
                  <div className="text-sm text-gray-600 dark:text-slate-400">{testimonial.university}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-32 px-6">
        <motion.div
          className="max-w-4xl mx-auto text-center relative"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-[var(--color-primary-400)]/20 via-[var(--color-secondary-400)]/20 to-[var(--color-primary-400)]/20 blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
            }}
            transition={{ duration: 10, repeat: Infinity }}
          />

          <div className="relative z-10 p-12 bg-white/90 dark:bg-white/5 backdrop-blur-sm rounded-3xl border border-gray-200 dark:border-white/10 shadow-xl">
            <h2 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900 dark:text-white">
              Ready to Connect?
            </h2>
            <p className="text-xl text-gray-700 dark:text-slate-300 mb-8 max-w-2xl mx-auto">
              Join thousands of Zimbabwean students building their global community
            </p>
            <motion.button
              onClick={() => navigate('/login')}
              className="px-10 py-5 bg-gradient-to-r from-[var(--color-primary-500)] to-[var(--color-primary-600)] text-white rounded-full font-semibold text-xl shadow-lg shadow-[var(--color-primary-500)]/30 hover:shadow-[var(--color-primary-500)]/50 transition-all"
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
            >
              Join Scholar Today
            </motion.button>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-gray-200 dark:border-white/10">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-3xl">🇿🇼</span>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">Scholar</span>
          </div>
          <p className="text-gray-600 dark:text-slate-400">
            Built with ❤️ for Zimbabwean students worldwide
          </p>
          <p className="text-gray-500 dark:text-slate-500 text-sm mt-4">
            © 2026 Scholar. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
