"use client";

import React, { useState } from "react";

import { Keypair } from "@solana/web3.js";
import { Program } from "@coral-xyz/anchor";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

import { Id, toast } from "react-toastify";
import { useFieldArray, useForm } from "react-hook-form";
import { DropzoneOptions } from "react-dropzone";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  FileInput,
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
} from "@/components/extension/file-uploader";
import Button from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn, getErrorMessage } from "@/utils/functions";
import TokenButton from "./token.button";
import idl from "@/idl/solana_program.json";
import { Image } from "@/components";
import { launchTokenTransaction } from "@/services/transactionServices";
import { uploadImagePinata, uploadMetaData } from "@/utils/web3";
import Notification from "@/components/Notification";

const schema = z.object({
  symbol: z.string(),
  name: z.string(),
  description: z.string().optional(),
  urls: z
    .array(
      z.object({
        value: z.string().url({ message: "Please enter a valid URL." }),
      })
    )
    .optional(),
  initialBuy: z.string().optional(),
  icon: z.any().nullable(),
  // icon: z
  //   .instanceof(File)
  //   .refine((file) => file.size < 4 * 1024 * 1024, {
  //     message: "File size must be less than 4MB",
  //   })
  //   .nullable(),
  banner: z.any().nullable(),
  // banner: z
  //   .instanceof(File)
  //   .refine((file) => file.size < 4 * 1024 * 1024, {
  //     message: "File size must be less than 4MB",
  //   })
  //   .nullable(),
});

type FormSchema = z.infer<typeof schema>;
const defaultValues: Partial<FormSchema> = {
  urls: [
    {
      value: "",
    },
  ],
  icon: null,
  banner: null,
  initialBuy: "0"
};

const TokenForm = () => {
  const form = useForm<FormSchema>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: "onChange",
  });

  const { fields, append } = useFieldArray({
    name: "urls",
    control: form.control,
  });

  const { connection } = useConnection();
  const { publicKey, sendTransaction, wallet } = useWallet();

  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const dropZoneConfig = {
    multiple: true,
    maxFiles: 3,
    maxSize: 4 * 1024 * 1024,
  } satisfies DropzoneOptions;

  async function onSubmit(values: FormSchema) {
    setLoading(true);
    let toastId: Id = "";
    try {
      toastId = Notification({
        type: "warn",
        title: "Uploading metadata",
      });
      toast.update(toastId, { autoClose: false, closeButton: false });

      const iconUrl = await uploadImagePinata(values.icon);
      const bannerUrl = await uploadImagePinata(values.banner);
      const metadataUrl = await uploadMetaData({
        name: values.name,
        symbol: values.symbol,
        description: values.description,
        icon: iconUrl,
        banner: bannerUrl,
      });
      toast.done(toastId);

      const provider = { connection, wallet };
      const program = new Program(idl as any, provider);

      let mintKeypair = Keypair.generate();

      const { name, symbol } = values;
      const createTokenTransaction = await launchTokenTransaction(
        name,
        symbol,
        metadataUrl,
        program,
        publicKey,
        mintKeypair,
        connection,
        Number(values.initialBuy)
      );
      if (!createTokenTransaction) throw new Error("Unable to send transaction");

      const signature = await sendTransaction(createTokenTransaction, connection, {
        signers: [mintKeypair],
        skipPreflight: true,
      });

      const txLink = `https://explorer.solana.com/tx/${signature}?cluster=devnet`;
      toastId = Notification({
        type: "warn",
        title: "Processing transaction",
        txLink,
      });
      toast.update(toastId, { autoClose: false, closeButton: false });

      const confirmation = await connection.confirmTransaction(signature);

      if (confirmation.value.err) {
        console.error("Transaction failed:", confirmation.value.err);
      } else {
        console.log("Transaction successful:", confirmation);
      }

      Notification({
        type: "success",
        title: "Successfully created token",
        txLink,
      });
    } catch (err) {
      Notification({
        type: "error",
        message: getErrorMessage(err),
      });
    } finally {
      setLoading(false);
      toast.done(toastId);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        <div className="space-y-8">
          <FormField
            control={form.control}
            name="symbol"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Token Symbol</FormLabel>
                <FormControl>
                  <Input {...field} />
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
                <FormLabel>Token Name</FormLabel>
                <FormControl>
                  <Input {...field} />
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
                <FormLabel>Description</FormLabel>
                <FormControl>
                  {/* <Input {...field} /> */}
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-col md:flex-row gap-3 w-full">
            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem className="w-full max-w-48">
                  <FormLabel>Icon</FormLabel>
                  <FileUploader
                    value={field.value ? [field.value] : null}
                    onValueChange={(values) => {
                      field.onChange(values ? values[values.length - 1] : null);
                    }}
                    dropzoneOptions={dropZoneConfig}
                    className="relative space-y-1"
                  >
                    <FileInput>
                      <FileUploaderContent className="h-36 bg-white bg-opacity-10">
                        {field.value && (
                          <FileUploaderItem index={0} className="p-0 !h-full !w-full">
                            <Image
                              src={URL.createObjectURL(field.value)}
                              style={{
                                objectFit: "contain",
                              }}
                              alt={field.value.name}
                              className="rounded-md w-full h-full"
                              fill
                            />
                          </FileUploaderItem>
                        )}
                      </FileUploaderContent>
                    </FileInput>
                  </FileUploader>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="banner"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Banner</FormLabel>
                  <FileUploader
                    value={field.value ? [field.value] : null}
                    onValueChange={(values) => {
                      field.onChange(values ? values[values.length - 1] : null);
                    }}
                    dropzoneOptions={dropZoneConfig}
                    className="relative space-y-1"
                  >
                    <FileInput>
                      <FileUploaderContent className="h-36 bg-white bg-opacity-10">
                        {field.value && (
                          <FileUploaderItem index={0} className="p-0 !h-full !w-full">
                            <Image
                              src={URL.createObjectURL(field.value)}
                              alt={field.value.name}
                              className="rounded-md w-full h-full"
                              fill
                            />
                          </FileUploaderItem>
                        )}
                      </FileUploaderContent>
                    </FileInput>
                  </FileUploader>
                </FormItem>
              )}
            />
          </div>
          <div>
            {fields.map((field, index) => (
              <FormField
                control={form.control}
                key={field.id}
                name={`urls.${index}.value`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={cn(index !== 0 && "sr-only")}>URLs</FormLabel>
                    <FormDescription className={cn(index !== 0 && "sr-only")}>
                      Add links to your website, blog, or social media profiles.
                    </FormDescription>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => append({ value: "" })}
            >
              Add URL
            </Button>
          </div>

          <FormField
            control={form.control}
            name="initialBuy"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Initial Buy</FormLabel>
                <FormDescription>
                  Optional: be the very first person to buy your token
                </FormDescription>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex items-center justify-center space-x-2 !mt-8">
          <Checkbox
            id="terms"
            checked={agreed}
            onCheckedChange={(value) => setAgreed(value as boolean)}
          />
          <label
            htmlFor="terms"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
          >
            I agree to the ShortBlast <span className="underline">Terms and Conditions</span> and{" "}
            <span className="underline">Token Profile Policy</span>.
          </label>
        </div>

        <TokenButton loading={loading} disabled={!agreed || loading} />
      </form>
    </Form>
  );
};

export default TokenForm;
