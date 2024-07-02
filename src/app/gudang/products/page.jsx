// "use client";
// import useAuth from "@/app/hooks/useAuth";
// import useProduct from "@/app/hooks/useProduct";
// import CardItem from "@/components/CardItem";
// import Footer from "@/components/Footer";
// import Navbar from "@/components/Navbar";
// import { db } from "@/firebase/firebase";
// import { collection, onSnapshot, addDoc } from "firebase/firestore";
// import { useRouter } from "next/navigation";
// import React, { useEffect, useState } from "react";

// const Product = () => {
//   const { user, userProfile } = useAuth();
//   const router = useRouter();
//   const [categoryFilter, setCategoryFilter] = useState("all");
//   const [searchInput, setSearchInput] = useState("");
//   const [data, setData] = useState([]);
//   const [newAssetNotification, setNewAssetNotification] = useState(false);
//   const [AssetNotification, setAssetNotification] = useState(false);
//   const { isInCart, removeFromCart, addToCart } = useProduct();

//   useEffect(() => {
//     if (user && userProfile.role === "admin") {
//       router.push("/admin");
//     }
//   }, [user, userProfile, router]);

//   useEffect(() => {
//     const unsubProduct = onSnapshot(
//       collection(db, "products"),
//       (snapshot) => {
//         let list = [];
//         snapshot.docs.forEach((doc) => {
//           list.push({ id: doc.id, ...doc.data() });
//         });

//         const isNewAssetAdded = list.length === data.length;
//         if (isNewAssetAdded) {
//           setNewAssetNotification(true);
//           setAssetNotification(false);
//         } else {
//           setNewAssetNotification(false);
//           setAssetNotification(true);
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
//   }, [data.length]);

//   const filteredData =
//     data && categoryFilter === "all"
//       ? data
//       : data.filter(
//           (product) => product.category.toLowerCase() === categoryFilter
//         );

//   const handleSearchInputChange = (e) => {
//     setSearchInput(e.target.value.toLowerCase());
//   };

//   useEffect(() => {
//     const selectElement = document.querySelector(".select");
//     selectElement.childNodes.forEach((option) => {
//       if (option.value.toLowerCase().includes(searchInput)) {
//         option.selected = true;
//       }
//     });
//     setCategoryFilter(searchInput);
//   }, [searchInput]);

//   useEffect(() => {
//     const notificationTimeout = setTimeout(() => {
//       setNewAssetNotification(false);
//     }, 5000);
//     return () => clearTimeout(notificationTimeout);
//   }, [newAssetNotification]);

//   useEffect(() => {
//     const notificationTimeout = setTimeout(() => {
//       setAssetNotification(false);
//     }, 5000);
//     return () => clearTimeout(notificationTimeout);
//   }, [AssetNotification]);

//   const handleAddToCart = async (product) => {
//     addToCart(product);

//     try {
//       await addDoc(collection(db, "historypayments"), {
//         userId: user.uid,
//         productId: product.id,
//         title: product.title,
//         price: product.price,
//         timestamp: new Date(),
//       });
//       console.log("Product added to historypayments:", product);
//     } catch (error) {
//       console.error("Error adding to history:", error);
//     }
//   };

//   return (
//     <div>
//       <Navbar />
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
//             <CardItem
//               key={product.id}
//               imageUrl={product.image}
//               fakultas={product.category}
//               judul={product.title}
//               deskripsi={product.description}
//               harga={product.price}
//               addToCart={() => handleAddToCart(product)}
//               removeFromCart={() => removeFromCart(product)}
//               isInCart={isInCart(product.id)}
//             />
//           ))}
//         </div>
//       </div>
//       <Footer />
//     </div>
//   );
// };

// export default Product;


