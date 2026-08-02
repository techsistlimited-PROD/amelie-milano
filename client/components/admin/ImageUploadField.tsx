import { useRef, useState } from "react";
import { Upload } from "lucide-react";
import { uploadCmsImage } from "@/lib/cmsUpload";

interface ImageUploadFieldProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  required?: boolean;
}

const MAX_UPLOAD_BYTES = 20 * 1024 * 1024;

const ImageUploadField = ({ value, onChange, label = "Image", required }: ImageUploadFieldProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    if (file.size > MAX_UPLOAD_BYTES) {
      setError(`Image is too large (${(file.size / (1024 * 1024)).toFixed(1)} MB). Maximum is 20 MB.`);
      return;
    }
    setError("");
    setUploading(true);
    try {
      const url = await uploadCmsImage(file);
      onChange(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="md:col-span-2 space-y-3 rounded border border-stone-200 bg-stone-50 p-4">
      <span className="block text-xs uppercase tracking-[0.12em] text-stone-500">
        {label}
        {required && <span className="text-red-600"> *</span>}
      </span>
      {value && (
        <img src={value} alt="Preview" className="h-32 w-auto max-w-full rounded border border-stone-200 object-cover" />
      )}
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          className="inline-flex items-center gap-2 border border-teal bg-white px-4 py-2 text-xs uppercase tracking-[0.12em] text-teal hover:bg-teal hover:text-white"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
        >
          <Upload size={14} />
          {uploading ? "Uploading…" : "Upload from computer"}
        </button>
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => void handleFile(e.target.files?.[0])} />
      </div>
      <input
        className="field w-full"
        placeholder="Or paste image URL"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <p className="text-xs text-stone-400">JPG, PNG or WebP · up to 20 MB</p>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default ImageUploadField;
