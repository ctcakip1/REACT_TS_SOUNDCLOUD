import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
// import "./index.css";
import "./App.scss";
import {
    createBrowserRouter,
    Outlet,
    RouterProvider,
    Link,
} from "react-router-dom";
import UsersPage from "./screens/users.page.tsx";
import { FireOutlined, SmileOutlined, SpotifyOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Menu } from "antd";
import TracksPage from "./screens/tracks.page.tsx";
const items: MenuProps["items"] = [
    {
        label: <Link to={"/"}>Home</Link>,
        key: "home",
        icon: <FireOutlined />,
    },
    {
        label: <Link to={"/users"}>Manage Users</Link>,
        key: "users",
        icon: <SmileOutlined />,
    },
    {
        label: <Link to={"/tracks"}>Manage Tracks</Link>,
        key: "tracks",
        icon: <SpotifyOutlined />,
    },
];
const LayoutAdmin = () => {
    const getData = async () => {
        const res = await fetch("http://localhost:8000/api/v1/auth/login", {
            headers: {
                "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify({
                username: "admin@gmail.com",
                password: "123456",
            }),
        });
        const d = await res.json();
        if (d.data) {
            localStorage.setItem("access_token", d.data.access_token);
        }
    };
    useEffect(() => {
        getData();
    }, []);
    return (
        <div>
            <Header />
            <Outlet />
        </div>
    );
};
const Header: React.FC = () => {
    const [current, setCurrent] = useState("home");

    const onClick: MenuProps["onClick"] = (e) => {
        setCurrent(e.key);
    };

    return (
        <Menu
            onClick={onClick}
            selectedKeys={[current]}
            mode="horizontal"
            items={items}
        />
    );
};
const router = createBrowserRouter([
    {
        path: "/",
        element: <LayoutAdmin />,

        children: [
            { index: true, element: <App /> },
            {
                path: "users",
                element: <UsersPage />,
            },
            {
                path: "tracks",
                element: <TracksPage />,
            },
        ],
    },
    {
        path: "/tracks",
        element: <div>Manage Tracks</div>,
    },
]);
ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        {/* <App /> */}
        <RouterProvider router={router} />
    </React.StrictMode>
);
