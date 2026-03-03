/* ===================================
   SUPABASE INITIALIZATION
   =================================== */

/* Your Supabase credentials */

const SUPABASE_URL = "https://ftujdjdibmofbullnlhh.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_lIlQdoFNzpKQV0NxpNbq6g_KdXX1SaO";

/* Create Supabase client */
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
// alert("Supabase initialized");




/* ===================================
   FLOATING ACTION BUTTON TOGGLE LOGIC
   =================================== */

/* Select main FAB button */
const fabToggle = document.getElementById("fabToggle");

/* Select FAB container */
const fabContainer = document.querySelector(".fab-container");

/* Toggle menu on click */
fabToggle.addEventListener("click", function () {

    /* Adds or removes the 'active' class */
    fabContainer.classList.toggle("active");

});

/* ===================================
   NAME MODAL LOGIC
   =================================== */

/* Select elements */
const nameModal = document.getElementById("nameModal");
const openNameBtn = document.querySelector(".fab-option");
/* Select delete option */
const deleteOption = document.getElementById("deleteOption");

const closeNameModal = document.getElementById("closeNameModal");

/* Open modal when clicking "Enter Name" */
openNameBtn.addEventListener("click", function () {

    nameModal.style.display = "flex";

    /* Close FAB menu */
    fabContainer.classList.remove("active");

});

/* Close modal when clicking Cancel */
closeNameModal.addEventListener("click", function () {

    nameModal.style.display = "none";
    fabContainer.classList.remove("active");


});


/* ===================================
   ATTACH ADD ENTRY LOGIC (CENTRALIZED)
   =================================== */
function attachAddEntryLogic(logCard, name) {

    const addBtn = logCard.querySelector(".add-entry-btn");

    addBtn.addEventListener("click", function (e) {

        e.stopPropagation();

        const tbody = logCard.querySelector("tbody");

        if (tbody.querySelector(".input-row")) {
            return;
        }

        const inputRow = document.createElement("tr");
        inputRow.classList.add("input-row");

        inputRow.innerHTML = `
            <td>
                <div class="input-group">
                    <input type="text" class="time-input" placeholder="Enter time">
                    <button class="save-time-btn">Save</button>
                </div>
            </td>
            <td></td>
            <td></td>
        `;

        tbody.appendChild(inputRow);

        const saveBtn = inputRow.querySelector(".save-time-btn");
        const timeInput = inputRow.querySelector(".time-input");

        saveBtn.addEventListener("click", function () {

            const timeValue = timeInput.value.trim();
            // if (timeValue === "") return;

            inputRow.children[0].innerHTML = timeValue;

            inputRow.children[1].innerHTML = `
                <div class="input-group">
                    <input type="text" class="task-input" placeholder="Enter task">
                    <button class="save-task-btn">Save</button>
                </div>
            `;

            const saveTaskBtn = inputRow.querySelector(".save-task-btn");
            const taskInput = inputRow.querySelector(".task-input");

            saveTaskBtn.addEventListener("click", function () {

                const taskValue = taskInput.value.trim();
                // if (taskValue === "") return;

                inputRow.children[1].innerHTML = taskValue;

                inputRow.children[2].innerHTML = `
                    <div class="input-group">
                        <input type="text" class="DescribeWork-input" placeholder="Enter DescribeWork">
                        <button class="save-DescribeWork-btn">Save</button>
                    </div>
                `;

                const saveDescribeWorkBtn = inputRow.querySelector(".save-DescribeWork-btn");
                const DescribeWorkInput = inputRow.querySelector(".DescribeWork-input");

                saveDescribeWorkBtn.addEventListener("click", async function () {

                    const DescribeWorkValue = DescribeWorkInput.value.trim();
                    // if (DescribeWorkValue === "") return;

                    inputRow.children[2].innerHTML = DescribeWorkValue;

                    const entryData = {
                        name: name,
                        date: new Date().toISOString().split("T")[0], // Stores YYYY-MM-DD automatically
                        time: inputRow.children[0].innerText,
                        task: inputRow.children[1].innerText,
                        DescribeWork: DescribeWorkValue
                    };

                    let data;

                    try {
                        const response = await supabaseClient
                            .from("daily_logs")
                            .insert([entryData])
                            .select();

                        if (response.error) {
                            throw response.error;
                        }

                        data = response.data;

                    } catch (err) {
                        alert("Failed to save entry. Please try again.");
                        return;
                    }

                    if (data && data.length > 0) {
                        await fetchLogs();
                    }

                });

            });

        });

    });
}


/* ===================================
   SAVE NAME → CREATE LOG CARD
   =================================== */

/* Select save button */
const saveNameBtn = document.getElementById("saveNameBtn");

