"use client";

import { use, useEffect, useState } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
    Dialog,
    DialogHeader,
    DialogContent,
    DialogFooter,
    DialogDescription,
    DialogTitle,

} from "../ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormLabel,
    FormItem,
    FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

// Form validation schema
const formSchema = z.object({
    name: z.string().min(1, {
        message: "Server name is required",
    }),
    imageUrl: z.string().min(1, {
        message: "Server icon is required",
    }),
});

export const InitialModal = () => {

    // Use a state to check if the component is mounted
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        // Set the component as mounted
        setIsMounted(true);
    }
        , []);

    // Use react-hook-form to manage the form state
    const form = useForm({
        resolver: zodResolver(formSchema), // Use the zod resolver to validate the form
        defaultValues: {
            name: "",
            imageUrl: "",
        },
    });

    // Check if the form is submitting
    const isLoading = form.formState.isSubmitting;

    // Handle the form submission
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        console.log(values);
    };

    // If the component is not mounted, return null
    if (!isMounted) {
        return null;
    }

    return (
        <Dialog open>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Customize your Server
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">
                        Give your server a personality with a name and an icon. You can always change these later.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-8">
                        <div className="space-y-8 px-6">
                            <div className="flex items-center justify-center text-center">
                                TODO: Image Upload
                            </div>

                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">Server Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isLoading}
                                                className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                                                placeholder="Enter Server Name"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <DialogFooter className="bg-gray-100 px-6 py-4">
                            <Button variant={"primary"} disabled={isLoading}>
                                Create
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};