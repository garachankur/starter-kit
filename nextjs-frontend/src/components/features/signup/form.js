"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema } from "@/lib/validation";
import Loader from "@/components/common/loader";
import { useRouter } from "next/navigation";
import routePath from "@/routes";
import Link from "next/link";
import { signup } from "@/actions/user";
import SuccessModel from "@/components/common/success-dialog";
import { useState } from "react";

export function SignupForm({ className, ...props }) {
  const [successDialog, setSuccessDialog] = useState(null);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(signupSchema),
  });

  const router = useRouter();

  const submitHandler = async (data) => {
    const result = await signup(data);
    if (result?.status) {
      setSuccessDialog(result?.message);
      //   router.push(routePath.LOGIN);
    }
  };
  const dialogCloseHandler = (open) => {
    router.push(routePath.LOGIN);
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Signup </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(submitHandler)}>
            <div className="flex flex-col gap-6">
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
                <Input id="email" type="text" placeholder="Email" {...register("email")} />
                {errors?.email && <p className="text-red-500">{errors.email.message}</p>}
              </div>

              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input id="password" type="password" {...register("password")} />
                {errors?.password && <p className="text-red-500">{errors.password.message}</p>}
              </div>

              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="confirm_password">Confirm Password</Label>
                </div>
                <Input id="confirm_password" placeholder="Confirm Password" type="password" {...register("confirm_password")} />
                {errors?.confirm_password && <p className="text-red-500">{errors.confirm_password.message}</p>}
              </div>

              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full cursor-pointer" disabled={isSubmitting}>
                  {isSubmitting && <Loader />} Signup
                </Button>
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link href={routePath.LOGIN} className="underline underline-offset-4">
                Login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
      {successDialog && <SuccessModel title={successDialog} successDialog={!!successDialog} dialogCloseHandler={dialogCloseHandler} />}
    </div>
  );
}
