import { useEffect, useRef, useState } from "react";
import Typography from "./Typography";
import { Pencil, Trash,GripVertical  } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type TodoType = {
  id: string;
  text: string;
  isComplete: boolean;
};

const TodoItem = ({
  item,
  setTodoArray,
  setCheckedTodos,
  key,
}: {
  setTodoArray: any;
  item: TodoType;
  setCheckedTodos:any;
  key:string;
}) => {
  const [isEdit, setIsEdit] = useState(false); // to edit
  const [isCompleteTodo, setIsCompleteTodo] = useState(!!item?.isComplete); //  for checkbox
  const [hover, setHover] = useState(false);
  const [editedText, setEditedText] = useState(item?.text);
  const ref = useRef<HTMLTextAreaElement>(null);

   const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  useEffect(() => {
    if (isEdit && ref.current) {
      const textarea = ref.current;
    textarea.focus();
    // Move cursor to end of text
    const length = textarea.value.length;
    textarea.setSelectionRange(length, length);
    }
  }, [isEdit]);

  useEffect(() => {     // to update isChecked and text
  setIsCompleteTodo(!!item?.isComplete);
  setEditedText(item?.text)
}, [item]);

  const handleOnCheck = (e:React.ChangeEvent<HTMLInputElement>,id:string) => { 
    setIsCompleteTodo((prev) => !prev);
    setTodoArray((prev: TodoType[]) =>
      prev.map((todo: TodoType) =>
        todo.id === item?.id ? { ...todo, isComplete: !todo?.isComplete } : todo
      )
    );
    if(e.target.checked == true) {
        setCheckedTodos((prev:number[]) => ([...prev,id]))
    }
    else {
        setCheckedTodos((prev:string[]) => prev.filter(item => item !== id))
    }
  };

  const handleEdit = (text: string) => {
    // on edit task

    setTodoArray((prev: TodoType[]) =>
      prev.map((todo: TodoType) =>
        todo.id === item?.id ? { ...todo, text: text } : todo
      )
    );
    if (ref.current) ref.current.blur();
    setIsEdit(false);
  };

  const handleDelete = (id: string) => {
    // to delete the to do
    setTodoArray((prev: TodoType[]) =>
      prev.filter((item: TodoType) => item.id !== id)
    );
  };

  return (
    <>
      <div
        className="flex items-center p-2 w-full"
        ref={setNodeRef}
      key={key}
        style={{...style, gap: "8px" }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
         <GripVertical
        className="cursor-grab text-gray-400"
        {...listeners}
        {...attributes}
        size={16}
      />
        <input
          checked={isCompleteTodo}
          onChange={(e) => handleOnCheck(e,item.id)}
          id="checked-checkbox"
          type="checkbox"
          style={{marginRight:"12px"}}
          className="w-3 h-3 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 focus:ring-blue-500 dark:ring-offset-gray-800  dark:bg-gray-700 dark:border-gray-600"
        />
        {!isEdit ? (
          <Typography
            variant="label2"
            styles={{
              width: "85%",
              textDecoration: isCompleteTodo ? "line-through" : "none",
              maxWidth: "85%",
              display: "flex",
              flexWrap: "wrap",
            }}
          >
            {item?.text}
          </Typography>
        ) : (
          <>
            <textarea
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              rows={1}
              ref={ref}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleEdit(editedText);
                }
              }}
              onBlur={() => handleEdit(editedText)}
              style={{
                border: "none",
                outline: "none",
                fontSize: "14px",
                overflow: "auto",
                overflowY: "auto",
                maxHeight: "75px",
                scrollbarWidth: "none",
                whiteSpace: "pre-wrap",
                wordWrap: "break-word",
                width: "85%",
                padding: "4px 2px 4px 0px",
                resize: "none",
                backgroundColor: "#fffafa",
              }}
            />
          </>
        )}
        {hover && (
          <div
            className="flex items-center justify-end"
            style={{ width: "10%", gap: "18px" }}
          >
            <Pencil
              size={16}
              onClick={() => {
                setIsEdit(true);
              }}
              style={{ cursor: "pointer" }}
            />
            <Trash
              size={16}
              color="red"
              onClick={() => handleDelete(item?.id)}
              style={{ cursor: "pointer" }}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default TodoItem;
