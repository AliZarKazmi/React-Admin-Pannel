import * as React from "react";
import { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import SpellcheckIcon from "@mui/icons-material/Spellcheck";
import CancelIcon from "@mui/icons-material/Cancel";
import { db, auth } from "../firebaseConfig/Firebase.js";
import { Link } from "@mui/material";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  setDoc,
} from "firebase/firestore";
import Swal from "sweetalert2";

export default function AccountVerif() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const empCollectionRef = collection(db, "VerifyCompany");
  const RegCollectionRef = collection(db, "RegisterationForms");
  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    setIsLoading(true);
    try {
      const data = await getDocs(empCollectionRef);
      // setRows(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      const allRows = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      setRows(allRows);
      setIsLoading(false);
    } catch {
      alert("error");
      setIsLoading(false);
    }
  };

  //pagination
  const displayedRows = rows.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const deleteUser = (id, email) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Not Approve",
    }).then((result) => {
      if (result.value) {
        const UserEmail = email;
        deleteApi(id, UserEmail);
      }
    });
  };

  const deleteApi = async (id, email) => {
    const userDoc = doc(db, "VerifyCompany", id);
    await deleteDoc(userDoc);
    Swal.fire("Not Approved!", "Account has not been Approved.", "success");

    //Sending email to user

    const emailContent = `
    
    We hope this email finds you well. We would like to inform you that your account on our platform is "NOT Approved".

    Please note that this does not necessarily mean a permanent rejection.  
    
    

    `;
    window.Email.send({
      SecureToken: "2ad0c56c-2a55-47de-8eed-2be00af96c73 ",
      To: email,
      From: "fa19-bse-005@cuilahore.edu.pk",
      Subject: "Account Status Decline ",
      Body: emailContent,
    });
    setRows([]);
    getUsers();
  };

  const submit = (
    id,
    email,
    password,
    accountType,
    userRole,
    companyName,
    businessDescription,
    websiteLink,
    phone,
    logo,
    city,
    address
  ) => {
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((userCredentials) => {
        const user = userCredentials.user;
        // console.log("registered with: ",user.email);

        setDoc(doc(collection(db, "RegisterationForms")), {
          Email: email,
          AccountType: accountType,
          UserRole: companyName,
          CompanyName: userRole,
          BusinessDescription: businessDescription,
          WebsiteLink: websiteLink,
          Phone: phone,
          Logo: logo,
          City: city,
          Address: address,
        })
          .then((res) =>
          {
            Swal.fire("Account has been Succesfully Approve and Verification Email is send to user")
            // verifDel(id);
          }
             
            )
          .catch(() => Swal.fire("Check Your Internet Connection"));
      })
      .catch((error) => {
        Swal.fire(error.message);
      });

     
      //sending approval mail to user
      const approvalMail = `We are delighted to inform you that your account registration on our platform has been successfully approved!

      Thank you for choosing our platform and being a part of our vibrant community. We look forward to seeing you thrive and make the most out of your journey with us.`
      window.Email.send({
        SecureToken: "2ad0c56c-2a55-47de-8eed-2be00af96c73 ",
        To: email,
        From: "fa19-bse-005@cuilahore.edu.pk",
        Subject: " Decor Spot Account Approval - Welcome To Our Plateform ",
        Body: approvalMail,
      });
      verifDel(id);
      // setRows([]);
      // getUsers();
  };
  
  const verifDel = async (id) => {
    const userDoc = doc(db, "VerifyCompany", id);
    await deleteDoc(userDoc);
    setRows([]);
    getUsers();
  }

  return (
    <>
      {isLoading ? (
        // <div>Loading...</div>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <Paper sx={{ width: "100%", overflow: "hidden" }}>
          <Typography
            gutterBottom
            variant="h5"
            component="div"
            sx={{ padding: "20px" }}
          >
            Account Verification
          </Typography>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell align={"left"} style={{ minWidth: "100px" }}>
                    Logo
                  </TableCell>
                  <TableCell align={"left"} style={{ minWidth: "100px" }}>
                    CompanyName
                  </TableCell>
                  <TableCell align={"left"} style={{ minWidth: "100px" }}>
                    Email
                  </TableCell>

                  <TableCell align={"left"} style={{ minWidth: "100px" }}>
                    Website Link
                  </TableCell>
                  <TableCell align={"left"} style={{ minWidth: "100px" }}>
                    Phone Number
                  </TableCell>
                  <TableCell align={"left"} style={{ minWidth: "100px" }}>
                    Account Type
                  </TableCell>

                  <TableCell align={"left"} style={{ minWidth: "100px" }}>
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {displayedRows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => {
                    return (
                      <TableRow hover role="checkbox" tabIndex={-1}>
                        <TableCell key={row.id} align="left">
                          <img
                            src={row.Logo}
                            alt="Profile"
                            style={{
                              borderRadius: "50%",
                              width: "30px",
                              height: "30px",
                            }}
                          />
                        </TableCell>

                        <TableCell key={row.id} align="left">
                          {row.CompanyName}
                        </TableCell>

                        <TableCell key={row.id} align="left">
                          {row.Email}
                        </TableCell>

                        <TableCell key={row.id} align="left" cursor="pointer">
                          <Link href={row.WebsiteLink} target="_blank">
                            {row.WebsiteLink}
                          </Link>
                        </TableCell>
                        <TableCell key={row.id} align="left">
                          {row.Phone}
                        </TableCell>

                        <TableCell key={row.id} align="left">
                          {row.AccountType}
                        </TableCell>
                        <TableCell align="left">
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              paddingRight: "50px",
                            }}
                          >
                            <SpellcheckIcon
                              style={{
                                fontSize: "25px",
                                color: "blue",
                                cursor: "pointer",
                              }}
                              onClick={() => {
                                submit(
                                  row.id,
                                  row.Email,
                                  row.Password,
                                  row.AccountType,
                                  row.CompanyName,
                                  row.UserRole,
                                  row.BusinessDescription,
                                  row.WebsiteLink,
                                  row.Phone,
                                  row.Logo,
                                  row.City,
                                  row.Address
                                );
                              }}
                            />

                            <CancelIcon
                              style={{
                                fontSize: "20px",
                                color: "darkred",
                                cursor: "pointer",
                              }}
                              onClick={() => {
                                deleteUser(row.id, row.Email);
                              }}
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      )}
    </>
  );
}
