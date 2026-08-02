import "./style.css";


const container = document.querySelector("#favorites-list");



function getFavorites() {

    return JSON.parse(

        localStorage.getItem("favorites")

    ) || [];

}






function displayFavorites() {


    const favorites = getFavorites();



    if(favorites.length === 0) {


        container.innerHTML = `

            <p class="empty-message">
                No favorite images yet.
            </p>

        `;


        return;

    }






    container.innerHTML = favorites.map(item => `



        <article class="favorite-card">



            <img

                src="${item.hdurl || item.url}"

                alt="${item.title}"

            >




            <div class="favorite-card-content">



                <h2>
                    ${item.title}
                </h2>




                <p>
                    ${item.date}
                </p>




                <p>
                    ${item.explanation.substring(0,180)}...
                </p>




                <button

                    class="remove-btn"

                    data-date="${item.date}"

                >

                    Remove

                </button>



            </div>



        </article>



    `).join("");



}








container.addEventListener(
"click",
(event)=>{


    if(
        event.target.classList.contains("remove-btn")
    ){


        const date =
        event.target.dataset.date;



        let favorites =
        getFavorites();



        favorites =
        favorites.filter(

            item => item.date !== date

        );



        localStorage.setItem(

            "favorites",

            JSON.stringify(favorites)

        );



        displayFavorites();


    }


});







displayFavorites();