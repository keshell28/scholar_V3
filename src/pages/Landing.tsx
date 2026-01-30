import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Users, MessageCircle, GraduationCap, MapPin, Award, Heart, ArrowRight, Sparkles } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();

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
    <div className="min-h-screen text-white overflow-x-hidden">
      {/* Hero Section with Background Image */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2940&auto=format&fit=crop"
            alt="Students studying together"
            className="w-full h-full object-cover"
          />
          {/* Dark gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/70 to-black/60"></div>
          {/* Zimbabwe flag color accents */}
          <div className="absolute inset-0 bg-gradient-to-tr from-green-900/30 via-transparent to-yellow-900/20"></div>
        </div>

        {/* Animated Elements */}
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-green-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 text-center">
          {/* Flag Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 mb-8 shadow-2xl"
          >
            <span className="text-3xl">🇿🇼</span>
            <Sparkles className="w-5 h-5 text-yellow-400" />
            <span className="text-base font-semibold">For Zimbabwean Students Worldwide</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-extrabold mb-8 leading-tight tracking-tight"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <span className="block mb-2">Your Global</span>
            <span className="block bg-gradient-to-r from-green-400 via-yellow-400 to-red-400 bg-clip-text text-transparent drop-shadow-2xl">
              Student Network
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="text-xl sm:text-2xl md:text-3xl text-gray-200 mb-12 max-w-4xl mx-auto leading-relaxed font-light"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            Connect with fellow Zimbabwean students, find scholarships, share culture, 
            and navigate student life abroad together.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-5 justify-center items-center mb-16"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            <motion.button
              onClick={() => navigate('/login')}
              className="group relative px-10 py-5 bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 text-white rounded-full font-bold text-lg shadow-2xl overflow-hidden"
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10 flex items-center gap-2">
                Get Started Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-green-600 via-yellow-600 to-red-600"
                initial={{ x: '100%' }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>
            
            <motion.button
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-10 py-5 bg-white/10 backdrop-blur-xl border-2 border-white/30 rounded-full font-semibold text-lg text-white hover:bg-white/20 hover:border-white/50 transition-all shadow-xl"
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
            >
              Explore Features
            </motion.button>
          </motion.div>

          {/* Stats Pills */}
          <motion.div
            className="flex flex-wrap justify-center gap-4 mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                className="px-6 py-3 bg-white/10 backdrop-blur-xl rounded-full border border-white/20"
              >
                <div className="text-2xl font-bold text-yellow-400">{stat.number}</div>
                <div className="text-sm text-gray-300">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2 cursor-pointer"
            animate={{ y: [0, 15, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <div className="w-8 h-12 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
              <motion.div
                className="w-2 h-2 bg-yellow-400 rounded-full"
                animate={{ y: [0, 20, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 px-6 bg-gradient-to-b from-gray-950 to-black">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-green-400 via-yellow-400 to-red-400 bg-clip-text text-transparent">
              Everything You Need
            </h2>
            <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto">
              A complete platform designed specifically for Zimbabwean students studying abroad
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: index * 0.1 }}
                whileHover={{ y: -12, scale: 1.03 }}
                className="group relative p-8 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl rounded-3xl border border-white/10 hover:border-white/30 shadow-xl hover:shadow-2xl transition-all cursor-pointer overflow-hidden"
              >
                {/* Gradient Background on Hover */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity`}
                />

                <motion.div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 shadow-lg`}
                  whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <feature.icon className="w-8 h-8 text-white" />
                </motion.div>

                <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-yellow-300 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

{/* Testimonials Section */}
      <section className="py-32 px-6 bg-gradient-to-b from-black via-gray-950 to-black">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-7xl font-extrabold mb-6 text-white">
              Loved by <span className="bg-gradient-to-r from-green-400 to-yellow-400 bg-clip-text text-transparent">Students</span>
            </h2>
            <p className="text-xl md:text-2xl text-gray-400">
              Hear from Zimbabwean students around the world
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: index * 0.15 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="relative p-8 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl rounded-3xl border border-white/10 hover:border-green-500/50 shadow-xl hover:shadow-2xl transition-all"
              >
                {/* Decorative element */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-500/10 to-transparent rounded-full blur-2xl" />
                
                <div className="relative">
                  <div className="text-5xl mb-6">{testimonial.avatar}</div>
                  <p className="text-lg mb-6 text-gray-300 italic leading-relaxed">
                    "{testimonial.text}"
                  </p>
                  <div className="border-t border-white/10 pt-4">
                    <div className="font-bold text-white text-lg">{testimonial.name}</div>
                    <div className="text-sm text-gray-400 mt-1">{testimonial.university}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-32 px-6 bg-gradient-to-b from-black to-gray-950">
        <motion.div
          className="max-w-5xl mx-auto text-center relative"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {/* Animated background */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-green-500/20 via-yellow-500/20 to-red-500/20 blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{ duration: 15, repeat: Infinity }}
          />

          <div className="relative z-10 p-16 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl rounded-[3rem] border border-white/20 shadow-2xl">
            <Sparkles className="w-12 h-12 text-yellow-400 mx-auto mb-6" />
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-8 text-white leading-tight">
              Ready to <span className="bg-gradient-to-r from-green-400 via-yellow-400 to-red-400 bg-clip-text text-transparent">Connect?</span>
            </h2>
            <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              Join thousands of Zimbabwean students building their global community
            </p>
            <motion.button
              onClick={() => navigate('/login')}
              className="group relative px-12 py-6 bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 text-white rounded-full font-bold text-xl shadow-2xl overflow-hidden"
              whileHover={{ scale: 1.08, y: -4 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10 flex items-center gap-3">
                Join Scholar Today
                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-green-600 via-yellow-600 to-red-600"
                initial={{ x: '100%' }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 border-t border-white/10 bg-black">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="text-4xl">🇿🇼</span>
            <span className="text-3xl font-bold bg-gradient-to-r from-green-400 via-yellow-400 to-red-400 bg-clip-text text-transparent">
              Scholar
            </span>
          </div>
          <p className="text-gray-400 text-lg mb-2">
            Built with ❤️ for Zimbabwean students worldwide
          </p>
          <p className="text-gray-600 text-sm">
            © 2026 Scholar. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
