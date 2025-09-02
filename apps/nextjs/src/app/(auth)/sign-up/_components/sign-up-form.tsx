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
  name: z.string(),
  email: z.email(),
  password: z.string(),
});

type signUpValues = z.infer<typeof schema>;

export const SignUpForm = () => {
  const handleSignUp = async (values: signUpValues) => {
    const { error } = await authClient.signUp.email(values);
    if (error) {
      return toast(error.message);
    }
    redirect("/");
  };

  const form = useForm({
    schema: schema,
    defaultValues: {
      email: "",
      name: "",
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} placeholder="username" />
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
        <Button className="text-white">Sign up</Button>
      </form>
    </Form>
  );
};
