let tasks = JSON.parse(localStorage.getItem("tasks")) || [
  {
    _id: "5d2ca9e2e03d40b326596aa7",
    completed: true,
    body:
      "Occaecat non ea quis occaecat ad culpa amet deserunt incididunt elit fugiat pariatur. Exercitation commodo culpa in veniam proident laboris in. Excepteur cupidatat eiusmod dolor consectetur exercitation nulla aliqua veniam fugiat irure mollit. Eu dolor dolor excepteur pariatur aute do do ut pariatur consequat reprehenderit deserunt.\r\n",
    title: "Eu ea incididunt sunt consectetur fugiat non."
  },
  {
    _id: "5d2ca9e29c8a94095c1288e0",
    completed: false,
    body:
      "Aliquip cupidatat ex adipisicing veniam do tempor. Lorem nulla adipisicing et esse cupidatat qui deserunt in fugiat duis est qui. Est adipisicing ipsum qui cupidatat exercitation. Cupidatat aliqua deserunt id deserunt excepteur nostrud culpa eu voluptate excepteur. Cillum officia proident anim aliquip. Dolore veniam qui reprehenderit voluptate non id anim.\r\n",
    title:
      "Deserunt laborum id consectetur pariatur veniam occaecat occaecat tempor voluptate pariatur nulla reprehenderit ipsum."
  },
  {
    _id: "5d2ca9e2e03d40b3232496aa7",
    completed: true,
    body:
      "Occaecat non ea quis occaecat ad culpa amet deserunt incididunt elit fugiat pariatur. Exercitation commodo culpa in veniam proident laboris in. Excepteur cupidatat eiusmod dolor consectetur exercitation nulla aliqua veniam fugiat irure mollit. Eu dolor dolor excepteur pariatur aute do do ut pariatur consequat reprehenderit deserunt.\r\n",
    title: "Eu ea incididunt sunt consectetur fugiat non."
  },
  {
    _id: "5d2ca9e29c8a94095564788e0",
    completed: false,
    body:
      "Aliquip cupidatat ex adipisicing veniam do tempor. Lorem nulla adipisicing et esse cupidatat qui deserunt in fugiat duis est qui. Est adipisicing ipsum qui cupidatat exercitation. Cupidatat aliqua deserunt id deserunt excepteur nostrud culpa eu voluptate excepteur. Cillum officia proident anim aliquip. Dolore veniam qui reprehenderit voluptate non id anim.\r\n",
    title:
      "Deserunt laborum id consectetur pariatur veniam occaecat occaecat tempor voluptate pariatur nulla reprehenderit ipsum."
  }
];

