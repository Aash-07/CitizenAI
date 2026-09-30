import { useState } from "react";
import { User as UserIcon, Mail, Phone, MapPin, Save, CheckCircle2 } from "lucide-react";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import Button from "../components/ui/Button";
import { useAuth } from "../context/AuthContext";
import { useSavedSchemes } from "../context/SavedSchemesContext";
import { INDIAN_STATES } from "../data/schemes";

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const { savedIds } = useSavedSchemes();
  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    state: user?.state || "",
  });
  const [saved, setSaved] = useState(false);

  const onChange = (e) => {
    setSaved(false);
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    updateProfile(form);
    setSaved(true);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold text-slate-900">Your profile</h1>
      <p className="mt-1 text-sm text-slate-500">
        Stored on this device. Used to pre-fill the eligibility checker.
      </p>

      <div className="mt-6 grid gap-6 sm:grid-cols-3">
        <Card className="flex flex-col items-center gap-3 p-6 text-center sm:col-span-1">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-100 text-2xl font-bold text-brand-700">
            {(user?.name || "?").charAt(0).toUpperCase()}
          </span>
          <div>
            <p className="font-semibold text-slate-900">{user?.name}</p>
            <p className="text-sm text-slate-500">{user?.email}</p>
          </div>
          <div className="mt-2 w-full rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-600">
            {savedIds.length} scheme{savedIds.length === 1 ? "" : "s"} saved
          </div>
        </Card>

        <Card className="p-6 sm:col-span-2">
          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <Input
              label="Full name"
              name="name"
              icon={UserIcon}
              value={form.name}
              onChange={onChange}
              required
            />
            <Input label="Email" icon={Mail} value={user?.email || ""} disabled readOnly hint="Email cannot be changed." />
            <Input
              label="Phone"
              name="phone"
              icon={Phone}
              value={form.phone}
              onChange={onChange}
              placeholder="98765 43210"
            />
            <Select label="State" name="state" value={form.state} onChange={onChange}>
              <option value="">Select your state</option>
              {INDIAN_STATES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </Select>
            <div className="mt-2 flex items-center gap-3">
              <Button type="submit">
                <Save className="h-4 w-4" /> Save changes
              </Button>
              {saved && (
                <span className="flex items-center gap-1 text-sm text-emerald-600">
                  <CheckCircle2 className="h-4 w-4" /> Saved
                </span>
              )}
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
