import React, {useContext, useState} from "react";
import { UserDataContext } from './UserDataContext.jsx';
import styles from "./Sales.module.css";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import { Line, Bar,} from "react-chartjs-2";
import { useEffect } from "react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
  Title
);

function Sales() {
  const [isNoData, setIsNoData] = useState(false);
      const userData = useContext(UserDataContext);
      const [isLoader, setIsLoader] = useState(false);
    const [selectedTime, setSelectedTime] = useState({
      from: "",
      to: "",
      fromPeriod: "",
      toPeriod: ""
    });
    
  // ---------- ----------------- Yearly Bar Chart Data ------------------------------
  const [yearlyBarChartData, setYearlyBarChartData] = useState({
  labels: [],
  datasets: [{
    label: 'My First Dataset',
    data: [],
    backgroundColor: [
            'rgb(255, 159, 64)',
    ],
    borderColor: [
      'rgb(255, 99, 132)',
      'rgb(255, 159, 64)',
      'rgb(255, 205, 86)',
      'rgb(75, 192, 192)',
      'rgb(54, 162, 235)',
      'rgb(153, 102, 255)',
      'rgb(201, 203, 207)'
    ],
    borderWidth: 1,
          barThickness: 35,
      maxBarThickness: 40, 
  }]
  });
  // --------------------------- Monthly Bar Chart Data ------------------------------

    const [monthlyBarChartData, setMonthlyBarChartData] = useState({
  labels: [],
  datasets: [{
    label: 'My First Dataset',
    data: [],
    backgroundColor: [
                  'rgb(255, 159, 64)',
    ],
    borderColor: [
      'rgb(255, 99, 132)',
      'rgb(255, 159, 64)',
      'rgb(255, 205, 86)',
      'rgb(75, 192, 192)',
      'rgb(54, 162, 235)',
      'rgb(153, 102, 255)',
      'rgb(201, 203, 207)'
    ],
    borderWidth: 1,
          barThickness: 35,
      maxBarThickness: 40,  
  }]
  });

  // --------------------------- Daily Bar Chart Data ------------------------------
      const [dailyBarChartData, setDailyBarChartData] = useState({
  labels: [],
  datasets: [{
    label: 'Daily Sales',
    data: [],
    backgroundColor: [
      'rgba(255, 99, 132, 0.2)',
      'rgba(255, 159, 64, 0.2)',
      'rgba(255, 205, 86, 0.2)',
      'rgba(75, 192, 192, 0.2)',
      'rgba(54, 162, 235, 0.2)',
      'rgba(153, 102, 255, 0.2)',
      'rgba(201, 203, 207, 0.2)'
    ],
    borderColor: [
      'rgb(255, 99, 132)',
      'rgb(255, 159, 64)',
      'rgb(255, 205, 86)',
      'rgb(75, 192, 192)',
      'rgb(54, 162, 235)',
      'rgb(153, 102, 255)',
      'rgb(201, 203, 207)'
    ],
    borderWidth: 1,
          barThickness: 45,
      maxBarThickness: 40,  
  }]
  });
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      grid: {
        offset: true,
      }
    }
  }
};

useEffect(() => {
  if(userData?.data?.salesStatistics)  {
    setIsNoData(true);
  }
  console.log(isNoData);
  
},[userData?.data?.salesStatistics, isNoData])