(function() {
  const taskList = document.querySelector(".list-group");
  const notificationList = document.querySelector(".notify-wrapper");

  const modalDelete = document.querySelector("#modalDelete");
  const formDelete = document.forms.addTask;
  const closeBtnModal = modalDelete.querySelector(".close");
  const cancelDeleteBtn = modalDelete.querySelector(".btn-secondary");
  const deleteBtnModal = modalDelete.querySelector(".btn-danger");

  const modalEdit = document.querySelector("#modalEdit");
  const formEdit = document.forms.editTask;

  const allTasksBtn = document.querySelector("#showAll");
  const completedTasksBtn = document.querySelector("#showCompleted");

  const emptyListAlert = document.querySelector(".empty-list-aler");

  function updateStorage(name, value) {
    localStorage.setItem(`${name}`, JSON.stringify(value));
  }

  function moduleKeyController(event) {
    if (event.target.contains(cancelDeleteBtn)) {
      switch (event.keyCode) {
        case 9:
          event.preventDefault();
          break;
        case 39:
          deleteBtnModal.focus();
          break;
        default:
      }
    }
    if (event.target.contains(deleteBtnModal)) {
      switch (event.keyCode) {
        case 9:
          event.preventDefault();
          break;
        case 37:
          cancelDeleteBtn.focus();
          break;
        default:
      }
    }
  }

  function generateId() {
    // desired length of Id
    const idStrLen = 25;

    // always start with a letter -- base 36 makes for a nice shortcut
    let idStr = (Math.floor(Math.random() * 25) + 10).toString(36);

    // similar to above, complete the Id using random, alphanumeric characters
    do {
      idStr += Math.floor(Math.random() * 35).toString(36);
    } while (idStr.length < idStrLen);

    return idStr;
  }

  function createNotification(response, title) {
    const notification = document.createElement("div");

    notification.setAttribute("role", "alert");
    notification.classList.add(
      "alert",
      "alert-success",
      "alert-dismissible",
      "animated",
      "fadeInDown",
      "notify"
    );

    notification.innerHTML = `
      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
      <span>
        The task <strong>"${title}"</strong> has been successfully ${response}ed!
      </span>
    `;

    notificationList.prepend(notification);

    setTimeout(() => {
      notification.classList.toggle("fadeOut");
      setTimeout(() => {
        notification.remove();
      }, 1000);
    }, 5000);
  }

  function toogleEmptyNotification() {
    if (tasks.length === 0) {
      emptyListAlert.style.display = "block";
    } else {
      emptyListAlert.style.display = "none";
    }

    updateStorage("emptyListVisibility", emptyListAlert.style.display);
    console.log(document.body.dataset);
    if (document.body.dataset.sort !== "completed") return;

    if (tasks.every(task => task.completed === false)) {
      emptyListAlert.style.display = "block";
    } else {
      emptyListAlert.style.display = "none";
    }

    updateStorage("emptyListVisibility", emptyListAlert.style.display);
  }

  function filterTasks(event) {
    if (event.target.contains(completedTasksBtn)) {
      document.body.setAttribute("data-sort", "completed");
    } else if (event.target.contains(allTasksBtn)) {
      document.body.setAttribute("data-sort", "all");
    }

    updateStorage("sortStatus", document.body.dataset.sort);
    toogleEmptyNotification();
  }

  function changeTaskStatus(event) {
    const task = event.target.closest(".list-group-item");

    if (event.target.checked === true) {
      task.dataset.taskStatus = "done";
    } else {
      task.dataset.taskStatus = "inprogress";
    }
  }

  function toogleTaskAction(event) {
    const card =
      document.querySelector("li[data-edit]") ||
      document.querySelector("li[data-delete]");

    switch (event.target.closest(".modal")) {
      case event.target.closest("#modalDelete"):
        card.removeAttribute("data-delete");
        break;
      case event.target.closest("#modalEdit"):
        card.removeAttribute("data-edit");
        break;
      default:
        break;
    }
  }

  function editTask(event) {
    event.preventDefault();

    const editCard = document.querySelector("li[data-edit]");
    const newInfo = {
      _id: editCard.querySelector("input[type=checkbox]").id,
      completed: this.progress.checked,
      title: this.title.value,
      body: this.body.value
    };

    editCard.querySelector("span").textContent = newInfo.title;
    editCard.querySelector("p").textContent = newInfo.body;
    editCard.querySelector("input[type=checkbox]").checked = newInfo.completed;

    editCard.dataset.taskStatus =
      newInfo.completed === true ? "done" : "inprogress";

    editCard.removeAttribute("data-edit");

    tasks.forEach(el => {
      if (el["_id"] === newInfo["_id"]) {
        for (const key of Object.keys(el)) {
          el[key] = newInfo[key];
        }
      }
    });

    $("#simulateClick").trigger("click");
    updateStorage("tasks", tasks);
    createNotification("edit", this.title.value);

    event.target.reset();
  }

  function sendTaskInfo() {
    const editCard = document.querySelector("li[data-edit]");

    formEdit.title.value = editCard.querySelector("span").textContent;
    formEdit.body.value = editCard.querySelector("p").textContent;
    formEdit.progress.checked = editCard.querySelector(
      "input[type=checkbox]"
    ).checked;
  }

  function addNewTask(event) {
    const newTask = {
      _id: generateId(),
      completed: this.progress.checked,
      title: this.title.value,
      body: this.body.value
    };

    const card = cardTemplate(newTask);

    tasks.unshift(newTask);
    taskList.prepend(card);

    updateStorage("tasks", tasks);
    toogleEmptyNotification();
    createNotification("add", this.title.value);

    event.preventDefault();
    this.reset();
  }

  function deleteTask() {
    const delCard = document.querySelector("li[data-delete]");

    delCard.remove();

    tasks = tasks.filter(
      el => el["_id"] !== delCard.querySelector("input[type=checkbox]").id
    );

    updateStorage("tasks", tasks);
    toogleEmptyNotification();
    createNotification("delet", delCard.querySelector("span").textContent);
  }

  const cardTemplate = function(obj) {
    const card = document.createElement("li");

    card.classList.add(
      "list-group-item",
      "d-flex",
      "align-items-center",
      "flex-wrap",
      "mt-2"
    );

    card.innerHTML = `
      <span>${obj.title}</span>
      <p class="mt-2 w-100">${obj.body}</p>
      <div class="custom-control custom-checkbox">
        <input
        type="checkbox"
        class="custom-control-input"
        id="${obj["_id"]}"
        />
        <label class="custom-control-label" for="${obj["_id"]}">Completed</label>
      </div>
      <div class="ml-auto">
      <button type="button" class="btn btn-secondary edit-btn" data-toggle="modal" data-target="#modalEdit">Edit</button>
      <button type="button" class="btn btn-danger delete-btn" data-toggle="modal" data-target="#modalDelete">Delete</button>
      </div>
    `;

    card.querySelector("input[type=checkbox]").checked = obj.completed;
    card.dataset.taskStatus = obj.completed === true ? "done" : "inprogress";

    card.querySelector(".delete-btn").addEventListener("click", () => {
      card.setAttribute("data-delete", "");
      setTimeout(() => cancelDeleteBtn.focus(), 500);
    });

    card.querySelector(".edit-btn").addEventListener("click", () => {
      card.setAttribute("data-edit", "");
      sendTaskInfo();
    });

    card
      .querySelector("input[type=checkbox]")
      .addEventListener("input", changeTaskStatus);

    card
      .querySelector("input[type=checkbox]")
      .addEventListener("input", updateCheckedValue);

    function updateCheckedValue() {
      tasks.forEach(task => {
        if (task["_id"] === card.querySelector("input[type=checkbox]").id) {
          task.completed = card.querySelector("input[type=checkbox]").checked;
        }
      });

      updateStorage("tasks", tasks);
      toogleEmptyNotification();
    }

    return card;
  };

  formDelete.addEventListener("submit", addNewTask);
  formEdit.addEventListener("submit", editTask);
  deleteBtnModal.addEventListener("click", deleteTask);

  closeBtnModal.addEventListener("click", toogleTaskAction);
  cancelDeleteBtn.addEventListener("click", toogleTaskAction);
  modalEdit
    .querySelectorAll(".close-modal")
    .forEach(btn => btn.addEventListener("click", toogleTaskAction));

  allTasksBtn.addEventListener("click", filterTasks);
  completedTasksBtn.addEventListener("click", filterTasks);

  cancelDeleteBtn.addEventListener("keydown", moduleKeyController);
  deleteBtnModal.addEventListener("keydown", moduleKeyController);

  // init tasks from array
  document.body.setAttribute(
    "data-sort",
    `${JSON.parse(localStorage.getItem("sortStatus")) || "all"}`
  );

  emptyListAlert.style.display =
    JSON.parse(localStorage.getItem("emptyListVisibility")) || "none";

  localStorage.setItem("tasks", JSON.stringify(tasks));
  localStorage.setItem(
    "sortStatus",
    JSON.stringify(document.body.dataset.sort)
  );
  localStorage.setItem(
    "emptyListVisibility",
    JSON.stringify(emptyListAlert.style.display)
  );

  tasks.forEach(el => {
    const card = cardTemplate(el);

    taskList.append(card);
  });
})();
