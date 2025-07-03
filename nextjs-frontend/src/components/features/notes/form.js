"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { notesSchema } from "@/lib/validation";
import Loader from "@/components/common/loader";

import { useRouter } from "next/navigation";
import routePath from "@/routes";
import { Textarea } from "@/components/ui/textarea";
import { addNoteAction, updateNoteAction } from "@/actions/notes";
import SuccessModel from "@/components/common/success-dialog";
import ErrorModel from "@/components/common/error-dialog";

const NoteForm = (props) => {
  const { noteResult } = props;
  const router = useRouter();
  const [successDialog, setSuccessDialog] = useState(false);
  const [errorDialog, setErrorDialog] = useState(null);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: zodResolver(notesSchema),
  });

  useEffect(() => {
    if (!noteResult) return;
    let notes = noteResult?.data;
    setValue("title", notes.title);
    setValue("description", notes.description);
  }, [noteResult]);

  const submitHandler = async (values) => {
    let result = null;
    if (noteResult) result = await updateNoteAction(noteResult?.data.id, values);
    else result = await addNoteAction(values);

    if (result?.status) setSuccessDialog(true);
    else setErrorDialog(result?.message);
  };

  const dialogCloseHandler = () => {
    if (!noteResult) {
      reset();
      setSuccessDialog(false);
      return;
    }
    router.push(routePath.NOTE);
  };
  const dialogErrorCloseHandler = () => {
    setErrorDialog(null);
  };
  return (
    <div className="w-full md:w-1/2">
      <form onSubmit={handleSubmit(submitHandler)}>
        <div className="mb-4">
          <Label htmlFor="title">Title</Label>
          <Input type="text" id="title" className="mt-1" {...register("title", { required: true })} placeholder="Enter Title" />
          {errors?.title?.message && <span className="text-red-600">{errors?.title?.message}</span>}
        </div>
        <div className="mb-4">
          <div className="relative">
            <Label htmlFor="note">Description</Label>
            <Textarea placeholder="Enter Description" className="resize-none" {...register("description", { required: true })} control={control} />
          </div>
          <div>{errors?.description?.message && <span className="text-red-600">{errors?.description?.message}</span>}</div>
        </div>

        <div className="mb-4 gap-3 flex flex-col md:flex-row md:gap-0">
          <Button disabled={isSubmitting} type="submit" className="cursor-pointer w-full md:w-auto mr-2">
            {isSubmitting && <Loader />}
            Save
          </Button>
          <Button type="button" disabled={isSubmitting} className="w-full md:w-auto cursor-pointer" variant="outline" onClick={() => router.push(routePath.NOTE)}>
            Cancel
          </Button>
        </div>
      </form>

      {successDialog && <SuccessModel title={noteResult ? "Note updated successfully" : "Note added successfully"} successDialog={successDialog} dialogCloseHandler={dialogCloseHandler} />}

      {errorDialog && <ErrorModel title={errorDialog} errorDialog={!!errorDialog} dialogCloseHandler={dialogErrorCloseHandler} />}
    </div>
  );
};

export default NoteForm;