/* Select input field */
const nameInput = document.getElementById("nameInput");

/* Select main container */
const logContainer = document.getElementById("logContainer");

/* On Save click */
saveNameBtn.addEventListener("click", function () {

    const nameValue = nameInput.value.trim();

    /* Prevent empty name */
    if (nameValue === "") {
        alert("Please enter a name.");
        return;
    }

    /* Create main card */
    const logCard = document.createElement("div");
    logCard.classList.add("log-card");

    /* Insert HTML structure */
    logCard.innerHTML = `
        <div class="log-card-header">
            <div class="name-group">
                <span>${nameValue}</span>
                <button class="add-entry-btn">+</button>
            </div>

            <span class="dropdown-icon">▼</span>
        </div>

        <div class="log-card-content">
            <table class="log-table">
                <thead>
                    <tr>
                        <th>Time</th>
                        <th>I Was Focused On</th>
                        <th>Describe The Work Done</th>
                    </tr>
                </thead>
                <tbody>
                </tbody>
            </table>
        </div>
    `;

    /* Toggle dropdown on click */
    logCard.addEventListener("click", function (e) {

        if (
            e.target.classList.contains("delete-checkbox") ||
            e.target.closest("input") ||
            e.target.closest("button")
        ) {
            return;
        }

        logCard.classList.toggle("active");

        const addBtn = logCard.querySelector(".add-entry-btn");

        if (logCard.classList.contains("active")) {
            addBtn.style.display = "inline-block";
        } else {
            addBtn.style.display = "none";

            /* REMOVE unsaved input row when collapsing */
            const inputRow = logCard.querySelector(".input-row");
            if (inputRow) {
                inputRow.remove();
            }
        }
    });

    /* Add card to page */
    logContainer.appendChild(logCard);





    /* ===================================
   ADD ENTRY BUTTON LOGIC (STEP 1)
   =================================== */

    attachAddEntryLogic(logCard, nameValue);





    /* Clear input */
    nameInput.value = "";

    /* Close modal */
    nameModal.style.display = "none";
});


/* ===================================
   CLOSE FAB WHEN CLICKING OUTSIDE
   =================================== */

document.addEventListener("click", function (event) {

    /* If click is outside fab-container */
    if (!fabContainer.contains(event.target)) {
        fabContainer.classList.remove("active");
    }

});



/* ===================================
   DELETE MODE LOGIC
   =================================== */
const deleteActionBar = document.getElementById("deleteActionBar");
const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
let deleteMode = false;
deleteOption.addEventListener("click", function () {

    const cards = document.querySelectorAll(".log-card");

    /* If no entries, exit */
    if (cards.length === 0) {
        return;
    }

    fabContainer.classList.remove("active");

    /* If already in delete mode → turn it OFF */
    if (deleteMode) {

        deleteMode = false;
        deleteActionBar.style.display = "none";

        cards.forEach(card => {
            card.classList.remove("delete-mode");

            const checkbox = card.querySelector(".delete-checkbox");
            if (checkbox) {
                checkbox.remove();
            }
        });

        return;
    }

    /* Otherwise turn delete mode ON */
    deleteMode = true;

    cards.forEach(card => {

        card.classList.add("delete-mode");

        if (!card.querySelector(".delete-checkbox")) {
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.classList.add("delete-checkbox");

            const header = card.querySelector(".log-card-header");
            header.prepend(checkbox);
        }

    });

    deleteActionBar.style.display = "block";
});

/* Confirm delete */
confirmDeleteBtn.addEventListener("click", async function () {

    const cards = document.querySelectorAll(".log-card");
    let anySelected = false;

    for (const card of cards) {

        const checkbox = card.querySelector(".delete-checkbox");

        if (checkbox && checkbox.checked) {

            anySelected = true;

            const rows = card.querySelectorAll("tbody tr");

            let deleteFailed = false;

                for (const row of rows) {

                    const rowId = row.getAttribute("data-id");

                    if (rowId) {
                        try {
                            const response = await supabaseClient
                                .from("daily_logs")
                                .delete()
                                .eq("id", rowId);

                            if (response.error) {
                                throw response.error;
                            }

                        } catch (err) {
                            alert("Failed to delete entry. Please try again.");
                            deleteFailed = true;
                        }
                    }
                }

                if (!deleteFailed) {
                    card.remove();
                }
        }
    }

    /* If nothing selected, do NOT exit delete mode */
    if (!anySelected) {
        return;
    }

    /* Exit delete mode only if something was deleted */
    deleteMode = false;
    deleteActionBar.style.display = "none";

    /* Remove delete styling and checkboxes from remaining cards */
    const remainingCards = document.querySelectorAll(".log-card");

    remainingCards.forEach(card => {
        card.classList.remove("delete-mode");

        const checkbox = card.querySelector(".delete-checkbox");
        if (checkbox) {
            checkbox.remove();
        }
    });
    await fetchLogs();
});

