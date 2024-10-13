import { Outlet } from "react-router-dom";
import Navbar from "../Navbar";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Layout() {
    return (
        <>
            <Navbar>
            <ToastContainer />
                <Outlet />
            </Navbar>
        </>
    )
}

export default Layout