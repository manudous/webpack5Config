# Los loaders van fichero a fichero van a uno y por ejemplo lo transforma de ecmas6 a ecmas 5,
# se ejecutan de abajo para arriba y un plugin tiene visión global de todo, puede manejar lo que le de la gana. 




# 1. Instalamos Package.json 

npm init -y

# 2. Instalamos Web Pack y Web Pack-cli

npm install webpack webpack-cli --save-dev

# 3. Dentro del package.json agregamos un start

"scripts": {
    + "start": "webpack --mode development",
    "test": "echo \"Error: no test specified\" && exit 1"
  },

# 4. Instalamos el cli de babel, el core de babel y los presets más recomendables.

npm install @babel/cli @babel/core @babel/preset-env --save-dev

# 5. Vamos a instalar un loader para que Webpack se entienda con babel. Interactúa con webpack y Babel. Es un intermediario entre los dos.

npm install babel-loader --save-dev

# 6. Creamos un fichero llamado Students.js

// Let's use some ES6 features 
const averageScore = "90";
const messageToDisplay = `average score ${averageScore}`;

document.write(messageToDisplay);

# 7. Creamos un fichero llamado .babelrc, y añademos un objeto de JavaScript

{
    "presets": ["@babel/preset-env"] 
}

# 8. Creamos un fichero con el configurador de Webpack llamado webpack.config.js

 ## Creo un modulo.exports y le digo que el archivo de entrada es students.js

module.exports = {
    entry:
        ["./students.js"],
};

 ## Como le decimos que ese archivo está en ECMAS6 y se convierta en ECMAS5 le meto rules al modulo.

module.exports = { 
    entry: ["./students.js"], 
    module: {
    rules: [
        { 
            test: /\.js$/, // Mírame los ficheros que tengan la extensión *.js
            exclude: /node_modules/, // No mire en la carpeta node_modelues
            loader: "babel-loader", // utilice el loader babel-loader para eso
        }, 
      ],
    }, 
};

# 9. Agregamos un HTML de ejemplo que no es como se hará pero mientras nos sirve

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Webpack 4.x by sample</title>
  </head>
  <body>
    Hello Webpack!
    <script src="./dist/main.js"></script>
  </body>
</html>

# 10. Creamos otro archivo llamado averageService.js e introducimos

export function getAvg(scores) { 
    return getTotalScore(scores) / scores.length; 
} 

function getTotalScore(scores) { 
    return scores.reduce((score, count) => score + count); 
}

## Nos traemos esa función export a students.js

import {getAvg} from './averageService';

## Agregamos a students.js una lista de puntuaciones

const scores = [90, 75, 60, 99, 94, 30];

## y cambiamos esta variable

const averageScore = getAvg(score);

# 11. Instalamos un servidor web de webpack, instalamos como dependencia de desarrollo.

npm install webpack-dev-server --save-dev

## vamos al package.json y el start lo renombramos a build

"build": "webpack --mode development",

## y volvemos a crear el start con,

"start":"webpack serve",

## Cambiar el puerto del Servidor si es necesario

module.exports = { 
    entry: ["./students.js"], 
    module: {
      rules: [
        {
          test: /\.js$/, // Mírame los ficheros que tengan la extensión *.js
          exclude: /node_modules/, // No mire en la carpeta node_modelues
          loader: "babel-loader", // utilice el loader babel-loader para eso
        },
      ],
    },
    devServer: {
        port: 8085,
    },
  };

# 12. Vamos al archivo index.html y ya referenciamos a main.js, esto no es definitivo

- <script src="./dist/main.js"></script>
+ <script src="main.js"></script>

# 13. A partir de ahora ahora vamos a empezar a montar un build más competente.

Instalamos un plugin para quitar el script del html en index.html

npm install html-webpack-plugin --save-dev

## borramos el script del html

- <script src="main.js"></script>

## luego insertamos el script en el webpack.config.js y los plugins hay que importarlos con Ecmas5.

const HtmlWebpackPlugin = require('html-webpack-plugin');

## y agregamos el script

module.exports = { 
    entry: ["./students.js"], 
    module: {
      rules: [
        {
          test: /\.js$/, // Mírame los ficheros que tengan la extensión *.js
          exclude: /node_modules/, // No mire en la carpeta node_modelues
          loader: "babel-loader", // utilice el loader babel-loader para eso
        },
      ],
    },
    devServer: {
        port: 8085,
    },
    plugins: [
      new HtmlWebpackPlugin({
        filename: "index.html", //  y donde lo escupe en el dist
        template: "index.html", // nombre en el src, donde parte
      }),
    ],
};

