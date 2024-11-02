// import React, { useEffect, useState } from 'react';
// import Navbar from './Navbar';
// import './styles/dashboard.css';
// import Leaderboard from './Leaderboard';
// import EditIcon from '@mui/icons-material/Edit';
// import CheckIcon from '@mui/icons-material/Check';
// import axios from 'axios';
// import { toast } from 'react-toastify';
// function Dashboard() {
//   const [editableField, setEditableField] = useState(null);
//   const [fieldValues, setFieldValues] = useState({
//     CC_ID: 'Please Set!',
//     LC_ID: 'Please Set!',
//     CF_ID: 'Please Set!',
//     linkedin: 'Please Set!',
//     instagram: 'Please Set!',
//   });

//   const [tempValue, setTempValue] = useState('');
//   const [userInfo, setUserInfo] = useState({
//     username: 'Unknown',
//     ddsa_rank: 'Unranked'
//   });

//   const handleEditClick = (field) => {
//     if (editableField === field) {
//       setEditableField(null);
//       setTempValue('');
//     } else {
//       setEditableField(field);
//       setTempValue(fieldValues[field]);
//     }
//   };

//   const handleSaveClick = async (field) => {
//     try {
//       await axios.put(
//         'https://seven5daysdsa-1.onrender.com/api/user',
//         { field, data: tempValue },
//         { withCredentials: true }
//       );

//       // Update field value on successful save
//       setFieldValues((prev) => ({
//         ...prev,
//         [field]: tempValue,
//       }));
//       setEditableField(null);
//       setTempValue('');
//     } catch (error) {
//       console.error("Error updating data:", error);
//     }
//   };

//   const handleInputChange = (event) => {
//     setTempValue(event.target.value);
//   };

//   // Fetch user data on component mount
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get('https://seven5daysdsa-1.onrender.com/api/user', { withCredentials: true });
//         setFieldValues({
//           CC_ID: response.data.CC_ID || 'Please Set!',
//           LC_ID: response.data.LC_ID || 'Please Set!',
//           CF_ID: response.data.CF_ID || 'Please Set!',
//           linkedin: response.data.linkedin || 'Please Set!',
//           instagram: response.data.instagram || 'Please Set!',
//         });
//         setUserInfo({
//           username: response.data.username || 'Unknown',
//           ddsa_rank: response.data.ddsa_rank || 'Unranked',
//         });
//       } catch (error) {
//         toast.error("error in fetching data", { autoClose: 2000 });
//       }
//     };
//     fetchData();
//   }, []);

//   return (
//     <>
//       <Navbar />
//       <div className='body_dashboard'>
//         <Leaderboard />
//         <div className="account_container">
//           <table className='info_container'>
//             <tbody>
//               <tr>
//                 <td>DDSA Username:</td>
//                 <td>{userInfo.username}</td>
//                 <td>
//                   <img
//                     src='https://img.freepik.com/premium-photo/stylish-man-flat-vector-profile-picture-ai-generated_606187-310.jpg'
//                     alt="Profile"
//                   />
//                 </td>
//               </tr>
//               <tr>
//                 <td>DDSA Rank:</td>
//                 <td>{userInfo.ddsa_rank}</td>
//               </tr>
//               {[
//                 { label: 'CodeChef ID:', field: 'CC_ID' },
//                 { label: 'LeetCode ID:', field: 'LC_ID' },
//                 { label: 'CodeForces ID:', field: 'CF_ID' },
//                 { label: 'LinkedIn Link:', field: 'linkedin' },
//                 { label: 'Instagram Link:', field: 'instagram' },
//               ].map(({ label, field }) => (
//                 <tr key={field}>
//                   <td>{label}</td>
//                   <td>
//                     <input
//                       type="text"
//                       value={editableField === field ? tempValue : fieldValues[field]}
//                       onChange={handleInputChange}
//                       readOnly={editableField !== field}
//                       className={editableField === field ? 'editable-border' : ''}
//                     />
//                   </td>
//                   <td>
//                     {editableField === field ? (
//                       <CheckIcon onClick={() => handleSaveClick(field)} />
//                     ) : (
//                       <EditIcon onClick={() => handleEditClick(field)} />
//                     )}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </>
//   );
// }

