//Obtenemos la informacion del pokemon
let offset = 0;
let Urlpoke = `https://pokeapi.co/api/v2/pokemon/?limit=4&offset=${offset}`;

const SecCard = document.querySelector(".SecCard");

const showLoader = () => {
  SecCard.style.display = "flex";
  SecCard.classList.remove("animate__fadeOut");
  SecCard.classList.add("animate__fadeIn");
};
const hideLoader = () => {
  SecCard.classList.remove("animate__fadeIn");
  SecCard.classList.add("animate__fadeOut");
  setTimeout(() => {
    SecCard.style.display = "none";
  }, 1000);
};

showLoader();

const ShowAlert = (mensaje) => {
  Toastify({
    text: `${mensaje}`,
    duration: 3000,
    style: {
      background: "linear-gradient(to right, #e93515, #e99809)",
    },
    onClick: function () {}, // Callback after click
  }).showToast();
};

const getPokemons = async (url) => {
  let Pokemons = [];
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
    return Pokemons;
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
const imgPoke = document.querySelector(".imgPoke");

const animationImg = () => {
  imgPoke.classList.add("animate__tada");
  setTimeout(() => {
    imgPoke.classList.remove("animate__tada");
  }, 600);
};

const renderpokeFooter = (array) => {
  SecOtherPokes.innerHTML = "";
  if (array.length != 0) {
    array.forEach((poke) => {
      SecOtherPokes.innerHTML += ` <figure id="${poke.id}">
          <img
            src="${poke.img}"
            alt="pokemon"
            id="${poke.id}"
          />
        </figure>`;
    });
  } else {
    SecOtherPokes.innerHTML +=
      "<h2>No encontramos ningún pokemon con el filtro usado</h2>";
  }
};

let PokemonsFooter = [];

//Evento Click en la seccion footer
SecOtherPokes.addEventListener("click", async (e) => {
  if (e.target.localName == "img" || e.target.localName == "figure") {
    console.log(Urlpoke);
    if (PokemonsFooter.length == 0) {
      let arrayPoke = await getPokemons(Urlpoke);
      let arrayfiltro = arrayPoke.filter((poke) => poke.id == e.target.id);
      RenderPoke(arrayfiltro[0]);
    } else {
      let arrayfiltro = PokemonsFooter.filter((poke) => poke.id == e.target.id);
      RenderPoke(arrayfiltro[0]);
    }
    animationImg();
  }
});

//Evento click del boton siguiente

const btn_next = document.querySelector(".btn_next");
const btn_prev = document.querySelector(".btn_prev");
btn_next.addEventListener("click", async () => {
  //La paginacion (offset puede llegar como a numero maximo a 1276 si es que el limite es 4)
  // Pero vemos evidenciado que mas o menos cuando offset llega a 800 presenta errores el GET
  if (offset <= 800) {
    offset += 4;
    Urlpoke = `https://pokeapi.co/api/v2/pokemon/?limit=4&offset=${offset}`;
    let arrayPoke = await getPokemons(Urlpoke);
    RenderPoke(arrayPoke[0]);
    renderpokeFooter(arrayPoke);
    animationImg();

    SecOtherPokes.classList.add("animate__fadeIn");
  }
  setTimeout(() => {
    SecOtherPokes.classList.remove("animate__fadeIn");
  }, 500);
});

btn_prev.addEventListener("click", async () => {
  if (offset > 1) {
    offset -= 4;
    Urlpoke = `https://pokeapi.co/api/v2/pokemon/?limit=4&offset=${offset}`;
    let arrayPoke = await getPokemons(Urlpoke);
    RenderPoke(arrayPoke[0]);
    renderpokeFooter(arrayPoke);
    animationImg();
    SecOtherPokes.classList.add("animate__fadeIn");
  }
  setTimeout(() => {
    SecOtherPokes.classList.remove("animate__fadeIn");
  }, 500);
});

//Evento click del boton para filtrar pokemones
const form = document.querySelector("form");
const btnclear = document.getElementById("btnclear");
btnclear.style.visibility = "hidden";

//Evento del boton para limpiar el filtro

btnclear.addEventListener("click", async () => {
  showLoader();
  btnclear.style.visibility = "hidden";
  PokemonsFooter = [];
  offset = 0;
  Urlpoke = `https://pokeapi.co/api/v2/pokemon/?limit=4&offset=${offset}`;
  let arrayPoke = await getPokemons(Urlpoke);
  RenderPoke(arrayPoke[0]);
  renderpokeFooter(arrayPoke);
  btn_next.style.visibility = "visible";
  btn_prev.style.visibility = "visible";
  txtfilter.value = "";
  setTimeout(() => {
    hideLoader();
  }, 2000);
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const txtfilter = document.getElementById("txtfilter");
  if (txtfilter.value) {
    showLoader();
    btn_next.style.visibility = "hidden";
    btn_prev.style.visibility = "hidden";
    offset = 0;
    Urlpoke = `https://pokeapi.co/api/v2/pokemon/?limit=300&offset=${offset}`;
    let arraypoke = await getPokemons(Urlpoke);
    let arrayfilter = arraypoke.filter((poke) =>
      poke.name.toLowerCase().includes(txtfilter.value.toLowerCase())
    );
    PokemonsFooter = arrayfilter.slice(0, 4);
    renderpokeFooter(PokemonsFooter);
    btnclear.style.visibility = "visible";
    setTimeout(() => {
      hideLoader();
    }, 2000);
  } else {
    ShowAlert("No dejes el campo de búsqueda vacío por favor");
  }
});

document.addEventListener("DOMContentLoaded", async () => {
  let Pokemons = await getPokemons(Urlpoke);
  RenderPoke(Pokemons[0]);
  renderpokeFooter(Pokemons);
  setTimeout(() => {
    hideLoader();
  }, 2000);
});
