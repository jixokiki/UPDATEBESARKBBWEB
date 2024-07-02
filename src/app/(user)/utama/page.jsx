"use client";
import CardItem from "@/components/CardItem";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import Footer from "@/components/Footer";
import useAuth from "../hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import NavbarUser from "@/components/NavbarUser";

export default function Home() {
  const { user, userProfile } = useAuth();
  const router = useRouter();
  const [userName, setUserName] = useState(""); // Inisialisasi state userName dengan nilai awal kosong
  useEffect(() => {
    if (user && userProfile.role === "admin") {
      router.push("/admin");
    }else if (user && userProfile.role === "gudang") {
      router.push("/gudang");
    }else if (user && userProfile.role === "user") {
      // Jika user adalah admin, kita dapat menampilkan alert selamat datang
      // dan menampilkan nama admin dari userProfile
      alert("Selamat datang, " + userProfile.name);
      setUserName(userProfile.name);
    }
  }, [user, userProfile, router]);
  return (
    <div>
      <Navbar />
      <div className="relative">
        <Image
          src={"/assets/kbbLogo.jpeg"}
          width={3000 / 3}
          height={2000 / 3}
          className="relative w-full h-screen object-cover"
          alt="Home Page"
          priority
        />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 text-center flex flex-col gap-3 w-3/4 md:w-fit">
          <h1 className="text-5xl font-extrabold text-orange-950">
            KBB
          </h1>
          <p className="text-xl">Pilih Beras Yang Di Inginkan</p>
          <button className="bg-white p-4 rounded-lg font-bold text-xl">
            R +
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}