document.addEventListener("DOMContentLoaded", () => {
	const tableBody = document.querySelector("#eventsTable tbody");
	const addRowBtn = document.getElementById("addRowBtn");
	const templateRow = document.getElementById("newEventTemplate");

	function addRow() {
		if (tableBody.querySelector(".editing")) return;
		const newRow = templateRow.cloneNode(true);
		newRow.removeAttribute("id");
		newRow.classList.remove("d-none");
		newRow.classList.add("editing");
		newRow.dataset.new = "true";
		tableBody.appendChild(newRow);
	}

	function editRow(row) {
		if (tableBody.querySelector(".editing")) return;
		row.classList.add("editing");

		const descInput = row.querySelector("td:nth-child(1) input.edit");
		const dateInput = row.querySelector("td:nth-child(2) input.edit");
		const timeInput = row.querySelector("td:nth-child(3) input.edit");

		const descSpan = row.querySelector("td:nth-child(1) .view");
		const dateSpan = row.querySelector("td:nth-child(2) .view");
		const timeSpan = row.querySelector("td:nth-child(3) .view");

		descInput.value = descSpan.textContent;
		dateInput.value = dateSpan.textContent;
		timeInput.value = timeSpan.textContent;

		descInput.classList.remove("d-none");
		dateInput.classList.remove("d-none");
		timeInput.classList.remove("d-none");

		descSpan.classList.add("d-none");
		dateSpan.classList.add("d-none");
		timeSpan.classList.add("d-none");

		row.querySelector(".actions-view").classList.add("d-none");
		row.querySelector(".actions-edit").classList.remove("d-none");
	}

	function saveRow(row) {
		const descInput = row.querySelector("td:nth-child(1) input.edit");
		const dateInput = row.querySelector("td:nth-child(2) input.edit");
		const timeInput = row.querySelector("td:nth-child(3) input.edit");

		const payload = {
			id: row.dataset.id || null,
			description: descInput.value,
			date: dateInput.value,
			time: timeInput.value
		};

		fetch("/events/save", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(payload)
		})
			.then(res => res.json())
			.then(data => {
				row.dataset.id = data.id;
				row.querySelector("td:nth-child(1) .view").textContent = data.description;
				row.querySelector("td:nth-child(2) .view").textContent = data.date;
				row.querySelector("td:nth-child(3) .view").textContent = data.time;
				cancelEdit(row, true);
			})
			.catch(err => alert("Error saving event: " + err));
	}

	function cancelEdit(row, saved = false) {
		const descInput = row.querySelector("td:nth-child(1) input.edit");
		const dateInput = row.querySelector("td:nth-child(2) input.edit");
		const timeInput = row.querySelector("td:nth-child(3) input.edit");

		const descSpan = row.querySelector("td:nth-child(1) .view");
		const dateSpan = row.querySelector("td:nth-child(2) .view");
		const timeSpan = row.querySelector("td:nth-child(3) .view");

		if (!saved && row.dataset.new === "true") {
			row.remove();
			return;
		}

		descInput.classList.add("d-none");
		dateInput.classList.add("d-none");
		timeInput.classList.add("d-none");

		descSpan.classList.remove("d-none");
		dateSpan.classList.remove("d-none");
		timeSpan.classList.remove("d-none");

		row.querySelector(".actions-view").classList.remove("d-none");
		row.querySelector(".actions-edit").classList.add("d-none");
		row.classList.remove("editing");
	}

	function deleteRow(row) {
		if (!row.dataset.id) return;
		if (!confirm("Delete this event?")) return;

		fetch(`/events/delete/${row.dataset.id}`, { method: "DELETE" })
			.then(() => row.remove())
			.catch(err => alert("Error deleting event: " + err));
	}

	addRowBtn.addEventListener("click", addRow);

	tableBody.addEventListener("click", (e) => {
		const row = e.target.closest("tr");
		if (!row) return;

		if (e.target.closest(".edit-btn")) editRow(row);
		if (e.target.closest(".save-btn")) saveRow(row);
		if (e.target.closest(".cancel-btn")) cancelEdit(row);
		if (e.target.closest(".delete-btn")) deleteRow(row);
	});
});
