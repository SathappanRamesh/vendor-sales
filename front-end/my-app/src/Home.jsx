import React, {useEffect, useState, useRef, useContext} from "react";
import { useLocation,Link } from 'react-router-dom';
import { nanoid } from 'nanoid';
import styles from './Home.module.css';
import { UserDataContext } from './UserDataContext.jsx';
import api from "./api/axios";
  import { ToastContainer, toast } from 'react-toastify';
  import 'bootstrap/dist/css/bootstrap.min.css';
  import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function Home() {
  const [calcValue, setCalcValue] = useState("");
  const [isLoader, setIsLoader] = useState(false);
  const [calcError, setCalcError] = useState("");
  const [groupedValue, setGroupedValue] = useState([]);
  const [result, setResult] = useState(null);
  const [redLight, setRedLight] = useState({});
  const [searchNumber, setSearchNumber] = useState([]);
  const [searchName, setSearchName] = useState([]);
  const [items, setItems] = useState([]);
  const [storedItems, setStoredItems] = useState([]);
  const inputRefs = useRef({});
  const [customerData, setCustomerData] = useState({
    name: '',
    phoneNo: '',
  })
  const [selectedItemsIndex, setSelectedItemsIndex] = useState()
  const [customersNameAndPhNo, setCustomersNameAndPhNo] = useState({name: [], phNo: []});
  const userData = useContext(UserDataContext);
  const [selectedNameAndPhNo, setSelectedNameAndPhNo] = useState({
    name: "", phNo: "", isSelected: false
  });
  const [isGuideShow, setIsGuideShow] = useState(   )
const calcInputRef = useRef(null);
  const location = useLocation();
  console.log(userData);
  
  useEffect(() => {
setIsGuideShow(localStorage.getItem("showGuide") === "true" ? true : false);
  },[])

  const  handleCloseGuide = (e) => {
                    e.preventDefault();
        try {
      api.post('http://localhost:3000/close-guide', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          }
      });
    setIsGuideShow(false);
    localStorage.setItem("showGuide", Boolean(false))
      toast.info("closed");
    } catch (error) {
      console.log(error);
      toast.error("Error sending bill to customer");
    }
  }
