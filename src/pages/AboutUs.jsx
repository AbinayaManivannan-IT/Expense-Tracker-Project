
import React from 'react';
import { Link } from 'react-router-dom';
import './AboutUs.css'; // your custom styling


const AboutUs = () => {
  return (
    <div className="about-us">
      {/* Navbar */}
      <div className="header">
      <div className="container">
      <nav className="nav">
      <a href="#" className="logo">Expense<span>Tracker</span></a>
        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#pricing">Pricing</a>
          <a href="#testimonials">Testimonials</a>
        </div>
        <div className="nav-links auth-buttons">
          <Link to="/login" className="nav-button btn-outline">Login</Link>
          <Link to="/signup" className="nav-button btn">Sign Up</Link>
        </div>
      </nav>
      </div>
      </div>

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <h1>Take Control of Your Finances</h1>
          <p>ExpenseTracker helps you track expenses, set budgets, and achieve your financial goals with our intuitive expense tracking platform.</p>
          <Link to="/signup" className="btn">Get Started for Free</Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="features" id="features">
        <div className="container">
          <div className="section-title">
            <h2>Powerful Features</h2>
            <p>Everything you need to manage your expenses effectively</p>
          </div>

          <div className="features-grid">
            {[
              { icon: '📊', title: 'Expense Logging', desc: 'Quickly log expenses on the go with our simple interface. Categorize transactions for better organization.' },
              { icon: '🚦', title: 'Daily Spending Limit', desc: 'Our unique daily limit feature helps prevent overspending by giving you real-time feedback on your spending pace.' },
              { icon: '⚙️', title: 'Budget Customization', desc: 'Create personalized budgets for different categories that adapt to your spending patterns and financial goals.' },
              { icon: '🔔', title: 'Spending Alerts', desc: 'Receive notifications when you\'re approaching budget limits or when unusual spending patterns are detected.' },
              { icon: '📈', title: 'Expense Trends', desc: 'Visualize your spending over time to identify patterns and opportunities for savings.' },
              { icon: '📊', title: 'Visual Reports', desc: 'Beautiful, interactive charts and reports that make understanding your finances effortless.' }
            ].map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works" id="how-it-works">
        <div className="container">
          <div className="section-title">
            <h2>How ExpenseTracker Works</h2>
            <p>Get started in just a few simple steps</p>
          </div>

          <div className="steps">
            {['Sign Up', 'Connect Accounts', 'Set Budgets', 'Track & Save'].map((step, index) => (
              <div key={index} className="step">
                <div className="step-number">{index + 1}</div>
                <h3>{step}</h3>
                <p>
                  {index === 0 && 'Create your free account in less than a minute'}
                  {index === 1 && 'Link your bank accounts or enter expenses manually'}
                  {index === 2 && 'Create customized budgets for your spending categories'}
                  {index === 3 && 'Monitor your spending and watch your savings grow'}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="pricing" id="pricing">
        <div className="container">
          <div className="section-title">
            <h2>Simple, Transparent Pricing</h2>
            <p>Choose the plan that works best for you</p>
          </div>

          <div className="pricing-cards">
            {[
              {
                name: 'Basic',
                price: '₹0/month',
                features: ['Expense tracking', '3 budget categories', 'Basic reports', 'Email support'],
                popular: false,
              },
              {
                name: 'Pro',
                price: '₹59/month',
                features: ['Everything in Basic', 'Unlimited budgets', 'Advanced reports', 'Spending alerts', 'Priority support'],
                popular: true,
              },
              {
                name: 'Business',
                price: '₹129/month',
                features: ['Everything in Pro', 'Team access', 'Expense approvals', 'Custom categories', 'Dedicated account manager'],
                popular: false,
              }
            ].map((plan, index) => (
              <div key={index} className={`pricing-card ${plan.popular ? 'popular' : ''}`}>
                {plan.popular && <div className="popular-tag">Most Popular</div>}
                <h3>{plan.name}</h3>
                <div className="price">{plan.price}</div>
                <ul className="pricing-features">
                  {plan.features.map((feature, idx) => (
                    <li key={idx}>{feature}</li>
                  ))}
                </ul>
                <Link to="/signup" className={plan.popular ? "btn" : "btn-outline"}>Get Started</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials" id="testimonials">
        <div className="container">
          <div className="section-title">
            <h2>What Our Users Say</h2>
            <p>Don't just take our word for it</p>
          </div>

          <div className="testimonial-grid">
            {[
              { text: '"ExpenseTracker has completely transformed how I manage my finances. The daily spending limit feature alone has saved me hundreds each month!"', author: 'Sarah J.', role: 'Freelance Designer', img: 'https://randomuser.me/api/portraits/women/32.jpg' },
              { text: '"As a small business owner, I need to track every dollar. ExpenseTracker gives me the insights I need to make better financial decisions."', author: 'Michael T.', role: 'Small Business Owner', img: 'https://randomuser.me/api/portraits/men/54.jpg' },
              { text: '"I\'ve tried many expense trackers, but ExpenseTracker is the only one that actually helped me stick to my budget consistently."', author: 'Priya K.', role: 'Marketing Manager', img: 'https://randomuser.me/api/portraits/women/68.jpg' }
            ].map((testimonial, index) => (
              <div key={index} className="testimonial">
                <p className="testimonial-text">{testimonial.text}</p>
                <div className="testimonial-author">
                  <img src={testimonial.img} alt={testimonial.author} />
                  <div className="author-info">
                    <h4>{testimonial.author}</h4>
                    <p>{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="cta">
        <div className="container">
          <h2>Ready to Take Control of Your Finances?</h2>
          <p>Join thousands of users who are saving more and stressing less about money with ExpenseTracker.</p>
          <Link to="/signup" className="btn" id="cta-signup">Sign Up for Free</Link>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="container">
          <div className="footer-content">
            <div className="footer-column">
              <h3>ExpenseTracker</h3>
              <p>The smart way to track expenses and achieve your financial goals.</p>
              <div className="social-links">
                <a href="#">📱</a>
                <a href="#">💻</a>
                <a href="#">📧</a>
                <a href="#">🔗</a>
                <a href="#">📘</a>
              </div>
            </div>

            <div className="footer-column">
              <h3>Product</h3>
              <ul className="footer-links">
                <li><a href="#features">Features</a></li>
                <li><a href="#pricing">Pricing</a></li>
                <li><a href="#">Mobile App</a></li>
                <li><a href="#">Integrations</a></li>
              </ul>
            </div>

            <div className="footer-column">
              <h3>Resources</h3>
              <ul className="footer-links">
                <li><a href="#">Blog</a></li>
                <li><a href="#">Guides</a></li>
                <li><a href="#">Help Center</a></li>
                <li><a href="#">API Docs</a></li>
              </ul>
            </div>

            <div className="footer-column">
              <h3>Company</h3>
              <ul className="footer-links">
                <li><a href="#">About Us</a></li>
                <li><a href="#">Careers</a></li>
                <li><a href="#">Privacy</a></li>
                <li><a href="#">Terms</a></li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <p>&copy; 2023 ExpenseTracker. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AboutUs;

