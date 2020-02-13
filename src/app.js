const tasks = [
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
  const allTasksBtn = document.querySelector("#showAll");
  const completedTasksBtn = document.querySelector("#showCompleted");

  function toogleEmptyList() {
    const list = document.querySelector(".list-group");

    if (list.children.length === 0) {
      list.insertAdjacentHTML(
        "beforeend",
        '<div class="alert alert-warning mt-2 d-flex flex-wrap" role="alert">List with tasks is empty now. Please, add new task.</div>'
      );
    } else if (list.contains(document.querySelector(".alert"))) {
      document.querySelector(".alert").remove();
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

  function changeTaskStatus(event) {
    const task = event.target.closest(".list-group-item");

    if (event.target.checked === true) {
      task.dataset.taskStatus = "done";
    } else {
      task.dataset.taskStatus = "inprogress";
    }
  }

  function deleteTask(event) {
    const listItem = event.target.parentElement;
    const closeModalBtn = modal.querySelector(".close");
    const cancelBtn = modal.querySelector(".btn-secondary");
    const deleteBtn = modal.querySelector(".btn-danger");
    
    // modal-open

    // modal.classList.add("show");
    // modal.style.display = "block";

    // document.body.classList.add("modal-open");
    // document.body.style.paddingRight = "17px";
    // document.body.insertAdjacentHTML(
    //   "beforeend",
    //   '<div class="modal-backdrop fade show"></div>'
    // );

    cancelBtn.focus();

    console.log('open')

    // const backdrop = document.querySelector(".modal-backdrop");

    function closeModal() {
      // modal.classList.remove("show");
      // modal.style.display = "none";

      // document.body.classList.remove("modal-open");
      // document.body.style.paddingRight = "";

      // backdrop.remove();
    }

    function removeTask() {
      closeModal();
      listItem.remove();
      toogleEmptyList();
    }

    function moduleKeyController(event) {
      if (event.target.contains(cancelBtn)) {
        switch (event.keyCode) {
          case 9:
            event.preventDefault();
            break;
          case 13:
          case 27:
            closeModal();
            break;
          case 39:
            deleteBtn.focus();
            break;
          default:
        }
      }
      if (event.target.contains(deleteBtn)) {
        switch (event.keyCode) {
          case 9:
            event.preventDefault();
            break;
          case 13:
            removeTask();
            break;
          case 27:
            closeModal();
            break;
          case 37:
            cancelBtn.focus();
            break;
          default:
        }
      }
    }

    closeModalBtn.addEventListener("click", closeModal);
    cancelBtn.addEventListener("click", closeModal);
    deleteBtn.addEventListener("click", removeTask);
    cancelBtn.addEventListener("keydown", moduleKeyController);
    deleteBtn.addEventListener("keydown", moduleKeyController);
  }

  const cardTemplate = function(title, description, status, id = generateId()) {
    const card = document.createElement("li");

    card.classList.add(
      "list-group-item",
      "d-flex",
      "align-items-center",
      "flex-wrap",
      "mt-2"
    );
    card.innerHTML =
      '<span></span><p class="mt-2 w-100"></p><div class="custom-control custom-checkbox"><input type="checkbox" class="custom-control-input"><label class="custom-control-label">Completed</label></div><button type="button" class="btn btn-danger ml-auto delete-btn" data-toggle="modal" data-target="#exampleModalCenter">Delete</button>';

    card.querySelector("span").textContent = title;
    card.querySelector("p").textContent = description;
    card.querySelector("input[type=checkbox]").checked = status;
    card.querySelector("input[type=checkbox]").id = id;
    card.querySelector("label").setAttribute("for", `${id}`);

    card.dataset.taskStatus = status === true ? "done" : "inprogress";

    card.querySelector(".delete-btn").addEventListener("click", deleteTask);
    card
      .querySelector("input[type=checkbox]")
      .addEventListener("input", changeTaskStatus);

    return card;
  };

  (function(obj) {
    obj.forEach(el => {
      const card = cardTemplate(
        el["title"],
        el["body"],
        el["completed"],
        el["_id"]
      );

      list.append(card);
    });
  })(tasks);

  function addNewTask(event) {
    const card = cardTemplate(
      this.title.value,
      this.body.value,
      this.progress.checked
    );

    list.prepend(card);
    event.preventDefault();
    this.reset();
    toogleEmptyList();
  }

  function toogleTasks(event) {
    const listElements = document.querySelectorAll(".list-group-item");
    const completedTask = event.target.contains(completedTasksBtn);

    listElements.forEach(li => {
      if (
        completedTask &&
        li.querySelector("input[type=checkbox]").checked === false
      ) {
        li.classList.remove("d-flex");
        li.classList.add("d-none");
      } else {
        li.classList.remove("d-none");
        li.classList.add("d-flex");
      }
    });

    // filter + "empty message"
  }

  form.addEventListener("submit", addNewTask);

  allTasksBtn.addEventListener("click", toogleTasks);
  completedTasksBtn.addEventListener("click", toogleTasks);

  // init tasks from array

})();
