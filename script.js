const dialogueText = document.getElementById('dialogue-text');
const nextButton = document.getElementById('next-button');
const background = document.getElementById('background');
const characters = document.getElementById('characters');
const audioButton = document.getElementById('audio-button');
const dialogueBox = document.getElementById('dialogue-box');
const audioIcon = document.getElementById('audio-icon');
const nametext=document.getElementById('name-text');
const savebutton=document.getElementById('save-button');
const chargebutton=document.getElementById('charge-button');
const resetbutton=document.getElementById('reset-button');
const backgroundImage = document.getElementById('background-image');
const character1 = document.getElementById('character1');
const character2 = document.getElementById('character2');
const buttonGroup1 = document.getElementById('botones');
const botones = [document.getElementById('button1'), document.getElementById('button2')];
/*Guardado*/
function adjustSprites() {
    const sprites = document.querySelectorAll('.character-sprite');
    const container = document.querySelector('.story-container');
    const containerHeight = container.clientHeight;
    
    sprites.forEach(sprite => {
        // Ajusta altura máxima al 70% del contenedor
        sprite.style.maxHeight = `${containerHeight * 0.7}px`;
    });
}

// Ejecutar al cargar y al redimensionar
window.addEventListener('load', adjustSprites);
window.addEventListener('resize', adjustSprites);
let cancion='../assets/Music/三騎士.ogg';
let audio = new Audio(cancion);
audio.loop = true;
audio.muted = true;
let datos=[0,[],0,0,0]; //0=escena, 1=opciones tomadas, 2=la decision en la que se va,3=afecto de Liora, 4=Afecto de thalia 
let currentScene=0;
let todos = JSON.parse(localStorage.getItem("datos"));//Verifica si hay datos guardados
if (todos==null){
    let string =JSON.stringify(datos);
    localStorage.setItem("datos",string); //Crea el storage para los datos
}

/*let string =JSON.stringify(datos)*/
/*localStorage.setItem("datos",string)*/


//Logica de las escenas
function escena() {

    //Limpiar personajes
    character1.classList.toggle('hidden', scene[currentScene].character1 == "");
    character2.classList.toggle('hidden', scene[currentScene].character2 == "");
    if(scene[currentScene].cancion && scene[currentScene].cancion !== "") {
        audio.pause();
        audio.currentTime = 0;
        ad=false;
        if(audio.muted){
            ad=true;
        }
        audio = new Audio(scene[currentScene].cancion);
        audio.loop = true;
        audio.play();
        if(ad){
            audio.muted=true;
        }
    }
    //Vifurcación
    if(scene[currentScene].tree!="" && scene[currentScene].tree!=null){
        if(scene[currentScene].tree[datos[1][datos[2]-1]-1].cancion && scene[currentScene].tree[datos[1][datos[2]-1]-1].cancion !== "") {
        audio.pause();
        audio.currentTime = 0;
        ad=false;
        if(audio.muted){
            ad=true;
        }
        audio = new Audio(scene[currentScene].tree[datos[1][datos[2]-1]-1].cancion);
        audio.loop = true;
        audio.play();
        if(ad){
            audio.muted=true;
        }
    }    
    if (scene[currentScene].tree[datos[1][datos[2]-1]-1].affection!="" && scene[currentScene].tree[datos[1][datos[2]-1]-1].affection!=null){
        if(scene[currentScene].tree[datos[1][datos[2]-1]-1].affection==1){
            datos[4]+=1
        }
        else{
            datos[3]+=1
        }
    }
    if (scene[currentScene].tree[datos[1][datos[2]-1]-1].plus!="" && scene[currentScene].tree[datos[1][datos[2]-1]-1].plus!=null){
        currentScene+=scene[currentScene].tree[datos[1][datos[2]-1]-1].plus
    }
    if (scene[currentScene].tree[datos[1][datos[2]-1]-1].choices!="" && scene[currentScene].tree[datos[1][datos[2]-1]-1].choices!=null){
        buttonGroup1.classList.remove('hidden');
        botones[0].textContent=scene[currentScene].tree[datos[1][datos[2]-1]-1].choices[0];
        botones[1].textContent=scene[currentScene].tree[datos[1][datos[2]-1]-1].choices[1];
    }
    //Afecto
    if (scene[currentScene].tree[datos[1][datos[2]-1]-1].affection!="" && scene[currentScene].tree[datos[1][datos[2]-1]-1].affection!=null){
        if (scene[currentScene].tree[datos[1][datos[2]-1]-1].affection==0){
            datos[3]+=1;
        }
        else{
            datos[4]+=1;
        }
    }
    
    backgroundImage.src=scene[currentScene].tree[datos[1][datos[2]-1]-1].background;
    character1.src=scene[currentScene].tree[datos[1][datos[2]-1]-1].character1;
    character2.src=scene[currentScene].tree[datos[1][datos[2]-1]-1].character2;
    dialogueText.textContent=scene[currentScene].tree[datos[1][datos[2]-1]-1].text;
    nametext.textContent=scene[currentScene].tree[datos[1][datos[2]-1]-1].name;
    } 
    //Si no hay vifurcación
    else{
    //Detector de opciones, para mostrarse
    if (scene[currentScene].choices!="" && scene[currentScene].choices!=null){
        buttonGroup1.classList.remove('hidden');
        botones[0].textContent=scene[currentScene].choices[0];
        botones[1].textContent=scene[currentScene].choices[1];
    }
    //Afecto
    if (scene[currentScene].affection!="" && scene[currentScene].affection!=null){
        if (scene[currentScene].affection==0){
            datos[3]+=1;
        }
        else{
            datos[4]+=1;
        }
    }
    
    backgroundImage.src=scene[currentScene].background;
    character1.src=scene[currentScene].character1;
    character2.src=scene[currentScene].character2;
    dialogueText.textContent=scene[currentScene].text;
    nametext.textContent=scene[currentScene].name;
    }
    currentScene+=1;
    //dialogueText.textContent=datos; //Verificador de guardado
}

//
function handleButtonClick(buttonId) {
    datos[2]+=1;
    
    if(buttonId==1){
        datos[1].push(1);
    }
    else{
        datos[1].push(2);
    }
    
    buttonGroup1.classList.add('hidden');
    escena();
}

botones.forEach((button, index) => {
    button.addEventListener('click', () => handleButtonClick(index + 1));
});

//Si los botones se muestran regresar la escena
dialogueBox.addEventListener('click', () => {
    if (!buttonGroup1.classList.contains('hidden')) return;
    escena();
});


//audio
audioButton.addEventListener('click', () => {
    if (audio.paused) {
        audio.play();
        audio.muted = false;
        audioIcon.src = '../assets/icons/unmute.png'; // Imagen de sonido activado
    }
    else if (audio.muted) {
        // Si el audio está muteado, lo desmutea
        audio.muted = false;
        audioIcon.src = "../assets/icons/unmute.png"; // Cambia a la imagen de altavoz activo
        } 
     else {
        audio.muted = !audio.muted;
        audioIcon.src = audio.muted ? '../assets/icons/mute.png' : '../assets/icons/unmute.png'; // Cambiar entre imágenes
    }
});


//guardado
savebutton.addEventListener('click', () =>{
    if(currentScene==0){datos[0]=0}
    else{datos[0]=currentScene-1;}
    let string =JSON.stringify(datos);
    localStorage.setItem("datos",string);
    });


//Reset
resetbutton.addEventListener('click', () =>{
    localStorage.removeItem("datos");
    currentScene=0;
    dialogueText.textContent="Juego reiniciado, da click para iniciar";
    character1.classList.toggle('hidden');
    character2.classList.toggle('hidden');
    backgroundImage.src="../assets/Background/City.jpg";
    nametext.textContent="";

})

//cargar datos
chargebutton.addEventListener('click', () =>{
    todos = JSON.parse(localStorage.getItem("datos"));
    datos=todos;
    currentScene=todos[0];
    escena();
})

/*Audio*/ 




