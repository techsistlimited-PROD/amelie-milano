import { FormEvent, useEffect, useState } from "react";
import { ExternalLink } from "lucide-react";
import { Link, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { getAccessToken, signInWithEmail, signOut } from "@/lib/auth";
import {
  CmsResource,
  createAdminRecord,
  deleteAdminRecord,
  listAdminRecords,
  updateAdminRecord,
  verifyCmsAdmin,
} from "@/lib/cms";
import { sanitizeDraftForCategory } from "@/lib/productFields";
import {
  categoryShopPath,
  fieldsForResource,
  groupRecordsByCategory,
  listSubtitleFor,
  listTitleFor,
  preparePayload,
  PRODUCT_CATEGORIES,
  resourceMeta,
  rowToDraft,
  sectionKeyOptions,
  validateDraft,
} from "./cmsConfig";
import ImageUploadField from "@/components/admin/ImageUploadField";

const resources: CmsResource[] = ["products", "collections", "editorials", "sections", "pages", "faq"];

const AdminLogin = ({ onSuccess }: { onSuccess: () => void }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    try {
      await signInWithEmail(email, password);
      const token = await getAccessToken();
      if (!token || !(await verifyCmsAdmin(token))) {
        await signOut();
        setError("This account does not have CMS admin access.");
        return;
      }
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to sign in.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F0E9E2] px-4">
      <form onSubmit={submit} className="w-full max-w-md space-y-4 bg-white p-8 shadow-lg ring-1 ring-stone-200">
        <p className="text-[10px] uppercase tracking-[0.24em] text-teal">Amelie Milano</p>
        <h1 className="font-serif text-4xl">CMS Admin</h1>
        <p className="text-sm text-stone-600">Sign in with your admin email to manage website content.</p>
        <input className="field w-full" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input className="field w-full" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button type="submit" className="btn-primary w-full">Sign in</button>
        <Link to="/" className="block text-center text-xs uppercase tracking-[0.14em] text-teal">← Back to website</Link>
      </form>
    </div>
  );
};

