import { Layout, Menu } from "antd";
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import ThemeToggle from "../components/common/ThemeToggle";

const { Header, Content, Footer } = Layout;

const AppLayout = ({ children }: { children: React.ReactNode }) => {
    const location = useLocation();
    const [videoId] = useState("123"); // Static for now, can be dynamic later

    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Header>
                <Menu
                    theme="dark"
                    mode="horizontal"
                    selectedKeys={[location.pathname]} // Keeps menu item active
                    style={{ display: "flex", justifyContent: "space-between" }}
                >
                    <div style={{ display: "flex", gap: "10px" }}>
                        <Menu.Item key="/">
                            <Link to="/">Home</Link>
                        </Menu.Item>
                        <Menu.Item key="/explore">
                            <Link to="/explore">Explore</Link>
                        </Menu.Item>
                        <Menu.Item key="/dashboard">
                            <Link to="/dashboard">Dashboard</Link>
                        </Menu.Item>
                        <Menu.Item key="/profile">
                            <Link to="/profile">Profile</Link>
                        </Menu.Item>
                        <Menu.Item key="/my-playlists">
                            <Link to="/my-playlists">My Playlists</Link>
                        </Menu.Item>
                        <Menu.Item key="/tweet">
                            <Link to="/tweet">Tweet</Link>
                        </Menu.Item>
                        <Menu.Item key={`/watch/${videoId}`}>
                            <Link to={`/watch/${videoId}`}>Watch</Link>
                        </Menu.Item>
                    </div>
                    <div style={{ display: "flex", gap: "10px" }}>
                        <Menu.Item key="/login">
                            <Link to="/login">Login</Link>
                        </Menu.Item>
                        <Menu.Item key="/register">
                            <Link to="/register">Register</Link>
                        </Menu.Item>
                        <Menu.Item key="theme-toggle">
                            <ThemeToggle />
                        </Menu.Item>
                    </div>
                </Menu>
            </Header>
            <Content style={{ padding: "20px" }}>{children}</Content>
            <Footer style={{ textAlign: "center" }}>FullStack Basics ©2025</Footer>
        </Layout>
    );
};

export default AppLayout;