## Creamos en Hash en base de lo que tenga el contenido crea un fichero nuevo, así se refresca automáticamente.sería como main.js?3234a123a1d2,añadimos al plugin 

plugins: [
    new HtmlWebpackPlugin({
      filename: "index.html", //  y donde lo escupe en el dist
      template: "index.html", // nombre en el src, donde parte
      hash: true,
    }),
  ],

# 13. Custom CSS. Creamos un estilo llamado mystyles.css y le añadimos

.red-background {
  background-color: indianred; 
}

## añadimos un div al html

<div class="red-background">Zooy un roho</div>

## Pero esto no funcionaría el estilo, porque tenemos que decir al webpack que traiga cosas y vaya procesándolas. Nos hace falta un loader de css, también hace falta un cargador de estilos (style loader) para insertar el css en el html. Después veremos como sacarlo fuera.

npm install style-loader css-loader --save-dev

## vamos a traerlos al webpack.config.js el mystyles.css

entry: ["./students.js","./mystyles.css"], 

## Necesitamos introducir el loader para manejar el fichero mystyles.css.

{
  test: /\.css$/,
  exclude: /node_modelues/, // excluimos el node modules de momento
  use: [ // ejecuto más de un css
    {
      loader: 'style-loader', //
    },
    {
      loader: "css-loader", // con este parseamos los CSS
    },
    // fichero => cssloader => styleloader
  ]
} 

## Pero esto carga el CSS dentro del main.js y esto no es correcto. 


# 14. Chunk o trozear los archivos, traernos a dist los archivos que querramos

- entry: ["./students.js","./mystyles.css"], 

+ entry: {
    app: './students.js', // creamos dos archivos uno para el js y otro para el style pueden ir entre corchetes
    appStyles: ['./mystyles.css'] // no haría falta en este caso pero si hubiera más css sí
  },

# 15. Como dijimos antes main.js?3234a123a1d2 no es muy aconsejable y es mejor tenerlo a nivel de fichero sería una cosa como main324k324j235.js. Vamos a crear un output que de el nombre del archivo y luego agrege el resto.Se agrega un chunkhash, un número que se genera según el contenido que tenga el archivo.