//code fx
"use client";
import useAuth from "@/app/hooks/useAuth";
import useProduct from "@/app/hooks/useProduct";
import CardItem from "@/components/CardItem";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import NavbarGudang from "@/components/NavbarGudang";
import { db } from "@/firebase/firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Product = () => {
  const { user, userProfile } = useAuth();
  const router = useRouter();
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [searchInput, setSearchInput] = useState("");
  const [data, setData] = useState([]);
  const [newAssetNotification, setNewAssetNotification] = useState(false);
  const [AssetNotification, setAssetNotification] = useState(false);
  const { isInCart, removeFromCart, addToCart } = useProduct();
  const [showAddStockModal, setShowAddStockModal] = useState(false);
  const [showEditStockModal, setShowEditStockModal] = useState(false);
  const [itemName, setItemName] = useState("");
  const [packaging, setPackaging] = useState("");
  const [stock, setStock] = useState(0);
  const [price, setPrice] = useState(0);
  const [editId, setEditId] = useState(null);

  const itemOptions = ["Karila Pandan Wangi Premium", "Karila Ramos"];
  const packagingOptions = ["3kg", "5kg", "10kg", "25kg", "50kg"];

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

  const handleAddStock = async () => {
    try {
      await addDoc(collection(db, "userPembelian"), {
        itemName,
        packaging,
        stock,
        price,
        userId: user.uid,
        timestamp: serverTimestamp(),
        status: "barang ready",
      });
      console.log("Stock added to userPembelian");
      setShowAddStockModal(false);
      setItemName("");
      setPackaging("");
      setStock(0);
      setPrice(0);
    } catch (error) {
      console.error("Error adding stock:", error);
    }
  };

  const handleEditStock = async () => {
    try {
      await updateDoc(doc(db, "userPembelian", editId), {
        itemName,
        packaging,
        stock,
        price,
        timestamp: serverTimestamp(),
      });
      console.log("Stock updated in userPembelian");
      setShowEditStockModal(false);
      setItemName("");
      setPackaging("");
      setStock(0);
      setPrice(0);
      setEditId(null);
    } catch (error) {
      console.error("Error updating stock:", error);
    }
  };

  const handleDeleteStock = async (id) => {
    try {
      await deleteDoc(doc(db, "userPembelian", id));
      console.log("Stock deleted from userPembelian");
    } catch (error) {
      console.error("Error deleting stock:", error);
    }
  };

  const openEditModal = (item) => {
    setEditId(item.id);
    setItemName(item.itemName);
    setPackaging(item.packaging);
    setStock(item.stock);
    setPrice(item.price);
    setShowEditStockModal(true);
  };

  return (
    <div>
      <NavbarGudang />
      <div className="p-8 md:p-24 mt-10">
        <div className="flex justify-between mb-10">
          <h2 className="text-3xl mb-3">Daftar Beras</h2>
          {AssetNotification && (
            <div className="notification-3xl mb-3">Happy Hunting</div>
          )}
          <button
            onClick={() => setShowAddStockModal(true)}
            className="btn btn-primary"
          >
            Tambah Stok
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Nama Beras</th>
                <th>Kemasan</th>
                <th>Stok</th>
                <th>Harga</th>
                <th>Tindakan</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.id}>
                  <td>{item.itemName}</td>
                  <td>{item.packaging}</td>
                  <td>{item.stock}</td>
                  <td>{item.price}</td>
                  <td>
                    <button
                      onClick={() => openEditModal(item)}
                      className="btn btn-secondary btn-sm"
                    >
                      Ubah
                    </button>
                    <button
                      onClick={() => handleDeleteStock(item.id)}
                      className="btn btn-danger btn-sm ml-2"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {showEditStockModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="bg-white p-6 rounded-md shadow-md w-1/2">
              <h3 className="font-bold text-lg">Edit Stock</h3>
              <div className="py-4">
                <label className="label">Item Name</label>
                <select
                  className="select select-bordered w-full"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                >
                  <option value="" disabled>
                    Select item
                  </option>
                  {itemOptions.map((item, index) => (
                    <option key={index} value={item}>
                      {item}
                    </option>
                  ))}
                </select>

                <label className="label">Packaging</label>
                <select
                  className="select select-bordered w-full"
                  value={packaging}
                  onChange={(e) => setPackaging(e.target.value)}
                >
                  <option value="" disabled>
                    Select packaging
                  </option>
                  {packagingOptions.map((pack, index) => (
                    <option key={index} value={pack}>
                      {pack}
                    </option>
                  ))}
                </select>

                <label className="label">Stock</label>
                <input
                  type="number"
                  className="input input-bordered w-full"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                />

                <label className="label">Price</label>
                <input
                  type="number"
                  className="input input-bordered w-full"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowEditStockModal(false)}
                  className="btn"
                >
                  Cancel
                </button>
                <button onClick={handleEditStock} className="btn btn-primary">
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
                {showAddStockModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="bg-white p-6 rounded-md shadow-md w-1/2">
              <h3 className="font-bold text-lg">Add Stock</h3>
              <div className="py-4">
                <label className="label">Item Name</label>
                <select
                  className="select select-bordered w-full"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                >
                  <option value="" disabled>
                    Select item
                  </option>
                  {itemOptions.map((item, index) => (
                    <option key={index} value={item}>
                      {item}
                    </option>
                  ))}
                </select>

                <label className="label">Packaging</label>
                <select
                  className="select select-bordered w-full"
                  value={packaging}
                  onChange={(e) => setPackaging(e.target.value)}
                >
                  <option value="" disabled>
                    Select packaging
                  </option>
                  {packagingOptions.map((pack, index) => (
                    <option key={index} value={pack}>
                      {pack}
                    </option>
                  ))}
                </select>

                <label className="label">Stock</label>
                <input
                  type="number"
                  className="input input-bordered w-full"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                />

                <label className="label">Price</label>
                <input
                  type="number"
                  className="input input-bordered w-full"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowAddStockModal(false)}
                  className="btn"
                >
                  Cancel
                </button>
                <button onClick={handleAddStock} className="btn btn-primary">
                  Add
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Product;



