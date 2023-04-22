//we can target the form tag directly because there is only one form
const form = document.querySelector('form')!;
const verseContainer = document.getElementById('verse_container')!;

let loadInterval: ReturnType<typeof setInterval>;

//helper method to show a loading modal while waiting for a response
function loadModal(element: HTMLElement) {
  element.textContent = '';

  loadInterval = setInterval(() => {
    element.textContent += '.';
    if (element.textContent === '....') {
      element.textContent = '.';
    }
  }, 400)
}

//helper method to type out verses as if a human were typing them out
function typeText(element: HTMLElement, text: String) {
  let index = 0;

  let interval = setInterval(() => {
    if (index < text.length) {
      if (text.charAt(index) === '\n') {
        element.innerHTML += '<br>';
      } else {
        element.innerHTML += text.charAt(index);
      }
      index++;
    } else {
      clearInterval(interval);
    }
  }, 10);
}

//main method - what to do when the word(s) for search are submitted
const handleSubmit = async (e: Event) => {
  //do not refresh page
  e.preventDefault();

  const data = new FormData(form);
  //fill verse container with verses from response - but first, put the loading modal in
  loadModal(verseContainer);
  form.reset();

  const promptText: string | undefined = data.get('prompt')?.toString();

  //fetch data from server for the verse container
  const response = await fetch(
	`https://esv-smile.onrender.com/api/esv/${promptText}`,
    //`http://localhost:3000/api/esv/${promptText}`, 
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }
  )

  clearInterval(loadInterval);
  verseContainer.innerHTML = '';

  if(response.ok) {
    const data = await response.json();
    let parsedData = "";
    for (let i = 0; i < data.length; i++) {
      parsedData += data[i].content + "\n" + data[i].reference + "\n";
    }
      
    
    //TODO remove console log
    console.log(parsedData);
    console.log({parsedData});
    typeText(verseContainer, parsedData);
  } else {
    const err = await response.text();

    verseContainer.innerHTML = "Something went wrong";
    //TODO remove console log
    console.log(err);
    alert(err);
  }
}

//event listeners to trigger main API call
form.addEventListener('submit', handleSubmit);
/*form.addEventListener('keyup', (e) => {
  if(e.keyCode === 13) { //13 = enter key
    handleSubmit(e);
  }
});*/

export { };