import "./index.css";
import Typed from 'typed.js'

type WaitListUserProps = {
  name: string;
  email: string;
};

const waitlistForm = document.getElementById("waitlist-form") as HTMLFormElement;
const submitBtn = document.getElementById("submit-btn") as HTMLButtonElement;
const responseMsg = document.getElementById("response-msg") as HTMLParagraphElement;
const TaScheckbox = document.getElementById("terms-and-services") as HTMLInputElement;

new Typed("#subtitle-animate", {
  strings: ["Sales Robot", "Customer Service Robot"],
  typeSpeed: 50,
  loop: true,
})

const serverURL = "https://hello-yobo-server.onrender.com";

TaScheckbox.onchange = (e) => {
  submitBtn.disabled = !(e.target as HTMLInputElement).checked
}

// Check terms of services from url query parameters
const searchParams = new URLSearchParams(window.location.search)
const toc = searchParams.get("toc");
if(toc) {
  TaScheckbox.checked = true;
  submitBtn.disabled = false;
}

waitlistForm.onsubmit = async (e: SubmitEvent) => {
  e.preventDefault();
  
  const formData = new FormData(e.target as HTMLFormElement);
  const data = Object.fromEntries(formData);
  console.log(data);

  submitBtn.innerText = "Please wait";
  submitBtn.disabled = true;

  addToWaitlist(data as WaitListUserProps)
  .then((res) => {
    if (res.error) notify(res.message, 'error');
    else {
      (e.target as HTMLFormElement).reset();
      notify("Thank you for joining our waitlist, We'll notify you as soon", 'success')
    }
    submitBtn.disabled = false;
    submitBtn.innerText = "Submit";
  });
};

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

function notify(msg:string, type: 'error'|'success') {
  responseMsg.style.backgroundColor = type == 'error' ? "lightsalmon" : "lightgreen";
  responseMsg.style.color = type == 'error' ? "red" : "green";
 
  responseMsg.textContent = msg;

}