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
    location: 'local' as 'local' | 'foreign',
    cv: '',
    // Optional/additional fields per new schema
    dateOfBirth: '',
    gender: '',
    nationality: '',
    contactNumber: '',
    email: '',
    postalAddress: '',
    medicalDegrees: '',
    medicalRegistrationNumber: '',
    institutionEmployer: '',
    currentPositionTitle: '',
    yearsOfExperience: '',
    membershipCategory: '' as '' | 'full' | 'student',
    declarationAccepted: false,
    signature: '',
    signatureDate: '',
  });
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
    const { name } = target;
    const value = (target as HTMLInputElement).type === 'checkbox'
      ? (target as HTMLInputElement).checked
      : target.value;
    setFormData((prev) => ({ ...prev, [name]: value as never }));
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

  const nicValid = useMemo(() => {
    const nic = formData.nic.trim();
    if (!nic) return false;
    const nic9 = /^[0-9]{9}[VvXx]$/; // 9 digits + V/X
    const nic12 = /^[0-9]{12}$/; // 12 digits
    return nic9.test(nic) || nic12.test(nic);
  }, [formData.nic]);

  const cvValid = useMemo(() => {
    const cv = (formData.cv || '').trim();
    if (!cv) return true; // optional
    try {
      // Accept valid URL as-is
      const u = new URL(cv);
      return !!u.protocol && !!u.host;
    } catch {
      // Otherwise require min length 50
      return cv.length >= 50;
    }
  }, [formData.cv]);

  const canProceedInfo = useMemo(() => {
    // All fields except CV and Documents are mandatory
    const requiredText = [
      formData.fullName,
      formData.specialization,
      formData.hospital,
      formData.dateOfBirth,
      formData.gender,
      formData.nationality,
      formData.contactNumber,
      formData.email,
      formData.postalAddress,
      formData.medicalDegrees,
      formData.medicalRegistrationNumber,
      formData.institutionEmployer,
      formData.currentPositionTitle,
      formData.yearsOfExperience,
    ].every((v) => (v ?? '').toString().trim().length > 0);

    const locationOk = formData.location === 'local' || formData.location === 'foreign';

    return requiredText && locationOk && nicValid && cvValid;
  }, [
    formData.fullName,
    formData.specialization,
    formData.hospital,
    formData.dateOfBirth,
    formData.gender,
    formData.nationality,
    formData.contactNumber,
    formData.email,
    formData.postalAddress,
    formData.medicalDegrees,
    formData.medicalRegistrationNumber,
    formData.institutionEmployer,
    formData.currentPositionTitle,
    formData.yearsOfExperience,
    formData.location,
    nicValid,
    cvValid,
  ]);

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

      // Validate final required declarations
      if (!formData.membershipCategory) {
        throw new Error('Please select a membership category.');
      }
      if (!formData.declarationAccepted) {
        throw new Error('You must accept the declaration to proceed.');
      }
      if (!formData.signature || !formData.signatureDate) {
        throw new Error('Signature and date are required.');
      }

      // Prepare yearsOfExperience: send number when possible, else string
      const yearsVal = typeof formData.yearsOfExperience === 'string'
        ? (formData.yearsOfExperience.trim() === '' ? undefined : (isNaN(Number(formData.yearsOfExperience)) ? formData.yearsOfExperience : Number(formData.yearsOfExperience)))
        : formData.yearsOfExperience;

      const payload = {
        fullName: formData.fullName.trim(),
        nic: formData.nic.trim(),
        specialization: formData.specialization.trim(),
        hospital: formData.hospital.trim(),
        location: formData.location,
        cv: formData.cv?.trim() || '',
        documents: documentUrls,
        dateOfBirth: formData.dateOfBirth || undefined,
        gender: formData.gender || undefined,
        nationality: formData.nationality || undefined,
        contactNumber: formData.contactNumber || undefined,
        email: formData.email || undefined,
        postalAddress: formData.postalAddress || undefined,
        medicalDegrees: formData.medicalDegrees || undefined,
        medicalRegistrationNumber: formData.medicalRegistrationNumber || undefined,
        institutionEmployer: formData.institutionEmployer || undefined,
        currentPositionTitle: formData.currentPositionTitle || undefined,
        yearsOfExperience: yearsVal as number | string | undefined,
        membershipCategory: formData.membershipCategory,
        declarationAccepted: !!formData.declarationAccepted,
        signature: formData.signature,
        signatureDate: formData.signatureDate,
      } as const;
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
          <h2 className="text-xl font-semibold text-foreground">Sri Lanka Orthopaedic Association</h2>
          <p className="mt-1 text-sm text-muted-foreground">Membership Application Form</p>
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
        <p className="mb-3 text-xs text-muted-foreground">Fields marked <span className="text-red-600">*</span> are required. CV and Supporting Documents are optional.</p>

        {step === 0 && (
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground">Personal Details</h3>
            <div className="grid grid-cols-1 gap-4 mt-4 sm:grid-cols-2">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-muted-foreground">Full Name <span className="text-red-600">*</span></label>
                <input id="fullName" name="fullName" type="text" required value={formData.fullName} onChange={handleChange} className="w-full px-4 py-2 mt-1 text-foreground bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <label htmlFor="nic" className="block text-sm font-medium text-muted-foreground">NIC Number <span className="text-red-600">*</span></label>
                <input id="nic" name="nic" type="text" required value={formData.nic} onChange={handleChange} className={`w-full px-4 py-2 mt-1 text-foreground bg-background border rounded-lg focus:outline-none focus:ring-2 ${nicValid ? 'border-border focus:ring-primary' : 'border-red-300 focus:ring-red-500'}`} placeholder="9 digits + V/X or 12 digits" />
              </div>
              <div>
                <label htmlFor="specialization" className="block text-sm font-medium text-muted-foreground">Orthopaedic Specialization <span className="text-red-600">*</span></label>
                <input id="specialization" name="specialization" type="text" required value={formData.specialization} onChange={handleChange} className="w-full px-4 py-2 mt-1 text-foreground bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <label htmlFor="hospital" className="block text-sm font-medium text-muted-foreground">Hospital / Institution <span className="text-red-600">*</span></label>
                <input id="hospital" name="hospital" type="text" required value={formData.hospital} onChange={handleChange} className="w-full px-4 py-2 mt-1 text-foreground bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-muted-foreground">Location <span className="text-red-600">*</span></label>
                <select id="location" name="location" required value={formData.location} onChange={handleChange} className="w-full px-4 py-2 mt-1 text-foreground bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                  <option value="local">Local</option>
                  <option value="foreign">Foreign</option>
                </select>
              </div>
              <div>
                <label htmlFor="dateOfBirth" className="block text-sm font-medium text-muted-foreground">Date of Birth <span className="text-red-600">*</span></label>
                <input id="dateOfBirth" name="dateOfBirth" type="date" required value={formData.dateOfBirth} onChange={handleChange} className="w-full px-4 py-2 mt-1 text-foreground bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-muted-foreground">Gender <span className="text-red-600">*</span></label>
                <input id="gender" name="gender" type="text" required value={formData.gender} onChange={handleChange} className="w-full px-4 py-2 mt-1 text-foreground bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <label htmlFor="nationality" className="block text-sm font-medium text-muted-foreground">Nationality <span className="text-red-600">*</span></label>
                <input id="nationality" name="nationality" type="text" required value={formData.nationality} onChange={handleChange} className="w-full px-4 py-2 mt-1 text-foreground bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <label htmlFor="contactNumber" className="block text-sm font-medium text-muted-foreground">Contact Number <span className="text-red-600">*</span></label>
                <input id="contactNumber" name="contactNumber" type="tel" required value={formData.contactNumber} onChange={handleChange} className="w-full px-4 py-2 mt-1 text-foreground bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" placeholder="e.g. +94 71 123 4567" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-muted-foreground">Email Address <span className="text-red-600">*</span></label>
                <input id="email" name="email" type="email" required value={formData.email} onChange={handleChange} className="w-full px-4 py-2 mt-1 text-foreground bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" placeholder="This won’t replace account email" />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="postalAddress" className="block text-sm font-medium text-muted-foreground">Postal Address <span className="text-red-600">*</span></label>
                <input id="postalAddress" name="postalAddress" type="text" required value={formData.postalAddress} onChange={handleChange} className="w-full px-4 py-2 mt-1 text-foreground bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <label htmlFor="medicalDegrees" className="block text-sm font-medium text-muted-foreground">Medical Degree(s) <span className="text-red-600">*</span></label>
                <input id="medicalDegrees" name="medicalDegrees" type="text" required value={formData.medicalDegrees} onChange={handleChange} className="w-full px-4 py-2 mt-1 text-foreground bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" placeholder="e.g. MBBS, MS" />
              </div>
              <div>
                <label htmlFor="medicalRegistrationNumber" className="block text-sm font-medium text-muted-foreground">Medical Registration Number <span className="text-red-600">*</span></label>
                <input id="medicalRegistrationNumber" name="medicalRegistrationNumber" type="text" required value={formData.medicalRegistrationNumber} onChange={handleChange} className="w-full px-4 py-2 mt-1 text-foreground bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" placeholder="e.g. SLMC-123456" />
              </div>
              <div>
                <label htmlFor="institutionEmployer" className="block text-sm font-medium text-muted-foreground">Institution/Employer <span className="text-red-600">*</span></label>
                <input id="institutionEmployer" name="institutionEmployer" type="text" required value={formData.institutionEmployer} onChange={handleChange} className="w-full px-4 py-2 mt-1 text-foreground bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <label htmlFor="currentPositionTitle" className="block text-sm font-medium text-muted-foreground">Current Position/Title <span className="text-red-600">*</span></label>
                <input id="currentPositionTitle" name="currentPositionTitle" type="text" required value={formData.currentPositionTitle} onChange={handleChange} className="w-full px-4 py-2 mt-1 text-foreground bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <label htmlFor="yearsOfExperience" className="block text-sm font-medium text-muted-foreground">Years of Experience in Orthopaedics <span className="text-red-600">*</span></label>
                <input id="yearsOfExperience" name="yearsOfExperience" type="text" required value={formData.yearsOfExperience} onChange={handleChange} className="w-full px-4 py-2 mt-1 text-foreground bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" placeholder="e.g. 7" />
              </div>
            </div>
            <div className="mt-4">
              <label htmlFor="cv" className="block text-sm font-medium text-muted-foreground">Curriculum Vitae (CV)</label>
              <textarea id="cv" name="cv" rows={4} value={formData.cv} onChange={handleChange} className={`w-full px-4 py-2 mt-1 text-foreground bg-background border rounded-lg focus:outline-none focus:ring-2 ${cvValid ? 'border-border focus:ring-primary' : 'border-red-300 focus:ring-red-500'}`} placeholder="Optional: Paste a URL or at least 50 characters of text."></textarea>
              <p className="text-xs text-muted-foreground mt-1">Optional: Provide a CV URL or at least 50 characters of text.</p>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground">Supporting Documents</h3>
            <p className="text-sm text-muted-foreground mt-1">PDF, DOC, DOCX, PNG, JPG (Max 10 MB each)</p>
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
              {files.length === 0 && (
                <p className="text-xs text-muted-foreground mt-2">Optional: You can upload supporting documents now or later.</p>
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
                  <p><span className="text-muted-foreground">Orthopaedic Specialization:</span> {formData.specialization || '—'}</p>
                  <p><span className="text-muted-foreground">Hospital:</span> {formData.hospital || '—'}</p>
                  <p><span className="text-muted-foreground">Location:</span> {formData.location}</p>
                  <p><span className="text-muted-foreground">Date of Birth:</span> {formData.dateOfBirth || '—'}</p>
                  <p><span className="text-muted-foreground">Gender:</span> {formData.gender || '—'}</p>
                  <p><span className="text-muted-foreground">Nationality:</span> {formData.nationality || '—'}</p>
                  <p><span className="text-muted-foreground">Contact Number:</span> {formData.contactNumber || '—'}</p>
                  <p><span className="text-muted-foreground">Email Address:</span> {formData.email || '—'}</p>
                  <p><span className="text-muted-foreground">Postal Address:</span> {formData.postalAddress || '—'}</p>
                  <p><span className="text-muted-foreground">Medical Degree(s):</span> {formData.medicalDegrees || '—'}</p>
                  <p><span className="text-muted-foreground">Medical Reg. No:</span> {formData.medicalRegistrationNumber || '—'}</p>
                  <p><span className="text-muted-foreground">Institution/Employer:</span> {formData.institutionEmployer || '—'}</p>
                  <p><span className="text-muted-foreground">Current Position/Title:</span> {formData.currentPositionTitle || '—'}</p>
                  <p><span className="text-muted-foreground">Years of Experience in Orthopaedics:</span> {formData.yearsOfExperience || '—'}</p>
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
            <div className="mt-4 bg-muted/30 border border-border rounded-lg p-4">
              <h4 className="font-semibold text-foreground mb-2">Membership & Declaration</h4>
              <p className="text-sm text-foreground mb-3">I hereby apply for membership of the Sri Lanka Orthopaedic Association and agree to abide by its rules, regulations, and code of ethics.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="membershipCategory" className="block text-sm font-medium text-muted-foreground">Membership Category <span className="text-red-600">*</span></label>
                  <select id="membershipCategory" name="membershipCategory" required value={formData.membershipCategory} onChange={handleChange} className="w-full px-4 py-2 mt-1 text-foreground bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                    <option value="">Select category</option>
                    <option value="full">Full</option>
                    <option value="student">Student</option>
                  </select>
                </div>
                <div className="flex items-center gap-3 mt-7 sm:mt-7">
                  <input id="declarationAccepted" name="declarationAccepted" type="checkbox" required checked={formData.declarationAccepted} onChange={handleChange} className="h-4 w-4" />
                  <label htmlFor="declarationAccepted" className="text-sm text-foreground">I declare the information provided is true and correct <span className="text-red-600">*</span></label>
                </div>
                <div>
                  <label htmlFor="signature" className="block text-sm font-medium text-muted-foreground">Signature <span className="text-red-600">*</span></label>
                  <input id="signature" name="signature" type="text" required value={formData.signature} onChange={handleChange} className="w-full px-4 py-2 mt-1 text-foreground bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Type your full name" />
                </div>
                <div>
                  <label htmlFor="signatureDate" className="block text-sm font-medium text-muted-foreground">Date <span className="text-red-600">*</span></label>
                  <input id="signatureDate" name="signatureDate" type="date" required value={formData.signatureDate} onChange={handleChange} className="w-full px-4 py-2 mt-1 text-foreground bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
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
