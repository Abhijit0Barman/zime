import { useState, useEffect } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Input, Table, Select } from "antd";
const { Option } = Select;
const { Search } = Input;

const Homepage = () => {
    const [posts, setPosts] = useState([]);
    const [pagination, setPagination] = useState({});
    const [loading, setLoading] = useState(false);
    const [tags, setTags] = useState([]);
    const [textSearch, setTextSearch] = useState("");
    const location = useLocation();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            try {
                const res = await fetch(
                    `https://dummyjson.com/posts${location.search}`
                );
                const data = await res.json();
                console.log(data);
                setPosts(data.posts);
                setPagination({
                    current: data.page,
                    pageSize: data.limit,
                    total: data.total,
                });
            } catch (error) {
                console.error("Error fetching posts:", error);
            }
            setLoading(false);
        };
        fetchPosts();
    }, [location.search, navigate]);

    useEffect(() => {
        const params = Object.fromEntries(searchParams.entries());
        setTags(params.tags ? params.tags.split(",") : []);
        setTextSearch(params.search || "");
    }, [searchParams]);

    const availableTags = [...new Set(posts.flatMap((post) => post.tags))];

    const handleViewTableChange = (pagination, filters, sorter) => {
        const pager = { ...pagination };
        pager.current = pagination.current;

        setPagination(pager);
        setSearchParams({
            ...searchParams,
            page: pager.current,
            limit: pager.pageSize,
        });
    };

    const handleTagsChange = (selectedTags) => {
        setTags(selectedTags);
        setSearchParams({ ...searchParams, tags: selectedTags.join(",") });
    };

    const handleSearch = (e) => {
        const searchText = e.target.value;
        setTextSearch(searchText);
        setSearchParams({ ...searchParams, search: searchText });
    };

    // const columns = [
    //     {
    //         title: "Title",
    //         dataIndex: "title",
    //         key: "title",
    //     },
    //     {
    //         title: "Body",
    //         dataIndex: "body",
    //         key: "body",
    //     },
    //     {
    //         title: "Tags",
    //         dataIndex: "tags",
    //         key: "tags",
    //         render: (tags) => (
    //             <>
    //                 {tags.map((tag,i) => (
    //                     <span key={i}>{tag + ", "}</span>
    //                 ))}
    //             </>
    //         ),
    //     },
    // ];

    const columns = [
        {
            title: "Title",
            dataIndex: "title",
            key: "title",
        },
        {
            title: "Body",
            dataIndex: "body",
            key: "body",
        },
        {
            title: "Tags",
            dataIndex: "tags",
            key: "tags",
            render: (tags, record, index) => (
                <>
                    {tags.map((tag, i) => (
                        <span key={i}>{tag + ", "}</span>
                    ))}
                </>
            ),
        },
    ];

    return (
        <div style={{ display: "flex", gap: "5px" }}>
            <div style={{ width: "800px" }}>
                <Select
                    mode="multiple"
                    placeholder="Select Tags"
                    value={tags}
                    onChange={handleTagsChange}
                    style={{ width: "100%" }}
                >
                    {availableTags.map((option, i) => (
                        <Option key={i} value={option}>
                            {option}
                        </Option>
                    ))}
                </Select>

                <Search
                    placeholder="Search posts"
                    value={textSearch}
                    onChange={handleSearch}
                />
            </div>

            <Table
                dataSource={posts}
                columns={columns}
                pagination={pagination}
                loading={loading}
                onChange={handleViewTableChange}
            />
        </div>
    );
};

export default Homepage;
