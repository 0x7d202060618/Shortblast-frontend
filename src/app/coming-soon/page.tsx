"use client";

import Head from "next/head";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
    <div className="mt-[10%] flex items-center justify-center">
      <Head>
        <title>Coming Soon</title>
        <meta name="description" content="Our website is coming soon!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="text-center text-white p-6 md:p-12">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Coming <span className="text-[#dfff16]">Soon</span>
        </h1>
        <p className="text-lg md:text-2xl mb-8">We&apos;re working hard to bring you our new website.</p>

        {!submitted ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full max-w-sm mx-auto">
            <div>
              <Input {...register("email")} placeholder="Enter your email" />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>

            <div className="flex items-center justify-center space-x-2">
              <Checkbox
                id="terms"
                checked={agreedTerms}
                onCheckedChange={(checked) => setAgreedTerms(checked as boolean)}
              />
              <label
                htmlFor="terms"
                className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                I agree to the ShortBlast <span className="underline">Terms and Conditions.</span>
              </label>
            </div>

            <Button
              type="submit"
              disabled={!agreedTerms}
              className="bg-[#dfff16] hover:opacity-80 hover:bg-[#dfff16] transition-all text-md text-bold text-black font-bold py-2 px-4 rounded"
            >
              Notify Me
            </Button>
          </form>
        ) : (
          <div className="text-white p-4">
            Thanks for subscribing! We&apos;ll notify you once we launch.
          </div>
        )}
      </div>
    </div>
  );
};

export default ComingSoonPage;
