import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const ChangePassword = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const userId = localStorage.getItem('userId');
    useEffect(() => {
        if (!userId) {
            navigate('/login');
        }
    }, [navigate,userId]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.newPassword !== formData.confirmPassword) {
            toast.error("Both passwords do not match!")
            return;
        }

        try {
            const response = await fetch(`http://127.0.0.1:8000/api/change_password/${userId}/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    oldPassword: formData.oldPassword,
                    newPassword: formData.newPassword,
                })
            });

            console.log("Status:", response.status);

            const data = await response.json();
            console.log("Response:", data);


            if (response.status === 200) {
                toast.success('Password chaged successfully!');
                setFormData({ oldPassword: '', newPassword: '', confirmPassword: '' })
            } else {
                toast.error(data.message);
            }
        }
        catch (error) {
            console.error('Error:', error);
            toast.error('Something went wrong. Try again!');
        }
    };
    return (
        <div className='container-fluid pt-5' style={{ background: 'linear-gradient(135deg, #EAF4FF, #CFE8FF)', minHeight: '100vh' }} >
            <div className='text-center mb-4'>
                <h2><i className='fas fa-key me-2'></i> Change Password</h2>
                <p className='text-muted'>
                    Secure your account with a new password
                </p>
            </div>
            <form className='p-4 rounded shadow mx-auto' style={{ maxWidth: '400px' }} onSubmit={handleSubmit}>
                {/* old password */}
                <div className='mb-3'>
                    <label className='form label'>Old Password</label>
                    <div className='input-group'>
                        <span className='input-group-text'>
                            <i className='fas fa-lock'>

                            </i>
                        </span>
                        <input type='password' name="oldPassword" value={formData.oldPassword} className='form-control' onChange={handleChange} required placeholder="Enter your Old Password" />
                    </div>

                </div>
                {/* new password */}
                <div className='mb-3'>
                    <label className='form label'>New Password</label>
                    <div className='input-group'>
                        <span className='input-group-text'>
                            <i className='fas fa-lock-open'>

                            </i>
                        </span>
                        <input type='password' name="newPassword" value={formData.newPassword} className='form-control' onChange={handleChange} required placeholder="Enter your New Password" />
                    </div>

                </div>

                {/* confirm password */}
                <div className='mb-3'>
                    <label className='form label'> Confirm Password</label>
                    <div className='input-group'>
                        <span className='input-group-text'>
                            <i className='fas fa-lock-open'>

                            </i>
                        </span>
                        <input type='password' name="confirmPassword" value={formData.confirmPassword} className='form-control' onChange={handleChange} required placeholder="Confirm New Password" />
                    </div>

                </div>
                {/* button */}
                <button type='submit' className='btn btn-primary w-100 mt-3' >
                    <i className='fas fa-key me-2'>

                    </i>
                    Change Password
                </button>
            </form>
            <ToastContainer />
        </div>
    )
}

export default ChangePassword