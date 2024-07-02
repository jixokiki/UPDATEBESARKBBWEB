// "use client"
// import useAuth from "@/app/hooks/useAuth";
// import Navbar from "@/components/Navbar";
// import { db, storage } from "@/firebase/firebase";
// import {
//   collection,
//   doc,
//   onSnapshot,
//   serverTimestamp,
//   setDoc,
//   updateDoc,
//   where, query
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
//   const [itemName, setItemName] = useState("");
//   const [category, setCategory] = useState("fikom");
//   const [quantity, setQuantity] = useState("");
//   const [status, setStatus] = useState("ready");
//   const [percentage, setPercentage] = useState(null);
//   const [approvedData, setApprovedData] = useState([]);
//   const [paymentProofs, setPaymentProofs] = useState([]);

//   useEffect(() => {
//     const unsubscribePurchases = onSnapshot(
//       query(collection(db, "pembelian1"), where("status", "==", "pembelian di acc")),
//       (snapshot) => {
//         const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
//         setApprovedData(list);
//       },
//       (error) => {
//         console.error("Error getting approved purchases: ", error);
//       }
//     );
  
//     return () => unsubscribePurchases();
//   }, []);
  

//   // Menggunakan useEffect untuk mengambil data bukti pembayaran
//   useEffect(() => {
//     const unsubscribePayments = onSnapshot(
//       collection(db, "buktiPembayaran"),
//       (snapshot) => {
//         const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
//         setPaymentProofs(list);
//       },
//       (error) => {
//         console.error("Error getting payment proofs: ", error);
//       }
//     );

//     return () => unsubscribePayments();
//   }, []);

//   const uploadFile = async (file) => {
//     try {
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
//           const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//           setPercentage(progress);
//         },
//         (error) => {
//           console.error("Error uploading file: ", error);
//         }
//       );

//       await uploadTask;
//       const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
//       return downloadURL;
//     } catch (error) {
//       console.error("Error uploading file: ", error);
//       throw error;
//     }
//   };

//   const handleAddPurchase = async (e) => {
//     e.preventDefault();

//     try {
//       const downloadURL = await uploadFile(file);
//       const purchaseData = {
//         id: new Date().getTime() + user.uid + "PEMBELIAN",
//         image: downloadURL,
//         itemName: itemName,
//         category: category,
//         quantity: quantity,
//         status: status,
//         timeStamp: serverTimestamp(),
//       };

//       await setDoc(doc(db, "pembelian1", purchaseData.id), purchaseData);

//       setFile(null);
//       setItemName("");
//       setCategory("fikom");
//       setQuantity("");
//       setStatus("ready");
//       setPercentage(null);
//       alert("Pembelian berhasil ditambahkan!");
//     } catch (error) {
//       console.error("Error adding purchase: ", error);
//     }
//   };

//   const handleAccPurchase = async (id) => {
//     try {
//       const purchaseDocRef = doc(db, "pembelian1", id);
//       await updateDoc(purchaseDocRef, { status: "pembelian di acc" });
//       alert("Status pembelian berhasil diubah!");
//     } catch (error) {
//       console.error("Error updating purchase status: ", error);
//     }
//   };

//   const handleUploadPayment = async (e) => {
//     e.preventDefault();

//     try {
//       const downloadURL = await uploadFile(file);
//       const paymentData = {
//         id: new Date().getTime() + user.uid + "BUKTIPAYMENT",
//         image: downloadURL,
//         itemName: itemName,
//         category: category,
//         quantity: quantity,
//         timeStamp: serverTimestamp(),
//         statusPembayaran: "terupload",
//       };

//       await setDoc(doc(db, "buktiPembayaran", paymentData.id), paymentData);

//       setFile(null);
//       setItemName("");
//       setCategory("fikom");
//       setQuantity("");
//       setPercentage(null);
//       alert("Bukti pembayaran berhasil diunggah!");
//     } catch (error) {
//       console.error("Error uploading payment proof: ", error);
//     }
//   };

//   const handleUpdatePurchaseStatus = async (id, newStatus) => {
//     try {
//       await updateDoc(doc(db, "pembelian1", id), { status: newStatus });
//       alert("Status pembelian berhasil diubah!");

