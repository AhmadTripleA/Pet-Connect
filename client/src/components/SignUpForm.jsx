import React, { useEffect, useState } from 'react'
import axios from 'axios';

function SignUpForm() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phoneNumber: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://86.108.32.149:54941/users/register', formData);
            console.log(response.data);
            // Add your logic after successful registration
        } catch (error) {
            console.error(error.response.data);
            // Handle error here
        }
    };

    return (
        <>

        </>
    );
};

export default SignUpForm;