module.exports = { 
  entry: {
    app: './students.js',// creamos dos archivos uno para el js y otro para el style pueden ir entre corchetes
    appStyles: ['./mystyles.css'] // no haría falta en este caso pero si hubiera más css sí
    // les puedes poner el nombre que tú quieras, mejor que tengan sentido
  },
  output: {
    filename: '[name].[chunkhash].js',
  },
  ........
  ........

## Quitamos el hash: true, del plugin pq ya nos lo genera automáticamente.

  plugins: [
  new HtmlWebpackPlugin({
    filename: "index.html", //  y donde lo escupe en el dist
    template: "index.html", // nombre en el src, donde parte
    - hash: true,
  }),
],

## ahora quiero que se modifique el archivo si se cambia, no todos. Así si no cambia el navegador lo puede cachear, y sino modificarlo si es modificado. Una solución es cambiarlo des des del package.jsaon en build "build": "rm dist $$ webpack --mode development", pero es un problema pq borrar carpetas en cada sitema operativo.

## Otra solución sería instalando un paquete que se llama rimraf https://www.npmjs.com/package/rimraf e intalariamos con npm install rimraf --save-dev y luego pondríamos en el build lo siguiente:// sería rimraf más la carpeta de destino, en este caso es dist "build": "rimraf dist $$ webpack --mode development" PREGUNTAR DONDE LO GUARDA,....

## Pero nosotros lo vamos a hacer de otra forma, INTEGRADO EN WEBPACK, vamos a instalar un plugin que se llama Web Pack Plugin

npm install clean-webpack-plugin --save-dev

## Importamos el plugin

const { CleanWebpackPlugin } = require('clean-webpack-plugin');

## Y metemos esto dentro de los plugins

plugins: [
  new HtmlWebpackPlugin({
    filename: "index.html", //  y donde lo escupe en el dist
    template: "index.html", // nombre en el src, donde parte
  }),
  new CleanWebpackPlugin(),
],

## Pero nos falta un poco más pq no encuentra el Path, y lo metemos y en el output tenemos que indicar donde volcar la salida del bundle. Agregamos el path después de los imports.

const path = require("path");

## Y dentro del Output agregamos esto

output: {
  filename: '[name].[chunkhash].js',
  + path: path.resolve(process.cwd(), "dist"), // Concatena mi carpeta actual con dist.
},

# 16. Ahora vamos aquitar el js para que sea un archivo css.

## Vamos a instalarnos un plugin que se llama mini-css-extract-plugin

npm install mini-css-extract-plugin --save-dev

## Importamos el Plugin al webpack.config.js

const MiniCssExtractPlugin = require('mini-css-extract-plugin');

Este plugin tiene dos cosas un loader y un plugin:

## Quitamos el style loader 

use: [ // ejecuto más de un css
        {
    ---      loader: 'style-loader', // Quitamos este
        },
        {
          loader: "css-loader", // con este parseamos los CSS
        },

## y agregamos el MiniCssExtractPlugin.loader

+ use: [MiniCssExtractPlugin.loader, "css-loader"], 

## Ahora en la zona de plugins le decimos que tenemos y me genere un nombre de fichero y un hash.

plugins: [
  new HtmlWebpackPlugin({
    filename: "index.html", //  y donde lo escupe en el dist
    template: "index.html", // nombre en el src, donde parte
  }),
  new CleanWebpackPlugin(),
  + new MiniCssExtractPlugin({
    filename: "[name].[chunkhash].css",
    chunkFilename: "[id].css",
  }),

## El appStyle.js ahora se queda vacío y lo que hace es importar el appStyle.css.

# 17. Vamos a instalar la librería de Bootstrap

npm install bootstrap --save

## nos vamos a nostro webpack.config.js y creamos una entrada de vendedores de terceros, vendorStyles.

entry: {
  app: './students.js',// creamos dos archivos uno para el js y otro para el style pueden ir entre corchetes
  appStyles: ['./mystyles.css'], // no haría falta en este caso pero si hubiera más css sí
  // les puedes poner el nombre que tú quieras, mejor que tengan sentido
  + vendorStyles: ['./node_modules/bootstrap/dist/css/bootstrap.css'],
},

## Vamos a utilizar el Jumbotron, lo agregamos al HTML, y hace falta agregarle un loader para bootstarp

<div class="jumbotron">
  <h1>Testing Bootstrap</h1>
  <p>Bootstrap is the most popular ...</p>
</div>

## Quitamos el exclue de node_modules en el loader de css sino no nos leería bootstrap

- exclude: /node_modelues/,

#  18. Ahora seguimos con SASS, renombramos el myStyle.css a myStyle.scss, y cremos dentro del archivo una variable

$blue-color: teal;

.red-background {
  background-color: $blue-color;
}

## cambiamos el fichero en entry appStyles y cambiamos la extensión del fichero

- appStyles: ['./mystyles.css'],
+ appStyles: ['./mystyles.scss'],

## Primero instalamos el Sass Loader y Sass

npm install sass sass-loader --save-dev

## Luego instalamos el Loader en Webpack config, dentro de rules.

{
  test: /\.scss$/,
  use: [
    MiniCssExtractPlugin.loader, // tercero el minicssextract
    "css-loader", // segundo el css loader 
    {
      loader: "sass-loader",  // primero utilizo el loader de sass loader
      options: {
        implementation: require("sass"), // itilice el sass bueno
      },
    },
  ],
},

# 19. Ordernamos todo en una carpeta src y compiamos todo lo que es código de aplicación, ya ahora tenemos que hacer el cambio de carpeta en webpack.config. Nos traemos el path base de la aplicación y lo ponemos debajo del path anteriormete puesto

const basePath = __dirname;

## Ahora le digo que el contexto donde va a trabajar es src, y lo ponemos arriba de los entries

context: path.join(basePath, 'src'),

## Y como tenemos que subir de nivel en la carpeta de bootstrap hacemos estoy

- vendorStyles: ['./node_modules/bootstrap/dist/css/bootstrap.css'],
+ vendorStyles: ['../node_modules/bootstrap/dist/css/bootstrap.css'],

## renombrar la carpeta students.js que va a ser la principal del proyecto por index.js y cambio en entry en webpack.config

entry: {
    - app: './students.js',
    appStyles: ['./mystyles.scss'], 
    vendorStyles: ['../node_modules/bootstrap/dist/css/bootstrap.css'],
},

entry: {
    + app: './index.js',
    appStyles: ['./mystyles.scss'], 
    vendorStyles: ['../node_modules/bootstrap/dist/css/bootstrap.css'],
},

# 20. Imágenes. Eliminiamos el Jumbotron y añadimos un div

- <div class="jumbotron">
  <h1>Testing Bootstrap</h1>
  <p>Bootstrap is the most popular ...</p>
</div>

+ <div id="imgContainer"></div>

# Importamos la imagen a index.js

import logoImg from './content/logo_1.png';

# Creamos un elemento de imagen le digo que la podemos encontrar el logoImg, luego metemos la imagen dentro del img container

const img = document.createElement('img');
img.src = logoImg;

document.getElementById('imgContainer').appendChild(img);

# Ahora tenemos que agregar el loader para que reconozca los archivos de imagen. Lo ponemos dentro de rules. Le decimos que le pasamos un recurso

{
  test: /\.(png|jpg)$/,
  type: "asset/resource", 
},

# agrego unos estilos para la foto en mystyles.sccs

img {
  display: block;
  width: 200px;
}

# Vamos a cargar una imagen directamente en el HTML, pero esto es un error pq cuando estás en producción se lía un cacao, pq no se ve la imagen porque la ruta no existe en dist, ¿qué podemos hacer? 

<img src="./src/content/logo_2.png" />

# Le tenemos que decir a webpack que sea capaz de parsear la imagen y la meta donde sea. Me tengo que instalar un loader que se llame HTML Loader, tengo que irme a public y decirle que es el public path, puedes decirle que tire de un local o tire de una CDN.

## Primero instalamos una rules más
npm install html-loader --save-dev

{
  test: /\.html$/,
  loader: "html-loader",
},

## Luego public path

output: {
    filename: '[name].[chunkhash].js',
    path: path.resolve(process.cwd(), "dist"),
    + publicPath: "/",
  },

## Ya no tengo que referenciar el src de las fotos pq ya los tengo refereciado

- <img src="./src/content/logo_2.png" />
+ <img src=".content/logo_2.png" />

# 21. React. Vamos a quitar el todos los divs

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Webpack 4.x by sample</title>
  </head>
  <body>
    Hello Webpack!
  </body>
</html>

## Instalamos React y React dom

npm install react react-dom --save

## Vamos al Index.html y vamos a crear un div con un identificador para crear un punto de entrada.

+ <div id="root"></div>

## Creamos un Componente

+ averageComponent.jsx

import React from "react";
import { getAvg } from "./averageService";

export const AverageComponent = () => {
  const [average, setAverage] = React.useState(0);

  React.useEffect(() => {
    const scores = [90, 75, 60, 99, 94, 30];
    setAverage(getAvg(scores));
  }, []);

  return (
    <div>
      <span>Students average: {average}</span>
    </div>
  );
};

## Borramos todo lo que hay en index.js lo renombramos a index.jsx y ponemos un punto de entrada

import React from "react";
import ReactDOM from "react-dom"; // Como interactua React con una App web
import { AverageComponent } from "./averageComponent";

ReactDOM.render(// Pinto mi componente
  <div>
    <h1>Hello from React DOM</h1>
    <AverageComponent />
  </div>,
  document.getElementById("root")// Donde pinto ese componente
);

## Renombramos el entry

 entry: {
  -  app: './index.js'
  +  app: './index.jsx'
.......

## Le decimos que en las rules acepte tanto js como jsx el babel-loader

rules: [
  {
    test: /\.jsx?$/, // Mírame los ficheros que tengan la extensión *.js y *.jsx
    exclude: /node_modules/, // No mire en la carpeta node_modelues
    loader: "babel-loader", // utilice el loader babel-loader para eso
  },

## En babel transforma las etiquetas que en realidad serían del tipo React.createElement div tenemos que instalar para eso babel preset React es una configuración ya hecha para poder comunicarme con babel y poder transpilar.

npm install @babel/preset-react --save-dev

## Añadimos en .babelrc

{
  "presets": ["@babel/preset-env", "@babel/preset-react"] 
}

## Voy a crearme una extensión en Resolve y le voy a decir las extensiones que puede trabajar. Esto sirve para cuando nos vayamos a un Import no me haga falta opner averageComponent.jsx por ejemplo.

resolve: {
  extensions: ['.js', '.jsx'],
},

## MIRAR WEBPACK MERGE PORQUE AYUDA PARA LOS ERRORES!!!!!!!!!!!!!!!

# 22. CSS Modules

### Resolver el problema de colisiones entre nombre de clases de CSS. Cuando empieza a crecer el proyecto puede crecer y pisar dos clases.

### Creamos un fichero que se llame averageComponentStyles.scss

+ averageComponentStyles.scss

### Y le agregamos

+ $background: teal;

.result-background {
    background-color: $background;
}

### Meto nuevo div en AverageComponent, en vez de class hay que poner className es la clase reservada para eso

- <span>Students average: {average}</span>

+ <span className="result-background">Students average: {average}</span>

### En entre hacemos referencia al averageComponentStyles.css dentro de entry - appStyles

+ appStyles: ["./mystyles.scss", './averageComponentStyles.scss'],

### Me creo ahora otro average service get Total Score y le meto un export y voy a crear un componente con ese funcionalidad y le voy a llamar totalScoreComponent.jsx

+ export function getTotalScore(scores) { 
    return scores.reduce((score, count) => score + count); 
}

### El Componente sería:

import React from "react";
import { getTotalScore } from "./averageService";

export const TotalScoreComponent = () => {
  const [totalScore, setTotalScore] = React.useState(0);

  React.useEffect(() => {
    const scores = [10, 20, 30, 40, 50];
    setTotalScore(getTotalScore(scores));
  }, []);

  return (
    <div>
      <span className="result-background">
        Students total score: {totalScore}
      </span>
    </div>
  );
};


### Creamos los estilos de ese totalScoreComponentStyles.scss

$background: indianred;

.result-background {
  background-color: $background;
}

### Metemos el import en index.jsx

import { TotalScoreComponent } from './totalScoreComponent';

### Y añadimos el componente

ReactDOM.render(
  <div>
    <h1>Hello from React DOM</h1>
    <AverageComponent />
  +  <TotalScoreComponent />
  </div>,
  document.getElementById("root")
);

### En webpack componentes pongo la ruta en entry => appStyles, ahora en vez de verse los dos verdes se ven los dos rojos porque el último machaca a tdoos pq tien el mismo nombre la clase pero diferente color.

### Tenemos que quitar las dos entradas de appStyles y solo dejar el global si tenemos uno.

entry: {
  app: './index.jsx',
  appStyles: ["./mystyles.scss",
  - './averageComponentStyles.scss',
  - './totalScoreComponentStyles.scss',
  ],  
  vendorStyles: ['../node_modules/bootstrap/dist/css/bootstrap.css'],
},

### y lo siguiente que voy a hacer es importar los css y relacionarlos con un fichero concreto. Me voy a scss-loader y añado esto y donde teníamos css-loader, le vamos a poner opciones y lo cambiamos por: ESto ha sido cambiado en Webpack5.

{
  loader: "css-loader",
  options: {
    import: false,
    modules: true, // Le estoy diciendo que utilice los módulos de css-loader.
  }
},

### Nos vamos ahora a averageComponent.jsx y le decimos que vamos a traer el averageComponentStyles.scss

const classes = require('./averageComponentStyles.scss').default;

### Después me voy al className y le digo que voy a ejecutar código y que voy a invocar a classes de result-background

return (
  <div>
-     <span className="result-background">
+     <span className={classes['result-background']}>
      Students average: {average}
    </span>
  </div>
);

### Hago lo mismo con totalScoreComponent.jsx

import React from 'react';
import { getTotalScore } from './averageService';
+ const classes = require('./totalScoreComponentStyles.scss').default;

export const TotalScoreComponent: React.FunctionComponent = () => {
  ...

  return (
    <div>
-     <span className="result-background">
+     <span className={classes['result-background']}>
        Students total score: {totalScore}
      </span>
    </div>
  );
};

### En resumen, me traigo mi CSS donde me haga falta y luego yo lo referencio donde me haga falta. En realidad tu quieres tener unos nombre de clases más normales. Vamos a decirle que los css con guiones no me los ponga y los convierta a camel-Case, en la parte de mdoules abro llaves y pongo el siguiente setting.

...
  module: {
    rules: [
      ...
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            C
+              },
            },
          },
          ...
        ],
      },
      ...
    ],
  },
  ...
};