useEffect(() => {
  const yearlySales = userData?.data?.salesStatistics?.calenderSales;
  if (!yearlySales) return;

  const labels = Object.keys(yearlySales);
  const data = Object.values(yearlySales).map((y) => y?.thisYearTotalAmount || 0);

  setYearlyBarChartData({
    labels,
    datasets: [{
      label: 'Yearly Sales',
      data,
      backgroundColor: 'rgb(255, 205, 86)',
      borderColor: 'rgb(75, 192, 192)',
      borderWidth: 1
    }]
  });

  const year = new Date().getFullYear();
  const monthlySales = yearlySales[year];
  if (!monthlySales) return;

  const monthlyLabels = [];
  const monthlyData = [];
  console.log(monthlySales);
  
  for (const month in monthlySales) {
    if (month === "thisYearTotalAmount") continue;
    monthlyLabels.push(month);
    console.log(monthlySales[month]);
    
    monthlyData.push(monthlySales[month]?.thisMonthTotalAmount || 0);
  }

  setMonthlyBarChartData({
    labels: monthlyLabels,
    datasets: [{
      label: 'Monthly Sales',
      data: monthlyData,
      backgroundColor: 'rgb(153, 102, 255)',
      borderColor: 'rgb(75, 192, 192)',
      borderWidth: 1
    }]
  });

  const month = new Date().toLocaleString('en-IN', { month: 'long' });
  const dailySales = monthlySales[month];
  if (!dailySales) return;

  const dailyLabels = [];
  const dailyData = [];
  for (const date in dailySales) {
    if (date === "thisMonthTotalAmount") continue;
    dailyLabels.push("Day:" +date);
    dailyData.push(dailySales[date] || 0);
  }

  setDailyBarChartData({
    labels: dailyLabels,
    datasets: [{
      label: 'Daily Sales',
      data: dailyData,
      backgroundColor: [
        'rgb(255, 99, 132)',
        'rgb(255, 159, 64)',
        'rgb(255, 205, 86)',
        'rgb(75, 192, 192)',
        'rgb(54, 162, 235)',
        'rgb(153, 102, 255)',
        'rgb(201, 203, 207)'
      ],
      borderColor: 'rgb(75, 192, 192)',
      borderWidth: 1
    }]
  });
}, [userData?.data?.salesStatistics?.calenderSales]);


  // ---------- Line Chart Data ----------  
  const [salesTimingsChartData, setSalesTimingsChartData] = useState({
  labels: [],
  datasets: [
    {
      label: "Number of Customers",
      data: [],
      backgroundColor: [
        "rgba(0, 150, 136, 0.7)",
        "rgba(233, 30, 99, 0.7)",
        "rgba(103, 58, 183, 0.7)",
        "rgba(3, 169, 244, 0.7)",
                'rgb(255, 205, 86)',

      ],
    },
  ],
});

useEffect(() => {
  const hours = userData?.data?.salesStatistics?.salesTimings;
  if (!hours) return;
console.log(hours);

  function timeToNumber(time) {
  const [hourStr, period] = time.split("-");
  let hour = Number(hourStr);

  if (period === "am") {
    if (hour === 12) hour = 0; // 12-am → 00
  } else {
    if (hour !== 12) hour += 12;// pm conversion
  }

  return hour;
}

function sortByTime(input) {
  return Object.entries(input)
    .sort(([timeA], [timeB]) => timeToNumber(timeA) - timeToNumber(timeB))
    .reduce((acc, [time, value]) => {
      acc[time] = value;
      return acc;
    }, {});
}
let sortedHours = sortByTime(hours);

  setSalesTimingsChartData({
    labels: Object.keys(sortedHours),
    datasets: [{
      label: "Number of Customers",
      data: Object.values(sortedHours),
      backgroundColor: 'rgb(255, 16, 16)',
      borderColor: 'rgb(255, 16, 16)',
      borderWidth: 1
    }]
  });
}, [userData?.data?.salesStatistics?.salesTimings]);


 useEffect(() => {
    if(!selectedTime.from || !selectedTime.to || !selectedTime.fromPeriod || !selectedTime.toPeriod) {
      return;
    }
    setIsLoader(true);
    console.log("load start");
    
  // ---------- helpers ----------
  function mergeSort(arr) {
    if (arr.length <= 1) return arr;

    const mid = Math.floor(arr.length / 2);
    const left = mergeSort(arr.slice(0, mid));
    const right = mergeSort(arr.slice(mid));

    return merge(left, right);
  }

  function merge(left, right) {
    let result = [];
    let i = 0, j = 0;

    while (i < left.length && j < right.length) {
      if (parseInt(left[i][0]) <= parseInt(right[j][0])) {
        result.push(left[i]);
        i++;
      } else {
        result.push(right[j]);
        j++;
      }
    }

    return result.concat(left.slice(i)).concat(right.slice(j));
  }

  function toMinutes(hour, period) {
    hour = parseInt(hour, 10);

    if (period === 'am') {
      if (hour === 12) hour = 0;
    } else {
      if (hour !== 12) hour += 12;
    }
    return hour * 60;
  }

  // ---------- main ----------
  async function getStatisticsData() {
          let labels = [];
      let data = [];
    const salesStatistics = userData.data.salesStatistics.salesTimings;

    let timeAndData = [];
    for (const time in salesStatistics) {
      const [hour, period] = time.split("-");
      timeAndData.push([hour, period, salesStatistics[time]]);
    }

    const sortedTimeStatistics = mergeSort(timeAndData);
    console.log(sortedTimeStatistics);
    
    const {
      from,
      fromPeriod,
      to,
      toPeriod
    } = selectedTime;

    const fromMinutes = toMinutes(from, fromPeriod);
    const toMinutesValue = toMinutes(to, toPeriod);

    sortedTimeStatistics.forEach((currArr) => {
      const currHour = currArr[0];
      const currPeriod = currArr[1];
      const currCustomers = currArr[2];

      const currMinutes = toMinutes(currHour, currPeriod);
      if (currMinutes >= fromMinutes && currMinutes <= toMinutesValue) {
        console.log('IN RANGE', currArr, 'customers:', currCustomers);
        labels.push(currHour + currPeriod);
        data.push(currCustomers);
      }

    });
    
     setSalesTimingsChartData({
    labels,
    datasets: [
      {
        label: "Number of Customers",
        data,
        backgroundColor: 'rgb(255, 16, 16)',
        borderColor: 'rgb(255, 16, 16)',
      },
    ],
  });
  }

  getStatisticsData();
  setIsLoader(false);
      console.log("load end");

}, [selectedTime]);
    
