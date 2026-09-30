import { Link } from "react-router-dom";
import {
  MessageCircleQuestion,
  Search,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  FileText,
} from "lucide-react";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import { SCHEME_META } from "../data/schemes";
import { useAuth } from "../context/AuthContext";

const FEATURES = [
  {
    icon: Search,
    title: "Search schemes",
    body: "Browse Indian government schemes by category — farmer, healthcare, education and business.",
  },
  {
    icon: MessageCircleQuestion,
    title: "Ask in plain language",
    body: "Chat with an AI assistant that answers only from official scheme guideline documents.",
  },
  {
    icon: ShieldCheck,
    title: "Check eligibility",
    body: "Enter a few basic details and instantly see which categories of schemes you may qualify for.",
  },
  {
    icon: FileText,
    title: "Cited sources",
    body: "Every AI answer references the exact document and page it came from — nothing is made up.",
  },
];

// Static preview only (marketing copy) — the live, authoritative list is
// fetched from the backend on Scheme Search / Dashboard via GET /schemes.
const PREVIEW_SCHEMES = Object.entries(SCHEME_META).map(([name, meta]) => ({ name, ...meta }));

export default function Landing() {
  const { isAuthenticated } = useAuth();

  return (
    <div>
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 pb-16 pt-16 sm:px-6 sm:pt-24">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700 ring-1 ring-inset ring-brand-200">
            <Sparkles className="h-3.5 w-3.5" /> AI-powered scheme guidance
          </span>
          <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            Government schemes, explained in plain language
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            CitizenAI helps you find, understand and check your eligibility for Indian
            government welfare schemes — backed by official guideline documents.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button
              as={Link}
              to={isAuthenticated ? "/dashboard" : "/login?mode=register"}
              size="lg"
            >
              {isAuthenticated ? "Go to dashboard" : "Get started free"}{" "}
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button as={Link} to="/schemes" variant="secondary" size="lg">
              Browse schemes
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map(({ icon: Icon, title, body }) => (
            <Card key={title} className="p-5">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-3 font-semibold text-slate-900">{title}</h3>
              <p className="mt-1 text-sm text-slate-600">{body}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Schemes preview */}
      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="text-2xl font-bold text-slate-900">Schemes you can explore</h2>
          <Link to="/schemes" className="text-sm font-semibold text-brand-600 hover:underline">
            View all →
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PREVIEW_SCHEMES.map((scheme) => (
            <Card key={scheme.name} className="p-5">
              <h3 className="font-semibold text-slate-900">{scheme.name}</h3>
              <p className="mt-2 text-sm text-slate-600">{scheme.summary}</p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
