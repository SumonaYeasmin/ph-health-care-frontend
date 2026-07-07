import { Hero } from "@/src/components/modules/Home/Hero";
import Specialities from "@/src/components/modules/Home/Specialities";
import Steps from "@/src/components/modules/Home/Steps";
import Testimonials from "@/src/components/modules/Home/Testimonials";
import TopRatedDoctors from "@/src/components/modules/Home/TopRatedDoctors";
import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>AI-Powered Healthcare - Find Your Perfect Doctor</title>
        <meta
          name="description"
          content="Discover top-rated doctors tailored to your needs with our AI-powered healthcare platform. Get personalized recommendations and book appointments effortlessly."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Hero />
        <Specialities />
        <TopRatedDoctors />
        <Steps />
        <Testimonials />
      </main>
    </>
  );
}