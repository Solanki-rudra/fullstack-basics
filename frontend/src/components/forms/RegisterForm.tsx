import React, { useState } from "react";
import { Form, Input, Button, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { RegisterFormValues } from "../../types/auth";
import { registerUser } from "../../api/auth";

const RegisterForm: React.FC = () => {
    const [form] = Form.useForm();
    const [avatar, setAvatarFile] = useState<File | null>(null);
    const [coverImage, setCoverImageFile] = useState<File | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const handleFileChange = (info: any, setFile: React.Dispatch<React.SetStateAction<File | null>>) => {
        if (info.file) {
            setFile(info.file);
        }
    };

    const onFinish = async (values: RegisterFormValues) => {
        form.setFields([
            { name: "username", errors: [] },
            { name: "email", errors: [] },
        ]);

        if (!avatar) {
            form.setFields([{ name: "avatar", errors: ["Avatar is required!"] }]);
            return;
        }

        const formData = new FormData();
        formData.append("username", values.username);
        formData.append("email", values.email);
        formData.append("fullName", values.fullName);
        formData.append("password", values.password);
        formData.append("avatar", avatar);
        if (coverImage) formData.append("coverImage", coverImage);

        try {
            setLoading(true);
            await registerUser(formData);
            message.success("Registration successful!");
            form.resetFields();
            setAvatarFile(null);
            setCoverImageFile(null);
        } catch (error: any) {
            if (error.message.includes("username already exists")) {
                form.setFields([{ name: "username", errors: ["Username is already taken!"] }]);
            } else if (error.message.includes("email already exists")) {
                form.setFields([{ name: "email", errors: ["Email is already in use!"] }]);
            } else {
                message.error(error.message || "Registration failed");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form form={form} layout="vertical" onFinish={onFinish}>
            <Form.Item label="Username" name="username" rules={[{ required: true, message: "Please enter your username!" }]}>
                <Input placeholder="Enter username" />
            </Form.Item>

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

            <Form.Item label="Full Name" name="fullName" rules={[{ required: true, message: "Please enter your full name!" }]}>
                <Input placeholder="Enter full name" />
            </Form.Item>

            <Form.Item label="Password" name="password" rules={[{ required: true, message: "Please enter your password!" }]}>
                <Input.Password placeholder="Enter password" />
            </Form.Item>

            <Form.Item label="Avatar (Profile Picture)" name="avatar" rules={[{ required: true, message: "Avatar is required!" }]}>
                <Upload maxCount={1} beforeUpload={() => false} onChange={(info) => handleFileChange(info, setAvatarFile)} listType="picture">
                    <Button icon={<UploadOutlined />}>Upload Avatar</Button>
                </Upload>
            </Form.Item>

            <Form.Item label="Cover Image (Cover Image)">
                <Upload beforeUpload={() => false} onChange={(info) => handleFileChange(info, setCoverImageFile)} listType="picture">
                    <Button icon={<UploadOutlined />}>Upload Cover Image</Button>
                </Upload>
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit" block loading={loading}>
                    Register
                </Button>
            </Form.Item>
        </Form>
    );
};

export default RegisterForm;
