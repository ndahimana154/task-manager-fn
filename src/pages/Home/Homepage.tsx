import { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { toast, ToastContainer } from "react-toastify";
import "../../assets/styles/Homepage.css";
import {
    FaPlus, FaEdit,
    FaTrash, FaCheck,
    FaTimes, FaArrowAltCircleRight,
    FaArrowAltCircleLeft,
    FaSignOutAlt
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Spinner from "../../components/Spinner";
import Modal from "react-modal";

Modal.setAppElement("#root");
const Homepage = () => {
    const [tasks, setTasks] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [_id, set_id]: any = useState("");
    const [title, setTitle]: any = useState("");
    const [description, setDescription]: any = useState("");
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            toast.error("Please login first!");
            navigate("/login");
        }
    }, [token, navigate]);
    const fetchTasks = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get("/api/task/all", {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log("Fetched tasks:", response.data); // Debugging line
            setTasks(response.data.data.tasks); // Adjust based on your API response
        } catch (error) {
            toast.error("Failed to load tasks. Please try again.");
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchTasks();
    }, [token]);

    const openModal = () => {
        setIsModalOpen(true);
        setTitle("");
        setDescription("");
    };

    const closeModal = () => setIsModalOpen(false);

    const handleCreateTask = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axiosInstance.post(
                "/api/task/create-new-task",
                { title, description },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setTasks((prevTasks) => [...prevTasks, response.data.data.task]); // Add new task to list
            toast.success("Task created successfully!");
            closeModal();
        } catch (error: any) {
            toast.error("Task already exists!");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateTask = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await axiosInstance.put(
                "/api/task/",
                { _id, title, description },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            await fetchTasks()
            toast.success("Task updated successfully!");
            handleCloseUpdateModal();
        } catch (error: any) {
            toast.error("Unknown error occured!");
        } finally {
            setLoading(false);
        }
    };

    // const handleDeleteTask = async (taskId: string) => {
    //     setLoading(true);
    //     try {
    //         await axiosInstance.delete(`/api/task/${taskId}`, {
    //             headers: { Authorization: `Bearer ${token}` },
    //         });
    //         await fetchTasks()
    //         toast.success("Task deleted successfully.");
    //     } catch (error) {
    //         toast.error("Failed to delete task.");
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    const handleOpenUpdateModal = (_id: String, title: String, description: String) => {
        set_id(_id);
        setTitle(title);
        setDescription(description);
        setIsUpdateModalOpen(true)
    }

    const handleCloseUpdateModal = () => setIsUpdateModalOpen(false);

    const renderTasks = (status: string) => {
        const filteredTasks = tasks.filter((task) => task.status === status);

        return filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
                <div key={task._id} className="task-card">
                    <span>{task.title}</span>
                    <div className="task-actions">
                        {status === "Pending" && (
                            <div>
                                <FaEdit
                                    title="Edit"
                                    onClick={() =>
                                        handleOpenUpdateModal(task._id, task.title, task.description)
                                    }
                                />
                                <FaArrowAltCircleRight
                                    title="Progress"
                                    onClick={() => handleAdvanceTask(task._id, "Progress")}
                                    className="icons"
                                />
                            </div>
                        )}
                        {status === "Progress" ? (
                            <div>
                                <FaArrowAltCircleLeft
                                    title="Pending"
                                    onClick={() => handleAdvanceTask(task._id, "Pending")}
                                    className="icons"
                                />
                                <FaCheck
                                    title="Complete"
                                    onClick={() => handleAdvanceTask(task._id, "Completed")}
                                    className="icons"
                                />
                            </div>
                        ) : (
                            <FaTrash
                                title="Delete"
                                onClick={() => handleAdvanceTask(task._id, "Deleted")}
                            />
                        )}
                    </div>
                </div>
            ))
        ) : (
            <div>No tasks found</div>
        );
    };

    const handleAdvanceTask = async (_id: String, status: String) => {
        setLoading(true);
        try {
            await axiosInstance.put(
                "/api/task/",
                { _id, status },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            await fetchTasks()
            if (status === "Deleted") {
                toast.success("Task deleted successfully.");
            }
            else {
                toast.success("Task moved successfully!");
            }
            closeModal();
        } catch (error: any) {
            toast.error("Unknown error occured!");
        } finally {
            setLoading(false);
        }
    };
    const logout = () => {
        localStorage.clear();
        toast.success("Logged out successfully!");
        setTimeout(() => {
            navigate("/login")
        }, 2000)
    }

    return (
        <>
            <ToastContainer />
            <div className="homepage-container">
                <div className="head">
                    <h2>Task Manager</h2>
                    <button onClick={logout}>
                        <FaSignOutAlt /> <span>Logout</span>
                    </button>
                </div>
                {loading && <Spinner />}

                <div className="task-columns">
                    <div className="column">
                        <div className="column-header">
                            <h3>Backlog</h3>
                            <button className="add-task-btn" onClick={openModal}>
                                <FaPlus />
                            </button>
                        </div>
                        {renderTasks("Pending")}
                    </div>

                    <div className="column">
                        <div className="column-header">
                            <h3>In Progress</h3>
                        </div>
                        {renderTasks("Progress")}
                    </div>

                    <div className="column">
                        <div className="column-header">
                            <h3>Completed</h3>
                        </div>
                        {renderTasks("Completed")}
                    </div>
                </div>

                {isModalOpen &&
                    <div className="new-task-modal">
                        <div className="body">
                            <div className="title">
                                <h2>Create New Task</h2>
                                <button onClick={closeModal}>
                                    <FaTimes />
                                </button>
                            </div>
                            {loading && <Spinner />}
                            <form onSubmit={handleCreateTask} >
                                <p>
                                    <input
                                        type="text"
                                        placeholder="Title"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        required
                                    />
                                </p>
                                <p>
                                    <textarea
                                        placeholder="Description"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        required
                                    />
                                </p>
                                <button type="submit" disabled={loading}>
                                    {loading ? "Creating..." : "Create Task"}
                                </button>
                            </form>
                        </div>
                    </div>
                }
                {isUpdateModalOpen &&
                    <div className="new-task-modal">
                        <div className="body">
                            <div className="title">
                                <h2>Update Task</h2>
                                <button onClick={handleCloseUpdateModal}>
                                    <FaTimes />
                                </button>
                            </div>
                            {loading && <Spinner />}
                            <form onSubmit={handleUpdateTask} >
                                <p>
                                    <input
                                        type="text"
                                        placeholder="Title"
                                        value={_id}
                                        hidden
                                    />
                                    <input
                                        type="text"
                                        placeholder="Title"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        required
                                    />
                                </p>
                                <p>
                                    <textarea
                                        placeholder="Description"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        required
                                    />
                                </p>
                                <button type="submit" disabled={loading}>
                                    {loading ? "Updating..." : "Update Task"}
                                </button>
                            </form>
                        </div>
                    </div>
                }
            </div>
        </>
    );
};

export default Homepage;
