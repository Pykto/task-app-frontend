import { useState, useEffect } from "react"
import { Task } from "../types/task";
import { useNavigate } from "react-router";

const priorityTranslation = {
    'LOW': 'Baja',
    'MEDIUM': 'Media',
    'HIGH': 'Alta',
};

const stateTranslation = {
    'PENDING': 'Pendiente',
    'IN_PROGRESS': 'En progreso',
    'COMPLETED': 'Completada',
    'CANCELLED': 'Cancelada',
}

const priorityComponents = {
    'LOW': <p className="text-green-500">Baja</p>,
    'MEDIUM': <p className="text-yellow-500">Media</p>,
    'HIGH': <p className="text-red-500">Alta</p>
}

function TasksTable() {
    const [tasks, setTasks] = useState(Array<Task>);
    const [selectedStates, setSelectedStates] = useState<Task['state'][]>([]);
    const [selectedPriorities, setSelectedPriorities] = useState<Task['priority'][]>([]);
    const [expirationDateStart, setExpirationDateStart] = useState<string | undefined>();
    const [expirationDateEnd, setExpirationDateEnd] = useState<string | undefined>();
    const [creationDateStart, setCreationDateStart] = useState<string | undefined>();
    const [creationDateEnd, setCreationDateEnd] = useState<string | undefined>();
    const [isFiltersVisible, setIsFiltersVisible] = useState(false);
    const navigate = useNavigate();
    const now = new Date().getTime();

    useEffect(() => {
        async function getTasks() {
            try {
                const response = await fetch(`http://localhost:5000/tareas`);
                if (!response.ok) {
                    const errorData = await response.json();
                    console.error('Error while getting tasks information:', errorData);
                    return;
                }
                const tasksResponse = await response.json();
                setTasks(tasksResponse);
                console.log('Task found:', tasksResponse);
            } catch (error) {
                console.error('Error on connection while getting tasks information:', error);
            }
        }

        getTasks()
    }, []);

    // Filtering
    function handleStateFilterChange(event: React.ChangeEvent<HTMLInputElement>) {
        const state = event.target.value as Task['state'];
        if (event.target.checked) {
            setSelectedStates([...selectedStates, state]);
        } else {
            setSelectedStates(selectedStates.filter(s => s !== state));
        }
    };

    function handlePriorityFilterChange(event: React.ChangeEvent<HTMLInputElement>) {
        const priority = event.target.value as Task['priority'];
        if (event.target.checked) {
            setSelectedPriorities([...selectedPriorities, priority]);
        } else {
            setSelectedPriorities(selectedPriorities.filter(p => p !== priority));
        }
    };

    function handleExpirationDateStartChange(event: React.ChangeEvent<HTMLInputElement>) {
        setExpirationDateStart(event.target.value);
    };

    function handleExpirationDateEndChange(event: React.ChangeEvent<HTMLInputElement>) {
        setExpirationDateEnd(event.target.value);
    };

    function handleCreationDateStartChange(event: React.ChangeEvent<HTMLInputElement>) {
        setCreationDateStart(event.target.value);
    };

    function handleCreationDateEndChange(event: React.ChangeEvent<HTMLInputElement>) {
        setCreationDateEnd(event.target.value);
    };

    function resetFilters() {
        setSelectedStates([]);
        setSelectedPriorities([]);
        setExpirationDateStart("");
        setExpirationDateEnd("");
        setCreationDateStart("");
        setCreationDateEnd("");
    };

    const filteredTasks = tasks.filter(task => {

        const stateFilter = selectedStates.length === 0 || selectedStates.includes(task.state);

        const priorityFilter = selectedPriorities.length === 0 || selectedPriorities.includes(task.priority);

        const expirationDateFilter = (() => {
            if (!expirationDateStart && !expirationDateEnd) {
                return true;
            }
            if (task.expiration_date) {
                const taskExpirationDate = new Date(task.expiration_date.toString()).getTime();
                const start = expirationDateStart ? new Date(expirationDateStart).getTime() : -Infinity;
                const end = expirationDateEnd ? new Date(expirationDateEnd).getTime() : Infinity;
                return taskExpirationDate >= start && taskExpirationDate <= end;
            }
            return !expirationDateEnd;
        })();

        const creationDateFilter = (() => {
            if (!creationDateStart && !creationDateEnd) {
                return true;
            }
            const taskCreationDate = new Date(task.creation_date.toString()).getTime();
            const start = creationDateStart ? new Date(creationDateStart).getTime() : -Infinity;
            const end = creationDateEnd ? new Date(creationDateEnd).getTime() : Infinity;
            return taskCreationDate >= start && taskCreationDate <= end;
        })();

        return stateFilter && priorityFilter && expirationDateFilter && creationDateFilter;
    });

    // Sorting 
    const sortedTasks = sortTasks(filteredTasks);

    function sortTasks(tasksToSort: Task[]): Task[] {
        return [...tasksToSort].sort((a, b) => {
            // State (PENDING/IN_PROGRESS > COMPLETED > CANCELLED)
            const stateOrder = { 'PENDING': 1, 'IN_PROGRESS': 1, 'COMPLETED': 2, 'CANCELLED': 3 };
            const stateComparison = stateOrder[a.state] - stateOrder[b.state];
            if (stateComparison !== 0) {
                return stateComparison;
            }

            // Priority (Higher first)
            const priorityOrder = { 'HIGH': 3, 'MEDIUM': 2, 'LOW': 1 };
            const priorityComparison = priorityOrder[b.priority] - priorityOrder[a.priority];
            if (priorityComparison !== 0) {
                return priorityComparison;
            }

            // Expiration date (Closest to now, first)
            const dateA = a.expiration_date ? new Date(a.expiration_date.toString()).getTime() : Infinity;
            const dateB = b.expiration_date ? new Date(b.expiration_date.toString()).getTime() : Infinity;

            const diffA = Math.abs(dateA - now);
            const diffB = Math.abs(dateB - now);

            const expirationComparison = diffA - diffB;
            if (expirationComparison !== 0) {
                return expirationComparison;
            }

            // Creation date (Old first)
            const creationA = new Date(a.creation_date.toString()).getTime();
            const creationB = new Date(b.creation_date.toString()).getTime();
            return creationA - creationB;
        });
    };

    // General handlers
    async function handleDeleteTask(id: Number) {
        try {
            const response = await fetch(`http://localhost:5000/tareas/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                console.log(`Successful task deletion.`);
                setTasks(tasks.filter(task => task.id !== id));
            } else {
                const errorData = await response.json();
                console.error(`Error deleting task:`, errorData);
            }
        } catch (error) {
            console.error(`Error on conection while deleting task:`, error);
        }
    }

    function toggleFiltersVisibility() {
        setIsFiltersVisible(!isFiltersVisible);
    };

    // Navigation handlers
    async function handleNavigateToEditTask(id: Number) {
        navigate(`/tarea/${id}`);
    };

    function handleNavigateToNewTask() {
        navigate('/nueva-tarea');
    }

    return (
        <div className="p-5 shadow-xl rounded-xl sm:w-[100%] md:w-[90%] lg:w-[80%] xl:w-[70%] 2xl:w-[60%] overflow-x-auto">
            <div className="mb-4">
                <div className="flex justify-between">
                    <button
                        onClick={toggleFiltersVisibility}
                        className="hover:text-underline text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center "
                    >
                        {
                            isFiltersVisible ?
                                <span className="material-symbols-outlined mr-2">
                                    filter_list_off
                                </span> :
                                <span className="material-symbols-outlined mr-2">
                                    filter_list
                                </span>
                        }
                        <p className="hidden md:inline">Filtros</p>
                    </button>
                    <button
                        className="bg-gray-200 hover:bg-gray-300 hover:cursor-pointer rounded py-2 px-2 mr-4 inline-flex items-center"
                        onClick={handleNavigateToNewTask}>
                        <span className="material-symbols-outlined md:mr-2">
                            add
                        </span>
                        <p className="hidden md:inline">Nueva tarea</p>
                    </button>
                </div>

                {isFiltersVisible && (
                    <div className="mt-4 p-4 border rounded">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Filtrar por estado:</label>
                        <div>
                            {Object.keys(stateTranslation).map((state) => (
                                <div key={state} className="mr-2 inline-block">
                                    <input
                                        type="checkbox"
                                        id={`filter-${state}`}
                                        value={state}
                                        checked={selectedStates.includes(state as Task['state'])}
                                        onChange={handleStateFilterChange}
                                        className="mr-1 leading-tight"
                                    />
                                    <label htmlFor={`filter-${state}`} className="text-sm">{stateTranslation[state as keyof typeof stateTranslation]}</label>
                                </div>
                            ))}
                        </div>
                        <label className="block text-gray-700 text-sm font-bold mt-4 mb-2">Filtrar por prioridad:</label>
                        <div>
                            {Object.keys(priorityTranslation).map((priority) => (
                                <div key={priority} className="mr-2 inline-block">
                                    <input
                                        type="checkbox"
                                        id={`filter-priority-${priority}`}
                                        value={priority}
                                        checked={selectedPriorities.includes(priority as Task['priority'])}
                                        onChange={handlePriorityFilterChange}
                                        className="mr-1 leading-tight"
                                    />
                                    <label htmlFor={`filter-priority-${priority}`} className="text-sm">{priorityTranslation[priority as keyof typeof priorityTranslation]}</label>
                                </div>
                            ))}
                        </div>
                        <label className="block text-gray-700 text-sm font-bold mt-4 mb-2">Filtrar por fecha de vencimiento:</label>
                        <div className="flex flex-col sm:flex-row sm:items-center">
                            <div className="sm:mr-2">
                                <label htmlFor="expiration-start" className="block text-gray-700 text-xs font-bold mb-1">Desde:</label>
                                <input
                                    type="date"
                                    id="expiration-start"
                                    className="shadow border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-full"
                                    value={expirationDateStart || ''}
                                    onChange={handleExpirationDateStartChange}
                                />
                            </div>
                            <div>
                                <label htmlFor="expiration-end" className="block text-gray-700 text-xs font-bold mb-1">Hasta:</label>
                                <input
                                    type="date"
                                    id="expiration-end"
                                    className="shadow border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-full"
                                    value={expirationDateEnd || ''}
                                    onChange={handleExpirationDateEndChange}
                                />
                            </div>
                        </div>
                        <label className="block text-gray-700 text-sm font-bold mt-4 mb-2">Filtrar por fecha de creación:</label>
                        <div className="flex flex-col sm:flex-row sm:items-center">
                            <div className="sm:mr-2">
                                <label htmlFor="creation-start" className="block text-gray-700 text-xs font-bold mb-1">Desde:</label>
                                <input
                                    type="date"
                                    id="creation-start"
                                    className="shadow border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-full"
                                    value={creationDateStart || ''}
                                    onChange={handleCreationDateStartChange}
                                />
                            </div>
                            <div>
                                <label htmlFor="creation-end" className="block text-gray-700 text-xs font-bold mb-1">Hasta:</label>
                                <input
                                    type="date"
                                    id="creation-end"
                                    className="shadow border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-full"
                                    value={creationDateEnd || ''}
                                    onChange={handleCreationDateEndChange}
                                />
                            </div>
                        </div>
                        <button
                            onClick={resetFilters}
                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-3 mt-4 rounded inline-flex items-center"
                        >
                            <span className="material-symbols-outlined md:mr-2">
                                refresh
                            </span>
                            <p className="hidden md:inline">Reiniciar filtros</p>
                        </button>
                    </div>
                )}
            </div>
            <table className="border-separate overflow-x-auto min-w-full sm:border-spacing-2 md:border-spacing-3 lg:border-spacing-4 xl:border-spacing-5 text-xs sm:text-sm md:text-base">
                <thead>
                    <tr>
                        <th className="hidden md:inline">ID</th>
                        <th>Estado actual</th>
                        <th>Prioridad</th>
                        <th>Fecha de vencimiento</th>
                        <th>Título</th>
                        <th>Descripción</th>
                        <th>Fecha de creación</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedTasks.map((task) => (
                        <tr
                            key={task.id.toString()}
                            className="text-center"
                        >
                            <td className="hidden md:inline">{task.id.toString()}</td>
                            <td>{stateTranslation[task.state]}</td>
                            <td>{priorityComponents[task.priority]}</td>
                            <td>{task.expiration_date ?? "Nunca"}</td>
                            <td>{task.title}</td>
                            <td>{task.description}</td>
                            <td>{task.creation_date}</td>
                            <td>
                                <div className="flex flex-col lg:flex-row items-center">
                                    <button
                                        className="text-gray-800 hover:text-gray-600 hover:cursor-pointer m-1"
                                        onClick={() => handleNavigateToEditTask(task.id)}
                                    >
                                        <span className="material-symbols-outlined">
                                            edit
                                        </span>&nbsp;
                                    </button>
                                    <button
                                        className="text-gray-800 hover:text-gray-600 hover:cursor-pointer m-1"
                                        onClick={() => handleDeleteTask(task.id)}>
                                        <span className="material-symbols-outlined">
                                            delete
                                        </span>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default TasksTable
