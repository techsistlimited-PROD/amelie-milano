import { FormEvent, useEffect, useId, useState } from "react";

const SUBSCRIBER_KEY = "amelie-milano-newsletter-email";

interface NewsletterFormProps {
  className?: string;
  inputClassName?: string;
  buttonClassName?: string;
  placeholder?: string;
}

const NewsletterForm = ({ className = "flex gap-2 md:gap-3", inputClassName = "flex-1 px-4 py-3 rounded-lg bg-white border border-stone-200 text-sm focus:outline-none focus:border-teal", buttonClassName = "btn-primary text-sm md:text-base", placeholder = "Enter your email" }: NewsletterFormProps) => {
  const fieldId = `newsletter-email-${useId().replace(/:/g, "")}`;
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const savedEmail = window.localStorage.getItem(SUBSCRIBER_KEY);
    if (savedEmail) {
      setEmail(savedEmail);
      setStatus("success");
      setMessage("You are already part of the Amelie Milano Club.");
    }
  }, []);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }
    setStatus("loading");
    setMessage("");
    try {
      const response = await fetch("/api/newsletter/subscribe", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: normalizedEmail }) });
      const result = await response.json() as { message?: string };
      if (!response.ok) throw new Error(result.message || "We could not complete your subscription.");
      window.localStorage.setItem(SUBSCRIBER_KEY, normalizedEmail);
      setStatus("success");
      setMessage(result.message || "Welcome to the Amelie Milano Club.");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "We could not complete your subscription.");
    }
  };

  return <div className="w-full"><form className={className} onSubmit={submit} noValidate><label htmlFor={fieldId} className="sr-only">Email address</label><input id={fieldId} type="email" value={email} onChange={(event) => { setEmail(event.target.value); if (status !== "idle") setStatus("idle"); }} placeholder={placeholder} className={inputClassName} aria-invalid={status === "error"} aria-describedby="newsletter-message" /><button type="submit" disabled={status === "loading"} className={`${buttonClassName} disabled:cursor-wait disabled:opacity-70`}>{status === "loading" ? "Joining..." : "Subscribe"}</button></form>{message && <p id="newsletter-message" role={status === "error" ? "alert" : "status"} className={`mt-3 text-left text-xs ${status === "error" ? "text-red-700" : "text-teal"}`}>{message}</p>}</div>;
};

export default NewsletterForm;