//       // Opsional: Update local state approvedData (jika diperlukan)
//       const updatedApprovedData = approvedData.map((purchase) =>
//         purchase.id === id ? { ...purchase, status: newStatus } : purchase
//       );
//       setApprovedData(updatedApprovedData);
//     } catch (error) {
//       console.error("Error updating purchase status: ", error);
//     }
//   };

//   return (
//     <div className="w-[100%] mx-auto mt-32">
//       <Navbar />
//       <div className="w-[90%] flex justify-center items-center gap-3 mb-10">
//         <h1 className="text-3xl font-semibold mb-3">Purchase Form</h1>
//       </div>
//       <div className="w-[90%] mx-auto mt-10">
//         <h2 className="text-2xl font-semibold mb-5">Approved Purchases</h2>
//         <div className="overflow-x-auto">
//           <table className="table w-full">
//             <thead>
//               <tr>
//                 <th>No.</th>
//                 <th>Image</th>
//                 <th>Item Name</th>
//                 <th>Category</th>
//                 <th>Quantity</th>
//                 <th>Price</th>
//                 <th>Status</th>
//                 <th>TimeStamp</th>
//                 <th>Status Pembayaran</th>
//                 <th>Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {approvedData.map((purchase, index) => (
//                 <tr key={purchase.id}>
//                   <td>{index + 1}</td>
//                   <td>
//                     <img
//                       src={purchase.image}
//                       alt={purchase.itemName}
//                       className="w-12 h-12 object-cover"
//                     />
//                   </td>
//                   <td>{purchase.itemName}</td>
//                   <td>{purchase.category}</td>
//                   <td>{purchase.quantity}</td>
//                   <td>{purchase.price}</td>
//                   <td>{purchase.status}</td>
//                   <td>
//                     {purchase.timeStamp
//                       ? new Date(
//                           purchase.timeStamp.seconds * 1000
//                         ).toLocaleString()
//                       : "N/A"}
//                   </td>
//                   <td>
//                     {paymentProofs.find(
//                       (proof) => proof.itemName === purchase.itemName
//                     )?.statusPembayaran || "Pending"}
//                   </td>
//                   <td>
//                     <button
//                       className="btn btn-primary"
//                       onClick={() =>
//                         handleUpdatePurchaseStatus(purchase.id, "menunggu proses gudang")
//                       }
//                     >
//                       Update Status
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//       <div className="w-[90%] mx-auto mt-10">
//         <h2 className="text-2xl font-semibold mb-5">Upload Payment Proof</h2>
//         <div className="mb-5 text-lg">No. Rekening: 59796486447</div>
//         <form onSubmit={handleUploadPayment}>
//           <div className="py-4">
//             <div className="flex flex-col gap-3 mb-3">
//               <label htmlFor="image">Payment Proof Image</label>
//               <input
//                 type="file"
//                 name="image"
//                 id="image"
//                 required
//                 onChange={(e) => setFile(e.target.files[0])}
//               />
//               {percentage !== null && percentage < 100 ? (
//                 <progress
//                   className="progress progress-accent w-56"
//                   value={percentage}
//                   max="100"
//                 ></progress>
//               ) : (
//                 percentage === 100 && (
//                   <div className="text-green-500 font-semibold">
//                     Upload Completed
//                   </div>
//                 )
//               )}
//             </div>
//             <div className="flex flex-col gap-3 mb-3">
//               <label htmlFor="itemName">Item Name</label>
//               <input
//                 type="text"
//                 name="itemName"
//                 id="itemName"
//                 placeholder="Enter item name"
//                 value={itemName}
//                 onChange={(e) => setItemName(e.target.value)}
//                 required
//                 className="input input-bordered w-full"
//               />
//             </div>
//             <div className="flex flex-col gap-3 mb-3">
//               <label htmlFor="category">Category</label>
//               <select
//                 name="category"
//                 id="category"
//                 value={category}
//                 onChange={(e) => setCategory(e.target.value)}
//                 className="select select-bordered w-full"
//               >
//                 <option value="3Kg">3 Kg</option>
//                 <option value="5Kg">5 Kg</option>
//                 <option value="10Kg">10 Kg</option>
//                 <option value="15Kg">15 Kg</option>
//                 <option value="20Kg">20 Kg</option>
//                 <option value="25Kg">25 Kg</option>
//               </select>
//             </div>
//             <div className="flex flex-col gap-3 mb-3">
//               <label htmlFor="quantity">Quantity</label>
//               <input
//                 type="number"
//                 name="quantity"
//                 id="quantity"
//                 placeholder="Enter quantity"
//                 value={quantity}
//                 onChange={(e) => setQuantity(e.target.value)}
//                 required
//                 className="input input-bordered w-full"
//               />
//             </div>
//           </div>
//           <div className="w-[100%] mx-auto mt-7">
//             <p>Note: Upload bukti payment ketika status berubah menjadi pembelian di acc,</p>
//             <p>Pembayaran bisa dilakukan dengan cara transfer sesuai dengan harga yang tertera diatas kolom Approved Purchases</p>
//           </div>
//           <div className="modal-action">
//             <button className="btn btn-primary" type="submit">
//               Upload Payment Proof
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Purchase;