### Como ya le hemos añadido el camelcase donde tenemos ClassName={classes["result-background"]} podemos ya cambiarlo por camelcase. Y se haría mucho más legible el código.

- <span className={classes['result-background']}>
+ <span className={classes.resultBackground}>

### Ahora vmamos a configurar para las clases que saca el scss sean más legibles cuando las saca. Vamos a cambiar la configuración de webpack.config para que sea más legible.

  {
    loader: "css-loader",
    options: {
      import: false,
      modules: {
        exportLocalsConvention: "camelCase",
+        localIdentName: '[path][name]__[local]--[hash:base64:5]',//el nombre de css sea el path el nombre el local y un valor único para evitar colision
+        localIdentContext: path.resolve(__dirname, 'src'),
+        localIdentHashPrefix: 'my-custom-hash',// aquí le meto mi texto para que no le coincida al menos el hash
      },
    },
  },

### Si inspecciono el elemento en el navegador me saldría nombre del componente, nombre del selector y un hash aleatorio para que no me coincida con el reto, y aparecería ya de esta manera.

<span class="totalScoreComponentStyles__result-background--h0Uo7">Students total score: 150</span>

### Vamos a ver como se lleva esto con librerías que bajemos, mezclando css modules con boodstrap, me traigo el jumbotron y resultbackground a averageComponent.jsx