// "use client";
// import useAuth from "@/app/hooks/useAuth";
// import useProduct from "@/app/hooks/useProduct";
// import CardItem from "@/components/CardItem";
// import Footer from "@/components/Footer";
// import Navbar from "@/components/Navbar";
// import NavbarGudang from "@/components/NavbarGudang";
// import { db } from "@/firebase/firebase";
// import {
//   collection,
//   addDoc,
//   onSnapshot,
//   updateDoc,
//   deleteDoc,
//   doc,
//   serverTimestamp,
// } from "firebase/firestore";
// import { useRouter } from "next/navigation";
// import React, { useEffect, useState } from "react";

// const Product = () => {
//   const { user, userProfile } = useAuth();
//   const router = useRouter();
//   const [categoryFilter, setCategoryFilter] = useState("all");
//   const [searchInput, setSearchInput] = useState("");
//   const [data, setData] = useState([]);
//   const [newAssetNotification, setNewAssetNotification] = useState(false);
//   const [AssetNotification, setAssetNotification] = useState(false);
//   const { isInCart, removeFromCart, addToCart } = useProduct();
//   const [showAddStockModal, setShowAddStockModal] = useState(false);
//   const [showEditStockModal, setShowEditStockModal] = useState(false);
//   const [itemName, setItemName] = useState("");
//   const [packaging, setPackaging] = useState("");
//   const [stock, setStock] = useState(0); // State for stock

//   const itemOptions = ["Karila Pandan Wangi Premium", "Karila Ramos"];
//   const packagingOptions = ["3kg", "5kg", "10kg", "25kg", "50kg"];

//   useEffect(() => {
//     if (user && userProfile.role === "admin") {
//       router.push("/admin");
//     }

//     const unsubProduct = onSnapshot(collection(db, "userPembelian"), (snapshot) => {
//       const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
//       setData(list);
//     });

//     return () => unsubProduct();
//   }, [user, userProfile, router]);

//   const handleAddStock = async () => {
//     try {
//       await addDoc(collection(db, "userPembelian"), {
//         itemName,
//         packaging,
//         stock,
//         price,
//         userId: user.uid,
//         timestamp: serverTimestamp(),
//         status: "barang ready",
//       });
//       console.log("Stock added to userPembelian");
//       setShowAddStockModal(false);
//       setItemName("");
//       setPackaging("");
//       setStock(0);
//       setPrice(0);
//     } catch (error) {
//       console.error("Error adding stock:", error);
//     }
//   };

//   const handleEditStock = async () => {
//     try {
//       await updateDoc(doc(db, "userPembelian", editId), {
//         itemName,
//         packaging,
//         stock,
//         price,
//         timestamp: serverTimestamp(),
//       });
//       console.log("Stock updated in userPembelian");
//       setShowEditStockModal(false);
//       setItemName("");
//       setPackaging("");
//       setStock(0);
//       setPrice(0);
//       setEditId(null);
//     } catch (error) {
//       console.error("Error updating stock:", error);
//     }
//   };

//   const handleDeleteStock = async (id) => {
//     try {
//       await deleteDoc(doc(db, "userPembelian", id));
//       console.log("Stock deleted from userPembelian");
//     } catch (error) {
//       console.error("Error deleting stock:", error);
//     }
//   };

//   const openEditModal = (item) => {
//     setEditId(item.id);
//     setItemName(item.itemName);
//     setPackaging(item.packaging);
//     setStock(item.stock);
//     setPrice(item.price);
//     setShowEditStockModal(true);
//   };

