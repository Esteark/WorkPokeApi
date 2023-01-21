//Obtenemos la informacion del pokemon
let offset = 0;
let Urlpoke = `https://pokeapi.co/api/v2/pokemon/?limit=4&offset=${offset}`;

let Pokemons = [];

const getPokemons = async (url) => {
  Pokemons = [];
  try {
    const {
      data: { results },
    } = await axios.get(url);
    console.log(results);
    //Recorremos el array resultante con un for of
    let index = 0;
    for (const pokemon of results) {
      const { data } = await axios.get(pokemon.url);
      const newPoke = {
        name: pokemon.name,
        id: data.id,
        height: data.height,
        weight: data.weight,
        type: data.types,
        img: data.sprites.other["official-artwork"].front_default,
        level: data.base_experience,
        icon: data.sprites.versions["generation-vii"].icons.front_default,
        ability: data.abilities,
      };
      Pokemons.push(newPoke);
    }
    RenderPoke(Pokemons[0]);
    let arraysplit = Pokemons.slice(0, 4);
    renderpokeFooter(arraysplit);
  } catch (error) {
    alert("Ocurrio un error al intentar procesar la solicitud");
  }
};

const RenderPoke = (objectPoke) => {
  //Cambiamos el icono del header
  main.querySelector(".iconPoke").src = objectPoke.icon;
  //cambiamos la imagen del pokemon
  main.querySelector(".imgPoke").src = objectPoke.img;
  //Cambiamos el nombre del pokemon
  main.querySelector("#namePoke").textContent = objectPoke.name;
  //Cambiamos el numero del pokemon
  main.querySelector("#idPoke").textContent = objectPoke.id;
  //Cambiamos el nivel del pokemon
  main.querySelector("#levelPoke").textContent = objectPoke.level;
  //Ponemos los tipos del pokemon
  main.querySelector("#typePoke").textContent = rendertype(objectPoke.type);
  //Ponemos las habilidades del pokemon
  main.querySelector("#abilityPoke").textContent = renderabilitiesPoke(
    objectPoke.ability
  );
  //Cambiamos la altura del pokemon
  main.querySelector("#heightPoke").textContent = objectPoke.height;
  //Cambiamos el peso del pokemon
  main.querySelector("#weightPoke").textContent = objectPoke.weight;
};

const rendertype = (arraytype) => {
  let tipo = "";
  arraytype.forEach((item) => {
    tipo += `${item.type.name} `;
  });
  return tipo;
};

const renderabilitiesPoke = (arrayabi) => {
  let habilidad = "";
  arrayabi.forEach((item) => {
    habilidad += `${item.ability.name} `;
  });
  return habilidad;
};

//Capturamos el main para poderlo manipular
const main = document.querySelector(".main-container");
const SecOtherPokes = document.getElementById("SecOtherPokes");

const renderpokeFooter = (array) => {
  SecOtherPokes.innerHTML = "";
  array.forEach((poke) => {
    SecOtherPokes.innerHTML += ` <figure id="${poke.id}">
          <img
            src="${poke.img}"
            alt="pokemon"
            id="${poke.id}"
          />
        </figure>`;
  });
};

//Evento Click en la seccion footer
SecOtherPokes.addEventListener("click", (e) => {
  if (e.target.localName == "img" || e.target.localName == "figure") {
    let arrayfiltro = Pokemons.filter((pokemon) => pokemon.id == e.target.id);
    RenderPoke(arrayfiltro[0]);
  }
});

//Evento click del boton siguiente

const btn_next = document.querySelector(".btn_next");
const btn_prev = document.querySelector(".btn_prev");
btn_next.addEventListener("click", () => {
  //La paginacion (offset puede llegar como a numero maximo a 1276 si es que el limite es 4)
  // Pero vemos evidenciado que mas o menos cuando offset llega a 800 presenta errores el GET
  if (offset <= 800) {
    offset += 4;
    Urlpoke = `https://pokeapi.co/api/v2/pokemon/?limit=4&offset=${offset}`;
    getPokemons(Urlpoke);
    console.log(Urlpoke);
    console.log(offset);
  }
});

btn_prev.addEventListener("click", () => {
  if (offset > 1) {
    offset -= 4;
    Urlpoke = `https://pokeapi.co/api/v2/pokemon/?limit=4&offset=${offset}`;
    getPokemons(Urlpoke);
    console.log(Urlpoke);
    console.log(offset);
  }
});

document.addEventListener("DOMContentLoaded", () => {
  getPokemons(Urlpoke);
});
