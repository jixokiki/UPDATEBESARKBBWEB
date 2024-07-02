// "use client";
// import useAuth from "@/app/hooks/useAuth";
// import Footer from "@/components/Footer";
// import Navbar from "@/components/Navbar";
// import { db, storage } from "@/firebase/firebase";
// import {
//   collection,
//   doc,
//   onSnapshot,
//   serverTimestamp,
//   setDoc,
// } from "firebase/firestore";
// import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
// import { useRouter } from "next/navigation";
// import React, { useEffect, useState } from "react";

// const Purchase = () => {
//   const { user, userProfile } = useAuth();
//   const router = useRouter();

//   useEffect(() => {
//     if (user && userProfile.role === "admin") {
//       router.push("/admin");
//     }
//   }, [user, userProfile, router]);

//   const [file, setFile] = useState(null);
//   const [productName, setProductName] = useState("");
//   const [deliveryAddress, setDeliveryAddress] = useState("");
//   const [contact, setContact] = useState("");
//   const [quantityRice, setQuantityRice] = useState("");
//   const [packageCategory, setPackageCategory] = useState("");
//   const [packageQuantity, setPackageQuantity] = useState("");
//   const [percentage, setPercentage] = useState(null);
//   const [data, setData] = useState([]);

//   useEffect(() => {
//     const unsub = onSnapshot(
//       collection(db, "pembelian1"),
//       (snapshot) => {
//         let list = [];
//         snapshot.docs.forEach((doc) => {
//           list.push({ id: doc.id, ...doc.data() });
//         });
//         setData(list);
//       },
//       (error) => {
//         console.log(error);
//       }
//     );

//     return () => {
//       unsub();
//     };
//   }, []);

//   const uploadFile = async (file) => {
//     return new Promise((resolve, reject) => {
//       const storageRef = ref(
//         storage,
//         "pembelian1/" +
//           new Date().getTime() +
//           file.name.replace(" ", "%20") +
//           "KBB"
//       );
//       const uploadTask = uploadBytesResumable(storageRef, file);

//       uploadTask.on(
//         "state_changed",
//         (snapshot) => {
//           const progress =
//             (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//           setPercentage(progress);
//           switch (snapshot.state) {
//             case "paused":
//               console.log("Upload is paused");
//               break;
//             case "running":
//               console.log("Upload is running");
//               break;
//           }
//         },
//         (error) => {
//           reject(error);
//         },
//         () => {
//           getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
//             resolve(downloadURL);
//           });
//         }
//       );
//     });
//   };

//   const handleAddPurchase = async (e) => {
//     e.preventDefault();

//     try {
//       const downloadURL = file ? await uploadFile(file) : null;
//       const purchaseData = {
//         id: new Date().getTime() + user.uid + "PEMBELIAN",
//         image: downloadURL,
//         productName: productName,
//         deliveryAddress: deliveryAddress,
//         contact: contact,
//         quantityRice: quantityRice,
//         packageCategory: packageCategory,
//         packageQuantity: packageQuantity,
//         status: "product",
//       };

//       await setDoc(doc(db, "pembelian1", purchaseData.id), {
//         ...purchaseData,
//         timeStamp: serverTimestamp(),
//       });

