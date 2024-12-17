document.addEventListener("DOMContentLoaded", () => {
    let currentId = 1;
    const pokemonContainer = document.getElementById("pokemon-container");
    const prevButton = document.getElementById("prev-button");
    const nextButton = document.getElementById("next-button");

    let totalPokemon = 0; 

    async function fetchTotalPokemon() {
        try {
            const response = await fetch("http://localhost:8002/api/count");

            if (!response.ok) {
                throw new Error("Total number of Pokémon not found");
            }

            const data = await response.json();
            totalPokemon = data.cnt; 
        } catch (error) {
            console.log('Error fetching total count:', error);
        }
    }

    async function fetchPokemon(id) {
        try {
            const response = await fetch(`http://localhost:8002/api/pokemon/${id}`);

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const data = await response.json();
            console.log(data);
            displayPokemons(data);
            updateButtons(id);
        } catch (error) {
            console.log("Error fetching Pokémon:", error);
            pokemonContainer.innerHTML = `<p>Error fetching Pokémon: ${error.message}</p>`;
        }
    }

    function displayPokemons(data) {

        const pokemonData = data.data;

        pokemonContainer.innerHTML = `
        <div class="pokemon-card">
            <h3>${pokemonData.name}</h3>
            <p><b>ID</b>: ${pokemonData.poke_id}</p>
            <p><b>Type</b>: ${pokemonData.type.join(', ')}</p> <!-- Join types for display -->
            <p><b>Height</b>: ${pokemonData.height}</p>
            <p><b>Weight</b>: ${pokemonData.weight} lbs</p>
            <p><b>Category</b>: ${pokemonData.category}</p>
            <p><b>Abilities</b>: ${pokemonData.abilities.length > 0 ? pokemonData.abilities.join(', ') : 'None'}</p>
            <p><b>Weaknesses</b>: ${pokemonData.weakness.length > 0 ? pokemonData.weakness.join(', ') : 'None'}</p>
            <img src="${pokemonData.image}" alt="${pokemonData.name}" style="width: 100%">
        </div>
    `;
    }

    function updateButtons(id) {
        prevButton.disabled = (id <= 1);
        nextButton.disabled = (id >= totalPokemon);
    }

    
    prevButton.addEventListener("click", () => {
        if (currentId > 1) { 
            currentId--;
            fetchPokemon(currentId);
        }
    });

    nextButton.addEventListener("click", () => {
        if (currentId < totalPokemon) { 
            currentId++;
            fetchPokemon(currentId);
        }
    });

    // Fetch total Pokémon count and then fetch the first Pokémon
    fetchTotalPokemon().then(() => {
        fetchPokemon(currentId); 
    });
});
