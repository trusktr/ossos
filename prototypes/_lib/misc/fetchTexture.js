import * as THREE from 'three';

export default async function fetchTexture( url, flipY=true, isRepeat=false ){
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Get response
    const res = await fetch( url );
    if( !res.ok ){ Promise.reject(new Error( res.status )); return; } // throw new Error(400);

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Download Binary
    const blob = await res.blob();
    if( !blob ){ Promise.reject(new Error( 'Unable to download image blob' ) ); return; }

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Convert to image
    const img = await window.createImageBitmap( blob );
    // const img = await window.createImageBitmap(blob, {
    //     colorSpaceConversion: 'none',
    //     imageOrientation: p.flipY ? 'flipY' : 'none',
    //   });

    return mkTexture( img, flipY, isRepeat );
}

function mkTexture( img, flipY, isRepeat ){
    const tex       = new THREE.Texture( img );
    tex.wrapT       = tex.wrapS = ( isRepeat )? THREE.ClampToEdgeWrapping : THREE.RepeatWrapping;
    tex.flipY       = flipY;
    tex.colorSpace  = THREE.LinearSRGBColorSpace; // THREE.SRGBColorSpace, THREE.NoColorSpace
    tex.needsUpdate = true; // Needed, else it may render as black
    return tex;
}


// export default function fetchTexture( url, flipY=true, isRepeat=false  ){
//     return new Promise( async ( resolve, reject )=>{
//         // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//         // Get response
//         const res = await fetch( url );
//         if( !res.ok ){ reject( res.status ); return; }

//         // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//         // Download Binary
//         const blob = await res.blob();
//         if( !blob ){ reject( 'Unable to download image blob' ); return; }

//         // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//         // Convert to image
//         // TODO: look into window.createImageBitmap(blob);
//         const obj  = URL.createObjectURL( blob );
//         const img  = new Image();
    
//         img.crossOrigin	 = 'anonymous';
//         img.onload       = ()=>{ URL.revokeObjectURL( obj ); resolve( mkTexture( img, flipY, isRepeat ) ); };
//         img.onerror      = ()=>{ URL.revokeObjectURL( obj ); reject( 'Error loading object url into image' ); };
//         img.src          = obj;
//     });
// }