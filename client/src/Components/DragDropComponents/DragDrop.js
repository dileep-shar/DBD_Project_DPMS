import React, { useState, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Column from "./Column";
import axios from "axios";
import { Row, Container, Button } from "@nextui-org/react";
import Navbar from "../Professor/Navbar";

import "../../assets/styles/DragDrop.css";
import MyProjects from "../Projects/MyProjects";
import { auth } from "../../firebase";

const DragDrop = ({ projectID }) => {
  let [items, setItems] = useState({});
  let [dragTasks, setDragTasks] = useState({});
  let [columns, setColumns] = useState([]);
  let [members, setMembers] = useState([]);
  const getDragTasks = async () => {
    const data = {
      projectID: projectID,
    };
    const res = await axios.post("/project/dragdrop/get", { data: data });
    if (!res.data.success) console.log("Error");
    else {
      let resDragTask = res.data.dragTask;
      setDragTasks(resDragTask);
      setItems(resDragTask.Tasks);
      setColumns(resDragTask.Columns);
      setMembers(res.data.members);
    }
  };

  const updateDragTasksForItems = async (items) => {
    let updateDragTasks = dragTasks;
    updateDragTasks.Tasks = items;
    const data = {
      projectID: projectID,
      dragTask: updateDragTasks,
    };
    // console.log(data)
    const res = await axios.post("/project/dragdrop/update", { data: data });
    // console.log(res)
    setItems([...items]);
  };
  useEffect(() => {
    getDragTasks();
  }, []);

  const moveCardHandler = (dragIndex, hoverIndex) => {
    const dragItem = items[dragIndex];

    if (dragItem) {
      // remove item by "hoverIndex" and put "dragItem" instead
      const prevItem = items.splice(hoverIndex, 1, dragItem);

      // remove item by "dragIndex" and put "prevItem" instead
      items.splice(dragIndex, 1, prevItem[0]);
      updateDragTasksForItems(items);

      return items;
    }
  };

  return (
    <div className=" h-screen  bg-gray flex flex-col justify-start flex-grow my-4 mx-2">
      <div className=" flex w-full ">
        <DndProvider backend={HTML5Backend}>
          <div className=" w-full">
            <div
              // style={{
              //   justifySelf: "start",
              //   justifyContent: "flex-start",
              //   justifyItems: "flex-start",
              //   margin: "0.25rem",
              // }}
              className="grid  grid-cols-1  sm:grid-cols-2 2xl:grid-cols-4 gap-y-2 sm:gap-x-3"
            >
              {
                // console.log(columns)
                columns ? (
                  columns.map((e, index) => {
                    // console.log(e)
                    return (
                      <Column
                        title={e}
                        items={items}
                        style={{
                          height: "inherit",
                          display: "flex",
                          borderRadius: "0.25rem",

                          // margin:"0.5rem"
                        }}
                        updateDragTasksForItems={updateDragTasksForItems}
                        columnIndex={index}
                        columns={columns}
                        moveCardHandler={moveCardHandler}
                        members={members}
                      />
                    );
                  })
                ) : (
                  <div />
                )
              }
            </div>
          </div>
        </DndProvider>
      </div>
    </div>
  );
};
export default DragDrop;
