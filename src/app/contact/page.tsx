"use client";

import { FormEvent, useRef, useState } from "react";
import { ArrowUpRight, AlertCircle } from "lucide-react";

const CMS = (
  process.env.NEXT_PUBLIC_WORDPRESS_URL ?? "https://cms.thesocialout.in"
).replace(/\/$/, "");

const options = [
  "General Enquiry",
  "Artist Booking",
  "Brand Collaboration",
  "Event Partnership",
  "Other",
];

type Fields = {
  name: string;
  email: string;
  phone: string;
  topic: string;
  message: string;
  website: string;
};

type FieldKey = Exclude<keyof Fields, "website">;

type FieldErrors = Partial<Record<FieldKey, string>>;

const initial: Fields = {
  name: "",
  email: "",
  phone: "",
  topic: "General Enquiry",
  message: "",
  website: "",
};

function validateField(key: FieldKey, value: string): string {
  const trimmed = value.trim();

  switch (key) {
    case "name": {
      if (!trimmed) {
        return "Please enter your name.";
      }

      if (trimmed.length < 2) {
        return "Name must be at least 2 characters.";
      }

      if (trimmed.length > 100) {
        return "Name cannot exceed 100 characters.";
      }

      return "";
    }

    case "email": {
      if (!trimmed) {
        return "Please enter your email address.";
      }

      if (trimmed.length > 254) {
        return "Email address is too long.";
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(trimmed)) {
        return "Please enter a valid email address.";
      }

      return "";
    }

    case "phone": {
      // Phone is optional.
      if (!trimmed) return "";

      // Allow an optional leading +, digits,
      // spaces, hyphens and parentheses.
      const phoneRegex = /^\+?[\d\s()-]+$/;

      if (!phoneRegex.test(trimmed)) {
        return "Please enter a valid phone number.";
      }

      // Count only digits.
      const digits = trimmed.replace(/\D/g, "");

      if (digits.length < 7 || digits.length > 15) {
        return "Phone number must contain 7 to 15 digits.";
      }

      return "";
    }

    case "topic": {
      if (!options.includes(trimmed)) {
        return "Please select a valid enquiry type.";
      }

      return "";
    }

    case "message": {
      // Message is optional.
      if (value.length > 3000) {
        return "Message cannot exceed 3000 characters.";
      }

      return "";
    }

    default:
      return "";
  }
}

function validateForm(fields: Fields): FieldErrors {
  const errors: FieldErrors = {};

  const keys: FieldKey[] = ["name", "email", "phone", "topic", "message"];

  keys.forEach((key) => {
    const error = validateField(key, fields[key]);

    if (error) {
      errors[key] = error;
    }
  });

  return errors;
}

