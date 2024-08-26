import { Button, message, notification, Popconfirm, Table, TableProps } from "antd";
import {
    DeleteOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
export interface ITracks {
    _id: string,
    title: string;
    description: string;
    category: string;
    trackUrl: string;
}
const TracksTable = () => {
    const [listTracks, setListTracks] = useState([])
    const [meta, setMeta] = useState({
        current: 1,
        pageSize: 5,
        pages: 0,
        total: 0,
    });
    const access_token = localStorage.getItem("access_token") as string;
    useEffect(() => {
        console.log("check useEffect");
        getData();
    }, []);
    const getData = async () => {
        const res = await fetch(
            `http://localhost:8000/api/v1/tracks?current=${meta.current}&pageSize=${meta.pageSize}`,
            {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                    "Content-Type": "application/json",
                },
            }
        );
        const d = await res.json();
        if (!d.data) {
            notification.error({
                message: JSON.stringify(d.message),
            });
        }
        setListTracks(d.data.result);
        setMeta({
            current: d.data.meta.current,
            pageSize: d.data.meta.pageSize,
            pages: d.data.meta.pages,
            total: d.data.meta.total,
        });
    };
    const confirm = async (track: ITracks) => {
        const res = await fetch(
            `http://localhost:8000/api/v1/tracks/${track._id}`,
            {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                    "Content-Type": "application/json",
                },
                method: "DELETE",
            }
        );
        const d = await res.json();
        if (d.data) {
            //success
            message.success("Delete Track Success");
            await getData();
        } else {
            //
            notification.error({
                message: JSON.stringify(d.message),
                description: "Có lỗi xảy ra",
            });
        }
    };
    const columns: TableProps<ITracks>["columns"] = [
        {
            title: "STT",
            dataIndex: "_id",
            render: (value, record, index) => {
                return (
                    <>
                        {((meta.current - 1) * meta.pageSize) + index + 1}
                    </>
                )
            }
        },
        {
            title: "Title",
            dataIndex: "title",
        },
        {
            title: "Description",
            dataIndex: "description",
        },
        {
            title: "Category",
            dataIndex: "category",
        },
        {
            title: "Track url",
            dataIndex: "trackUrl",
        },
        {
            title: "Uploader",
            dataIndex: ["uploader", "name"],
        },
        {
            title: "Action",
            render: (value, record) => {
                return (
                    <div>
                        <Popconfirm
                            title="Delete the user"
                            description={`Are you sure to delete this track. name = ${record.title}?`}
                            onConfirm={() => confirm(record)}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button
                                danger
                                style={{ marginLeft: "20px" }}
                                icon={<DeleteOutlined />}
                            >
                                Delete
                            </Button>
                        </Popconfirm>
                    </div>
                );
            },
        },
    ];
    const handleOnChange = async (page: number, pageSize: number) => {
        const res = await fetch(
            `http://localhost:8000/api/v1/tracks?current=${page}&pageSize=${pageSize}`,
            {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                    "Content-Type": "application/json",
                },
            }
        );
        const d = await res.json();
        if (!d.data) {
            notification.error({
                message: JSON.stringify(d.message),
            });
        }
        setListTracks(d.data.result);
        setMeta({
            current: d.data.meta.current,
            pageSize: d.data.meta.pageSize,
            pages: d.data.meta.pages,
            total: d.data.meta.total,
        });
    };
    return (
        <div>
            <div
                style={{
                    display: "flex",
                    justifyContent: "start"
                }}
            >
                <h2>Table Users</h2>
            </div>
            <Table
                columns={columns}
                dataSource={listTracks}
                rowKey={"_id"}
                pagination={{
                    current: meta.current,
                    pageSize: meta.pageSize,
                    total: meta.total,
                    showTotal: (total, range) =>
                        `${range[0]}-${range[1]} of ${total} items`,
                    onChange: (page: number, pageSize: number) => {
                        handleOnChange(page, pageSize);
                    },
                    showSizeChanger: true,
                }}
            />
        </div>
    )
}
export default TracksTable;