import { motion } from "framer-motion";

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white">
      {/* Hero Section */}
      <section className="flex items-center justify-center h-screen text-center px-4">
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-5xl font-bold">Welcome to Event Sphere</h1>
          <p className="text-lg">
            A dynamic platform for seamless event management.
          </p>
        </motion.div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 px-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 1 }}
          className="text-center space-y-6"
        >
          <h2 className="text-3xl font-semibold">Our Story</h2>
          <p className="text-lg">
            Inspired by the chaotic traffic during college events, we created
            Event Sphere to simplify and digitize the event experience.
          </p>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-800 px-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-center space-y-6"
        >
          <h2 className="text-3xl font-semibold">What We Offer</h2>
          <ul className="text-lg space-y-4">
            <li>✔️ Real-time chat between organizers and participants</li>
            <li>✔️ Dynamic user dashboards with progress tracking</li>
            <li>✔️ Editable event creation forms</li>
            <li>✔️ Beautiful animated home page with color gradients</li>
            <li>✔️ A mail system to easily connect users and organizers</li>
          </ul>
        </motion.div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-6 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 1 }}
        >
          <h2 className="text-3xl font-semibold">Get in Touch</h2>
          <p className="text-lg">
            Have questions? Reach out via email and let's connect!
          </p>
          <a
            href="mailto:youremail@example.com"
            className="mt-4 inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-8 rounded-full hover:scale-105 transition duration-300"
          >
            Send an Email
          </a>
        </motion.div>
      </section>
    </div>
  );
}
