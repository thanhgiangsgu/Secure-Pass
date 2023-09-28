import React from 'react'
import { NavLink } from 'react-router-dom'
import { BsSuitHeartFill } from 'react-icons/bs';
import { FaBars, FaTimes } from 'react-icons/fa'
import { useState } from 'react';
import './Navbar.css'

const Navbar = () => {
    const [show, setShow] = useState(false);
    const handleClick = () => {
        setShow((prevShow) => !prevShow)
        console.log(show);
    }
    return (
        <>
            <nav>
                <div>
                    <span style={{  }}>
                        <NavLink to='/' style={{display: 'flex', alignItems: 'center',textDecoration: 'none'}}>
                            <img style={{ width: '50px' }} src='image/logo.png' alt='Logo' />
                            <h1 style={{ color: '#fff' }}>SguPass</h1>
                        </NavLink>

                    </span>
                </div>
                <div>
                    <ul id="navbar" className={`navbar ${show ? 'active' : ''}`}>
                        <li><NavLink exact to='/warehouse'>Kho của tôi</NavLink></li>
                        <li><NavLink to='/share'>Chia sẻ</NavLink></li>
                        <li><NavLink to='/tools'>Công cụ</NavLink></li>
                        <li><NavLink to='/report'>Báo cáo</NavLink></li>
                        <li><NavLink to='/contact'>Liên hệ</NavLink></li>
                        <li><NavLink to='/login'>Đăng nhập</NavLink></li>
                    </ul>
                </div>
                <div id='mobile'>
                    {show ? (
                        <FaTimes className='icon-navbar navbar active' onClick={handleClick} />
                    ) : (
                        <FaBars className='icon-navbar navbar' onClick={handleClick} />
                    )}
                </div>
            </nav>
        </>
    )
}

export default Navbar