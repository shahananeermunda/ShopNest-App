import { useState } from "react";
import "./contact.css";

// Edit these details to match your real store information.
const contactInfo = [
  {
    icon: "✉",
    title: "Email Us",
    lines: ["support@shopnest.com"],
    note: "We reply within 24 hours",
  },
  {
    icon: "☎",
    title: "Call Us",
    lines: ["+91 98765 43210"],
    note: "Mon – Sat, 10:00 AM – 7:00 PM",
  },
  {
    icon: "⌖",
    title: "Visit Us",
    lines: ["12 Market Street", "Kochi, Kerala 682001"],
    note: "Open Mon – Sat",
  },
];

const subjects = [
  "Order enquiry",
  "Product question",
  "Returns & refunds",
  "Feedback",
  "Other",
];

const emptyForm = { name: "", email: "", subject: "", message: "" };

function validate(values) {
  const errors = {};

  if (!values.name.trim()) {
    errors.name = "Please enter your name.";
  }

  if (!values.email.trim()) {
    errors.email = "Please enter your email address.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = "Please enter a valid email address.";
  }

  if (!values.subject) {
    errors.subject = "Please choose a subject.";
  }

  if (values.message.trim().length < 10) {
    errors.message = "Your message should be at least 10 characters.";
  }

  return errors;
}

function Contact() {
  const [values, setValues] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));

    // Clear the error for a field as soon as the user edits it.
    if (errors[name]) {
      setErrors((current) => ({ ...current, [name]: undefined }));
    }
    if (submitted) setSubmitted(false);
  }

  function handleSubmit(event) {
    event.preventDefault();

    const nextErrors = validate(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    // TODO: send `values` to your backend / email service here.
    setSubmitted(true);
    setValues(emptyForm);
  }

  return (
    <main className="contact-page">
      <div className="contact-container">
        {/* Page heading */}
        <header className="contact-header">
          <p className="contact-eyebrow">GET IN TOUCH</p>
          <h1>Contact Us</h1>
          <p>
            Questions about an order or a product? Send us a message and our
            team will get back to you soon.
          </p>
        </header>

        <div className="contact-layout">
          {/* Contact details */}
          <aside className="contact-info" aria-label="Contact details">
            {contactInfo.map((item) => (
              <article className="contact-card" key={item.title}>
                <span className="contact-card-icon" aria-hidden="true">
                  {item.icon}
                </span>
                <div>
                  <h2>{item.title}</h2>
                  {item.lines.map((line) => (
                    <p className="contact-card-line" key={line}>
                      {line}
                    </p>
                  ))}
                  <p className="contact-card-note">{item.note}</p>
                </div>
              </article>
            ))}
          </aside>

          {/* Contact form */}
          <section className="contact-form-wrap">
            <h2>Send us a message</h2>
            <p className="contact-form-intro">
              Fill in the form below and we'll respond as soon as we can.
            </p>

            {submitted && (
              <div className="contact-success" role="status">
                <strong>Thank you!</strong> Your message has been sent. We'll
                be in touch shortly.
              </div>
            )}

            <form className="contact-form" onSubmit={handleSubmit} noValidate>
              <div className="contact-row">
                <div className="contact-field">
                  <label htmlFor="contact-name">Full name</label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    placeholder="Your name"
                    value={values.name}
                    onChange={handleChange}
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? "contact-name-error" : undefined}
                  />
                  {errors.name && (
                    <span className="contact-error" id="contact-name-error">
                      {errors.name}
                    </span>
                  )}
                </div>

                <div className="contact-field">
                  <label htmlFor="contact-email">Email address</label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={values.email}
                    onChange={handleChange}
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? "contact-email-error" : undefined}
                  />
                  {errors.email && (
                    <span className="contact-error" id="contact-email-error">
                      {errors.email}
                    </span>
                  )}
                </div>
              </div>

              <div className="contact-field">
                <label htmlFor="contact-subject">Subject</label>
                <select
                  id="contact-subject"
                  name="subject"
                  value={values.subject}
                  onChange={handleChange}
                  aria-invalid={Boolean(errors.subject)}
                  aria-describedby={errors.subject ? "contact-subject-error" : undefined}
                >
                  <option value="">Select a subject</option>
                  {subjects.map((subject) => (
                    <option key={subject} value={subject}>
                      {subject}
                    </option>
                  ))}
                </select>
                {errors.subject && (
                  <span className="contact-error" id="contact-subject-error">
                    {errors.subject}
                  </span>
                )}
              </div>

              <div className="contact-field">
                <label htmlFor="contact-message">Message</label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows="6"
                  placeholder="How can we help you?"
                  value={values.message}
                  onChange={handleChange}
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby={errors.message ? "contact-message-error" : undefined}
                />
                {errors.message && (
                  <span className="contact-error" id="contact-message-error">
                    {errors.message}
                  </span>
                )}
              </div>

              <button type="submit" className="contact-submit">
                Send Message
              </button>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}

export default Contact;
