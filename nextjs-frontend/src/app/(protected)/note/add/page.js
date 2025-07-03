import NoteForm from "@/components/features/notes/form";
import React from "react";

const ExpenseAdd = async () => {
  return (
    <div className="pt-6 container m-auto">
      <div className="flex flex-col flex-wrap">
        <h3 className="text-2xl font-semibold leading-none tracking-tight">Add Note</h3>
      </div>
      <div className="pt-10">
        <NoteForm formType="add" />
      </div>
    </div>
  );
};

export default ExpenseAdd;
