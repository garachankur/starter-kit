import NoteForm from "@/components/features/notes/form";
import { getRequest } from "@/lib/api";
import apiRoutes from "@/routes/api-route";
import React from "react";

const getNoteAction = async (id) => {
  const response = await getRequest(`${apiRoutes.NOTE_DETAIL}/${id}`);
  return response;
};
const ExpenseAdd = async ({ params }) => {
  const param = await params;
  const result = await getNoteAction(param.id);

  return (
    <div className="pt-6 container m-auto">
      <div className="flex flex-col flex-wrap">
        <h3 className="text-2xl font-semibold leading-none tracking-tight">Edit Note</h3>
      </div>
      <div className="pt-10">
        <NoteForm noteResult={result} />
      </div>
    </div>
  );
};

export default ExpenseAdd;
