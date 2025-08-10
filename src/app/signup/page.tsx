"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/utils/api';

const MemberRegistrationPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    nic: '',
    specialization: '',
    hospital: '',
    role: '',
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
      // Step 1: Register the user and get the access token
      const registrationData = await api.post('/api/v1/auth/register', {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
      });
      
      const accessToken = registrationData.session?.access_token;
      if (!accessToken) {
        throw new Error('Registration succeeded, but failed to log in automatically.');
      }
      localStorage.setItem('accessToken', accessToken);

      // Step 2: Upload documents if they exist
      let documentUrls: string[] = [];
      if (files && files.length > 0) {
        const uploadFormData = new FormData();
        for (let i = 0; i < files.length; i++) {
          uploadFormData.append('documents', files[i]);
        }
        const uploadData = await api.postFormData('/api/v1/upload/documents/membership', uploadFormData, accessToken);
        documentUrls = uploadData.urls;
      }

      // Step 3: Submit the membership application
      const { email, password, ...applicationData } = formData;
      await api.post('/api/v1/membership/apply', { ...applicationData, documents: documentUrls }, accessToken);

      // Step 4: Redirect to status page
      router.push('/application-status');

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen py-12 bg-gray-100">
      <div className="w-full max-w-3xl p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-center text-gray-900">Member Registration</h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && <p className="text-sm text-center text-red-500">{error}</p>}
          
          <div className="p-4 border rounded-md">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Account Details</h3>
            <div className="grid grid-cols-1 gap-6 mt-4 md:grid-cols-2">
              <div>
                <label htmlFor="fullName" className="text-sm font-medium text-gray-700">Full Name</label>
                <input id="fullName" name="fullName" type="text" required value={formData.fullName} onChange={handleChange} className="w-full px-3 py-2 mt-1 text-black border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div>
                <label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</label>
                <input id="email" name="email" type="email" required value={formData.email} onChange={handleChange} className="w-full px-3 py-2 mt-1 text-black border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div>
                <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
                <input id="password" name="password" type="password" required value={formData.password} onChange={handleChange} className="w-full px-3 py-2 mt-1 text-black border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
              </div>
            </div>
          </div>

          <div className="p-4 border rounded-md">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Professional Information</h3>
            <div className="grid grid-cols-1 gap-6 mt-4 md:grid-cols-2">
                <div>
                    <label htmlFor="nic" className="text-sm font-medium text-gray-700">NIC</label>
                    <input id="nic" name="nic" type="text" required value={formData.nic} onChange={handleChange} className="w-full px-3 py-2 mt-1 text-black border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                    <label htmlFor="specialization" className="text-sm font-medium text-gray-700">Specialization</label>
                    <input id="specialization" name="specialization" type="text" required value={formData.specialization} onChange={handleChange} className="w-full px-3 py-2 mt-1 text-black border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                    <label htmlFor="hospital" className="text-sm font-medium text-gray-700">Hospital</label>
                    <input id="hospital" name="hospital" type="text" required value={formData.hospital} onChange={handleChange} className="w-full px-3 py-2 mt-1 text-black border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                    <label htmlFor="role" className="text-sm font-medium text-gray-700">Role</label>
                    <input id="role" name="role" type="text" required value={formData.role} onChange={handleChange} className="w-full px-3 py-2 mt-1 text-black border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                </div>
            </div>
            <div className="mt-6">
                <label htmlFor="cv" className="text-sm font-medium text-gray-700">CV (Optional)</label>
                <textarea id="cv" name="cv" rows={4} value={formData.cv} onChange={handleChange} className="w-full px-3 py-2 mt-1 text-black border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"></textarea>
            </div>
             <div className="mt-6">
                <label htmlFor="documents" className="text-sm font-medium text-gray-700">Upload Supporting Documents (Optional)</label>
                <input id="documents" name="documents" type="file" multiple onChange={handleFileChange} className="w-full px-3 py-2 mt-1 text-sm text-black border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none" />
            </div>
          </div>

          <div>
            <button type="submit" disabled={loading} className="w-full px-4 py-3 font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50">
              {loading ? 'Submitting Registration...' : 'Submit Registration'}
            </button>
          </div>
        </form>
        <p className="text-sm text-center text-gray-600">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default MemberRegistrationPage;
