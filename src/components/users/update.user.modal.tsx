import { useState, useEffect } from "react";
import {
    Modal,
    Input,
    notification,
    Form,
    Select,
    InputNumber,
    type FormProps,
} from "antd";
import { IUsers } from "./user.table";
interface IProps {
    access_token: string;
    getData: any;
    isUpdateModalOpen: boolean;
    setIsUpdateModalOpen: (v: boolean) => void;
    dataUpdate: null | IUsers;
    setDataUpdate: any;
}
const UpdateUserModal = (props: IProps) => {
    const {
        access_token,
        getData,
        isUpdateModalOpen,
        setIsUpdateModalOpen,
        dataUpdate,
        setDataUpdate,
    } = props;
    const { Option } = Select;
    const [form] = Form.useForm();

    useEffect(() => {
        if (dataUpdate) {
            form.setFieldsValue({
                name: dataUpdate.name,
                email: dataUpdate.email,
                age: dataUpdate.age,
                address: dataUpdate.address,
                role: dataUpdate.role,
                gender: dataUpdate.gender,
            });
        }
    }, [dataUpdate]);

    const handleCloseCreateModal = () => {
        setIsUpdateModalOpen(false);
        form.resetFields();
        setDataUpdate(null);
    };
    const onFinish: FormProps["onFinish"] = async (values) => {
        const { name, email, age, gender, role, address } = values;
        const data = {
            _id: dataUpdate?._id,
            name,
            email,
            age,
            gender,
            role,
            address,
        };
        const res = await fetch("http://localhost:8000/api/v1/users", {
            headers: {
                Authorization: `Bearer ${access_token}`,
                "Content-Type": "application/json",
            },
            method: "PATCH",
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
                title="Update a User"
                open={isUpdateModalOpen}
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
                                required: dataUpdate ? false : true,
                                message: "Please input your password!",
                            },
                        ]}
                    >
                        <Input.Password disabled={dataUpdate ? true : false} />
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
            </Modal>
        </>
    );
};
export default UpdateUserModal;
