// "use client";
// import useAuth from "@/app/hooks/useAuth";
// import NavbarAdmin from "@/components/NavbarAdmin";
// import { db, storage } from "@/firebase/firebase";
// import {
//   collection,
//   doc,
//   onSnapshot,
//   serverTimestamp,
//   setDoc,
//   updateDoc,
//   getDocs,
//   query,
//   where
// } from "firebase/firestore";
// import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
// import { useRouter } from "next/navigation";
// import React, { useEffect, useState } from "react";

// const Purchase = () => {
//   const { user, userProfile } = useAuth();
//   const router = useRouter();

//   useEffect(() => {
//     if (user && userProfile.role === "user") {
//       router.push("/");
//     }
//   }, [user, userProfile, router]);

//   const [file, setFile] = useState(null);
//   const [itemName, setItemName] = useState("");
//   const [category, setCategory] = useState("fikom");
//   const [quantity, setQuantity] = useState("");
//   const [status, setStatus] = useState("ready");
//   const [price, setPrice] = useState("");
//   const [percentage, setPercentage] = useState(null);
//   const [data, setData] = useState([]);
//   const [priceInput, setPriceInput] = useState({});

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
//         new Date().getTime() +
//         file.name.replace(" ", "%20") +
//         "KBB"
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
//       const downloadURL = await uploadFile(file);
//       const purchaseData = {
//         id: new Date().getTime() + user.uid + "PEMBELIAN",
//         image: downloadURL,
//         itemName: itemName,
//         category: category,
//         quantity: quantity,
//         status: status,
//         price: price,
//       };

//       await setDoc(doc(db, "pembelian1", purchaseData.id), {
//         ...purchaseData,
//         timeStamp: serverTimestamp(),
//       });

