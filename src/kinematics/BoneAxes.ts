import Vec3                 from '../maths/Vec3';
import Quat, { ConstQuat }  from '../maths/Quat';

// SWING-TWIST-ORTHO
export const AxesDirections = {
    UFR: 0,     // Aim, Chest
    RBD: 1,     // Left Arm
    LBD: 2,     // Right Arm
    DFL: 3,     // LEGS
};
// Object.freeze( DIRS );

export class BoneAxes{
    // x = new Vec3( 1, 0, 0 ); // Right
    // y = new Vec3( 0, 1, 0 ); // Up      - Point
    // z = new Vec3( 0, 0, 1 ); // Forward - Twist

    ortho = new Vec3( Vec3.RIGHT );     // X
    swing = new Vec3( Vec3.UP );        // Y
    twist = new Vec3( Vec3.FORWARD );   // Z

    // TODO - Delete
    applyQuatInv( q: ConstQuat ): this{
        const qi = new Quat( q ).invert();
        this.ortho.transformQuat( qi );
        this.swing.transformQuat( qi );
        this.twist.transformQuat( qi );
        return this;
    }

    // TODO - DELETE
    useBoneFace(){
        this.ortho.copy( Vec3.RIGHT );
        this.twist.copy( Vec3.UP );
        this.swing.copy( Vec3.FORWARD );
        return this;
    }

    setQuatDirections( q: ConstQuat, iAxes:number ): this{
        switch( iAxes ){
            case AxesDirections.UFR:
                this.swing.fromQuat( q, Vec3.UP );
                this.twist.fromQuat( q, Vec3.FORWARD );
                this.ortho.fromQuat( q, Vec3.RIGHT );
                break;

            case AxesDirections.RBD:
                this.swing.fromQuat( q, Vec3.RIGHT );
                this.twist.fromQuat( q, Vec3.BACK );
                this.ortho.fromQuat( q, Vec3.DOWN );
                break;

            case AxesDirections.LBD:
                this.swing.fromQuat( q, Vec3.RIGHT );
                this.twist.fromQuat( q, Vec3.BACK );
                this.ortho.fromQuat( q, Vec3.DOWN );
                break;

            case AxesDirections.DFL:
                this.swing.fromQuat( q, Vec3.DOWN );
                this.twist.fromQuat( q, Vec3.FORWARD );
                this.ortho.fromQuat( q, Vec3.LEFT );
                break;
        }

        return this;
    }
    
}

/*
const qiFwd = new Vec3();
const qiUp  = new Vec3();
const qiRit = new Vec3();

// Project toe's position so its coplaner to foot position to define its forward direction
qiFwd .copy( bones[3].world.pos )
    .planeProj( bones[2].world.pos, Vec3.UP )
    .sub( bones[2].world.pos )
    .norm();

// Make the rest of the directions orthogonal
qiRit.fromCross( Vec3.UP, qiFwd, );
qiUp.fromCross( qiFwd, qiRit );

// Quat Inverse Directions
q.fromInvert( bones[2].world.rot );
qiFwd.transformQuat( q );
qiRit.transformQuat( q );
qiUp.transformQuat( q );
*/