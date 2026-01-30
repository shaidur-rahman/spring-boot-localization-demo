document.addEventListener("DOMContentLoaded", () => {
	const { DateTime } = luxon;
	const tableBody = document.querySelector("#eventsTable tbody");
	const addRowBtn = document.getElementById("addRowBtn");
	const templateRow = document.getElementById("newEventTemplate");

	function initializeRow(row) {
		const dateInput = row.querySelector(".event-date");
		const timeInput = row.querySelector(".event-time");
		const isoDateTimeInput = row.querySelector(".offset-date-time");

		const { date, time } = formatToLocalDateAndTime(isoDateTimeInput.value);
		dateInput.value = date;
		timeInput.value = time;

		[dateInput, timeInput].forEach(el => {
			el.addEventListener('change', () => updateIsoDateTimeField());
			el.addEventListener('focusout', () => updateIsoDateTimeField());
		});

		function updateIsoDateTimeField() {
			const isoFormattedDate = formatToIso(dateInput.value, timeInput.value);
			isoDateTimeInput.value = isoFormattedDate;
		}
	}

	function formatToLocalDateAndTime(isoDateTime) {
		if (!isoDateTime) {
			return { date: '', time: '' };
		}

		const dt = DateTime.fromISO(isoDateTime, { zone: 'local' });
		return {
			date: dt.toISODate(),
			time: dt.toFormat('HH:mm')
		};
	}

	function formatToIso(dateValue, timeValue) {
		if (!dateValue && !timeValue) {
			return '';
		}
		if (!dateValue) { // set current local date if empty
			dateValue = DateTime.local().toISODate(); // yyyy-MM-dd
		}
		if (!timeValue) { // set current local time if empty
			timeValue = DateTime.local().toFormat('HH:mm');
		}

		const dt = DateTime.fromISO(`${dateValue}T${timeValue}`, { zone: 'local' }).set({});
		if (!dt.isValid) {
			console.warn('Invalid date-time:', dateValue, timeValue, dt.invalidReason);
			return '';
		}

		// ISO 8601 with offset (e.g. 2026-01-26T15:51:00+06:00)
		return dt.toISO();
	}

	function addRow() {
		if (tableBody.querySelector(".editing")) return;
		const newRow = templateRow.cloneNode(true);
		newRow.removeAttribute("id");
		newRow.classList.remove("d-none");
		newRow.classList.add("editing");
		newRow.dataset.new = "true";

		const descInput = newRow.querySelector(".event-desc");
		const dateInput = newRow.querySelector(".event-date");
		const timeInput = newRow.querySelector(".event-time");
		descInput.disabled = false;
		dateInput.disabled = false;
		timeInput.disabled = false;

		initializeRow(newRow);
		tableBody.appendChild(newRow);
	}

	function editRow(row) {
		if (tableBody.querySelector(".editing")) return;

		row.classList.add("editing");
		row.dataset.new = "false";

		const descInput = row.querySelector(".event-desc");
		const dateInput = row.querySelector(".event-date");
		const timeInput = row.querySelector(".event-time");

		descInput.disabled = false;
		dateInput.disabled = false;
		timeInput.disabled = false;

		row.querySelector(".actions-view").classList.add("d-none");
		row.querySelector(".actions-edit").classList.remove("d-none");

		initializeRow(row);
	}

	function saveRow(row) {
		const descInput = row.querySelector(".event-desc");
		const hiddenInput = row.querySelector(".offset-date-time");

		const payload = {
			id: row.dataset.id || null,
			description: descInput.value,
			eventTime: hiddenInput.value
		};

		fetch("/events/save", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(payload)
		})
			.then(res => res.json())
			.then(data => {
				row.dataset.id = data.id;
				descInput.value = data.description;
				hiddenInput.value = data.eventTime;

				cancelEdit(row, true);
			})
			.catch(err => alert("Error saving event: " + err));
	}

	function cancelEdit(row, saved = false) {
		const descInput = row.querySelector(".event-desc");
		const dateInput = row.querySelector(".event-date");
		const timeInput = row.querySelector(".event-time");

		if (!saved && row.dataset.new === "true") {
			row.remove();
			return;
		}

		descInput.disabled = true;
		dateInput.disabled = true;
		timeInput.disabled = true;

		row.querySelector(".actions-view").classList.remove("d-none");
		row.querySelector(".actions-edit").classList.add("d-none");
		row.classList.remove("editing");

		// reset inputs from hidden ISO
		const hiddenInput = row.querySelector(".offset-date-time");
		const dt = DateTime.fromISO(hiddenInput.value || '', { zone: 'local' });
		if (dt.isValid) {
			dateInput.value = dt.toISODate();
			timeInput.value = dt.toFormat('HH:mm');
		}
	}

	function deleteRow(row) {
		if (!row.dataset.id) {
			row.remove();
			return;
		}
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

	// Initialize existing rows
	document.querySelectorAll(".date-time-input-pair").forEach(initializeRow);
});
