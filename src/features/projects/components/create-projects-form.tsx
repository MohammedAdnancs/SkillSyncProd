"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { createProjectSchema } from "../schema";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { DottedSeparator } from "@/components/dotted-separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useCreateProject } from "../api/use-create-projects";
import { useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { ImageIcon, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { TechStackSelector } from "./tech-stack-selector";
import { Badge } from "@/components/ui/badge";

interface CreateProjectFormProps {
  onCancel?: () => void;
}

export const CreateProjectForm = ({ onCancel }: CreateProjectFormProps) => {
  const workspaceId = useWorkspaceId();
  const router = useRouter();
  const { mutate, isPending } = useCreateProject();
  const inputRef = useRef<HTMLInputElement>(null);
  const [techSelectorOpen, setTechSelectorOpen] = useState(false);
  const form = useForm<z.infer<typeof createProjectSchema>>({
    resolver: zodResolver(createProjectSchema.omit({ workspaceId: true })),
    defaultValues: {
      name: "",
      description: "",
      ProjectTechStack: [],
    },
  });

  const onSubmit = (values: z.infer<typeof createProjectSchema>) => {
    const finalValues = {
      ...values,
      workspaceId,
      image: values.image instanceof File ? values.image : "",
      ProjectTechStack: values.ProjectTechStack,
    };

    mutate({ form: { ...finalValues, ProjectTechStack: values.ProjectTechStack.join(",") } }, {
      onSuccess: ({ data }) => {
        form.reset();
        router.push(`/workspaces/${workspaceId}/projects/${data.$id}`);
      },
    });
  };

  const handelImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("image", file);
    }
  };

  // Get the current selected tech stack
  const selectedTechStack = form.watch("ProjectTechStack") || [];

  // Handle tech stack selection
  const handleTechStackSelection = (selected: string[]) => {
    form.setValue("ProjectTechStack", selected);
  };

  return (
    <Card className="w-full h-full border-none shadow-none">
      <CardHeader className="flex p-7">
        <CardTitle className="text-xl font-bold">
          Create a new project!
        </CardTitle>
      </CardHeader>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-y-4">              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Project Name
                    </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Project name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Project Description
                    </FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        placeholder="Add a description about your project (goals, objectives, etc.)" 
                        className="resize-none min-h-[100px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="ProjectTechStack"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Tech Stack</FormLabel>
                    <div className="flex flex-col gap-2">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setTechSelectorOpen(true)}
                        className="flex justify-between w-full"
                      >
                        <span className={cn(field.value.length === 0 && "text-muted-foreground")}>
                          {field.value.length > 0 
                            ? `${field.value.length} technologies selected` 
                            : "Select technologies for your project"}
                        </span>
                        <Plus size={16} />
                      </Button>
                      
                      {field.value.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-1.5">
                          {field.value.map((tech) => (
                            <Badge key={tech} variant="secondary">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      )}
                      
                      <TechStackSelector
                        open={techSelectorOpen}
                        onOpenChange={setTechSelectorOpen}
                        selectedTech={field.value}
                        onSelect={handleTechStackSelection}
                      />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <div className="flex flex-col gap-y-2">
                    <div className="flex items-center gap-x-5">
                      {field.value ? (
                        <div className="size-[72px] relative rounded-md overflow-hidden">
                          <Image
                            alt="Logo"
                            fill
                            className="object-cover"
                            src={
                              field.value instanceof File
                                ? URL.createObjectURL(field.value)
                                : field.value
                            }
                          />
                        </div>
                      ) : (
                        <Avatar className="size-[72px]">
                          <AvatarFallback>
                            <ImageIcon className="size-[36px] text-neutral-400" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div className="flex flex-col">
                        <p className="text-sm">Project Icon</p>
                        <p className="text-sm text-muted-foreground">JPG, PNG, SVG or JPEG & max 1MB</p>
                        <Input
                          className="hidden"
                          type="file"
                          accept=".jpg, .png, .svg, .jpeg"
                          ref={inputRef}
                          onChange={handelImageChange}
                          disabled={isPending}
                        />
                        {field.value ? (
                          <Button
                            type="button"
                            disabled={isPending}
                            variant="destructive"
                            size="xs"
                            className="w-fit mt-2"
                            onClick={() => {
                              field.onChange(null);
                              if (inputRef.current) {
                                inputRef.current.value = "";
                              }
                            }}
                          >
                            remove Image
                          </Button>
                        ) : (                          <Button
                            type="button"
                            disabled={isPending}
                            variant="outline"
                            size="xs"
                            className="w-fit mt-2"
                            onClick={() => inputRef.current?.click()}
                          >
                            Upload Image
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              />
            </div>
            <DottedSeparator className="py-7" />
            <div className="flex items-center justify-between">
              <Button
                type="button"
                size="lg"
                variant="secondary"
                onClick={onCancel}
                disabled={isPending}
                className={cn(!onCancel && "invisible")}
              >
                Cancel
              </Button>
              <Button type="submit" size="lg" disabled={isPending}>
                Create Project
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
