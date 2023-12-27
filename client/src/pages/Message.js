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
  { field: "title", headerName: "Title", width: 430 },
  { field: "date", headerName: "Deletion Date", width: 300 },
  { field: "remainingHits", headerName: "Remaining Hits", width: 180 },
];
const getSevenDaysLater = () => {
  const sevenDatesLater = new Date();
  sevenDatesLater.setDate(sevenDatesLater.getDate() + 7);
  return sevenDatesLater.getTime();
};

function DataTable() {
  const initialState = {
    _id: "",
    title: "",
    text: "",
    urlSend: "",
    startDate: Date.now(),
    endDate: getSevenDaysLater(),
    maximumAccessCount: 10,
    password: "",
    tmpPassword: "",
    note: "",
  };
  const [dataMessage, setDataMessage] = useState(initialState);
  const [showEdit, setShowEdit] = useState(false);
  const [show, setShow] = useState(false);
  const {
    _id,
    title,
    text,
    urlSend,
    startDate,
    endDate,
    maximumAccessCount,
    password,
    tmpPassword,
    note,
  } = dataMessage;
  const token = localStorage.getItem("authToken");
  const handleClose = () => setShowEdit(false);
  const [messageList, setMessageList] = useState([]);
  const tomorrow = addDays(new Date(), 1); // Tính ngày mai

  const handleChangeDate = (date, fieldName) => {
    setDataMessage((prevData) => ({
      ...prevData,
      [fieldName]: date.getTime(),
    }));
  };

  const handleChangeInput = (eventOrValue, fieldName) => {
    // Kiểm tra xem có sự kiện (event) được truyền vào hay không
    const value = eventOrValue.target
      ? eventOrValue.target.value
      : eventOrValue;

    setDataMessage((prevData) => ({
      ...prevData,
      [fieldName]: value,
    }));
    console.log(dataMessage);
  };

  const handleAddClick = async () => {
    await setDataMessage(initialState);
    setShow(true);
  };

  const fetchMessage = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3003/message/show-data-with-user-id/${token}`
      ); // Đặt đường dẫn API của bạn tùy thuộc vào cấu hình server

      setMessageList(response.data);
    } catch (error) {
      console.error("Error fetching password records:", error);
    }
  };

  useEffect(() => {
    fetchMessage();
  }, []);

  const handleAddData = async () => {
    axios
      .post("http://localhost:3003/message/add-message", dataMessage, {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        if (response.data.status == "Success") {
          toast.success("Added data successfully", {
            position: "top-right",
          });
          fetchMessage();
          setShow(false);
          setDataMessage(initialState);
        } else {
          const errors = response.data.errors;
          errors.map((error) => {
            toast.error(error, {
              position: "top-right",
            });
          });
        }
      });
  };

  const handleUpdateData = () => {
    const data = {
      ...dataMessage,
      password: tmpPassword,
    };
    console.log(data);
    axios
      .patch("http://localhost:3003/message/update-message", data, {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        if (response.data.status == "Success") {
          toast.success("Updated data successfully", {
            position: "top-right",
          });
          setShowEdit(false);
          fetchMessage();
        }
      });
  };

  const handleDelete = () => {
    axios
      .delete(
        `http://localhost:3003/message/delete/${token}/${dataMessage._id}`
      )
      .then((res) => {
        toast.success("Deleted data successfully", {
          position: "top-right",
        });
        setShowEdit(false);
        fetchMessage();
      });
  };

  useEffect(() => {
    fetchMessage();
  }, []); // useEffect sẽ chạy sau khi component được render lần đầu tiên
  const rows = messageList.map((record, index) => ({
    id: index + 1,
    _id: record._id,
    title: record.title,
    date: record.endDate,
    remainingHits: `${record.accessedSuccess + record.accessedFailure}/ ${
      record.maximumAccessCount
    }   (${record.accessedSuccess} Success)`,
  }));

  const parseDateString = (dateString) => {
    return dateString ? new Date(dateString) : null;
  };

  const handleSelectionChange = (id) => {
    axios
      .get(`http://localhost:3003/message/get-by-id/${id}`)
      .then((response) => {
        if (response.data.status === "Success") {
          console.log(response.data);
          // Chuyển đổi giá trị startDate và endDate thành đối tượng Date
          const startDate = parseDateString(response.data.message.startDate);
          const endDate = parseDateString(response.data.message.endDate);

          // Cập nhật state với giá trị mới
          setDataMessage({
            ...response.data.message,
            startDate: startDate,
            endDate: endDate,
          });

          // Hiển thị component Edit
          setShowEdit(true);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };
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
          onCellClick={(params) => handleSelectionChange(params.row._id)}
        />
      </div>
      <div style={{ position: "absolute", top: -50, right: -45 }}>
        <Button variant="primary" onClick={handleAddClick}>
          Thêm
        </Button>
      </div>

      <Modal show={showEdit} onHide={() => setShowEdit(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Data</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                placeholder="Title of Message"
                autoFocus
                onChange={(e) => handleChangeInput(e, "title")}
                name="title"
                value={title}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Message</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                onChange={(e) => handleChangeInput(e, "text")}
                value={text}
                name="text"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Url </Form.Label>
              <Form.Control
                id="urlSendInput"
                name="urlSend"
                value={urlSend}
                disabled
              />
            </Form.Group>
            <Form.Group
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Space direction="vertical">
                <Form.Label>Start Date</Form.Label>
                <DatePicker
                  name="startDate"
                  value={startDate}
                  selected={startDate}
                  onChange={(date) => handleChangeDate(date, "startDate")}
                  dateFormat="dd/MM/yyyy"
                  className="custom-datepicker"
                  minDate={new Date()}
                />
              </Space>

              {/* Second DatePicker */}
              <Space direction="vertical">
                <Form.Label>End Date</Form.Label>
                <DatePicker
                  name="endDate"
                  value={endDate}
                  selected={endDate}
                  onChange={(date) => handleChangeDate(date, "endDate")}
                  dateFormat="dd/MM/yyyy"
                  className="custom-datepicker"
                  minDate={tomorrow}
                />
              </Space>
            </Form.Group>
            <Form.Group
              className="mb-3"
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Space direction="vertical">
                <Form.Label>Maximum Access Count</Form.Label>
                <InputNumber
                  style={{ width: "220px" }}
                  min={1}
                  defaultValue={maximumAccessCount}
                  onChange={(value) => {
                    handleChangeInput(value, "maximumAccessCount");
                  }}
                />
              </Space>
              <Space direction="vertical">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="tmpPassword"
                  onChange={(e) => handleChangeInput(e, "tmpPassword")}
                  style={{ width: "220px" }}
                />
              </Space>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Note</Form.Label>
              <Form.Control
                autoFocus
                onChange={(e) => handleChangeInput(e, "note")}
                name="note"
                value={note}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer style={{ justifyContent: "space-between" }}>
          <div>
            <Button variant="danger" onClick={handleDelete}>
              Delete
            </Button>
          </div>
          <div>
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleUpdateData}>
              Update
            </Button>
          </div>
        </Modal.Footer>
      </Modal>

      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Data</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                autoFocus
                onChange={(e) => handleChangeInput(e, "title")}
                name="title"
                value={title}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Message</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                onChange={(e) => handleChangeInput(e, "text")}
                value={text}
                name="text"
              />
            </Form.Group>

            <Form.Group
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Space direction="vertical">
                <Form.Label>Start Date</Form.Label>
                <DatePicker
                  name="startDate"
                  selected={startDate}
                  onChange={(date) => handleChangeDate(date, "startDate")}
                  dateFormat="dd/MM/yyyy"
                  className="custom-datepicker"
                />
              </Space>

              {/* Second DatePicker */}
              <Space direction="vertical">
                <Form.Label>End Date</Form.Label>
                <DatePicker
                  name="endDate"
                  selected={endDate}
                  onChange={(date) => handleChangeDate(date, "endDate")}
                  dateFormat="dd/MM/yyyy"
                  className="custom-datepicker"
                />
              </Space>
            </Form.Group>
            <Form.Group
              className="mb-3"
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Space direction="vertical">
                <Form.Label>Maximum Access Count</Form.Label>
                <InputNumber
                  style={{ width: "220px" }}
                  min={1}
                  defaultValue={10}
                  onChange={(value) => {
                    handleChangeInput(value, "maximumAccessCount");
                  }}
                />
              </Space>
              <Space direction="vertical">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={password}
                  onChange={(e) => handleChangeInput(e, "password")}
                  style={{ width: "220px" }}
                />
              </Space>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Note </Form.Label>
              <Form.Control
                autoFocus
                onChange={(e) => handleChangeInput(e, "note")}
                name="note"
                value={note}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <div>
            <Button variant="primary" onClick={handleAddData}>
              Confirm
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
}

function Message() {
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

export default Message;