//       setFile(null);
//       setProductName("");
//       setDeliveryAddress("");
//       setContact("");
//       setQuantityRice("");
//       setPackageCategory("");
//       setPackageQuantity("");
//       setPercentage(null);
//       alert("Order request successfully added!");
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   return (
//     <div className="w-[100%] mx-auto mt-32">
//       <Navbar />
//       <div className="w-[90%] flex justify-center items-center gap-3 mb-10">
//         <h1 className="text-3xl font-semibold mb-3">Form Pemesanan</h1>
//       </div>
//       <div className="w-[90%] mx-auto">
//         <form onSubmit={handleAddPurchase}>
//           <div className="py-4">
//             <div className="flex flex-col gap-3 mb-3">
//               <label htmlFor="productName">Product Name</label>
//               <input
//                 type="text"
//                 name="productName"
//                 id="productName"
//                 placeholder="Enter product name"
//                 value={productName}
//                 onChange={(e) => setProductName(e.target.value)}
//                 required
//                 className="input input-bordered w-full"
//               />
//             </div>
//             <div className="flex flex-col gap-3 mb-3">
//               <label htmlFor="deliveryAddress">Delivery Address</label>
//               <input
//                 type="text"
//                 name="deliveryAddress"
//                 id="deliveryAddress"
//                 placeholder="Enter delivery address"
//                 value={deliveryAddress}
//                 onChange={(e) => setDeliveryAddress(e.target.value)}
//                 required
//                 className="input input-bordered w-full"
//               />
//             </div>
//             <div className="flex flex-col gap-3 mb-3">
//               <label htmlFor="contact">Contact</label>
//               <input
//                 type="text"
//                 name="contact"
//                 id="contact"
//                 placeholder="Enter contact"
//                 value={contact}
//                 onChange={(e) => setContact(e.target.value)}
//                 required
//                 className="input input-bordered w-full"
//               />
//             </div>
//             <div className="flex flex-col gap-3 mb-3">
//               <label htmlFor="quantityRice">Quantity of Rice</label>
//               <input
//                 type="text"
//                 name="quantityRice"
//                 id="quantityRice"
//                 placeholder="Enter quantity of rice (e.g., 5 kg)"
//                 value={quantityRice}
//                 onChange={(e) => setQuantityRice(e.target.value)}
//                 required
//                 className="input input-bordered w-full"
//               />
//             </div>
//             <div className="flex flex-col gap-3 mb-3">
//               <label htmlFor="packageCategory">Package Category</label>
//               <input
//                 type="text"
//                 name="packageCategory"
//                 id="packageCategory"
//                 placeholder="Enter package category"
//                 value={packageCategory}
//                 onChange={(e) => setPackageCategory(e.target.value)}
//                 required
//                 className="input input-bordered w-full"
//               />
//             </div>
//             <div className="flex flex-col gap-3 mb-3">
//               <label htmlFor="packageQuantity">Package Quantity</label>
//               <input
//                 type="text"
//                 name="packageQuantity"
//                 id="packageQuantity"
//                 placeholder="Enter package quantity (e.g., 2 packs)"
//                 value={packageQuantity}
//                 onChange={(e) => setPackageQuantity(e.target.value)}
//                 required
//                 className="input input-bordered w-full"
//               />
//             </div>
//             <div className="modal-action">
//               <button className="btn btn-primary" type="submit">
//                 Request Order
//               </button>
//             </div>
//           </div>
//         </form>
//       </div>
//       <Footer/>
//     </div>
//   );
// };

// export default Purchase;



"use client";
import { useEffect, useState } from "react";
import { auth, db } from "@/firebase/firebase";
import { doc, getDoc, addDoc, collection } from "firebase/firestore";
import { useRouter } from "next/navigation"; // Menggunakan next/router bukan next/navigation
import Navbar from "@/components/Navbar";
import { useAuthState } from "react-firebase-hooks/auth";
import NavbarUser from "@/components/NavbarUser";

const UserProfile = () => {
  const router = useRouter();
  const [user, loading] = useAuthState(auth);
  const [formData, setFormData] = useState({
    fullName: "",
    contact: "",
    address: "",
    packaging: "", // Tambahan state untuk packaging
    namaProduct: "",
    stock: "", // Tambahan state untuk stock
    deliveryDate: "", // Tambahan state untuk tanggal pengiriman
  });
  const [errors, setErrors] = useState({});
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFormData({
            ...formData,
            fullName: data.name || "",
            contact: data.contact || "",
            address: data.address || "",
          });
        }
      }
    };
    fetchUserData();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const calculatePrice = () => {
    const { packaging, namaProduct, stock } = formData;
    let unitPrice = 0;

    if (namaProduct === "Karila Pandan Wangi Premium") {
      switch (packaging) {
        case "3 Kg":
          unitPrice = 49500;
          break;
        case "5 Kg":
          unitPrice = 82500;
          break;
        case "10 Kg":
          unitPrice = 165000;
          break;
        case "20 Kg":
          unitPrice = 330000;
          break;
        case "25 Kg":
          unitPrice = 412500;
          break;
        default:
          unitPrice = 0;
          break;
      }
    }

    if (namaProduct === "Karila Ramos") {
      switch (packaging) {
        case "3 Kg":
          unitPrice = 43500;
          break;
        case "5 Kg":
          unitPrice = 72500;
          break;
        case "10 Kg":
          unitPrice = 145000;
          break;
        case "20 Kg":
          unitPrice = 290000;
          break;
        case "25 Kg":
          unitPrice = 362500;
          break;
        default:
          unitPrice = 0;
          break;
      }
    }
    return unitPrice * (parseInt(stock) || 0); // Mengalikan harga satuan dengan jumlah stok
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      let newErrors = {};
      if (!formData.fullName) {
        newErrors.fullName = "Full name is required";
      }
      if (!formData.contact) {
        newErrors.contact = "Contact is required";
      }
      if (!formData.address) {
        newErrors.address = "Address is required";
      }
      if (!formData.packaging) {
        newErrors.packaging = "Packaging is required";
      }
      if (!formData.namaProduct) {
        newErrors.namaProduct = "Product is required";
      }
      if (!formData.stock) {
        newErrors.stock = "Stock is required";
      }
      if (!formData.deliveryDate) {
        newErrors.deliveryDate = "Delivery date is required";
      }
      setErrors(newErrors);

      if (Object.keys(newErrors).length === 0 && user) {
        const totalHarga = calculatePrice();

        // Simpan ke koleksi userRequestOrder di Firebase
        const docRef = await addDoc(collection(db, "userRequestOrder"), {
          userId: user.uid,
          fullName: formData.fullName,
          contact: formData.contact,
          address: formData.address,
          packaging: formData.packaging,
          namaProduct: formData.namaProduct,
          stock: formData.stock,
          deliveryDate: formData.deliveryDate,
          totalHarga: totalHarga, // Menambahkan total harga
          status: "barang ready", // Menambahkan status barang
          timestamp: new Date(),
        });

        setToastMessage("Order requested successfully");

        // Bersihkan form setelah submit
        setFormData({
          fullName: "",
          contact: "",
          address: "",
          packaging: "",
          namaProduct: "",
          stock: "",
          deliveryDate: "",
        });
      }
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  return (
    <div className="mt-10">
      <NavbarUser />
      <div className="py-24">
        <form
          onSubmit={handleSubmit}
          className="max-w-xl mx-auto rounded-xl md:border p-8 md:shadow-lg"
        >
          <h2 className="text-center text-2xl font-semibold mb-10">Formulir Pemesanan</h2>
          <div className="mb-4">
            <label className="block mb-1">Nama Lengkap</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
            />
            {errors.fullName && (
              <p className="text-red-500">{errors.fullName}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block mb-1">Kontak</label>
            <input
              type="text"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
            />
            {errors.contact && <p className="text-red-500">{errors.contact}</p>}
          </div>
          <div className="mb-4">
            <label className="block mb-1">Alamat Pengiriman</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
            />
            {errors.address && <p className="text-red-500">{errors.address}</p>}
          </div>
          <div className="mb-4">
            <label className="block mb-1">Kemasan</label>
            <select
              name="packaging"
              value={formData.packaging}
              onChange={handleChange}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
            >
              <option value="">Pilih Kemasan</option>
              <option value="3 Kg">3 Kg</option>
              <option value="5 Kg">5 Kg</option>
              <option value="10 Kg">10 Kg</option>
              <option value="20 Kg">20 Kg</option>
              <option value="25 Kg">25 Kg</option>
            </select>
            {errors.packaging && (
              <p className="text-red-500">{errors.packaging}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block mb-1">Nama Beras</label>
            <select
              name="namaProduct"
              value={formData.namaProduct}
              onChange={handleChange}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
            >
              <option value="">Pilih Beras</option>
              <option value="Karila Pandan Wangi Premium">Karila Pandan Wangi Premium</option>
              <option value="Karila Ramos">Karila Ramos</option>
            </select>
            {errors.namaProduct && (
              <p className="text-red-500">{errors.namaProduct}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block mb-1">Stok</label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
            />
            {errors.stock && <p className="text-red-500">{errors.stock}</p>}
          </div>
          <div className="mb-4">
            <label className="block mb-1">Tanggal Pengiriman</label>
            <input
              type="date"
              name="deliveryDate"
              value={formData.deliveryDate}
              onChange={handleChange}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
            />
            {errors.deliveryDate && (
              <p className="text-red-500">{errors.deliveryDate}</p>
            )}
          </div>

          {toastMessage && (
            <div className="toast toast-end">
              <div className="alert alert-success">
                <span>{toastMessage}</span>
              </div>
            </div>
          )}

          <button
            type="submit"
            className={`bg-gray-200 transition-all duration-300 hover:bg-gray-900 hover:text-white px-6 py-4 rounded w-full`}
          >
            Pesan Beras
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserProfile;



