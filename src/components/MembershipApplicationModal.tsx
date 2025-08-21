"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FileUp, Send, X } from 'lucide-react';
import api from '@/utils/api';

interface MembershipApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MembershipApplicationModal: React.FC<MembershipApplicationModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    nic: '',
    specialization: '',
    hospital: '',
    role: 'consultant',
    location: 'local',
    cv: '',
  });
  const [files, setFiles] = useState<FileList | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(e.target.files);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let documentUrls: string[] = [];
      if (files && files.length > 0) {
        const uploadFormData = new FormData();
        for (let i = 0; i < files.length; i++) {
          uploadFormData.append('documents', files[i]);
        }
        const uploadData = await api.post('/api/v1/upload/documents/membership', uploadFormData) as { urls: string[] };
        documentUrls = uploadData.urls;
      }

      await api.post('/api/v1/membership/apply', { ...formData, documents: documentUrls });
      
      onClose();
      router.refresh();
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

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-4xl p-6 mx-auto my-8 space-y-6 bg-white rounded-2xl shadow-lg md:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div className="text-left">
            <h2 className="text-3xl font-extrabold text-gray-900">Membership Application</h2>
            <p className="mt-2 text-sm text-gray-600">Complete the form to apply for membership.</p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-500 rounded-full hover:bg-gray-100">
            <X className="w-6 h-6" />
          </button>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="p-3 text-sm text-center text-red-800 bg-red-100 border border-red-200 rounded-lg">
              {error}
            </div>
          )}

          <div className="p-6 border border-gray-200 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-800">Professional Information</h3>
            <div className="grid grid-cols-1 gap-6 mt-6 sm:grid-cols-2">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name</label>
                <input id="fullName" name="fullName" type="text" required value={formData.fullName} onChange={handleChange} className="w-full px-4 py-3 mt-1 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label htmlFor="nic" className="block text-sm font-medium text-gray-700">NIC Number</label>
                <input id="nic" name="nic" type="text" required value={formData.nic} onChange={handleChange} className="w-full px-4 py-3 mt-1 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label htmlFor="specialization" className="block text-sm font-medium text-gray-700">Specialization</label>
                <input id="specialization" name="specialization" type="text" required value={formData.specialization} onChange={handleChange} className="w-full px-4 py-3 mt-1 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label htmlFor="hospital" className="block text-sm font-medium text-gray-700">Hospital / Institution</label>
                <input id="hospital" name="hospital" type="text" required value={formData.hospital} onChange={handleChange} className="w-full px-4 py-3 mt-1 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
                <select id="role" name="role" value={formData.role} onChange={handleChange} className="w-full px-4 py-3 mt-1 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="consultant">Consultant</option>
                  <option value="trainee">Trainee</option>
                </select>
              </div>
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
                <select id="location" name="location" value={formData.location} onChange={handleChange} className="w-full px-4 py-3 mt-1 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="local">Local</option>
                  <option value="international">International</option>
                </select>
              </div>
            </div>
            <div className="mt-6">
              <label htmlFor="cv" className="block text-sm font-medium text-gray-700">Curriculum Vitae (CV)</label>
              <textarea id="cv" name="cv" rows={4} value={formData.cv} onChange={handleChange} className="w-full px-4 py-3 mt-1 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Paste your CV here or provide a summary of your qualifications."></textarea>
            </div>
          </div>

          <div className="p-6 border border-gray-200 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-800">Supporting Documents</h3>
            <div className="mt-4">
              <label htmlFor="documents" className="flex items-center justify-center w-full px-6 py-10 mt-1 text-center border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:border-blue-500">
                <div className="text-center">
                  <FileUp className="w-12 h-12 mx-auto text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">
                    <span className="font-semibold text-blue-600">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">PDF, DOC, DOCX, PNG, JPG (Max 5 files, 10MB each)</p>
                  <input id="documents" name="documents" type="file" multiple onChange={handleFileChange} className="sr-only" />
                </div>
              </label>
              {files && files.length > 0 && (
                <div className="mt-4 text-sm text-gray-700">
                  <p className="font-semibold">Selected files:</p>
                  <ul className="pl-5 list-disc">
                    {Array.from(files).map((file, index) => (
                      <li key={index}>{file.name}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-6 py-3 font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-60"
            >
              <Send className="w-5 h-5 mr-2 -ml-1" />
              {loading ? 'Submitting Application...' : 'Submit Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MembershipApplicationModal;
