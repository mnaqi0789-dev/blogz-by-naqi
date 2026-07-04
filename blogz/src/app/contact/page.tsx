"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Loader2 } from "lucide-react";
import { z } from "zod";
import { useMessageMutations } from "@/hooks/useMessages";

const contactSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(50),
  lastName: z.string().trim().min(1, "Last name is required").max(50),
  email: z.string().trim().email("Enter a valid email").max(255),
  phone: z
    .string()
    .trim()
    .min(6, "Enter a valid phone number")
    .max(20)
    .regex(/^[+\d\s()-]+$/, "Only digits and + ( ) - allowed"),
  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters")
    .max(1000, "Message must be under 1000 characters"),
});

type FormState = z.infer<typeof contactSchema>;
type Errors = Partial<Record<keyof FormState, string>>;

const initialForm: FormState = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  message: "",
};

export default function ContactPage() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sent">("idle");
  const { submitMessage, isSubmittingMessage } = useMessageMutations();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormState]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = contactSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Errors = {};
      result.error.issues.forEach((issue) => {
        const key = issue.path[0] as keyof FormState;
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    try {
      await submitMessage({
        name: `${form.firstName} ${form.lastName}`.trim(),
        email: form.email,
        subject: `Inquiry from ${form.firstName}`,
        message: `Email: ${form.email}\nPhone: ${form.phone}\n\n${form.message}`,
      });
      setStatus("sent");
      setForm(initialForm);
      setTimeout(() => setStatus("idle"), 3500);
    } catch {
      setStatus("idle");
    }
  };

  const inputBase =
    "w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-colors focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15";

  const errorClass = (field: keyof FormState) =>
    errors[field] ? "border-red-400" : "border-slate-200";

  return (
    <section className="mx-auto grid min-h-[calc(100vh-8rem)] max-w-6xl grid-cols-1 items-start gap-14 px-6 py-16 lg:grid-cols-2 lg:py-24">
      <div className="flex flex-col">
        <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-500">
          <Mail className="h-3 w-3 text-blue-600" />
          Contact
        </span>

        <h1 className="mt-6 font-serif text-4xl leading-[1.1] tracking-tight text-slate-900 sm:text-5xl">
          How can we
          <br />
          help you <span className="text-blue-600">today?</span>
        </h1>

        <p className="mt-5 max-w-md text-sm leading-relaxed text-slate-500">
          Questions, pitches, or just want to say hi? Our tiny editorial team
          reads every message and usually replies within a day.
        </p>

        <div className="mt-10 space-y-5">
          <InfoRow icon={<Mail className="h-4 w-4 text-blue-600" />} label="Email" value="hello@blogz.com" />
          <InfoRow icon={<Phone className="h-4 w-4 text-blue-600" />} label="Phone" value="+1 (800) 123-4567" />
          <InfoRow
            icon={<MapPin className="h-4 w-4 text-blue-600" />}
            label="Location"
            value="Silicon Valley, CA 94043 United States"
          />
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="rounded-2xl border border-slate-200/80 bg-white/70 p-6 shadow-[0_8px_30px_-12px_rgba(30,58,138,0.15)] backdrop-blur-xl sm:p-8"
      >
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="First name" error={errors.firstName} required>
            <input
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              placeholder="Billy"
              maxLength={50}
              className={`${inputBase} ${errorClass("firstName")}`}
            />
          </Field>
          <Field label="Last name" error={errors.lastName} required>
            <input
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              placeholder="Jhons"
              maxLength={50}
              className={`${inputBase} ${errorClass("lastName")}`}
            />
          </Field>
        </div>

        <div className="mt-5">
          <Field label="Work email" error={errors.email} required>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter email"
              maxLength={255}
              className={`${inputBase} ${errorClass("email")}`}
            />
          </Field>
        </div>

        <div className="mt-5">
          <Field label="Phone number" error={errors.phone} required>
            <input
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              placeholder="+1 (555) 000-0000"
              maxLength={20}
              className={`${inputBase} ${errorClass("phone")}`}
            />
          </Field>
        </div>

        <div className="mt-5">
          <Field label="Message" error={errors.message} required>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Enter a question, feedback, or suggestion..."
              rows={5}
              maxLength={1000}
              className={`${inputBase} resize-none ${errorClass("message")}`}
            />
            <div className="mt-1 text-right text-xs text-slate-400">
              {form.message.length}/1000
            </div>
          </Field>
        </div>

        <div className="mt-6 flex items-center justify-between gap-4">
          <button
            type="submit"
            disabled={isSubmittingMessage}
            className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmittingMessage && <Loader2 className="h-4 w-4 animate-spin" />}
            {isSubmittingMessage ? "Sending..." : "Submit"}
          </button>

          {status === "sent" && (
            <span className="text-sm font-medium text-emerald-600">
              Thanks — we will be in touch shortly.
            </span>
          )}
        </div>
      </form>
    </section>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 ring-1 ring-blue-100">
        {icon}
      </span>
      <div className="min-w-0">
        <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
          {label}
        </div>
        <div className="mt-0.5 text-sm font-semibold text-slate-900">{value}</div>
      </div>
    </div>
  );
}

function Field({
  label,
  error,
  required,
  children,
}: {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
        {required && <span className="text-blue-600">*</span>}
      </span>
      {children}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </label>
  );
}