"use client";
import NavbarAdmin from "@/components/NavbarAdmin";
import React, { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Footer from "@/components/Footer";

const Admin = () => {
  const { user, userProfile } = useAuth();
  const router = useRouter();

  const [adminName, setAdminName] = useState("");
  useEffect(() => {
    if (user && userProfile.role === "user") {
      router.push("/");
    } else if (user && userProfile.role === "admin") {
      // Jika user adalah admin, kita dapat menampilkan alert selamat datang
      // dan menampilkan nama admin dari userProfile
      alert("Selamat datang, " + userProfile.name);
      setAdminName(userProfile.name);
    }
  }, [user, userProfile, router]);
  return (
    <div>
    <div className="flex justify-center items-center h-screen">
      <NavbarAdmin />
      <div className="flex flex-col items-center">
        <Image
          src={"/assets/kbbLogo.jpeg"}
          width={1000 / 2}
          height={1125 / 4}
          alt="Logo"
        />
        <h1 className="text-3xl">Selamat Datang Di Halaman Marketing</h1>
        {adminName && <p>Marketing: {adminName}</p>}
      </div>
    </div>
    <Footer/>
    </div>
  );
};

export default Admin;
