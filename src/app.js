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
  const form = document.forms.addTask;
  const list = document.querySelector(".list-group");
  const modal = document.querySelector("#exampleModalCenter");
  const closeBtnModal = modal.querySelector(".close");
  const cancelBtnModal = modal.querySelector(".btn-secondary");
  const deleteBtnModal = modal.querySelector(".btn-danger");
  const allTasksBtn = document.querySelector("#showAll");
  const completedTasksBtn = document.querySelector("#showCompleted");
  const emptyListAlert = document.querySelector(".empty-list-aler");

  function updateStorage(tasks) {
    const updatedTasks = tasks;
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
  }

  function checkTasksLength() {
    if (tasks.length === 0) {
      emptyListAlert.style.display = "block";
    } else {
      emptyListAlert.style.display = "none";
    }
  }

  function changeTaskStatus(event) {
    const task = event.target.closest(".list-group-item");

    if (event.target.checked === true) {
      task.dataset.taskStatus = "done";
    } else {
      task.dataset.taskStatus = "inprogress";
    }
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
      <button type="button" class="btn btn-danger ml-auto delete-btn" data-toggle="modal" data-target="#exampleModalCenter">Delete</button>
    `;

    card.querySelector("input[type=checkbox]").checked = obj.completed;
    card.dataset.taskStatus = obj.completed === true ? "done" : "inprogress";

    card.querySelector(".delete-btn").addEventListener("click", () => {
      card.setAttribute("data-delete", "");
      setTimeout(() => cancelBtnModal.focus(), 500);
    });

    card
      .querySelector("input[type=checkbox]")
      .addEventListener("input", changeTaskStatus);

    return card;
  };

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

  function addNewTask(event) {
    const newTask = {
      _id: generateId(),
      title: this.title.value,
      body: this.body.value,
      completed: this.progress.checked
    };

    const card = cardTemplate(newTask);

    tasks.unshift(newTask);
    list.prepend(card);

    updateStorage(tasks);
    checkTasksLength();

    event.preventDefault();
    this.reset();
  }

  function filterTasks(event) {
    if (event.target.contains(completedTasksBtn)) {
      document.body.setAttribute("data-sort", "completed");
    } else if (event.target.contains(allTasksBtn)) {
      document.body.setAttribute("data-sort", "all");
    }
  }

  function cancelDeleteTask() {
    const delCard = document.querySelector("li[data-delete]");
    delCard.removeAttribute("data-delete");
  }

  function deleteTask() {
    const delCard = document.querySelector("li[data-delete]");

    delCard.remove();

    tasks = tasks.filter(
      el => el["_id"] !== delCard.querySelector("input[type=checkbox]").id
    );

    updateStorage(tasks);
    checkTasksLength();
  }

  function moduleKeyController(event) {
    if (event.target.contains(cancelBtnModal)) {
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
          cancelBtnModal.focus();
          break;
        default:
      }
    }
  }

  form.addEventListener("submit", addNewTask);

  allTasksBtn.addEventListener("click", filterTasks);
  completedTasksBtn.addEventListener("click", filterTasks);

  closeBtnModal.addEventListener("click", cancelDeleteTask);
  cancelBtnModal.addEventListener("click", cancelDeleteTask);
  deleteBtnModal.addEventListener("click", deleteTask);

  cancelBtnModal.addEventListener("keydown", moduleKeyController);
  deleteBtnModal.addEventListener("keydown", moduleKeyController);

  // init tasks from array
  tasks.forEach(el => {
    const card = cardTemplate(el);
    list.append(card);
  });
})();
