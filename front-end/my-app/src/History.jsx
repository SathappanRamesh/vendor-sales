import React, {useEffect, useState} from "react";
import styles from "./History.module.css";
import api from "./api/axios";
function History() {
    const [historyData, setHistoryData] = useState([]);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await api.get("https://vendor-sales.onrender.com/get-history");
                const data = await response.data;
                // Sort history by date and time, most recent first
                let sortedData = data?.userHistory?.history.sort((a, b) => {
                    const dateA = new Date(`${a.date} ${a.time}`);
                    const dateB = new Date(`${b.date} ${b.time}`);
                    return dateB - dateA;
                });
                setHistoryData(sortedData || []);                
            } catch (error) {
                console.error("Error fetching history:", error);
            }
        };

        const token = localStorage.getItem('token');
        if (!token) {
            console.log("No token found");
            return;
        }
        fetchHistory();
    }, []);

  return (
    <>
    {historyData.length < 1 ? (
      <>
       {/*--------------------------     Not Found       ----------------*/}
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
      <div className={styles.historyTableWrapper}>
  <table
    className={styles.historyTable}
    style={{ color: "black", height: "40vh" }}
    border="1"
    cellPadding="10"
    cellSpacing="0"
  >
    <thead style={{ backgroundColor: "#4f3434" }}>
      <tr>
        <th>Date</th>
        <th>Time</th>
        <th>Name</th>
        <th>Total Amount</th>
        <th>Bill URL</th>
      </tr>
    </thead>

    <tbody>
      {historyData.map((item) => (
        <tr align="center" key={item?.date+item?.time}>
          <td>{item.date}</td>
          <td>{item.time}</td>
          <td>{item.name?.toUpperCase()}</td>
          <td>₹{item.totalAmountBought}</td>
          <td>
            <a
              className={styles.downloadLink}
              href={item.billUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              View
              <svg
                width="18"
                height="18"
                fill="none"
                stroke="#3c61d3"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <path d="m7 10 5 5 5-5" />
                <path d="M12 15V3" />
              </svg>
            </a>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
      </>
    )}

    </>
  )
}

export default History;
