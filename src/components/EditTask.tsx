import React, { useState, useEffect, ChangeEvent } from "react";
import { Task, FormState } from "../types/task";
import { useNavigate, useParams } from "react-router";

const defaultFormState: FormState = {
    title: "",
    description: "",
    priority: "LOW",
    expiration_date: undefined,
    state: "PENDING"
};

function EditTask() {
    const { id } = useParams<{ id: string }>();
    const [formData, setFormData] = useState<FormState>(defaultFormState);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const apiBaseUrl = import.meta.env.VITE_TASK_API_BASE_URL;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTaskDetails = async () => {
            setLoading(true);
            setError(null);
            try {
                if (id) {
                    const response = await fetch(`http://localhost:5000/tareas/${id}`);
                    if (response.ok) {
                        const taskData: Task = await response.json();
                        setFormData({
                            title: taskData.title.toString(),
                            description: taskData.description.toString(),
                            priority: taskData.priority,
                            expiration_date: taskData.expiration_date?.toString(),
                            state: taskData.state
                        });
                    } else {
                        const errorData = await response.json();
                        setError(`Error loading task details: ${response.status} - ${errorData?.error || 'Unknown error'}`);
                    }
                }
            } catch (error) {
                setError("Error of connection at loading task details");
            } finally {
                setLoading(false);
            }
        };

        fetchTaskDetails();
    }, [id]);

    function handleInputChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
        const { name, value } = event.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();

        if (!id) {
            console.error("No task ID was provided");
            return;
        }

        try {
            const response = await fetch(`${apiBaseUrl}/tareas/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const updatedTask = await response.json();
                console.log("Successful task update:", updatedTask);
                alert("Tarea actualizada con éxito.");
                navigate("/");
            } else {
                const errorData = await response.json();
                console.error("Error while updating task:", errorData);
            }
        } catch (error) {
            console.error("Error on connection while updating task:", error);
        }
    };

    if (loading) {
        return <div>Cargando detalles de la tarea...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="flex flex-col min-h-screen">
            <div className="flex justify-center">
                <h2 className="p-3 text-2xl">Editar Tarea</h2>
            </div>
            <div className="flex justify-center">
                <form onSubmit={handleSubmit} className="w-[50%] flex flex-col gap-4 shadow-lg p-6 rounded-lg w-[100%] sm:w-[80%] md:w-[70%] lg:w-[50%] xl:w-[40%] 2xl:w-[30%] max-w-[600px] overflow-x-auto">
                    <div>
                        <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">Título:</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={formData.title}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">Descripción:</label>
                        <textarea
                            id="description"
                            name="description"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={formData.description}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="priority" className="block text-gray-700 text-sm font-bold mb-2">Prioridad:</label>
                        <select
                            id="priority"
                            name="priority"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={formData.priority}
                            onChange={handleInputChange}
                        >
                            <option value="LOW">Baja</option>
                            <option value="MEDIUM">Media</option>
                            <option value="HIGH">Alta</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="expiration_date" className="block text-gray-700 text-sm font-bold mb-2">Fecha de Vencimiento (opcional):</label>
                        <input
                            type="datetime-local"
                            id="expiration_date"
                            name="expiration_date"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={formData.expiration_date || ''}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="state" className="block text-gray-700 text-sm font-bold mb-2">Estado:</label>
                        <select
                            id="state"
                            name="state"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={formData.state}
                            onChange={handleInputChange}
                        >
                            <option value="PENDING">Pendiente</option>
                            <option value="IN_PROGRESS">En progreso</option>
                            <option value="COMPLETED">Completada</option>
                            <option value="CANCELLED">Cancelada</option>
                        </select>
                    </div>
                    <div className="flex justify-center">
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Guardar Cambios
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditTask;