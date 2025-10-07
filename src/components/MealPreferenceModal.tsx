"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface MealPreferenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (mealPreference: string | null) => void;
  isLoading?: boolean;
}

const MEAL_OPTIONS = [
  { value: "vegetarian", label: "Vegetarian" },
  { value: "non-vegetarian", label: "Non-Vegetarian" },
  { value: "vegan", label: "Vegan" },
];

export default function MealPreferenceModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
}: MealPreferenceModalProps) {
  const [selectedPreference, setSelectedPreference] = useState<string | null>(null);

  const handleConfirm = () => {
    onConfirm(selectedPreference);
  };

  const handleCancel = () => {
    setSelectedPreference(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Meal Preference
          </h2>
          <button
            onClick={handleCancel}
            disabled={isLoading}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-600 mb-6">
            Please select your meal preference for this event. This helps us accommodate dietary requirements and ensure everyone enjoys the catering.
          </p>

          {/* Meal Options */}
          <div className="space-y-3">
            {MEAL_OPTIONS.map((option) => (
              <label
                key={option.value || "none"}
                className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <input
                  type="radio"
                  name="mealPreference"
                  value={option.value || ""}
                  checked={selectedPreference === option.value}
                  onChange={(e) => setSelectedPreference(e.target.value || null)}
                  className="h-4 w-4 text-primary border-gray-300 focus:ring-primary focus:ring-2"
                  disabled={isLoading}
                />
                <span className="ml-3 text-gray-700 font-medium">
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
          <button
            onClick={handleCancel}
            disabled={isLoading}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className="px-6 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading && (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            {isLoading ? "Registering..." : "Register"}
          </button>
        </div>
      </div>
    </div>
  );
}
