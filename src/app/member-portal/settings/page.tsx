"use client";
import React, { useState } from "react";
import api from "@/utils/api";
import { Eye, EyeOff, Save } from "lucide-react";

const SettingsPage = () => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Password update state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);


  const handlePasswordUpdate = async () => {
    // Clear previous messages
    setPasswordError(null);
    setPasswordSuccess(null);

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("All password fields are required");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters long");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New password and confirm password do not match");
      return;
    }

    if (newPassword === currentPassword) {
      setPasswordError("New password must be different from current password");
      return;
    }

    setIsUpdatingPassword(true);

    try {
      // Call the API to update password using client helper
      await api.changeMyPassword(currentPassword, newPassword);

      setPasswordSuccess("Password updated successfully!");

      // Clear the form
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: unknown) {
      // Handle specific error cases
      let message = "Failed to update password. Please try again.";
      if (
        typeof err === "object" &&
        err !== null &&
        "message" in err &&
        typeof (err as { message?: unknown }).message === "string"
      ) {
        const errMsg = (err as { message: string }).message;
        if (/401|unauthorized/i.test(errMsg)) {
          setPasswordError("Current password is incorrect. Please try again.");
          return;
        }
        if (/400|validation/i.test(errMsg)) {
          message = "Invalid input. Check password requirements and try again.";
        } else {
          message = errMsg;
        }
      }
      setPasswordError(message);
    } finally {
      setIsUpdatingPassword(false);
    }
  };



  const renderSecuritySettings = () => (
    <div className="space-y-4 py-2">
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Change Password</h3>
          <p className="card-description">
            Update your password to keep your account secure
          </p>
        </div>
        <div className="card-content space-y-4">
          {/* Error and Success Messages */}
          {passwordError && (
            <div className="p-3 text-sm text-center text-red-800 bg-red-100 border border-red-200 rounded-lg">
              {passwordError}
            </div>
          )}
          {passwordSuccess && (
            <div className="p-3 text-sm text-center text-green-800 bg-green-100 border border-green-200 rounded-lg">
              {passwordSuccess}
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-foreground">
              Current Password
            </label>
            <div className="relative mt-1">
              <input
                type={showCurrentPassword ? "text" : "password"}
                className="input pr-10 border-border"
                placeholder="Enter current password"
                value={currentPassword}
                onChange={(e) => {
                  setCurrentPassword(e.target.value);
                  setPasswordError(null);
                  setPasswordSuccess(null);
                }}
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {showCurrentPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">
              New Password
            </label>
            <div className="relative mt-1">
              <input
                type={showNewPassword ? "text" : "password"}
                className="input pr-10 border-border"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  setPasswordError(null);
                  setPasswordSuccess(null);
                }}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {showNewPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">
              Confirm New Password
            </label>
            <div className="relative mt-1">
              <input
                type={showConfirmPassword ? "text" : "password"}
                className="input pr-10 border-border"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setPasswordError(null);
                  setPasswordSuccess(null);
                }}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
          <button
            className={`
              btn btn-primary
              flex items-center justify-center
              px-5 py-2
              rounded-lg
              font-semibold
              transition-colors
              duration-150
              shadow-sm
              focus:outline-none focus:ring-2 focus:ring-primary/50
              disabled:opacity-60 disabled:cursor-not-allowed
              mt-4
            `}
            onClick={handlePasswordUpdate}
            disabled={isUpdatingPassword}
            type="button"
          >
            {isUpdatingPassword ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                <span className="font-medium">Updating...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                <span className="font-medium">Update Password</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-4 animate-in fade-in">
      <div className="lg:col-span-3">{renderSecuritySettings()}</div>
    </div>
  );
};

export default SettingsPage;
