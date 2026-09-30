import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Sprout,
  GraduationCap,
  HeartPulse,
  Briefcase,
  MessageCircleQuestion,
  Bookmark,
  ShieldCheck,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Select from "../components/ui/Select";
import Input from "../components/ui/Input";
import ErrorBanner from "../components/ui/ErrorBanner";
import Badge from "../components/ui/Badge";
import SchemeCard from "../components/schemes/SchemeCard";
import { useAuth } from "../context/AuthContext";
import { useSavedSchemes } from "../context/SavedSchemesContext";
import { useEligibility } from "../hooks/useEligibility";
import { useSchemes } from "../hooks/useSchemes";
import { INDIAN_STATES, OCCUPATIONS, enrichScheme } from "../data/schemes";
import { healthCheck } from "../lib/api";

// Matches the categories the backend actually assigns (see
// backend/app/schemes/scheme_data.py and app/eligibility/eligibility.py).
const CATEGORY_ICONS = {
  Farmer: Sprout,
  Education: GraduationCap,
  Healthcare: HeartPulse,
  "Business/MSME": Briefcase,
};

export default function Dashboard() {
  const { user } = useAuth();
  const { savedIds } = useSavedSchemes();
  const { submit, loading, error, result } = useEligibility();
  const { schemes, loading: schemesLoading, error: schemesError } = useSchemes();
  const [backendOnline, setBackendOnline] = useState(null);

  const [profile, setProfile] = useState({
    age: "",
    annual_income: "",
    occupation: "",
    state: user?.state || "",
    is_student: false,
    is_farmer: false,
    owns_business: false,
  });

  useEffect(() => {
    healthCheck()
      .then(() => setBackendOnline(true))
      .catch(() => setBackendOnline(false));
  }, []);

  const onChange = (e) => {
    const { name, type, checked, value } = e.target;
    setProfile((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    submit({
      age: Number(profile.age),
      annual_income: Number(profile.annual_income),
      occupation: profile.occupation,
      state: profile.state,
      is_student: profile.is_student,
      is_farmer: profile.is_farmer,
      owns_business: profile.owns_business,
    });
  };

  // POST /eligibility returns matching_schemes in the same shape as GET /schemes,
  // so they're enriched the same way as everywhere else in the app.
  const matchedSchemes = (result?.matching_schemes || []).map(enrichScheme);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""}
          </h1>
          <p className="text-sm text-slate-500">
            Check your eligibility and jump into the tools you use most.
          </p>
        </div>
        {backendOnline === false && (
          <Badge color="amber">Backend offline — start the FastAPI server</Badge>
        )}
      </div>

      {/* Quick links */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <QuickLink
          to="/schemes"
          icon={ShieldCheck}
          title="Scheme Search"
          body="Browse all schemes by category."
        />
        <QuickLink
          to="/chat"
          icon={MessageCircleQuestion}
          title="AI Chat"
          body="Ask questions in plain language."
        />
        <QuickLink
          to="/saved"
          icon={Bookmark}
          title="Saved Schemes"
          body={`${savedIds.length} scheme${savedIds.length === 1 ? "" : "s"} saved.`}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Eligibility checker */}
        <Card className="p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold text-slate-900">Eligibility checker</h2>
          <p className="mt-1 text-sm text-slate-500">
            Powered by the backend's <code className="text-xs">/eligibility</code> endpoint.
          </p>
          <form onSubmit={onSubmit} className="mt-4 flex flex-col gap-4">
            {error && <ErrorBanner message={error} />}
            <Input
              label="Age"
              name="age"
              type="number"
              min="0"
              max="120"
              value={profile.age}
              onChange={onChange}
              required
            />
            <Input
              label="Annual income (₹)"
              name="annual_income"
              type="number"
              min="0"
              value={profile.annual_income}
              onChange={onChange}
              required
            />
            <Select
              label="Occupation"
              name="occupation"
              value={profile.occupation}
              onChange={onChange}
              required
            >
              <option value="">Select occupation</option>
              {OCCUPATIONS.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </Select>
            <Select label="State" name="state" value={profile.state} onChange={onChange} required>
              <option value="">Select state</option>
              {INDIAN_STATES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </Select>

            <fieldset className="flex flex-col gap-2 rounded-lg border border-slate-200 p-3">
              <legend className="px-1 text-xs font-medium text-slate-500">
                Also select any that apply
              </legend>
              <Checkbox
                name="is_student"
                checked={profile.is_student}
                onChange={onChange}
                label="I am currently a student"
              />
              <Checkbox
                name="is_farmer"
                checked={profile.is_farmer}
                onChange={onChange}
                label="I am a farmer"
              />
              <Checkbox
                name="owns_business"
                checked={profile.owns_business}
                onChange={onChange}
                label="I own a business / MSME"
              />
            </fieldset>

            <Button type="submit" loading={loading} className="w-full">
              {loading ? "Checking…" : "Check eligibility"}
            </Button>
          </form>

          {result && (
            <div className="mt-5 rounded-lg bg-brand-50 p-4">
              <p className="text-sm font-semibold text-brand-800">You may be eligible for:</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {result.eligible_categories?.length ? (
                  result.eligible_categories.map((c) => (
                    <Badge key={c} color="green">
                      {c}
                    </Badge>
                  ))
                ) : (
                  <span className="text-sm text-brand-700">
                    No specific category matched — try Scheme Search to browse everything.
                  </span>
                )}
              </div>
            </div>
          )}
        </Card>

        {/* Categories + matched schemes */}
        <div className="flex flex-col gap-6 lg:col-span-3">
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-slate-900">Browse by category</h2>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {Object.entries(CATEGORY_ICONS).map(([category, Icon]) => (
                <Link
                  key={category}
                  to={`/schemes?category=${encodeURIComponent(category)}`}
                  className="flex flex-col items-center gap-2 rounded-xl border border-slate-200 p-4 text-center hover:border-brand-300 hover:bg-brand-50"
                >
                  <Icon className="h-6 w-6 text-brand-600" />
                  <span className="text-sm font-medium text-slate-700">{category}</span>
                </Link>
              ))}
            </div>
          </Card>

          <div>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">
                {result ? "Schemes matched to you" : "Featured schemes"}
              </h2>
              <Link to="/schemes" className="text-sm font-semibold text-brand-600 hover:underline">
                View all <ArrowRight className="inline h-3.5 w-3.5" />
              </Link>
            </div>

            {schemesError && !result && <ErrorBanner message={schemesError} offline />}

            <div className="grid gap-4 sm:grid-cols-2">
              {result ? (
                matchedSchemes.length === 0 ? (
                  <Card className="col-span-2 flex items-center gap-2 p-5 text-sm text-slate-500">
                    <RefreshCw className="h-4 w-4" /> No matches yet — try Scheme Search instead.
                  </Card>
                ) : (
                  matchedSchemes.map((scheme) => (
                    <SchemeCard key={scheme.id} scheme={scheme} matchedEligibility />
                  ))
                )
              ) : schemesLoading ? (
                <Card className="col-span-2 p-5 text-sm text-slate-500">Loading schemes…</Card>
              ) : (
                schemes.slice(0, 2).map((scheme) => <SchemeCard key={scheme.id} scheme={scheme} />)
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function QuickLink({ to, icon: Icon, title, body }) {
  return (
    <Link
      to={to}
      className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-colors hover:border-brand-300 hover:bg-brand-50"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
        <Icon className="h-5 w-5" />
      </span>
      <span>
        <span className="block font-semibold text-slate-900">{title}</span>
        <span className="block text-sm text-slate-500">{body}</span>
      </span>
    </Link>
  );
}

function Checkbox({ name, checked, onChange, label }) {
  return (
    <label className="flex items-center gap-2 text-sm text-slate-700">
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
      />
      {label}
    </label>
  );
}
