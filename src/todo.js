function Todo(name, state) {
	this.name = name;
	this.state = state;
}

var todos = [];
var states = ["active", "inactive", "done"];
var tabs = ["all"].concat(states);
var currentTab = "all";

var form = document.getElementById("new-todo-form");
var input = document.getElementById("new-todo-title");

form.onsubmit = function (event) {
	event.preventDefault();
	if (input.value && input.value.length) {
		todos.push(new Todo(input.value, "active"));
		input.value = "";
		localStorage.setItem("todos", JSON.stringify(todos));
		renderTodos();
	}
};

function swap(oldPosition, newPosition) {
	var next = todos[newPosition];
	var prev = todos[oldPosition];

	todos[oldPosition] = next;
	todos[newPosition] = prev;
	localStorage.setItem("todos", JSON.stringify(todos));
	renderTodos();
}

var buttons = [
	{ action: "done", icon: "ok" },
	{ action: "active", icon: "plus" },
	{ action: "inactive", icon: "minus" },
	{ action: "up", icon: "chevron-up" },
	{ action: "down", icon: "chevron-down" },
	{ action: "remove", icon: "trash" },
];

function renderTodos() {
	var todoList = document.getElementById("todolist");
	
	todoList.innerHTML = "";
	todos
		.filter(function (todo) {
			return todo.state === currentTab || currentTab === "all";
		})
		.forEach(function (todo) {
			var div1 = document.createElement("div");
			div1.className = "row";

			var div2 = document.createElement("div");
			div2.innerHTML =
				'<a class="list-group-item" href="#">' + todo.name + "</a>";
			div2.className = "col-xs-6 col-sm-9 col-md-10";

			var div3 = document.createElement("div");
			div3.className = "col-xs-6 col-sm-3 col-md-2 btn-group text-right";

			buttons.forEach(function (button) {
				var btn = document.createElement("button");
				btn.className = "btn btn-default btn-xs";
				btn.innerHTML =
					'<i class="glyphicon glyphicon-' + button.icon + '"></i>';
				div3.appendChild(btn);

				if (button.action === todo.state) {
					btn.disabled = true;
				}

				if (button.action === "remove") {
					btn.title = "Remove";
					btn.onclick = function () {
						if (
							confirm(
								"Are you sure you want to delete the item titled " +
									todo.name
							)
						) {
							todos.splice(todos.indexOf(todo), 1);
							localStorage.setItem(
								"todos",
								JSON.stringify(todos)
							);
							renderTodos();
						}
					};
				} else if (button.action === "down") {
					btn.title = "Move down";
					btn.onclick = function () {
						// move the item down the todos list

						var currentIndex = todos.indexOf(todo);
						if (
							currentTab === "all" &&
							currentIndex < todos.length - 1
						) {
							//swap
							swap(currentIndex, currentIndex + 1);
						} else
							for (
								var i = currentIndex + 1;
								i < todos.length;
								i++
							) {
								if (todos[i].state === todo.state) {
									//swap
									swap(currentIndex, i);
									break;
								}
							}
					};
				} else if (button.action === "up") {
					btn.title = "Move up";
					btn.onclick = function () {
						// move the item down the todos list
						var currentIndex = todos.indexOf(todo);
						if (currentTab === "all" && currentIndex > 0) {
							//swap
							swap(currentIndex, currentIndex - 1);
						} else {
							for (var i = currentIndex - 1; i > 0; i--) {
								if (todos[i].state === todo.state) {
									//swap
									swap(currentIndex, i);
									break;
								}
							}
						}
					};
				} else {
					btn.title = "Mark as " + button.action;
					btn.onclick = function () {
						todo.state = button.action;
						localStorage.setItem("todos", JSON.stringify(todos));
						renderTodos();
					};
				}
			});

			div1.appendChild(div2);
			div1.appendChild(div3);

			todoList.appendChild(div1);
		});

	var myTabs = document.getElementsByClassName("todo-tab");
	var allActiveTabs = 0;
	var allInActiveTabs = 0;
	var allDoneTabs = 0;

	for (var i = 0; i < todos.length; i++) {
		switch (todos[i].state) {
			case "active":
				allActiveTabs++;
				break;
			case "inactive":
				allInActiveTabs++;
				break;
			case "done":
				allDoneTabs++;
				break;
		}
	}

	for (var i = 0; i < myTabs.length; i++) {
		var tabName = myTabs[i].getAttribute("data-tab-name");
		if (tabName === "all") {
			myTabs[i].getElementsByClassName("badge")[0].innerHTML =
				todos.length;
		} else if (tabName === "active") {
			myTabs[i].getElementsByClassName("badge")[0].innerHTML =
				allActiveTabs;
		} else if (tabName === "inactive") {
			myTabs[i].getElementsByClassName("badge")[0].innerHTML =
				allInActiveTabs;
		} else {
			myTabs[i].getElementsByClassName("badge")[0].innerHTML =
				allDoneTabs;
		}
	}
}

todos = JSON.parse(localStorage.getItem("todos"));
if (todos === null) {
	todos = [];
}
else
renderTodos();

function selectTab(element) {
	var tabName = element.attributes["data-tab-name"].value;
	currentTab = tabName;
	var todoTabs = document.getElementsByClassName("todo-tab");
	for (var i = 0; i < todoTabs.length; i++) {
		todoTabs[i].classList.remove("active");
	}
	element.classList.add("active");
	renderTodos();
}