const salesStats = userData?.data?.salesStatistics;

return (
  <>
    {salesStats ? (
      <>
        {isLoader && (
          <div className={styles.loaderWrapper}>
            <div className={styles.threeBody}>
              <div className={styles.threeBodyDot}></div>
              <div className={styles.threeBodyDot}></div>
              <div className={styles.threeBodyDot}></div>
            </div>
          </div>
        )}

        <div className={styles.peakTimeParentContainer}>
          <div className={styles.salesTimingsChartContainer}>
            <h2 className={styles.h2Time} style={{color: "black"}}>Customer Sales Timings</h2>

            <label>From:</label>

            <select
              value={selectedTime.from}
              onChange={(e) =>
                setSelectedTime((prev) => ({ ...prev, from: e.target.value }))
              }
              className={styles.timeDropdown}
            >
              <option value="">Select</option>
              {[...Array(12)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>

            <select
              value={selectedTime.fromPeriod}
              onChange={(e) =>
                setSelectedTime((prev) => ({
                  ...prev,
                  fromPeriod: e.target.value,
                }))
              }
              className={styles.timeDropdown}
            >
              <option value="">Select</option>
              <option value="am">AM</option>
              <option value="pm">PM</option>
            </select>

            <label>To:</label>

            <select
              value={selectedTime.to}
              onChange={(e) =>
                setSelectedTime((prev) => ({ ...prev, to: e.target.value }))
              }
              className={styles.timeDropdown}
            >
              <option value="">Select</option>
              {[...Array(12)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
{(salesTimingsChartData?.labels?.length < 2 && 1 < salesTimingsChartData?.labels?.length) && (
  <span style={{backgroundColor: "yellow"}}>Send few more bills to see proper visuals</span>
)}
            <select
              value={selectedTime.toPeriod}
              onChange={(e) =>
                setSelectedTime((prev) => ({
                  ...prev,
                  toPeriod: e.target.value,
                }))
              }
              className={styles.timeDropdown}
            >
              <option value="">Select</option>
              <option value="am">AM</option>
              <option value="pm">PM</option>
            </select>
{(salesTimingsChartData.labels.length < 2 && 0 < salesTimingsChartData.labels.length) && (
  <span><svg width={16} height={16} fill="none" stroke="green" strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="M12 2a10 10 0 1 0 0 20 10 10 0 1 0 0-20z" />
  <path d="M12 16v-4" />
  <path d="M12 8h.01" />
</svg> Send few more bills to see proper analytics</span>
)}
            <div className={styles.chartWrapper}>
              {salesTimingsChartData.labels.length > 0 ? (
                <Line
                  data={salesTimingsChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                  }}
                />
              ) : selectedTime.from === "" ||
                selectedTime.to === "" ||
                selectedTime.fromPeriod === "" ||
                selectedTime.toPeriod === "" ? (
                <p>Please select time range to view chart.</p>
              ) : (
                <p>There is no data to display.</p>
              )}
            </div>
          </div>
        </div>

        {/* ---------------- Daily Sales Chart ---------------- */}
                      <h2 style={{color: "black"}}>Daily Sales Chart</h2>

        <div className={styles.dailySalesContainer}>

          <Bar data={dailyBarChartData} options={chartOptions} />
        </div>

        {/* ---------------- Yearly & Monthly Charts ---------------- */}

        <div className={styles.yearlyAndMonthlyContainer}>
          <div className={styles.chartBox}>
                        <h2 style={{color: "black"}}>Annual Sales Chart</h2>

            <Bar data={yearlyBarChartData} options={chartOptions} />
          </div>

          <div className={styles.chartBox}>
                        <h2 style={{color: "black"}}>Monthly Sales Chart</h2>

            <Bar data={monthlyBarChartData} options={chartOptions} />
          </div>
        </div>
      </>
    ) : (
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
    )}
  </>
);
}

export default Sales;
