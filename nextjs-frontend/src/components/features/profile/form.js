"use client";
import { updateProfile } from "@/actions/user";
import Loader from "@/components/common/loader";
import SuccessModel from "@/components/common/success-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useDropzoneHook from "@/hooks/use-dropzone";
import { profileSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircleUserRoundIcon, XIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const ProfileForm = () => {
  const { data: session, update } = useSession();
  const [successDialog, setSuccessDialog] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(profileSchema),
  });

  const { uploadedFile, previewUrl, error, isDragActive, isDragAccept, isDragReject, removeFile, clearError, cleanup, getRootProps, getInputProps, open } = useDropzoneHook({
    accept: { "image/*": [] },
    maxSize: 5 * 1024 * 1024, // 5MB
    onFileChange: (file) => {
      setValue("profile_image", file, { shouldValidate: true });
    },
    onFileRemove: () => {
      setValue("profile_image", null, { shouldValidate: true });
    },
    onError: (error) => {
      console.error("Upload error:", error);
    },
  });

  // Cleanup on unmount
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  const getBorderColor = () => {
    if (isDragReject) return "border-red-500";
    if (isDragAccept) return "border-green-500";
    if (isDragActive) return "border-blue-500";
    return "border-input";
  };

  const getBackgroundColor = () => {
    if (isDragActive) return "bg-accent/50";
    return "";
  };
  useEffect(() => {
    if (!session) return;

    setValue("first_name", session?.user?.first_name);
    setValue("last_name", session?.user?.last_name);
    setValue("email", session?.user?.email);
  }, [session]);

  const submitHandler = async (data) => {
    const formData = new FormData();
    formData.append("id", session?.user?.id);
    formData.append("first_name", data.first_name);
    formData.append("last_name", data.last_name);
    formData.append("email", data.email);

    if (getValues("profile_image")) {
      formData.append("profile_image", getValues("profile_image"));
    }

    const result = await updateProfile(formData);
    if (result?.status) {
      await update({ ...session?.user, ...result?.data });
      setSuccessDialog(result?.message);
    }
  };

  const dialogCloseHandler = () => {
    setSuccessDialog(null);
  };

  return (
    <div className="max-w-md mx-auto p-6  ">
      <form onSubmit={handleSubmit(submitHandler)} type="multipart/form-data">
        <div className="flex flex-col gap-6">
          <div className={`flex flex-col items-center gap-2`}>
            <div className="relative inline-flex">
              <button
                type="button"
                {...getRootProps()}
                className={`hover:bg-accent/50 focus-visible:border-ring focus-visible:ring-ring/50 relative flex size-16 items-center justify-center overflow-hidden rounded-full border border-dashed transition-colors outline-none focus-visible:ring-[3px] has-disabled:pointer-events-none has-disabled:opacity-50 has-[img]:border-none ${getBorderColor()} ${getBackgroundColor()}`}
                onClick={open}
                aria-label={previewUrl ? "Change image" : "Upload image"}>
                {previewUrl || session?.user?.profile_image ? (
                  <Image className="size-full object-cover" src={previewUrl || session?.user?.profile_image || "/placeholder.svg"} alt={uploadedFile?.name || "Uploaded image"} width={64} height={64} style={{ objectFit: "cover" }} />
                ) : (
                  <div aria-hidden="true">
                    <CircleUserRoundIcon className="size-4 opacity-60" />
                  </div>
                )}
              </button>

              {previewUrl && (
                <Button type="button" onClick={removeFile} size="icon" className="border-background focus-visible:border-background absolute -top-1 -right-1 size-6 rounded-full border-2 shadow-none" aria-label="Remove image">
                  <XIcon className="size-3.5" />
                </Button>
              )}

              <input {...getInputProps()} className="sr-only" aria-label="Upload image file" tabIndex={-1} />
            </div>
          </div>
          <div className="grid gap-3">
            <Label htmlFor="first_name">First Name</Label>
            <Input id="first_name" type="text" placeholder="First Name" {...register("first_name")} />
            {errors?.first_name && <p className="text-red-500">{errors.first_name.message}</p>}
          </div>

          <div className="grid gap-3">
            <Label htmlFor="last_name">Last Name</Label>
            <Input id="last_name" type="text" placeholder="Last Name" {...register("last_name")} />
            {errors?.last_name && <p className="text-red-500">{errors.last_name.message}</p>}
          </div>

          <div className="grid gap-3">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="text" readOnly placeholder="m@example.com" {...register("email")} />
            {errors?.email && <p className="text-red-500">{errors.email.message}</p>}
          </div>

          <div className="flex flex-col gap-3">
            <Button type="submit" className="w-full cursor-pointer" disabled={isSubmitting}>
              {isSubmitting && <Loader />} Save
            </Button>
          </div>
        </div>
      </form>
      {successDialog && <SuccessModel title={successDialog} successDialog={!!successDialog} dialogCloseHandler={dialogCloseHandler} />}
    </div>
  );
};
export default ProfileForm;