//INI YANG FIXX YAA AWAS AJA LUPA
// "use client";
// import useAuth from "@/app/hooks/useAuth";
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
//         timeStamp: serverTimestamp(),
//       };

//       await setDoc(doc(db, "pembelian1", purchaseData.id), purchaseData);

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
//         <h1 className="text-3xl font-semibold mb-3">Request Order Form</h1>
//       </div>
//       <div className="w-[90%] mx-auto mt-10">
//         <h2 className="text-2xl font-semibold mb-4">Order Requests</h2>
//         <table className="table-auto w-full">
//           <thead>
//             <tr>
//               <th>Product Name</th>
//               <th>Delivery Address</th>
//               <th>Contact</th>
//               <th>Quantity of Rice</th>
//               <th>Package Category</th>
//               <th>Package Quantity</th>
//               <th>Status</th>
//               <th>Time Stamp</th>
//             </tr>
//           </thead>
//           <tbody>
//             {data.map((item) => (
//               <tr key={item.id}>
//                 <td>{item.productName}</td>
//                 <td>{item.deliveryAddress}</td>
//                 <td>{item.contact}</td>
//                 <td>{item.quantityRice}</td>
//                 <td>{item.packageCategory}</td>
//                 <td>{item.packageQuantity}</td>
//                 <td>{item.status}</td>
//                 <td>{item.timeStamp?.toDate().toString()}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//       <div className="w-[90%] mx-auto mt-10">
//         <h2 className="text-2xl font-semibold mb-5">Upload Payment Proof</h2>
//         <div className="mb-5 text-lg">No. Rekening: 59796486447</div>
//         <form onSubmit={handleUploadPayment}>
//           <div className="py-4">
//             <div className="flex flex-col gap-3 mb-3">
//               <label htmlFor="image">Payment Proof Image</label>
//               <input
//                 type="file"
//                 name="image"
//                 id="image"
//                 required
//                 onChange={(e) => setFile(e.target.files[0])}
//               />
//               {percentage !== null && percentage < 100 ? (
//                 <progress
//                   className="progress progress-accent w-56"
//                   value={percentage}
//                   max="100"
//                 ></progress>
//               ) : (
//                 percentage === 100 && (
//                   <div className="text-green-500 font-semibold">
//                     Upload Completed
//                   </div>
//                 )
//               )}
//             </div>
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
//           </div>
//           <div className="w-[100%] mx-auto mt-7">
//             <p>Note: Upload bukti payment ketika status berubah menjadi pembelian di acc,</p>
//             <p>Pembayaran bisa dilakukan dengan cara transfer sesuai dengan harga yang tertera diatas kolom Approved Purchases</p>
//           </div>
//           <div className="modal-action">
//             <button className="btn btn-primary" type="submit">
//               Upload Payment Proof
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Purchase;



//INI YANG FIX KEDUA YAA AWAS AJA LUPA
// "use client";
// import useAuth from "@/app/hooks/useAuth";
// import Navbar from "@/components/Navbar";
// import { db, storage } from "@/firebase/firebase";
// import {
//   collection,
//   doc,
//   onSnapshot,
//   serverTimestamp,
//   setDoc,
//   updateDoc,
//   query,
//   where,
//   getDocs,
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
//         timeStamp: serverTimestamp(),
//       };

//       await setDoc(doc(db, "pembelian1", purchaseData.id), purchaseData);

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

//   const handleUploadPayment = async (e) => {
//     e.preventDefault();