...

  return (
    <div>
      <span className={classes.resultBackground}>
        Students average: {average}
      </span>
+     <div className={`jumbotron ${classes.resultBackground}`}> // Utilizamos una clase de jumbotron con un clase nuestra
+       <h1>Jumbotron students average: {average}</h1>
+     </div>
    </div>
  );
};

### Le añadimos estilos al CSS averageComponentStyles.scss. 

$background: teal;
+ $jumbotronBackground: darkseagreen;

.result-background {
  background-color: $background;
}

+ .jumbotron.result-background {
+   background-color: $jumbotronBackground;
+   display: block;
+ }

### Si hacemos esto nada cambia, no se llevan bien esos estilos. Le vamos a decir que jumbotron en un estilo global para que no lo busque en Css modules. Así hacemos que no busque prefijos sufijos y esas cosas, es de global y el otro estilo sí.

$background: teal;
$jumbotronBackground: darkseagreen;

.result-background {
  background-color: $background;
}

- .jumbotron.result-background {
+ :global(.jumbotron).result-background {
  background-color: $jumbotronBackground;
  display: block;
}

## Para que nos funcionen los import de scss tenemos que crear un archivo nuevo llamado declaration.d.ts y ya en vez de utilizar el require utilizamos el import, sino lo hicieramos así no reconocería nuestros archivos scss y daría error.

+ declare module "*.scss";

### Y ya podemos cambiar nuestros imports



# 23. Typescript

### Instalamos typescript en local porque en global 

npm install typescript --save-dev

### Instalamos el preset para typescript

npm install @babel/preset-typescript --save-dev

### Modificamos el .babelrc para añadir el Preset de Typescript,

{
  "presets": [
    "@babel/preset-env",
    "@babel/preset-react",
+   "@babel/preset-typescript"
  ]
}

### Agregamos un archivo tsconfig.json

{
  "compilerOptions": {
    "target": "es6",
    "module": "es6",
    "moduleResolution": "node",
    "declaration": false,
    "noImplicitAny": false,
    "allowSyntheticDefaultImports": true,
    "sourceMap": true,
    "jsx": "react",
    "noLib": false,
    "suppressImplicitAnyIndexErrors": true,
    "skipLibCheck": true,
    "esModuleInterop": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}

### Ahora actualizamos todos los archivos a ts o tx y en wepack.config

module.exports = {
  context: path.join(basePath, "src"),
  resolve: {
-    extensions: [".js", ".jsx"]
+    extensions: [".js",".ts", ".tsx"]
  },
  entry: {
-    app: "./index.jsx",
+    app: "./index.tsx",
    appStyles: ["./mystyles.scss"],
    vendorStyles: ["../node_modules/bootstrap/dist/css/bootstrap.css"]
  },
----------------
   module: {
    rules: [
      {
-        test: /\.jsx?$/,
+        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      },
      {
        test: /\.scss$/,
-------------

### Para que no salga tantos errores vamos a cambiar la configuración de webpack.config.js, me informe solo cuando hay errores.

module.exports = {
  context: path.join(basePath, "src"),
  resolve: {
    extensions: [".js", ".ts", ".tsx"]
  },
  entry: {
    app: "./index.tsx",
    appStyles: ["./mystyles.scss"],
    vendorStyles: ["../node_modules/bootstrap/dist/css/bootstrap.css"]
  },
+  devServer: {
+    stats: "errors-only",
+  },

## Ahora queremos tener Intellesense con React y React Dom las instalamos, si me poco a picar con React y me equivoco me avisa.

npm install @types/react @types/react-dom --save-dev

## Cambiamos el averageService.ts

- export function getAvg(scores) {
+ export function getAvg(scores : number[]) {

  return getTotalScore(scores) / scores.length;
}

- export function getTotalScore(scores) {
+ export function getTotalScore(scores : number[]) {
  return scores.reduce((score, count) => score + count);
}

# Y 

- export const TotalScoreComponent = () => {
+ export const TotalScoreComponent : React.FC = () => {
  const [totalScore, setTotalScore] = React.useState(0);

### Aunque no se queja de la transpilación, si echamos un vistazo a las importaciones, podemos ver que están marcadas como error en VSCode, mecanografiado no sabe cómo importar un archivo css, simplemente podemos declararlo como un módulo. Babel no te hace ningún checking. En el Start vamos a ejecutar en parelo el start conel chequeador de ts y el start, instalamos un paquete que sirve para ejecutar cosas en paralelo.

npm install npm-run-all --save-dev

### Me voy al package.json, voy a meter un script para hacer el typechecking, ejecuta y comprueba que todos los ficheros están, despues un type watch ejecutar la tarea y me quedo vigilando, si cambia alguno de los ficheros lanzo otra vez la configuración. Renombre el start a start-dev y me hago otro start meto par que cambia de color cada uno de los procesos que ejecute y los vea.

  "scripts": {
-    "start": "webpack-dev-server --mode development --open",    
+    "start": "run-p -l type-check:watch start:dev", //4. Ejecuta en paralelo type-check y el start:dev
+    "start:dev": "webpack serve --mode development",
+    "type-check": "tsc --noEmit",  // 1. Checkeo de tipos
+    "type-check:watch": "npm run type-check -- --watch", // 2. Checkeo de tipos pero mirando cuando cambien ficheros vuelvo a mirar

    "build": "webpack --mode development"
},

##  para que aparezcan los archivos *.ts para poder depurar el código en el navegador, necesitamos tener activo en tsconfig.json el 

"sourceMap": true,

## y necesitamos añadir un setting en el webpack.config.js, luego en el navegador nos vamos a inspeccionar luego a Source y la izquierda aparecerá una carpeta llamada webpack y dentro de ella tendremos nuestros ficheros que podremos depurar

module.exports = { 
  context: path.join(basePath, 'src'),
  resolve: {
    extensions: [".js",".ts", ".tsx"]
  },
+  devtool: "eval-source-map",
  entry: {
...

# 24. Producción. Vamos a hacer ahora una configuración de producción y otra de desarrollo

## Descargamos webpack merge es para tirar de un webpack base y mezclar otros

npm install webpack-merge --save-dev

### webpack.merge.js lo renombramos a webpack.common.js y nos vamos a quitar varias cosas, nos quitmos el devtools y el devServer.

module.exports = {
  context: path.join(basePath, "src"),
  resolve: {
    extensions: [".js", ".ts", ".tsx"]
  },
- devtool: "eval-source-map",
  entry: {
    app: "./index.tsx",
    appStyles: ["./mystyles.scss"],
    vendorStyles: ["../node_modules/bootstrap/dist/css/bootstrap.css"]
  },
-  devServer: {
-    stats: "errors-only",
-  },

### Vamos a crear en el raiz un archivo llamado webpack.dev.js que va a ser la configuración de desarrollo y nos importamos el webpack-merge, el archivo de webpack.common.js y le decimos que vamos a exponer la mezclar el merge de common.

const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
  mode: "development", // Este en modo de desarrollo
  devtool: "inline-source-map", 
  devServer: {
    stats: "errors-only", // mi servidor de desarrollo solo me va a mostrar los errores
  },
});

## Ahora cremos otro para producción que sería webpack.prod.js y pondríamos lo siguiente.

const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
  mode: "production",
  stats: "verbose",
});

### cambiamos el start:dev que tire de weback.dev.js e igual con build:dev y de la misma forma haríamos con build:prod y build:dev.

"scripts": {
    "start": "run-p -l type-check:watch start:dev",
-    "start:dev": "webpack-dev-server --mode development",
+    "start:dev": "webpack serve --config webpack.dev.js",
-    "build": "webpack --mode development"
+    "build:dev": "webpack --config webpack.dev.js",
+    "build:prod": "webpack --config webpack.prod.js"
     "type-check": "tsc --noEmit",
     "type-check:watch": "npm run type-check -- --watch",
},


### Ahora si hacemos un run build:dev sale todo desplegado, pero si hacemos un run build:prod sale todo minimizado y listo para subirlo a nuestro servidor. Esto es un espectáculo xd.

# 25. Variables de entorno.

### Me voy a instalar dotenv en para manejar esas variables de entorno. Variables de entorno en Front End tu generas un bundle, y en un BackEnd esa variable de entorno se lee dinámaicante. Nunca pongáis una clave en un entorno de Fron-End

npm install dotenv-webpack --save-dev

### Me voy a crear una variable de desarrollo llamada dev.env y otra de producción prod.env

### Voy a llamar a una rest Api y voy a llamar a ese puerto para traerme datos

dev.env

API_BASE=http://localhost:8081/

### Voy a llamar una Api Base si estoy en producción

prod.env

API_BASE=https://myapp.api/

###### Para utilizarlo hay que poner npm run start:prod

### Me vengo ahora webpack.dev.js y me importo dotenv y utilizo un plugin y le muestro el path

const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
+ const Dotenv = require('dotenv-webpack');

module.exports = merge(common, {
  mode: "development",
  devtool: "inline-source-map",
  devServer: {
    stats: "errors-only",
  },
+ plugins: [
+   new Dotenv({
+     path: './dev.env',
+   }),
+ ],
});

### Y hago lo mismo para webpack.prod.js

const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
+ const Dotenv = require('dotenv-webpack');

module.exports = merge(common, {
  mode: "production",
  devtool: "none",
  stats: "verbose",
+ plugins: [
+   new Dotenv({
+     path: './prod.env',
+   }),
+ ],
});

### Ahora vamos a hacer una prueba y me va a salir por consola si estoy en producción o desarrollo, nos venimos a avarageComponent.tsx y le ponesmnos un console.log

+ console.log(`Api base: ${process.env.API_BASE}`);

### Ahora nos vamos a nuestro prackage.json y cambiamos para tener un start de desarrollo y otro de producción.

  "scripts": {
    "start": "run-p -l type-check:watch start:dev",
    "type-check": "tsc --noEmit",
    "type-check:watch": "npm run type-check -- --watch",
    "start:dev": "webpack-dev-server --mode development --open --config webpack.dev.js",
+   "start:prod": "webpack serve --config webpack.prod.js",
    "build:dev": "webpack --config webpack.dev.js",
    "build:prod": "webpack --config webpack.prod.js"
  },

### Ejecuta esto para que se actualicen las builds

npm run build:dev
npm run build:prod

# 26. Analizador de Bundler.
### Referencia:
<a>https://github.com/webpack-contrib/webpack-bundle-analyzer</a>

### Nos instalamos un paquete que se llama web-pack-bundler 

npm install webpack-bundle-analyzer --save-dev

### y nos creamos una aplicación de webpack de rendimiento

./webpack.perf.js

### me traigo webpack merge y el webpack.prod, y me traigo el bundler analizer, le hago un merge de producción, y le meto este plugin. Sino te va el puerto también se puede cambiar.

const { merge } = require("webpack-merge");
const prod = require("./webpack.prod.js");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

module.exports = merge(prod, {
  plugins: [new BundleAnalyzerPlugin()],
});

### si da problemas el puerto loo cambiaríamos así

module.exports = merge(prod, {
  + plugins: [new BundleAnalyzerPlugin({analyzerPort: 8085})],
});

### me voy ahora al package.json y añado esta línea

    "build:dev": "webpack --config webpack.dev.js",
    "build:prod": "webpack --config webpack.prod.js"
+   "build:perf": "webpack --config webpack.perf.js"
  },






