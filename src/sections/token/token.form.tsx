"use client";

import React, { useState } from "react";
import { getAssociatedTokenAddressSync } from "@solana/spl-token";
import { Keypair, PublicKey } from "@solana/web3.js";
import { Program, BN } from "@coral-xyz/anchor";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

import { useFieldArray, useForm } from "react-hook-form";
import { DropzoneOptions } from "react-dropzone";
import { z } from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  FileInput,
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
} from "@/components/extension/file-uploader";
import { Button } from "@/components/ui/button";
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
import { cn } from "@/utils/functions";
import TokenButton from "./token.button";
import { TokenMetadata } from "@/types/token";
import idl from "@/idl/solana_program.json";
import { Image } from "@/components";
import { launchTokenTransaction } from "@/services/transactionServices";
import { POOL_REGISTRY_SEED } from "@/utils/constants";
import poolKey from "../../keys/pool_key.json";
import { metadata } from "@/app/layout";

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
};

const tokenProgramID = idl.address;
const opts = {
  preflightCommitment: "processed",
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

  const [token, setToken] = useState({
    tokenImageURL: "",
  });

  const dropZoneConfig = {
    multiple: true,
    maxFiles: 3,
    maxSize: 4 * 1024 * 1024,
  } satisfies DropzoneOptions;


  async function onSubmit(values: FormSchema) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    const iconUrl = await uploadImagePinata(values.icon);
    const bannerUrl = await uploadImagePinata(values.banner);
    const metadataUrl = await uploadMetaData({
      name: values.name,
      symbol: values.symbol,
      description: values.description,
      icon: iconUrl,
      banner: bannerUrl,
    });

    const provider = { connection, wallet };
    const program = new Program(idl as any, provider);

    let mintKeypair = Keypair.generate();

    const { name, symbol } = values;
    let createTokenTransaction = await launchTokenTransaction(name, symbol, metadataUrl, program, publicKey, mintKeypair, connection)
    if(!createTokenTransaction) return alert("Unable to send transaction");
    let txsig = await sendTransaction(createTokenTransaction, connection, {
      signers: [mintKeypair],
    });
    console.log("Successfully created token : ", `https://solscan.io/tx/${txsig}?cluster=devnet`)
  }

  async function uploadImagePinata(file: File) {
    if (file) {
      try {
        const formData = new FormData();
        formData.append("file", file);

        
        const response = await axios({
          method: "post",
          url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
          data: formData,
          headers: {
            pinata_api_key: process.env.NEXT_PUBLIC_PINATA_API_KEY,
            pinata_secret_api_key: process.env.NEXT_PUBLIC_PINATA_API_SECRET,
            "Content-Type": "multipart/form-data",
          },
        });

        const ImgHash = `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
        setToken({ ...token, tokenImageURL: ImgHash });
        return ImgHash;
      } catch (error: any) {
        alert({ type: "error", message: "Upload image failed" });
      }
    }
  }

  async function uploadMetaData(tokenInfo: TokenMetadata) {
    const data = JSON.stringify({
      name: tokenInfo.name,
      symbol: tokenInfo.symbol,
      description: tokenInfo.description,
      image: tokenInfo.icon,
      banner: tokenInfo.banner,
    });
    try {
      const response = await axios({
        method: "POST",
        url: "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        data: data,
        headers: {
          pinata_api_key: process.env.NEXT_PUBLIC_PINATA_API_KEY,
          pinata_secret_api_key: process.env.NEXT_PUBLIC_PINATA_API_SECRET,
          "Content-Type": "application/json",
        },
      });

      const url = `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;

      return url;
    } catch (error: any) {
      alert({ type: "error", message: "Upload failed" });
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
                                objectFit: "contain"
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
                    onValueChange={(values) => field.onChange(values ? values[0] : null)}
                    dropzoneOptions={{...dropZoneConfig, maxFiles: 1}}
                    className="relative space-y-1 max-w-full"
                  >
                    <FileInput>
                      <FileUploaderContent className="h-36 bg-white bg-opacity-10">
                        {field.value && (
                          <FileUploaderItem index={0} className="p-0 !h-full !w-full">
                            <Image
                              src={URL.createObjectURL(field.value)}
                              alt={field.value.name}
                              className="object-cover rounded-md"
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
          <Checkbox id="terms" />
          <label
            htmlFor="terms"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
          >
            I agree to the ShortBlast <span className="underline">Terms and Conditions</span> and{" "}
            <span className="underline">Token Profile Policy</span>.
          </label>
        </div>

        <TokenButton />
      </form>
    </Form>
  );
};

export default TokenForm;
