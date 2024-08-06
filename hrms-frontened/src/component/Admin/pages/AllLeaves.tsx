import React from "react";
import { useDispatch } from "react-redux";
import { navbarTitle } from "../../../reducers/authReducer";
import { useEffect , useState } from "react";
import useAxios from "../../../hooks/useAxios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Button } from "react-bootstrap";
import { Pagination } from "../../../hooks/usePaginationRange";
interface LeaveDataFormat{
  first_name : string
  last_name : string
  type : string
  date : string
  leave_day_type : string
  status : string
}
const AllLeaves : React.FC= () => {
 
  const [leaveData,setLeaveData] = useState<LeaveDataFormat[]>([])
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [requestStatus,setRequestStatus] = useState<string>("")
  const [startDate,setStartDate] = useState<string>("")
  const [endDate,setEndDate]= useState<string>("")
  const [name,setName] = useState<string>("")
  const rowsPerPage =5;
   function myFunction() {
    const startDateElement = document.getElementById("startDate") as HTMLInputElement | null;
    const endDateElement = document.getElementById("endDate") as HTMLInputElement | null;
    if (startDateElement && endDateElement) {
      const startDate = startDateElement.value;
      const endDate = endDateElement.value;

      if (startDate && endDate) {
        setStartDate(startDate);
        setEndDate(endDate);
        setCurrentPage(1);
      }
    }    
  }   

 
  // function myFunction() {
  //   let  startDate =  document.getElementById("startDate").value ;
  //   let  endDate = document.getElementById("endDate").value ;
  //   if (startDate && endDate){
  //     setStartDate(startDate)
  //     setEndDate(endDate)
  //     setCurrentPage(1)
  //   }    
  // }  
  const handleNameChange=(event : any)=>{
    setName(event.target.value)
}
  const handlePageChange = (page : number)=>{
    setCurrentPage(page)
   }
  
   const handleInputChange=(event : React.ChangeEvent<HTMLSelectElement>)=>{
    setRequestStatus(event.target.value)
    setCurrentPage(1)
  }
 
  const axiosInstance  =  useAxios();

  function fetchLeaveData(page : number,status : string ,start_date : string ,end_date : string,name : string){
    axiosInstance.get(`all-leaves/`,{     
      params :{
           page,
           status,
           start_date,
           end_date,     
           name     
      }   
    }).then((res)=>{
      console.log("these is my result",res.data)
      setLeaveData(res.data["results"]);
      if (res.data.count === 0){
        setTotalPages(1);
      }
      else{
      setTotalPages(Math.ceil(res.data.count / rowsPerPage));
      }
    })  
  
 }
 useEffect(()=>{
  fetchLeaveData(currentPage,requestStatus,startDate,endDate,name)
},[currentPage,requestStatus,startDate,endDate,name])
  return (
    <>
    <div style={{ marginLeft: "250px" }}>  
    <Button style={{float:`left`}}>
    <input type="text" onChange={handleNameChange} placeholder='Filter With Name'></input>
    </Button>
    <div style={{float:`right`}}>
        <Button>
        <input type="date" id="startDate" onChange={myFunction}></input>
        </Button>
        <Button>
            <input type="date" id="endDate" onChange={myFunction}></input>
        </Button>
        
    </div>
    
    
      <select className="form-select form-select mb-3" aria-label=".form-select-lg example"
                 id="statusDropDown"  onChange={handleInputChange}>
                      <option selected value="">Select Status</option>
                      <option value="Approved">Approved</option>
                      <option value="Pending">Pending</option>
                      <option value="Rejected">Rejected</option>
      </select>      
     
      <table className="table">
        <thead>
          <tr>
          <th scope="col">FirstName</th>
            <th scope="col">LastName</th>
            <th scope="col">Leave Type</th>
            <th scope="col">Date</th>
            <th scope="col">Leave Day Type</th>
            <th scope="col">Status</th>            
          </tr>
        </thead>
        <tbody>
          
        {leaveData.map((leave,index)=>((
        <tr key = {index}>
          <th scope="row">{leave.first_name}</th>   
          <th scope="row">{leave.last_name}</th>    
          <th scope="row">{leave.type}</th>
          
          <td>{leave.date}</td>
          <td>{leave.leave_day_type}</td>
          <td>{leave.status}</td>    
      </tr>)))}          
        </tbody>
      </table>
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
    </div>
    </>
  );
};

export default AllLeaves;
