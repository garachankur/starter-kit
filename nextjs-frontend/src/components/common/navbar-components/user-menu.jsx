"use client";
import { LogOutIcon, UserCheck } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { signOut, useSession } from "next-auth/react";
import routePath from "@/routes";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function UserMenu() {
  const { data: session } = useSession();

  const router = useRouter();
  const signOutHandler = async () => {
    await signOut({ redirect: false, callbackUrl: routePath.LOGIN });
    router.push(routePath.LOGIN);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-auto p-0 hover:bg-transparent cursor-pointer">
          <Avatar>
            <AvatarImage src={session?.user?.profile_image} alt="Profile image" />
            <AvatarFallback>{session?.user?.first_name?.substring(0, 1)?.toUpperCase()}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-w-64" align="end">
        <DropdownMenuLabel className="flex min-w-0 flex-col">
          <span className="text-foreground truncate text-sm font-medium">{session?.user?.first_name}</span>
          <span className="text-muted-foreground truncate text-xs font-normal">{session?.user?.email}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link href={routePath.PROFILE} className="cursor-pointer py-1 focus:bg-transparent">
          <DropdownMenuItem className="cursor-pointer py-1 focus:bg-transparent">
            <UserCheck size={16} className="opacity-60" aria-hidden="true" />
            <span>Profile</span>
          </DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer py-1 focus:bg-transparent" onClick={() => signOutHandler()}>
          <LogOutIcon size={16} className="opacity-60" aria-hidden="true" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
