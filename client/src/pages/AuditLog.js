import React, { useState, useEffect, useRef } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "bootstrap/dist/css/bootstrap.min.css";
import "./warehouse.css";
import axios from "axios";
import "./warehouse.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// import form MUI
import { DataGrid } from "@mui/x-data-grid";
import toast from "react-hot-toast";
import { Space, InputNumber } from "antd";
import { addDays } from "date-fns";

const columns = [
  { field: "id", headerName: "", width: 50 },
  { field: "content", headerName: "Content", width: 430 },
  { field: "date", headerName: "Deletion Date", width: 300 },
];
const getSevenDaysLater = () => {
  const sevenDatesLater = new Date();
  sevenDatesLater.setDate(sevenDatesLater.getDate() + 7);
  return sevenDatesLater.getTime();
};

function DataTable() {
  const user_id = localStorage.getItem("user_id");
  const [auditList, setAuditList] = useState([]);

  const fetchMessage = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(
        `http://localhost:3003/auditlog/${token}`
      ); // Đặt đường dẫn API của bạn tùy thuộc vào cấu hình server

      setAuditList(response.data.audit);
    } catch (error) {
      console.error("Error fetching password records:", error);
    }
  };

  useEffect(() => {
    fetchMessage();
  }, []);

  // useEffect sẽ chạy sau khi component được render lần đầu tiên
  const rows = auditList.map((audit, index) => ({
    id: index + 1,
    _id: audit._id,
    content: audit.content,
    date: audit.timestamp,
  }));

  return (
    <>
      <div style={{ height: 500, width: "120%" }}>
        <DataGrid
          sx={{
            boxShadow: 10,
            border: 2,
            borderColor: "primary.black",
            "& .MuiDataGrid-cell:hover": {
              color: "primary.main",
            },
            fontSize: 16,
            fontFamily: "cursive",
          }}
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 5 },
            },
          }}
          pageSizeOptions={[5, 10]}
        />
      </div>
    </>
  );
}

function AuditLog() {
  return (
    <div style={{ position: "relative", marginTop: "5%" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginLeft: "5%",
        }}
      >
        <DataTable style={{ marginLeft: "10px" }} />
      </div>
    </div>
  );
}

export default AuditLog;