/* ===================================
   FETCH DATA ON PAGE LOAD
   =================================== */

async function fetchLogs() {

    try {

        let data;

        try {
            const response = await supabaseClient
                .from("daily_logs")
                .select("*");

            console.log("Supabase raw response:", response);

            if (response.error) {
                console.error("Supabase select error:", response.error);
                throw response.error;
            }

            data = response.data;

            console.log("Fetched rows count:", data ? data.length : 0);

        } catch (err) {
            alert("Failed to load data. Please refresh the page.");
            return;
        }

        /* Clear existing UI before rendering */
        /* Store currently open cards before clearing */
        const openCards = [];
        document.querySelectorAll(".log-card.active").forEach(card => {
            const nameSpan = card.querySelector(".name-group span");
            if (nameSpan) {
                openCards.push(nameSpan.innerText);
            }
        });

        /* Clear existing UI before rendering */
        logContainer.innerHTML = "";



        /* Group logs by name → then by date */
        const grouped = {};

        data.forEach(row => {

            if (!grouped[row.name]) {
                grouped[row.name] = {};
            }

            const entryDate = row.date || new Date().toISOString().split("T")[0];

            if (!grouped[row.name][entryDate]) {
                grouped[row.name][entryDate] = [];
            }

            grouped[row.name][entryDate].push(row);
        });



        /* Create cards for each name */
        Object.keys(grouped).forEach(name => {

            const logCard = document.createElement("div");
            logCard.classList.add("log-card");

            logCard.innerHTML = `
                <div class="log-card-header">
                    <div class="name-group">
                        <span>${name}</span>
                        <button class="add-entry-btn">+</button>
                    </div>
                    <span class="dropdown-icon">▼</span>
                </div>

                <div class="log-card-content">
                    <table class="log-table">
                        <thead>
                            <tr>
                                <th>Time</th>
                                <th>I Was Focused On</th>
                                <th>Describe The Work Done</th>
                            </tr>
                        </thead>
                        <tbody>
                        </tbody>
                    </table>
                </div>
            `;

            logContainer.appendChild(logCard);
            /* Restore open state if this card was previously open */
            if (openCards.includes(name)) {
                logCard.classList.add("active");

                const addBtn = logCard.querySelector(".add-entry-btn");
                if (addBtn) {
                    addBtn.style.display = "inline-block";
                }
            }

            /* Insert rows into table grouped by date */
            const tbody = logCard.querySelector("tbody");

            /* Loop through each date */
            Object.keys(grouped[name])
                .sort((a, b) => new Date(a) - new Date(b))
                .forEach(date => {

                /* ---- INSERT DATE ROW FIRST ---- */
                const dateRow = document.createElement("tr");
                dateRow.classList.add("date-row");

                dateRow.innerHTML = `
                    <td colspan="3" class="date-cell">
                        <span>${date}</span>
                    </td>
                `;

                tbody.appendChild(dateRow);

                /* ---- THEN INSERT ENTRIES OF THAT DATE ---- */
                grouped[name][date].forEach(entry => {

                    const row = document.createElement("tr");

                    row.setAttribute("data-id", entry.id);

                    row.innerHTML = `
                        <td>${entry.time || ""}</td>
                        <td>${entry.task || ""}</td>
                        <td>${entry.DescribeWork || ""}</td>
                    `;

                    tbody.appendChild(row);

                });

            });

            /* Toggle dropdown on click */
            logCard.addEventListener("click", function (e) {

                if (
                    e.target.classList.contains("delete-checkbox") ||
                    e.target.closest("input") ||
                    e.target.closest("button")
                ) {
                    return;
                }

                logCard.classList.toggle("active");

                const addBtn = logCard.querySelector(".add-entry-btn");

                if (logCard.classList.contains("active")) {
                    addBtn.style.display = "inline-block";
                } else {
                    addBtn.style.display = "none";

                    /* REMOVE unsaved input row when collapsing */
                    const inputRow = logCard.querySelector(".input-row");
                    if (inputRow) {
                        inputRow.remove();
                    }
                }

            });

            /* ===================================
                ADD ENTRY BUTTON LOGIC (RE-ATTACH AFTER FETCH)
                =================================== */

                attachAddEntryLogic(logCard, name);
        });





    } catch (err) {
        console.error("fetchLogs crashed:", err);
    }

}

/* Run fetch when page loads */
document.addEventListener("DOMContentLoaded", function () {
    fetchLogs();
});