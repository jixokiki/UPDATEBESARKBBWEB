// "use client";
// import useAuth from "@/app/hooks/useAuth";
// import useProduct from "@/app/hooks/useProduct";
// import CardItem from "@/components/CardItem";
// import CardItem2 from "@/components/CardItem2";
// import Footer from "@/components/Footer";
// import Navbar from "@/components/Navbar";
// import NavbarAdmin from "@/components/NavbarAdmin";
// import NavbarGudang from "@/components/NavbarGudang";
// import { db } from "@/firebase/firebase";
// import { collection, onSnapshot } from "firebase/firestore";
// import { useRouter } from "next/navigation";
// import React, { useEffect, useState } from "react";

// const Desain = () => {
//   const { user, userProfile } = useAuth();
//   const router = useRouter();
//   const [categoryFilter, setCategoryFilter] = useState("all");
//   const [searchInput, setSearchInput] = useState("");
//   const [data, setData] = useState([]);
//   const [newAssetNotification, setNewAssetNotification] = useState(false);
//   const [AssetNotification, setAssetNotification] = useState(false);
//   const { isInCart, removeFromCart, addToCart } = useProduct();

//   useEffect(() => {
//     if (user && userProfile.role === "user") {
//       router.push("/");
//     }
//   }, [user, userProfile, router]);



//   //USE EFFECT YANG FIX BUAT ALERT
//   useEffect(() => {
//     const unsubProduct = onSnapshot(
//       collection(db, "desain"),
//       (snapshot) => {
//         let list = [];
//         snapshot.docs.forEach((doc) => {
//           list.push({ id: doc.id, ...doc.data() });
//         });

//         // Memeriksa apakah ada aset baru yang ditambahkan
//         const isNewAssetAdded = list.length === data.length;
//         // const isAsset = list.length > data.length;
//         if (isNewAssetAdded) {
//           setNewAssetNotification(true); // Jika ada aset baru, atur notifikasi untuk ditampilkan
//           setAssetNotification(false); // Jika ada aset baru, atur notifikasi "Happy Shopping" menjadi false
//           // alert("New Asset Added");
//         } else {
//           setNewAssetNotification(false); // Jika tidak ada aset baru, atur notifikasi "New Asset Added" menjadi false
//           setAssetNotification(true); // Jika tidak ada aset baru, atur notifikasi untuk "Happy Shopping"
//           // alert("Happy Shopping");
//         }

//         setData(list);
//       },
//       (error) => {
//         console.log(error);
//       }
//     );
//     return () => {
//       unsubProduct();
//     };
//   }, []);

//   // Menyaring produk berdasarkan kategori yang dipilih
//   const filteredData =
//     data && categoryFilter === "all"
//       ? data
//       : data.filter(
//           (product) => product.category.toLowerCase() === categoryFilter
//         );

//   // Fungsi untuk memperbarui state pencarian ketika nilai input berubah
//   const handleSearchInputChange = (e) => {
//     setSearchInput(e.target.value.toLowerCase());
//   };

//   // Fungsi untuk memilih opsi dropdown sesuai dengan input pencarian
//   useEffect(() => {
//     const selectElement = document.querySelector(".select");
//     // Melakukan perulangan pada setiap opsi dropdown
//     selectElement.childNodes.forEach((option) => {
//       if (option.value.toLowerCase().includes(searchInput)) {
//         // Jika nilai opsi cocok dengan input pengguna, opsi tersebut akan dipilih
//         option.selected = true;
//       }
//     });
//     // Memperbarui state kategori filter sesuai dengan input pencarian
//     setCategoryFilter(searchInput);
//   }, [searchInput]);

//   // // Fungsi untuk menyembunyikan notifikasi asset baru telah ditambahkan setelah beberapa waktu
//   useEffect(() => {
//     const notificationTimeout = setTimeout(() => {
//       setNewAssetNotification(false);
//     }, 5000); // Menampilkan notifikasi selama 5 detik
//     return () => clearTimeout(notificationTimeout);
//   }, [newAssetNotification]);

//   // Fungsi untuk menyembunyikan notifikasi asset yang bukan baru setelah beberapa waktu
//   useEffect(() => {
//     const notificationTimeout = setTimeout(() => {
//       setAssetNotification(false);
//     }, 5000); // Menampilkan notifikasi selama 5 detik
//     return () => clearTimeout(notificationTimeout);
//   }, [AssetNotification]);

