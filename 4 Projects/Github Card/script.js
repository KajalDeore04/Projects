const card1 = document.querySelector('.card1')

const requestURL = 'https://api.github.com/users/KajalDeore04'
    const xhr = new XMLHttpRequest()

    xhr.open('GET', requestURL)
    xhr.onreadystatechange = function () {
        console.log(xhr.readyState);
        if (xhr.readyState === 4) {
            const data = JSON.parse(this.responseText); 
    
        card1.innerHTML += `<img src="${data.avatar_url}"></img>`;
        card1.innerHTML += `<h2>${data.login}</h2>`;
        card1.innerHTML += `<h4>Followers : ${data.followers}</h4>`;  
        card1.innerHTML += `<h6>${data.bio}</h6>`;  
        }
    }

    xhr.send();

    