//     try {
//       // Mengambil data pembelian berdasarkan productName dan deliveryAddress
//       const querySnapshot = await getDocs(
//         query(
//           collection(db, "pembelian1"),
//           where("productName", "==", productName),
//           where("deliveryAddress", "==", deliveryAddress)
//         )
//       );

//       if (querySnapshot.empty) {
//         alert("Data transfer dan data barang tidak sesuai.");
//         return;
//       }

//       querySnapshot.forEach(async (doc) => {
//         try {
//           // Update status menjadi "menunggu konfirmasi gudang"
//           await updateDoc(doc.ref, { status: "bukti payment terupload" });
//           alert("Upload bukti pembayaran berhasil!");
//         } catch (error) {
//           console.error("Error updating document:", error);
//         }
//       });
//     } catch (error) {
//       console.error("Error getting documents:", error);
//     }
//   };

//   return (
//     <div className="w-[100%] mx-auto mt-32">
//       <Navbar />
//       <div className="w-[90%] flex justify-center items-center gap-3 mb-10">
//         <h1 className="text-3xl font-semibold mb-3">Request Order Form</h1>
//       </div>
//       <div className="w-[90%] mx-auto mt-10">
//         <h2 className="text-2xl font-semibold mb-4">Order Requests</h2>
//         <table className="table-auto w-full">
//           <thead>
//             <tr>
//               <th>Product Name</th>
//               <th>Delivery Address</th>
//               <th>Contact</th>
//               <th>Quantity of Rice</th>
//               <th>Package Category</th>
//               <th>Package Quantity</th>
//               <th>Status</th>
//               <th>Time Stamp</th>
//             </tr>
//           </thead>
//           <tbody>
//             {data.map((item) => (
//               <tr key={item.id}>
//                 <td>{item.productName}</td>
//                 <td>{item.deliveryAddress}</td>
//                 <td>{item.contact}</td>
//                 <td>{item.quantityRice}</td>
//                 <td>{item.packageCategory}</td>
//                 <td>{item.packageQuantity}</td>
//                 <td>{item.status}</td>
//                 <td>{item.timeStamp?.toDate().toString()}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//       <div className="w-[90%] mx-auto mt-10">
//         <h2 className="text-2xl font-semibold mb-5">Upload Payment Proof</h2>
//         <div className="mb-5 text-lg">No. Rekening: 59796486447</div>
//         <form onSubmit={handleUploadPayment}>
//           <div className="py-4">
//             <div className="flex flex-col gap-3 mb-3">
//               <label htmlFor="image">Payment Proof Image</label>
//               <input
//                 type="file"
//                 name="image"
//                 id="image"
//                 required
//                 onChange={(e) => setFile(e.target.files[0])}
//               />
//               {percentage !== null && percentage < 100 ? (
//                 <progress
//                   className="progress progress-accent w-56"
//                   value={percentage}
//                   max="100"
//                 ></progress>
//               ) : (
//                 percentage === 100 && (
//                   <div className="text-green-500 font-semibold">
//                     Upload Completed
//                   </div>
//                 )
//               )}
//             </div>
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
//           </div>
//           <div className="w-[100%] mx-auto mt-7">
//             <p>Note: Upload bukti payment ketika status berubah menjadi pembelian di acc,</p>
//             <p>Pembayaran bisa dilakukan dengan cara transfer sesuai dengan harga yang tertera diatas kolom Approved Purchases</p>
//           </div>
//           <div className="modal-action">
//             <button className="btn btn-primary" type="submit">
//               Upload Payment Proof
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Purchase;



//UPDATE YANG BARU FIXX HARI INI 2
// "use client"
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
//   updateDoc,
//   query,
//   where,
//   getDocs,
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
//   const [percentage, setPercentage] = useState(null);
//   const [data, setData] = useState([]);
//   const [namaProduct, setNamaProduct] = useState(""); // State untuk nama produk
//   const [address, setAddress] = useState(""); // State untuk alamat pengiriman

//   useEffect(() => {
//     const unsub = onSnapshot(
//       collection(db, "userRequestOrder"),
//       (snapshot) => {
//         let list = [];
//         snapshot.docs.forEach((doc) => {
//           list.push({ id: doc.id, ...doc.data() });
//         });
//         setData(list);

