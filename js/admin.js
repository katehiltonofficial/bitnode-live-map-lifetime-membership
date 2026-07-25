
const ADMIN_PASSWORD = "Bitnode2026!";
const STORAGE_KEY = "bitnodeMembers";
let selectedIndex = null;

const loginView = document.getElementById("loginView");
const dashboardView = document.getElementById("dashboardView");

document.getElementById("loginBtn").addEventListener("click", login);
document.getElementById("adminPassword").addEventListener("keydown", e => {
  if (e.key === "Enter") login();
});

function login() {
  const password = document.getElementById("adminPassword").value;
  if (password !== ADMIN_PASSWORD) return alert("Incorrect admin password.");
  sessionStorage.setItem("bitnodeAdminAuthenticated", "yes");
  showDashboard();
}

function showDashboard() {
  loginView.classList.add("hidden");
  dashboardView.classList.remove("hidden");
  render();
}

document.getElementById("logoutBtn").addEventListener("click", () => {
  sessionStorage.removeItem("bitnodeAdminAuthenticated");
  dashboardView.classList.add("hidden");
  loginView.classList.remove("hidden");
  document.getElementById("adminPassword").value = "";
});

function getMembers() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
}

function saveMembers(members) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(members));
}

function render() {
  const members = getMembers();
  const tbody = document.getElementById("membersTable");
  tbody.innerHTML = "";

  members.forEach((member, index) => {
    const tr = document.createElement("tr");
    const statusClass = member.status.toLowerCase();
    const loginText = member.assignedUsername
      ? `${member.assignedUsername} / ${member.assignedPassword}`
      : "Not assigned";

    tr.innerHTML = `
      <td>${escapeHtml(member.fullName)}</td>
      <td>${escapeHtml(member.email)}</td>
      <td>${escapeHtml(member.membership)}</td>
      <td>${escapeHtml(member.amount)} USDT</td>
      <td><button class="btn btn-secondary" onclick="viewScreenshot(${index})">View</button></td>
      <td><span class="status ${statusClass}">${escapeHtml(member.status)}</span></td>
      <td>${escapeHtml(loginText)}</td>
      <td>
        <div class="actions">
          <button class="btn btn-success" onclick="setStatus(${index}, 'Approved')">Approve</button>
          <button class="btn btn-danger" onclick="setStatus(${index}, 'Rejected')">Reject</button>
          <button class="btn btn-warning" onclick="openLoginModal(${index})">Assign Login</button>
        </div>
      </td>`;
    tbody.appendChild(tr);
  });

  document.getElementById("totalCount").textContent = members.length;
  document.getElementById("pendingCount").textContent = members.filter(m => m.status === "Pending").length;
  document.getElementById("approvedCount").textContent = members.filter(m => m.status === "Approved").length;
}

window.setStatus = (index, status) => {
  const members = getMembers();
  members[index].status = status;
  saveMembers(members);
  render();
};

window.openLoginModal = index => {
  const members = getMembers();
  selectedIndex = index;
  document.getElementById("assignedUsername").value = members[index].assignedUsername || "";
  document.getElementById("assignedPassword").value = members[index].assignedPassword || "";
  document.getElementById("loginModal").classList.remove("hidden");
};

document.getElementById("cancelLoginModal").addEventListener("click", () => {
  document.getElementById("loginModal").classList.add("hidden");
});

document.getElementById("saveLoginBtn").addEventListener("click", () => {
  const username = document.getElementById("assignedUsername").value.trim();
  const password = document.getElementById("assignedPassword").value.trim();
  if (!username || !password) return alert("Enter both username and password.");

  const members = getMembers();
  members[selectedIndex].assignedUsername = username;
  members[selectedIndex].assignedPassword = password;
  saveMembers(members);
  document.getElementById("loginModal").classList.add("hidden");
  render();
});

window.viewScreenshot = index => {
  const members = getMembers();
  document.getElementById("imagePreview").src = members[index].screenshot;
  document.getElementById("imageModal").classList.remove("hidden");
};

document.getElementById("closeImageModal").addEventListener("click", () => {
  document.getElementById("imageModal").classList.add("hidden");
});

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

if (sessionStorage.getItem("bitnodeAdminAuthenticated") === "yes") {
  showDashboard();
}
