"use client";

import Head from "next/head";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Image } from "@/components";

const subscribeSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});

type SubscribeFormInputs = z.infer<typeof subscribeSchema>;

const ComingSoonPage = () => {
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SubscribeFormInputs>({
    resolver: zodResolver(subscribeSchema),
  });

  const onSubmit: SubmitHandler<SubscribeFormInputs> = (data) => {
    setSubmitted(true);
  };

  return (
    <main className="flex flex-col items-center px-4 md:px-24 pt-[200px] md:pt-[300px]">
      <div className="max-w-5xl w-full">
        <div className="flex flex-col justify-center items-center">
          <Image src={"/ShortBlast_Logo.png"} width={220} height={220} alt="icon" />
          <div className="h-[400px] mt-8 text-5xl md:text-8xl font-bold bg-gradient-to-r from-white to-rose-400 bg-clip-text text-transparent">
            Coming Soon..
          </div>
        </div>
      </div>
    </main>
  );
};

export default ComingSoonPage;
