const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white">
      {/* Hero Section */}
      <section className="flex items-center justify-center h-60 text-center px-4">
        <div className="space-y-6 animate-fade-in-up delay-100">
          <h1 className="text-5xl font-bold transition-opacity duration-1000">
            Welcome to Event Sphere
          </h1>
          <p className="text-lg transition-opacity duration-1000 delay-300">
            A dynamic platform for seamless event management.
          </p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-3 px-6 text-center">
        <div className="space-y-6 animate-fade-in-up delay-200">
          <h2 className="text-3xl font-semibold">Our Story</h2>
          <p className="text-lg">
            Inspired by the chaotic traffic during college events, we created
            Event Sphere to simplify and digitize the event experience.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-800 px-6 text-center">
        <div className="space-y-6 animate-fade-in-up delay-300">
          <h2 className="text-3xl font-semibold">What We Offer</h2>
          <ul className="text-lg space-y-4">
            <li>✔️ Real-time event updates in the dashboard</li>
            <li>✔️ Dynamic user dashboards with progress tracking</li>
            <li>✔️ Editable event creation forms</li>
            <li>✔️ Beautiful animated home page with color gradients</li>
            <li>✔️ A mail system to easily connect users and organizers</li>
          </ul>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-6 text-center">
        <div className="animate-fade-in-up delay-500">
          <h2 className="text-3xl font-semibold">Get in Touch</h2>
          <p className="text-lg">
            Have questions? Reach out via email and let's connect!
          </p>
          <a
            href="mailto:eventsphere321@gmail.com"
            className="mt-4 inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-8 rounded-full hover:scale-105 transition duration-300"
          >
            Send an Email
          </a>
          <a
            href="https://github.com/Sadab-Ansari/Event_Sphere_Project"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block bg-gray-800 text-white py-3 px-8 rounded-full hover:scale-105 transition duration-300 ml-4"
          >
            View on GitHub
          </a>
        </div>
      </section>
    </div>
  );
};

export default About;
