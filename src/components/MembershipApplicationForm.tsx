"use client";
import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FileUp, Send, CheckCircle2, ArrowRight, ArrowLeft, FileText, Trash2 } from 'lucide-react';
import api from '@/utils/api';
import { toast } from 'react-hot-toast';

interface Props {
  className?: string;
  onSubmitted?: () => void;
}

const MembershipApplicationForm: React.FC<Props> = ({ className, onSubmitted }) => {
  // Steps: 0 = Info, 1 = Documents, 2 = Review
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [formData, setFormData] = useState({
    fullName: '',
    nic: '',
    specialization: '',
    hospital: '',
    location: 'local',
    cv: '',
  });
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const MAX_FILES = 5;
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  const ACCEPTED_TYPES = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/png',
    'image/jpeg',
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selected = Array.from(e.target.files);
    const combined = [...files, ...selected];
    if (combined.length > MAX_FILES) {
      setError(`You can upload up to ${MAX_FILES} files.`);
      return;
    }
    for (const f of selected) {
      if (!ACCEPTED_TYPES.includes(f.type)) {
        setError('Unsupported file type. Allowed: PDF, DOC, DOCX, PNG, JPG');
        return;
      }
      if (f.size > MAX_FILE_SIZE) {
        setError('File too large. Max 10MB per file.');
        return;
      }
    }
    setFiles(combined);
    setError(null);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const canProceedInfo = useMemo(() => {
    return (
      formData.fullName.trim().length > 2 &&
      formData.nic.trim().length > 5 &&
      formData.specialization.trim().length > 2 &&
      formData.hospital.trim().length > 2 &&
      (formData.location === 'local' || formData.location === 'foreign')
    );
  }, [formData]);

  // Handle Enter key within the form: advance steps only
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 2) {
      if (step === 0 && !canProceedInfo) {
        setError('Please fill all required fields correctly.');
        return;
      }
      setError(null);
      setStep((s) => ((s + 1) as 0 | 1 | 2));
    }
    // Do nothing on step 2 here; final submit is explicit via button
  };

  const handleFinalSubmit = async () => {
    if (loading) return;
    setLoading(true);
    setError(null);

    try {
      let documentUrls: string[] = [];
      if (files && files.length > 0) {
        const uploadFormData = new FormData();
        for (let i = 0; i < files.length; i++) {
          uploadFormData.append('documents', files[i]);
        }
        const uploadResp = await api.upload('/api/v1/upload/documents/membership', uploadFormData) as { files?: Array<{ url?: string; path?: string }> } | { urls?: string[] };
        if ('files' in uploadResp && Array.isArray(uploadResp.files)) {
          documentUrls = uploadResp.files.map(f => f.url || f.path).filter(Boolean) as string[];
        } else if ('urls' in uploadResp && Array.isArray(uploadResp.urls)) {
          documentUrls = uploadResp.urls as string[];
        } else {
          documentUrls = [];
        }
      }

      const payload = { ...formData, documents: documentUrls } as const;
      await api.post('/api/v1/membership/apply', payload);

      toast.success('Application submitted successfully');
      if (onSubmitted) {
        onSubmitted();
      } else {
        router.refresh();
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={className}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Apply for Membership</h2>
          <p className="mt-1 text-sm text-muted-foreground">Follow the steps to submit your application.</p>
        </div>
      </div>

      {/* Stepper */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          {["Info", "Documents", "Review"].map((label, idx) => (
            <div key={label} className="flex-1 flex items-center">
              <div className={`flex items-center gap-2 ${idx <= step ? 'text-primary' : 'text-muted-foreground'}`}>
                <div className={`h-8 w-8 rounded-full flex items-center justify-center border ${idx <= step ? 'bg-primary/10 border-primary' : 'bg-muted border-border'}`}>
                  {idx < step ? <CheckCircle2 className="h-5 w-5" /> : <span className="text-sm font-semibold">{idx + 1}</span>}
                </div>
                <span className="text-sm font-medium">{label}</span>
              </div>
              {idx < 2 && <div className={`flex-1 h-[2px] mx-2 ${idx < step ? 'bg-primary/30' : 'bg-border'}`} />}
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {error && (
          <div className="mb-4 p-3 text-sm text-red-800 bg-red-100 border border-red-200 rounded-lg">
            {error}
          </div>
        )}

        {step === 0 && (
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground">Professional Information</h3>
            <div className="grid grid-cols-1 gap-4 mt-4 sm:grid-cols-2">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-muted-foreground">Full Name</label>
                <input id="fullName" name="fullName" type="text" required value={formData.fullName} onChange={handleChange} className="w-full px-4 py-2 mt-1 text-foreground bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <label htmlFor="nic" className="block text-sm font-medium text-muted-foreground">NIC Number</label>
                <input id="nic" name="nic" type="text" required value={formData.nic} onChange={handleChange} className="w-full px-4 py-2 mt-1 text-foreground bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <label htmlFor="specialization" className="block text-sm font-medium text-muted-foreground">Specialization</label>
                <input id="specialization" name="specialization" type="text" required value={formData.specialization} onChange={handleChange} className="w-full px-4 py-2 mt-1 text-foreground bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <label htmlFor="hospital" className="block text-sm font-medium text-muted-foreground">Hospital / Institution</label>
                <input id="hospital" name="hospital" type="text" required value={formData.hospital} onChange={handleChange} className="w-full px-4 py-2 mt-1 text-foreground bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-muted-foreground">Location</label>
                <select id="location" name="location" value={formData.location} onChange={handleChange} className="w-full px-4 py-2 mt-1 text-foreground bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                  <option value="local">Local</option>
                  <option value="foreign">Foreign</option>
                </select>
              </div>
            </div>
            <div className="mt-4">
              <label htmlFor="cv" className="block text-sm font-medium text-muted-foreground">Curriculum Vitae (CV)</label>
              <textarea id="cv" name="cv" rows={4} value={formData.cv} onChange={handleChange} className="w-full px-4 py-2 mt-1 text-foreground bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Paste your CV here or provide a summary of your qualifications."></textarea>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground">Supporting Documents</h3>
            <p className="text-sm text-muted-foreground mt-1">PDF, DOC, DOCX, PNG, JPG (Max 5 MB)</p>
            <div className="mt-4">
              <label htmlFor="documents" className="flex items-center justify-center w-full px-6 py-10 text-center border-2 border-border border-dashed rounded-lg cursor-pointer hover:border-primary">
                <div className="text-center">
                  <FileUp className="w-10 h-10 mx-auto text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    <span className="font-semibold text-primary">Click to upload</span> or drag and drop
                  </p>
                </div>
                <input id="documents" name="documents" type="file" multiple onChange={handleFileChange} className="sr-only" accept={ACCEPTED_TYPES.join(',')} />
              </label>
              {files.length > 0 && (
                <div className="mt-4 space-y-2">
                  {files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/50 border border-border rounded-md">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-sm font-medium text-foreground">{file.name}</p>
                          <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                      </div>
                      <button type="button" onClick={() => removeFile(index)} className="p-2 text-muted-foreground hover:text-red-600" aria-label={`Remove ${file.name}`}>
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground">Review & Submit</h3>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-muted/50 p-4 rounded-lg border border-border">
                <h4 className="font-semibold text-foreground mb-2">Your Details</h4>
                <div className="text-sm text-foreground/90 space-y-1">
                  <p><span className="text-muted-foreground">Full Name:</span> {formData.fullName || '—'}</p>
                  <p><span className="text-muted-foreground">NIC:</span> {formData.nic || '—'}</p>
                  <p><span className="text-muted-foreground">Specialization:</span> {formData.specialization || '—'}</p>
                  <p><span className="text-muted-foreground">Hospital:</span> {formData.hospital || '—'}</p>
                  <p><span className="text-muted-foreground">Location:</span> {formData.location}</p>
                </div>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg border border-border">
                <h4 className="font-semibold text-foreground mb-2">Documents</h4>
                {files.length > 0 ? (
                  <ul className="text-sm text-foreground/90 list-disc pl-5 space-y-1">
                    {files.map((f, i) => (<li key={i}>{f.name}</li>))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">No documents selected</p>
                )}
              </div>
            </div>
            {formData.cv && (
              <div className="mt-4">
                <h4 className="font-semibold text-foreground mb-1">CV Summary</h4>
                <p className="text-sm text-foreground whitespace-pre-wrap bg-muted/50 p-3 rounded border border-border">{formData.cv}</p>
              </div>
            )}
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between mt-4">
          <button
            type="button"
            onClick={() => setStep((s) => (s > 0 ? ((s - 1) as 0 | 1 | 2) : s))}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-foreground hover:bg-muted/50 disabled:opacity-50"
            disabled={loading || step === 0}
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          {step < 2 ? (
            <button
              type="button"
              onClick={() => {
                if (step === 0 && !canProceedInfo) {
                  setError('Please fill all required fields correctly.');
                  return;
                }
                setError(null);
                setStep((s) => ((s + 1) as 0 | 1 | 2));
              }}
              className="inline-flex items-center gap-2 px-5 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-60"
              disabled={loading}
            >
              Next <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinalSubmit}
              disabled={loading}
              className="inline-flex items-center px-5 py-2 font-semibold bg-primary text-primary-foreground rounded-lg shadow-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-60"
            >
              <Send className="w-4 h-4 mr-2 -ml-1" />
              {loading ? 'Submitting...' : 'Submit Application'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default MembershipApplicationForm;
