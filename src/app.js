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

const form = document.querySelector("form[name=addTask]");
const list = document.querySelector(".list-group");
const modal = document.querySelector("#exampleModalCenter");
const allTasksBtn = document.querySelector("#showAll");
const completedTasksBtn = document.querySelector("#showCompleted");

const cardTemplate = function(title, description, status) {
  const card = document.querySelector(".list-group-item").cloneNode(true);
  const checkbox = card.querySelector("input[type=checkbox]");
  const label = card.querySelector("label");
  let idCounter = list.children.length;

  card.querySelector("span").textContent = title;
  card.querySelector("p").textContent = description;

  checkbox.checked = status;
  card.dataset.taskStatus = checkbox.checked === true ? "done" : "inprogress";

  const createId = function(value) {
    const id = checkbox.id.replace(/\d+/, `${value + 1}`);

    return id;
  };

  checkbox.id = createId(idCounter);
  label.setAttribute("for", createId(idCounter));

  idCounter++;

  return card;
};

(function(obj) {
  obj.forEach(el => {
    const card = cardTemplate(el.title, el.body, el.completed);
    list.append(card);
  });
})(tasks);

function addNewTask(event) {
  const card = cardTemplate(
    document.querySelector("#title").value,
    document.querySelector("#body").value,
    document.querySelector("#completed").checked
  );

  list.append(card);
  event.preventDefault();
  event.target.reset();
}

function changeTaskBackground(event) {
  const cardCheckbox =
    event.target.type === "checkbox" &&
    event.target.closest(".list-group-item");

  if (!cardCheckbox) return;

  const task = event.target.closest(".list-group-item");

  if (event.target.checked === true) {
    task.dataset.taskStatus = "done";
  } else {
    task.dataset.taskStatus = "inprogress";
  }
}

function deleteTask(event) {
  const cardBtn = event.target.classList.contains("delete-btn");

  if (!cardBtn) return;

  const listItem = event.target.parentElement;

  modal.classList.add("show");
  modal.style.display = "block";

  document.body.classList.add("modal-open");
  document.body.style.paddingRight = "17px";
  document.body.insertAdjacentHTML(
    "beforeend",
    '<div class="modal-backdrop fade show"></div>'
  );

  const backdrop = document.querySelector(".modal-backdrop");

  function closeModal() {
    modal.classList.remove("show");
    modal.style.display = "none";

    document.body.classList.remove("modal-open");
    document.body.style.paddingRight = "";

    backdrop.remove();
  }

  function removeTask() {
    closeModal();
    listItem.remove();
  }

  modal.querySelector(".close").addEventListener("click", closeModal);
  modal.querySelector(".btn-secondary").addEventListener("click", closeModal);
  modal.querySelector(".btn-danger").addEventListener("click", removeTask);
}

function toogleTask(event) {
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
}

form.addEventListener("submit", addNewTask);

document.addEventListener("click", deleteTask);
document.addEventListener("input", changeTaskBackground);

allTasksBtn.addEventListener("click", toogleTask);
completedTasksBtn.addEventListener("click", toogleTask);
