import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "bootstrap/dist/css/bootstrap.min.css";
import "./warehouse.css";
import axios from "axios";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

// import form MUI
import { DataGrid } from "@mui/x-data-grid";
import { IconButton } from "@mui/material";
import { MdOutlineEdit, MdDeleteOutline } from "react-icons/md";
import toast from "react-hot-toast";
import { Space } from "antd";

const initialState = {
  _id: "",
  title: "",
  username: "",
  password: "",
  url: "",
  note: "",
};

const columns = [
  { field: "id", headerName: "", width: 50 },
  { field: "title", headerName: "Title", width: 300 },
  { field: "username", headerName: "Username", width: 280 },
  { field: "date", headerName: "Last Update", width: 300 },
];

function DataTable() {
  const [passwordRecords, setPasswordRecords] = useState([]);
  const [dataPR, setDataPR] = useState(initialState);
  const [showEdit, setShowEdit] = useState(false);
  const { title, username, password, url, note } = dataPR;
  const handleShowEdit = () => setShowEdit(true);
  const handleClose = () => setShowEdit(false);
  const [showPassword, setShowPassword] = useState(false);
  const token = localStorage.getItem("authToken");

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setDataPR({ ...dataPR, [name]: value });
    console.log(dataPR);
  };

  const fetchPasswordRecords = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3003/passwordrecord/show-data-with-user-id/${token}`
      ); // Đặt đường dẫn API của bạn tùy thuộc vào cấu hình server
      setPasswordRecords(response.data);
    } catch (error) {
      console.error("Error fetching password records:", error);
    }
  };

  const handleUpdateData = () => {
    axios
      .patch(
        "http://localhost:3003/passwordrecord/update-passwordrecord",
        dataPR,
        {
          headers: {
            Authorization: token,
          },
        }
      )
      .then((response) => {
        if (response.data.status == "Success") {
          toast.success("Updated data successfully", {
            position: "top-right",
          });
          setShowEdit(false);
          fetchPasswordRecords();
        }
      });
  };

  useEffect(() => {
    fetchPasswordRecords();
  }, []); // useEffect sẽ chạy sau khi component được render lần đầu tiên
  const rows = passwordRecords.map((record, index) => ({
    id: index + 1,
    _id: record._id,
    title: record.title,
    username: record.username,
    date: record.createDate,
  }));

  const handleSelectionChange = (id) => {
    axios
      .get(`http://localhost:3003/passwordrecord/get-by-id/${id}`)
      .then((response) => {
        console.log(response.data);
        if (response.data.status == "Success") {
          setDataPR(response.data.data);
          setShowEdit(true);
        }
      });
  };

  const handleDelete = () => {
    const newDataPasswordRecord = {
      token,
      _id: dataPR._id,
    };
    axios
      .delete(
        `http://localhost:3003/passwordrecord/delete/${token}/${dataPR._id}`
      )
      .then((res) => {
        toast.success("Deleted data successfully", {
          position: "top-right",
        });
        setShowEdit(false);
        fetchPasswordRecords();
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
          // checkboxSelection
          onCellClick={(params) => handleSelectionChange(params.row._id)}
        />
      </div>
      <Modal show={showEdit} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Sửa dữ liệu dữ liệu</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                placeholder="Đăng nhập/ghi chú/..."
                autoFocus
                onChange={handleChangeInput}
                name="title"
                value={title}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Username </Form.Label>
              <Form.Control
                placeholder="Tên tài khoản"
                autoFocus
                onChange={handleChangeInput}
                name="username"
                value={username}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Space direction="vertical">
                <Form.Label>Password</Form.Label>
                <Space direction="horizontal">
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={password}
                    onChange={handleChangeInput}
                    style={{ width: "430px" }}
                  />
                  {showPassword ? (
                    <AiFillEyeInvisible
                      style={{ fontSize: "30px", cursor: "pointer" }}
                      onClick={handleTogglePassword}
                    />
                  ) : (
                    <AiFillEye
                      style={{ fontSize: "30px", cursor: "pointer" }}
                      onClick={handleTogglePassword}
                    />
                  )}
                </Space>
              </Space>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>URL</Form.Label>
              <Form.Control
                type="url"
                placeholder="facebook.com"
                autoFocus
                onChange={handleChangeInput}
                name="url"
                value={url}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Note</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                onChange={handleChangeInput}
                value={note}
                name="note"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer style={{ justifyContent: "space-between" }}>
          <div>
            <Button variant="danger" onClick={handleDelete}>
              Xóa
            </Button>
          </div>
          <div>
            <Button variant="secondary" onClick={handleClose}>
              Hủy bỏ
            </Button>
            <Button variant="primary" onClick={handleUpdateData}>
              Cập nhật
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
}

function ButtonModal() {
  const [show, setShow] = useState(false);

  const [dataPR, setDataPR] = useState(initialState);
  const { title, username, password, url, note } = dataPR;
  const token = localStorage.getItem("authToken");
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSaveData = () => {
    axios
      .post("http://localhost:3003/passwordrecord/add-passwordrecord", dataPR, {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        if (response.data.message == "Success") {
          toast.success("Added data successfully", {
            position: "top-right",
          });
          window.location.href = "/warehouse";
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

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setDataPR({ ...dataPR, [name]: value });
    console.log(dataPR);
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div style={{ width: "50px", marginTop: "10%" }}>
      <Button variant="primary" onClick={handleShow}>
        Thêm
      </Button>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Data</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                autoFocus
                onChange={handleChangeInput}
                name="title"
                value={title}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Username </Form.Label>
              <Form.Control
                autoFocus
                onChange={handleChangeInput}
                name="username"
                value={username}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Space direction="vertical">
                <Form.Label>Password</Form.Label>
                <Space direction="vertical">
                  <Form.Label>Password</Form.Label>
                  <Space direction="horizontal">
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={password}
                      onChange={handleChangeInput}
                      style={{ width: "430px" }}
                    />
                    {showPassword ? (
                      <AiFillEyeInvisible
                        style={{ fontSize: "30px", cursor: "pointer" }}
                        onClick={handleTogglePassword}
                      />
                    ) : (
                      <AiFillEye
                        style={{ fontSize: "30px", cursor: "pointer" }}
                        onClick={handleTogglePassword}
                      />
                    )}
                  </Space>
                </Space>
              </Space>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>URL</Form.Label>
              <Form.Control
                type="url"
                placeholder="facebook.com"
                autoFocus
                onChange={handleChangeInput}
                name="url"
                value={url}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Note</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                onChange={handleChangeInput}
                value={note}
                name="note"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Hủy bỏ
          </Button>
          <Button variant="primary" onClick={handleSaveData}>
            Lưu
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

function Warehouse() {
  return (
    <div style={{ position: "relative", marginTop: "5%" }}>
      <div style={{ position: "absolute", top: -50, right: -25 }}>
        <ButtonModal />
      </div>
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

export default Warehouse;