//   return (
//     <div>
//       <NavbarGudang />
//       <div className="p-8 md:p-24 mt-10">
//         <div className="flex justify-between mb-10">
//           <h2 className="text-3xl mb-3">All Products</h2>
//           {AssetNotification && (
//             <div className="notification-3xl mb-3">Happy Hunting</div>
//           )}
//           <button
//             onClick={() => setShowAddStockModal(true)}
//             className="btn btn-primary"
//           >
//             Add Stock
//           </button>
//         </div>
//         <div className="overflow-x-auto">
//           <table className="table w-full">
//             <thead>
//               <tr>
//                 <th>Item Name</th>
//                 <th>Packaging</th>
//                 <th>Stock</th>
//                 <th>Price</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {data.map((item) => (
//                 <tr key={item.id}>
//                   <td>{item.itemName}</td>
//                   <td>{item.packaging}</td>
//                   <td>{item.stock}</td>
//                   <td>{item.price}</td>
//                   <td>
//                     <button
//                       onClick={() => openEditModal(item)}
//                       className="btn btn-secondary btn-sm"
//                     >
//                       Edit
//                     </button>
//                     <button
//                       onClick={() => handleDeleteStock(item.id)}
//                       className="btn btn-danger btn-sm ml-2"
//                     >
//                       Delete
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//         {showEditStockModal && (
//           <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
//             <div className="bg-white p-6 rounded-md shadow-md w-1/2">
//               <h3 className="font-bold text-lg">Edit Stock</h3>
//               <div className="py-4">
//                 <label className="label">Item Name</label>
//                 <select
//                   className="select select-bordered w-full"
//                   value={itemName}
//                   onChange={(e) => setItemName(e.target.value)}
//                 >
//                   <option value="" disabled>
//                     Select item
//                   </option>
//                   {itemOptions.map((item, index) => (
//                     <option key={index} value={item}>
//                       {item}
//                     </option>
//                   ))}
//                 </select>

//                 <label className="label">Packaging</label>
//                 <select
//                   className="select select-bordered w-full"
//                   value={packaging}
//                   onChange={(e) => setPackaging(e.target.value)}
//                 >
//                   <option value="" disabled>
//                     Select packaging
//                   </option>
//                   {packagingOptions.map((pack, index) => (
//                     <option key={index} value={pack}>
//                       {pack}
//                     </option>
//                   ))}
//                 </select>

//                 <label className="label">Stock</label>
//                 <input
//                   type="number"
//                   className="input input-bordered w-full"
//                   value={stock}
//                   onChange={(e) => setStock(e.target.value)}
//                 />

//                 <label className="label">Price</label>
//                 <input
//                   type="number"
//                   className="input input-bordered w-full"
//                   value={price}
//                   onChange={(e) => setPrice(e.target.value)}
//                 />
//               </div>
//               <div className="flex justify-end space-x-4">
//                 <button
//                   onClick={() => setShowEditStockModal(false)}
//                   className="btn"
//                 >
//                   Cancel
//                 </button>
//                 <button onClick={handleEditStock} className="btn btn-primary">
//                   Save
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//         {showAddStockModal && (
//           <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
//             <div className="bg-white p-6 rounded-md shadow-md w-1/2">
//               <h3 className="font-bold text-lg">Add Stock</h3>
//               <div className="py-4">
//                 <label className="label">Item Name</label>
//                 <select
//                   className="select select-bordered w-full"
//                   value={itemName}
//                   onChange={(e) => setItemName(e.target.value)}
//                 >
//                   <option value="" disabled>
//                     Select item
//                   </option>
//                   {itemOptions.map((item, index) => (
//                     <option key={index} value={item}>
//                       {item}
//                     </option>
//                   ))}
//                 </select>

//                 <label className="label">Packaging</label>
//                 <select
//                   className="select select-bordered w-full"
//                   value={packaging}
//                   onChange={(e) => setPackaging(e.target.value)}
//                 >
//                   <option value="" disabled>
//                     Select packaging
//                   </option>
//                   {packagingOptions.map((pack, index) => (
//                     <option key={index} value={pack}>
//                       {pack}
//                     </option>
//                   ))}
//                 </select>

//                 <label className="label">Stock</label>
//                 <input
//                   type="number"
//                   className="input input-bordered w-full"
//                   value={stock}
//                   onChange={(e) => setStock(e.target.value)}
//                 />

//                 <label className="label">Price</label>
//                 <input
//                   type="number"
//                   className="input input-bordered w-full"
//                   value={price}
//                   onChange={(e) => setPrice(e.target.value)}
//                 />
//               </div>
//               <div className="flex justify-end space-x-4">
//                 <button
//                   onClick={() => setShowAddStockModal(false)}
//                   className="btn"
//                 >
//                   Cancel
//                 </button>
//                 <button onClick={handleAddStock} className="btn btn-primary">
//                   Add
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//       <Footer />
//     </div>
//   );
// };

// export default Product;
