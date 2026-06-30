import React, { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    message: ''
  });

  React.useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.05,
    };

    const handleIntersection = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, observerOptions);
    const elementsToReveal = document.querySelectorAll('.reveal-up, .reveal-scale');
    elementsToReveal.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Pre-fills a standard email native trigger to your specific support email
    const emailTo = "sarthak.indianhero07@gmail.com";
    const mailtoUrl = `mailto:${emailTo}?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(`Hi, my name is ${formData.name}.\n\nIssue Details:\n${formData.message}`)}`;
    
    window.location.href = mailtoUrl;
  };

  return (
    <div className="min-h-screen bg-app-bg text-app-text-primary font-sans selection:bg-app-accent-glow selection:text-app-accent flex flex-col justify-between transition-colors">
      
      <main className="max-w-xl w-full mx-auto px-6 pt-16 pb-12 grow flex flex-col justify-center">
        <div className="reveal-up text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-linear-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
            Get In Touch
          </h1>
          <p className="text-sm text-app-text-secondary mt-2">
            Facing an issue? Drop us a line and our technical team will sort it out.
          </p>
        </div>

        {/* Sleek Contact Form Box with Revolving Border */}
        <div className="reveal-scale revolving-border-box shadow-2xl">
          <div className="revolving-border-content bg-linear-to-b from-app-card-from to-app-card-to p-6 sm:p-8 relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-px bg-linear-to-r from-transparent via-blue-500/50 to-transparent z-10" />
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-app-text-secondary mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full bg-app-card-from border border-app-card-border focus:border-app-accent rounded-lg px-4 py-3 text-sm text-app-text-primary placeholder-gray-600 outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-app-text-secondary mb-2">
                  Subject / Issue Title
                </label>
                <input
                  type="text"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="e.g., Receipt payment glitch"
                  className="w-full bg-app-card-from border border-app-card-border focus:border-app-accent rounded-lg px-4 py-3 text-sm text-app-text-primary placeholder-gray-600 outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-app-text-secondary mb-2">
                  Describe the Issue
                </label>
                <textarea
                  name="message"
                  required
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Describe your issue with as much context as possible..."
                  className="w-full bg-app-card-from border border-app-card-border focus:border-app-accent rounded-lg px-4 py-3 text-sm text-app-text-primary placeholder-gray-600 outline-none transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 mt-2 bg-app-accent hover:bg-app-accent-hover text-white font-medium text-sm rounded-lg transition-all shadow-md shadow-blue-500/10 cursor-pointer"
              >
                Send Mail
              </button>
            </form>
          </div>
        </div>

        {/* Direct Email Note */}
        {/* <p className="text-center text-xs text-app-text-muted mt-6">
          Direct support line: <span className="text-app-accent/80 font-mono">sarthak.indianhero07@gmail.com</span>
        </p> */}
      </main>
    </div>
  );
};

export default Contact;