// #region IMPORTS
import type Pose from '../armature/Pose';
import type Bone from '../armature/Bone';

import Transform from '../maths/Transform';
import Vec3      from '../maths/Vec3';
import Quat      from '../maths/Quat';
// #endregion

export default class SQTSkin{
    // #region MAIN
    bind          !: Array< Transform >;
    world         !: Array< Transform >;

    // Split into 3 Buffers because THREEJS does handle mat4x3 correctly
    // Since using in Shader Uniforms, can skip the 16 byte alignment for scale + pos, store data as Vec3 instead of Vec4.
    offsetQBuffer !: Float32Array;  // Quaternion
    offsetPBuffer !: Float32Array;  // Translation
    offsetSBuffer !: Float32Array;  // Scale

    constructor( bindPose: Pose ){
        const bCnt                          = bindPose.bones.length;
        const world : Array< Transform >    = new Array( bCnt );    // World space matrices
        const bind  : Array< Transform >    = new Array( bCnt );    // bind pose matrices
        
        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Create Flat Buffer Space
        // For THREEJS support, Split DQ into Two Vec4 since it doesn't support mat2x4 properly
        this.offsetQBuffer = new Float32Array( 4 * bCnt );
        this.offsetPBuffer = new Float32Array( 3 * bCnt );
        this.offsetSBuffer = new Float32Array( 3 * bCnt );

        // Fill Arrays
        const vScl = new Vec3( 1, 1, 1 );
        const vPos = new Vec3();
        const vRot = new Quat();
        for( let i=0; i < bCnt; i++ ){
            world[ i ] = new Transform();
            bind[ i ]  = new Transform();

            // Fill Buffers with Identity Data
            vRot.toBuf( this.offsetQBuffer, i * 4 );        // Init Offsets : Quat Identity
            vPos.toBuf( this.offsetPBuffer, i * 3 );        // ...No Translation
            vScl.toBuf( this.offsetSBuffer, i * 3 );        // ...No Scale
        }
        
        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        let b: Bone;
        for( let i=0; i < bCnt; i++ ){
            b = bindPose.bones[ i ];

            // Compute Bone's world space transform
            if( b.pindex !== -1 ) world[ i ].fromMul( world[ b.pindex ], b.local );
            else                  world[ i ].copy( b.local );

            // Inverting it to create a Bind Transform
            bind[ i ].fromInvert( world[ i ] );
        }

        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Save References
        this.bind   = bind;
        this.world  = world;
    }
    // #endregion

    // #region METHODS

    updateFromPose( pose: Pose ): this{
        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        const bOffset = new Transform();
        const w       = this.world;
        let b: Bone;
        let ii = 0;
        let si = 0;

        for( let i=0; i < pose.bones.length; i++ ){
            b = pose.bones[ i ];

            // ----------------------------------------
            // Compute Bone's world space transform
            if( b.pindex !== -1 ) w[ i ].fromMul( w[ b.pindex ], b.local );
            else                  w[ i ].fromMul( pose.offset,   b.local );

            // Compute Offset Transform that will be used for skinning a mesh
            // OffsetTransform = Bone.WorldTransform * Bone.BindTransform
            bOffset.fromMul( w[ i ], this.bind[ i ] );
            
            // ----------------------------------------
            ii = i * 4;                                         // Vec4 Index
            si = i * 3;                                         // Vec3 Index
            this.offsetQBuffer[ ii + 0 ] = bOffset.rot[ 0 ];    // Quaternion
            this.offsetQBuffer[ ii + 1 ] = bOffset.rot[ 1 ];
            this.offsetQBuffer[ ii + 2 ] = bOffset.rot[ 2 ];
            this.offsetQBuffer[ ii + 3 ] = bOffset.rot[ 3 ];

            this.offsetPBuffer[ si + 0 ] = bOffset.pos[ 0 ];    // Translation
            this.offsetPBuffer[ si + 1 ] = bOffset.pos[ 1 ];
            this.offsetPBuffer[ si + 2 ] = bOffset.pos[ 2 ];

            this.offsetSBuffer[ si + 0 ] = bOffset.scl[ 0 ];    // Scale
            this.offsetSBuffer[ si + 1 ] = bOffset.scl[ 1 ];
            this.offsetSBuffer[ si + 2 ] = bOffset.scl[ 2 ];
        }

        return this;
    }
    // #endregion
}