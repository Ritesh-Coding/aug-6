import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, Button } from 'react-bootstrap';
import { IconContext } from 'react-icons/lib';
import { AdminSidebarData } from './AdminSideBarData';
import AdminSubMenu from './AdminSubMenu';
import useAxios from '../../../hooks/useAxios';
import logo from "../../../assets/hrms.png";
import notificationImage from "../../../assets/notificationIcon.png";
import "./AdminSideBar.css";
import { RootState } from '../../../types'; 

const Nav = styled.div`
  background: #FFFFFF;
  height: 80px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const NavIcon = styled(Link)`
  margin-left: 2rem;
  font-size: 2rem;
  height: 80px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const SidebarNav = styled.nav`
  background: #112F4B;
  width: 250px; 
  height: 100vh;
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  transition: 350ms;
  z-index: 10;
`;

const SidebarWrap = styled.div`
  width: 100%;
`;

interface Notification {
  id: number;
  employee_id: {
    first_name: string;
  };
  message: string;
  status: string;
}

const formatDate = (dateString: string): string => {
  if (dateString === "-") return "-";
  const options: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleString(undefined, options);
};

const AdminSidebar: React.FC = () => {
  const { firstName } = useSelector((state: RootState) => state.auth);
  const axiosInstance = useAxios();
  const [showUpdateModal, setShowUpdateModal] = useState<boolean>(false);
  const [notificationData, setNotification] = useState<Notification[]>([]);
  const { navTitle } = useSelector((state: RootState) => state.auth);

  const handleNotification = () => {
    axiosInstance.patch('notification/')
      .then(() => setShowUpdateModal(true))
      .catch(error => console.error("Error updating notifications:", error));
  };

  useEffect(() => {
    axiosInstance.get('notification/')
      .then((res) => {
        setNotification(res.data);
        console.log("I got all the notification as ", res.data);
      })
      .catch(error => console.error("Error fetching notifications:", error));
  }, [axiosInstance]);

  return (
    <>
      <IconContext.Provider value={{ color: '#FFFFFF' }}>
        <header>
          <Nav>
            <div className="navbar">
              <h1>{navTitle}</h1>
              <img src={notificationImage} onClick={handleNotification} width="40px" alt="Notification Icon" />
              <p>{notificationData.length > 0 && notificationData[0].total_notification}</p>
              <Link to="#home">News</Link>
              <Link to="#news">Calendar</Link>
              <div className="dropdown">
                <button className="dropbtn">{firstName}
                  <i className="fa fa-caret-down"></i>
                </button>
                <div className="dropdown-content">
                  <Link to="/dashboard/profile">Profile</Link>
                  <Link to="/dashboard/change-password">Change Password</Link>
                  <Link to="/dashboard/logout">Logout</Link>
                </div>
              </div>
            </div>
          </Nav>
          <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Notifications</Modal.Title>
            </Modal.Header>
            <Modal.Body className="modal-body">
              {notificationData.length > 0 ? (notificationData.map((notification) => (
                <div key={notification.id}>
                  <pre>{notification.employee_id.first_name} {notification.message} {formatDate(notification.status)}</pre>
                </div>
              ))) : <h2>Notification Not Found</h2>}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowUpdateModal(false)}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </header>
        <SidebarNav>
          <SidebarWrap>
            <NavIcon to='#'>
              <img src={logo} alt="Logo" width={60} />
              <h3 style={{ color: "#FFFFFF" }}>eSparkBiz</h3>
            </NavIcon>
            {AdminSidebarData.map((item, index) => (
              <AdminSubMenu item={item} key={index} />
            ))}
          </SidebarWrap>
        </SidebarNav>
      </IconContext.Provider>
    </>
  );
};

export default AdminSidebar;