export default function ContactUs() {
  const [fields, setFields] = useState<Fields>(initial);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Partial<Record<FieldKey, boolean>>>(
    {},
  );

  const [sending, setSending] = useState(false);

  const [status, setStatus] = useState<{
    ok: boolean;
    message: string;
  } | null>(null);

  const inputRefs = useRef<
    Partial<
      Record<
        FieldKey,
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null
      >
    >
  >({});

  function update(key: keyof Fields, value: string) {
    setFields((current) => ({
      ...current,
      [key]: value,
    }));

    setStatus(null);

    if (key !== "website") {
      const fieldKey = key as FieldKey;

      // Validate as the user types only after
      // the field has been interacted with.
      if (touched[fieldKey] || errors[fieldKey]) {
        const error = validateField(fieldKey, value);

        setErrors((current) => {
          const next = { ...current };

          if (error) {
            next[fieldKey] = error;
          } else {
            delete next[fieldKey];
          }

          return next;
        });
      }
    }
  }

  function handleBlur(key: FieldKey) {
    setTouched((current) => ({
      ...current,
      [key]: true,
    }));

    const error = validateField(key, fields[key]);

    setErrors((current) => {
      const next = { ...current };

      if (error) {
        next[key] = error;
      } else {
        delete next[key];
      }

      return next;
    });
  }

  function focusFirstError(errors: FieldErrors) {
    const order: FieldKey[] = ["name", "email", "phone", "topic", "message"];

    const first = order.find((key) => errors[key]);

    if (first) {
      inputRefs.current[first]?.focus();
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (sending) return;

    // Validate every field before sending.
    const validationErrors = validateForm(fields);

    setErrors(validationErrors);

    setTouched({
      name: true,
      email: true,
      phone: true,
      topic: true,
      message: true,
    });

    if (Object.keys(validationErrors).length > 0) {
      focusFirstError(validationErrors);
      setStatus(null);
      return;
    }

    setSending(true);
    setStatus(null);

    try {
      const response = await fetch(`${CMS}/wp-json/socialout/v1/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "omit",
        body: JSON.stringify({
          ...fields,
          name: fields.name.trim(),
          email: fields.email.trim(),
          phone: fields.phone.trim(),
          message: fields.message.trim(),
        }),
      });

      const body: {
        success?: boolean;
        message?: string;
      } = await response.json();

      if (!response.ok || body.success !== true) {
        throw new Error(
          body.message || "Unable to send your message. Please try again.",
        );
      }

      // Reset form on successful submission.
      setFields(initial);
      setErrors({});
      setTouched({});

      setStatus({
        ok: true,
        message: "Thanks for reaching out! Your message has been received.",
      });
    } catch (error) {
      setStatus({
        ok: false,
        message:
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.",
      });
    } finally {
      setSending(false);
    }
  }

  const fieldClass = `
    w-full rounded-none border-b
    bg-transparent px-0 py-4 font-body text-base
    text-white outline-none transition-colors
    placeholder:text-white/40
  `;

  function fieldStyle(key: FieldKey) {
    return errors[key]
      ? "border-red-500 focus:border-red-400"
      : "border-white/25 focus:border-[#9E1010]";
  }

  function fieldError(key: FieldKey) {
    if (!errors[key]) return null;

    return (
      <span
        id={`contact-${key}-error`}
        role="alert"
        className="mt-2 flex items-start gap-2
          font-body text-xs leading-5 text-red-400"
      >
        <AlertCircle size={14} className="mt-0.5 shrink-0" />
        {errors[key]}
      </span>
    );
  }

  return (
    <section
      id="contact"
      className="bg-black px-5 py-24 text-white
        md:px-10 lg:px-12 lg:py-36"
    >
      <div
        className="mx-auto grid max-w-[1500px]
          gap-14 lg:grid-cols-[0.9fr_1.1fr]
          lg:gap-20"
      >
        {/* LEFT SIDE CONTENT */}
        <div className="flex flex-col">
          <h2
            className="font-heading text-5xl font-bold
      uppercase leading-[0.98] tracking-tight
      sm:text-6xl xl:text-7xl"
          >
            CONTACT <span className="text-[#9E1010]">US.</span>
          </h2>

          <div className="mt-16 space-y-14">
            {/* EMAIL */}
            <div>
              <h3
                className="mb-2 font-heading
          text-2xl font-medium text-[#9E1010]
          md:text-3xl"
              >
                EMAIL
              </h3>

              <a
                href="mailto:contact@thesocialout.in"
                className="font-body text-base
          text-white/70 transition-colors
          hover:text-[#9E1010] md:text-lg"
              >
                contact@thesocialout.in
              </a>
            </div>

            {/* LOCATION */}
            <div>
              <h3
                className="mb-2 font-heading
          text-2xl font-medium text-[#9E1010]
          md:text-3xl"
              >
                LOCATION
              </h3>

              <p
                className="font-body text-base
          text-white/70 md:text-lg"
              >
               Ahmedabad, Mumbai, Indore, Delhi
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE FORM */}
        <form
          onSubmit={submit}
          noValidate
          className="grid grid-cols-1 gap-x-8
            gap-y-6 sm:grid-cols-2"
        >
          {/* NAME */}
          <label className="block font-body text-sm text-white/70">
            Your Name *
            <input
              ref={(node) => {
                inputRefs.current.name = node;
              }}
              required
              minLength={2}
              maxLength={100}
              value={fields.name}
              onChange={(e) => update("name", e.target.value)}
              onBlur={() => handleBlur("name")}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? "contact-name-error" : undefined}
              autoComplete="name"
              placeholder="Your full name"
              className={`${fieldClass} ${fieldStyle("name")}`}
            />
            {fieldError("name")}
          </label>

          {/* EMAIL */}
          <label className="block font-body text-sm text-white/70">
            Email Address *
            <input
              ref={(node) => {
                inputRefs.current.email = node;
              }}
              required
              type="email"
              maxLength={254}
              value={fields.email}
              onChange={(e) => update("email", e.target.value)}
              onBlur={() => handleBlur("email")}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={
                errors.email ? "contact-email-error" : undefined
              }
              autoComplete="email"
              placeholder="you@example.com"
              className={`${fieldClass} ${fieldStyle("email")}`}
            />
            {fieldError("email")}
          </label>

          {/* PHONE */}
          <label className="block font-body text-sm text-white/70">
            Phone Number
            <input
              ref={(node) => {
                inputRefs.current.phone = node;
              }}
              type="tel"
              inputMode="tel"
              maxLength={30}
              value={fields.phone}
              onChange={(e) => update("phone", e.target.value)}
              onBlur={() => handleBlur("phone")}
              aria-invalid={Boolean(errors.phone)}
              aria-describedby={
                errors.phone ? "contact-phone-error" : undefined
              }
              autoComplete="tel"
              placeholder="+91 98765 43210"
              className={`${fieldClass} ${fieldStyle("phone")}`}
            />
            {fieldError("phone")}
          </label>

          {/* INTEREST */}
          <label className="block font-body text-sm text-white/70">
            I&apos;m Interested In *
            <select
              ref={(node) => {
                inputRefs.current.topic = node;
              }}
              required
              value={fields.topic}
              onChange={(e) => update("topic", e.target.value)}
              onBlur={() => handleBlur("topic")}
              aria-invalid={Boolean(errors.topic)}
              aria-describedby={
                errors.topic ? "contact-topic-error" : undefined
              }
              className={`${fieldClass} ${fieldStyle("topic")}`}
            >
              {options.map((option) => (
                <option
                  key={option}
                  value={option}
                  className="bg-black text-white"
                >
                  {option}
                </option>
              ))}
            </select>
            {fieldError("topic")}
          </label>

          {/* OPTIONAL MESSAGE */}
          <label
            className="block font-body text-sm
              text-white/70 sm:col-span-2"
          >
            Tell Us About Your Idea
            <span className="ml-2 text-xs text-white/40">(Optional)</span>
            <textarea
              ref={(node) => {
                inputRefs.current.message = node;
              }}
              maxLength={3000}
              rows={4}
              value={fields.message}
              onChange={(e) => update("message", e.target.value)}
              onBlur={() => handleBlur("message")}
              aria-invalid={Boolean(errors.message)}
              aria-describedby={
                errors.message ? "contact-message-error" : undefined
              }
              placeholder="Tell us a little about your idea..."
              className={`${fieldClass} ${fieldStyle("message")} resize-y`}
            />
            {fieldError("message")}
          </label>

          {/* SPAM PROTECTION HONEYPOT */}
          <div
            aria-hidden="true"
            className="absolute -left-[10000px]
              h-0 overflow-hidden"
          >
            <label>
              Website
              <input
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={fields.website}
                onChange={(e) => update("website", e.target.value)}
              />
            </label>
          </div>

          {/* SUBMIT */}
          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={sending}
              className="inline-flex items-center
                gap-4 border-b border-[#9E1010]
                pb-3 font-heading text-sm font-semibold
                uppercase tracking-widest
                transition-colors hover:text-[#E04545]
                disabled:cursor-not-allowed
                disabled:opacity-50"
            >
              {sending ? "Sending..." : "Send Enquiry"}
              <ArrowUpRight size={20} />
            </button>

            {/* SUCCESS OR SERVER ERROR */}
            {status && (
              <p
                role={status.ok ? "status" : "alert"}
                aria-live="polite"
                className={`mt-5 font-body text-sm ${
                  status.ok ? "text-white/75" : "text-red-400"
                }`}
              >
                {status.message}
              </p>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}
