import "../../assets/styles/Homepage.css";
import { FaPlus, FaEdit, FaTrash, FaCheck } from "react-icons/fa";

const Homepage = () => {
    return (
        <div className="homepage-container">
            <h2>Task Manager</h2>
            <div className="task-columns">
                <div className="column">
                    <div className="column-header">
                        <h3>Backlog</h3>
                        <button className="add-task-btn"><FaPlus /></button>
                    </div>
                    <div className="task-card">
                        <span>Task 1</span>
                        <div className="task-actions">
                            <FaEdit title="Edit" />
                            <FaTrash title="Delete" />
                        </div>
                    </div>
                    <div className="task-card">
                        <span>Task 2</span>
                        <div className="task-actions">
                            <FaEdit title="Edit" />
                            <FaTrash title="Delete" />
                        </div>
                    </div>
                </div>
                
                <div className="column">
                    <div className="column-header">
                        <h3>In Progress</h3>
                        <button className="add-task-btn"><FaPlus /></button>
                    </div>
                    <div className="task-card">
                        <span>Task 3</span>
                        <div className="task-actions">
                            <FaEdit title="Edit" />
                            <FaCheck title="Complete" />
                        </div>
                    </div>
                </div>
                
                <div className="column">
                    <div className="column-header">
                        <h3>Completed</h3>
                        <button className="add-task-btn"><FaPlus /></button>
                    </div>
                    <div className="task-card">
                        <span>Task 4</span>
                        <div className="task-actions">
                            <FaEdit title="Edit" />
                            <FaTrash title="Delete" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Homepage;
