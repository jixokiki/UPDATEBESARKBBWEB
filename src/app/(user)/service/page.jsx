"use client";
import React, { useEffect, useState } from "react";
import { collection, onSnapshot, updateDoc, doc } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import useAuth from "@/app/hooks/useAuth";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import NavbarUser from "@/components/NavbarUser";

const Service = () => {
    const { user, userProfile } = useAuth();
    const [dataPembelian, setDataPembelian] = useState([]);
    const [dataRequestOrder, setDataRequestOrder] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [calculatedStocks, setCalculatedStocks] = useState({});

    useEffect(() => {
        if (user && userProfile.role === "admin") {
            router.push("/admin");
        }
    }, [user, userProfile]);

    useEffect(() => {
        const unsubPembelian = onSnapshot(
            collection(db, "userPembelian"),
            (snapshot) => {
                let list = [];
                snapshot.docs.forEach((doc) => {
                    list.push({ id: doc.id, ...doc.data() });
                });
                setDataPembelian(list);
                console.log("Data Pembelian updated:", list);
            },
            (error) => {
                console.log("Error fetching dataPembelian:", error);
            }
        );

        const unsubRequestOrder = onSnapshot(
            collection(db, "userProses"),
            (snapshot) => {
                let list = [];
                snapshot.docs.forEach((doc) => {
                    list.push({ id: doc.id, ...doc.data() });
                });
                setDataRequestOrder(list);
                console.log("Data Request Order updated:", list);
            },
            (error) => {
                console.log("Error fetching dataRequestOrder:", error);
            }
        );

        return () => {
            unsubPembelian();
            unsubRequestOrder();
        };
    }, []);

    const handleCheckboxChange = (itemId, type) => {
        const selectedIndex = selectedItems.findIndex((item) => item.id === itemId && item.type === type);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selectedItems, { id: itemId, type });
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selectedItems.slice(1));
        } else if (selectedIndex === selectedItems.length - 1) {
            newSelected = newSelected.concat(selectedItems.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(selectedItems.slice(0, selectedIndex), selectedItems.slice(selectedIndex + 1));
        }

        setSelectedItems(newSelected);
    };

    const calculateStocks = () => {
        console.log("Calculating stocks...");
        console.log("Current dataPembelian:", dataPembelian);
        console.log("Current dataRequestOrder:", dataRequestOrder);

        const newCalculatedStocks = {};

        dataRequestOrder.forEach(requestItem => {
            console.log("Processing request item:", requestItem);
            const matchingPembelian = dataPembelian.find(pembelianItem => pembelianItem.id === requestItem.id);
            if (matchingPembelian) {
                console.log("Matching pembelian found:", matchingPembelian);
                const requestStock = parseInt(requestItem.stock);
                const pembelianStock = parseInt(matchingPembelian.stock);
                const newStock = Math.max(0, requestStock - pembelianStock);
                console.log(`Calculation: ${requestStock} - ${pembelianStock} = ${newStock}`);
                newCalculatedStocks[requestItem.id] = newStock;
            } else {
                console.log("No matching pembelian found");
                newCalculatedStocks[requestItem.id] = parseInt(requestItem.stock);
            }
        });

        console.log("New calculated stocks:", newCalculatedStocks);
        setCalculatedStocks(newCalculatedStocks);
    };

    const handleUpdateStocks = async () => {
        console.log("Updating stocks in Firestore...");
        const updates = [];

        Object.entries(calculatedStocks).forEach(([id, newStock]) => {
            console.log(`Updating document ${id} with new stock: ${newStock}`);
            updates.push(updateDoc(doc(db, "userRequestOrder", id), { stock: newStock }));
        });

        try {
            await Promise.all(updates);
            console.log("Stocks updated successfully!");
            alert("Stocks updated successfully!");
        } catch (error) {
            console.error("Error updating stocks:", error);
            alert("Error updating stocks. Please try again.");
        }
    };

    return (
        <div className="w-[100%] mx-auto mt-32">
            <NavbarUser />
            <div className="w-[90%] mx-auto mt-10">
                <h2 className="text-2xl font-semibold mb-4">Data userPembelian</h2>
                <table className="table-auto w-full">
                    <thead>
                        <tr>
                            <th>Select</th>
                            <th>ID</th>
                            <th>Current Stock</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dataPembelian.map((item) => (
                            <tr key={item.id}>
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={selectedItems.findIndex((selectedItem) => selectedItem.id === item.id && selectedItem.type === "pembelian") !== -1}
                                        onChange={() => handleCheckboxChange(item.id, "pembelian")}
                                    />
                                </td>
                                <td>{item.id}</td>
                                <td>{item.stock}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="w-[90%] mx-auto mt-10">
                <h2 className="text-2xl font-semibold mb-4">Data userRequestOrder</h2>
                <table className="table-auto w-full">
                    <thead>
                        <tr>
                            <th>Select</th>
                            <th>ID</th>
                            <th>Current Stock</th>
                            <th>Calculated Stock</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dataRequestOrder.map((item) => (
                            <tr key={item.id}>
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={selectedItems.findIndex((selectedItem) => selectedItem.id === item.id && selectedItem.type === "requestOrder") !== -1}
                                        onChange={() => handleCheckboxChange(item.id, "requestOrder")}
                                    />
                                </td>
                                <td>{item.id}</td>
                                <td>{item.stockProses}</td>
                                <td>{calculatedStocks[item.id] !== undefined ? calculatedStocks[item.id] : '-'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="w-[90%] mx-auto mt-10">
                <button 
                    onClick={calculateStocks}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-4"
                >
                    Calculate Stocks
                </button>
                <button 
                    onClick={handleUpdateStocks}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Update Stocks in Firestore
                </button>
            </div>

            <Footer />
        </div>
    );
};

export default Service;