useEffect(() => {    
  // Set customer data when selected from search
  if(customerData.name.length > 0) {
    
  userData.data.customers.forEach((customer) => {
    if (customer.name.toLowerCase() === selectedNameAndPhNo.name.toLowerCase()) {
      setCustomerData({
        name: customer.name,
        phoneNo: customer.phoneNo
      });
    }
  });
  // Set customer data when selected from search
} else if (customerData.phoneNo.length > 0) {
    userData.data.customers.forEach((customer) => {

    if (customer.phoneNo === selectedNameAndPhNo.phNo) {      
      setCustomerData({
        name: customer.name,
        phoneNo: customer.phoneNo
      });
    }
    });
}
},[selectedNameAndPhNo]);
  // Set customer name and phone no
  useEffect(() => {
    let customersData = {name: [], phNo: []};    
    for (let i = 0; i < userData?.data?.customers?.length || 0; i++) {
      customersData.name.push(userData.data.customers[i].name);      
      customersData.phNo.push(userData.data.customers[i].phoneNo);
    }
    setCustomersNameAndPhNo(customersData);
    let items = userData?.data?.myItems || [];        
    setItems(items);
  },[userData]);


  useEffect(() => {
    // Search phone numbers
    if (customerData?.phoneNo?.length > 0) {
    let phoneNoArr = customersNameAndPhNo.phNo;
    let input = customerData.phoneNo;
    let arr = [];
        for (let i = 0; i < phoneNoArr.length; i++) {
          let currPhNo = phoneNoArr[i];
          let currValue = currPhNo.slice(0,input.length);
          if(input === currValue) {
            arr.push(currPhNo)
          }
        }
        setSearchNumber(arr);
      }
          // Search names 
        if (customerData?.name?.length > 0) {
              let nameArr = customersNameAndPhNo.name;
    let input = customerData.name.toLowerCase();
    let arr = [];
        for (let i = 0; i < nameArr.length; i++) {
          let currName = nameArr[i].toLowerCase(); 
          let currValue = currName.slice(0,input.length);
          if(input === currValue) {
            arr.push(currName)
          }
        }
        setSearchName(arr);
        }
  },[customerData, customersNameAndPhNo]);

  useEffect(() => {
    if (!calcValue) {
      setGroupedValue([]);
      setResult(null);
      return;
    }

const extractGroups = (expression) => {
  const cleanExpr = expression.replace(/\s+/g, "");
  const tokens = cleanExpr.split(/([+\-])/).filter(Boolean);
  const groups = [];

  for (let i = 0, id = 1; i < tokens.length; i++) {
    const token = tokens[i];
    if (token === "+" || token === "-") continue;
    const next = tokens[i + 1];
    if(token === "+" && next === "+") {
      alert("Invalid Expression");      
      tokens.pop();
    }
    let isMultiply;
    
    if (tokens[i].includes("*") && next === "+" ) {
      let splitMultiply = tokens[i].split("*");
      isMultiply = ( (/\d/.test(splitMultiply[0])) && (/\d/.test(splitMultiply[1]))) ? true : false;
    }
    
    const isComplete =
      ((/\d/.test(token)) && (next || next === "+" || next === "-")) || isMultiply;
      
    // if user typed plain number without operator yet treat as incomplete
    const expr = token.includes("*") || token.includes("/") ? token : `${token}*1`;

    groups.push({ id: id++, expr, confirmed: isComplete });
  }

  return groups;
};


    const evaluateExpression = (expr) => {
      if(expr.endsWith("*") || expr.endsWith("+")) expr = expr.slice(0, -1);
      if (!expr || !expr.trim()) return null;
      const tokens = expr.trim().match(/\d+(\.\d+)?|[+\-*/()]/g);
      if (!tokens) return null;

      const outputQueue = [];
      const operatorStack = [];
      const precedence = { "+": 1, "-": 1, "*": 2, "/": 2 };
      const isOperator = (t) => ["+", "-", "*", "/"].includes(t);

      for (const token of tokens) {
        if (!isNaN(token)) {
          outputQueue.push(parseFloat(token));
        } else if (isOperator(token)) {
          while (
            operatorStack.length &&
            isOperator(operatorStack.at(-1)) &&
            precedence[operatorStack.at(-1)] >= precedence[token]
          ) {
            outputQueue.push(operatorStack.pop());
          }
          operatorStack.push(token);
        } else if (token === "(") operatorStack.push(token);
        else if (token === ")") {
          while (operatorStack.at(-1) !== "(")
            outputQueue.push(operatorStack.pop());
          operatorStack.pop();
        }
      }

      while (operatorStack.length) outputQueue.push(operatorStack.pop());
      const evalStack = [];

      for (const token of outputQueue) {
        if (!isNaN(token)) evalStack.push(token);
        else {
          const b = evalStack.pop();
          const a = evalStack.pop();
          switch (token) {
            case "+": evalStack.push(a + b); break;
            case "-": evalStack.push(a - b); break;
            case "*": evalStack.push(a * b); break;
            case "/": evalStack.push(a / b); break;
          }
        }
      }      
      return evalStack[0];
    };

    const extracted = extractGroups(calcValue);

setGroupedValue((prev) => {
  return extracted.map((g, idx) => {
    const prevItem = prev[idx];

    let amount = 0;
    try {
      amount = Function(`"use strict"; return (${g.expr})`)();
      if (isNaN(amount)) amount = 0;
    } catch {
      amount = 0;
    }
    let split = g.expr.split("*");
    return {
      id: idx + 1,
      expr: g.expr,
      quantity: split[1] || 1,
      price: split[0] ,
      confirmed: g.confirmed,
      name: prevItem?.name ?? "",
      amount,
    };
  });
});

    const r = evaluateExpression(calcValue);
    setResult(r);
  }, [calcValue]);

  const handleNameChange = (id, value) => {
    setGroupedValue((prev) =>
      prev.map((g) => (g.id === id ? { ...g, name: value } : g))
    );
    // Base Condition
    if(storedItems.length > 0) setStoredItems([]);
    if(value.trim() === "") return;
    // Check for matching items in stored items
    for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
      let currItem = items[itemIndex];
      if (currItem.slice(0, value.length) == value) {
        setStoredItems(prev => [...prev, currItem]);
      }

    }
  };

  // When a group becomes confirmed and has no name
  useEffect(() => {
    const latestConfirmed = groupedValue.find(
      (g) => g.confirmed && !g.name?.trim()
    );
    if (latestConfirmed) {
      const ref = inputRefs.current[latestConfirmed.id];
      if (ref && document.activeElement !== ref) {
        ref.focus();
      }
    }
  }, [groupedValue]);

  useEffect(() => {
    checkItemNameExist(calcValue);
  },[calcValue]);

  const checkItemNameExist = (currValue) => {
    const latestConfirmed = groupedValue.find(g => g.confirmed && !g.name?.trim());
    const valuesWithoutName = groupedValue.filter(g => g.name === ""?.trim());
    
    if(valuesWithoutName.length > 0) {
      setRedLight(...valuesWithoutName);
    } else {
        setRedLight({});
    }
    
    if (latestConfirmed) {
      alert("Please enter item name before adding next calculation");  
      const a = calcValue.split(/[+*]/);
      setCalcValue(prev => prev.slice(0, prev.length - a[a.length-1].length));
      inputRefs.current[latestConfirmed.id]?.focus();
    } else {
      setCalcValue(() => currValue);
    }

        const checkValidExpression = (expression) => {   
          if (expression.length < 1) return;
          if(!/\d/.test(expression[0])) {
            setCalcError("Expression must start with a number");
            setTimeout(() => setCalcError(""), 2000);
            return;
          };

          const operators = expression.match(/[*+]/g) || [];
          
          for (let i = 0; i < expression.length; i++) {
            if ((expression[i] === "+" && expression[i+1] === "+") || (expression[i] === "*" && expression[i+1] === "*")) {
              
              setCalcError("Invalid Expression: Consecutive operators");
              setTimeout(() => setCalcError(""), 2000);

              setCalcValue((prev) => prev.slice(0, -1));
              return;
            }
            if (operators.length > 1) {
                  if (operators[i] === '*') {
                    if (i !== 0 && operators[i - 1] !== '+') {
                      setCalcError("Invalid Expression: '*' must follow '+'");
                      setTimeout(() => setCalcError(""), 2000);
                      setCalcValue((prev) => prev.slice(0, -1));
                      return
                    }
                  }
          }
        }
    }
    checkValidExpression(calcValue);
  }  

  const handleSendCustomerBill = async () => {
    // Validate customer data
    if (customerData.name.trim() === "") {
      toast.error("Please enter customer name");
      return;
    }
    if (customerData.phoneNo.trim().length !== 10) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }

    if (groupedValue[selectedItemsIndex].name === "") {
      toast.error("Please enter item name");
      return;
    }

    const now = new Date();

    const date = now.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

    const time = now.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
        let id = "Bill-" + nanoid(10);
    let userData = {...groupedValue, totalAmount: result, quantity: groupedValue.length, billId: id, date, time};
    const data = {
      bill : userData,
      customerData,
    }
    try {
          setIsLoader(true);          
      api.post('http://localhost:3000/send-bill', {data});
      toast.info("Bill generated and sent to customer successfully!");
    } catch (error) {
      console.log(error);
      toast.error("Error sending bill to customer");
    } finally {
      setIsLoader(false);      
    }
  }
  console.log(isGuideShow);
  

  return (
    <>
    <ToastContainer/>
    {isLoader && (
<div className={styles.loaderWrapper}>
  <div className={styles.threeBody}>
    <div className={styles.threeBodyDot}></div>
    <div className={styles.threeBodyDot}></div>
    <div className={styles.threeBodyDot}></div>
  </div>
</div>
    )}

    <div className={styles.calcContainer}>
      <div className={styles.calculator}>
            {calcError.length > 0 && <p className={styles.error}>{calcError}</p>}

  <div className={styles.output}>
<input
  ref={calcInputRef}
  value={calcValue}
    onChange={(e) => {
    const raw = e.target.value;
    if (/^[0-9+*]*$/.test(raw)) {
      checkItemNameExist(raw);
    }
  }}
  className={styles.result}
/>
  </div>
  <div className={styles.calcBtns}>
    <button onClick={() => setCalcValue((prev) => prev + "1")} className={styles.btn}>1</button>
    <button onClick={() => setCalcValue((prev) => prev + "2")} className={styles.btn}>2</button>
    <button onClick={() => setCalcValue((prev) => prev + "3")} className={styles.btn}>3</button>
    <button onClick={() => setCalcValue((prev) => prev + "+")} className={styles.btn} style={{backgroundColor: "lightgreen"}}>+</button>
    <button onClick={() => setCalcValue((prev) => prev + "4")} className={styles.btn}>4</button>
    <button onClick={() => setCalcValue((prev) => prev + "5")} className={styles.btn}>5</button>
    <button onClick={() => setCalcValue((prev) => prev + "6")} className={styles.btn}>6</button>
    <button onClick={() => setCalcValue((prev) => prev + "0")} className={styles.btn}>0</button>
    <button onClick={() => setCalcValue((prev) => prev + "7")} className={styles.btn}>7</button>
    <button onClick={() => setCalcValue((prev) => prev + "8")} className={styles.btn}>8</button>
    <button onClick={() => setCalcValue((prev) => prev + "9")} className={styles.btn}>9</button>
    <button onClick={() => setCalcValue((prev) => prev + "*")} className={styles.btn} style={{backgroundColor: "lightblue"}}>*</button>
  </div>
</div>

{/*----------------------------------------- Table---------------------------------- */}
<div className={styles.tableContainer}>
<table className={styles.itemsTable}>
  <thead style={{  color: "black" }} className={styles.tableHeader}>
    <tr className={styles.tableHeaderRow}>
      <th className={styles.tableHeaderCell}>No.</th>
      <th className={styles.tableHeaderCell}>Items</th>
      <th className={styles.tableHeaderCell}>Price</th>
      <th className={styles.tableHeaderCell}>Quantity</th>
      <th className={styles.tableHeaderCell}>Amount</th>
    </tr>
  </thead>
  <tbody className={styles.tableBody}>
    {groupedValue.length === 0 && (
      <tr>
        <td style={{ textAlign: "center", color: "black", }} className={styles.noItemsCell} colSpan={5}> ---x---------- No items added yet ----------x---</td>
      </tr>
    )}
    {groupedValue.map((g, index) => (
      <tr className={styles.tableRow} key={g.id}>
        <td className={styles.tableCell}>{g.id}.
           {redLight.id === g.id && (
            <span style={{ color: "red", marginLeft: "5px" }}>⚠️</span>
           )}
           </td>
        <td className={styles.tableCell}>
                      {g.confirmed ? (
              <>
<input
  key={g.id}
  type="text"
  placeholder="Enter item name"
  ref={(el) => (inputRefs.current[g.id] = el)}
  value={ g.name || ""}
  onFocus={() => setSelectedItemsIndex(index) }
          onBlur={() => [setStoredItems([])]}
  onChange={(e) => {
    handleNameChange(g.id, e.target.value)
  }}
onKeyDown={(e) => {
  if (e.key === "Enter") {
    if (!g.name || g.name.trim() === "") {
      e.preventDefault();
    } else {
      const input = calcInputRef.current;
      input?.focus();
      // have to set cursor at end of input after focusing
      if (input) {
        const len = input.value.length;
        input.setSelectionRange(len, len); 
      }
      setStoredItems([]);
      setRedLight({});
    }
  }
}}

  className={styles.nameInput}
  style={{ padding: "6px 8px" }}
  required
/>

              </>
            ) : (
              <div style={{ color: "#999" }}>typing…</div>
            )}
        </td>
        <td className={styles.tableCell}>{g.price}</td>
        <td className={styles.tableCell}>{g.quantity}</td>
        <td className={styles.tableCell}>${g.amount}</td>
      </tr>
    ))}
{/* Item Suggestions */}
{storedItems.length > 0 && (
  <div className={styles.storedItemsContainer}>
    {storedItems.map((item, index) => (
      <div onMouseDown={() => 
        setGroupedValue((prev) =>
    prev.map((curr, i) =>
      i == selectedItemsIndex ? { ...curr, name: item } : curr
    )
  )
      } key={index} className={styles.storedItem}>
        {item}
      </div>
    ))}
  </div>
)}
    <tr style={{ backgroundColor: "#ebe3e3ff" }} className={styles.tableRow}>
              <td className={styles.tableCell}><b>Total Amount:</b></td>
              <td className={styles.tableCell}></td>
              <td className={styles.tableCell}></td>
              <td className={styles.tableCell}><b>Total <br />Quantity:{groupedValue.length}</b> </td>
              <td className={styles.tableCell}><b>Total:${result}</b> </td>
    </tr>
  </tbody>
</table>

  <div className={styles.customerInfo}>
      <span className={styles.inputContainer}>
        <span style={{display: "flex", gap: "12px"}}>
    <label style={{color: "black"}} htmlFor="">Ph No: </label>
  <input value={customerData.phoneNo} onChange={(e) => setCustomerData({...customerData, phoneNo: e.target.value})} 
  onBlur={() => {
  setTimeout(() => {
    setSearchName([]);
    setSearchNumber([]);
  }, 250);
}} className={styles.customerInput} type="number" placeholder="Ph No" />
</span>
      {customerData?.phoneNo?.length > 0 && (
        <>
{searchNumber.length > 0 && (
      <div className={styles.searchContainer}>
         {searchNumber?.map((number, index) => (
            <input className={styles.searchResultInput} key={index} value={number} onClick={() => [ setSelectedNameAndPhNo({...selectedNameAndPhNo, phNo: number}), ]} type="text" readOnly />
        ))} 
      </div>
)}
        </>
        )}
  </span>

      <span className={styles.inputContainer}>
        <span style={{display: "flex", gap: "12px"}}>
     <label style={{color: "black"}} htmlFor="">Name:</label>
  <input value={customerData.name} onChange={(e) => setCustomerData({...customerData, name: e.target.value})}
    onBlur={() => {
  setTimeout(() => {
    setSearchName([]);
    setSearchNumber([]);
  }, 150);
}} 
  className={styles.customerInput} type="text" placeholder="Name" />
  </span>
  {customerData?.name?.length > 0 && (
    <>
{searchName.length > 0 && (
      <div className={styles.searchContainer}>
        {searchName?.map((name, index) => (
        <input className={styles.searchResultInput} key={index} value={name} onClick={() => setSelectedNameAndPhNo({...selectedNameAndPhNo, name: name})} type="text" readOnly />
        ))} 
      </div>
      )}
          </>
  )}
  </span>
</div>
    <button className={styles.billGenerateBtn} onClick={() => handleSendCustomerBill()}>Generate Bill
      <svg width={18} height={18} fill="none" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
  <path d="M14 2v6h6" />
  <path d="M16 13H8" />
  <path d="M16 17H8" />
  <path d="M10 9H8" />
</svg>
    </button>

</div>
</div>


 </>
  )
}

export default Home;
