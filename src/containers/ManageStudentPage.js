import React, { useState, useEffect, useRef } from "react";
import { Container, Card, CardHeader, CardBody, Row, Col, Form, FormInput, FormSelect, Button } from "shards-react";
import PageTitle from "../shards-dashboard-template/components/common/PageTitle";
import apis from "../apis";
import constants from "../constants";
import update from "immutability-helper";
import { withRouter } from "react-router-dom";
import BoardAuthorityManager from "../components/BoardAuthorityManager";
import AddUserModal from "../modals/AddUserModal";
import StudentEditor from "../components/StudentEditor";
import ReactPaginate from "react-paginate";
import { set } from "date-fns";

export default withRouter(function ManageStudentPage({ history }) {
  const [page, setPage] = useState(0);
  const [studentPageData, setStudentPageData] = useState(null);

  const [selectedUser, setSelectedUser] = useState(null);
  const [addingRole, setAddingRole] = useState("");
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showUploadWaiting, setShowUploadWaiting] = useState(false);
  const fileInputRef = useRef();

  useEffect(() => {
    apis.studentAdminController
      .getStudentList(page)
      .then((response) => {
        setStudentPageData(response.data);
      })
      .catch((error) => {
        setStudentPageData(null);
      });
    return () => {};
  }, [page]);

  const onStudentCSVSeleted = (e) => {
    const files = e.target.files;
    if (files.length === 0) {
      return;
    }
    function processFile(file) {
      debugger;
      var reader = new FileReader();

      reader.onload = function () {
        const result = reader.result;
        if (result.split("\n").length <= 1) {
          return;
        }
        if (window.confirm(`총 ${result.split("\n").length - 1}명을 업로드 하시겠습니까?\n${result}`)) {
          setShowUploadWaiting(true);
          apis.studentAdminController
            .uploadCsv(result)
            .then((response) => {
              if (response.headers && response.headers["content-type"] == "application/ms-excel;charset=UTF-8") {
                const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement("a");
                link.href = downloadUrl;
                link.setAttribute("download", "student_csv_result_" + Date.now() + ".csv");
                document.body.appendChild(link);
                link.click();
              }
              setShowUploadWaiting(false);
              if (page === 0) {
                apis.studentAdminController
                  .getStudentList(page)
                  .then((response) => {
                    setStudentPageData(response.data);
                  })
                  .catch((error) => {
                    setStudentPageData(null);
                  });
              } else {
                setPage(0);
              }
            })
            .catch((error) => {
              alert(`업로드중 오류가 발생했습니다.\n
                        ${error?.response?.message || error.toString() || ""}
                        `);
              setShowUploadWaiting(false);
            });
        }
      };

      reader.readAsText(file);
    }
    processFile(files[0]);
  };

  return (
    <Container fluid className="main-content-container px-4">
      <Row noGutters className="page-header py-4">
        <PageTitle title="Users" md="12" className="ml-sm-auto mr-sm-auto" />
      </Row>
      <Row>
        {showUploadWaiting ? (
          <div style={{ position: "fixed", zIndex: 999, backgroundColor: "rgba(0,0,0,0.5)", left: 0, top: 0, width: "100%", height: "100%" }}>
            Upload waiting
          </div>
        ) : undefined}
        <Col md={selectedUser ? "5" : "12"}>
          <Card small className="mb-4">
            <CardHeader className="border-bottom">
              <input type="file" style={{ display: "none" }} multiple={false} accept={".csv"} onChange={onStudentCSVSeleted} value="" ref={fileInputRef} />
              <Button
                className="float-right"
                onClick={() => {
                  setShowAddUserModal(true);
                }}
              >
                교육생 추가
              </Button>
              <Button
                className="float-right"
                style={{ marginRight: 10 }}
                onClick={() => {
                  if (fileInputRef && fileInputRef.current) {
                    fileInputRef.current.click();
                  }
                }}
              >
                교육생 CSV 추가
              </Button>
              <a href="/student_csv_example.csv" download>
                <Button className="float-right" style={{ marginRight: 10 }}>
                  교육생 CSV 추가 샘플
                </Button>
              </a>
              <a href="/api/v1/admin/student/csv" download>
                <Button className="float-right" style={{ marginRight: 10 }}>
                  교육생 리스트 다운로드
                </Button>
              </a>
            </CardHeader>
            <CardBody>
              <table className="table mb-0">
                <thead className="bg-light">
                  <tr>
                    <th scope="col" className="border-0" style={{ width: 70 }}>
                      #
                    </th>
                    <th scope="col" className="border-0">
                      Email
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {studentPageData && studentPageData.content && studentPageData.content.length > 0
                    ? studentPageData.content.map((item, key) => {
                        return (
                          <tr
                            key={key}
                            style={{ cursor: "pointer", backgroundColor: selectedUser && selectedUser.id === item.id ? "rgba(0,0,255,0.1)" : undefined }}
                            onClick={() => {
                              setSelectedUser(item);
                            }}
                          >
                            <td>{item.id}</td>
                            <td>{item.email}</td>
                          </tr>
                        );
                      })
                    : undefined}
                </tbody>
              </table>
              {studentPageData && (
                <ReactPaginate
                  containerClassName="paginate"
                  previousLabel="Prev"
                  nextLabel="Next"
                  pageCount={studentPageData.totalPages}
                  forcePage={page}
                  initialPage={page}
                  onPageChange={(e) => {
                    setPage(e.selected);
                  }}
                />
              )}
            </CardBody>
          </Card>
        </Col>
        {selectedUser ? (
          <Col md="7">
            <StudentEditor student={selectedUser} />
          </Col>
        ) : undefined}
      </Row>
      {showAddUserModal ? (
        <AddUserModal
          type="student_42seoul"
          onCloseRequest={() => {
            setShowAddUserModal(false);
          }}
          onUserAdded={(user) => {
            apis.studentAdminController
              .getStudentList(page)
              .then((response) => {
                setStudentPageData(response.data);
              })
              .catch((error) => {
                setStudentPageData(null);
              });
          }}
        />
      ) : undefined}
    </Container>
  );
});

const fullWidthBtn = { width: "100%", marginBottom: 5 };