//         // Set nilai awal untuk nama produk dan alamat berdasarkan data pertama dari snapshot
//         if (list.length > 0) {
//           setNamaProduct(list[0].namaProduct || ""); // Mengambil nilai nama produk
//           setAddress(list[0].address || ""); // Mengambil nilai alamat pengiriman
//         }
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
//         "userRequestOrder/" +
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

//   const handleUploadPayment = async (e) => {
//     e.preventDefault();

//     try {
//       const downloadURL = file ? await uploadFile(file) : null;

//       const querySnapshot = await getDocs(
//         query(
//           collection(db, "userRequestOrder"),
//           where("namaProduct", "==", namaProduct),
//           where("address", "==", address)
//         )
//       );

//       if (querySnapshot.empty) {
//         alert("Data transfer dan data barang tidak sesuai.");
//         return;
//       }

//       querySnapshot.forEach(async (doc) => {
//         try {
//           await updateDoc(doc.ref, {
//             status: "menunggu konfirmasi gudang",
//             image: downloadURL,
//           });
//           alert("Upload bukti pembayaran berhasil!");
//           setFile(null);
//         } catch (error) {
//           console.error("Error updating document:", error);
//         }
//       });
//     } catch (error) {
//       console.error("Error getting documents:", error);
//     }
//   };

//   return (
//     <div className="w-[100%] mx-auto mt-32">
//       <Navbar />
//       <div className="w-[90%] mx-auto mt-10">
//         <h2 className="text-2xl font-semibold mb-4">Status Pemesanan</h2>
//         <table className="table-auto w-full">
//           <thead>
//             <tr>
//               <th>Product Name</th>
//               <th>Delivery Address</th>
//               <th>Contact</th>
//               <th>Kategori Kemasan</th>
//               <th>Jumlah Kemasan</th>
//               <th>Harga</th>
//               <th>Status</th>
//               <th>Time Stamp</th>
//             </tr>
//           </thead>
//           <tbody>
//             {data.map((item) => (
//               <tr key={item.id}>
//                 <td>{item.namaProduct}</td>
//                 <td>{item.address}</td>
//                 <td>{item.contact}</td>
//                 <td>{item.packaging}</td>
//                 <td>{item.stock}</td>
//                 <td>{item.price}</td>
//                 <td>{item.status}</td>
//                 <td>{item.timestamp?.toDate().toString()}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//       <div className="w-[90%] mx-auto mt-10">
//         <h2 className="text-2xl font-semibold mb-5">Upload Payment Proof</h2>
//         <div className="mb-5 text-lg">No. Rekening: 59796486447</div>
//         <form onSubmit={handleUploadPayment}>
//           <div className="py-4">
//             <div className="flex flex-col gap-3 mb-3">
//               <label htmlFor="image">Payment Proof Image</label>
//               <input
//                 type="file"
//                 name="image"
//                 id="image"
//                 required
//                 onChange={(e) => setFile(e.target.files[0])}
//               />
//               {percentage !== null && percentage < 100 ? (
//                 <progress
//                   className="progress progress-accent w-56"
//                   value={percentage}
//                   max="100"
//                 ></progress>
//               ) : (
//                 percentage === 100 && (
//                   <div className="text-green-500 font-semibold">
//                     Upload Completed
//                   </div>
//                 )
//               )}
//             </div>
//             <div className="flex flex-col gap-3 mb-3">
//               <label htmlFor="productName">Product Name</label>
//               <input
//                 type="text"
//                 name="namaProduct"
//                 id="namaProduct"
//                 placeholder="Enter product name"
//                 value={namaProduct}
//                 required
//                 readOnly // Membuat input hanya bisa dibaca (readonly)
//                 className="input input-bordered w-full"
//               />
//             </div>
//             <div className="flex flex-col gap-3 mb-3">
//               <label htmlFor="address">Delivery Address</label>
//               <input
//                 type="text"
//                 name="address"
//                 id="address"
//                 value={address}
//                 required
//                 readOnly // Membuat input hanya bisa dibaca (readonly)
//                 className="input input-bordered w-full"
//               />
//             </div>
//           </div>
//           <div className="w-[100%] mx-auto mt-7">
//             <p>
//               Note: Upload bukti payment ketika status berubah menjadi pembelian
//               di acc,
//             </p>
//             <p>
//               Pembayaran bisa dilakukan dengan cara transfer sesuai dengan harga
//               yang tertera diatas kolom Approved Purchases
//             </p>
//           </div>
//           <div className="modal-action">
//             <button className="btn btn-primary" type="submit">
//               Upload Payment Proof
//             </button>
//           </div>
//         </form>
//       </div>
//       <Footer />
//     </div>
//   );
// };

