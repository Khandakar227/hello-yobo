import './index.css'

const waitlistForm = document.getElementById('waitlist-form') as HTMLFormElement;

waitlistForm.onsubmit = (e:SubmitEvent) => {
  e.preventDefault();
  const formData = new FormData(e.target as HTMLFormElement)
  const data = Object.fromEntries(formData);
  console.log(data);
}