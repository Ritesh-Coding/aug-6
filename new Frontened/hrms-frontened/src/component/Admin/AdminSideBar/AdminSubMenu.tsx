import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { IconType } from 'react-icons';

const SidebarLink = styled(Link)`
  display: flex;
  color: #FFFFFF;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  list-style: none;
  height: 60px;
  text-decoration: none;
  font-size: 18px;

  &:hover {
    background: #252831;
    border-left: 4px solid #632ce4;
    cursor: pointer;
  }
`;

const SidebarLabel = styled.span`
  margin-left: 16px;
`;

const DropdownLink = styled(Link)`
  background: #414757;
  height: 60px;
  padding-left: 3rem;
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #f5f5f5;
  font-size: 18px;

  &:hover {
    background: #632ce4;
    cursor: pointer;
  }
`;

interface SubNavItem {
  title: string;
  path: string;
  icon: IconType;
}

interface SidebarItem {
  title: string;
  path: string;
  icon: IconType;
  iconClosed?: IconType;
  iconOpened?: IconType;
  subNav?: SubNavItem[];
}

interface AdminSubMenuProps {
  item: SidebarItem;
}

const AdminSubMenu: React.FC<AdminSubMenuProps> = ({ item }) => {
  const [subnav, setSubnav] = useState(false);

  const showSubnav = () => setSubnav(!subnav);

  return (
    <>
      <SidebarLink to={item.path} onClick={item.subNav ? showSubnav : undefined}>
        <div>
          {React.createElement(item.icon)}
          <SidebarLabel>{item.title}</SidebarLabel>
        </div>
        <div>
          {subnav
            ? item.iconOpened && React.createElement(item.iconOpened)
            : item.subNav
            ? item.iconClosed && React.createElement(item.iconClosed)
            : null}
        </div>
      </SidebarLink>
      {subnav &&
        item.subNav?.map((subItem, index) => (
          <DropdownLink to={subItem.path} key={index}>
            {React.createElement(subItem.icon)}
            <SidebarLabel>{subItem.title}</SidebarLabel>
          </DropdownLink>
        ))}
    </>
  );
};

export default AdminSubMenu;