// export default Purchase;


//CODE FIX BANGET
// "use client"
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
//   updateDoc,
//   query,
//   where,
//   getDocs,
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
//   const [percentage, setPercentage] = useState(null);
//   const [data, setData] = useState([]);
//   const [namaProduct, setNamaProduct] = useState(""); // State untuk nama produk
//   const [address, setAddress] = useState(""); // State untuk alamat pengiriman
//   const [selectedItems, setSelectedItems] = useState([]); // State untuk menyimpan item yang dipilih

//   useEffect(() => {
//     const unsub = onSnapshot(
//       collection(db, "userRequestOrder"),
//       (snapshot) => {
//         let list = [];
//         snapshot.docs.forEach((doc) => {
//           list.push({ id: doc.id, ref: doc.ref, ...doc.data() });
//         });
//         setData(list);

//         // Set nilai awal untuk nama produk dan alamat berdasarkan data pertama dari snapshot
//         if (list.length > 0) {
//           setNamaProduct(list[0].namaProduct || ""); // Mengambil nilai nama produk
//           setAddress(list[0].address || ""); // Mengambil nilai alamat pengiriman
//         }
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
//         "userRequestOrder/" +
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

//   const handleCheckboxChange = (itemId) => {
//     const selectedIndex = selectedItems.indexOf(itemId);
//     let newSelected = [];

//     if (selectedIndex === -1) {
//       newSelected = newSelected.concat(selectedItems, itemId);
//     } else if (selectedIndex === 0) {
//       newSelected = newSelected.concat(selectedItems.slice(1));
//     } else if (selectedIndex === selectedItems.length - 1) {
//       newSelected = newSelected.concat(selectedItems.slice(0, -1));
//     } else if (selectedIndex > 0) {
//       newSelected = newSelected.concat(
//         selectedItems.slice(0, selectedIndex),
//         selectedItems.slice(selectedIndex + 1)
//       );
//     }

//     setSelectedItems(newSelected);
//   };

//   const handleUploadPayment = async (e) => {
//     e.preventDefault();

//     try {
//       const downloadURL = file ? await uploadFile(file) : null;

//       // Update status and image for selected items
//       for (const itemId of selectedItems) {
//         const selectedData = data.find((item) => item.id === itemId);

//         if (selectedData) {
//           await updateDoc(selectedData.ref, {
//             status: "Bukti Payment Telah Dikirim",
//             image: downloadURL,
//           });
//         }
//       }

//       alert("Upload bukti pembayaran berhasil!");
//       setFile(null);
//       setSelectedItems([]);
//     } catch (error) {
//       console.error("Error uploading payment proof:", error);
//     }
//   };

