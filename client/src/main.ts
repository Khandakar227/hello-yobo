import "./index.css";
import Typed from "typed.js";

type WaitListUserProps = {
  name: string;
  email: string;
};

const waitlistForm = document.getElementById(
  "waitlist-form"
) as HTMLFormElement;
const usernameInput = document.getElementById(
  "username"
) as HTMLInputElement;
const userEmailInput = document.getElementById(
  "useremail"
) as HTMLInputElement;
const submitBtn = document.getElementById("submit-btn") as HTMLButtonElement;
const responseMsg = document.getElementById(
  "response-msg"
) as HTMLParagraphElement;
const TaScheckbox = document.getElementById(
  "terms-and-services"
) as HTMLInputElement;

const videoContainer = document.getElementById(
  "video-container"
) as HTMLDivElement;
const placeholderVideo = document.querySelector(
  '[data-name="placeholder-video"]'
) as HTMLDivElement;
const yoboVideo = document.getElementById("yobo-video") as HTMLVideoElement;

new Typed("#subtitle-animate", {
  strings: ["Sales Robot", "Customer Service Robot"],
  typeSpeed: 50,
  loop: true,
});

const serverURL = "http://localhost:8001";

TaScheckbox.onchange = (e) => {
  submitBtn.disabled = !(e.target as HTMLInputElement).checked;
};

// Check terms of services from url query parameters
const searchParams = new URLSearchParams(window.location.search);
const toc = searchParams.get("toc");
if (toc) {
  TaScheckbox.checked = true;
  submitBtn.disabled = false;

  const userName = localStorage.getItem('name');
  const userEmail = localStorage.getItem('email');
  
  if (userName) usernameInput.value = userName || '';
  if (userEmail) userEmailInput.value = userEmail || '';
}

usernameInput.onchange=(e)=>{
  if (!(e.target as HTMLInputElement)?.value) return;
  localStorage.setItem("name", (e.target as HTMLInputElement).value)
}

userEmailInput.onchange=(e)=>{
  if (!(e.target as HTMLInputElement)?.value) return;
  localStorage.setItem("email", (e.target as HTMLInputElement).value)
}

waitlistForm.onsubmit = async (e: SubmitEvent) => {
  e.preventDefault();

  const formData = new FormData(e.target as HTMLFormElement);
  const data = Object.fromEntries(formData);
  console.log(data);

  submitBtn.innerText = "Please wait";
  submitBtn.disabled = true;

  addToWaitlist(data as WaitListUserProps).then((res) => {
    if (res.error) notify(res.message, "error");
    else {
      (e.target as HTMLFormElement).reset();
      notify(
        "Thank you for joining our waitlist, We'll notify you soon",
        "success"
      );
    }

    submitBtn.disabled = false;
    submitBtn.innerText = "Submit";
    localStorage.clear();
  });
};

initVideoClick();

async function addToWaitlist(data: WaitListUserProps) {
  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };

  return fetch(`${serverURL}/add-to-waitlist`, options)
    .then((response) => response.json())
    .then((response) => response)
    .catch((err) => err);
}

function notify(msg: string, type: "error" | "success") {
  responseMsg.style.backgroundColor =
    type == "error" ? "lightsalmon" : "lightgreen";
  responseMsg.style.color = type == "error" ? "red" : "green";

  responseMsg.textContent = msg;
}

function initVideoClick() {
  if (!videoContainer) return;
  videoContainer.onclick = () => {
    placeholderVideo.style.display = "none";
    if (!yoboVideo) return;
    yoboVideo.style.display = "none";

    const iframe = document.createElement("iframe");
    iframe.src = "https://www.youtube.com/embed/ASwzVaVh9BM?autoplay=1&?loop=1";
    iframe.title = "Hello Yobo Video";
    iframe.width = "600";
    iframe.height = "400";
    iframe.style.minHeight = "15rem";
    iframe.className="rounded-2xl w-full max-w-2xl aspect-video"
    iframe.title="Hello Yobo Video"
    iframe.allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    iframe.allowFullscreen = true

    videoContainer.appendChild(iframe);
  };
}