//       setFile(null);
//       setItemName("");
//       setCategory("fikom");
//       setQuantity("");
//       setStatus("ready");
//       setPrice("");
//       setPercentage(null);
//       alert("Pembelian berhasil ditambahkan!");
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const handleAccPurchase = async (id) => {
//     try {
//       const purchaseDocRef = doc(db, "pembelian1", id);
//       const price = priceInput[id];
//       await updateDoc(purchaseDocRef, { status: "pembelian di acc", price: price });
//       alert("Status pembelian berhasil diubah!");
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   // const handleSendToWarehouse = async (id) => {
//   //   // try {
//   //   //   const purchaseDocRef = doc(db, "pembelian1", id);
//   //   //   const purchaseDoc = await purchaseDocRef.get();
//   //   //   const { itemName } = purchaseDoc.data();

//   //   //   await updateDoc(purchaseDocRef, { status: "menunggu proses gudang" });

//   //   //   // Update corresponding payment status in buktiPembayaran
//   //   //   const q = query(collection(db, "buktiPembayaran"), where("itemName", "==", itemName));
//   //   //   const querySnapshot = await getDocs(q);

//   //   //   querySnapshot.forEach(async (doc) => {
//   //   //     await updateDoc(doc.ref, { statusPembayaran: "menunggu proses gudang" });
//   //   //   });

//   //   //   alert("Status pembelian dan pembayaran berhasil diubah menjadi menunggu proses gudang!");
//   //   // } catch (error) {
//   //   //   console.log(error);
//   //   // }
//   //   try {
//   //     const purchaseDocRef = doc(db, "pembelian1", id);
//   //     const price = priceInput[id];
//   //     await updateDoc(purchaseDocRef, { status: "menunggu proses gudang" });
//   //     alert("Status pembelian berhasil diubah!");
//   //   } catch (error) {
//   //     console.log(error);
//   //   }
//   // };

//   const handleSendToWarehouse = async (id) => {
//     try {
//       const purchaseDocRef = doc(db, "pembelian1", id);
//       // const purchaseDoc = await getDoc(purchaseDocRef);
//       // const { itemName } = purchaseDoc.data();
  
//       // Update status pembelian di pembelian1
//       await updateDoc(purchaseDocRef, { status: "menunggu proses gudang" });
//       alert("Status pembelian berhasil diubah!");
  
//       // // Update status pembayaran yang sesuai di buktiPembayaran
//       // const q = query(collection(db, "buktiPembayaran"), where("itemName", "==", itemName));
//       // const querySnapshot = await getDocs(q);
  
//       // querySnapshot.forEach(async (doc) => {
//       //   await updateDoc(doc.ref, { statusPembayaran: "menunggu proses gudang" });
//       // });
  
//       // // Update local state approvedData (jika perlu)
//       // const updatedApprovedData = approvedData.map(purchase => {
//       //   if (purchase.id === id) {
//       //     return { ...purchase, status: "menunggu proses gudang" };
//       //   } else {
//       //     return purchase;
//       //   }
//       // });
  
//       // setApprovedData(updatedApprovedData);
  
//       // alert("Status pembelian dan pembayaran berhasil diubah menjadi menunggu proses gudang!");
//     } catch (error) {
//       console.log(error);
//     }
//   };
  
  

//   const handlePriceChange = (id, value) => {
//     setPriceInput(prevState => ({
//       ...prevState,
//       [id]: value
//     }));
//   };

//   return (
//     <div className="w-[100%] mx-auto mt-32">
//       <NavbarAdmin />
//       <div className="w-[90%] flex justify-center items-center gap-3 mb-10">
//         <h1 className="text-3xl font-semibold mb-3">Purchase Form</h1>
//       </div>
//       <div className="w-[90%] mx-auto mt-10">
//         <h2 className="text-2xl font-semibold mb-5">Purchase List</h2>
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
//                 <th>Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {data.map((purchase, index) => (
//                 <tr key={purchase.id}>
//                   <th>{index + 1}</th>
//                   <td>
//                     <img src={purchase.image} alt={purchase.itemName} width="50" />
//                   </td>
//                   <td>{purchase.itemName}</td>
//                   <td>{purchase.category}</td>
//                   <td>{purchase.quantity}</td>
//                   <td>
//                     <input
//                       type="number"
//                       value={priceInput[purchase.id] || ""}
//                       onChange={(e) => handlePriceChange(purchase.id, e.target.value)}
//                       className="input input-bordered w-full"
//                     />
//                   </td>
//                   <td>{purchase.status}</td>
//                   <td>
//                     {purchase.timeStamp
//                       ? new Date(purchase.timeStamp.seconds * 1000).toLocaleString()
//                       : "N/A"}
//                   </td>
//                   <td>
//                     {purchase.status === "ready" && (
//                       <button
//                         className="btn btn-success"
//                         onClick={() => handleAccPurchase(purchase.id)}
//                       >
//                         Acc
//                       </button>
//                     )}
//                     {purchase.status === "pembelian di acc" && (
//                       <button
//                         className="btn btn-primary"
//                         onClick={() => handleSendToWarehouse(purchase.id)}
//                       >
//                         Send to Warehouse
//                       </button>
//                     )}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Purchase;



//INI CODE 2 YANG FIX YAA JANGAN SAMPAI LUPA AWAS AJA
// "use client";
// import useAuth from "@/app/hooks/useAuth";
// import NavbarAdmin from "@/components/NavbarAdmin";
// import { db, storage } from "@/firebase/firebase";
// import {
//   collection,
//   doc,
//   onSnapshot,
//   serverTimestamp,
//   updateDoc,
// } from "firebase/firestore";
// import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
// import { useRouter } from "next/navigation";
// import React, { useEffect, useState } from "react";

// const Purchase = () => {
//   const { user, userProfile } = useAuth();
//   const router = useRouter();

//   useEffect(() => {
//     if (user && userProfile.role === "user") {
//       router.push("/");
//     }
//   }, [user, userProfile, router]);

//   const [file, setFile] = useState(null);
//   const [productName, setProductName] = useState("");
//   const [deliveryAddress, setDeliveryAddress] = useState("");
//   const [contact, setContact] = useState("");
//   const [quantityRice, setQuantityRice] = useState("");
//   const [packageCategory, setPackageCategory] = useState("");
//   const [packageQuantity, setPackageQuantity] = useState("");
//   const [price, setPrice] = useState("");
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
//         price: price,
//         status: "pending",
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
//       setPrice("");
//       setPercentage(null);
//       alert("Order request successfully added!");
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const handlePriceChange = async (newValue, itemId) => {
//     try {
//       await updateDoc(doc(db, "pembelian1", itemId), { price: newValue });
//       const newData = data.map((item) =>
//         item.id === itemId ? { ...item, price: newValue } : item
//       );
//       setData(newData);
//     } catch (error) {
//       console.log("Error updating price:", error);
//     }
//   };

//   const handleAcceptOrder = async (itemId) => {
//     try {
//       await updateDoc(doc(db, "pembelian1", itemId), { status: "silahkan melakukan pembayaran" });
//       alert("Order accepted successfully!");
//     } catch (error) {
//       console.log("Error accepting order:", error);
//     }
//   };

//   return (
//     <div className="w-[100%] mx-auto mt-32">
//       <NavbarAdmin />
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
//               <th>Price</th>
//               <th>Status</th>
//               <th>Time Stamp</th>
//               <th>Action</th>
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
//                 <td>
//                   <input
//                     type="text"
//                     value={item.price}
//                     onChange={(e) => handlePriceChange(e.target.value, item.id)}
//                     className="input input-bordered w-full"
//                   />
//                 </td>
//                 <td>{item.status}</td>
//                 <td>{item.timeStamp?.toDate().toString()}</td>
//                 <td>
//                   {item.status === "product" && (
//                     <button
//                       onClick={() => handleAcceptOrder(item.id)}
//                       className="btn btn-sm btn-primary"
//                     >
//                       Accept
//                     </button>
//                   )}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default Purchase;




// "use client"
// import useAuth from "@/app/hooks/useAuth";
// import Footer from "@/components/Footer";
// import Navbar from "@/components/Navbar";
// import NavbarAdmin from "@/components/NavbarAdmin";
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
//     if (user && userProfile.role === "user") {
//       router.push("/");
//     }
//   }, [user, userProfile, router]);

//   const [file, setFile] = useState(null);
//   const [productName, setProductName] = useState("");
//   const [deliveryAddress, setDeliveryAddress] = useState("");
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

//   const handleUploadPayment = async (e) => {
//     e.preventDefault();

//     try {
//       // Upload gambar ke Firebase Storage
//       const downloadURL = file ? await uploadFile(file) : null;

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
//           // Update status menjadi "menunggu konfirmasi gudang" dan simpan URL gambar
//           await updateDoc(doc.ref, { 
//             status: "menunggu konfirmasi gudang",
//             image: downloadURL // Simpan URL gambar ke dalam dokumen
//           });
//           alert("Upload bukti pembayaran berhasil!");
//           setFile(null); // Reset state file setelah upload berhasil
//         } catch (error) {
//           console.error("Error updating document:", error);
//         }
//       });
//     } catch (error) {
//       console.error("Error getting documents:", error);
//     }
//   };

//   const handleSendToGudang = async (itemId) => {
//     try {
//       const itemRef = doc(db, "pembelian1", itemId);
//       await updateDoc(itemRef, { status: "sedang melakukan pengecekan data barang" });
//       alert("Status updated successfully!");
//     } catch (error) {
//       console.error("Error updating document:", error);
//     }
//   };

//   return (
//     <div className="w-[100%] mx-auto mt-32">
//       <NavbarAdmin />
//       {/* <div className="w-[90%] flex justify-center items-center gap-3 mb-10">
//         <h1 className="text-3xl font-semibold mb-3">Request Order Form</h1>
//       </div> */}
//       <div className="w-[90%] mx-auto mt-10">
//         {/* <h2 className="text-2xl font-semibold mb-4">Order Requests</h2> */}
//         <table className="table-auto w-full">
//           <thead>
//             <tr>
//               <th>Product Name</th>
//               <th>Delivery Address</th>
//               <th>Payment Proof</th>
//               <th>Quantity of Rice</th>
//               <th>Package Category</th>
//               <th>Package Quantity</th>
//               <th>Status</th>
//               <th>Time Stamp</th>
//               <th>Action</th> {/* Kolom untuk tombol Send to Gudang */}
//             </tr>
//           </thead>
//           <tbody>
//             {data.map((item) => (
//               <tr key={item.id}>
//                 <td>{item.productName}</td>
//                 <td>{item.deliveryAddress}</td>
//                 <td>
//                   {item.image ? (
//                     <img src={item.image} alt="Payment Proof" className="w-24 h-24 object-cover" />
//                   ) : (
//                     "No Payment Proof"
//                   )}
//                 </td>
//                 <td>{item.quantityRice}</td>
//                 <td>{item.packageCategory}</td>
//                 <td>{item.packageQuantity}</td>
//                 <td>{item.status}</td>
//                 <td>{item.timeStamp?.toDate().toString()}</td>
//                 <td>
//                   {item.status === "menunggu konfirmasi gudang" && (
//                     <button
//                       className="btn btn-primary"
//                       onClick={() => handleSendToGudang(item.id)}
//                     >
//                       Send to Gudang
//                     </button>
//                   )}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//       {/* <div className="w-[90%] mx-auto mt-10">
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
//       </div> */}
//       <Footer/>
//     </div>
//   );
// };

// export default Purchase;

//code fix banget
// "use client"
// import useAuth from "@/app/hooks/useAuth";
// import Footer from "@/components/Footer";
// import Navbar from "@/components/Navbar";
// import NavbarAdmin from "@/components/NavbarAdmin";
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
//     if (user && userProfile.role === "user") {
//       router.push("/");
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
//             status: "Menunggu Konfirmasi Gudang",
//             image: downloadURL,
//             serverTimeStamp: serverTimestamp(),
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
//       <NavbarAdmin />
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
//               <th>Payment Proof</th>
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
//                 <td>
//                   {item.image && (
//                     <img
//                       src={item.image}
//                       alt="Payment Proof"
//                       className="h-12 w-auto"
//                     />
//                   )}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//       <div className="w-[90%] mx-auto mt-10">
//         <h2 className="text-2xl font-semibold mb-5">Upload Payment Proof</h2>
//         <form onSubmit={handleUploadPayment}>
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
//                         <p>Bukti Payment : {selectedData.image}                     <img
//                       src={selectedData.image}
//                       alt="Payment Proof"
//                       className="h-52 w-auto"
//                     /></p>
//                         <p>Tanggal Pemesanan: {selectedData.timestamp?.toDate().toString()}</p>
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
//               Send To Gudang
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
import NavbarAdmin from "@/components/NavbarAdmin";
import { db, storage } from "@/firebase/firebase";
import {
  collection,
  doc,
  onSnapshot,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Purchase = () => {
  const { user, userProfile } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && userProfile.role === "user") {
      router.push("/");
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
      let downloadURL = null;
      if (file) {
        downloadURL = await uploadFile(file);
      }

      // Update status and image for selected items
      for (const itemId of selectedItems) {
        const selectedData = data.find((item) => item.id === itemId);

        if (selectedData) {
          // Only update the image URL if it was uploaded
          await updateDoc(selectedData.ref, {
            status: "Menunggu Konfirmasi Gudang",
            ...(downloadURL && { image: downloadURL }), // Update image only if a new one was uploaded
            serverTimeStamp: serverTimestamp(),
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
      <NavbarAdmin />
      <div className="w-[90%] mx-auto mt-10">
        <h2 className="text-2xl font-semibold mb-4">Bukti Pembayaran</h2>
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
              <th>Bukti Pembayaran</th>
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
                  {item.image && (
                    <img
                      src={item.image}
                      alt="Payment Proof"
                      className="h-12 w-auto"
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="w-[90%] mx-auto mt-10">
        <h2 className="text-2xl font-semibold mb-5">Unggah Bukti Pembayaran</h2>
        <form onSubmit={handleUploadPayment}>
          {selectedItems.length > 0 && (
            <div className="mb-5">
              {/* <h3 className="text-xl font-semibold mb-2">Pilih Beras:</h3> */}
              <ul>
                {selectedItems.map((itemId) => {
                  const selectedData = data.find((item) => item.id === itemId);
                  if (selectedData) {
                    return (
                      <li key={selectedData.id}>
                        <p>Nama Beras: {selectedData.namaProduct}</p>
                        <p>Alamat Pengiriman: {selectedData.address}</p>
                        <p>kontak: {selectedData.contact}</p>
                        <p>Kategori Kemasan: {selectedData.packaging}</p>
                        <p>Jumlah Kemasan: {selectedData.stock}</p>
                        <p>Bukti Pembayaran : {selectedData.image && (
                          <img
                            src={selectedData.image}
                            alt="Payment Proof"
                            className="h-52 w-auto"
                          />
                        )}</p>
                        <p>Tanggal Pemesanan: {selectedData.timestamp?.toDate().toString()}</p>
                      </li>
                    );
                  }
                  return null;
                })}
              </ul>
            </div>
          )}
          {/* <div className="w-[100%] mx-auto mt-7">
            <p>
              Note: Upload bukti payment ketika status berubah menjadi pembelian
              di acc,
            </p>
            <p>
              Pembayaran bisa dilakukan dengan cara transfer sesuai dengan harga
              yang tertera di atas kolom Approved Purchases
            </p>
          </div> */}
          <div className="modal-action">
            <button className="btn btn-primary" type="submit">
              Kirim Ke Gudang
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default Purchase;