const ResourceEditor = ({ resource }: { resource: CmsResource }) => {
  const meta = resourceMeta[resource];
  const [records, setRecords] = useState<Record<string, unknown>[]>([]);
  const [draft, setDraft] = useState<Record<string, unknown>>({ isVisible: true });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const sectionKey = resource === "sections" ? String(draft.sectionKey ?? "") : "";
  const productSlug = resource === "products" ? String(draft.slug ?? "") : undefined;
  const productCategory = resource === "products" ? String(draft.category ?? "") : "";
  const collectionSlug = resource === "collections" ? String(draft.slug ?? "") : "";
  const fields = fieldsForResource(resource, { sectionKey, productSlug, productCategory, collectionSlug, isEdit: Boolean(editingId) });
  const editOnly = Boolean(meta.editOnly);

  const load = async () => {
    const token = await getAccessToken();
    if (!token) return;
    setRecords(await listAdminRecords(token, resource));
  };

  useEffect(() => {
    void load().catch((err) => setError(err instanceof Error ? err.message : "Unable to load records."));
  }, [resource]);

  const resetDraft = () => {
    setDraft({ isVisible: true });
    setEditingId(null);
  };

  const parseValue = (key: string, value: string, type?: string) => {
    if (type === "boolean" || ["isNew", "isVisible", "featured"].includes(key)) return value === "true";
    if (type === "number" || key === "priceBdt" || key === "displayOrder") return Number(value);
    return value;
  };

  const save = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setNotice("");
    const missing = validateDraft(resource, draft, { sectionKey, productCategory });
    if (missing.length) {
      setError(`Required: ${missing.join(", ")}`);
      return;
    }
    const token = await getAccessToken();
    if (!token) return;
    const payload = preparePayload(resource, draft, !editingId);
    try {
      if (editingId) {
        await updateAdminRecord(token, resource, editingId, payload);
        setNotice("Saved — refresh the website page to see changes.");
      } else {
        await createAdminRecord(token, resource, payload);
        setNotice("Created — refresh the website page to see changes.");
      }
      resetDraft();
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save.");
    }
  };

  const edit = (row: Record<string, unknown>) => {
    setEditingId(String(row.id));
    setDraft(rowToDraft(resource, row));
  };

  const remove = async (id: string) => {
    if (!window.confirm("Delete this item?")) return;
    const token = await getAccessToken();
    if (!token) return;
    try {
      await deleteAdminRecord(token, resource, id);
      if (editingId === id) resetDraft();
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to delete.");
    }
  };

  const selectedSection = resource === "sections" ? sectionKeyOptions.find((item) => item.value === draft.sectionKey) : null;
  const selectedCategory = resource === "products" ? String(draft.category ?? "") : "";
  const productGroups = resource === "products" ? groupRecordsByCategory(records) : [];
  const filteredRecords =
    resource === "products" && categoryFilter !== "all"
      ? records.filter((row) => String(row.category ?? "") === categoryFilter)
      : records;

  const renderRow = (row: Record<string, unknown>) => (
    <tr key={String(row.id)} className="border-t border-stone-100">
      <td className="px-4 py-3">
        <p className="font-medium">{listTitleFor(resource, row)}</p>
        {resource === "products" && row.heroImage && (
          <img src={String(row.heroImage)} alt="" className="mt-2 h-12 w-12 rounded object-cover" />
        )}
      </td>
      <td className="px-4 py-3 text-stone-500">{listSubtitleFor(resource, row)}</td>
      <td className="px-4 py-3">{String(row.isVisible ?? true)}</td>
      <td className="space-x-3 px-4 py-3">
        <button type="button" className="text-teal underline" onClick={() => edit(row)}>Edit</button>
        {!editOnly && (
          <button type="button" className="text-red-600 underline" onClick={() => remove(String(row.id))}>Delete</button>
        )}
      </td>
    </tr>
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="font-serif text-4xl">{meta.label}</h2>
          <p className="mt-2 max-w-2xl text-sm text-stone-600">{meta.description}</p>
        </div>
        {meta.previewPath && (
          <a href={meta.previewPath} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.12em] text-teal">
            Preview on site <ExternalLink size={14} />
          </a>
        )}
      </div>

      {(error || notice) && <p className={`text-sm ${error ? "text-red-600" : "text-teal"}`}>{error || notice}</p>}

      {(editOnly && !editingId) ? (
        <p className="rounded border border-stone-200 bg-white px-6 py-5 text-sm text-stone-600">
          Shop pages are fixed on the website. Click <strong>Edit</strong> on a page below to change its banner, title, or description.
        </p>
      ) : (
      <form onSubmit={save} className="grid gap-3 rounded border border-stone-200 bg-white p-6 md:grid-cols-2">
        <h3 className="md:col-span-2 font-serif text-2xl">{editingId ? (editOnly ? "Edit shop page" : "Edit item") : "Add new item"}</h3>
        {selectedSection && (
          <p className="md:col-span-2 rounded bg-[#F0E9E2] px-4 py-3 text-sm text-stone-700">
            <strong>On the website:</strong> {selectedSection.location}
          </p>
        )}
        {!productCategory && resource === "products" && (
          <p className="md:col-span-2 rounded bg-amber-50 px-4 py-3 text-sm text-stone-700">
            Select a <strong>product type</strong> first — size, length and other fields appear based on type.
          </p>
        )}
        {resource === "products" && selectedCategory && (
          <p className="md:col-span-2 rounded bg-teal/10 px-4 py-3 text-sm text-stone-700">
            <strong>Will appear on:</strong> {categoryShopPath(selectedCategory)}
          </p>
        )}
        {fields.map((field) => {
          const label = (
            <span className="mb-1 block text-xs uppercase tracking-[0.12em] text-stone-500">
              {field.label}
              {field.required && <span className="text-red-600"> *</span>}
            </span>
          );

          if (field.type === "image") {
            return (
              <ImageUploadField
                key={field.key}
                label={field.label}
                required={field.required}
                value={String(draft[field.key] ?? "")}
                onChange={(url) => setDraft({ ...draft, [field.key]: url })}
              />
            );
          }

          if (field.type === "readonly") {
            return (
              <div key={field.key} className="block text-sm">
                {label}
                {field.hint && <span className="mb-2 block text-xs text-stone-400">{field.hint}</span>}
                <input className="field w-full bg-stone-100 text-stone-600" readOnly value={String(draft[field.key] ?? field.hint ?? "")} />
              </div>
            );
          }

          if (field.type === "multiselect" && field.options) {
            const selected = Array.isArray(draft[field.key]) ? (draft[field.key] as string[]) : [];
            return (
              <div key={field.key} className="md:col-span-2 block text-sm">
                {label}
                {field.hint && <span className="mb-2 block text-xs text-stone-400">{field.hint}</span>}
                <div className="flex flex-wrap gap-x-5 gap-y-2">
                  {field.options.map((option) => (
                    <label key={option.value} className="inline-flex items-center gap-2 text-sm text-stone-700">
                      <input
                        type="checkbox"
                        className="accent-teal"
                        checked={selected.includes(option.value)}
                        onChange={(e) => {
                          const next = e.target.checked
                            ? [...selected, option.value]
                            : selected.filter((item) => item !== option.value);
                          setDraft({ ...draft, [field.key]: next });
                        }}
                      />
                      {option.label}
                    </label>
                  ))}
                </div>
              </div>
            );
          }

          return (
            <label key={field.key} className={`block text-sm ${field.type === "textarea" || field.type === "multiselect" ? "md:col-span-2" : ""}`}>
              {label}
              {field.hint && <span className="mb-2 block text-xs text-stone-400">{field.hint}</span>}
              {field.type === "boolean" ? (
                <select
                  className="field w-full"
                  value={String(draft[field.key] ?? "true")}
                  onChange={(e) => setDraft({ ...draft, [field.key]: parseValue(field.key, e.target.value, field.type) })}
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              ) : field.type === "select" && field.options ? (
                <select
                  className="field w-full"
                  value={String(draft[field.key] ?? "")}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (field.key === "category" && resource === "products") {
                      setDraft(sanitizeDraftForCategory(draft, value));
                      return;
                    }
                    setDraft({ ...draft, [field.key]: value });
                  }}
                >
                  <option value="">Select…</option>
                  {field.options.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              ) : field.type === "textarea" ? (
                <textarea
                  className="field min-h-28 w-full"
                  value={String(draft[field.key] ?? "")}
                  onChange={(e) => setDraft({ ...draft, [field.key]: e.target.value })}
                />
              ) : (
                <input
                  className="field w-full"
                  type={field.type === "number" ? "number" : "text"}
                  value={String(draft[field.key] ?? "")}
                  onChange={(e) => setDraft({ ...draft, [field.key]: parseValue(field.key, e.target.value, field.type) })}
                />
              )}
            </label>
          );
        })}
        <div className="flex gap-3 md:col-span-2">
          <button type="submit" className="btn-primary">{editingId ? "Save changes" : "Create"}</button>
          {editingId && <button type="button" className="btn-outline" onClick={resetDraft}>Cancel</button>}
        </div>
      </form>
      )}

      {resource === "products" && (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setCategoryFilter("all")}
            className={`px-3 py-1.5 text-xs uppercase tracking-[0.12em] ${categoryFilter === "all" ? "bg-teal text-white" : "bg-white ring-1 ring-stone-200 text-stone-600"}`}
          >
            All ({records.length})
          </button>
          {PRODUCT_CATEGORIES.map((category) => {
            const count = records.filter((row) => String(row.category ?? "") === category).length;
            return (
              <button
                key={category}
                type="button"
                onClick={() => setCategoryFilter(category)}
                className={`px-3 py-1.5 text-xs uppercase tracking-[0.12em] ${categoryFilter === category ? "bg-teal text-white" : "bg-white ring-1 ring-stone-200 text-stone-600"}`}
              >
                {category} ({count})
              </button>
            );
          })}
        </div>
      )}

      <div className="overflow-x-auto rounded border border-stone-200 bg-white">
        {resource === "products" && categoryFilter === "all" ? (
          productGroups.length ? (
            <div className="divide-y divide-stone-200">
              {productGroups.map((group) => (
                <div key={group.category}>
                  <div className="flex flex-wrap items-center justify-between gap-3 bg-[#F0E9E2] px-4 py-4">
                    <div>
                      <h3 className="font-serif text-xl text-stone-900">{group.category}</h3>
                      <p className="text-xs text-stone-500">{group.shopPath} · {group.items.length} product{group.items.length === 1 ? "" : "s"}</p>
                    </div>
                    <a href={group.shopPath} target="_blank" rel="noreferrer" className="text-xs uppercase tracking-[0.12em] text-teal">
                      View on site
                    </a>
                  </div>
                  <table className="min-w-full text-sm">
                    <thead className="text-left text-xs uppercase tracking-[0.12em] text-stone-500">
                      <tr>
                        <th className="px-4 py-3">Name</th>
                        <th className="px-4 py-3">Product link</th>
                        <th className="px-4 py-3">Visible</th>
                        <th className="px-4 py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>{group.items.map((row) => renderRow(row))}</tbody>
                  </table>
                </div>
              ))}
            </div>
          ) : (
            <p className="px-4 py-8 text-center text-stone-500">No products yet. Add one above and choose its type (Dresses, Bags, Shoes…).</p>
          )
        ) : (
          <table className="min-w-full text-sm">
            <thead className="bg-[#F0E9E2] text-left text-xs uppercase tracking-[0.12em] text-stone-600">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Where on site</th>
                <th className="px-4 py-3">Visible</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((row) => renderRow(row))}
              {!filteredRecords.length && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-stone-500">
                    {resource === "products"
                      ? "No products in this type yet."
                      : "No records yet. Run node scripts/seed-cms.mjs or add one above."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

const AdminShell = ({ onLogout }: { onLogout: () => void }) => {
  const navigate = useNavigate();
  const logout = async () => {
    await signOut();
    onLogout();
    navigate("/admin");
  };

  return (
    <div className="min-h-screen bg-[#F9F6F2] text-stone-900">
      <header className="border-b border-stone-200 bg-white">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.24em] text-teal">Amelie Milano CMS</p>
            <h1 className="font-serif text-2xl">Content Manager</h1>
          </div>
          <div className="flex items-center gap-4 text-xs uppercase tracking-[0.12em]">
            <Link to="/" className="text-teal">View site</Link>
            <button type="button" onClick={logout} className="text-stone-600">Sign out</button>
          </div>
        </div>
      </header>
      <div className="container mx-auto grid gap-8 px-4 py-8 lg:grid-cols-[240px_1fr]">
        <aside className="h-fit space-y-1 bg-white p-4 ring-1 ring-stone-200">
          {resources.map((key) => (
            <Link key={key} to={`/admin/${key}`} className="block px-3 py-2 text-sm hover:bg-[#F0E9E2] hover:text-teal">
              <span className="block font-medium">{resourceMeta[key].label}</span>
              <span className="block text-xs normal-case tracking-normal text-stone-500">{resourceMeta[key].description.split(".")[0]}</span>
            </Link>
          ))}
        </aside>
        <main>
          <Routes>
            <Route index element={<Navigate to="/admin/products" replace />} />
            {resources.map((key) => (
              <Route key={key} path={key} element={<ResourceEditor resource={key} />} />
            ))}
          </Routes>
        </main>
      </div>
    </div>
  );
};

const AdminApp = () => {
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    void (async () => {
      const token = await getAccessToken();
      if (token && (await verifyCmsAdmin(token))) setAuthed(true);
      setReady(true);
    })();
  }, []);

  if (!ready) return <div className="flex min-h-screen items-center justify-center text-sm text-stone-600">Loading admin…</div>;
  if (!authed) return <AdminLogin onSuccess={() => setAuthed(true)} />;
  return <AdminShell onLogout={() => setAuthed(false)} />;
};

export default AdminApp;
