"use client";

import { redirect } from "next/navigation";
import { z } from "zod/v4";

import { Button } from "@bite/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  useForm,
} from "@bite/ui/form";
import { Input } from "@bite/ui/input";
import { toast } from "@bite/ui/toast";

import { authClient } from "~/auth/client";

const schema = z.object({
  email: z.email(),
  password: z.string(),
});

type signInValues = z.infer<typeof schema>;

export const SignInForm = () => {
  const handleSignUp = async (values: signInValues) => {
    const { error } = await authClient.signIn.email({
      email: values.email,
      password: values.password,
      rememberMe: true,
    });
    if (error) {
      return toast.error(error.message);
    }
    redirect("/");
  };

  const form = useForm({
    schema: schema,
    defaultValues: {
      email: "",
      password: "",
    },
  });
  return (
    <Form {...form}>
      <form
        className="flex w-full max-w-80 flex-col gap-4"
        onSubmit={form.handleSubmit(async (data) => {
          await handleSignUp(data);
        })}
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input type="email" {...field} placeholder="email" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input type="password" {...field} placeholder="*********" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="text-white">Sign in</Button>
      </form>
    </Form>
  );
};
