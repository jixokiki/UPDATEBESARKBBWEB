// "use client";
// import useAuth from "@/app/hooks/useAuth";
// import Footer from "@/components/Footer";
// import Navbar from "@/components/Navbar";
// import Image from "next/image";
// import { useRouter } from "next/navigation";
// import React, { useEffect } from "react";

// const About = () => {
//   const { user, userProfile } = useAuth();
//   const router = useRouter();

//   useEffect(() => {
//     if (user && userProfile.role === "admin") {
//       router.push("/admin");
//     }
//   }, [user, userProfile, router]);

//   return (
//     <div>
//       <Navbar />
//       {/* <div className="relative mt-20 md:mt-14">
//         <Image
//           src={"/assets/kbbLogo.jpeg"}
//           width={1410 / 2}
//           height={675 / 2}
//           priority
//           sizes="(max-width: 768px) 600px, 1410px"
//           alt="about page"
//           className="relative w-full h-[600px] md:h-screen object-cover object-center mx-auto"
//         />
//         <div className="absolute top-20 left-1/2 -translate-x-1/2 text-center flex flex-col gap-3">
//           <h1 className="text-5xl font-extrabold text-gray-950">Product</h1>
//         </div>
//       </div> */}
//       <div className="p-8 md:p-44 flex flex-col gap-6 text-justify">
//         <h2 className="font-bold text-3xl text-center md:text-left">1. Karila Pandan Wangi Premium</h2>
//         <p>Beras dengan campuran pandan wangi dan menir yang tersedia kemasan dari 3kg sampai 50kg</p>
//         <h2 className="font-bold text-3xl text-center md:text-left">2. Karila ramos</h2>
//         <p>Beras dengan campuran ramos dan menir yang tersedia kemasan dari 3kg sampai 50 kg</p>
//       </div>
//       <Footer />
//     </div>
//   );
// };

// export default About;



"use client";
import useAuth from "@/app/hooks/useAuth";
import useProduct from "@/app/hooks/useProduct";
import CardItem6 from "@/components/CardItem6";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import NavbarGudang from "@/components/NavbarGudang";
import NavbarUser from "@/components/NavbarUser";
import { db } from "@/firebase/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Product = () => {
  const { user, userProfile } = useAuth();
  const router = useRouter();
  const [data, setData] = useState([]);

  useEffect(() => {
    if (user && userProfile.role === "admin") {
      router.push("/admin");
    }

    const unsubProduct = onSnapshot(collection(db, "userPembelian"), (snapshot) => {
      const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setData(list);
    });

    return () => unsubProduct();
  }, [user, userProfile, router]);

  const filterDataByItemName = (itemName) => {
    return data.filter((item) => item.itemName.toLowerCase() === itemName.toLowerCase());
  };

  return (
    <div>
      <NavbarUser />
      <div className="p-8 md:p-24 mt-10">
        {/* <h2 className="text-3xl mb-3">All Products</h2> */}

        <div className="flex flex-wrap gap-6">
          {/* Render sections based on itemName */}
          {Array.from(new Set(data.map((item) => item.itemName))).map((itemName) => (
            <div key={itemName} className="w-full">
              <h3 className="text-2xl font-bold mb-3">{itemName}</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {filterDataByItemName(itemName).map((product) => (
                  <CardItem6
                    key={product.id}
                    itemName={product.itemName}
                    packaging={product.packaging}
                    price={product.price}
                    status={product.status}
                    stock={product.stock}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Product;


