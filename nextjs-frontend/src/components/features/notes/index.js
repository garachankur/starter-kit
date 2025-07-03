"use client";
import React, { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";
import Loader from "@/components/common/loader";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight, Edit, MoreHorizontal, SearchIcon, Trash, X } from "lucide-react";
import { useReactTable, flexRender, getCoreRowModel, getFilteredRowModel } from "@tanstack/react-table";
import { useDebouncedCallback } from "use-debounce";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import routePath from "@/routes";
import { postRequest } from "@/lib/api";
import apiRoutes from "@/routes/api-route";
import AlertDialogModel from "@/components/common/alert-dialog";
import { deleteNoteAction } from "@/actions/notes";
import { toast } from "sonner";
import { successToast } from "@/lib/toaster";

const NoteList = (props) => {
  const isLoadingRef = useRef(true);
  const searchRef = useRef(null);
  const [columnFilters, setColumnFilters] = useState(null);
  const [isAlertOpen, setAlertOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [isSearching, startTransition] = useTransition();
  const [isApiLoading, startApiTransition] = useTransition();
  const [isDeleting, startDeleteTransition] = useTransition();
  const [pagesParam, setPagesParam] = useState({
    nextPage: null,
    limit: 10,
    prevPage: null,
    total: 0,
    totalPages: 0,
    startIndex: 0,
    endIndex: 0,
  });
  const [pageFilters, setPageFilters] = useState({
    page: 1,
    searchQuery: "",
    currentPage: "",
    limit: 10,
  });
  const [noteList, setNoteList] = useState([]);

  const [{ pageIndex, pageSize }, setPagination] = useState({
    pageIndex: 0, //initial page index
    pageSize: 10, //default page size
  });

  const filterHandler = (data) => {
    setColumnFilters(data);
    setPagination({ pageIndex: 0, pageSize: 10 });
  };

  const debouncedColumnFilters = useDebouncedCallback(filterHandler, 400);

  const columns = useMemo(
    () => [
      {
        header: "Title",
        accessorKey: "title",
      },
      {
        header: "Description",
        accessorKey: "description",
        cell: (row) => {
          return <div className="w-32 line-clamp-4 md:w-80">{row.getValue("description") ?? "-"}</div>;
        },
      },
      {
        header: "Actions",
        id: "action",
        cell: (row) => {
          return (
            <div className="">
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>

                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href={`${routePath.NOTE}/edit/${row?.row?.original?.id}`}>
                      <Edit className="mr-2 h-4 w-4" /> Edit
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem className="cursor-pointer" onClick={() => deleteHandler(row?.row?.original?.id)}>
                    <Trash className="mr-2 h-4 w-4" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
      },
    ],
    []
  );

  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
      columnFilters,
      ...pagesParam,
    }),
    [pageIndex, pageSize, columnFilters, pagesParam]
  );

  const tableLib = useReactTable({
    columns,
    data: noteList,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    manualSortBy: true,
    manualPagination: true,
    manualFiltering: true,
    pageCount: pagesParam?.totalPages,
    onPaginationChange: setPagination,
    onGlobalFilterChange: debouncedColumnFilters,
    state: { pagination },
  });

  const noteListHandler = useCallback(async () => {
    let params = pageFilters;
    params = { ...params, page: pageIndex + 1 };
    if (columnFilters) params = { ...params, searchQuery: columnFilters };
    startApiTransition(async () => {
      let result = await postRequest(apiRoutes.NOTE_LIST, params);
      if (result?.data) setNoteList(result?.data);
      if (result?.pagination) {
        const res = result?.pagination;
        setPagesParam({ ...pagesParam, nextPage: res?.nextPage, prevPage: res?.prevPage, total: res?.total, totalPages: res?.totalPages, startIndex: res?.startIndex, endIndex: res?.endIndex });
      }
    });
  }, [pageIndex, pageFilters, columnFilters]);

  useEffect(() => {
    startTransition(async () => {
      isLoadingRef.current = false;
      await noteListHandler();
    });
  }, [noteListHandler]);

  const clearFilterHandler = () => {
    setColumnFilters(null);
    searchRef.current.value = "";
    setPagination({ pageIndex: 0, pageSize: 10 });
  };

  const deleteHandler = (id) => {
    setAlertOpen(true);
    setDeleteId(id);
  };

  const alertDialogHandler = () => {
    setAlertOpen(false);
  };

  const alertDialogActionHandler = async (event) => {
    event.preventDefault();
    startDeleteTransition(async () => {
      const result = await deleteNoteAction(deleteId);
      if (result?.status) {
        successToast(result?.message);
        noteListHandler();
        setAlertOpen(false);
      }
    });
  };
  return (
    <div className="pt-6 container m-auto">
      <div className="flex flex-col flex-wrap">
        <div className="flex flex-col sm:flex-row">
          <div className="mr-3.5 md:max-w-[300px] mb-3.5">
            <div className="relative">
              <Input id="searchText" ref={searchRef} onChange={(e) => debouncedColumnFilters(e?.target?.value)} className="block w-full rounded-md  p-2 px-3  form-control min-h-[45px] pr-[40px]" placeholder="Search for Expense" type="text" />
              <div className="w-[24px] h-[24px] flex items-center absolute right-[15px] top-0 bottom-0 m-auto">
                {columnFilters ? (
                  <i className="cursor-pointer" onClick={() => clearFilterHandler()}>
                    <X className="w-full h-full object-contain object-center " />
                  </i>
                ) : (
                  <i>
                    <SearchIcon className="w-full h-full object-contain object-center" />
                  </i>
                )}
              </div>
            </div>
          </div>
          <Button className="ml-auto" size="sm" asChild>
            <Link href={routePath.ADD_NOTE}>Add Note</Link>
          </Button>
        </div>
        <div className="h-full rounded-lg  shadow-5xl">
          <div className="relative min-h-[400px] max-w-[300px] md:max-w-full overflow-x-auto">
            <Table className="border rounded-lg">
              <TableHeader className=" ">
                {tableLib.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead scope="col" className="px-4 py-4" key={header.id}>
                        {flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody className="relative">
                {tableLib.getRowModel()?.rows?.length == 0 && (
                  <TableRow className=" border-b dark:bg-gray-800 dark:border-gray-700">
                    <TableCell className="px-4 py-2 text-center" colSpan={columns?.length}>
                      {isSearching || isLoadingRef.current ? <Loader className="flex justify-center items-center min-h-[20px] m-auto" /> : "No records found"}
                    </TableCell>
                  </TableRow>
                )}
                {/* {tableLib.getRowModel()?.rows?.length == 0 && isApiLoading && (
                  <TableRow>
                    <TableCell colSpan={columns?.length} className="text-center">
                      <Loader className="min-h-[20px] m-auto" />
                    </TableCell>
                  </TableRow>
                )} */}
                {tableLib.getRowModel()?.rows?.length > 0 &&
                  tableLib.getRowModel().rows.map((row) => (
                    <TableRow key={row.id} className=" border-b dark:bg-gray-800 dark:border-gray-700">
                      {row.getVisibleCells().map((cell) => (
                        <TableCell className="px-4 py-2" key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
              </TableBody>
            </Table>

            {pagesParam.totalPages >= 1 && (
              <div className="flex justify-between mt-5 items-center">
                <p className="text-sm text-grey font-regular">
                  Showing {pagesParam?.startIndex}-{pagesParam?.endIndex} of {pagesParam?.total}
                </p>
                {pagesParam.totalPages > 1 && (
                  <div className=" border border-grey3 p-1 w-[70px] h-[30px] items-center flex justify-around rounded-lg">
                    <button disabled={!tableLib.getCanPreviousPage()} type="button" onClick={tableLib.previousPage} className="cursor-pointer  items-center flex justify-center">
                      <ChevronLeft className={`w-6 h-6 ${pagesParam?.prevPage == null && "text-[#959CA7]"}`} />
                    </button>
                    <button disabled={!tableLib.getCanNextPage()} type="button" onClick={tableLib.nextPage} className="cursor-pointer  items-center flex justify-center">
                      <ChevronRight className={`w-6 h-6 ${pagesParam?.nextPage == null && "text-[#959CA7]"}`} />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        {isAlertOpen && (
          <AlertDialogModel isAlertOpen={isAlertOpen} alertDialogHandler={alertDialogHandler} alertDialogActionHandler={alertDialogActionHandler} isDeleting={isDeleting} title="Delete this record?" description="This action cannot be undone" />
        )}
      </div>
    </div>
  );
};

export default NoteList;
