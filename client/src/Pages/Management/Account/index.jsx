import { useContext, useEffect, useState } from "react";
import Breadcrumb from "../../../Components/Breadcrumb";
import LoadingSpinner from "../../../Components/Loading";
import PopUp from "../../../Components/PopUp";
import { AccountApi } from "../../../Api/account";
import "./Account.scss";
import AuthContext from "../../../Context/AuthProvider";

const AccountManagement = () => {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [fetchAccounts, setFetchAccounts] = useState();
  const [openPopup, setOpenPopup] = useState(false);
  const [deletePopup, setDeletePopup] = useState(false);
  const [account, setAccount] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: 'username', direction: 'ascending' });

  const { auth } = useContext(AuthContext);

  const fetchData = async () => {
    try {
      setBusy(true);
      const result = await AccountApi.getAllAccounts();
      setFetchAccounts(result);
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("Failed to load accounts. Please try again.");
      setError(true);
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Account Management | OKBF";
  }, []);

  const handleClick = (account) => {
    setOpenPopup(true);
    setAccount(account);
  };

  const handleDeleteClick = (account) => {
    setDeletePopup(true);
    setAccount(account);
  };
  const handleSetAccounts = async () => {
    try {
      const newAccountData = {
        email: account.email,
        username: account.username,
        isAdmin: !account.isAdmin,
      };
      setBusy(true);
      await AccountApi.updateAccount(newAccountData);
      await fetchData();
      setSuccessMessage(`Successfully ${newAccountData.isAdmin ? 'granted' : 'removed'} admin permissions for ${account.username}`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error("Error updating account:", error);
      setErrorMessage(`Failed to update account permissions: ${error.message || 'Unknown error'}`);
      setError(true);
    } finally {
      setBusy(false);
    }
    setOpenPopup(false);
  };

  const handleDeleteAccount = async () => {
    if (auth.user.username === account.username) {
      setErrorMessage("You cannot delete your own account!");
      setError(true);
      setDeletePopup(false);
      return;
    }
    
    try {
      setBusy(true);
      await AccountApi.deleteAccount(account.email);
      await fetchData();
      setSuccessMessage(`Account ${account.username} has been deleted successfully`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error("Error deleting account:", error);
      setErrorMessage("Failed to delete account. Please try again.");
      setError(true);
    } finally {
      setBusy(false);
    }
    setDeletePopup(false);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedAccounts = () => {
    if (!fetchAccounts) return [];
    
    const sorted = [...fetchAccounts].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });

    if (!searchTerm) return sorted;
    
    return sorted.filter(account => {
      return (
        account.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        account.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  };

  const renderSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return (
      <span className="sort-icon">
        {sortConfig.direction === 'ascending' ? ' ▲' : ' ▼'}
      </span>
    );
  };

  const listProduct = sortedAccounts().map((account, index) => {
    return (
      <tr key={account._id}>
        <td>{index + 1}</td>
        <td>{account.username}</td>
        <td>{account.email}</td>
        <td>
          <label className="switch">
            <input
              type="checkbox"
              onClick={() =>
                auth.user.username === account.username
                  ? {}
                  : handleClick(account)
              }
              checked={account.isAdmin}
              readOnly
            />
            <span
              className="slider round"
              style={{
                cursor:
                  auth.user.username === account.username
                    ? "not-allowed"
                    : "pointer",
              }}
            ></span>
          </label>
        </td>
        <td>
          <label className="switch">
            <input type="checkbox" checked={account.verified} readOnly />
            <span
              className="slider round"
              style={{ cursor: "not-allowed" }}
            ></span>
          </label>
        </td>
        <td>
          {auth.user.username !== account.username && (
            <button 
              className="delete-btn" 
              onClick={() => handleDeleteClick(account)}
            >
              Delete
            </button>
          )}
        </td>
      </tr>
    );
  });

  return (
    <>
      <main className="accounts-management">
        <section>
          <Breadcrumb
            breadcrumb="Accounts"
            list={[{ title: "Admin", path: "/admin" }]}
          />
        </section>
        <section>
          {busy || !fetchAccounts ? (
            <LoadingSpinner />
          ) : (
            <div className="container">
              <div className="users-management-wrapper">
                {successMessage && (
                  <div className="success-message">
                    {successMessage}
                  </div>
                )}
                <div className="list-user">
                  <h1 className="user-title">Accounts Management</h1>
                  <div className="search-bar">
                    <input
                      type="text"
                      placeholder="Search by username or email..."
                      value={searchTerm}
                      onChange={handleSearch}
                    />
                  </div>
                  <div className="user-table">
                    <table>
                      <thead>
                        <tr>
                          <th>STT</th>
                          <th onClick={() => handleSort('username')} className="sortable">
                            User Name {renderSortIcon('username')}
                          </th>
                          <th onClick={() => handleSort('email')} className="sortable">
                            Email {renderSortIcon('email')}
                          </th>
                          <th onClick={() => handleSort('isAdmin')} className="sortable">
                            Is Admin {renderSortIcon('isAdmin')}
                          </th>
                          <th onClick={() => handleSort('verified')} className="sortable">
                            Is Verified {renderSortIcon('verified')}
                          </th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>{fetchAccounts && listProduct}</tbody>
                    </table>
                  </div>
                </div>

                {error && (
                  <PopUp
                    message={errorMessage || "Error! Please notify the developer :< "}
                    setPopUp={setError}
                  />
                )}
                {openPopup && (
                  <PopUp setPopUp={setOpenPopup}>
                    <div className="desc">
                      Are you sure you want to change the permissions of{" "}
                      <span style={{ color: "red" }}> {account.username}</span>{" "}
                      account ?
                    </div>
                    <button
                      className="theme-btn__black"
                      onClick={() => setOpenPopup(false)}
                    >
                      No
                    </button>
                    &nbsp; &nbsp;
                    <button
                      className="theme-btn__white"
                      onClick={() => handleSetAccounts(account)}
                    >
                      Yes
                    </button>
                  </PopUp>
                )}
                {deletePopup && (
                  <PopUp setPopUp={setDeletePopup}>
                    <div className="desc">
                      Are you sure you want to delete{" "}
                      <span style={{ color: "red" }}> {account.username}</span>{" "}
                      account? This action cannot be undone.
                    </div>
                    <button
                      className="theme-btn__black"
                      onClick={() => setDeletePopup(false)}
                    >
                      Cancel
                    </button>
                    &nbsp; &nbsp;
                    <button
                      className="theme-btn__danger"
                      onClick={() => handleDeleteAccount()}
                    >
                      Delete
                    </button>
                  </PopUp>
                )}
              </div>
            </div>
          )}
        </section>
      </main>
    </>
  );
};

export default AccountManagement;
