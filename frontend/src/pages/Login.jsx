import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { LandmarkIcon, Mail, Lock, User as UserIcon, Phone } from "lucide-react";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import Button from "../components/ui/Button";
import ErrorBanner from "../components/ui/ErrorBanner";
import { useAuth } from "../context/AuthContext";
import { INDIAN_STATES } from "../data/schemes";

export default function Login() {
  const [searchParams] = useSearchParams();
  const [mode, setMode] = useState(searchParams.get("mode") === "register" ? "register" : "login");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    state: "",
  });

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      if (mode === "register") {
        if (!form.name.trim() || !form.email.trim() || form.password.length < 6) {
          throw new Error("Please fill your name, email, and a password of at least 6 characters.");
        }
        register(form);
      } else {
        if (!form.email.trim() || !form.password) {
          throw new Error("Please enter your email and password.");
        }
        login(form);
      }
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-64px)] max-w-md flex-col justify-center px-4 py-12">
      <div className="mb-6 flex flex-col items-center gap-2 text-center">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-600 text-white">
          <LandmarkIcon className="h-5 w-5" />
        </span>
        <h1 className="text-2xl font-bold text-slate-900">
          {mode === "login" ? "Welcome back" : "Create your account"}
        </h1>
        <p className="text-sm text-slate-500">
          {mode === "login"
            ? "Log in to check your eligibility and manage saved schemes."
            : "Sign up to save schemes and get personalized eligibility checks."}
        </p>
      </div>

      <Card className="p-6">
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          {error && <ErrorBanner message={error} />}

          {mode === "register" && (
            <Input
              label="Full name"
              name="name"
              icon={UserIcon}
              value={form.name}
              onChange={onChange}
              placeholder="Anita Sharma"
              autoComplete="name"
              required
            />
          )}

          <Input
            label="Email"
            name="email"
            type="email"
            icon={Mail}
            value={form.email}
            onChange={onChange}
            placeholder="you@example.com"
            autoComplete="email"
            required
          />

          <Input
            label="Password"
            name="password"
            type="password"
            icon={Lock}
            value={form.password}
            onChange={onChange}
            placeholder="••••••••"
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            hint={mode === "register" ? "At least 6 characters." : undefined}
            required
          />

          {mode === "register" && (
            <>
              <Input
                label="Phone (optional)"
                name="phone"
                icon={Phone}
                value={form.phone}
                onChange={onChange}
                placeholder="98765 43210"
                autoComplete="tel"
              />
              <Select
                label="State (optional)"
                name="state"
                value={form.state}
                onChange={onChange}
              >
                <option value="">Select your state</option>
                {INDIAN_STATES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </Select>
            </>
          )}

          <Button type="submit" loading={submitting} className="mt-2 w-full">
            {mode === "login" ? "Log in" : "Create account"}
          </Button>
        </form>
      </Card>

      <p className="mt-5 text-center text-sm text-slate-500">
        {mode === "login" ? "New to CitizenAI?" : "Already have an account?"}{" "}
        <button
          type="button"
          className="font-semibold text-brand-600 hover:underline"
          onClick={() => {
            setError("");
            setMode((m) => (m === "login" ? "register" : "login"));
          }}
        >
          {mode === "login" ? "Create an account" : "Log in"}
        </button>
      </p>
      <p className="mt-2 text-center text-xs text-slate-400">
        <Link to="/" className="hover:underline">
          ← Back to home
        </Link>
      </p>
    </div>
  );
}