//   return (
//     <div className="w-[100%] mx-auto mt-32">
//       <Navbar />
//       <div className="w-[90%] mx-auto mt-10">
//         <h2 className="text-2xl font-semibold mb-4">Status Pemesanan</h2>
//         <table className="table-auto w-full">
//           <thead>
//             <tr>
//               <th>Select</th>
//               <th>Product Name</th>
//               <th>Delivery Address</th>
//               <th>Contact</th>
//               <th>Kategori Kemasan</th>
//               <th>Jumlah Kemasan</th>
//               <th>Harga</th>
//               <th>Tanggal Kirim</th>
//               <th>Status</th>
//               <th>Time Stamp</th>
//             </tr>
//           </thead>
//           <tbody>
//             {data.map((item) => (
//               <tr key={item.id}>
//                 <td>
//                   <input
//                     type="checkbox"
//                     checked={selectedItems.indexOf(item.id) !== -1}
//                     onChange={() => handleCheckboxChange(item.id)}
//                   />
//                 </td>
//                 <td>{item.namaProduct}</td>
//                 <td>{item.address}</td>
//                 <td>{item.contact}</td>
//                 <td>{item.packaging}</td>
//                 <td>{item.stock}</td>
//                 <td>{item.price}</td>
//                 <td>{item.deliveryDate}</td>
//                 <td>{item.status}</td>
//                 <td>{item.timestamp?.toDate().toString()}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//       <div className="w-[90%] mx-auto mt-10">
//         <h2 className="text-2xl font-semibold mb-5">Upload Payment Proof</h2>
//         <div className="mb-5 text-lg">No. Rekening: 59796486447</div>
//         <form onSubmit={handleUploadPayment}>
//           <div className="py-4">
//             <div className="flex flex-col gap-3 mb-3">
//               <label htmlFor="image">Payment Proof Image</label>
//               <input
//                 type="file"
//                 name="image"
//                 id="image"
//                 required
//                 onChange={(e) => setFile(e.target.files[0])}
//               />
//               {percentage !== null && percentage < 100 ? (
//                 <progress
//                   className="progress progress-accent w-56"
//                   value={percentage}
//                   max="100"
//                 ></progress>
//               ) : (
//                 percentage === 100 && (
//                   <div className="text-green-500 font-semibold">
//                     Upload Completed
//                   </div>
//                 )
//               )}
//             </div>
//           </div>
//           {/* Tampilkan item yang dipilih di sini */}
//           {selectedItems.length > 0 && (
//             <div className="mb-5">
//               <h3 className="text-xl font-semibold mb-2">Selected Items:</h3>
//               <ul>
//                 {selectedItems.map((itemId) => {
//                   const selectedData = data.find((item) => item.id === itemId);
//                   if (selectedData) {
//                     return (
//                       <li key={selectedData.id}>
//                         <p>Product Name: {selectedData.namaProduct}</p>
//                         <p>Delivery Address: {selectedData.address}</p>
//                         <p>Contact: {selectedData.contact}</p>
//                         <p>Kategori Kemasan: {selectedData.packaging}</p>
//                         <p>Jumlah Kemasan: {selectedData.stock}</p>
//                         <p>Tanggal Pemesanan: {selectedData.timestamp?.toDate().toString()}</p> {/* Update this line */}
//                       </li>
//                     );
//                   }
//                   return null;
//                 })}
//               </ul>
//             </div>
//           )}
//           <div className="w-[100%] mx-auto mt-7">
//             <p>
//               Note: Upload bukti payment ketika status berubah menjadi pembelian
//               di acc,
//             </p>
//             <p>
//               Pembayaran bisa dilakukan dengan cara transfer sesuai dengan harga
//               yang tertera di atas kolom Approved Purchases
//             </p>
//           </div>
//           <div className="modal-action">
//             <button className="btn btn-primary" type="submit">
//               Upload Payment Proof
//             </button>
//           </div>
//         </form>
//       </div>
//       <Footer />
//     </div>
//   );
// };

// export default Purchase;


