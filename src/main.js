import "./style.css";


const API_KEY = import.meta.env.VITE_NASA_API_KEY;


const app = document.querySelector("#app");
const title = document.querySelector("#image-title");

const datePicker = document.querySelector("#datepicker");

const previousBtn = document.querySelector("#previous");
const todayBtn = document.querySelector("#today");
const nextBtn = document.querySelector("#next");

const favoriteBtn = document.querySelector("#favorite");
const downloadBtn = document.querySelector("#download");


let currentData = null;



/* ===========================
   HELPERS
=========================== */


function formatDate(date) {

    return date.toISOString().split("T")[0];

}



function loadFavorites() {

    return JSON.parse(
        localStorage.getItem("favorites")
    ) || [];

}



function saveFavorites(favorites) {

    localStorage.setItem(
        "favorites",
        JSON.stringify(favorites)
    );

}





/* ===========================
   FETCH APOD
=========================== */


async function loadAPOD(date = "") {


    app.innerHTML = "<p>Loading...</p>";


    try {


        const response = await fetch(

            `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&date=${date}`

        );


        const data = await response.json();


        currentData = data;


        title.textContent = data.title;


        datePicker.value = data.date;



        let media = "";



        if(data.media_type === "image") {


            media = `

                <img
                    src="${data.url}"
                    alt="${data.title}"
                >

            `;


        } else {


            media = `

                <video controls>

                    <source src="${data.url}">

                </video>

            `;

        }




        app.innerHTML = `

            ${media}

            <p>
                ${data.explanation}
            </p>

        `;



        updateFavoriteButton();



    } catch(error) {


        console.error(error);


        app.innerHTML = `

            <p>
                Error loading APOD.
            </p>

        `;


    }


}







/* ===========================
   FAVORITES
=========================== */


function updateFavoriteButton() {


    const favorites = loadFavorites();



    const exists = favorites.some(

        item => item.date === currentData.date

    );



    if(exists) {


        favoriteBtn.textContent = "♥ Favorited";

        favoriteBtn.classList.add("active");


    } else {


        favoriteBtn.textContent = "♡ Favorite";

        favoriteBtn.classList.remove("active");


    }


}





favoriteBtn.addEventListener(
"click",
()=>{


    if(!currentData) return;



    let favorites = loadFavorites();



    const exists = favorites.some(

        item => item.date === currentData.date

    );




    if(exists) {


        favorites = favorites.filter(

            item => item.date !== currentData.date

        );


    } else {


        // Save only needed information
        favorites.push({

            title: currentData.title,

            date: currentData.date,

            explanation: currentData.explanation,

            url: currentData.url,

            hdurl: currentData.hdurl

        });


    }



    saveFavorites(favorites);



    updateFavoriteButton();



});







/* ===========================
   DOWNLOAD
=========================== */


downloadBtn.addEventListener(
"click",
()=>{


    if(

        !currentData ||

        currentData.media_type !== "image"

    ) return;



    const link =
    document.createElement("a");



    link.href =

    currentData.hdurl || currentData.url;



    link.download =

    `${currentData.title}.jpg`;



    link.click();



});







/* ===========================
   DATE PICKER
=========================== */


datePicker.addEventListener(
"change",
()=>{


    loadAPOD(
        datePicker.value
    );


});







/* ===========================
   NAVIGATION
=========================== */


previousBtn.addEventListener(
"click",
()=>{


    const date = new Date(
        datePicker.value
    );


    date.setDate(
        date.getDate() - 1
    );


    loadAPOD(
        formatDate(date)
    );


});





todayBtn.addEventListener(
"click",
()=>{


    loadAPOD(
        formatDate(new Date())
    );


});





nextBtn.addEventListener(
"click",
()=>{


    const date = new Date(
        datePicker.value
    );


    const today = new Date();



    date.setDate(
        date.getDate() + 1
    );



    if(date <= today) {


        loadAPOD(
            formatDate(date)
        );


    }


});







/* ===========================
   START
=========================== */


loadAPOD(
    formatDate(new Date())
);