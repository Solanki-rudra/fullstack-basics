import React from "react";
import { Card } from "antd";
import RegisterForm from "../components/forms/RegisterForm";

const Register: React.FC = () => {
    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
            <Card title="Register" style={{ width: 400 }}>
                <RegisterForm />
            </Card>
        </div>
    );
};

export default Register;
