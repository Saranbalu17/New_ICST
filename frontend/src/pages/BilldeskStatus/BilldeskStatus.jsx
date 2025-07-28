import React, { useEffect, useState, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { motion, AnimatePresence } from 'framer-motion';
import * as jwtDecodeModule from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
const jwtDecode = jwtDecodeModule.jwtDecode;
const baseUrl =import.meta.env.VITE_BASE_API_URL || "https://default-api.example.com/api";
const grpCode = import.meta.env.VITE_GRP_CODE || "DEFAULT_GRP_CODE";
const colCode = import.meta.env.VITE_DEFAULT_COL_CODE || "DEFAULT_COL_CODE";
const collegeId =import.meta.env.VITE_DEFAULT_COLLEGE_ID || "DEFAULT_COLLEGE_ID";
const BilldeskStatus = () => {
  const [transactionData, setTransactionData] = useState(null);
  const [apiResponse, setApiResponse] = useState(null);
  const hasFetched = useRef(false); // Track if API call has been made
  const navigate=useNavigate()
  useEffect(() => {
    if (hasFetched.current) return; // Prevent duplicate API calls
    hasFetched.current = true;

    const token = new URLSearchParams(window.location.search).get("transaction_response");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setTransactionData(decoded);
        const payload = mapTokenToPayload(decoded);
        fetch(`${baseUrl}/LMS/SaveRegularFeeMainData`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        })
          .then((res) => res.json())
          .then((data) => setApiResponse(data))
          .catch((err) => console.error("API error:", err));
      } catch (error) {
        console.error("Invalid token", error);
      }
    }
  }, []);

  const mapTokenToPayload = (decoded) => ({
    grpCode: decoded?.additional_info?.additional_info1,
    colCode: decoded?.additional_info?.additional_info2,
    collegeId: parseInt(decoded?.additional_info?.additional_info3),
    hallTicketNumber: decoded?.additional_info?.additional_info4,
    studentId: parseInt(decoded?.additional_info?.additional_info5),
    receiptId: parseInt(decoded?.additional_info?.additional_info6),
    userId: parseInt(decoded?.additional_info?.additional_info7),
    certificateId: decoded?.additional_info?.additional_info8,
    merchantTransId: decoded?.orderid,
    atomTransId: decoded?.transactionid,
    transAmt: parseFloat(decoded?.amount),
    transSurChargeAmt: parseFloat(decoded?.surcharge),
    transDate: decoded?.transaction_date,
    bankTransId: decoded?.bank_ref_no,
    transStatus: decoded?.transaction_error_type,
    bankName: decoded?.bankid,
    paymentDoneThrough: decoded?.payment_method_type,
    beesGatewayId: "BILLDESK",
    txnId: decoded?.transactionid,
    total: parseFloat(decoded?.charge_amount),
    receiptDate: new Date().toISOString(),
    result: decoded?.transaction_error_desc,
    success: decoded?.transaction_error_type === "success" ? 0 : 1,
    flag: "PGPayment",
    loginSystemName: "React",
    loginIpAddress: window.location.hostname,
    paymentDoneThroughId: 1,
    userType: "Student",
    receiptNumber: 0,
    totalInWords: "",
    id: 0,
    subMarchantId: 0,
    captchaImg: "",
    acYear: "",
    finYear: "",
    cardNumber: "",
    cardHolderName: "",
    email: "",
    address: "",
    transDescription: "",
    mobileNo: "",
    smsUserId: "",
    smsPwd: "",
    smsKey: "",
    senderName: "",
    smsType: 0,
    message: "",
    onlineDetailsId: 0,
  });

  const downloadReceipt = () => {
    const receipt = `
      Payment Receipt
      ----------------
      Order ID: ${transactionData.orderid}
      Transaction ID: ${transactionData.transactionid}
      Amount: ₹${transactionData.amount}
      Bank: ${transactionData.bankid}
      Status: ${transactionData.transaction_error_desc}
      Date: ${new Date(transactionData.transaction_date).toLocaleString()}
    `;
    const blob = new Blob([receipt], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Receipt_${transactionData.orderid}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!transactionData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid mx-auto"></div>
          <p className="mt-4 text-lg font-medium text-gray-700">Processing payment confirmation...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-green-50 to-purple-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-blue-400/20 opacity-50"></div>
        <motion.div
          className="flex justify-center mb-6"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <svg className="w-16 h-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <motion.path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            />
          </svg>
        </motion.div>
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Payment {transactionData.transaction_error_type === "success" ? "Successful" : "Failed"}
        </h2>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="font-medium text-gray-600">Order ID:</span>
            <span className="text-gray-800">{transactionData.orderid}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-600">Transaction ID:</span>
            <span className="text-gray-800">{transactionData.transactionid}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-600">Amount:</span>
            <span className="text-gray-800">₹{transactionData.amount}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-600">Bank:</span>
            <span className="text-gray-800">{transactionData.bankid}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-600">Status:</span>
            <span className={`text-${transactionData.transaction_error_type === "success" ? "green-600" : "red-600"} font-semibold`}>
              {transactionData.transaction_error_desc}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-600">Date:</span>
            <span className="text-gray-800">{new Date(transactionData.transaction_date).toLocaleString()}</span>
          </div>
        </div>
        <AnimatePresence>
          {apiResponse && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-6 bg-green-100 p-4 rounded-lg text-green-700 text-center"
            >
              Server saved your payment successfully.
            </motion.div>
          )}
        </AnimatePresence>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-6 w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors duration-300 backdrop-blur-sm"
          onClick={downloadReceipt}
        >
          Download Receipt
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-6 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300 backdrop-blur-sm"
          onClick={()=>navigate("/student-dashboard")}
        >
          Back to Home
        </motion.button>
      </motion.div>
    </div>
  );
};

export default BilldeskStatus;