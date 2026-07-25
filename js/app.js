
const STORAGE_KEY = "bitnodeMembers";

const form = document.getElementById("membershipForm");
const stepOne = document.getElementById("stepOne");
const stepTwo = document.getElementById("stepTwo");
const successMessage = document.getElementById("successMessage");
const progress2 = document.getElementById("progress2");

document.getElementById("continueBtn").addEventListener("click", () => {
  const fullName = document.getElementById("fullName");
  const email = document.getElementById("email");
  const membership = document.querySelector('input[name="membership"]:checked');

  if (!fullName.checkValidity()) return fullName.reportValidity();
  if (!email.checkValidity()) return email.reportValidity();
  if (!membership) return alert("Please select a membership.");

  document.getElementById("selectedAmount").textContent = `${membership.value} USDT`;
  stepOne.classList.add("hidden");
  stepTwo.classList.remove("hidden");
  progress2.classList.add("active");
});

document.getElementById("copyBtn").addEventListener("click", async () => {
  const wallet = document.getElementById("walletAddress");
  try {
    await navigator.clipboard.writeText(wallet.value);
  } catch {
    wallet.select();
    document.execCommand("copy");
  }
  alert("Wallet address copied.");
});

form.addEventListener("submit", event => {
  event.preventDefault();

  const membership = document.querySelector('input[name="membership"]:checked');
  const file = document.getElementById("paymentScreenshot").files[0];

  if (!file) return alert("Please upload the payment screenshot.");
  if (file.size > 2 * 1024 * 1024) return alert("Please upload an image smaller than 2 MB.");

  const reader = new FileReader();
  reader.onload = () => {
    const members = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    members.push({
      id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      fullName: document.getElementById("fullName").value.trim(),
      email: document.getElementById("email").value.trim(),
      membership: membership.value === "199" ? "Crypto Learn & Earn" : "Standard",
      amount: membership.value,
      screenshot: reader.result,
      status: "Pending",
      assignedUsername: "",
      assignedPassword: "",
      createdAt: new Date().toISOString()
    });

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(members));
    } catch {
      return alert("Browser storage is full. Try a smaller screenshot or clear old submissions.");
    }

    form.classList.add("hidden");
    successMessage.classList.remove("hidden");
  };
  reader.readAsDataURL(file);
});