//Escenas
const scene=[
{
    name: "",
    text: "Regresando de la academia mágica, me di cuenta que olvidé mi cuaderno. Realmente no me importa, tampoco es que tome apuntes, pero va a ser un dolor tener que agradecer a la persona que me lo regrese mañana, espero que no pase.",
    background: "../assets/Background/City.jpg",
    character1: "",
    character2: "",
    choices:[],
    cancion:'../assets/Music/酒場.ogg'
},
{
    name: "",
    text: "Tras unos minutos de estar caminando llegue a mi destino, la taberna del gremio, no es el lugar más bonito de todos, ni el que tiene a las personas más agradables, pero venden la cerveza más barata de la ciudad.",
    background: "../assets/Background/tavern.jpg",
    character1: "",
    character2: "",
    choices:[]
},
{
    name: "",
    text: "Tras abrir las puertas, me encontré con el usual cantinero, el cual estaba limpiando la barra, pero fue alertado de mi presencia por la campana al entrar.",
    background: "../assets/Background/tavern.jpg",
    character1: "",
    character2: "",
    choices:[]
    
},
{
    name: "Cantinero",
    text: "Bienvenida, que le puedo servir.",
    background: "../assets/Background/tavern.jpg",
    character1: "",
    character2: "../assets/Characters/Cantinero_sprite1.png",
    choices:[]
},
{
    name: "",
    text: "Tras decir esas palabras, el cantinero levantó la vista viendo a Kaelith.",
    background: "../assets/Background/tavern.jpg",
    character1: "",
    character2: "../assets/Characters/Cantinero_sprite1.png",
    choices:[]
},
{
    name: "Cantinero",
    text: "Si solo eres tú, ¿lo mismo que siempre?",
    background: "../assets/Background/tavern.jpg",
    character1: "",
    character2: "../assets/Characters/Cantinero_sprite1.png",
    choices:[]
},
{
    name: "Kaelith",
    text: "Sí, gracias.",
    background: "../assets/Background/tavern.jpg",
    character1: "../assets/Characters/Kaelith_sprite1.png",
    character2: "",
    choices:[]
},
{
    name: "Kaelith",
    text: "Viendo alrededor era capaz de ver la misma taberna de siempre, un gran salón, con mesas de madera que habían visto mejores días y un candelabro fuera de lugar, mientras que veía varios grupos de aventureros celebrando sus victorias, mercenarios a punto de estafar a un pobre ingrato con sus servicios y señoritas de la vida nocturna llevándose a unos jóvenes a los cuartos.",
    background: "../assets/Background/tavern.jpg",
    character1: "",
    character2: "",
    choices:[]
},
{
    name: "Kaelith",
    text: "Odiaba ese lugar, aunque era el que vendía la mejor cerveza al mejor precio, 'es insoportable', pensé, intento mantenerme calmada ante la cantidad de escoria en el lugar, por suerte León o era Pedro, bueno realmente no importa, es bastante rápido con mi pedido.",
    background: "../assets/Background/tavern.jpg",
    character1: "",
    character2: "",
    choices:[]
},
{
    name: "",
    text: "Tras echar un vistazo a mi alrededor quede deslumbrada al ver una hermosa mujer, no cuadraba con el lugar, al verla más detenidamente me doy cuenta que es una paladina santa.",
    background: "../assets/Background/tavern.jpg",
    character1: "",
    character2: "",
    choices:[]
},
{
    name: "Kaelith",
    text: "Con una brillante armadura pesada, pulida hasta ser un espejo, unos ojos azules como el cielo y una larga cabellera rubia, la paladina se destacaba, no solo por su imagen, si no por los símbolos que porta. Insignias del santísimo por toda la armadura, aunque realmente no sabría decir si destaca más una paladina del santísimo o una hechicera de la academia de magia.",
    background: "../assets/Background/tavern.jpg",
    character1: "",
    character2: "../assets/Characters/Liora_sprite1.png",
    choices:[]
},
{
    name: "Kaelith",
    text: "Realmente no cuadra en este ambiente. (Me susurre a mí misma).",
    background: "../assets/Background/tavern.jpg",
    character1: "../assets/Characters/Kaelith_sprite1.png",
    character2: "",
    choices:[]
},
{
    name: "Kaelith",
    text: "Ni bien había terminado de hablar cuando veo a mi izquierda a la paladina. Al verla de cerca pude observar una expresión de desesperación, parecía que buscaba algo con urgencia. Aunque realmente no es que me incumba.",
    background: "../assets/Background/tavern.jpg",
    character1: "",
    character2: "",
    choices:[]
},
{
    name: "Kaelith",
    text: "Tras darme cuenta de su expresión, evite el contacto visual, prefiero no tener algo que ver con la iglesia.",
    background: "../assets/Background/tavern.jpg",
    character1: "",
    character2: "",
    choices:[]
},
{
    name: "Liora",
    text: "Es de mala educación ignorar a las personas cuando te llaman, el santísimo te castigará por tus pecados.",
    background: "../assets/Background/tavern.jpg",
    character1: "",
    character2: "../assets/Characters/Liora_sprite1.png",
    choices:[]
},
{
    name: "Kaelith",
    text: "Es una fanática religiosa, tengo que salir de aquí, ¡YA!",
    background: "../assets/Background/tavern.jpg",
    character1: "../assets/Characters/Kaelith_sprite1.png",
    character2: "../assets/Characters/Liora_sprite1.png",
    choices:[]
},
{
    name: "Kaelith",
    text: "Mil disculpas, no pensé que una bella servidora del santísimo tendría que ver algo con una don nadie.",
    background: "../assets/Background/tavern.jpg",
    character1: "../assets/Characters/Kaelith_sprite1.png",
    character2: "../assets/Characters/Liora_sprite1.png",
    choices:[]
},
{
    name: "Liora",
    text: "Mhhhm, como siempre tuvo que ser. ¡pero no esperes que el santísimo te va a perdonar! (Dijo de forma arrogante.)",
    background: "../assets/Background/tavern.jpg",
    character1: "../assets/Characters/Kaelith_sprite1.png",
    character2: "../assets/Characters/Liora_sprite1.png",
    choices:[]
},
{
    name: "Liora",
    text: "Aunque no esperes mi favor, de hecho, estoy en este lugar que perdió el rumbo, buscando un grupo de almas piadosas que quieran emprender un viaje conmigo a la región de Ouphix.",
    background: "../assets/Background/tavern.jpg",
    character1: "../assets/Characters/Kaelith_sprite1.png",
    character2: "../assets/Characters/Liora_sprite1.png",
    choices:[]
},
{
    name: "Kaelith",
    text: "Yo tengo que ir a Ouphix, no me caería mal compañía... pero no de este tipo.",
    background: "../assets/Background/tavern.jpg",
    character1: "",
    character2: "",
    choices:[]
},
{
    name: "Kaelith",
    text: "Disculpa, no soy una aventurera, solo vengo aquí por 'provisiones', estaba por...",
    background: "../assets/Background/tavern.jpg",
    character1:"../assets/Characters/Kaelith_sprite1.png",
    character2: "../assets/Characters/Liora_sprite1.png",
    choices:[]
},
{
    name: "Kaelith",
    text: "Antes de terminar de hablar me interrumpió la campana, en la puerta se encontraba el famoso grupo Indomable Fury. Algunos le dicen bonachones, otros locos, pero yo prefiero llamarlos ingenuos. Ayudando a los demás y dejando la recompensa a aquellos que ayudan, eso no lo haría un loco, es algo que haría un ingenuo, alguien inocente que no conoce la vida.",
    background: "../assets/Background/tavern.jpg",
    character1: "",
    character2: "",
    choices:[]
},
{
    name: "Kaelith",
    text: "Realmente no quiero tener nada que ver con esa gente, empecé a rezar, aunque no creo en el santísimo, si realmente es real, que oiga mis plegarias y que no se acerque ese grupo.",
    background: "../assets/Background/tavern.jpg",
    character1: "",
    character2: "",
    choices:[]
},
{
    name: "Callin Wisestride",
    text: "¡JA JA JA! ¡No es normal ver una paladina del santísimo por estos lugares!",
    background: "../assets/Background/tavern.jpg",
    character1: "",
    character2: "../assets/Characters/Callin_sprite1.png",
    choices:[]
},
{
    name: "Liora",
    text: "Psst y ustedes quienes son, espero que no me hagan perder el tiempo.",
    background: "../assets/Background/tavern.jpg",
    character1: "",
    character2: "../assets/Characters/Liora_sprite1.png",
    choices:[]
},
{
    name: "Callin",
    text: "No sabía que las santas hablaban de esa forma. ¡JA JA JA!, aunque en mi experiencia estoy seguro que buscas algo y es posible que podamos ayudarte.",
    background: "../assets/Background/tavern.jpg",
    character1: "",
    character2: "../assets/Characters/Liora_sprite1.png",
    choices:[]
},
{
    name: "Liora",
    text: "Si tanto insistes, necesito un grupo que me escolte a Ouphix, para explorar las ruinas. Lo haría sola, pero la cardenal insistió. ",
    background: "../assets/Background/tavern.jpg",
    character1: "",
    character2: "../assets/Characters/Liora_sprite1.png",
    choices:[]
},
{
    name: "Kaelith",
    text: "Esta es mi oportunidad de irme, solo necesito mi pedido. Tras ver rápidamente la situación logre observar a una mujer parte del grupo a la cual le llamo la atención la petición de la paladina.",
    background: "../assets/Background/tavern.jpg",
    character1: "",
    character2: "",
    choices:[]
},
{
    name: "Kaelith",
    text: "Aunque antes de ver la resolución de su conversación, llego mi pedido con lo que aproveche a largarme antes de meterme en algún problema.",
    background: "../assets/Background/tavern.jpg",
    character1: "",
    character2: "",
    choices:[]
},
{
    name: "",
    text: "Capítulo 1, fuera de ruta",
    background: "",
    character1: "",
    character2: "",
    choices:[],
    cancion:''
},
{
    name: "Kaelith",
    text: "Como miembro de la academia de magia necesito realizar un proyecto, investigación o ir al frente para poder graduarme. Por recomendación de un conocido decidí realizar una investigación sobre reportes de objetos mágicos en las recién descubiertas ruinas en Ouphix. Así empezó este viaje infernal.",
    background: "../assets/Background/Routes.png",
    character1: "",
    character2: "",
    choices:[]
},
{
    name: "",
    text: "No pensé que me volvería a encontrar con indomable fury y la paladina de hace unas semanas y lo peor es que se supone que están para ayudarme en la investigación. Me niego a creerlo, aunque no tengo mucho que hacer realmente. Puedo soportar un mes, estoy segura de eso, pero la paladina está jugando con mi paciencia…",
    background: "../assets/Background/Routes.png",
    character1: "",
    character2: "",
    choices:[]
},
{
    name: "Liora",
    text: "Uf. ¿Cuántos días llevamos? ¿cinco? ¿siete?",
    background: "../assets/Background/Routes.png",
    character1: "",
    character2: "../assets/Characters/Liora_sprite1.png",
    choices:[]
},
{
    name: "Kaelithh",
    text: "El carruaje crujía como lo hizo los últimos días, se oye el galope de los caballos y tengo a una autoproclamada enviada del Santísimo quejándose del tiempo que llevamos en el carruaje.",
    background: "../assets/Background/Routes.png",
    character1: "",
    character2: "",
    choices:[]
},
{
    name: "Kaelith",
    text: "“Que esperaba, estamos yendo al fin del mundo y todavía tiene el descaro de quejarse”. Me dije para mí misma. ",
    background: "../assets/Background/Routes.png",
    character1:"../assets/Characters/Kaelith_sprite1.png",
    character2: "",
    choices:[]
},
{
    name: "Callin",
    text: "Ya es el quinto día, deberíamos estar llegando a la posada ”última parada” en la noche.",
    background: "../assets/Background/Routes.png",
    character1: "",
    character2:"../assets/Characters/Callin_sprite1.png",
    choices:[]
},
{
    name: "Kaelith",
    text: "Dijo un corpulento hombre que se encuentra sentado a la par mía. Dice haber sobrevivido varias aventuras de grado A, aunque decidió unirse liderar a las nuevas generaciones. Aunque la persona que tengo enfrente parece el villano de muchas novelas épicas que he leído",
    background: "../assets/Background/Routes.png",
    character1: "",
    character2: "",
    choices:[]
},
{
    name: "Arlyse Highgaze",
    text: "Dentro de poco va a oscurecer, nos deberíamos detener, ¿no crees Cavne?",
    background: "../assets/Background/Routes.png",
    character1: "",
    character2:"../assets/Characters/Arlyse_sprite2.png",
    choices:[]
},
{
    name: "Cavne",
    text: "…",
    background: "../assets/Background/Routes.png",
    character1: "",
    character2: "Cavne",
    choices:[]
},
{
    name: "Arlyse",
    text: "¡Cavne, es de mala educación ignorar a los mayores!",
    background: "../assets/Background/Routes.png",
    character1: "",
    character2:"../assets/Characters/Arlyse_sprite2.png",
    choices:[]
},
{
    name: "Cavne",
    text: "uf…",
    background: "../assets/Background/Routes.png",
    character1: "",
    character2: "Cavne",
    choices:[]
},
{
    name: "Kaelith",
    text: "Otra agradable noche, aunque la sorpresa no duro más que el primer día. ",
    background: "../assets/Background/Routes.png",
    character1: "",
    character2: "",
    choices:[]
},
{
    name: "Kaelith",
    text: "La única que parece consciente de lo que ocurre es la cazadora, Thalia, creo que era su nombre. Tampoco es que me importe demasiado, solo necesito encontrar un objeto mágico en las ruinas escribir mi artículo y me aseguro un puesto en la torre de Phyliam, así que prefiero no entablar lazos para esta aventura. ",
    background: "../assets/Background/Routes.png",
    character1: "",
    character2: "",
    choices:[]
},
{
    name: "Callin",
    text: "¿¡Tú no tienes hambre, maga!?",
    background: "../assets/Background/Routes.png",
    character1: "",
    character2:"../assets/Characters/Callin_sprite1.png",
    choices:[]
},
{
    name: "Kaelith",
    text: "Mientras me golpeaba la espalda, dijo Callin con su fuerte voz. No tiene sentido explicarle que no soy una maga, ni que evite el contacto conmigo, estoy segura que no lo entendería.",
    background: "../assets/Background/Routes.png",
    character1: "",
    character2: "",
    choices:[]
},
{
    name: "Kaelith",
    text: "No, no tengo hambre, aunque concuerdo con la señorita Highgaze deberíamos parar, no es seguro seguir por la noche.",
    background: "../assets/Background/Routes.png",
    character1:"../assets/Characters/Kaelith_sprite1.png",
    character2: "",
    choices:[]
},
{
    name: "Callin",
    text: "¡Ya la oiste Cavne un poco más adelante hay una pequeña planicie, acamparemos ahí!",
    background: "../assets/Background/Routes.png",
    character1: "",
    character2:"../assets/Characters/Callin_sprite1.png",
    choices:[]
},
{
    name: "Kaelith",
    text: "Dicho eso Cavne, llevo el carro hacia la planicie y montamos una pequeña hoguera para preparar la cena. Liora no paraba quejarse de solo haber comido provisiones los últimos días. ",
    background: "../assets/Background/Froest.jpg",
    character1: "",
    character2: "",
    choices:[]
},{
    name: "Kaelith",
    text: "Callin rápidamente sugirió hacer un guiso al final quedaban unas horas para que el sol se pusiera, podíamos ir a cazar un animal y recolectar hierbas silvestres. A lo que la mayoría accedió.",
    background: "../assets/Background/Froest.jpg",
    character1: "",
    character2: "",
    choices:[]
},
{
    name: "Kaelith",
    text: "Con esto Callin rápidamente le asigno tareas a cada uno para ayudar con el guiso, justo cuando pensé que me había salvado…",
    background: "../assets/Background/Froest.jpg",
    character1: "",
    character2: "",
    choices:[]
},
{
    name: "Callin",
    text: "Bueno con eso quedamos para la comida, ya saben si pasa algo no duden en activar las bengalas, aunque en mi experiencia, ¡Este bosque es tranquilo! ¡JA JA JA JA!",
    background: "../assets/Background/Froest.jpg",
    character1: "",
    character2: "",
    choices:[]
},
{
    name: "Thalia",
    text: "Vas a ahuyentar a los animales si gritas así. ",
    background: "../assets/Background/Froest.jpg",
    character1: "",
    character2: "../assets/Characters/Thalia_sprite1.png",
    choices:[]
},
{
    name: "Liora",
    text: "¿No sabía que tenías lengua Thalia?",
    background: "../assets/Background/Froest.jpg",
    character1: "",
    character2: "../assets/Characters/Liora_sprite1.png",
    choices:[]
},
{
    name: "Callin",
    text: "Ey Maga! Thalia va a ir a cazar un animal para el guiso y Liora va a ir a recolectar hierbas silvestres, es mejor si no dejamos a nadie solo. Así que ¿A quién quieres acompañar?",
    background: "../assets/Background/Froest.jpg",
    character1: "",
    character2:"../assets/Characters/Callin_sprite1.png",
    choices:["Thalia","Liora"]
},
//Decision 1
{
    cancion:"../assets/Music/不思議の国.ogg",
    tree:[
        {    
        name: "Kaelith",
        text: "Callin se acercó a mí a susurrarme algo, lo cual es extraño considerando su alegre actitud que siempre muestra.",
        background: "../assets/Background/Froest.jpg",
        character1: "",
        character2: "",
        choices:[],
        affection:1},
        {    
        name: "Kaelith",
        text: "Antes de partir, Callin se acercó a susurrarme algo, no era normal viniendo de él. ",
        background: "../assets/Background/Froest.jpg",
        character1: "",
        character2: "",
        choices:[],
        affection:2}
    ]
},
{
    tree:[
        {    
        name: "Callin",
        text: " Maga, intenta llevarte bien con Thalia, no lo ha tenido fácil, pero no intentes indagar donde no te llaman.",
        background: "../assets/Background/Froest.jpg",
        character1: "",
        character2:"../assets/Characters/Callin_sprite1.png",
        choices:[]},
        {    
        name: "Callin",
        text: "Puedes intentar calmar a Liora, no es una mala chica, pero a simple vista se puede ver que la iglesia la ha mimado mucho.",
        background: "../assets/Background/Froest.jpg",
        character1: "",
        character2:"../assets/Characters/Callin_sprite1.png",
        choices:[]}
    ]
},
{
    tree:[
        {    
        name: "Kaelith",
        text: "No me extraña, muchos aventureros son huérfanos, malandros y renegados. Aunque tomare en cuenta su consejo no me conviene tener una mala relación con una compañera.",
        background: "../assets/Background/Froest.jpg",
        character1: "",
        character2: "",
        choices:[]},
        {    
        name: "Kaelith",
        text: "Vere que puedo hacer, no prometo nada.",
        background: "../assets/Background/Froest.jpg",
        character1:"../assets/Characters/Kaelith_sprite1.png",
        character2: "",
        choices:[]}
    ]
},
{
    tree:[
        {    
        name: "Kaelith",
        text: "Entiendo.",
        background: "../assets/Background/Froest.jpg",
        character1:"../assets/Characters/Kaelith_sprite1.png",
        character2: "",
        choices:[]},
        {            
        name: "Kaelith",
        text: "No sé qué me impulso acompañar a Liora, aun sabiendo como era, pero es una oportunidad que no puedo dejar pasar, la iglesia busca muchos magos para sus instalaciones, tal vez si me llevo bien con ella no necesite esta investigación y pueda largarme de esa ciudad.",
        background: "../assets/Background/Froest.jpg",
        character1: "",
        character2: "",
        choices:[]}

    ]
},
{
    tree:[
        {    
        name: "Thalia",
        text: "El sol se va a poner, será mejor apresurarnos.",
        background: "../assets/Background/Froest.jpg",
        character1: "",
        character2: "../assets/Characters/Thalia_sprite1.png",
        choices:[]},
        {    
        name: "Kaelith",
        text: "Tras caminar lo que fueron 20 minutos por el bosque. 20 minutos que parecieron una eternidad, con Liora presumiendo y predicando la palabra del Santísimo. Llegamos a un espacio sin árboles. Un lugar lleno de hierbas y flores, perfecto para condimentar el guiso.",
        background: "../assets/Background/flower.png",
        character1: "",
        character2: "",
        choices:[]}
    ]
},
{
    tree:[
        {    
        name: "Kaelith",
        text: "Voy detrás de ti.",
        background: "../assets/Background/Froest.jpg",
        character1:"../assets/Characters/Kaelith_sprite1.png",
        character2: "",
        choices:[]},
        {    
        name: "Liora",
        text: "Plebeya, recoge las hierbas.",
        background: "../assets/Background/flower.png",
        character1: "",
        character2: "../assets/Characters/Liora_sprite1.png",
        choices:[]
        }

    ]
},
{
    tree:[
        {    
        name: "Kaelith",
        text: "Tras adentrarnos al bosque Thalia iba preparando unas pequeñas trampas, estoy segura que son para atrapar animales pequeños como conejos o roedores.",
        background: "../assets/Background/Forest2.png",
        character1: "",
        character2: "",
        choices:[]},
        {    
        name: "Kelith",
        text: "Que está hablando, a quien cree que se refiere, insoportable.",
        background: "../assets/Background/flower.png",
        character1: "",
        character2: "",
        choices:[]}
    ]
},
{
    tree:[
        {    
        name: "Kaelith",
        text: "Aunque me gusta el silencio el ambiente entre las dos es muy pesado Thalia está en su propio mundo, realmente no sé si fue la opción correcta acompañarla, aunque en comparación con la paladina… Dejando eso de un lado el silencio se vio interrumpido con el sonido de ramas rompiéndose, no muy lejos de donde estábamos.",
        background: "../assets/Background/Forest2.png",
        character1: "",
        character2: "",
        choices:[]},
        {    
        name: "Liora",
        text: "¡Plebeya no me oíste!",
        background: "../assets/Background/flower.png",
        character1: "",
        character2: "../assets/Characters/Liora_sprite1.png",
        choices:[]}
    ]
},
{
    tree:[
        {    
        name: "Thalia",
        text: "Sígueme, no te hagas de notar.",
        background: "../assets/Background/Forest2.png",
        character1: "",
        character2: "../assets/Characters/Thalia_sprite1.png",
        choices:[]},
        {    
        name: "Kaelith",
        text: "Deberías cuidar tus palabras",
        background: "../assets/Background/flower.png",
        character1:"../assets/Characters/Kaelith_sprite1.png",
        character2: "",
        choices:[],
        cancion:"../assets/Music/ビク.ogg"}
    ]
},
{
    tree:[
        {    
        name: "Kaelith",
        text: "Entendido.",
        background: "../assets/Background/Forest2.png",
        character1:"../assets/Characters/Kaelith_sprite1.png",
        character2: "",
        choices:[]},
        {    
        name: "Liora",
        text: "Ehhhh a quien le hablas con ese tono plebeya, no sabes que estas ante la enviada del Santísimo, crees que puedes hablarme así y salir impune.",
        background: "../assets/Background/flower.png",
        character1: "",
        character2: "../assets/Characters/Liora_sprite1.png",
        choices:[]}
    ]
},
{
    tree:[
        {    
        name: "Kaelith",
        text: "Tras caminar escondidas, logramos vislumbrar lo que parece ser un venado. Un precioso animal de pelaje marrón con manchas blancas y se encontraba a escasos metros de nosotras, pastando.",
        background: "../assets/Background/Forest2.png",
        character1: "",
        character2: "",
        choices:[]},
        {    
        name: "Kaelith",
        text: "Aquí no llega el poder de la iglesia, ¿Segura que quieres jugar a ese juego?",
        background: "../assets/Background/flower.png",
        character1:"../assets/Characters/Kaelith_sprite1.png",
        character2: "",
        choices:[]}
    ]
},
{
    tree:[
        {    
        name: "Thalia",
        text: "Ahí tenemos la cena.",
        background: "../assets/Background/Forest2.png",
        character1: "",
        character2: "../assets/Characters/Thalia_sprite1.png",
        choices:[]},
        {    
        name: "Kaelith",
        text: "Tras terminar de hablar, Liora desenvaino su espada, preparada para pelear, nunca me ha gustado la violencia, pero necesito encontrar una solución para evitar la confrontación. A pesar de conocer magia, ha esta distancia ella tiene las de ganar, más si es capaz de utilizar castigo divino. ",
        background: "../assets/Background/flower.png",
        character1: "",
        character2: "",
        choices:[]}
    ]
},
{
    tree:[
        {    
        name: "Kaelith",
        text: "Thalia me hace señales indicandome un árbol cercano, haciendo de apoyo la ayudo a subir al árbol para que tenga un mejor angulo. Tras subir al árbol cercano, Thalia saco su arco corto y apunto hacia el venado, yo me mantuve oculta tras unos arbustos, preparada para lanzar un hechizo para inmovilizar al animal si algo salía mal. Pero antes de que Thalia disparara un fuerte sonido proveniente de no muy lejos de donde estábamos alerto al venado ahuyentándolo",
        background: "../assets/Background/Forest2.png",
        character1: "",
        character2: "",
        choices:[]},
        {    
        name: "Kaelith",
        text: "No tenía muchas opciones, el sol se estaba poniendo y la situación era tensa, Liora esperaba que actuara o dijera algo antes de intentar ni un movimiento. Ahí fue cuando recordé algo…",
        background: "../assets/Background/flower.png",
        character1: "",
        character2: "",
        choices:[]}
    ]
},
{
    tree:[
        {    
        name: "Thalia",
        text: "Que lastima…",
        background: "../assets/Background/Forest2.png",
        character1: "",
        character2: "../assets/Characters/Thalia_sprite1.png",
        choices:[]},
        {    
        name: "Kaelith",
        text: "En un abrir y cerrar de ojos agarre mi varita, rápidamente invoque una pequeña llovizna encima de nosotras. Liora que había saltado hacia mí se quedó perpleja con el filo de su espada en mi cuello, al ver hacía arriba…",
        background: "../assets/Background/flower.png",
        character1: "",
        character2: "",
        choices:[]}
    ]
},
{
    tree:[
        {    
        name: "Kaelith",
        text: "Bueno, no hay nada que podamos hacer…",
        background: "../assets/Background/Forest2.png",
        character1:"../assets/Characters/Kaelith_sprite1.png",
        character2: "",
        choices:[]},
        {    
        name: "Kaelith",
        text: "Se había formado un precioso arcoíris sobre nosotras, Liora se detuvo inmediatamente y dejo caer su espada, mientras veía estupefacta el paisaje recién formado.",
        background: "../assets/Background/flower.png",
        character1: "",
        character2: "",
        choices:[]}
    ]
},
{
    tree:[
        {    
        name: "Thalia",
        text: "Voy a revisar las trampas, tu ve a las del oeste.",
        background: "../assets/Background/Forest2.png",
        character1: "",
        character2: "../assets/Characters/Thalia_sprite1.png",
        choices:[]},
        {    
        name: "Liora",
        text: "Gracias…",
        background: "../assets/Background/flower.png",
        character1: "",
        character2: "../assets/Characters/Liora_sprite1.png",
        choices:[]}
    ]
},
{
    tree:[
        {    
        name: "Kaelith",
        text: "Entendido.",
        background: "../assets/Background/Forest2.png",
        character1:"../assets/Characters/Kaelith_sprite1.png",
        character2: "",
        choices:[]},
        {    
        name: "Kaelith",
        text: "Mi corazón no deja de latir tan fuerte que todo a mi alrededor parece esfumarse, solo voy a descansar un momento. ",
        background: "../assets/Background/flower.png",
        character1: "",
        character2: "",
        choices:[]}
    ]
},
{
    tree:[
        {    
        name: "Kaelith",
        text: "Tras una media hora, regresamos al campamento, logramos atrapar dos conejos con las trampas, aunque no fuera tan bueno como un venado, conseguimos apaciguar a Liora, la cual se miraba más contenta al terminar de comer el guiso.",
        background: "../assets/Background/campsite.jpg",
        character1: "",
        character2: "",
        choices:[]
        },
        {    
        name: "Kaelith",
        text: "Empiezo a abrir lentamente los ojos, no siento que este acostada sobre aquel precioso campo de flores, cuando veo alrededor mío estoy dentro de la tienda de acampar que monto Cavne horas antes.",
        background: "../assets/Background/campsite.jpg",
        character1: "",
        character2: "",
        choices:[]}
    ]
},
{
    tree:[
        {    
        name: "",
        text: "",
        background: "../assets/Background/",
        character1: "",
        character2: "",
        choices:[],
        plus:4},
        {    
        name: "Kaelith",
        text: "Todavía un poco desorientada logro ver que a mi derecha esta Liora.",
        background: "../assets/Background/campsite.jpg",
        character1: "",
        character2: "",
        choices:[]}
    ]
},
{
    tree:[
        {    
        name: "",
        text: "",
        background: "../assets/Background/",
        character1: "",
        character2: "",
        choices:[]},
        {    
        name: "Liora",
        text: "Lo sie… lo siento, en serio y… gracias…",
        background: "../assets/Background/campsite.jpg",
        character1: "",
        character2: "../assets/Characters/Liora_sprite1.png",
        choices:[]}
    ]
},
{
    tree:[
        {    
        name: "",
        text: "",
        background: "../assets/Background/",
        character1: "",
        character2: "",
        choices:[]},
        {    
        name: "Kaelith",
        text: "No sé qué está hablando Liora, no sé qué paso, no debería agradecerme, estoy confundida, prefiero no seguir indagando en el tema, aunque parece que Liora no tiene esa actitud engreída que mantuvo los últimos días.",
        background: "../assets/Background/campsite.jpg",
        character1: "",
        character2: "",
        choices:[]}
    ]
},
{
    tree:[
        {    
        name: "",
        text: "",
        background: "../assets/Background/",
        character1: "",
        character2: "",
        choices:[]},
        {    
        name: "Liora",
        text: " Todavía no está lista la comida… deberíamos salir a ayudar.",
        background: "../assets/Background/campsite.jpg",
        character1: "",
        character2: "../assets/Characters/Liora_sprite1.png",
        choices:[]}
    ]
},
{
    name: "",
    text: "Capítulo 2, El hostal.",
    background: "../assets/Background/",
    character1: "",
    character2: "",
    choices:[],
    cancion:"../assets/Music/時計塔.ogg"
},
{
    name: "Kaelith",
    text: "Tras 2 días llegamos a Ouphix, al pequeño campamento, este está formado de un edificio de madera y ladrillos, tiene 3 pisos y está bien cuidado, parece que no está en el fin del mundo, hasta puedo decir que parece un hostal de la mayor calidad, no tiene nada que envidiar a los de las grandes ciudades. ",
    background: "../assets/Background/Inn2.jpg",
    character1: "",
    character2: "",
    choices:[]
},
{
    name: "Gerente",
    text: " Bienvenidos a La Ultima parada, en que los puedo ayudar.",
    background: "../assets/Background/Inn.jpg",
    character1: "",
    character2: "",
    choices:[]
},
{
    name: "Callin",
    text: "BUEN DÍA NECESITAMOS HOSPEDAJE PARA 6 PERSONAS…",
    background: "../assets/Background/Inn.jpg",
    character1: "",
    character2:"../assets/Characters/Callin_sprite1.png",
    choices:[]
},
{
    name: "Kaelith",
    text: "Callin ha hecho un muy buen papel de líder en lo poco que llevamos juntos, realmente lo aprecio, soy capaz de entender el éxito que ha tenido el grupo, además su forma de tomar las riendas con Liora, realmente es un líder nato, el viaje me hace tener fe en que la investigación será un paseo.",
    background: "../assets/Background/Inn.jpg",
    character1: "",
    character2: "",
    choices:[]
},
{
    name: "Kaelith",
    text: "Tras pedir los cuartos el gerente asigno al grupo dos cuartos, Callin dijo que las chicas en uno y los chicos en el otro, pero la señora Highgaze va a estar en el cuarto con ellos, dijo algo de tener que vigilar a los chicos para que no entren a nuestro cuarto a escondidas, me gusta creer que lo dijo de broma, pero el tono monótono de eHighgaze hace complicado saber si lo decía en serio. ",
    background: "../assets/Background/Inn.jpg",
    character1: "",
    character2: "",
    choices:[]
},
{
    name: "Gerente",
    text: "Señoritas, este va a ser su cuarto.",
    background: "../assets/Background/Room.jpg",
    character1: "",
    character2: "",
    choices:[]
},
{
    name: "Kaelith",
    text: "Abriendo la puerta del cuarto, nos encontramos con acogedor cuarto. Tres camas lo suficientemente separadas con una pequeña mesa de noche para cada una, un tocador con espejo cerca de la entrada y una repisa ideal para dejar el equipo. ",
    background: "../assets/Background/Room.jpg",
    character1: "",
    character2: "",
    choices:[]
},
{
    name: "Kaelith",
    text: "No puedo pedir más, el hostal es de la mayor calidad, indomable fury está muy bien organizado y desde que Liora se calmó el ambiente está más relajado, ¡Incluso cuenta con baño privado cada cuarto! Lo que pensé que iba a ser una pesadilla de viaje parece que serán unas agradables vacaciones en el campo.",
    background: "../assets/Background/Room.jpg",
    character1: "",
    character2: "",
    choices:[]
},
{
    name: "Liora",
    text: "¡Me quedo con la esquina!",
    background: "../assets/Background/Room.jpg",
    character1: "",
    character2: "../assets/Characters/Liora_sprite1.png",
    choices:[]
},
{
    name: "Kaelith",
    text: "Rápidamente Liora puso sus pertenencias en la cama de la esquina, la más alejada de la puerta. A lo que Thalia la siguió sin decir ni una palabra coloco sus pertenencias en la cama de la otra esquina. Parece ser que me voy a quedar entre las dos, en la cama central.",
    background: "../assets/Background/Room.jpg",
    character1: "",
    character2: "",
    choices:[]
},
{
    name: "Kaelith",
    text: "Tras acomodar mis cosas en la habitación y justo cuando me disponía a encerrarme a leer me vi interrumpida por un fuerte grito viniendo del comedor.",
    background: "../assets/Background/Room.jpg",
    character1: "",
    character2: "",
    choices:[]
},
{
    name: "Kaelith",
    text: "Ignore el ruido y no paso ni un minuto cuando volvió a sonar, esta vez más claro me di cuenta que era Callin, estaba llamándonos al comedor.",
    background: "../assets/Background/Room.jpg",
    character1: "",
    character2: "",
    choices:[]
},
{
    name: "Kaelith",
    text: "Levantándome de mi cama fue cuando me di cuenta que me encontraba sola en la habitación, Liora y Thalia no se veían en ni un lado. No escuche cuando salieron, pero tampoco es que estuviera prestando especial atención.",
    background: "../assets/Background/Room.jpg",
    character1: "",
    character2: "",
    choices:[]
},
{
    name: "Kaelith",
    text: "Baje rápidamente al comedor no sin haber recibido dos llamadas más.",
    background: "../assets/Background/Room.jpg",
    character1: "",
    character2: "",
    choices:[]
},
{
    name: "Callin",
    text: "¿DÓNDE ESTAN LAS OTRAS DOS?",
    background: "../assets/Background/Inn.jpg",
    character1: "",
    character2:"../assets/Characters/Callin_sprite1.png",
    choices:[]
},
{
    name: "Kaelith",
    text: "No lo sé, supuse que estarían aquí.",
    background: "../assets/Background/Inn.jpg",
    character1: "",
    character2: "",
    choices:[]
},
{
    name: "Kaelith",
    text: "Callin mantuvo su característica actitud y me dijo que fuera a buscarlas, si quería buscar en el hostal o fuera, mientras le ordeno a Cavne y Arlyse que prepararan los suministros para mañana. ",
    background: "../assets/Background/Inn.jpg",
    character1: "",
    character2: "",
    choices:["Voy a buscar fuera ","Voy a buscar dentro"]
},
//Decision 2
{
    tree:[
        {    
        name: "Callin",
        text: "VAS FUERA, No dudes en hacer una señal si se pone peligroso.",
        background: "../assets/Background/Inn.jpg",
        character1: "",
        character2:"../assets/Characters/Callin_sprite1.png",
        choices:[],
        affection:2 //Liora
    },
        {    
        name: "Kaelith",
        text: "Decidí buscar en los cuartos del hostal, seguramente encontraba a alguna de las dos dentro. Además, me ahorraba salir a la intemperie a estas horas, si, era la mejor opción. ",
        background: "../assets/Background/Inn.jpg",
        character1: "",
        character2: "",
        choices:[],
        affection:1} //Thalia
    ]
},
{
    tree:[
        {    
        name: "Arlyse",
        text: "Buen viaje.",
        background: "../assets/Background/Inn.jpg",
        character1: "",
        character2:"../assets/Characters/Arlyse_sprite2.png",
        choices:[]},
        {    
        name: "Kaelith",
        text: "Empecé buscando en los cuartos, en el segundo piso, primero nuestro cuarto, luego el cuarto de Callin y los demás que se encontraban vacíos, no vi a nadie, por lo que decidí preguntarle al gerente si existía algún otro cuarto.",
        background: "../assets/Background/Room.jpg",
        character1: "",
        character2: "",
        choices:[]}
    ]
},
{
    tree:[
        {    
        name: "Kaelith",
        text: "…",
        background: "../assets/Background/Inn.jpg",
        character1:"../assets/Characters/Kaelith_sprite1.png",
        character2: "",
        choices:[]},
        {    
        name: "Gerente",
        text: "Hay una bodega en el ático, aunque dudo que encuentres a alguien ahí.",
        background: "../assets/Background/inn.jpg",
        character1: "",
        character2: "",
        choices:[]}
    ]
},
{
    tree:[
        {    
        name: "Kaelith",
        text: "Al cerrar la puerta del hostal, frente a mí se presentaba la misma llanura a la que habíamos llegado unas horas antes. Al ver hacia arriba las estrellas se podían ver perfectamente, era una noche despejada, dando a la oscuridad de la noche un brillo lo cual facilitaba la visión.",
        background: "../assets/Background/Plains.png",
        character1: "",
        character2: "",
        choices:[]},
        {    
        name: "Kaelith",
        text: "Gracias.",
        background: "../assets/Background/",
        character1:"../assets/Characters/Kaelith_sprite1.png",
        character2: "",
        choices:[]}
    ]
},
{
    tree:[
        {    
        name: "Kaelith",
        text: "Lance iluminar objeto sobre mi daga, a pesar de no ser tan potente como una antorcha, la luz que emitía el hechizo me ayudaría con la búsqueda. Decidí caminar sin rumbo por la llanura.",
        background: "../assets/Background/",
        character1: "",
        character2: "",
        choices:[]},
        {    
        name: "Kaelith",
        text: "Tras agradecerle subí al ático, este se encontraba oculto, con unas escaleras plegables, por lo que pasaba desapercibido a menos que pusieran atención o supieras de su existencia. ",
        background: "../assets/Background/",
        character1: "",
        character2: "",
        choices:[]}
    ]
},
{
    tree:[
        {    
        name: "Kaelith",
        text: "Pasados unos minutos vi algo que me llamaba la atención, un poco lejos de donde me encontraba vi un reflejo del cielo estrellado.",
        background: "../assets/Background/",
        character1: "",
        character2: "",
        choices:[]},
        {    
        name: "Kaelith",
        text: "Al subir al ático vi una pequeña luz, por lo que sabía que había alguien ahí, pero en la mesa no se encontraba nadie sentado. Me acerqué poco a poco a la mesa, cuando vi sobre ella un pequeño reloj de mano, se miraba antiguo y con rasguños, pero no descuidado. Antes de que pudiera observarlo más de cerca me interrumpió una voz.  ",
        background: "../assets/Background/",
        character1: "",
        character2: "",
        choices:[]}
    ]
},
{
    tree:[
        {    
        name: "Kaelith",
        text: "Supongo que será una pequeña laguna.",
        background: "../assets/Background/",
        character1:"../assets/Characters/Kaelith_sprite1.png",
        character2: "",
        choices:[]},
        {    
        name: "Thalia",
        text: "Me encontraste.",
        background: "../assets/Background/",
        character1: "",
        character2: "../assets/Characters/Thalia_sprite1.png",
        choices:[]}
    ]
},
{
    tree:[
        {    
        name: "Kaelith",
        text: "Empecé a caminar hacía la laguna, mientras más me acercaba logre vislumbrar una figura humanoide a lo lejos.",
        background: "../assets/Background/",
        character1: "",
        character2: "",
        choices:[]},
        {    
        name: "Kaelith",
        text: "Dijo con su típico tono, sin mostrar emociones, solo diciendo un hecho.",
        background: "../assets/Background/",
        character1: "",
        character2: "",
        choices:[]}
    ]
},
{
    tree:[
        {    
        name: "Kaelith",
        text: "¡Eyyyy! ¡Te estaba buscando!",
        background: "../assets/Background/",
        character1:"../assets/Characters/Kaelith_sprite1.png",
        character2: "",
        choices:[]},
        {    
        name: "Kaelith",
        text: "Callin dijo que nos reu…",
        background: "../assets/Background/",
        character1:"../assets/Characters/Kaelith_sprite1.png",
        character2: "",
        choices:[]}
    ]
},
{
    tree:[
        {    
        name: "Kaelith",
        text: "La figura no reacciono a mi llamada, así que decidí acercarme un poco más, mientras más me acercaba logre vislumbrar una brillante armadura blandiendo una espada. Era Liora, al parecer salió a practicar un poco.",
        background: "../assets/Background/",
        character1: "",
        character2: "",
        choices:[]},
        {    
        name: "Thalia",
        text: "Bajo en un rato.",
        background: "../assets/Background/",
        character1: "",
        character2: "",
        choices:[]}
    ]
},
{
    tree:[
        {    
        name: "Kaelith",
        text: "Liora, te estaba buscando. Vamos al hostal Callin nos busca. ",
        background: "../assets/Background/",
        character1:"../assets/Characters/Kaelith_sprite1.png",
        character2: "",
        choices:[]},
        {    
        name: "Kaelith",
        text: "Esta bien.",
        background: "../assets/Background/",
        character1:"../assets/Characters/Kaelith_sprite1.png",
        character2: "",
        choices:[]}
    ]
},
{
    tree:[
        {    
        name: "Kaelith",
        text: "Liora paro en seco y se derrumbó. Al ver esto corrí lo más rápido que podía para ver que había ocurrido, no lo hago porque me importe, sería malo tener a un miembro menos para la expedición de mañana.",
        background: "../assets/Background/",
        character1: "",
        character2: "",
        choices:[]},
        {    
        name: "Kaelith",
        text: "A pesar de mis palabras, me quede inmóvil, con el reloj en la mano, sin apartar la vista. Antes de darme cuenta, Thalia me había quitado el reloj de la mano y mostro algo más que no solo indiferencia.",
        background: "../assets/Background/",
        character1: "",
        character2: "",
        choices:[]}
    ]
},
{
    tree:[
        {    
        name: "Kaelith",
        text: "¿Estas bien?",
        background: "../assets/Background/",
        character1:"../assets/Characters/Kaelith_sprite1.png",
        character2: "",
        choices:[]},
        {    
        name: "Thalia",
        text: "Vete.",
        background: "../assets/Background/",
        character1: "",
        character2: "../assets/Characters/Thalia_sprite1.png",
        choices:[]}
    ]
},
{
    tree:[
        {    
        name: "Liora",
        text: "¿Crees que estoy lista?",
        background: "../assets/Background/",
        character1: "",
        character2: "../assets/Characters/Liora_sprite1.png",
        choices:[]},
        {    
        name: "Kaelith",
        text: "Un tono inusual, denota una tristeza y melancolía, me debería ir, eso me dice mi cabeza, pero mi corazón piensa distinto. ",
        background: "../assets/Background/",
        character1: "",
        character2: "",
        choices:[]}
    ]
},
{
    tree:[
        {    
        name: "Kaelith",
        text: "¿A qué te refieres?",
        background: "../assets/Background/",
        character1:"../assets/Characters/Kaelith_sprite1.png",
        character2: "",
        choices:[]},
        {    
        name: "Kaelith",
        text: "Lo siento.",
        background: "../assets/Background/",
        character1:"../assets/Characters/Kaelith_sprite1.png",
        character2: "",
        choices:[]}
    ]
},
{
    tree:[
        {    
        name: "Liora",
        text: "Mañana, ¿Crees que voy a ser útil?",
        background: "../assets/Background/",
        character1: "",
        character2: "../assets/Characters/Liora_sprite1.png",
        choices:[]},
        {    
        name: "Thalia",
        text: "¿Por qué?",
        background: "../assets/Background/",
        character1: "",
        character2: "../assets/Characters/Thalia_sprite1.png",
        choices:[]}
    ]
},
{
    tree:[
        {    
        name: "Kaelith",
        text: "???????",
        background: "../assets/Background/",
        character1:"../assets/Characters/Kaelith_sprite1.png",
        character2: "",
        choices:[]},
        {    
        name: "Kaelith",
        text: "Solo lo siento, ya me voy.",
        background: "../assets/Background/",
        character1:"../assets/Characters/Kaelith_sprite1.png",
        character2: "",
        choices:[]}
    ]
},
{
    tree:[
        {    
        name: "Kaelith",
        text: "Estoy segura que oí correctamente, aunque parece salido de una ficción. Liora, esa Liora, hablando de sus problemas y dudando de ella misma, creo que ya he visto todo.",
        background: "../assets/Background/",
        character1: "",
        character2: "",
        choices:[]},
        {    
        name: "Kaelith",
        text: "Me di la vuelta ignorando el desastre que era mi mente en estos momentos, e intenté marcharme, pero fui detenida, Thalia me agarro le brazo.",
        background: "../assets/Background/",
        character1: "",
        character2: "",
        choices:[]}
    ]
},
{
    tree:[
        {    
        name: "Kaelith",
        text: "Te voy a ser sincera, realmente no lo sé. Esta es mi primera aventura y primera vez fuera de la ciudad, pero creo que todo va a estar bien. ",
        background: "../assets/Background/",
        character1:"../assets/Characters/Kaelith_sprite1.png",
        character2: "",
        choices:[]},
        {    
        name: "Thalia",
        text: "No puedes irte, lo viste, todo esto es tu culpa.",
        background: "../assets/Background/",
        character1: "",
        character2: "../assets/Characters/Thalia_sprite1.png",
        choices:[]}
    ]
},
{
    tree:[
        {    
        name: "Kaelith",
        text: "También tenemos a un grupo de renombre de nuestro lado, mientras no estorbemos todo debería estar bien. ",
        background: "../assets/Background/",
        character1: "",
        character2: "",
        choices:[]},
        {    
        name: "Kaelith",
        text: "No entiendo como llegamos a esta situación, por qué es mi culpa, por qué Thalia, la cazadora fría, está llorando, mientras se aferra a mí. No hice nada, solo venía a avisar sobre los preparativos de mañana y me vi encerrada en esta situación. Aunque la verdad no me quejo.",
        background: "../assets/Background/",
        character1: "",
        character2: "",
        choices:[]}
    ]
},
{
    tree:[
        {    
        name: "Liora",
        text: "Eres mala en esto.",
        background: "../assets/Background/",
        character1: "",
        character2: "../assets/Characters/Liora_sprite1.png",
        choices:[]},
        {    
        name: "Kaelith",
        text: "El reloj, que es…",
        background: "../assets/Background/",
        character1:"../assets/Characters/Kaelith_sprite1.png",
        character2: "",
        choices:[]}
    ]
},
{
    tree:[
        {    
        name: "Kaelith",
        text: "Que quieres que haga, te dejo acostarte en mi regazo y te doy mimos hasta que duermas.",
        background: "../assets/Background/",
        character1: "",
        character2: "",
        choices:[]},
        {    
        name: "Thalia",
        text: "Mi familia murió, en un ataque a nuestro pueblo, no quedo nada. Muy pocos sobrevivieron el ataque y el reloj de mi padre es lo único que me quedo…",
        background: "../assets/Background/",
        character1: "",
        character2: "../assets/Characters/Thalia_sprite1.png",
        choices:[]}
    ]
},
{
    tree:[
        {    
        name: "Liora",
        text: "Es… Eso estaría bien.",
        background: "../assets/Background/",
        character1: "",
        character2: "",
        choices:[]},
        {    
        name: "Kaelith",
        text: "No la puedo culpar, no quiero ni imaginarme el dolor de perder a un ser querido y menos en la niñez. Thalia es fuerte, pero nadie debería guardar sus sentimientos, sino pasa esto.",
        background: "../assets/Background/",
        character1: "",
        character2: "",
        choices:[]}
    ]
},
{
    tree:[
        {    
        name: "Kaelith",
        text: "¡Ehhh! ¡Yo lo decía de broma! Bueno, si te hace sentir mejor, no hay de otra.",
        background: "../assets/Background/",
        character1:"../assets/Characters/Kaelith_sprite1.png",
        character2: "",
        choices:[]},
        {    
        name: "Kaelith",
        text: "No soy buena consolando a la gente, mi forma de ser no es la mejor para ese trabajo, aunque en un torpe intento para ayudar a Thalia, me senté en el piso y…",
        background: "../assets/Background/",
        character1: "",
        character2: "",
        choices:[]}
    ]
},
{
    tree:[
        {    
        name: "Kaelith",
        text: "Puedo sentir mi cuerpo increíblemente caliente, mientras me siento a la orilla del lago y veo a Liora siguiéndome, tirando todo su peso sobre mi reposa sobre mi regazo. ",
        background: "../assets/Background/",
        character1:"../assets/Characters/Kaelith_sprite1.png",
        character2: "",
        choices:[]},
        {    
        name: "Kaelith",
        text: "Recuéstate, descansar te va a ayudar un poco.",
        background: "../assets/Background/",
        character1:"../assets/Characters/Kaelith_sprite1.png",
        character2: "",
        choices:[]}
    ]
},
{
    tree:[
        {    
        name: "Kaelith",
        text: "No nos conocemos de hace mucho tiempo, pero he logrado ver que Liora a pesar de ser una mujer muy egocéntrica y molesta, también tiene sus dudas y debilidades. ",
        background: "../assets/Background/",
        character1: "",
        character2: "",
        choices:[]},
        {    
        name: "Kaelith",
        text: "Thalia, usualmente precavida, esta indefensa y vulnerable, parece un pequeño gatito perdido, sin cuestionar lo que dije, se acostó en mi regazo, poco a poco el sollozo y lagrimeo fue parando, hasta que tras unos minutos quedo dormida. ",
        background: "../assets/Background/",
        character1: "",
        character2: "",
        choices:[]}
    ]
},
{
    tree:[
        {    
        name: "Kaelith",
        text: "No sé cómo acabo siempre en estas situaciones. ",
        background: "../assets/Background/",
        character1: "",
        character2: "",
        choices:[]},
        {    
        name: "Kaelith",
        text: "La planificación puede esperar…",
        background: "../assets/Background/",
        character1: "",
        character2: "",
        choices:[],
        plus:5}
    ]
},
{
    tree:[
        {    
        name: "Liora",
        text: "Esta preciosa la luna.",
        background: "../assets/Background/",
        character1: "",
        character2: "../assets/Characters/Liora_sprite1.png",
        choices:[]},
        {    
        name: "",
        text: "",
        background: "../assets/Background/",
        character1: "",
        character2: "",
        choices:[]}
    ]
},
{
    tree:[
        {    
        name: "Kaelith",
        text: "Tras el comentario de Liora, salí de mi pequeño trance y logré observar, una preciosa noche estrellada reflejada en el lago, una ligera brisa acompañaba el ambiente, al otro lado del lago hay un bosque, invisible a primera vista, porque la oscuridad de la noche lo absorbe, pero las sombras de los árboles y el brillo de la luna reflejado en el lago permiten vislumbrar con un toque mágico el paisaje que nos acompaña.",
        background: "../assets/Background/",
        character1: "",
        character2: "",
        choices:[]},
        {    
        name: "",
        text: "",
        background: "../assets/Background/",
        character1: "",
        character2: "",
        choices:[]}
    ]
},
{
    tree:[
        {    
        name: "Kaelith",
        text: "Al poco tiempo Liora se durmió sobre mí, “Esto es un problema”, me dije a mi misma, mientras seguía observando el precioso paisaje.",
        background: "../assets/Background/",
        character1: "",
        character2: "",
        choices:[]},
        {    
        name: "",
        text: "",
        background: "../assets/Background/",
        character1: "",
        character2: "",
        choices:[]}
    ]
},
{
    tree:[
        {    
        name: "Kaelith",
        text: "Voy a dejarla dormir un rato más…",
        background: "../assets/Background/",
        character1:"../assets/Characters/Kaelith_sprite1.png",
        character2: "",
        choices:[]},
        {    
        name: "",
        text: "",
        background: "../assets/Background/",
        character1: "",
        character2: "",
        choices:[]}
    ]
},
{
    name: "Capítulo 3- Las ruinas",
    text: "",
    background: "../assets/Background/",
    character1: "",
    character2: "",
    choices:[]
},
{
    name: "Arlyse",
    text: "¿Cavne, empacaste todo lo que te pedí? ",
    background: "../assets/Background/",
    character1: "Cavne",
    character2:"../assets/Characters/Arlyse_sprite2.png",
    choices:[]
},
{
    name: "Cavne",
    text: "Psst, si, si lo empaque.",
    background: "../assets/Background/",
    character1: "Cavne",
    character2: "",
    choices:[]
},
{
    name: "Kaelith",
    text: "Partimos del hostal camino a las ruinas, se encontraban a dos horas caminando por el bosque y se podían reconocer por lo fuera de lugar que se encuentran. Todos nos encontramos listos para la exploración. Thalia preparo unas herramientas de ladrón, para desarmar trampas, Arlyse nos dio una poción sospechosa que dice que cura todas las heridas, Cavne dejo reluciente su armadura, aunque no llega al nivel de pulido de la de Liora, Callin lleva el control de provisiones, mapas y estrategias y Liora, bueno Liora nos está acompañando. ",
    background: "../assets/Background/",
    character1: "",
    character2: "",
    choices:[]
},
{
    name: "Liora",
    text: "¡Por qué no trajimos la carreta!",
    background: "../assets/Background/",
    character1: "",
    character2: "../assets/Characters/Liora_sprite1.png",
    choices:[]
},
{
    name: "Callin",
    text: "¡JA JA JA! El carruaje no entraría por el espesor del bosque, pero si todo va bien deberíamos estar llegando.",
    background: "../assets/Background/",
    character1: "",
    character2:"../assets/Characters/Callin_sprite1.png",
    choices:[]
},
{
    name: "Kaelith",
    text: "Al pasar una zona espesa llegamos a las ruinas. Una enorme torre en el medio de la nada, similar a las grandes torres de los grandes magos, aunque desprendía un aura distinta, no mostraba la grandeza de los magos, transmitía un sentimiento de represión. ",
    background: "../assets/Background/",
    character1: "",
    character2: "",
    choices:[]
},
{
    name: "Arlyse",
    text: "Thalia, puedes verificar si hay movimiento inusual en las plantas altas.",
    background: "../assets/Background/",
    character1: "",
    character2:"../assets/Characters/Arlyse_sprite2.png",
    choices:[]
},
{
    name: "Thalia",
    text: "Entendido.",
    background: "../assets/Background/",
    character1: "",
    character2: "../assets/Characters/Thalia_sprite1.png",
    choices:[]
},
{
    name: "Arlyse",
    text: "Kaelith, cariño, puedes darle caída lenta a Thalia. ",
    background: "../assets/Background/",
    character1:"../assets/Characters/Kaelith_sprite1.png",
    character2:"../assets/Characters/Arlyse_sprite2.png",
    choices:[]
},
{
    name: "Kaelith",
    text: "Inmediatamente me preparo para lanzar el hechizo hacia mi compañera. Esta rápidamente utiliza un gancho para escalar la torre lo más rápido posible, haciendo una señal. La torre está limpia. ",
    background: "../assets/Background/",
    character1: "",
    character2: "",
    choices:[]
},
{
    name: "Kaelith",
    text: "Aprovechando una pequeña zona no derruida, montamos el campamento, antes de entrar a lo que venimos. El sótano, las ruinas no tenían nada de especial, pero hace poco un grupo de aventureros encontró una entrada al sótano, el único superviviente del grupo no supo explicar que había ocurrido, por lo que se volvió un lugar que los aventureros evitan, pero carroñeros y saqueadores buscan con el fin de encontrar los secretos del sótano. ",
    background: "../assets/Background/",
    character1: "",
    character2: "",
    choices:[]
},
{
    name: "Kaelith",
    text: "Es sospechoso, la iglesia, mandando una paladina a unas ruinas y un grupo de aventureros de renombre aceptando el encargo. Si no fuera por lo peligroso que son las ruinas estas ya estuvieran saqueadas y sumado lo ocupado que está el gremio por lo que los mejores grupos no se encuentran disponibles. Los únicos dispuestos a entrar son mercenarios, pero los pobres bastardos nunca regresan de sus encargos, lo cual desalienta a cualquier valiente. ",
    background: "../assets/Background/",
    character1: "",
    character2: "",
    choices:[]
},
{
    name: "Callin",
    text: "Cavne vigila la retaguardia. Liora cuida a la maga. Arlyse, Thalia, hagan lo mismo de siempre. Yo liderare el grupo.",
    background: "../assets/Background/",
    character1: "",
    character2:"../assets/Characters/Callin_sprite1.png",
    choices:[]
},
{
    name: "Kaelith",
    text: "Sigo sorprendida por la capacidad de Callin, a pesar de su actitud, sabe tomar las riendas y es un buen líder y se nota que se a cuidado a pesar de la edad. Estoy agradecida de poder contar con alguien como él en el grupo.",
    background: "../assets/Background/",
    character1: "",
    character2: "",
    choices:[]
},
{
    name: "Kaelith",
    text: "Con esto dicho, nos adentramos en las ruinas. ¿Qué secretos nos esperan en el sótano? ¿Qué misterio rodea la torre? ¿Qué peligros nos encontraremos?",
    background: "../assets/Background/",
    character1: "",
    character2: "",
    choices:[]
},
{
    name: "Thalia",
    text: "Desactivé unas trampas más adelante, aunque deberíamos andar con cuidado, oí pasos en el cuarto de enfrente.",
    background: "../assets/Background/",
    character1: "",
    character2: "../assets/Characters/Thalia_sprite1.png",
    choices:[]
},{
    name: "Callin",
    text: "Tomemos una formación ofensiva antes de entrar. Liora ven a la vanguardia conmigo.",
    background: "../assets/Background/",
    character1: "",
    character2:"../assets/Characters/Callin_sprite1.png",
    choices:[]
},{
    name: "Liora",
    text: "Psst, está bien.",
    background: "../assets/Background/",
    character1: "Liora",
    character2: "",
    choices:[]
},{
    name: "Cavne",
    text: "Yo protegeré a la maga.",
    background: "../assets/Background/",
    character1: "Cavne",
    character2: "",
    choices:[]
},{
    name: "Kaelith",
    text: "Voy a preparar lluvia de granizo, tengan cuidado con el piso.",
    background: "../assets/Background/",
    character1:"../assets/Characters/Kaelith_sprite1.png",
    character2: "",
    choices:[]
},{
    name: "Callin",
    text: "Parece que tenemos un plan, tres… dos… uno… ¡Vamos!",
    background: "../assets/Background/",
    character1: "",
    character2:"../assets/Characters/Callin_sprite1.png",
    choices:[]
},{
    name: "Kaelith",
    text: "Tras cruzar la puerta, nos esperaba un pequeño campamento de ogros, estos a pesar de ser racionales, tienden a estar enemistados con los humanos. Por lo que expectante a la orden de Callin no lance mi hechizo. ",
    background: "../assets/Background/",
    character1: "",
    character2: "",
    choices:[]
},{
    name: "Callin",
    text: "Perdonen, estamos investigando las ruinas, nos dejarían pasar y los dejamos en paz.",
    background: "../assets/Background/",
    character1: "",
    character2: "",
    choices:[]
},{
    name: "Kaelith",
    text: "… No hubo respuesta.",
    background: "../assets/Background/",
    character1: "",
    character2: "",
    choices:[]
},
{
    name: "Callin",
    text: "¡HOLA!",
    background: "../assets/Background/",
    character1: "",
    character2:"../assets/Characters/Callin_sprite1.png",
    choices:[]
},{
    name: "Kaelith",
    text: "Con precaución Arlyse se acercó a los ogros, descubriendo que se encontraban muertos, el motivo desconocido, pero quedaron de pie, realizando sus tareas diarias, se volvieron estatuas, pero no son piedra, se encuentran suspendidos, en el tiempo.",
    background: "../assets/Background/",
    character1: "",
    character2: "",
    choices:[]
},{
    name: "Thalia",
    text: "¡Salgan todos!",
    background: "../assets/Background/",
    character1: "",
    character2: "../assets/Characters/Thalia_sprite1.png",
    choices:[],
    cancion:"epic music"
},{
    name: "Kaelith",
    text: "Tras el grito de Thalia nos movimos rápidamente fuera del cuarto, solo para percatarnos como un rayo, impactaba en este, por suerte todos logramos salir, pero parece que conocemos la fuente de la petrificación de los ogros.",
    background: "../assets/Background/",
    character1: "",
    character2: "",
    choices:[]
},{
    name: "Arlyse",
    text: "Vaya, vaya, eso estuvo cerca.",
    background: "../assets/Background/",
    character1: "",
    character2:"../assets/Characters/Arlyse_sprite2.png",
    choices:[]
},{
    name: "Liora",
    text: "¡Que fue eso!",
    background: "../assets/Background/",
    character1: "",
    character2: "../assets/Characters/Liora_sprite1.png",
    choices:[]
},{
    name: "Thalia",
    text: "…",
    background: "../assets/Background/",
    character1: "",
    character2: "../assets/Characters/Thalia_sprite1.png",
    choices:[]
},{
    name: "Kaelith-Callin",
    text: "¿Qué hacemos?",
    background: "../assets/Background/",
    character1:"../assets/Characters/Kaelith_sprite1.png",
    character2:"../assets/Characters/Callin_sprite1.png",
    choices:[]
},{
    name: "Callin",
    text: "Voy a revisar los apuntes, dame un momento",
    background: "../assets/Background/",
    character1: "",
    character2:"../assets/Characters/Callin_sprite1.png",
    choices:[],
    cancion:"chill"
},{
    name: "Kaelith",
    text: "Nos relajamos un momento en lo que Callin junto a Arlyse revisaban los apuntes, Thalia se recostó contra la pared y Cavne no dejaba de hablar sobre una venganza, ¿Dónde está Liora?",
    background: "../assets/Background/",
    character1: "",
    character2: "",
    choices:[]
},{
    name: "Kaelith",
    text: "Asomando la cabeza por los pasillos de la mazmorra, encuentro a Liora, en un pasillo que no habíamos explorado.",
    background: "../assets/Background/",
    character1: "",
    character2: "",
    choices:[]
},{
    name: "Kaelith",
    text: "Regresa con el grupo, es peligroso estar sola.",
    background: "../assets/Background/",
    character1:"../assets/Characters/Kaelith_sprite1.png",
    character2: "",
    choices:[]
},{
    name: "Liora",
    text: "Mira eso.",
    background: "../assets/Background/",
    character1: "",
    character2: "../assets/Characters/Liora_sprite1.png",
    choices:[]
},{
    name: "Kaelith",
    text: "Señalando hacia enfrente, un enorme cuarto vacío se presentaba ante nosotras, en el centro se encontraba una brillante gema, en lo que parece una estatua, de un Dios antiguo. ",
    background: "../assets/Background/",
    character1: "",
    character2: "",
    choices:[]
},{
    name: "Kaelith",
    text: "Wow.",
    background: "../assets/Background/",
    character1:"../assets/Characters/Kaelith_sprite1.png",
    character2: "",
    choices:[],
    cancion:"epic"
},{
    name: "Kaelith",
    text: "Las dos estábamos anonadadas con la magnitud e incredulidad de lo que estábamos viendo, no fue hasta que oí un grito que me reincorporé a la realidad.",
    background: "../assets/Background/",
    character1: "",
    character2: "",
    choices:[]
},{
    name: "Thalia",
    text: "¡Qué crees que haces! ¡Ten cuidado! ",
    background: "../assets/Background/",
    character1: "",
    character2: "../assets/Characters/Thalia_sprite1.png",
    choices:[]
},
{
    name: "Kaelith",
    text: "Sin entender que pasa voltee alrededor mío viendo un pozo sin fonde frente a mí. Activamos una trampa, por suerte estamos bien, Liora logro esquivarlo y Thalia se lanzó sobre mí para ayudarme, pero no era momento de relajarse, la majestuosa estatua, empezó a moverse. No era una estatua, era un golem, no, no puede ser un golem, tiene el triple de tamaño que un golem normal y la magia requerida para darle vida a una criatura de esa magnitud es imposible conseguirla incluso para los elfos. ",
    background: "../assets/Background/",
    character1: "",
    character2: "",
    choices:[]
},{
    name: "Callin",
    text: "¡Todos tomen posición!",
    background: "../assets/Background/",
    character1: "",
    character2:"../assets/Characters/Callin_sprite1.png",
    choices:[]
},{
    name: "Kaelith",
    text: "El grupo se incorporó rápidamente y nos preparamos para lanzarnos al ataque, Thalia buscaba una ruta de escape segura, Arlyse se mantuvo en la retaguardia utilizando sus pasiones sobre Cavne, mientras que Cavne y Callin adoptaban posiciones defensivas. Me preparo para lanzar bola de fuego, cuando me interrumpe Liora.",
    background: "../assets/Background/",
    character1: "",
    character2: "",
    choices:[]
},{
    name: "Kaelith",
    text: "La muy idiota se abalanzo contra el golem, “esto es un problema”.",
    background: "../assets/Background/",
    character1: "",
    character2: "",
    choices:[]
},{
    name: "Kaelith",
    text: "¡Liora que haces no puedo atacar si estas en medio!",
    background: "../assets/Background/",
    character1:"../assets/Characters/Kaelith_sprite1.png",
    character2: "",
    choices:[]
},{
    name: "Kaelith",
    text: "Antes de que Liora pudiera terminar de acercarse el golem la ataco, de manera feroz, un gran mandoble de piedra se abalanzo contra ella, con poco tiempo de reacción Callin se lanzó para bloquear el golpe.",
    background: "../assets/Background/",
    character1: "",
    character2: "",
    choices:[]
},{
    name: "Kaelith",
    text: "Thalia aprovechando el momento, Disparo 1 flecha explosiva sobre el cuello del golem, Arlyse utilizo un disolvente sobre una de las piernas, mientras yo congelaba la otra para posteriormente explotarla.",
    background: "../assets/Background/",
    character1: "",
    character2: "",
    choices:[]
},{
    name: "Liora",
    text: "Uhhh, ¿Qué paso?",
    background: "../assets/Background/",
    character1: "",
    character2: "",
    choices:[]
},{
    name: "Kaelith",
    text: "El golem cayó, pero nuestros problemas no hacían más que empezar, tras unos pocos minutos nos reincorporamos, solo para observar a Callin tendido en el suelo.",
    background: "../assets/Background/",
    character1: "",
    character2: "",
    choices:[]
},{
    name: "Kaelith",
    text: "Sangre brotaba de todos lados de su cuerpo, el brazo derecho estaba roto y 4 costillas como mínimo también. ",
    background: "../assets/Background/",
    character1: "",
    character2: "",
    choices:[]
},{
    name: "Arlyse",
    text: "Cavne, necesito que apliques presión en…",
    background: "../assets/Background/",
    character1:"../assets/Characters/Kaelith_sprite1.png",
    character2:"../assets/Characters/Arlyse_sprite2.png",
    choices:[]
},{
    name: "Kaelith",
    text: "“Que problema”, que se supone que tengo que hacer, no conozco magia curativa, Liora seguramente puede hacer curaciones menores, pero estamos en un aprieto.",
    background: "../assets/Background/",
    character1: "",
    character2: "",
    choices:[]
},{
    name: "Thalia",
    text: "Kaelith, ven un momento.",
    background: "../assets/Background/",
    character1: "",
    character2: "../assets/Characters/Thalia_sprite1.png",
    choices:[]
},{
    name: "Kaelith",
    text: "Thalia me llamó un poco apartada del resto del grupo.",
    background: "../assets/Background/",
    character1: "",
    character2: "",
    choices:[]
},{
    name: "Thalia",
    text: "¿Sabes qué es esto?",
    background: "../assets/Background/",
    character1: "",
    character2: "../assets/Characters/Thalia_sprite1.png",
    choices:[]
},{
    name: "Kaelith",
    text: "Sacando de su bolsa, me mostro un cristal de color azul, muy similar a un zafiro, aunque estaba imbuido en magia. Dándole un vistazo más de cerca.",
    background: "../assets/Background/",
    character1: "",
    character2: "",
    choices:[]
},{
    name: "Kaelith",
    text: "Es el núcleo del golem, aunque por la magia que tiene debería funcionar similar a los muñecos de práctica.",
    background: "../assets/Background/",
    character1:"../assets/Characters/Kaelith_sprite1.png",
    character2: "",
    choices:[]
},{
    name: "Kaelith",
    text: "En la academia se utilizan armaduras vivientes para las practicas, estas se activan con un golpe a la gema, para activar el objeto vinculado y para desactivarlo era igual.",
    background: "../assets/Background/",
    character1: "",
    character2: "",
    choices:[]
},{
    name: "Kaelith",
    text: "Un momento, magia de entrenamiento, un golem en un cuarto abierto, esto es un cuarto de prácticas. Thalia activo accidentalmente el golem cuando se lanzó a ayudarme, durante la pelea no logré ver el núcleo. ",
    background: "../assets/Background/",
    character1: "",
    character2: "",
    choices:[]
},{
    name: "Thalia",
    text: "¿Qué pasa? ¿Averiguaste algo?",
    background: "../assets/Background/",
    character1: "",
    character2: "../assets/Characters/Thalia_sprite1.png",
    choices:[]
},
{
    name: "Kaelith",
    text: "No, no sé nada.",
    background: "../assets/Background/",
    character1:"../assets/Characters/Kaelith_sprite1.png",
    character2: "",
    choices:[]
},{
    name: "Kaelith",
    text: "No puedo decirle que por su culpa casi morimos y Callin está agonizando, aunque Liora tiene la mayor parte de la culpa…",
    background: "../assets/Background/",
    character1: "",
    character2: "",
    choices:[]
},{
    name: "Kaelith",
    text: "Vamos con el grupo, tenemos que salir de aquí.",
    background: "../assets/Background/",
    character1:"../assets/Characters/Kaelith_sprite1.png",
    character2: "",
    choices:[]
},{
    name: "Thalia",
    text: "Si…",
    background: "../assets/Background/",
    character1: "",
    character2: "../assets/Characters/Thalia_sprite1.png",
    choices:[]
},{
    name: "Kaelith",
    text: "Nos reincorporamos al grupo, Arlyse con esfuerzo logro parar el sangrado y con sus misteriosas pociones ayudo a calmar el dolor.",
    background: "../assets/Background/",
    character1: "",
    character2: "",
    choices:[]
},{
    name: "Kaelith",
    text: "Empezamos a salir de la mazmorra, seguimos nuestros propios pasos para evitar cualquier encuentro indeseado, viendo alrededor mía, lograba ver la cara de preocupación de Liora, la tristeza de Thalia, la indiferencia de Arlyse y el rencor de Cavne. ",
    background: "../assets/Background/",
    character1: "",
    character2: "",
    choices:[]
},{
    name: "Kaelith",
    text: "No me explico por qué Thalia, conociendo las trampas y artimañas de las mazmorras, decidió agarrar la gema o porque Liora se abalanzo de golpe contra el golem. Es extraño, aunque no puedo conseguir la respuesta, aún. ",
    background: "../assets/Background/",
    character1: "",
    character2: "",
    choices:[]
},
{
    name: "Kaelith",
    text: "Tras dos horas logramos regresar al hostal, el gerente cedió un cuarto para tratar las heridas de Callin, siendo un clérigo se ofreció a tratarlo, estaba grave por lo que seguramente no iba a poder regresar a la mazmorra por lo menos tres semanas. ",
    background: "../assets/Background/",
    character1: "",
    character2: "",
    choices:[]
},{
    name: "Kaelith",
    text: "Aprovechando que la situación se había calmado y que tanto Liora como Thalia se encontraban en el cuarto decidí buscar explicaciones.",
    background: "../assets/Background/",
    character1: "",
    character2: "",
    choices:[]
},{
    name: "Kaelith",
    text: "¿Qué paso ahí?",
    background: "../assets/Background/",
    character1:"../assets/Characters/Kaelith_sprite1.png",
    character2: "",
    choices:[]
},{
    name: "Liora",
    text: "Lo siento.",
    background: "../assets/Background/",
    character1: "",
    character2: "../assets/Characters/Liora_sprite1.png",
    choices:[]
},{
    name: "Thalia",
    text: "Yo no hice nada.",
    background: "../assets/Background/",
    character1: "",
    character2: "../assets/Characters/Thalia_sprite1.png",
    choices:[]
},{
    name: "Kaelith",
    text: "La gema, es una gema de activación, llevas formando parte del grupo cuatro años, ¿no? ",
    background: "../assets/Background/",
    character1:"../assets/Characters/Kaelith_sprite1.png",
    character2: "",
    choices:[]
},
{
    name: "Thalia",
    text: "Si, pero eso que tiene que ver.",
    background: "../assets/Background/",
    character1: "",
    character2: "Thalia",
    choices:[]
},{
    name: "Kaelith",
    text: "No puede ser que una aventurera, la cazadora y trampera del grupo nunca haya visto una gema de activación. Es más, conociendo la extrañeza del objeto alguien tan precavida tuvo que dejarlo estar.",
    background: "../assets/Background/",
    character1:"../assets/Characters/Kaelith_sprite1.png",
    character2: "",
    choices:[]
},{
    name: "Thalia",
    text: "¡Que estas insinuando!",
    background: "../assets/Background/",
    character1: "",
    character2: "../assets/Characters/Thalia_sprite1.png",
    choices:[]
},{
    name: "Kaelith",
    text: "Dejando de lado su falta de emoción y frialdad, Thalia estallo de la ira. Bingo, estaba buscando esta reacción, ahora solo me falta conocer sus motivos.",
    background: "../assets/Background/",
    character1: "",
    character2: "",
    choices:[]
},{
    name: "Kaelith",
    text: "Nada, nada…",
    background: "../assets/Background/",
    character1:"../assets/Characters/Kaelith_sprite1.png",
    character2: "",
    choices:[]
},{
    name: "Liora",
    text: "¡Maldita!",
    background: "../assets/Background/",
    character1: "",
    character2: "../assets/Characters/Liora_sprite1.png",
    choices:[]
},{
    name: "Kaelith",
    text: "Liora cambio su tristeza por ira y se abalanzo contra Thalia. ",
    background: "../assets/Background/",
    character1: "",
    character2: "",
    choices:[]
},{
    name: "Kaelith",
    text: "“No esperaba esto”",
    background: "../assets/Background/",
    character1: "",
    character2: "",
    choices:[]
},{
    name: "Kaelith",
    text: "Solo queda averiguar que paso, en el camino o ayer, por qué Thalia quisiera muerta a Liora.",
    background: "../assets/Background/",
    character1: "",
    character2: "",
    choices:[]
},{
    name: "Kaelith",
    text: "¡Paren!",
    background: "../assets/Background/",
    character1:"../assets/Characters/Kaelith_sprite1.png",
    character2: "",
    choices:[]
},{
    name: "Kaelith",
    text: "Las dos no escucharon y siguieron peleando y golpeándose.",
    background: "../assets/Background/",
    character1: "",
    character2: "",
    choices:[]
},{
    name: "Kaelith",
    text: "Me había prometido que iba dejar de entrometerme. ",
    background: "../assets/Background/",
    character1:"../assets/Characters/Kaelith_sprite1.png",
    character2: "",
    choices:[]
},{
    name: "Kaelith",
    text: "Deje salir mis pensamientos, seguidos de un suspiro, al oír mis palabras las dos centraron su atención en mí.",
    background: "../assets/Background/",
    character1: "",
    character2: "",
    choices:[]
},{
    name: "Liora",
    text: "¡Vas a dejar pasar esta blasfemia Kaelith!",
    background: "../assets/Background/",
    character1:"../assets/Characters/Kaelith_sprite1.png",
    character2: "../assets/Characters/Liora_sprite1.png",
    choices:[]
},{
    name: "Thalia",
    text: "¡Si todo es su culpa, ella…!",
    background: "../assets/Background/",
    character1:"../assets/Characters/Kaelith_sprite1.png",
    character2: "../assets/Characters/Thalia_sprite1.png",
    choices:[]
},{
    name: "Kaelith",
    text: "Las dos son estúpidas, por su juego de niños es posible que muera una persona. No tengo tiempo para esto, si van a matarse háganlo fuera, no quiero limpiar un cuerpo.",
    background: "../assets/Background/",
    character1:"../assets/Characters/Kaelith_sprite1.png",
    character2: "",
    choices:[]
},{
    name: "Kaelith",
    text: "Un silencio ensordecedor encerró el cuarto, las dos me miran fijamente esperando algo que nunca va a llegar. ",
    background: "../assets/Background/",
    character1: "",
    character2: "",
    choices:[]
},{
    name: "Thalia",
    text: "Son insufribles.",
    background: "../assets/Background/",
    character1: "",
    character2: "../assets/Characters/Thalia_sprite1.png",
    choices:[]
},{
    name: "Kaelith",
    text: "Con un poco de agitación en su voz Thalia, se marchó del cuarto.",
    background: "../assets/Background/",
    character1: "",
    character2: "",
    choices:[]
},{
    name: "Liora",
    text: "Maldita plebeya, ¿no crees?",
    background: "../assets/Background/",
    character1: "",
    character2: "../assets/Characters/Liora_sprite1.png",
    choices:[]
},{
    name: "Kaelith",
    text: "…",
    background: "../assets/Background/",
    character1:"../assets/Characters/Kaelith_sprite1.png",
    character2: "",
    choices:[]
},
{
    name: "Kaelith",
    text: "La noche transcurría, me quede sentada en mi cama, fingiendo estar leyendo, mientras Liora seguía interrumpiendo, quejándose de todos en el grupo. Thalia no regreso esa noche. No sé qué habrá pasado entre esas dos, pero anteponer sus problemas personales antes de la profesionalidad no es un lujo que los aventureros se puedan dar. ",
    background: "../assets/Background/",
    character1: "",
    character2: "",
    choices:[]
}








];

