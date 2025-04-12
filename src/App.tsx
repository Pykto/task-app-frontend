import TasksTable from "./components/TasksTable"

function App() {
  return (
    <>
      <div className="flex flex-col min-h-screen">
        <div className="flex justify-center">
          <h2 className="p-3 text-2xl">Gestor de Tareas</h2>
        </div>
        <section className="flex justify-center">
          <TasksTable />
        </section>
      </div>
    </>
  )
}

export default App
