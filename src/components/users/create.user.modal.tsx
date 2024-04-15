import { useState } from "react";
import {
    Modal,
    Input,
    notification,
    Button,
    Checkbox,
    Form,
    type FormProps,
    Select,
    InputNumber,
} from "antd";
interface IProps {
    access_token: string;
    getData: any;
    isCreateModalOpen: boolean;
    setIsCreateModalOpen: (v: boolean) => void;
}
const CreateUserModal = (props: IProps) => {
    const { access_token, getData, isCreateModalOpen, setIsCreateModalOpen } =
        props;
    const { Option } = Select;
    const [form] = Form.useForm();

    const handleCloseCreateModal = () => {
        form.resetFields();
        setIsCreateModalOpen(false);
    };
    const onFinish: FormProps["onFinish"] = async (values) => {
        const { name, email, password, age, gender, role, address } = values;
        const data = { name, email, password, age, gender, role, address };
        const res = await fetch("http://localhost:8000/api/v1/users", {
            headers: {
                Authorization: `Bearer ${access_token}`,
                "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify(data),
        });
        const d = await res.json();
        if (d.data) {
            //success
            await getData();
            notification.success({
                message: JSON.stringify(d.message),
            });
            handleCloseCreateModal();
        } else {
            //
            notification.error({
                message: JSON.stringify(d.message),
                description: "Có lỗi xảy ra",
            });
        }
    };
    return (
        <>
            <Modal
                title="Add New User"
                open={isCreateModalOpen}
                onOk={() => {
                    form.submit();
                }}
                onCancel={() => {
                    handleCloseCreateModal();
                }}
                maskClosable={false}
            >
                <Form
                    name="basic"
                    onFinish={onFinish}
                    layout="vertical"
                    form={form}
                >
                    <Form.Item
                        style={{ marginBottom: "5px" }}
                        label="Name"
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: "Please input your name!",
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        style={{ marginBottom: "5px" }}
                        label="Email"
                        name="email"
                        rules={[
                            {
                                required: true,
                                message: "Please input your email!",
                            },
                        ]}
                    >
                        <Input type="email" />
                    </Form.Item>
                    <Form.Item
                        style={{ marginBottom: "5px" }}
                        label="Password"
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: "Please input your password!",
                            },
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item
                        style={{ marginBottom: "5px" }}
                        label="Age"
                        name="age"
                        rules={[
                            {
                                required: true,
                                message: "Please input your age!",
                            },
                        ]}
                    >
                        <InputNumber style={{ width: "100%" }} />
                    </Form.Item>
                    <Form.Item
                        style={{ marginBottom: "5px" }}
                        label="Address"
                        name="address"
                        rules={[
                            {
                                required: true,
                                message: "Please input your address!",
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        style={{ marginBottom: "5px" }}
                        name="gender"
                        label="Gender"
                        rules={[{ required: true }]}
                    >
                        <Select
                            placeholder="Select a option and change input text above"
                            // onChange={onGenderChange}
                            allowClear
                        >
                            <Option value="male">male</Option>
                            <Option value="female">female</Option>
                            <Option value="other">other</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        style={{ marginBottom: "5px" }}
                        name="role"
                        label="Role"
                        rules={[{ required: true }]}
                    >
                        <Select
                            placeholder="Select a option and change input text above"
                            // onChange={onRoleChange}
                            allowClear
                        >
                            <Option value="male">ADMIN</Option>
                            <Option value="female">USER</Option>
                        </Select>
                    </Form.Item>
                </Form>
                {/* <div>
                    <label>Name:</label>
                    <Input
                        value={name}
                        onChange={(e) => {
                            setName(e.target.value);
                        }}
                    />
                </div>
                <div>
                    <label>Email:</label>
                    <Input
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                        }}
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <Input
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                        }}
                    />
                </div>
                <div>
                    <label>Age:</label>
                    <Input
                        value={age}
                        onChange={(e) => {
                            setAge(e.target.value);
                        }}
                    />
                </div>
                <div>
                    <label>Gender:</label>
                    <Input
                        value={gender}
                        onChange={(e) => {
                            setGender(e.target.value);
                        }}
                    />
                </div>
                <div>
                    <label>Address:</label>
                    <Input
                        value={address}
                        onChange={(e) => {
                            setAddress(e.target.value);
                        }}
                    />
                </div>
                <div>
                    <label>Role:</label>
                    <Input
                        value={role}
                        onChange={(e) => {
                            setRole(e.target.value);
                        }}
                    />
                </div> */}
            </Modal>
        </>
    );
};
export default CreateUserModal;
