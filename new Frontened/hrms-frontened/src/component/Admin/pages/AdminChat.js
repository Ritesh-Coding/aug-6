import React from 'react'
import EmployeeChat from '../../User/UI/EmployeeChat'
import { useSelector } from 'react-redux'
export const AdminChat = () => {
   const {userId} = useSelector(state=>state.auth)
  return (
    <div style={{marginLeft:`260px`}}>
            <EmployeeChat adminId="2" userId={userId}/>
    </div>
  )
}
