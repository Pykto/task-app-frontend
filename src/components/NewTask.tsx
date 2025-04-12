import React, { useState } from "react";
import { Task, FormState } from "../types/task";
import { useNavigate } from "react-router";

const defaultFormState: FormState = {
    title: "",
    description: "",
    priority: "LOW",
    expiration_date: undefined,
};

function NewTask() {
    const [formData, setFormData] = useState<FormState>(defaultFormState);
    const apiBaseUrl = import.meta.env.VITE_TASK_API_BASE_URL;
    const navigate = useNavigate();

    function handleInputChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
        const { name, value } = event.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    }

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();

        const newTaskData = {
            ...formData,
            state: 'PENDING' as Task['state'],
            expiration_date: formData.expiration_date || null,
        };

        try {
            const response = await fetch(`${apiBaseUrl}/tareas`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newTaskData),
            });

            if (response.ok) {
                const createdTask = await response.json();
                console.log("Successful task creation:", createdTask);
                alert("Tarea creada con éxito")
                navigate("/");
            } else {
                const errorData = await response.json();
                console.error("Error while creating task:", errorData);
            }
        } catch (error) {
            console.error("Error on connection while creating the task:", error);
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <div className="flex justify-center">
                <h2 className="p-3 text-2xl">Nueva tarea</h2>
            </div>
            <div className="flex justify-center">

                <form onSubmit={handleSubmit} className="flex flex-col gap-4 shadow-lg p-6 rounded-lg w-[100%] sm:w-[80%] md:w-[70%] lg:w-[50%] xl:w-[40%] 2xl:w-[30%] max-w-[600px] overflow-x-auto">
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
                    <div className="flex justify-center">
                        <button
                            type="submit"
                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Crear Tarea
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default NewTask;