import React, {useState, useEffect} from "react";
import styles from "./MyItems.module.css";
import api from "./api/axios";
  import { ToastContainer, toast } from 'react-toastify';

function MyItems() {
    const [myItems, setMyItems] = useState([]);
    const [currentItem, setCurrentItem] = useState("");
    const  [duplicateItems, setDuplicateItems] = useState([]);
    const [error, setError] = useState(false);

    useEffect(() => {
        // Fetch my items from the server and setMyItems
            const fetchMyItems = async () => {
        try {
          const response = await api.get("https://vendor-sales.onrender.com/get-my-items", {
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            }
          });
          console.log(response.data);
          
          setMyItems(response.data.myItems);
        } catch (error) {
          console.log("Error getting my items:", error); 
        }   
        };
        const token = localStorage.getItem('token')
        if(!token) {
          console.log("No token found");
          return;
        }   
        fetchMyItems();
    }, []);

const handleStoreItems = async () => {
  if (!currentItem.trim()) return;

  const inputItems = currentItem
    .split(",")
    .map(item => item.trim())
    .filter(Boolean)
    .map(item => item.toLowerCase());

  const existingItems = myItems.map(item => item.toLowerCase());

  const newItems = inputItems.filter(
    item => !existingItems.includes(item)
  );

  const duplicateItems = inputItems.filter(
    item => existingItems.includes(item)
  );

  if (newItems.length === 0) {
    setError(true); // all duplicates
    setDuplicateItems(duplicateItems);
    return;
  }

  try {
    await api.post("https://vendor-sales.onrender.com/store-items",);
    // Update myItems with the new items
    setMyItems(prevItems => [...prevItems, ...newItems]);
    if (duplicateItems.length > 0) {
        setError(true);
      console.warn("Skipped duplicates:", duplicateItems);
      setDuplicateItems(duplicateItems);
    }
    setCurrentItem("");
          toast.info("Items stored successfully!");
    
  } catch (error) {
    console.error("Error storing items:", error);
  }
};


  return (
    <>
<ToastContainer/>
<div className={styles.MyItemsContainer}>
  <h4 style={{color: "black"}} htmlFor="my-items-search">Store My Items:</h4>

  <input
    id="my-items-search"
    value={currentItem}
    onChange={(e) => setCurrentItem(e.target.value)}
    type="text"
    placeholder="Use ',' seperated items to store multiple items. eg: apple,banana,orange "
  />

  {error && (
    <span className={styles.itemsError}>
      {duplicateItems.join(", ")} already exists in the Items!
    </span>
  )}

  <button
    className={styles.storeBtn}
    onClick={handleStoreItems}
  >
    Store
<svg width={18} height={18} fill="none" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"> <path d="M12 2a9 3 0 1 0 0 6 9 3 0 1 0 0-6z" /> <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" /> <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" /> </svg>
  </button>

  <div className={styles.tableWrapper}>
    <table className={styles.myItemsTable}>
      <thead className={styles.myItemsthead}>
        <tr className={styles.myItemstr}>
          <th className={styles.myItemsth}>Stored Items</th>
        </tr>
      </thead>
      <tbody>
        {myItems.map((item, index) => (
          <tr className={styles.storedItems} key={index}>
            <td>{item.toUpperCase()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

    </>
  )
}

export default MyItems;
