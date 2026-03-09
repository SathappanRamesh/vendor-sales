import React, { useState, useEffect, useContext, useMemo } from "react";
import styles from "./Customers.module.css";
import { UserDataContext } from "./UserDataContext.jsx";
import { useSearchParams } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';

function Customers() {
  const userData = useContext(UserDataContext);
const [searchParams, setSearchParams] = useSearchParams();
  const [topBuyers, setTopBuyers] = useState({first: null, second: null, third: null});
  const [customersData, setCustomersData] = useState([]);
  const sortBy = searchParams.get("sortBy");

    // Load original data  
  useEffect(() => {
    if (userData?.data?.customers) {
      setCustomersData(userData.data.customers);
    } else {
      toast.error("Something went wrong while loading customers data.");
    }
    console.log(userData);
    console.log('cust data', customersData);
    
    
  }, [userData]);

  // Calculate top buyers whenever customersData changes
  useEffect(() => {
      const data = [...customersData];      
      const sortedByAmount = data.sort(
        (a, b) => b.totalAmountBought - a.totalAmountBought
      );
      setTopBuyers({
        first: sortedByAmount[0] || null,
        second: sortedByAmount[1] || null,
        third: sortedByAmount[2] || null,
      });
  },[customersData])
  /* sorted data*/
  const sortedCustomers = useMemo(() => {
    if (!sortBy) return customersData;

    const data = [...customersData];

    switch (sortBy) {
      case "most-buy":
        return data.sort(
          (a, b) => b.totalAmountBought - a.totalAmountBought
        );

      case "name-asc":
        return data.sort((a, b) =>
          a.name.localeCompare(b.name)
        );

      case "name-desc":
        return data.sort((a, b) =>
          b.name.localeCompare(a.name)
        );

      default:
        return customersData;
    }
  }, [customersData, sortBy]);



  /* Dropdown only updates URL */
  const handleChange = (e) => {
    const value = e.target.value;
    if (!value) {
      setSearchParams({});
    } else {
      setSearchParams({ sortBy: value });
    }
  };

  return (
    <>
    {sortedCustomers.length < 1 ? (
      <>
         <div className={styles.mainWrapper}>
              <div className={styles.main}>
                <div className={styles.antenna}>
                  <div className={styles.antennaShadow}></div>
                  <div className={styles.a1}></div>
                  <div className={styles.a1d}></div>
                  <div className={styles.a2}></div>
                  <div className={styles.a2d}></div>
                  <div className={styles.aBase}></div>
                </div>
            
                <div className={styles.tv}>
                  <div className={styles.cruve}>
                    <svg
                      className={styles.curveSvg}
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                      xmlnsXlink="http://www.w3.org/1999/xlink"
                      viewBox="0 0 189.929 189.929"
                      xmlSpace="preserve"
                    >
                      <path d="M70.343,70.343c-30.554,30.553-44.806,72.7-39.102,115.635l-29.738,3.951C-5.442,137.659,11.917,86.34,49.129,49.13
                      C86.34,11.918,137.664-5.445,189.928,1.502l-3.95,29.738C143.041,25.54,100.895,39.789,70.343,70.343z"></path>
                    </svg>
                  </div>
            
                  <div className={styles.displayDiv}>
                    <div className={styles.screenOut}>
                      <div className={styles.screenOut1}>
                        <div className={styles.screen}>
                          <span className={styles.notfoundText}>NO_DATA_EXIST</span>
                        </div>
                      </div>
                    </div>
                  </div>
            
                  <div className={styles.lines}>
                    <div className={styles.line1}></div>
                    <div className={styles.line2}></div>
                    <div className={styles.line3}></div>
                  </div>
            
                  <div className={styles.buttonsDiv}>
                    <div className={styles.b1}>
                      <div></div>
                    </div>
                    <div className={styles.b2}></div>
            
                    <div className={styles.speakers}>
                      <div className={styles.g1}>
                        <div className={styles.g11}></div>
                        <div className={styles.g12}></div>
                        <div className={styles.g13}></div>
                      </div>
                      <div className={styles.g}></div>
                      <div className={styles.g}></div>
                    </div>
                  </div>
                </div>
            
                <div className={styles.bottom}>
                  <div className={styles.base1}></div>
                  <div className={styles.base2}></div>
                  <div className={styles.base3}></div>
                </div>
              </div>
            
              <div className={styles.text404}>
                <div className={styles.text4041}>4</div>
                <div className={styles.text4042}>0</div>
                <div className={styles.text4043}>4</div>
              </div>
            </div>
      </>
    ): (
      <>
       <ToastContainer/>
    <div className={styles.parent}>
      <div className={styles.tableContainer} style={{ padding: "20px" }}>
        <span className={styles.tableHeaderContainer}>
          <h2 style={{ color: "#4f3434" }}>Customers Info <svg width={30} height={30} fill="none" stroke="#5400f0" strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="M12 2a10 10 0 1 0 0 20 10 10 0 1 0 0-20z" />
  <path d="M12 16v-4" />
  <path d="M12 8h.01" />
</svg></h2>

          <div className={styles.selectWrapper}>
            <label htmlFor="options">Sort By:</label>

            <select
              id="options"
              value={sortBy || ""}
              onChange={handleChange}
            >
              <option value="">-- Select --</option>
              <option value="most-buy">Most Buy</option>
              <option value="name-asc">A–Z</option>
              <option value="name-desc">Z–A</option>
            </select>
          </div>
        </span>

        <table
          style={{ color: "black", height: "40vh"}}
          border="1"
          cellPadding="10"
          cellSpacing="0"
          width="100%"
        >
          <thead style={{ backgroundColor: "#4f3434" }}>
            <tr align="center" className={styles.customerTableTr}>
              <th className={styles.customerTableTh}>No.</th>
              <th className={styles.customerTableTh}>Name</th>
              <th className={styles.customerTableTh}>Ph No</th>
              <th className={styles.customerTableTh}>Total Arrivals</th>
              <th className={styles.customerTableTh}>Have Bought</th>
            </tr>
          </thead>

          <tbody>
            {sortedCustomers.map((item, index) => (
              <tr align="center" key={item.id}>
                <td className={styles.customerTableTd}>{index + 1}.</td>
                <td className={styles.customerTableTd}>{item?.name}</td>
                <td className={styles.customerTableTd}>{item?.phoneNo}</td>
                <td className={styles.customerTableTd}>{item?.totalArrivals}</td>
                <td className={styles.customerTableTd}>₹{item?.totalAmountBought}</td>
              </tr>
            ))}
            {sortedCustomers.length < 1 && (
              <tr>
      <td colSpan="5" align="center" className={styles.noDataCell}><b>No Data Exist</b></td>
              </tr>
            )}
          </tbody>
        </table>
        
      </div>

      {/* Top Customers Section */}
      <div className={styles.topCustomersContainer}>
        <h1>Top Buyers</h1>
        <div className={styles.no1}>
          🥇 {topBuyers.first?.name} - ₹{topBuyers.first?.totalAmountBought || 0}
        </div>
        <div className={styles.no2}>
          🥈 {topBuyers.second?.name} - ₹{topBuyers.second?.totalAmountBought || 0}
        </div>
        <div className={styles.no3}>
          🥉 {topBuyers.third?.name} - ₹{topBuyers.third?.totalAmountBought || 0}
        </div>
      </div>
    </div>
      </>
    )}
        </>

  );
}

export default Customers;