"use client";
import useAuth from "@/app/hooks/useAuth";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import NavbarUser from "@/components/NavbarUser";
import { db, storage } from "@/firebase/firebase";
import {
  collection,
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Purchase = () => {
  const { user, userProfile } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && userProfile.role === "admin") {
      router.push("/admin");
    }
  }, [user, userProfile, router]);

  const [file, setFile] = useState(null);
  const [percentage, setPercentage] = useState(null);
  const [data, setData] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "userRequestOrder"),
      (snapshot) => {
        let list = [];
        snapshot.docs.forEach((doc) => {
          list.push({ id: doc.id, ref: doc.ref, ...doc.data() });
        });
        setData(list);
      },
      (error) => {
        console.log(error);
      }
    );

    return () => {
      unsub();
    };
  }, []);

  const uploadFile = async (file) => {
    return new Promise((resolve, reject) => {
      const storageRef = ref(
        storage,
        "userRequestOrder/" +
          new Date().getTime() +
          file.name.replace(" ", "%20") +
          "KBB"
      );
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setPercentage(progress);
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
          }
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleCheckboxChange = (itemId) => {
    const selectedIndex = selectedItems.indexOf(itemId);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedItems, itemId);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedItems.slice(1));
    } else if (selectedIndex === selectedItems.length - 1) {
      newSelected = newSelected.concat(selectedItems.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedItems.slice(0, selectedIndex),
        selectedItems.slice(selectedIndex + 1)
      );
    }

    setSelectedItems(newSelected);
  };

  const handleUploadPayment = async (e) => {
    e.preventDefault();

    try {
      const downloadURL = file ? await uploadFile(file) : null;

      // Update status and image for selected items
      for (const itemId of selectedItems) {
        const selectedData = data.find((item) => item.id === itemId);

        if (selectedData) {
          await updateDoc(selectedData.ref, {
            status: "Bukti Payment Telah Dikirim",
            image: downloadURL, // Save image URL
          });
        }
      }

      alert("Upload bukti pembayaran berhasil!");
      setFile(null);
      setSelectedItems([]);
    } catch (error) {
      console.error("Error uploading payment proof:", error);
    }
  };

  return (
    <div className="w-[100%] mx-auto mt-32">
      <NavbarUser />
      <div className="w-[90%] mx-auto mt-10">
        <h2 className="text-2xl font-semibold mb-4">Status Pemesanan</h2>
        <table className="table-auto w-full">
          <thead>
            <tr>
              <th>Pilih</th>
              <th>Nama Beras</th>
              <th>Alamat Pengiriman</th>
              <th>Kontak</th>
              <th>Kategori Kemasan</th>
              <th>Jumlah Kemasan</th>
              <th>Harga</th>
              <th>Tanggal Kirim</th>
              <th>Status</th>
              <th>Tanggal Pemesanan</th>
              <th>Bukti Pembayaran</th> {/* New column for image */}
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedItems.indexOf(item.id) !== -1}
                    onChange={() => handleCheckboxChange(item.id)}
                  />
                </td>
                <td>{item.namaProduct}</td>
                <td>{item.address}</td>
                <td>{item.contact}</td>
                <td>{item.packaging}</td>
                <td>{item.stock}</td>
                <td>{item.price}</td>
                <td>{item.deliveryDate}</td>
                <td>{item.status}</td>
                <td>{item.timestamp?.toDate().toString()}</td>
                <td>
                  {item.image ? (
                    <img
                      src={item.image}
                      alt="Payment Proof"
                      style={{ width: '100px', height: 'auto' }}
                    />
                  ) : (
                    'Belum Unggah'
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="w-[90%] mx-auto mt-10">
        <h2 className="text-2xl font-semibold mb-5">Unggah Bukti Pembayaran</h2>
        <div className="mb-5 text-lg">No. Rekening: 59796486447</div>
        <form onSubmit={handleUploadPayment}>
          <div className="py-4">
            <div className="flex flex-col gap-3 mb-3">
              <label htmlFor="image">Foto Bukti Pembayaran</label>
              <input
                type="file"
                name="image"
                id="image"
                required
                onChange={(e) => setFile(e.target.files[0])}
              />
              {percentage !== null && percentage < 100 ? (
                <progress
                  className="progress progress-accent w-56"
                  value={percentage}
                  max="100"
                ></progress>
              ) : (
                percentage === 100 && (
                  <div className="text-green-500 font-semibold">
                    Unggah Berhasil
                  </div>
                )
              )}
            </div>
          </div>
          {selectedItems.length > 0 && (
            <div className="mb-5">
              <h3 className="text-xl font-semibold mb-2">Pilihan Pesanan:</h3>
              <ul>
                {selectedItems.map((itemId) => {
                  const selectedData = data.find((item) => item.id === itemId);
                  if (selectedData) {
                    return (
                      <li key={selectedData.id}>
                        <p>Nama Beras: {selectedData.namaProduct}</p>
                        <p>Alamat Pengiriman: {selectedData.address}</p>
                        <p>Kontak: {selectedData.contact}</p>
                        <p>Kategori Kemasan: {selectedData.packaging}</p>
                        <p>Jumlah Kemasan: {selectedData.stock}</p>
                        <p>Tanggal Pemesanan: {selectedData.timestamp?.toDate().toString()}</p>
                      </li>
                    );
                  }
                  return null;
                })}
              </ul>
            </div>
          )}
          <div className="w-[100%] mx-auto mt-7">
            <p>
              Catatan: Unggah bukti payment ketika status berubah menjadi pembelian
              di acc,
            </p>
            <p>
              Pembayaran bisa dilakukan dengan cara transfer sesuai dengan harga
              yang tertera di atas
            </p>
          </div>
          <div className="modal-action">
            <button className="btn btn-primary" type="submit">
              Unggah Bukti Pembayaran
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default Purchase;
