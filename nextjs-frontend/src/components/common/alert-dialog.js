"use client";

import { CircleAlertIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Loader from "./loader";

export default function AlertDialogModel({ title = "", description = "", alertDialogHandler, alertDialogActionHandler, isAlertOpen, isDeleting = false }) {
  return (
    <Dialog open={isAlertOpen} onOpenChange={alertDialogHandler}>
      <DialogContent>
        <div className="flex flex-col items-center gap-2">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full border" aria-hidden="true">
            <CircleAlertIcon className="opacity-80" size={16} />
          </div>
          <DialogHeader>
            <DialogTitle className="sm:text-center">{title}</DialogTitle>
            <DialogDescription className="sm:text-center">{description}</DialogDescription>
          </DialogHeader>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" className="flex-1 cursor-pointer" disabled={isDeleting} onClick={alertDialogHandler}>
            Cancel
          </Button>

          <Button type="button" className="flex-1 cursor-pointer" onClick={alertDialogActionHandler} disabled={isDeleting}>
            {isDeleting && <Loader />} Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
