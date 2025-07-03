"use client";

import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function ErrorModel({ errorDialog, dialogCloseHandler, title }) {
  return (
    <Dialog open={errorDialog} onOpenChange={dialogCloseHandler}>
      <DialogContent className="sm:max-w-[425px]">
        <div className="flex flex-col items-center space-y-4 py-8">
          <div className="rounded-full bg-red-100 p-4 dark:bg-red-900">
            <XIcon className="h-6 w-6 text-red-500 dark:text-red-400" />
          </div>
          <div className="space-y-2 text-center">
            <DialogTitle>Error!</DialogTitle>
            <DialogDescription className={"font-semibold"}>{title}</DialogDescription>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" onClick={() => dialogCloseHandler(false)} className="font-semibold w-full rounded-sm cursor-pointer">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function XIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m18 6-12 12" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
