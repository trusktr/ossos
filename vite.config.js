import packageJson      from "./package.json";
import path             from "path";
import { defineConfig } from "vite";
//import { directoryPlugin } from 'vite-plugin-list-directory-contents/dist/plugin.js';
import { directoryPlugin } from 'vite-plugin-list-directory-contents';

const fileName = {
    es   : `${packageJson.name}.mjs`,
    cjs  : `${packageJson.name}.cjs`,
    iife : `${packageJson.name}.iife.js`,
};

export default defineConfig(({ command, mode, ssrBuild }) => {
    if ( command === 'serve') {
      return {
            base      : './',
            // publicDir : path.join( __dirname, 'prototypes' ),
            plugins   : [
                directoryPlugin( {
                    baseDir     : __dirname,
                    filterList  : [ 'node_modules', '.git', '.github', '_store', '_images', 'dist', 'src', '.*' ],
                }),
            ],

            server    : {
                host        : 'localhost',
                port        : 3010,
                open        : '/',
                strictPort  : true,
            },

            resolve : {
                alias:{
                    '@three'          : path.resolve( __dirname, './prototypes/_thirdparty/three.module.js' ),
                    '@OrbitControls'  : path.resolve( __dirname, './prototypes/_thirdparty/OrbitControls.js' ),
                }
            }
        }
    } else {
      // command === 'build'
      return {
        base  : "./",
        build : {
          minify    : false,
          target    : "esnext",
          lib       : {
            entry    : path.resolve(__dirname, "src/index.ts"),
            name     : packageJson.name,
            formats  : ["es"],
            fileName : ( format )=>fileName[format],
          },
            rollupOptions: {
                external: ['three'],
            }
        },
      };
      
    }
  });

/*
export default defineConfig( ( { command, mode, ssrBuild } )=>{
    console.log( 'comma', command, mode );
    switch( mode ){
        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        case 'site':
        case 'serve':

        return {
            base      : './public',
            publicDir : path.join( __dirname, 'public' ),
            plugins   : [

            ],

            server    : {
                port        : 3010,
                open        : '/',
                strictPort  : true,
            },
        }

        break;

        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        case 'build' :
            return {
                base  : "./",
                build : {
                  minify    : false,
                  lib       : {
                    entry    : path.resolve(__dirname, "src/index.ts"),
                    name     : packageJson.name,
                    formats  : ["es", "cjs", "iife"],
                    fileName : ( format )=>fileName[format],
                  },
                },
              };
        break;
    }

} );
*/