"use client";

import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";

export const useDropzoneHook = (options = {}) => {
  const {
    accept = { "image/*": [] },
    maxSize = 5 * 1024 * 1024, // 5MB default
    onFileChange,
    onFileRemove,
    onError,
    disabled = false,
    multiple = false,
  } = options;

  const [uploadedFile, setUploadedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState(null);

  // Format bytes utility
  const formatBytes = useCallback((bytes, decimals = 2) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${Number.parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  }, []);

  const onDrop = useCallback(
    (acceptedFiles, rejectedFiles) => {
      // Clear previous errors
      setError(null);

      // Handle rejected files
      if (rejectedFiles.length > 0) {
        const rejection = rejectedFiles[0];
        let errorMessage = "File upload failed";

        if (rejection.errors) {
          const error = rejection.errors[0];
          if (error.code === "file-too-large") {
            errorMessage = `File is too large. Maximum size is ${formatBytes(maxSize)}`;
          } else if (error.code === "file-invalid-type") {
            errorMessage = "Invalid file type. Please select an image";
          } else {
            errorMessage = error.message;
          }
        }

        setError(errorMessage);
        onError?.(errorMessage);
        return;
      }

      // Handle accepted files
      if (acceptedFiles && acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        setUploadedFile(file);

        // Create preview URL for images
        if (file.type.startsWith("image/")) {
          const url = URL.createObjectURL(file);
          setPreviewUrl(url);
        }

        // Call callback
        onFileChange?.(file);
      }
    },
    [maxSize, onFileChange, onError, formatBytes]
  );

  const removeFile = useCallback(() => {
    // Clean up preview URL if it exists
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    // Reset state
    setUploadedFile(null);
    setPreviewUrl(null);
    setError(null);

    // Call callback
    onFileRemove?.();
  }, [previewUrl, onFileRemove]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // React-dropzone configuration
  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject, open } = useDropzone({
    onDrop,
    accept,
    multiple,
    maxSize,
    disabled,
    noClick: true,
    noKeyboard: true,
  });

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return {
    // State
    uploadedFile,
    previewUrl,
    error,
    isDragActive,
    isDragAccept,
    isDragReject,

    // Actions
    removeFile,
    clearError,
    open,

    // Dropzone props
    getRootProps,
    getInputProps,

    // Utilities
    formatBytes,
  };
};

export default useDropzoneHook;
