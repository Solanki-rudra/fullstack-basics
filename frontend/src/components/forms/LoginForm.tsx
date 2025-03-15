import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { loginUser } from "../../api/auth";


const LoginForm: React.FC = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState<boolean>(false);

    const onFinish = async (values: { email: string; password: string }) => {
        form.setFields([
            { name: "email", errors: [] },
            { name: "password", errors: [] },
        ]);

        try {
            setLoading(true);
            const response = await loginUser(values);
            message.success("Login successful!");
            console.log("Login Response:", response);
        } catch (error: any) {
            if (error.message.includes("Email is not available")) {
                form.setFields([{ name: "email", errors: ["Email not found, please register!"] }]);
            } else if (error.message.includes("Incorrect password")) {
                form.setFields([{ name: "password", errors: ["Wrong password!"] }]);
            } else {
                message.error(error.message || "Login failed");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form form={form} layout="vertical" onFinish={onFinish}>
            <Form.Item
                label="Email"
                name="email"
                rules={[
                    { required: true, message: "Please enter your email!" },
                    { type: "email", message: "Invalid email!" },
                ]}
            >
                <Input placeholder="Enter email" />
            </Form.Item>

            <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true, message: "Please enter your password!" }]}
            >
                <Input.Password placeholder="Enter password" />
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit" block loading={loading}>
                    Login
                </Button>
            </Form.Item>
        </Form>
    );
};

export default LoginForm;
