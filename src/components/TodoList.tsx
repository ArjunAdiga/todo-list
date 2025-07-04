import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { BrushCleaning, ClipboardList, Trash } from "lucide-react";
import { DndContext, closestCenter } from "@dnd-kit/core";

import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import Typography from "./Typography";
import TodoItem from "./TodoItem";

type TodoType = {
  id: string;
  text: string;
  isComplete: boolean;
};

const TodoList = () => {
  const [todoArray, setTodoArray] = useState<TodoType[]>(() =>
    JSON.parse(localStorage.getItem("todos") || "[]")
  ); // All todo data
  const [todoText, setTodoText] = useState(""); // Text in add todo input
  const [checkedTodos, setCheckedTodos] = useState<string[]>([]); // to store the checked ids

  useEffect(() => {
    // to store in local storage
    localStorage.setItem("todos", JSON.stringify(todoArray));
  }, [todoArray]);

  const addTodo = () => {
    // Function that triggers on click of add button
    setTodoArray((prev) => [
      ...prev,
      {
        id: uuidv4(),
        isComplete: false,
        text: todoText,
      },
    ]);
    setTodoText("");
  };

  const handleAllDelete = () => {
    setTodoArray((prev: TodoType[]) =>
      prev.filter((item) => !checkedTodos.includes(item.id))
    );
    setCheckedTodos([]);
  };

  const handleDragEnd = (event: any) => {
    // to drag and drop todos
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = todoArray.findIndex((item) => item.id === active.id);
      const newIndex = todoArray.findIndex((item) => item.id === over.id);

      const newOrder = arrayMove(todoArray, oldIndex, newIndex);
      setTodoArray(newOrder);
    }
  };

  return (
    <div className="h-full">
      <div
        className="flex items-center justify-center"
        style={{ gap: "12px", marginBottom: "12px" }}
      >
        <ClipboardList size={34} />
        <Typography variant="h1">To-do List</Typography>
      </div>
      <div
        className="flex items-center justify-center flex-row"
        style={{ gap: "24px", marginTop: "24px" }}
      >
        <input
          type="text"
          value={todoText}
          onChange={(e) => setTodoText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addTodo();
            }
          }}
          placeholder="Enter todo"
          className="block w-full p-3 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          style={{ width: "50%" }}
        />
        <button
          type="button"
          disabled={!todoText}
          onClick={addTodo}
          className="py-2.5 px-5  text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 flex items-center"
        >
          Add
        </button>
        {checkedTodos?.length > 0 && (
          <Trash
            size={24}
            color="red"
            onClick={() => handleAllDelete()}
            style={{ cursor: "pointer" }}
          />
        )}
      </div>
      {todoArray?.length === 0 ? (
        <div
          className="flex items-center justify-center flex-col"
          style={{ height: "60vh", gap: "12px" }}
        >
          <BrushCleaning size={48} />
          <Typography variant="h2">No todos</Typography>
        </div>
      ) : (
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={todoArray.map((todo) => todo.id)}
            strategy={verticalListSortingStrategy}
          >
            <div
              className="flex items-center justify-center flex-col"
              style={{
                marginTop: "24px",
                gap: "4px",
                border: "1px solid #525252",
                borderRadius: "8px",
                padding: "8px",
              }}
            >
              {todoArray?.map((item: TodoType) => (
                <TodoItem
                  key={item.id}
                  item={item}
                  setTodoArray={setTodoArray}
                  setCheckedTodos={setCheckedTodos}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
};

export default TodoList;