//   // {newAssetNotification && (
//   //   <div className="notification p-8 md:p-24 mt-10">New asset added!</div>
//   // )}
//   // {AssetNotification && (
//   //   <div className="notification flex flex-col p-8 md:p-24 mt-10">
//   //     <span>Happy Hunting</span>
//   //   </div>
//   // )}
  
//   return (
//     <div>
//       <NavbarGudang />
//       <div className="p-8 md:p-24 mt-10">
//         <div className="flex justify-between mb-10">
//           <h2 className="text-3xl mb-3">All Products</h2>
//           {AssetNotification && (
//             <div className="notification-3xl mb-3">
//               Happy Hunting
//             </div>
//           )}
//           <input
//             type="text"
//             className="input input-bordered"
//             value={searchInput}
//             onChange={handleSearchInputChange}
//           />
//           <select
//             className="select select-bordered w-full max-w-xs"
//             onChange={(e) => setCategoryFilter(e.target.value.toLowerCase())}
//           >
//             <option value={"all"}>All</option>
//             <option value={"fikom"}>Fikom</option>
//             <option value={"dkv"}>DKV</option>
//             <option value={"fasilkom"}>Fasilkom</option>
//             <option value={"baleho 1"}>Baleho</option>
//             <option value={"baleho 2"}>Baleho</option>
//             <option value={"baleho 3"}>Baleho</option>
//             <option value={"baleho 4"}>Baleho</option>
//             <option value={"baleho 5"}>Baleho</option>
//             <option value={"baleho 6"}>Baleho</option>
//             <option value={"baleho 7"}>Baleho</option>
//             <option value={"baleho 8"}>Baleho</option>
//             <option value={"baleho 9"}>Baleho</option>
//             <option value={"baleho 10"}>Baleho</option>
//           </select>
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-3 place-items-center gap-6">
//           {filteredData.map((product) => (
//             // <CardItem
//             //   key={product.id}
//             //   imageUrl={product.image}
//             //   fakultas={product.category}
//             //   judul={product.title}
//             //   deskripsi={product.description}
//             //   harga={product.price}
//             // //   addToCart={() => addToCart(product)}
//             //   removeFromCart={() => removeFromCart(product)}
//             //   isInCart={isInCart(product.id)}
//             // />
//             <CardItem2
//                 key={product.id}
//                imageUrl={product.image}
//                fakultas={product.category}
//                judul={product.title}
//                deskripsi={product.description}
//                harga={product.price}
//             />
//           ))}
//         </div>
//       </div>
//       <Footer />
//     </div>
//   );
// };

// export default Desain;


//TERBARU
// "use client";
// import useAuth from "@/app/hooks/useAuth";
// import Footer from "@/components/Footer";
// import Navbar from "@/components/Navbar";
// import NavbarAdmin from "@/components/NavbarAdmin";
// import NavbarGudang from "@/components/NavbarGudang";
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

//   // const handleKonfirmasi = async (status) => {
//   //   try {
//   //     // Update status for selected items
//   //     for (const itemId of selectedItems) {
//   //       const selectedData = data.find((item) => item.id === itemId);

//   //       if (selectedData) {
//   //         await updateDoc(selectedData.ref, {
//   //           status: status,
//   //         });
//   //       }
//   //     }

//   //     alert(`Status updated to ${status}!`);
//   //     setSelectedItems([]);
//   //   } catch (error) {
//   //     console.error("Error updating status:", error);
//   //   }
//   // };

//   const handleKonfirmasi = async (status) => {
//     try {
//       // Update status for selected items
//       for (const itemId of selectedItems) {
//         const selectedData = data.find((item) => item.id === itemId);
  
//         if (selectedData) {
//           // Update status
//           await updateDoc(selectedData.ref, {
//             status: status,
//           });
  
//           // Add price to database only if status is "Menunggu Pembayaran"
//           if (status === "Menunggu Pembayaran") {
//             await updateDoc(selectedData.ref, {
//               price: selectedData.totalHarga,
//             });
//           }else{
//             status === "Ditolak"
//           }
//         }
//       }
  