// export default Dashboard;
import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import './styles/dashboard.css';
import Leaderboard from './Leaderboard';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import axios from 'axios';
import { toast } from 'react-toastify';

function Dashboard() {
  const [isEditing, setIsEditing] = useState(false);
  const [fieldValues, setFieldValues] = useState({
    CC_ID: 'Please Set!',
    LC_ID: 'Please Set!',
    CF_ID: 'Please Set!',
    linkedin: 'Please Set!',
    instagram: 'Please Set!',
  });

  const [tempValues, setTempValues] = useState({
    CC_ID: '',
    LC_ID: '',
    CF_ID: '',
    linkedin: '',
    instagram: '',
  });

  const [userInfo, setUserInfo] = useState({
    username: 'Unknown',
    ddsa_rank: 'Unranked'
  });

  const handleEditClick = () => {
    if (isEditing) {
      // Reset temp values to current field values when exiting edit mode
      setTempValues(fieldValues);
    } else {
      // Enter edit mode and set temp values
      setTempValues(fieldValues);
    }
    setIsEditing(!isEditing);
  };

  const handleUpdateClick = async () => {
    try {
      const result=await axios.put(
        'https://seven5daysdsa-1.onrender.com/api/user',
        tempValues,
        { withCredentials: true }
      );
      
      setIsEditing(false);
      if(result.data.status){
        setFieldValues(tempValues);
        toast.success(`${result.data.value}`, { autoClose: 2000 });
      }else{
        toast.error(`${result.data.value}`, { autoClose: 2000 });
      }
      // Update field values on successful save
      
      // toast.success("Data updated successfully", { autoClose: 2000 });
    } catch (error) {
      console.error("Error updating data:", error);
      toast.error(`${error}`, { autoClose: 2000 });
    }
  };

  const handleInputChange = (event) => {
    setTempValues((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  // Fetch user data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://seven5daysdsa-1.onrender.com/api/user', { withCredentials: true });
        setFieldValues({
          CC_ID: response.data.CC_ID || 'Please Set!',
          LC_ID: response.data.LC_ID || 'Please Set!',
          CF_ID: response.data.CF_ID || 'Please Set!',
          linkedin: response.data.linkedin || 'Please Set!',
          instagram: response.data.instagram || 'Please Set!',
        });
        setTempValues({
          CC_ID: response.data.CC_ID || '',
          LC_ID: response.data.LC_ID || '',
          CF_ID: response.data.CF_ID || '',
          linkedin: response.data.linkedin || '',
          instagram: response.data.instagram || '',
        });
        setUserInfo({
          username: response.data.username || 'Unknown',
          ddsa_rank: response.data.ddsa_rank || 'Unranked',
        });
      } catch (error) {
        toast.error("Error in fetching data", { autoClose: 2000 });
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <Navbar />
      <div className='body_dashboard'>
        <Leaderboard />
        <div className="account_container">
          <table className='info_container'>
            <tbody>
              <tr>
                <td>DDSA Username:</td>
                <td>{userInfo.username}</td>
                <td>
                  <img
                    src='https://img.freepik.com/premium-photo/stylish-man-flat-vector-profile-picture-ai-generated_606187-310.jpg'
                    alt="Profile"
                  />
                </td>
              </tr>
              <tr>
                <td>DDSA Rank:</td>
                <td>{userInfo.ddsa_rank}</td>
              </tr>
              {[
                { label: 'CodeChef ID:', field: 'CC_ID' },
                { label: 'LeetCode ID:', field: 'LC_ID' },
                { label: 'CodeForces ID:', field: 'CF_ID' },
                { label: 'LinkedIn Link:', field: 'linkedin' },
                { label: 'Instagram Link:', field: 'instagram' },
              ].map(({ label, field }) => (
                <tr key={field}>
                  <td>{label}</td>
                  <td>
                    <input
                      type="text"
                      name={field}
                      value={isEditing ? tempValues[field] : fieldValues[field]}
                      onChange={handleInputChange}
                      readOnly={!isEditing}
                      className={isEditing ? 'editable-border' : ''}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={isEditing ? handleUpdateClick : handleEditClick}>
            {isEditing ? 'Update' : 'Edit'}
          </button>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
