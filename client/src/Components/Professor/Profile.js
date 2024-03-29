import { Button, Input, Spacer, Textarea } from "@nextui-org/react";
import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import ReactDropdown from "react-dropdown"
// import  {Multiselect} from "multiselect-react-dropdown"
import { MultiSelect } from "react-multi-select-component";
import { fetchUserType } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import {
  auth
} from "../../firebase";
import axios from "axios";
import rvce from "../../assets/styles/download-removebg-preview.png";
import ProfessorNavbar from "./Navbar";

/*
TODO:
1. Improve UI
2. Add  Dept
3. professor Papers Input 
4. professor expertice Input
5. Enter Verification for Each
6. Replace document.forms[0] by some common variable
*/

export default function Profile(props) {
  const [user, loading, error] = useAuthState(auth);
  const [profile,setProfile]=useState({})
  const navigate = useNavigate();
  const [isEditable,setIsEditable]=useState(false)
  const [dept,setDept]=useState("")
  const [errorMessage,setErrorMessage]=useState("")
  const [userType,setUserType]=useState("")
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [multiSelectSkills,setMultiSelectSkills] = useState([]);
  const departmentNames = ["AS", "ISE", "CSE", "ECE", "ETE", "ME", "CV"];
  const updateUser = async (event) => {
    setErrorMessage("")
    event.preventDefault();
    let email;
    if (props && props.email) email = props.email;
    else email = user.email;
    const data = {
      firstName: document.forms[0].firstName.value,
      lastName: document.forms[0].lastName.value,
      middleName: document.forms[0].middleName.value,
      yearOfJoining: document.forms[0].yearOfJoining.value,
      skills:selectedSkills.map((skill)=>skill.value),
      email: email,
      deptName: dept,
    };
    if(!data.firstName||!data.lastName||!data.email||!data.yearOfJoining||!data.deptName){
        setErrorMessage("Enter All Values")
        return
      }
      if(!(/^[a-z ,.'-]+$/i).test(data.firstName)||!(/^[a-z ,.'-]*$/i).test(data.middleName)||!(/^[a-z ,.'-]+$/i).test(data.lastName))
      {
        setErrorMessage("Name Shouldn't Contain Invalid Characters")
        return
      }
    let res = await axios.post("/professor/update_user", { data: data });
    if(res.data.success)setIsEditable(false)
  };
  const checkUserSignup = async () => {
    let resUserType=await fetchUserType(user.email)
    setUserType(resUserType)
    const data = {
      email: user.email,
    };
    const res = await axios.post("/professor/is_signup", { data: data });
    let isSignup = res.data.isSignup;
    if (resUserType === "Student")
    return navigate("/student/dashboard");
    else if(resUserType==="Admin")navigate("/admin/dashboard");
    if (!isSignup && resUserType=== "Student")
      return navigate("/student/signup");
    if (!isSignup && resUserType === "Professor")
      return navigate("/professor/signup");
  };
  const getUser = async () => {
    const data = {
      email: user.email,
    };
    const res = await axios.post("/professor/get_user", { data: data });
    setProfile(res.data.user);
    setDept(res.data.user.deptName)
    setSelectedSkills(res.data.user.skills)
    let skills=[...multiSelectSkills,...res.data.user.skills]
    skills = skills.filter((value, index, self) =>
  index === self.findIndex((t) => (
    t.label === value.label
  ))
)
    setMultiSelectSkills(skills)
  };

  useEffect(() => {
    if (loading) return;
    if (!user ) return navigate("/login");
    checkUserSignup();
    getUser()
  }, [user, loading]);
  return (
    <div>
    <ProfessorNavbar user={profile} userType={userType}/>
    {(profile!==null)?
      <div className="flex flex-col items-center min-h-screen pt-6 sm:justify-center sm:pt-0 bg-neutral-100">
        <div className="w-full px-10 pt-6 pb-10 mt-6 overflow-hidden bg-white shadow-md sm:max-w-lg sm:rounded-lg">
          <form>
            <div>
              <div className="flex flex-col items-center mb-10">
                <img src={rvce} className="h-24 bg-white" />
                {/* <h3 className="text-4xl font-bold text-purple-600">Logo</h3> */}
              </div>
            </div>
            <div>
              <div className="flex flex-col items-start ">
                <input
                  type="text"
                  placeholder="First Name"
                  name="firstName"
                  defaultValue={profile.firstName}
                //   onChangeCapture={(event)=>{
                //     profile.firstName=event.target.value
                //     setProfile(profile)
                //   }}
                  disabled={!isEditable}
                  className="block w-full mt-1 border-gray-300 px-2 py-2 border-2 rounded-md  shadow-sm focus:border-blue-300 "
                />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex flex-col items-start ">
                <input
                  type="textarea"
                  placeholder="Middle Name"
                  name="middleName"
                  defaultValue={profile.middleName}
                  disabled={!isEditable}
                  className="block w-full mt-1 border-gray-300 px-2 py-2 border-2 rounded-md  shadow-sm focus:border-blue-300 "
                />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex flex-col items-start ">
                <input
                  type="textarea"
                  placeholder="Last Name"
                  name="lastName"
                  defaultValue={profile.lastName}
                  disabled={!isEditable}
                  className="block w-full mt-1 border-gray-300 px-2 py-2 border-2 rounded-md  shadow-sm focus:border-blue-300 "
                />
              </div>
            </div>

            <div className="mt-4">
              <div className="flex flex-col items-start ">
                <input
                  type="number"
                  placeholder="Year of Joining"
                  name="yearOfJoining"
                  defaultValue={profile.yearOfJoining}
                  disabled={!isEditable}
                  className="block w-full mt-1 border-gray-300 px-2 py-2 border-2 rounded-md  shadow-sm focus:border-blue-300 "
                />
              </div>
            </div>
            <MultiSelect
                className="mt-5"
            options={multiSelectSkills}
            value={selectedSkills}
            onChange={setSelectedSkills}
            placeholder="Fields Of Expertise"
            disabled={!isEditable}
            isCreatable={true}
            onCreateOption={newSkill=>({label:newSkill,value:newSkill})}
          />
            <ReactDropdown
              options={departmentNames}
              className=" flex w-full h-40 px-2 py-2 mt-4"
              placeholder="Choose Department"
              disabled={!isEditable}
              onChange={(event)=>setDept(event.value)}
              value={dept}
            >
              {" "}
            </ReactDropdown>




            <p className="text-center mx-4 mb-0 text-2xl font-light text-red-500">{errorMessage}</p>


            <div className="flex items-center mt-4">
            {(!isEditable)?
                <button
                onClickCapture={(event)=>{
                    event.preventDefault()
                    setIsEditable(true)}
                }
                className="w-full px-4 py-2.5 tracking-wide text-white transition-colors duration-200 transform bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:bg-blue-650"
              >
                Edit
              </button>
                :
              <button
                onClickCapture={updateUser}
                className="w-full px-4 py-2.5 tracking-wide text-white transition-colors duration-200 transform bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:bg-blue-650"
              >
               Update
              </button>
              
            }
            </div>
          </form>

          <div className="my-6 space-y-2"></div>
        </div>
      </div>
        :<div/>}
    </div>
  );
}
