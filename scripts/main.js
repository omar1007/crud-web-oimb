import app from "./index.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  onSnapshot,
  deleteDoc,
  getDoc,
  doc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/9.1.2/firebase-firestore.js";

const db = getFirestore(app);

const taskForm = document.getElementById("task-form");
const taskContainer = document.getElementById("tasks-container");
const taskTitle = document.getElementById("task-title");
const taskDes = document.getElementById("task-description");
let editStatus = false;
let id = "";

const saveTask = (title, description) =>
  addDoc(collection(db, "tasks"), {
    title,
    description
  });

const getTasks = () => getDocs(collection(db, "tasks"));
const onGetTasks = (callback) => onSnapshot(collection(db, "tasks"), callback);
const deleteTask = (id) => deleteDoc(doc(db, "tasks", id));
const getTask = (id) => getDoc(doc(db, "tasks", id));
const updateTask = (id, updateTask) =>
  updateDoc(doc(db, "tasks", id), updateTask);

taskForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = taskForm["task-title"].value;
  const description = taskForm["task-description"].value;

  if (!editStatus) {
    await saveTask(title, description);
  } else {
    await updateTask(id, {
      title: title,
      description: description
    });

    editStatus = false;
    id = "";
    taskForm["btn-task-form"].innerText = "Save";
  }

  await getTasks();

  taskForm.reset();
  taskTitle.focus();
});

window.addEventListener("DOMContentLoaded", async (e) => {
  onGetTasks((querySnapshot) => {
    taskContainer.innerHTML = " ";
    querySnapshot.forEach((doc) => {
      const task = doc.data();
      task.id = doc.id;

      taskContainer.innerHTML += `<div class="card card-body mt-2 
          border-primary">
          <h3 class="h5"> ${task.title}</h3>
          <p> ${task.description}</p>
          <div>
              <button class="btn btn-danger btn-delete" data-id="${task.id}"> Borrar </buttton>
              <button class="btn btn-primary btn-edit" data-id="${task.id}"> Editar </buttton>
          </div>
          </div>`;

      const btnsDelete = document.querySelectorAll(".btn-delete");
      btnsDelete.forEach((btn) => {
        btn.addEventListener("click", async (e) => {
          await deleteTask(e.target.dataset.id);
        });
      });

      const btnsEdit = document.querySelectorAll(".btn-edit");
      btnsEdit.forEach((btn) => {
        btn.addEventListener("click", async (e) => {
          const doc = await getTask(e.target.dataset.id);
          const task = doc.data();

          editStatus = true;
          id = doc.id;

          taskTitle.value = task.title;
          taskDes.value = task.description;
          taskForm["btn-task-form"].innerText = "Actualizar";
        });
      });
    });
  });
});
