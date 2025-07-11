"use client";

import { useState, useCallback, useEffect, useRef } from "react";
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
    maxFiles = multiple ? 10 : 1,
  } = options;

  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Use ref to track preview URLs for cleanup
  const previewUrlsRef = useRef([]);

  // Memoized format bytes utility
  const formatBytes = useCallback((bytes, decimals = 2) => {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${Number.parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  }, []);

  // Cleanup preview URLs helper
  const cleanupPreviewUrls = useCallback((urlsToCleanup = null) => {
    const urls = urlsToCleanup || previewUrlsRef.current;

    urls.forEach((url) => {
      if (url) {
        try {
          URL.revokeObjectURL(url);
        } catch (err) {
          console.warn("Failed to revoke object URL:", err);
        }
      }
    });

    if (!urlsToCleanup) {
      previewUrlsRef.current = [];
    }
  }, []);

  // Create preview URL for a single file
  const createPreviewUrl = useCallback((file) => {
    if (file.type.startsWith("image/")) {
      try {
        return URL.createObjectURL(file);
      } catch (err) {
        console.error("Failed to create object URL:", err);
        return null;
      }
    }
    return null;
  }, []);

  // Process files and create previews
  const processFiles = useCallback(
    (files) => {
      setIsProcessing(true);

      const processedFiles = files.map((file) => ({
        file,
        id: `${file.name}-${file.size}-${Date.now()}-${Math.random()}`,
        previewUrl: createPreviewUrl(file),
      }));

      // Update refs for cleanup
      const newPreviewUrls = processedFiles.map((item) => item.previewUrl).filter(Boolean);
      previewUrlsRef.current = [...previewUrlsRef.current, ...newPreviewUrls];

      setIsProcessing(false);
      return processedFiles;
    },
    [createPreviewUrl]
  );

  const onDrop = useCallback(
    (acceptedFiles, rejectedFiles) => {
      // Clear previous errors
      setError(null);

      // Handle rejected files
      if (rejectedFiles.length > 0) {
        const rejection = rejectedFiles[0];
        let errorMessage = "File upload failed";

        if (rejection.errors?.length > 0) {
          const error = rejection.errors[0];
          switch (error.code) {
            case "file-too-large":
              errorMessage = `File is too large. Maximum size is ${formatBytes(maxSize)}`;
              break;
            case "file-invalid-type":
              errorMessage = "Invalid file type. Please select valid files";
              break;
            case "too-many-files":
              errorMessage = `Too many files. Maximum allowed is ${maxFiles}`;
              break;
            default:
              errorMessage = error.message || errorMessage;
          }
        }

        setError(errorMessage);
        onError?.(errorMessage);
        return;
      }

      // Handle accepted files
      if (acceptedFiles?.length > 0) {
        const currentFileCount = uploadedFiles.length;
        const newFileCount = acceptedFiles.length;

        // Check if adding new files would exceed maxFiles
        if (currentFileCount + newFileCount > maxFiles) {
          const errorMessage = `Cannot add ${newFileCount} files. Maximum allowed is ${maxFiles} (currently have ${currentFileCount})`;
          setError(errorMessage);
          onError?.(errorMessage);
          return;
        }

        let processedFiles;
        if (multiple) {
          processedFiles = processFiles(acceptedFiles);
          // Add to existing files
          setUploadedFiles((prev) => [...prev, ...processedFiles]);
          setPreviewUrls((prev) => [...prev, ...processedFiles.map((item) => item.previewUrl)]);
        } else {
          // Replace existing file (single mode)
          cleanupPreviewUrls();
          processedFiles = processFiles(acceptedFiles);
          setUploadedFiles(processedFiles);
          setPreviewUrls(processedFiles.map((item) => item.previewUrl));
        }

        // Call callback with files
        const files = multiple ? [...uploadedFiles.map((item) => item.file), ...acceptedFiles] : acceptedFiles;
        onFileChange?.(multiple ? files : files[0]);
      }
    },
    [uploadedFiles, maxSize, maxFiles, multiple, onFileChange, onError, formatBytes, processFiles, cleanupPreviewUrls]
  );

  // Remove single file by ID
  const removeFile = useCallback(
    (fileId = null) => {
      try {
        if (!multiple && !fileId) {
          // Remove all files (single mode)
          cleanupPreviewUrls();
          setUploadedFiles([]);
          setPreviewUrls([]);
          setError(null);
          onFileRemove?.();
          return;
        }

        if (multiple && fileId) {
          // Remove specific file by ID
          setUploadedFiles((prev) => {
            const fileToRemove = prev.find((item) => item.id === fileId);
            if (fileToRemove?.previewUrl) {
              cleanupPreviewUrls([fileToRemove.previewUrl]);
            }

            const newFiles = prev.filter((item) => item.id !== fileId);

            // Update preview URLs ref
            previewUrlsRef.current = previewUrlsRef.current.filter((url) => url !== fileToRemove?.previewUrl);

            return newFiles;
          });

          setPreviewUrls((prev) => {
            const updatedUrls = prev.filter((_, index) => {
              const fileItem = uploadedFiles[index];
              return fileItem?.id !== fileId;
            });
            return updatedUrls;
          });

          onFileRemove?.(fileId);
        } else if (multiple && !fileId) {
          // Remove all files (multiple mode)
          cleanupPreviewUrls();
          setUploadedFiles([]);
          setPreviewUrls([]);
          setError(null);
          onFileRemove?.();
        }
      } catch (err) {
        console.error("Error removing file:", err);
      }
    },
    [multiple, uploadedFiles, cleanupPreviewUrls, onFileRemove]
  );

  // Remove all files
  const removeAllFiles = useCallback(() => {
    removeFile();
  }, [removeFile]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Check if max files reached
  const isMaxFilesReached = useCallback(() => {
    return uploadedFiles.length >= maxFiles;
  }, [uploadedFiles.length, maxFiles]);

  // React-dropzone configuration
  const dropzoneConfig = {
    onDrop,
    accept,
    multiple,
    maxSize,
    maxFiles,
    disabled: disabled || (multiple && isMaxFilesReached()),
    noClick: true,
    noKeyboard: true,
  };

  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject, open } = useDropzone(dropzoneConfig);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupPreviewUrls();
    };
  }, [cleanupPreviewUrls]);

  // React 19 feature: Enhanced state management with automatic batching
  const batchedStateUpdate = useCallback((updates) => {
    // React 19 automatically batches these state updates
    Object.entries(updates).forEach(([key, value]) => {
      switch (key) {
        case "files":
          setUploadedFiles(value);
          break;
        case "previews":
          setPreviewUrls(value);
          break;
        case "error":
          setError(value);
          break;
        case "processing":
          setIsProcessing(value);
          break;
      }
    });
  }, []);

  // Return different preview URL format based on multiple flag
  const getPreviewUrl = () => {
    if (multiple) {
      return previewUrls; // Return array for multiple files
    } else {
      return previewUrls[0] || null; // Return single string or null for single file
    }
  };

  return {
    // State
    uploadedFiles: uploadedFiles.map((item) => item.file), // Return just the files for backward compatibility
    uploadedFileItems: uploadedFiles, // Return full items with IDs and preview URLs
    previewUrl: multiple ? undefined : getPreviewUrl(), // Single file preview URL (string or null)
    previewUrls: multiple ? getPreviewUrl() : undefined, // Multiple files preview URLs (array)
    error,
    isDragActive,
    isDragAccept,
    isDragReject,
    isProcessing,
    isMaxFilesReached: isMaxFilesReached(),

    // Actions
    removeFile,
    removeAllFiles,
    clearError,
    open,
    batchedStateUpdate,

    // Dropzone props
    getRootProps,
    getInputProps,

    // Utilities
    formatBytes,

    // Configuration
    maxFiles,
    multiple,
  };
};

export default useDropzoneHook;