//       alert(`Status updated to ${status}!`);
//       setSelectedItems([]);
//     } catch (error) {
//       console.error("Error updating status:", error);
//     }
//   };
  
  
  
  
//   return (
//     <div className="w-[100%] mx-auto mt-32">
//       <NavbarGudang />
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
//                 <td>{item.totalHarga}</td>
//                 <td>{item.deliveryDate}</td>
//                 <td>{item.status}</td>
//                 <td>{item.timestamp?.toDate().toString()}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//       <div className="w-[90%] mx-auto mt-10">
//         <h2 className="text-2xl font-semibold mb-5">Send To Gudang Process</h2>
//         <form>
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
//                         <p>Tanggal Pemesanan: {selectedData.timestamp?.toDate().toString()}</p>
//                       </li>
//                     );
//                   }
//                   return null;
//                 })}
//               </ul>
//             </div>
//           )}
//           <div className="modal-action">
//             <button
//               className="btn btn-primary"
//               type="button"
//               onClick={() => handleKonfirmasi("Menunggu Pembayaran")}
//             >
//               Konfirmasi
//             </button>
//             <button
//               className="btn btn-secondary"
//               type="button"
//               onClick={() => handleKonfirmasi("Ditolak")}
//             >
//               Tolak
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
import NavbarAdmin from "@/components/NavbarAdmin";
import NavbarGudang from "@/components/NavbarGudang";
import { db, storage } from "@/firebase/firebase";
import {
  collection,
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  updateDoc,
  query,
  where,
  getDocs,
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
  const [namaProduct, setNamaProduct] = useState(""); // State untuk nama produk
  const [address, setAddress] = useState(""); // State untuk alamat pengiriman
  const [selectedItems, setSelectedItems] = useState([]); // State untuk menyimpan item yang dipilih

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "userRequestOrder"),
      (snapshot) => {
        let list = [];
        snapshot.docs.forEach((doc) => {
          list.push({ id: doc.id, ref: doc.ref, ...doc.data() });
        });
        setData(list);

        // Set nilai awal untuk nama produk dan alamat berdasarkan data pertama dari snapshot
        if (list.length > 0) {
          setNamaProduct(list[0].namaProduct || ""); // Mengambil nilai nama produk
          setAddress(list[0].address || ""); // Mengambil nilai alamat pengiriman
        }
      },
      (error) => {
        console.log(error);
      }
    );

    return () => {
      unsub();
    };
  }, []);

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

  const handleKonfirmasi = async (status) => {
    try {
      // Update status for selected items
      for (const itemId of selectedItems) {
        const selectedData = data.find((item) => item.id === itemId);
  
        if (selectedData) {
          // Update status in userRequestOrder collection
          await updateDoc(selectedData.ref, {
            status: status,
          });

          // Add price to database only if status is "Menunggu Pembayaran"
          if (status === "Menunggu Pembayaran") {
            await updateDoc(selectedData.ref, {
              price: selectedData.totalHarga,
            });
          }

          // Add to userProses collection
          const userProsesRef = doc(collection(db, "userProses"), selectedData.id);
          const { stock, ...restData } = selectedData; // Destructure to remove 'stock'

          await setDoc(userProsesRef, {
            ...restData,
            stockProses: selectedData.stock, // Add 'stockProses' field
            status: status,
            timestamp: serverTimestamp(),
          });
        }
      }
  
      alert(`Status updated to ${status}!`);
      setSelectedItems([]);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  return (
    <div className="w-[100%] mx-auto mt-32">
      <NavbarGudang />
      <div className="w-[90%] mx-auto mt-10">
        <h2 className="text-2xl font-semibold mb-4">Pesanan</h2>
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
                <td>{item.totalHarga}</td>
                <td>{item.deliveryDate}</td>
                <td>{item.status}</td>
                <td>{item.timestamp?.toDate().toString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="w-[90%] mx-auto mt-10">
        <h2 className="text-2xl font-semibold mb-5">Proses Kirim Ke Marketing</h2>
        <form>
          {/* Tampilkan item yang dipilih di sini */}
          {selectedItems.length > 0 && (
            <div className="mb-5">
              {/* <h3 className="text-xl font-semibold mb-2">Selected Items:</h3> */}
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
          <div className="modal-action">
            <button
              className="btn btn-primary"
              type="button"
              onClick={() => handleKonfirmasi("Menunggu Pembayaran")}
            >
              Setujui
            </button>
            <button
              className="btn btn-secondary"
              type="button"
              onClick={() => handleKonfirmasi("Ditolak")}
            >
              Tolak
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default Purchase;



