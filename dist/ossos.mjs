import * as THREE from 'three';

class Vec3 extends Array {
  // #region STATIC PROPERTIES
  static UP = [0, 1, 0];
  static DOWN = [0, -1, 0];
  static LEFT = [-1, 0, 0];
  static RIGHT = [1, 0, 0];
  static FORWARD = [0, 0, 1];
  static BACK = [0, 0, -1];
  constructor(v, y, z) {
    super(3);
    if (v instanceof Vec3 || v instanceof Float32Array || v instanceof Array && v.length == 3) {
      this[0] = v[0];
      this[1] = v[1];
      this[2] = v[2];
    } else if (typeof v === "number" && typeof y === "number" && typeof z === "number") {
      this[0] = v;
      this[1] = y;
      this[2] = z;
    } else if (typeof v === "number") {
      this[0] = v;
      this[1] = v;
      this[2] = v;
    } else {
      this[0] = 0;
      this[1] = 0;
      this[2] = 0;
    }
  }
  // #endregion
  // #region GETTERS
  get len() {
    return Math.sqrt(this[0] ** 2 + this[1] ** 2 + this[2] ** 2);
  }
  get lenSqr() {
    return this[0] ** 2 + this[1] ** 2 + this[2] ** 2;
  }
  get isZero() {
    return this[0] === 0 && this[1] === 0 && this[2] === 0;
  }
  clone() {
    return new Vec3(this);
  }
  // #endregion
  // #region SETTERS
  xyz(x, y, z) {
    this[0] = x;
    this[1] = y;
    this[2] = z;
    return this;
  }
  copy(a) {
    this[0] = a[0];
    this[1] = a[1];
    this[2] = a[2];
    return this;
  }
  copyTo(a) {
    a[0] = this[0];
    a[1] = this[1];
    a[2] = this[2];
    return this;
  }
  setInfinite(sign = 1) {
    this[0] = Infinity * sign;
    this[1] = Infinity * sign;
    this[2] = Infinity * sign;
    return this;
  }
  /** Generate a random vector. Can choose per axis range */
  rnd(x0 = 0, x1 = 1, y0 = 0, y1 = 1, z0 = 0, z1 = 1) {
    let t;
    t = Math.random();
    this[0] = x0 * (1 - t) + x1 * t;
    t = Math.random();
    this[1] = y0 * (1 - t) + y1 * t;
    t = Math.random();
    this[2] = z0 * (1 - t) + z1 * t;
    return this;
  }
  // #endregion
  // #region FROM OPERATORS
  fromAdd(a, b) {
    this[0] = a[0] + b[0];
    this[1] = a[1] + b[1];
    this[2] = a[2] + b[2];
    return this;
  }
  fromSub(a, b) {
    this[0] = a[0] - b[0];
    this[1] = a[1] - b[1];
    this[2] = a[2] - b[2];
    return this;
  }
  fromMul(a, b) {
    this[0] = a[0] * b[0];
    this[1] = a[1] * b[1];
    this[2] = a[2] * b[2];
    return this;
  }
  fromScale(a, s) {
    this[0] = a[0] * s;
    this[1] = a[1] * s;
    this[2] = a[2] * s;
    return this;
  }
  fromScaleThenAdd(scale, a, b) {
    this[0] = a[0] * scale + b[0];
    this[1] = a[1] * scale + b[1];
    this[2] = a[2] * scale + b[2];
    return this;
  }
  fromCross(a, b) {
    const ax = a[0], ay = a[1], az = a[2], bx = b[0], by = b[1], bz = b[2];
    this[0] = ay * bz - az * by;
    this[1] = az * bx - ax * bz;
    this[2] = ax * by - ay * bx;
    return this;
  }
  fromNorm(a) {
    let mag = Math.sqrt(a[0] ** 2 + a[1] ** 2 + a[2] ** 2);
    if (mag != 0) {
      mag = 1 / mag;
      this[0] = a[0] * mag;
      this[1] = a[1] * mag;
      this[2] = a[2] * mag;
    } else {
      this[0] = 0;
      this[1] = 0;
      this[2] = 0;
    }
    return this;
  }
  fromNegate(a) {
    this[0] = -a[0];
    this[1] = -a[1];
    this[2] = -a[2];
    return this;
  }
  fromInvert(a) {
    this[0] = 1 / a[0];
    this[1] = 1 / a[1];
    this[2] = 1 / a[2];
    return this;
  }
  fromQuat(q, v = [0, 0, 1]) {
    return this.copy(v).transformQuat(q);
  }
  fromLerp(a, b, t) {
    const ti = 1 - t;
    this[0] = a[0] * ti + b[0] * t;
    this[1] = a[1] * ti + b[1] * t;
    this[2] = a[2] * ti + b[2] * t;
    return this;
  }
  fromSlerp(a, b, t) {
    const angle = Math.acos(Math.min(Math.max(Vec3.dot(a, b), -1), 1));
    const sin = Math.sin(angle);
    const ta = Math.sin((1 - t) * angle) / sin;
    const tb = Math.sin(t * angle) / sin;
    this[0] = ta * a[0] + tb * b[0];
    this[1] = ta * a[1] + tb * b[1];
    this[2] = ta * a[2] + tb * b[2];
    return this;
  }
  // #endregion
  // #region LOADING / CONVERSION
  /** Used to get data from a flat buffer */
  fromBuf(ary, idx) {
    this[0] = ary[idx];
    this[1] = ary[idx + 1];
    this[2] = ary[idx + 2];
    return this;
  }
  /** Put data into a flat buffer */
  toBuf(ary, idx) {
    ary[idx] = this[0];
    ary[idx + 1] = this[1];
    ary[idx + 2] = this[2];
    return this;
  }
  // #endregion
  // #region OPERATORS
  add(a) {
    this[0] += a[0];
    this[1] += a[1];
    this[2] += a[2];
    return this;
  }
  sub(v) {
    this[0] -= v[0];
    this[1] -= v[1];
    this[2] -= v[2];
    return this;
  }
  mul(v) {
    this[0] *= v[0];
    this[1] *= v[1];
    this[2] *= v[2];
    return this;
  }
  scale(v) {
    this[0] *= v;
    this[1] *= v;
    this[2] *= v;
    return this;
  }
  divScale(v) {
    this[0] /= v;
    this[1] /= v;
    this[2] /= v;
    return this;
  }
  addScaled(a, s) {
    this[0] += a[0] * s;
    this[1] += a[1] * s;
    this[2] += a[2] * s;
    return this;
  }
  invert() {
    this[0] = 1 / this[0];
    this[1] = 1 / this[1];
    this[2] = 1 / this[2];
    return this;
  }
  norm() {
    let mag = Math.sqrt(this[0] ** 2 + this[1] ** 2 + this[2] ** 2);
    if (mag != 0) {
      mag = 1 / mag;
      this[0] *= mag;
      this[1] *= mag;
      this[2] *= mag;
    }
    return this;
  }
  cross(b) {
    const ax = this[0], ay = this[1], az = this[2], bx = b[0], by = b[1], bz = b[2];
    this[0] = ay * bz - az * by;
    this[1] = az * bx - ax * bz;
    this[2] = ax * by - ay * bx;
    return this;
  }
  abs() {
    this[0] = Math.abs(this[0]);
    this[1] = Math.abs(this[1]);
    this[2] = Math.abs(this[2]);
    return this;
  }
  floor() {
    this[0] = Math.floor(this[0]);
    this[1] = Math.floor(this[1]);
    this[2] = Math.floor(this[2]);
    return this;
  }
  ceil() {
    this[0] = Math.ceil(this[0]);
    this[1] = Math.ceil(this[1]);
    this[2] = Math.ceil(this[2]);
    return this;
  }
  min(a) {
    this[0] = Math.min(this[0], a[0]);
    this[1] = Math.min(this[1], a[1]);
    this[2] = Math.min(this[2], a[2]);
    return this;
  }
  max(a) {
    this[0] = Math.max(this[0], a[0]);
    this[1] = Math.max(this[1], a[1]);
    this[2] = Math.max(this[2], a[2]);
    return this;
  }
  /** When values are very small, like less then 0.000001, just make it zero */
  nearZero() {
    if (Math.abs(this[0]) <= 1e-6)
      this[0] = 0;
    if (Math.abs(this[1]) <= 1e-6)
      this[1] = 0;
    if (Math.abs(this[2]) <= 1e-6)
      this[2] = 0;
    return this;
  }
  negate() {
    this[0] = -this[0];
    this[1] = -this[1];
    this[2] = -this[2];
    return this;
  }
  clamp(min, max) {
    this[0] = Math.min(Math.max(this[0], min[0]), max[0]);
    this[1] = Math.min(Math.max(this[1], min[1]), max[1]);
    this[2] = Math.min(Math.max(this[2], min[2]), max[2]);
    return this;
  }
  dot(b) {
    return this[0] * b[0] + this[1] * b[1] + this[2] * b[2];
  }
  /** Align vector direction so its orthogonal to an axis direction */
  alignTwist(axis, dir) {
    this.fromCross(dir, axis).fromCross(axis, this);
    return this;
  }
  /** Shift current position to be on the plane */
  planeProj(planePos, planeNorm) {
    const planeConst = -Vec3.dot(planePos, planeNorm);
    const scl = -(Vec3.dot(planeNorm, this) + planeConst);
    this[0] += planeNorm[0] * scl;
    this[1] += planeNorm[1] * scl;
    this[2] += planeNorm[2] * scl;
    return this;
  }
  // #endregion
  // #region TRANFORMS
  transformQuat(q) {
    const qx = q[0], qy = q[1], qz = q[2], qw = q[3], vx = this[0], vy = this[1], vz = this[2], x1 = qy * vz - qz * vy, y1 = qz * vx - qx * vz, z1 = qx * vy - qy * vx, x2 = qw * x1 + qy * z1 - qz * y1, y2 = qw * y1 + qz * x1 - qx * z1, z2 = qw * z1 + qx * y1 - qy * x1;
    this[0] = vx + 2 * x2;
    this[1] = vy + 2 * y2;
    this[2] = vz + 2 * z2;
    return this;
  }
  axisAngle(axis, rad) {
    const cp = new Vec3().fromCross(axis, this), dot = Vec3.dot(axis, this), s = Math.sin(rad), c = Math.cos(rad), ci = 1 - c;
    this[0] = this[0] * c + cp[0] * s + axis[0] * dot * ci;
    this[1] = this[1] * c + cp[1] * s + axis[1] * dot * ci;
    this[2] = this[2] * c + cp[2] * s + axis[2] * dot * ci;
    return this;
  }
  rotate(rad, axis = "x") {
    const sin = Math.sin(rad), cos = Math.cos(rad), x = this[0], y = this[1], z = this[2];
    switch (axis) {
      case "y":
        this[0] = z * sin + x * cos;
        this[2] = z * cos - x * sin;
        break;
      case "x":
        this[1] = y * cos - z * sin;
        this[2] = y * sin + z * cos;
        break;
      case "z":
        this[0] = x * cos - y * sin;
        this[1] = x * sin + y * cos;
        break;
    }
    return this;
  }
  // #endregion
  // #region STATIC    
  static len(a) {
    return Math.sqrt(a[0] ** 2 + a[1] ** 2 + a[2] ** 2);
  }
  static lenSqr(a) {
    return a[0] ** 2 + a[1] ** 2 + a[2] ** 2;
  }
  static dist(a, b) {
    return Math.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2);
  }
  static distSqr(a, b) {
    return (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2;
  }
  static dot(a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  }
  static cross(a, b, out = new Vec3()) {
    const ax = a[0], ay = a[1], az = a[2], bx = b[0], by = b[1], bz = b[2];
    out[0] = ay * bz - az * by;
    out[1] = az * bx - ax * bz;
    out[2] = ax * by - ay * bx;
    return out;
  }
  static scaleThenAdd(scale, a, b, out = new Vec3()) {
    out[0] = a[0] * scale + b[0];
    out[1] = a[1] * scale + b[1];
    out[2] = a[2] * scale + b[2];
    return out;
  }
  static fromQuat(q, v = [0, 0, 1]) {
    return new Vec3(v).transformQuat(q);
  }
  static angle(a, b) {
    const d = this.dot(a, b), c = new Vec3().fromCross(a, b);
    return Math.atan2(Vec3.len(c), d);
  }
  /*
      static angleTo( from: ConstVec3, to: ConstVec3 ): number{
          // NOTE ORIG code doesn't work all the time
          // const denom = Math.sqrt( Vec3.lenSqr(from) * Vec3.lenSqr(to) );
          // if( denom < 0.00001 ) return 0;
          
          // const dot  = Math.min( 1, Math.max( -1, Vec3.dot( from, to ) / denom ));
          // const rad  = Math.acos( dot );
          // const sign = Math.sign( // Cross Product
          //     ( from[1] * to[2] - from[2] * to[1] ) + 
          //     ( from[2] * to[0] - from[0] * to[2] ) +
          //     ( from[0] * to[1] - from[1] * to[0] )
          // );
  
          const d    = Vec3.dot( from, to );
  
          console.log( 'dot', d );
  
          const c    = Vec3.cross( from, to );
          const rad  = Math.atan2( Vec3.len( c ), d );
          // c.norm();
          const sign = Math.sign( c[0] + c[1] + c[2] );// || 1;
          // const sign = Math.sign( to[0] * c[0] + to[1] * c[1] + to[2] * c[2] ) || 1;
          console.log( 'sign', sign );
          
          return rad * sign;
      }
      */
  /*
  static smoothDamp( cur: ConstVec3, tar: ConstVec3, vel: TVec3, dt: number, smoothTime: number = 0.25, maxSpeed: number = Infinity ): TVec3{
      // Based on Game Programming Gems 4 Chapter 1.10
      smoothTime   = Math.max( 0.0001, smoothTime );
      const omega  = 2 / smoothTime;
      const x      = omega * dt;
      const exp    = 1 / ( 1 + x + 0.48 * x * x + 0.235 * x * x * x );
  
      const change = vec3.sub( [0,0,0], cur, tar );
  
      // Clamp maximum speed
      const maxChange   = maxSpeed * smoothTime;
      const maxChangeSq = maxChange * maxChange;
      const magnitudeSq = change[0]**2 + change[1]**2 + change[2]**2;
  
      if( magnitudeSq > maxChangeSq ){
          const magnitude = Math.sqrt( magnitudeSq );
          vec3.scale( change, change, 1 / (magnitude * maxChange ) );
      }
  
      const diff = vec3.sub( [0,0,0], cur, change );
  
      // const tempX = ( velocity.x + omega * changeX ) * deltaTime;
      const temp  = vec3.scaleAndAdd( [0,0,0], vel, change, omega );
      vec3.scale( temp, temp, dt );
  
      // velocityR.x = ( velocity.x - omega * tempX ) * exp;
      vec3.scaleAndAdd( vel, vel, temp, -omega );
      vec3.scale( vel, vel, exp );
  
      // out.x = targetX + ( changeX + tempX ) * exp;
      const out = vec3.add( [0,0,0], change, temp );
      vec3.scale( out, out, exp );
      vec3.add( out, diff, out );
  
      // Prevent overshooting
      const origMinusCurrent = vec3.sub( [0,0,0], tar, cur );
      const outMinusOrig     = vec3.sub( [0,0,0], out, tar );
      if( origMinusCurrent[0] * outMinusOrig[0] + origMinusCurrent[1] * outMinusOrig[1] +  origMinusCurrent[2] * outMinusOrig[2] > -0.00001 ){
          vec3.copy( out, tar );
          vec3.copy( vel, [0,0,0] );
      }
  
      return out;
  }
  */
  // #endregion
}

class Quat extends Array {
  // #region STATIC CONSTANTS
  static LOOKXP = [0, -0.7071067811865475, 0, 0.7071067811865475];
  static LOOKXN = [0, 0.7071067811865475, 0, 0.7071067811865475];
  static LOOKYP = [0.7071067811865475, 0, 0, 0.7071067811865475];
  static LOOKYN = [-0.7071067811865475, 0, 0, 0.7071067811865475];
  static LOOKZP = [0, -1, 0, 0];
  static LOOKZN = [0, 0, 0, 1];
  // #endregion
  // #region MAIN
  constructor(v) {
    super(4);
    if (v instanceof Quat || v instanceof Float32Array || v instanceof Array && v.length == 4) {
      this[0] = v[0];
      this[1] = v[1];
      this[2] = v[2];
      this[3] = v[3];
    } else {
      this[0] = 0;
      this[1] = 0;
      this[2] = 0;
      this[3] = 1;
    }
  }
  // #endregion
  // #region SETTERS / GETTERS
  identity() {
    this[0] = 0;
    this[1] = 0;
    this[2] = 0;
    this[3] = 1;
    return this;
  }
  copy(a) {
    this[0] = a[0];
    this[1] = a[1];
    this[2] = a[2];
    this[3] = a[3];
    return this;
  }
  copyTo(a) {
    a[0] = this[0];
    a[1] = this[1];
    a[2] = this[2];
    a[3] = this[3];
    return this;
  }
  clone() {
    return new Quat(this);
  }
  // #endregion
  // #region FROM OPERATORS
  fromMul(a, b) {
    const ax = a[0], ay = a[1], az = a[2], aw = a[3], bx = b[0], by = b[1], bz = b[2], bw = b[3];
    this[0] = ax * bw + aw * bx + ay * bz - az * by;
    this[1] = ay * bw + aw * by + az * bx - ax * bz;
    this[2] = az * bw + aw * bz + ax * by - ay * bx;
    this[3] = aw * bw - ax * bx - ay * by - az * bz;
    return this;
  }
  /** Axis must be normlized, Angle in Radians  */
  fromAxisAngle(axis, rad) {
    const half = rad * 0.5;
    const s = Math.sin(half);
    this[0] = axis[0] * s;
    this[1] = axis[1] * s;
    this[2] = axis[2] * s;
    this[3] = Math.cos(half);
    return this;
  }
  /** Using unit vectors, Shortest swing rotation from Direction A to Direction B  */
  fromSwing(a, b) {
    const dot = Vec3.dot(a, b);
    if (dot < -0.999999) {
      const tmp = new Vec3().fromCross(Vec3.LEFT, a);
      if (tmp.len < 1e-6)
        tmp.fromCross(Vec3.UP, a);
      this.fromAxisAngle(tmp.norm(), Math.PI);
    } else if (dot > 0.999999) {
      this[0] = 0;
      this[1] = 0;
      this[2] = 0;
      this[3] = 1;
    } else {
      const v = Vec3.cross(a, b, [0, 0, 0]);
      this[0] = v[0];
      this[1] = v[1];
      this[2] = v[2];
      this[3] = 1 + dot;
      this.norm();
    }
    return this;
  }
  fromInvert(q) {
    const a0 = q[0], a1 = q[1], a2 = q[2], a3 = q[3], dot = a0 * a0 + a1 * a1 + a2 * a2 + a3 * a3;
    if (dot == 0) {
      this[0] = this[1] = this[2] = this[3] = 0;
      return this;
    }
    const invDot = 1 / dot;
    this[0] = -a0 * invDot;
    this[1] = -a1 * invDot;
    this[2] = -a2 * invDot;
    this[3] = a3 * invDot;
    return this;
  }
  fromNegate(q) {
    this[0] = -q[0];
    this[1] = -q[1];
    this[2] = -q[2];
    this[3] = -q[3];
    return this;
  }
  fromLookDir(dir, up = [0, 1, 0]) {
    const zAxis = new Vec3(dir).norm();
    const xAxis = new Vec3().fromCross(up, zAxis).norm();
    const yAxis = new Vec3().fromCross(zAxis, xAxis).norm();
    const m00 = xAxis[0], m01 = xAxis[1], m02 = xAxis[2], m10 = yAxis[0], m11 = yAxis[1], m12 = yAxis[2], m20 = zAxis[0], m21 = zAxis[1], m22 = zAxis[2], t = m00 + m11 + m22;
    let x, y, z, w, s;
    if (t > 0) {
      s = Math.sqrt(t + 1);
      w = s * 0.5;
      s = 0.5 / s;
      x = (m12 - m21) * s;
      y = (m20 - m02) * s;
      z = (m01 - m10) * s;
    } else if (m00 >= m11 && m00 >= m22) {
      s = Math.sqrt(1 + m00 - m11 - m22);
      x = 0.5 * s;
      s = 0.5 / s;
      y = (m01 + m10) * s;
      z = (m02 + m20) * s;
      w = (m12 - m21) * s;
    } else if (m11 > m22) {
      s = Math.sqrt(1 + m11 - m00 - m22);
      y = 0.5 * s;
      s = 0.5 / s;
      x = (m10 + m01) * s;
      z = (m21 + m12) * s;
      w = (m20 - m02) * s;
    } else {
      s = Math.sqrt(1 + m22 - m00 - m11);
      z = 0.5 * s;
      s = 0.5 / s;
      x = (m20 + m02) * s;
      y = (m21 + m12) * s;
      w = (m01 - m10) * s;
    }
    this[0] = x;
    this[1] = y;
    this[2] = z;
    this[3] = w;
    return this;
  }
  fromNBlend(a, b, t) {
    const a_x = a[0];
    const a_y = a[1];
    const a_z = a[2];
    const a_w = a[3];
    const b_x = b[0];
    const b_y = b[1];
    const b_z = b[2];
    const b_w = b[3];
    const dot = a_x * b_x + a_y * b_y + a_z * b_z + a_w * b_w;
    const ti = 1 - t;
    const s = dot < 0 ? -1 : 1;
    this[0] = ti * a_x + t * b_x * s;
    this[1] = ti * a_y + t * b_y * s;
    this[2] = ti * a_z + t * b_z * s;
    this[3] = ti * a_w + t * b_w * s;
    return this.norm();
  }
  /** Used to get data from a flat buffer */
  fromBuf(ary, idx) {
    this[0] = ary[idx];
    this[1] = ary[idx + 1];
    this[2] = ary[idx + 2];
    this[3] = ary[idx + 3];
    return this;
  }
  /** Put data into a flat buffer */
  toBuf(ary, idx) {
    ary[idx] = this[0];
    ary[idx + 1] = this[1];
    ary[idx + 2] = this[2];
    ary[idx + 3] = this[3];
    return this;
  }
  // /** Create a rotation from eye & target position */
  // lookAt(
  //   out: TVec4,
  //   eye: TVec3, // Position of camera or object
  //   target: TVec3 = [0, 0, 0], // Position to look at
  //   up: TVec3 = [0, 1, 0], // Up direction for orientation
  // ): TVec4 {
  //   // Forward is inverted, will face correct direction when converted
  //   // to a ViewMatrix as it'll invert the Forward direction anyway
  //   const z: TVec3 = vec3.sub([0, 0, 0], eye, target);
  //   const x: TVec3 = vec3.cross([0, 0, 0], up, z);
  //   const y: TVec3 = vec3.cross([0, 0, 0], z, x);
  //   vec3.normalize(x, x);
  //   vec3.normalize(y, y);
  //   vec3.normalize(z, z);
  //   // Format: column-major, when typed out it looks like row-major
  //   quat.fromMat3(out, [...x, ...y, ...z]);
  //   return quat.normalize(out, out);
  // }
  // #endregion
  // #region OPERATORS
  /** Multiple Quaternion onto this Quaternion */
  mul(q) {
    const ax = this[0], ay = this[1], az = this[2], aw = this[3], bx = q[0], by = q[1], bz = q[2], bw = q[3];
    this[0] = ax * bw + aw * bx + ay * bz - az * by;
    this[1] = ay * bw + aw * by + az * bx - ax * bz;
    this[2] = az * bw + aw * bz + ax * by - ay * bx;
    this[3] = aw * bw - ax * bx - ay * by - az * bz;
    return this;
  }
  /** PreMultiple Quaternions onto this Quaternion */
  pmul(q) {
    const ax = q[0], ay = q[1], az = q[2], aw = q[3], bx = this[0], by = this[1], bz = this[2], bw = this[3];
    this[0] = ax * bw + aw * bx + ay * bz - az * by;
    this[1] = ay * bw + aw * by + az * bx - ax * bz;
    this[2] = az * bw + aw * bz + ax * by - ay * bx;
    this[3] = aw * bw - ax * bx - ay * by - az * bz;
    return this;
  }
  norm() {
    let len = this[0] ** 2 + this[1] ** 2 + this[2] ** 2 + this[3] ** 2;
    if (len > 0) {
      len = 1 / Math.sqrt(len);
      this[0] *= len;
      this[1] *= len;
      this[2] *= len;
      this[3] *= len;
    }
    return this;
  }
  invert() {
    const a0 = this[0], a1 = this[1], a2 = this[2], a3 = this[3], dot = a0 * a0 + a1 * a1 + a2 * a2 + a3 * a3;
    if (dot == 0) {
      this[0] = this[1] = this[2] = this[3] = 0;
      return this;
    }
    const invDot = 1 / dot;
    this[0] = -a0 * invDot;
    this[1] = -a1 * invDot;
    this[2] = -a2 * invDot;
    this[3] = a3 * invDot;
    return this;
  }
  negate() {
    this[0] = -this[0];
    this[1] = -this[1];
    this[2] = -this[2];
    this[3] = -this[3];
    return this;
  }
  // #endregion
  // #region ROTATIONS
  rotX(rad) {
    rad *= 0.5;
    const ax = this[0], ay = this[1], az = this[2], aw = this[3], bx = Math.sin(rad), bw = Math.cos(rad);
    this[0] = ax * bw + aw * bx;
    this[1] = ay * bw + az * bx;
    this[2] = az * bw - ay * bx;
    this[3] = aw * bw - ax * bx;
    return this;
  }
  rotY(rad) {
    rad *= 0.5;
    const ax = this[0], ay = this[1], az = this[2], aw = this[3], by = Math.sin(rad), bw = Math.cos(rad);
    this[0] = ax * bw - az * by;
    this[1] = ay * bw + aw * by;
    this[2] = az * bw + ax * by;
    this[3] = aw * bw - ay * by;
    return this;
  }
  rotZ(rad) {
    rad *= 0.5;
    const ax = this[0], ay = this[1], az = this[2], aw = this[3], bz = Math.sin(rad), bw = Math.cos(rad);
    this[0] = ax * bw + ay * bz;
    this[1] = ay * bw - ax * bz;
    this[2] = az * bw + aw * bz;
    this[3] = aw * bw - az * bz;
    return this;
  }
  rotDeg(deg, axis = 0) {
    const rad = deg * Math.PI / 180;
    switch (axis) {
      case 0:
        this.rotX(rad);
        break;
      case 1:
        this.rotY(rad);
        break;
      case 2:
        this.rotZ(rad);
        break;
    }
    return this;
  }
  // #endregion
  // #region SPECIAL OPERATORS
  /** Inverts the quaternion passed in, then pre multiplies to this quaternion. */
  pmulInvert(q) {
    let ax = q[0], ay = q[1], az = q[2], aw = q[3];
    const dot = ax * ax + ay * ay + az * az + aw * aw;
    if (dot === 0) {
      ax = ay = az = aw = 0;
    } else {
      const dot_inv = 1 / dot;
      ax = -ax * dot_inv;
      ay = -ay * dot_inv;
      az = -az * dot_inv;
      aw = aw * dot_inv;
    }
    const bx = this[0], by = this[1], bz = this[2], bw = this[3];
    this[0] = ax * bw + aw * bx + ay * bz - az * by;
    this[1] = ay * bw + aw * by + az * bx - ax * bz;
    this[2] = az * bw + aw * bz + ax * by - ay * bx;
    this[3] = aw * bw - ax * bx - ay * by - az * bz;
    return this;
  }
  pmulAxisAngle(axis, rad) {
    const half = rad * 0.5;
    const s = Math.sin(half);
    const ax = axis[0] * s;
    const ay = axis[1] * s;
    const az = axis[2] * s;
    const aw = Math.cos(half);
    const bx = this[0], by = this[1], bz = this[2], bw = this[3];
    this[0] = ax * bw + aw * bx + ay * bz - az * by;
    this[1] = ay * bw + aw * by + az * bx - ax * bz;
    this[2] = az * bw + aw * bz + ax * by - ay * bx;
    this[3] = aw * bw - ax * bx - ay * by - az * bz;
    return this;
  }
  dotNegate(q, chk) {
    if (Quat.dot(q, chk) < 0)
      this.fromNegate(q);
    else
      this.copy(q);
    return this;
  }
  // #endregion
  // #region STATIC
  static dot(a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
  }
  static lenSqr(a, b) {
    return (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2 + (a[3] - b[3]) ** 2;
  }
  static nblend(a, b, t, out) {
    const a_x = a[0];
    const a_y = a[1];
    const a_z = a[2];
    const a_w = a[3];
    const b_x = b[0];
    const b_y = b[1];
    const b_z = b[2];
    const b_w = b[3];
    const dot = a_x * b_x + a_y * b_y + a_z * b_z + a_w * b_w;
    const ti = 1 - t;
    const s = dot < 0 ? -1 : 1;
    out[0] = ti * a_x + t * b_x * s;
    out[1] = ti * a_y + t * b_y * s;
    out[2] = ti * a_z + t * b_z * s;
    out[3] = ti * a_w + t * b_w * s;
    return out.norm();
  }
  static slerp(a, b, t, out) {
    const ax = a[0], ay = a[1], az = a[2], aw = a[3];
    let bx = b[0], by = b[1], bz = b[2], bw = b[3];
    let omega, cosom, sinom, scale0, scale1;
    cosom = ax * bx + ay * by + az * bz + aw * bw;
    if (cosom < 0) {
      cosom = -cosom;
      bx = -bx;
      by = -by;
      bz = -bz;
      bw = -bw;
    }
    if (1 - cosom > 1e-6) {
      omega = Math.acos(cosom);
      sinom = Math.sin(omega);
      scale0 = Math.sin((1 - t) * omega) / sinom;
      scale1 = Math.sin(t * omega) / sinom;
    } else {
      scale0 = 1 - t;
      scale1 = t;
    }
    out[0] = scale0 * ax + scale1 * bx;
    out[1] = scale0 * ay + scale1 * by;
    out[2] = scale0 * az + scale1 * bz;
    out[3] = scale0 * aw + scale1 * bw;
    return out;
  }
  static shortest(from, to, out) {
    const ax = from[0], ay = from[1], az = from[2], aw = from[3];
    let bx = to[0], by = to[1], bz = to[2], bw = to[3];
    const dot = ax * bx + ay * by + az * bz + aw * bw;
    if (dot < 0) {
      bx = -bx;
      by = -by;
      bz = -bz;
      bw = -bw;
    }
    const d = bx * bx + by * by + bz * bz + bw * bw;
    if (d === 0) {
      bx = 0;
      by = 0;
      bz = 0;
      bw = 0;
    } else {
      const di = 1 / d;
      bx = -bx * di;
      by = -by * di;
      bz = -bz * di;
      bw = bw * di;
    }
    out[0] = ax * bw + aw * bx + ay * bz - az * by;
    out[1] = ay * bw + aw * by + az * bx - ax * bz;
    out[2] = az * bw + aw * bz + ax * by - ay * bx;
    out[3] = aw * bw - ax * bx - ay * by - az * bz;
    return out;
  }
  static swing(a, b) {
    return new Quat().fromSwing(a, b);
  }
  static axisAngle(axis, rad) {
    return new Quat().fromAxisAngle(axis, rad);
  }
  // // https://pastebin.com/66qSCKcZ
  // // https://forum.unity.com/threads/manually-calculate-angular-velocity-of-gameobject.289462/#post-4302796
  // static angularVelocity( foreLastFrameRotation: ConstQuat, lastFrameRotation: ConstQuat): TVec3{
  //     var q = lastFrameRotation * Quaternion.Inverse(foreLastFrameRotation);
  //     // no rotation?
  //     // You may want to increase this closer to 1 if you want to handle very small rotations.
  //     // Beware, if it is too close to one your answer will be Nan
  //     if ( Mathf.Abs(q.w) > 1023.5f / 1024.0f ) return [0,0,0]; Vector3.zero;
  //     float gain;
  //     // handle negatives, we could just flip it but this is faster
  //     if( q.w < 0.0f ){
  //         var angle = Mathf.Acos(-q.w);
  //         gain = -2.0f * angle / (Mathf.Sin(angle) * Time.deltaTime);
  //     }else{
  //         var angle = Mathf.Acos(q.w);
  //         gain = 2.0f * angle / (Mathf.Sin(angle) * Time.deltaTime);
  //     }
  //     Vector3 angularVelocity = new Vector3(q.x * gain, q.y * gain, q.z * gain);
  //     if(float.IsNaN(angularVelocity.z)) angularVelocity = Vector3.zero;
  //     return angularVelocity;
  // }
  // #endregion
}

class Transform {
  // #region MAIN
  rot = new Quat();
  pos = new Vec3(0);
  scl = new Vec3(1);
  constructor(rot, pos, scl) {
    if (rot instanceof Transform) {
      this.copy(rot);
    } else if (rot && pos && scl) {
      this.set(rot, pos, scl);
    }
  }
  // #endregion
  // #region SETTERS / GETTERS
  reset() {
    this.rot.identity();
    this.pos.xyz(0, 0, 0);
    this.scl.xyz(1, 1, 1);
    return this;
  }
  copy(t) {
    this.rot.copy(t.rot);
    this.pos.copy(t.pos);
    this.scl.copy(t.scl);
    return this;
  }
  set(r, p, s) {
    if (r)
      this.rot.copy(r);
    if (p)
      this.pos.copy(p);
    if (s)
      this.scl.copy(s);
    return this;
  }
  clone() {
    return new Transform(this);
  }
  mul(cr, cp, cs) {
    if (cr instanceof Transform) {
      cp = cr.pos;
      cs = cr.scl;
      cr = cr.rot;
    }
    if (cr && cp) {
      this.pos.add(new Vec3().fromMul(this.scl, cp).transformQuat(this.rot));
      if (cs)
        this.scl.mul(cs);
      this.rot.mul(cr);
    }
    return this;
  }
  pmul(pr, pp, ps) {
    if (pr instanceof Transform) {
      pp = pr.pos;
      ps = pr.scl;
      pr = pr.rot;
    }
    if (!pr || !pp || !ps)
      return this;
    this.pos.mul(ps).transformQuat(pr).add(pp);
    if (ps)
      this.scl.mul(ps);
    this.rot.pmul(pr);
    return this;
  }
  addPos(cp, ignoreScl = false) {
    if (ignoreScl)
      this.pos.add(new Vec3().fromQuat(this.rot, cp));
    else
      this.pos.add(new Vec3().fromMul(cp, this.scl).transformQuat(this.rot));
    return this;
  }
  // #endregion
  // #region FROM OPERATORS
  fromMul(tp, tc) {
    const v = new Vec3().fromMul(tp.scl, tc.pos).transformQuat(tp.rot);
    this.pos.fromAdd(tp.pos, v);
    this.scl.fromMul(tp.scl, tc.scl);
    this.rot.fromMul(tp.rot, tc.rot);
    return this;
  }
  fromInvert(t) {
    this.rot.fromInvert(t.rot);
    this.scl.fromInvert(t.scl);
    this.pos.fromNegate(t.pos).mul(this.scl).transformQuat(this.rot);
    return this;
  }
  // #endregion
  // #region TRANSFORMATION
  transformVec3(v, out) {
    return (out || v).fromMul(v, this.scl).transformQuat(this.rot).add(this.pos);
  }
  // #endregion
}

class Bone {
  // #region MAIN
  index = -1;
  // Array Index
  pindex = -1;
  // Array Index of Parent
  name = "";
  // Bone Name
  len = 0;
  // Length of Bone
  local = new Transform();
  // Local space transform
  world = new Transform();
  // World space transform
  constraint = null;
  constructor(props) {
    this.name = props?.name ? props.name : "bone" + Math.random();
    if (typeof props?.parent === "number")
      this.pindex = props.parent;
    if (props?.parent instanceof Bone)
      this.pindex = props.parent.index;
    if (props?.rot)
      this.local.rot.copy(props.rot);
    if (props?.pos)
      this.local.pos.copy(props.pos);
    if (props?.scl)
      this.local.scl.copy(props.scl);
    if (props?.len)
      this.len = props.len;
  }
  // #endregion
  // #region METHODS
  clone() {
    const b = new Bone();
    b.name = this.name;
    b.index = this.index;
    b.pindex = this.pindex;
    b.len = this.len;
    b.constraint = this.constraint;
    b.local.copy(this.local);
    b.world.copy(this.world);
    return b;
  }
  // #endregion
}

let Pose$1 = class Pose {
  // #region MAIN
  arm;
  offset = new Transform();
  // Additional offset transformation to apply to pose root
  linkedBone = void 0;
  // This skeleton extends another skeleton
  bones = new Array();
  // Bone transformation heirarchy
  constructor(arm) {
    if (arm)
      this.arm = arm;
    if (arm?.poses?.bind) {
      for (let i = 0; i < arm.poses.bind.bones.length; i++) {
        this.bones.push(arm.poses.bind.bones[i].clone());
      }
      this.offset.copy(arm.poses.bind.offset);
    }
  }
  // #endregion
  // #region GETTERS
  getBone(o) {
    switch (typeof o) {
      case "string": {
        const idx = this.arm.names.get(o);
        return idx !== void 0 ? this.bones[idx] : null;
      }
      case "number":
        return this.bones[o];
    }
    return null;
  }
  getBones(ary) {
    const rtn = [];
    let b;
    for (const i of ary) {
      if (b = this.getBone(i))
        rtn.push(b);
    }
    return rtn;
  }
  clone() {
    const p = new Pose();
    p.arm = this.arm;
    p.offset.copy(this.offset);
    for (const b of this.bones)
      p.bones.push(b.clone());
    return p;
  }
  getWorldTailPos(o, out = new Vec3()) {
    const b = this.getBone(o);
    if (b)
      b.world.transformVec3(out.xyz(0, b.len, 0));
    return out;
  }
  // #endregion
  // #region SETTERS
  setLocalPos(boneId, v) {
    const bone = this.getBone(boneId);
    if (bone)
      bone.local.pos.copy(v);
    return this;
  }
  setLocalRot(boneId, v) {
    const bone = this.getBone(boneId);
    if (bone)
      bone.local.rot.copy(v);
    return this;
  }
  copy(pose) {
    const bLen = this.bones.length;
    for (let i = 0; i < bLen; i++) {
      this.bones[i].local.copy(pose.bones[i].local);
      this.bones[i].world.copy(pose.bones[i].world);
    }
    return this;
  }
  // #endregion
  // #region COMPUTE
  updateWorld() {
    for (const b of this.bones) {
      if (b.pindex !== -1) {
        b.world.fromMul(this.bones[b.pindex].world, b.local);
      } else {
        b.world.fromMul(this.offset, b.local);
        if (this.linkedBone) {
          b.world.pmul(this.linkedBone.world);
        }
      }
    }
    return this;
  }
  updateWorldChildren(pIdx, incParent = false) {
    const parents = [pIdx];
    let b;
    if (incParent) {
      b = this.bones[pIdx];
      b.world.fromMul(
        b.pindex !== -1 ? this.bones[b.pindex].world : this.offset,
        b.local
      );
    }
    for (let i = pIdx + 1; i < this.bones.length; i++) {
      b = this.bones[i];
      if (parents.indexOf(b.pindex) === -1)
        continue;
      b.world.fromMul(this.bones[b.pindex].world, b.local);
      parents.push(b.index);
    }
    return this;
  }
  // updateLocalRot(): this{
  //     let b;
  //     for( b of this.bones ){
  //         b.local.rot
  //             .copy( b.world.rot )
  //             .pmulInvert( 
  //                 ( b.pindex !== -1 )? 
  //                     this.bones[ b.pindex ].world.rot : 
  //                     this.offset.rot  
  //             );
  //     }
  //     return this;
  // }
  getWorldRotation(boneId, out = new Quat()) {
    let bone = this.getBone(boneId);
    if (!bone) {
      if (boneId === -1)
        out.copy(this.offset.rot);
      else
        console.error("Pose.getWorldRotation - bone not found", boneId);
      return out;
    }
    out.copy(bone.local.rot);
    while (bone.pindex !== -1) {
      bone = this.bones[bone.pindex];
      out.pmul(bone.local.rot);
    }
    out.pmul(this.offset.rot);
    if (this.linkedBone)
      out.pmul(this.linkedBone.world.rot);
    return out;
  }
  getWorldTransform(boneId, out = new Transform()) {
    let bone = this.getBone(boneId);
    if (!bone) {
      if (boneId === -1)
        out.copy(this.offset);
      else
        console.error("Pose.getWorldTransform - bone not found", boneId);
      return out;
    }
    out.copy(bone.local);
    while (bone.pindex !== -1) {
      bone = this.bones[bone.pindex];
      out.pmul(bone.local);
    }
    out.pmul(this.offset);
    if (this.linkedBone)
      out.pmul(this.linkedBone.world);
    return out;
  }
  getWorldPosition(boneId, out = new Vec3()) {
    return out.copy(this.getWorldTransform(boneId).pos);
  }
  // #endregion
  // #region OPERATIONS
  rotLocal(boneId, deg, axis = 0) {
    const bone = this.getBone(boneId);
    if (bone) {
      switch (axis) {
        case 1:
          bone.local.rot.rotY(deg * Math.PI / 180);
          break;
        case 2:
          bone.local.rot.rotZ(deg * Math.PI / 180);
          break;
        default:
          bone.local.rot.rotX(deg * Math.PI / 180);
          break;
      }
    } else
      console.warn("Bone not found, ", boneId);
    return this;
  }
  rotWorld(boneId, deg, axis = "x") {
    const bone = this.getBone(boneId);
    if (bone) {
      const pWRot = this.getWorldRotation(bone.pindex);
      const cWRot = new Quat(pWRot).mul(bone.local.rot);
      const ax = axis == "y" ? [0, 1, 0] : axis == "z" ? [0, 0, 1] : [1, 0, 0];
      cWRot.pmulAxisAngle(ax, deg * Math.PI / 180).pmulInvert(pWRot).copyTo(bone.local.rot);
    } else {
      console.error("Pose.rotWorld - bone not found", boneId);
    }
    return this;
  }
  moveLocal(boneId, offset) {
    const bone = this.getBone(boneId);
    if (bone)
      bone.local.pos.add(offset);
    else
      console.warn("Pose.moveLocal - bone not found, ", boneId);
    return this;
  }
  posLocal(boneId, pos) {
    const bone = this.getBone(boneId);
    if (bone)
      bone.local.pos.copy(pos);
    else
      console.warn("Pose.posLocal - bone not found, ", boneId);
    return this;
  }
  sclLocal(boneId, v) {
    const bone = this.getBone(boneId);
    if (bone) {
      if (v instanceof Array || v instanceof Float32Array)
        bone.local.scl.copy(v);
      else if (typeof v === "number")
        bone.local.scl.xyz(v, v, v);
    } else {
      console.warn("Pose.sclLocal - bone not found, ", boneId);
    }
    return this;
  }
  // #endregion
};

class Armature {
  // #region MAIN
  skin;
  names = /* @__PURE__ */ new Map();
  poses = {
    bind: new Pose$1(this)
  };
  // #endregion
  // #region GETTERS
  get bindPose() {
    return this.poses.bind;
  }
  get boneCount() {
    return this.poses.bind.bones.length;
  }
  newPose(saveAs) {
    const p = this.poses.bind.clone();
    if (saveAs)
      this.poses[saveAs] = p;
    return p;
  }
  // #endregion
  // #region METHODS
  addBone(obj) {
    const bones = this.poses.bind.bones;
    const idx = bones.length;
    if (obj instanceof Bone) {
      obj.index = idx;
      bones.push(obj);
      this.names.set(obj.name, idx);
      return obj;
    } else {
      const bone = new Bone(obj);
      bone.index = idx;
      bones.push(bone);
      this.names.set(bone.name, idx);
      if (typeof obj?.parent === "string") {
        const pIdx = this.names.get(obj?.parent);
        if (pIdx !== void 0)
          bone.pindex = pIdx;
        else
          console.error("Parent bone not found", obj.name);
      }
      return bone;
    }
  }
  getBone(o) {
    switch (typeof o) {
      case "string": {
        const idx = this.names.get(o);
        return idx !== void 0 ? this.poses.bind.bones[idx] : null;
      }
      case "number":
        return this.poses.bind.bones[o];
    }
    return null;
  }
  getBones(ary) {
    const rtn = [];
    let b;
    for (const i of ary) {
      if (b = this.getBone(i))
        rtn.push(b);
    }
    return rtn;
  }
  bind(boneLen = 0.2) {
    this.poses.bind.updateWorld();
    this.updateBoneLengths(this.poses.bind, boneLen);
    return this;
  }
  // Valid useage
  // const skin = arm.useSkin( new MatrixSkin( arm.bindPose ) );
  // const skin = arm.useSkin( MatrixSkin );
  useSkin(skin) {
    switch (typeof skin) {
      case "object":
        this.skin = skin;
        break;
      case "function":
        this.skin = new skin(this.poses.bind);
        break;
      default:
        console.error("Armature.useSkin, unknown typeof of skin ref", skin);
        break;
    }
    return this.skin;
  }
  // #endregion
  // #region #COMPUTE
  updateBoneLengths(pose, boneLen = 0) {
    const bEnd = pose.bones.length - 1;
    let b;
    let p;
    for (let i = bEnd; i >= 0; i--) {
      b = pose.bones[i];
      if (b.pindex !== -1) {
        p = pose.bones[b.pindex];
        p.len = Vec3.dist(p.world.pos, b.world.pos);
        if (p.len < 1e-4)
          p.len = 0;
      }
    }
    if (boneLen != 0) {
      for (b of pose.bones) {
        if (b.len == 0)
          b.len = boneLen;
      }
    }
    return this;
  }
  // #endregion
}

class BoneBindings {
  // #region MAIN
  onUpdate;
  items = /* @__PURE__ */ new Map();
  constructor(fn) {
    this.onUpdate = fn;
  }
  // #endregion
  // #region METHODS
  bind(bone, obj) {
    this.items.set(window.crypto.randomUUID(), {
      bone: new WeakRef(bone),
      obj: new WeakRef(obj)
    });
    return this;
  }
  removeBone(bone) {
    const trash = [];
    let b;
    let k;
    let v;
    for ([k, v] of this.items) {
      b = v.bone.deref();
      if (!b || b === bone)
        trash.push(k);
    }
    if (trash.length > 0) {
      for (k of trash)
        this.items.delete(k);
    }
    return this;
  }
  updateAll() {
    const trash = [];
    let b;
    let o;
    let k;
    let v;
    for ([k, v] of this.items) {
      b = v.bone.deref();
      o = v.obj.deref();
      if (b && o)
        this.onUpdate(b, o);
      else
        trash.push(k);
    }
    if (trash.length > 0) {
      for (k of trash)
        this.items.delete(k);
    }
    return this;
  }
  // #endregion
}

class SocketItem {
  local = new Transform();
  obj;
  constructor(obj, pos, rot, scl) {
    this.obj = obj;
    if (pos)
      this.local.pos.copy(pos);
    if (rot)
      this.local.rot.copy(rot);
    if (scl)
      this.local.scl.copy(scl);
  }
}
class Socket {
  boneIndex = -1;
  local = new Transform();
  items = [];
  constructor(bi, pos, rot) {
    this.boneIndex = bi;
    if (pos)
      this.local.pos.copy(pos);
    if (rot)
      this.local.rot.copy(rot);
  }
}
class BoneSockets {
  sockets = /* @__PURE__ */ new Map();
  transformHandler;
  constructor(tHandler) {
    if (tHandler)
      this.transformHandler = tHandler;
  }
  add(name, bone, pos, rot) {
    this.sockets.set(name, new Socket(bone.index, pos, rot));
    return this;
  }
  attach(socketName, obj, pos, rot, scl) {
    const s = this.sockets.get(socketName);
    if (s)
      s.items.push(new SocketItem(obj, pos, rot, scl));
    else
      console.error("Socket.attach: Socket name not found:", socketName);
    return this;
  }
  updateFromPose(pose) {
    if (!this.transformHandler)
      return;
    const st = new Transform();
    const t = new Transform();
    let b;
    for (const s of this.sockets.values()) {
      b = pose.bones[s.boneIndex];
      st.fromMul(b.world, s.local);
      for (const i of s.items) {
        t.fromMul(st, i.local);
        try {
          this.transformHandler(t, i.obj);
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err);
          console.error("Error updating bone socket item: ", msg);
        }
      }
    }
  }
  debugAll(pose, debug) {
    const t = new Transform();
    let b;
    for (const s of this.sockets.values()) {
      b = pose.bones[s.boneIndex];
      t.fromMul(b.world, s.local);
      debug.pnt.add(t.pos, 16777215, 4, 2);
    }
  }
}

class BoneMap {
  bones = /* @__PURE__ */ new Map();
  obj;
  constructor(obj) {
    if (obj)
      this.from(obj);
  }
  from(obj) {
    this.obj = obj;
    const bAry = obj instanceof Armature ? obj.bindPose.bones : obj.bones;
    let bp;
    let bi;
    let key;
    for (const b of bAry) {
      for (bp of Parsers) {
        if (!(key = bp.test(b.name)))
          continue;
        bi = this.bones.get(key);
        if (!bi)
          this.bones.set(key, new BoneInfo(b));
        else if (bi && bp.isChain)
          bi.push(b);
        break;
      }
    }
  }
  getBoneMap(name) {
    return this.bones.get(name);
  }
  getBoneIndex(name) {
    const bi = this.bones.get(name);
    return bi ? bi.items[0].index : -1;
  }
  getBones(aryNames) {
    const bAry = this.obj instanceof Armature ? this.obj.bindPose.bones : this.obj.bones;
    const rtn = [];
    let bi;
    let i;
    for (const name of aryNames) {
      bi = this.bones.get(name);
      if (bi) {
        for (i of bi.items)
          rtn.push(bAry[i.index]);
      } else {
        console.warn("Bonemap.getBones - Bone not found", name);
      }
    }
    return rtn.length >= aryNames.length ? rtn : null;
  }
  getChestBone() {
    const bAry = this.obj instanceof Armature ? this.obj.bindPose.bones : this.obj.bones;
    const rtn = [];
    const bi = this.bones.get("spine");
    if (bi) {
      rtn.push(bAry[bi.lastIndex]);
    }
    return rtn.length > 0 ? rtn : null;
  }
}
class BoneInfo {
  items = [];
  constructor(b) {
    if (b)
      this.push(b);
  }
  push(bone) {
    this.items.push({ index: bone.index, name: bone.name });
    return this;
  }
  get isChain() {
    return this.items.length > 1;
  }
  get count() {
    return this.items.length;
  }
  get index() {
    return this.items[0].index;
  }
  get lastIndex() {
    return this.items[this.items.length - 1].index;
  }
}
class BoneParse {
  name;
  isLR;
  isChain;
  reFind;
  reExclude;
  constructor(name, isLR, reFind, reExclude, isChain = false) {
    this.name = name;
    this.isLR = isLR;
    this.isChain = isChain;
    this.reFind = new RegExp(reFind, "i");
    if (reExclude)
      this.reExclude = new RegExp(reExclude, "i");
  }
  test(bname) {
    if (!this.reFind.test(bname))
      return null;
    if (this.reExclude && this.reExclude.test(bname))
      return null;
    if (this.isLR && reLeft.test(bname))
      return this.name + "_l";
    if (this.isLR && reRight.test(bname))
      return this.name + "_r";
    return this.name;
  }
}
const reLeft = new RegExp("\\.l|left|_l", "i");
const reRight = new RegExp("\\.r|right|_r", "i");
const Parsers = [
  new BoneParse("thigh", true, "thigh|up.*leg", "twist"),
  //upleg | upperleg
  new BoneParse("shin", true, "shin|leg|calf", "up|twist"),
  new BoneParse("foot", true, "foot"),
  new BoneParse("toe", true, "toe"),
  new BoneParse("shoulder", true, "clavicle|shoulder"),
  new BoneParse("upperarm", true, "(upper.*arm|arm)", "fore|twist|lower"),
  new BoneParse("forearm", true, "forearm|arm", "up|twist"),
  new BoneParse("hand", true, "hand", "thumb|index|middle|ring|pinky"),
  new BoneParse("head", false, "head"),
  new BoneParse("neck", false, "neck"),
  new BoneParse("hip", false, "hips*|pelvis"),
  new BoneParse("root", false, "root"),
  // eslint-disable-next-line no-useless-escape
  new BoneParse("spine", false, "spine.*d*|chest", void 0, true)
];

class Mat4 extends Array {
  // #region STATIC VALUES
  static BYTESIZE = 16 * 4;
  // #endregion
  // #region CONSTRUCTOR
  constructor() {
    super(16);
    this[0] = 1;
    this[1] = 0;
    this[2] = 0;
    this[3] = 0;
    this[4] = 0;
    this[5] = 1;
    this[6] = 0;
    this[7] = 0;
    this[8] = 0;
    this[9] = 0;
    this[10] = 1;
    this[11] = 0;
    this[12] = 0;
    this[13] = 0;
    this[14] = 0;
    this[15] = 1;
  }
  // #endregion
  // #region GETTERS / SETTERS
  identity() {
    this[0] = 1;
    this[1] = 0;
    this[2] = 0;
    this[3] = 0;
    this[4] = 0;
    this[5] = 1;
    this[6] = 0;
    this[7] = 0;
    this[8] = 0;
    this[9] = 0;
    this[10] = 1;
    this[11] = 0;
    this[12] = 0;
    this[13] = 0;
    this[14] = 0;
    this[15] = 1;
    return this;
  }
  clearTranslation() {
    this[12] = this[13] = this[14] = 0;
    this[15] = 1;
    return this;
  }
  // copy another matrix's data to this one.
  copy(mat, offset = 0) {
    let i;
    for (i = 0; i < 16; i++)
      this[i] = mat[offset + i];
    return this;
  }
  copyTo(out) {
    let i;
    for (i = 0; i < 16; i++)
      out[i] = this[i];
    return this;
  }
  determinant() {
    const a00 = this[0], a01 = this[1], a02 = this[2], a03 = this[3], a10 = this[4], a11 = this[5], a12 = this[6], a13 = this[7], a20 = this[8], a21 = this[9], a22 = this[10], a23 = this[11], a30 = this[12], a31 = this[13], a32 = this[14], a33 = this[15], b0 = a00 * a11 - a01 * a10, b1 = a00 * a12 - a02 * a10, b2 = a01 * a12 - a02 * a11, b3 = a20 * a31 - a21 * a30, b4 = a20 * a32 - a22 * a30, b5 = a21 * a32 - a22 * a31, b6 = a00 * b5 - a01 * b4 + a02 * b3, b7 = a10 * b5 - a11 * b4 + a12 * b3, b8 = a20 * b2 - a21 * b1 + a22 * b0, b9 = a30 * b2 - a31 * b1 + a32 * b0;
    return a13 * b6 - a03 * b7 + a33 * b8 - a23 * b9;
  }
  /** Frobenius norm of a Matrix */
  frob() {
    return Math.hypot(
      this[0],
      this[1],
      this[2],
      this[3],
      this[4],
      this[5],
      this[6],
      this[7],
      this[8],
      this[9],
      this[10],
      this[11],
      this[12],
      this[13],
      this[14],
      this[15]
    );
  }
  //----------------------------------------------------
  getTranslation(out) {
    out = out || [0, 0, 0];
    out[0] = this[12];
    out[1] = this[13];
    out[2] = this[14];
    return out;
  }
  getScale(out) {
    const m11 = this[0], m12 = this[1], m13 = this[2], m21 = this[4], m22 = this[5], m23 = this[6], m31 = this[8], m32 = this[9], m33 = this[10];
    out = out || [0, 0, 0];
    out[0] = Math.sqrt(m11 * m11 + m12 * m12 + m13 * m13);
    out[1] = Math.sqrt(m21 * m21 + m22 * m22 + m23 * m23);
    out[2] = Math.sqrt(m31 * m31 + m32 * m32 + m33 * m33);
    return out;
  }
  getRotation(out) {
    const trace = this[0] + this[5] + this[10];
    let S = 0;
    out = out || [0, 0, 0, 1];
    if (trace > 0) {
      S = Math.sqrt(trace + 1) * 2;
      out[3] = 0.25 * S;
      out[0] = (this[6] - this[9]) / S;
      out[1] = (this[8] - this[2]) / S;
      out[2] = (this[1] - this[4]) / S;
    } else if (this[0] > this[5] && this[0] > this[10]) {
      S = Math.sqrt(1 + this[0] - this[5] - this[10]) * 2;
      out[3] = (this[6] - this[9]) / S;
      out[0] = 0.25 * S;
      out[1] = (this[1] + this[4]) / S;
      out[2] = (this[8] + this[2]) / S;
    } else if (this[5] > this[10]) {
      S = Math.sqrt(1 + this[5] - this[0] - this[10]) * 2;
      out[3] = (this[8] - this[2]) / S;
      out[0] = (this[1] + this[4]) / S;
      out[1] = 0.25 * S;
      out[2] = (this[6] + this[9]) / S;
    } else {
      S = Math.sqrt(1 + this[10] - this[0] - this[5]) * 2;
      out[3] = (this[1] - this[4]) / S;
      out[0] = (this[8] + this[2]) / S;
      out[1] = (this[6] + this[9]) / S;
      out[2] = 0.25 * S;
    }
    return out;
  }
  //----------------------------------------------------
  fromPerspective(fovy, aspect, near, far) {
    const f = 1 / Math.tan(fovy * 0.5), nf = 1 / (near - far);
    this[0] = f / aspect;
    this[1] = 0;
    this[2] = 0;
    this[3] = 0;
    this[4] = 0;
    this[5] = f;
    this[6] = 0;
    this[7] = 0;
    this[8] = 0;
    this[9] = 0;
    this[10] = (far + near) * nf;
    this[11] = -1;
    this[12] = 0;
    this[13] = 0;
    this[14] = 2 * far * near * nf;
    this[15] = 0;
    return this;
  }
  /*
      Generates a perspective projection matrix with the given bounds.
      * The near/far clip planes correspond to a normalized device coordinate Z range of [-1, 1],
      export function perspectiveNO(out, fovy, aspect, near, far) {
      const f = 1.0 / Math.tan(fovy / 2);
      out[0] = f / aspect;
      out[1] = 0;
      out[2] = 0;
      out[3] = 0;
      out[4] = 0;
      out[5] = f;
      out[6] = 0;
      out[7] = 0;
      out[8] = 0;
      out[9] = 0;
      out[11] = -1;
      out[12] = 0;
      out[13] = 0;
      out[15] = 0;
      if (far != null && far !== Infinity) {
          const nf = 1 / (near - far);
          out[10] = (far + near) * nf;
          out[14] = 2 * far * near * nf;
      } else {
          out[10] = -1;
          out[14] = -2 * near;
      }
      return out;
      }
  
      Generates a perspective projection matrix suitable for WebGPU with the given bounds.
      The near/far clip planes correspond to a normalized device coordinate Z range of [0, 1],
      export function perspectiveZO(out, fovy, aspect, near, far) {
          const f = 1.0 / Math.tan(fovy / 2);
          out[0] = f / aspect;
          out[1] = 0;
          out[2] = 0;
          out[3] = 0;
          out[4] = 0;
          out[5] = f;
          out[6] = 0;
          out[7] = 0;
          out[8] = 0;
          out[9] = 0;
          out[11] = -1;
          out[12] = 0;
          out[13] = 0;
          out[15] = 0;
          if (far != null && far !== Infinity) {
            const nf = 1 / (near - far);
            out[10] = far * nf;
            out[14] = far * near * nf;
          } else {
            out[10] = -1;
            out[14] = -near;
          }
          return out;
        }
  
       * Generates a perspective projection matrix with the given field of view.
      * This is primarily useful for generating projection matrices to be used
      * with the still experiemental WebVR API.
      export function perspectiveFromFieldOfView(out, fov, near, far) {
          let upTan = Math.tan((fov.upDegrees * Math.PI) / 180.0);
          let downTan = Math.tan((fov.downDegrees * Math.PI) / 180.0);
          let leftTan = Math.tan((fov.leftDegrees * Math.PI) / 180.0);
          let rightTan = Math.tan((fov.rightDegrees * Math.PI) / 180.0);
          let xScale = 2.0 / (leftTan + rightTan);
          let yScale = 2.0 / (upTan + downTan);
      
          out[0] = xScale;
          out[1] = 0.0;
          out[2] = 0.0;
          out[3] = 0.0;
          out[4] = 0.0;
          out[5] = yScale;
          out[6] = 0.0;
          out[7] = 0.0;
          out[8] = -((leftTan - rightTan) * xScale * 0.5);
          out[9] = (upTan - downTan) * yScale * 0.5;
          out[10] = far / (near - far);
          out[11] = -1.0;
          out[12] = 0.0;
          out[13] = 0.0;
          out[14] = (far * near) / (near - far);
          out[15] = 0.0;
          return out;
      }
  
      */
  fromOrtho(left, right, bottom, top, near, far) {
    const lr = 1 / (left - right), bt = 1 / (bottom - top), nf = 1 / (near - far);
    this[0] = -2 * lr;
    this[1] = 0;
    this[2] = 0;
    this[3] = 0;
    this[4] = 0;
    this[5] = -2 * bt;
    this[6] = 0;
    this[7] = 0;
    this[8] = 0;
    this[9] = 0;
    this[10] = 2 * nf;
    this[11] = 0;
    this[12] = (left + right) * lr;
    this[13] = (top + bottom) * bt;
    this[14] = (far + near) * nf;
    this[15] = 1;
    return this;
  }
  /*
      * Generates a orthogonal projection matrix with the given bounds.
      * The near/far clip planes correspond to a normalized device coordinate Z range of [-1, 1],
      * which matches WebGL/OpenGL's clip volume.
     export function orthoNO(out, left, right, bottom, top, near, far) {
       const lr = 1 / (left - right);
       const bt = 1 / (bottom - top);
       const nf = 1 / (near - far);
       out[0] = -2 * lr;
       out[1] = 0;
       out[2] = 0;
       out[3] = 0;
       out[4] = 0;
       out[5] = -2 * bt;
       out[6] = 0;
       out[7] = 0;
       out[8] = 0;
       out[9] = 0;
       out[10] = 2 * nf;
       out[11] = 0;
       out[12] = (left + right) * lr;
       out[13] = (top + bottom) * bt;
       out[14] = (far + near) * nf;
       out[15] = 1;
       return out;
     }
  
      * Generates a orthogonal projection matrix with the given bounds.
      * The near/far clip planes correspond to a normalized device coordinate Z range of [0, 1],
      * which matches WebGPU/Vulkan/DirectX/Metal's clip volume.
      export function orthoZO(out, left, right, bottom, top, near, far) {
      const lr = 1 / (left - right);
      const bt = 1 / (bottom - top);
      const nf = 1 / (near - far);
      out[0] = -2 * lr;
      out[1] = 0;
      out[2] = 0;
      out[3] = 0;
      out[4] = 0;
      out[5] = -2 * bt;
      out[6] = 0;
      out[7] = 0;
      out[8] = 0;
      out[9] = 0;
      out[10] = nf;
      out[11] = 0;
      out[12] = (left + right) * lr;
      out[13] = (top + bottom) * bt;
      out[14] = near * nf;
      out[15] = 1;
      return out;
      }
  
      */
  fromMul(a, b) {
    const a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3], a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7], a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11], a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
    let b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
    this[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    this[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    this[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    this[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    b0 = b[4];
    b1 = b[5];
    b2 = b[6];
    b3 = b[7];
    this[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    this[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    this[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    this[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    b0 = b[8];
    b1 = b[9];
    b2 = b[10];
    b3 = b[11];
    this[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    this[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    this[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    this[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    b0 = b[12];
    b1 = b[13];
    b2 = b[14];
    b3 = b[15];
    this[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    this[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    this[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    this[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    return this;
  }
  fromInvert(mat) {
    const a00 = mat[0], a01 = mat[1], a02 = mat[2], a03 = mat[3], a10 = mat[4], a11 = mat[5], a12 = mat[6], a13 = mat[7], a20 = mat[8], a21 = mat[9], a22 = mat[10], a23 = mat[11], a30 = mat[12], a31 = mat[13], a32 = mat[14], a33 = mat[15], b00 = a00 * a11 - a01 * a10, b01 = a00 * a12 - a02 * a10, b02 = a00 * a13 - a03 * a10, b03 = a01 * a12 - a02 * a11, b04 = a01 * a13 - a03 * a11, b05 = a02 * a13 - a03 * a12, b06 = a20 * a31 - a21 * a30, b07 = a20 * a32 - a22 * a30, b08 = a20 * a33 - a23 * a30, b09 = a21 * a32 - a22 * a31, b10 = a21 * a33 - a23 * a31, b11 = a22 * a33 - a23 * a32;
    let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
    if (!det)
      return this;
    det = 1 / det;
    this[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
    this[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
    this[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
    this[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
    this[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
    this[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
    this[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
    this[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
    this[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
    this[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
    this[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
    this[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
    this[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
    this[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
    this[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
    this[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;
    return this;
  }
  fromAdjugate(a) {
    const a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3], a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7], a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11], a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15], b00 = a00 * a11 - a01 * a10, b01 = a00 * a12 - a02 * a10, b02 = a00 * a13 - a03 * a10, b03 = a01 * a12 - a02 * a11, b04 = a01 * a13 - a03 * a11, b05 = a02 * a13 - a03 * a12, b06 = a20 * a31 - a21 * a30, b07 = a20 * a32 - a22 * a30, b08 = a20 * a33 - a23 * a30, b09 = a21 * a32 - a22 * a31, b10 = a21 * a33 - a23 * a31, b11 = a22 * a33 - a23 * a32;
    this[0] = a11 * b11 - a12 * b10 + a13 * b09;
    this[1] = a02 * b10 - a01 * b11 - a03 * b09;
    this[2] = a31 * b05 - a32 * b04 + a33 * b03;
    this[3] = a22 * b04 - a21 * b05 - a23 * b03;
    this[4] = a12 * b08 - a10 * b11 - a13 * b07;
    this[5] = a00 * b11 - a02 * b08 + a03 * b07;
    this[6] = a32 * b02 - a30 * b05 - a33 * b01;
    this[7] = a20 * b05 - a22 * b02 + a23 * b01;
    this[8] = a10 * b10 - a11 * b08 + a13 * b06;
    this[9] = a01 * b08 - a00 * b10 - a03 * b06;
    this[10] = a30 * b04 - a31 * b02 + a33 * b00;
    this[11] = a21 * b02 - a20 * b04 - a23 * b00;
    this[12] = a11 * b07 - a10 * b09 - a12 * b06;
    this[13] = a00 * b09 - a01 * b07 + a02 * b06;
    this[14] = a31 * b01 - a30 * b03 - a32 * b00;
    this[15] = a20 * b03 - a21 * b01 + a22 * b00;
    return this;
  }
  fromFrustum(left, right, bottom, top, near, far) {
    const rl = 1 / (right - left);
    const tb = 1 / (top - bottom);
    const nf = 1 / (near - far);
    this[0] = near * 2 * rl;
    this[1] = 0;
    this[2] = 0;
    this[3] = 0;
    this[4] = 0;
    this[5] = near * 2 * tb;
    this[6] = 0;
    this[7] = 0;
    this[8] = (right + left) * rl;
    this[9] = (top + bottom) * tb;
    this[10] = (far + near) * nf;
    this[11] = -1;
    this[12] = 0;
    this[13] = 0;
    this[14] = far * near * 2 * nf;
    this[15] = 0;
    return this;
  }
  //----------------------------------------------------
  fromQuatTranScale(q, v, s) {
    const x = q[0], y = q[1], z = q[2], w = q[3], x2 = x + x, y2 = y + y, z2 = z + z, xx = x * x2, xy = x * y2, xz = x * z2, yy = y * y2, yz = y * z2, zz = z * z2, wx = w * x2, wy = w * y2, wz = w * z2, sx = s[0], sy = s[1], sz = s[2];
    this[0] = (1 - (yy + zz)) * sx;
    this[1] = (xy + wz) * sx;
    this[2] = (xz - wy) * sx;
    this[3] = 0;
    this[4] = (xy - wz) * sy;
    this[5] = (1 - (xx + zz)) * sy;
    this[6] = (yz + wx) * sy;
    this[7] = 0;
    this[8] = (xz + wy) * sz;
    this[9] = (yz - wx) * sz;
    this[10] = (1 - (xx + yy)) * sz;
    this[11] = 0;
    this[12] = v[0];
    this[13] = v[1];
    this[14] = v[2];
    this[15] = 1;
    return this;
  }
  fromQuatTran(q, v) {
    const x = q[0], y = q[1], z = q[2], w = q[3], x2 = x + x, y2 = y + y, z2 = z + z, xx = x * x2, xy = x * y2, xz = x * z2, yy = y * y2, yz = y * z2, zz = z * z2, wx = w * x2, wy = w * y2, wz = w * z2;
    this[0] = 1 - (yy + zz);
    this[1] = xy + wz;
    this[2] = xz - wy;
    this[3] = 0;
    this[4] = xy - wz;
    this[5] = 1 - (xx + zz);
    this[6] = yz + wx;
    this[7] = 0;
    this[8] = xz + wy;
    this[9] = yz - wx;
    this[10] = 1 - (xx + yy);
    this[11] = 0;
    this[12] = v[0];
    this[13] = v[1];
    this[14] = v[2];
    this[15] = 1;
    return this;
  }
  fromQuat(q) {
    const x = q[0], y = q[1], z = q[2], w = q[3], x2 = x + x, y2 = y + y, z2 = z + z, xx = x * x2, xy = x * y2, xz = x * z2, yy = y * y2, yz = y * z2, zz = z * z2, wx = w * x2, wy = w * y2, wz = w * z2;
    this[0] = 1 - (yy + zz);
    this[1] = xy + wz;
    this[2] = xz - wy;
    this[3] = 0;
    this[4] = xy - wz;
    this[5] = 1 - (xx + zz);
    this[6] = yz + wx;
    this[7] = 0;
    this[8] = xz + wy;
    this[9] = yz - wx;
    this[10] = 1 - (xx + yy);
    this[11] = 0;
    this[12] = 0;
    this[13] = 0;
    this[14] = 0;
    this[15] = 1;
    return this;
  }
  /** Creates a matrix from a quaternion rotation, vector translation and vector scale, rotating and scaling around the given origin */
  fromQuatTranScaleOrigin(q, v, s, o) {
    const x = q[0], y = q[1], z = q[2], w = q[3];
    const x2 = x + x;
    const y2 = y + y;
    const z2 = z + z;
    const xx = x * x2;
    const xy = x * y2;
    const xz = x * z2;
    const yy = y * y2;
    const yz = y * z2;
    const zz = z * z2;
    const wx = w * x2;
    const wy = w * y2;
    const wz = w * z2;
    const sx = s[0];
    const sy = s[1];
    const sz = s[2];
    const ox = o[0];
    const oy = o[1];
    const oz = o[2];
    const out0 = (1 - (yy + zz)) * sx;
    const out1 = (xy + wz) * sx;
    const out2 = (xz - wy) * sx;
    const out4 = (xy - wz) * sy;
    const out5 = (1 - (xx + zz)) * sy;
    const out6 = (yz + wx) * sy;
    const out8 = (xz + wy) * sz;
    const out9 = (yz - wx) * sz;
    const out10 = (1 - (xx + yy)) * sz;
    this[0] = out0;
    this[1] = out1;
    this[2] = out2;
    this[3] = 0;
    this[4] = out4;
    this[5] = out5;
    this[6] = out6;
    this[7] = 0;
    this[8] = out8;
    this[9] = out9;
    this[10] = out10;
    this[11] = 0;
    this[12] = v[0] + ox - (out0 * ox + out4 * oy + out8 * oz);
    this[13] = v[1] + oy - (out1 * ox + out5 * oy + out9 * oz);
    this[14] = v[2] + oz - (out2 * ox + out6 * oy + out10 * oz);
    this[15] = 1;
    return this;
  }
  fromDualQuat(a) {
    const bx = -a[0], by = -a[1], bz = -a[2], bw = a[3], ax = a[4], ay = a[5], az = a[6], aw = a[7];
    const translation = [0, 0, 0];
    let magnitude = bx * bx + by * by + bz * bz + bw * bw;
    if (magnitude > 0) {
      magnitude = 1 / magnitude;
      translation[0] = (ax * bw + aw * bx + ay * bz - az * by) * 2 * magnitude;
      translation[1] = (ay * bw + aw * by + az * bx - ax * bz) * 2 * magnitude;
      translation[2] = (az * bw + aw * bz + ax * by - ay * bx) * 2 * magnitude;
    } else {
      translation[0] = (ax * bw + aw * bx + ay * bz - az * by) * 2;
      translation[1] = (ay * bw + aw * by + az * bx - ax * bz) * 2;
      translation[2] = (az * bw + aw * bz + ax * by - ay * bx) * 2;
    }
    this.fromQuatTran(a, translation);
    return this;
  }
  //----------------------------------------------------
  /** This creates a View Matrix, not a World Matrix. Use fromTarget for a World Matrix */
  fromLook(eye, center, up) {
    let x0, x1, x2, y0, y1, y2, z0, z1, z2, len;
    const eyex = eye[0];
    const eyey = eye[1];
    const eyez = eye[2];
    const upx = up[0];
    const upy = up[1];
    const upz = up[2];
    const centerx = center[0];
    const centery = center[1];
    const centerz = center[2];
    if (Math.abs(eyex - centerx) < 1e-6 && Math.abs(eyey - centery) < 1e-6 && Math.abs(eyez - centerz) < 1e-6) {
      this.identity();
      return this;
    }
    z0 = eyex - centerx;
    z1 = eyey - centery;
    z2 = eyez - centerz;
    len = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
    z0 *= len;
    z1 *= len;
    z2 *= len;
    x0 = upy * z2 - upz * z1;
    x1 = upz * z0 - upx * z2;
    x2 = upx * z1 - upy * z0;
    len = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
    if (!len) {
      x0 = 0;
      x1 = 0;
      x2 = 0;
    } else {
      len = 1 / len;
      x0 *= len;
      x1 *= len;
      x2 *= len;
    }
    y0 = z1 * x2 - z2 * x1;
    y1 = z2 * x0 - z0 * x2;
    y2 = z0 * x1 - z1 * x0;
    len = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);
    if (!len) {
      y0 = 0;
      y1 = 0;
      y2 = 0;
    } else {
      len = 1 / len;
      y0 *= len;
      y1 *= len;
      y2 *= len;
    }
    this[0] = x0;
    this[1] = y0;
    this[2] = z0;
    this[3] = 0;
    this[4] = x1;
    this[5] = y1;
    this[6] = z1;
    this[7] = 0;
    this[8] = x2;
    this[9] = y2;
    this[10] = z2;
    this[11] = 0;
    this[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
    this[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
    this[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
    this[15] = 1;
    return this;
  }
  /** This creates a World Matrix, not a View Matrix. Use fromLook for a View Matrix */
  fromTarget(eye, target, up) {
    const eyex = eye[0], eyey = eye[1], eyez = eye[2], upx = up[0], upy = up[1], upz = up[2];
    let z0 = eyex - target[0], z1 = eyey - target[1], z2 = eyez - target[2], len = z0 * z0 + z1 * z1 + z2 * z2;
    if (len > 0) {
      len = 1 / Math.sqrt(len);
      z0 *= len;
      z1 *= len;
      z2 *= len;
    }
    let x0 = upy * z2 - upz * z1, x1 = upz * z0 - upx * z2, x2 = upx * z1 - upy * z0;
    len = x0 * x0 + x1 * x1 + x2 * x2;
    if (len > 0) {
      len = 1 / Math.sqrt(len);
      x0 *= len;
      x1 *= len;
      x2 *= len;
    }
    this[0] = x0;
    this[1] = x1;
    this[2] = x2;
    this[3] = 0;
    this[4] = z1 * x2 - z2 * x1;
    this[5] = z2 * x0 - z0 * x2;
    this[6] = z0 * x1 - z1 * x0;
    this[7] = 0;
    this[8] = z0;
    this[9] = z1;
    this[10] = z2;
    this[11] = 0;
    this[12] = eyex;
    this[13] = eyey;
    this[14] = eyez;
    this[15] = 1;
    return this;
  }
  //----------------------------------------------------
  fromAxisAngle(axis, rad) {
    let x = axis[0], y = axis[1], z = axis[2], len = Math.hypot(x, y, z);
    if (len < 1e-6)
      return this;
    len = 1 / len;
    x *= len;
    y *= len;
    z *= len;
    const s = Math.sin(rad);
    const c = Math.cos(rad);
    const t = 1 - c;
    this[0] = x * x * t + c;
    this[1] = y * x * t + z * s;
    this[2] = z * x * t - y * s;
    this[3] = 0;
    this[4] = x * y * t - z * s;
    this[5] = y * y * t + c;
    this[6] = z * y * t + x * s;
    this[7] = 0;
    this[8] = x * z * t + y * s;
    this[9] = y * z * t - x * s;
    this[10] = z * z * t + c;
    this[11] = 0;
    this[12] = 0;
    this[13] = 0;
    this[14] = 0;
    this[15] = 1;
    return this;
  }
  fromRotX(rad) {
    const s = Math.sin(rad), c = Math.cos(rad);
    this[0] = 1;
    this[1] = 0;
    this[2] = 0;
    this[3] = 0;
    this[4] = 0;
    this[5] = c;
    this[6] = s;
    this[7] = 0;
    this[8] = 0;
    this[9] = -s;
    this[10] = c;
    this[11] = 0;
    this[12] = 0;
    this[13] = 0;
    this[14] = 0;
    this[15] = 1;
    return this;
  }
  fromRotY(rad) {
    const s = Math.sin(rad), c = Math.cos(rad);
    this[0] = c;
    this[1] = 0;
    this[2] = -s;
    this[3] = 0;
    this[4] = 0;
    this[5] = 1;
    this[6] = 0;
    this[7] = 0;
    this[8] = s;
    this[9] = 0;
    this[10] = c;
    this[11] = 0;
    this[12] = 0;
    this[13] = 0;
    this[14] = 0;
    this[15] = 1;
    return this;
  }
  fromRotZ(rad) {
    const s = Math.sin(rad), c = Math.cos(rad);
    this[0] = c;
    this[1] = s;
    this[2] = 0;
    this[3] = 0;
    this[4] = -s;
    this[5] = c;
    this[6] = 0;
    this[7] = 0;
    this[8] = 0;
    this[9] = 0;
    this[10] = 1;
    this[11] = 0;
    this[12] = 0;
    this[13] = 0;
    this[14] = 0;
    this[15] = 1;
    return this;
  }
  //----------------------------------------------------
  // Calculates a 3x3 normal matrix ( transpose & inverse ) from this 4x4 matrix
  toNormalMat3(out) {
    const a00 = this[0], a01 = this[1], a02 = this[2], a03 = this[3], a10 = this[4], a11 = this[5], a12 = this[6], a13 = this[7], a20 = this[8], a21 = this[9], a22 = this[10], a23 = this[11], a30 = this[12], a31 = this[13], a32 = this[14], a33 = this[15], b00 = a00 * a11 - a01 * a10, b01 = a00 * a12 - a02 * a10, b02 = a00 * a13 - a03 * a10, b03 = a01 * a12 - a02 * a11, b04 = a01 * a13 - a03 * a11, b05 = a02 * a13 - a03 * a12, b06 = a20 * a31 - a21 * a30, b07 = a20 * a32 - a22 * a30, b08 = a20 * a33 - a23 * a30, b09 = a21 * a32 - a22 * a31, b10 = a21 * a33 - a23 * a31, b11 = a22 * a33 - a23 * a32;
    let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
    out = out || [0, 0, 0, 0, 0, 0, 0, 0, 0];
    if (!det)
      return out;
    det = 1 / det;
    out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
    out[1] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
    out[2] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
    out[3] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
    out[4] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
    out[5] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
    out[6] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
    out[7] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
    out[8] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
    return out;
  }
  //----------------------------------------------------
  // FLAT BUFFERS
  /** Used to get data from a flat buffer of matrices */
  fromBuf(ary, idx) {
    this[0] = ary[idx];
    this[1] = ary[idx + 1];
    this[2] = ary[idx + 2];
    this[3] = ary[idx + 3];
    this[4] = ary[idx + 4];
    this[5] = ary[idx + 5];
    this[6] = ary[idx + 6];
    this[7] = ary[idx + 7];
    this[8] = ary[idx + 8];
    this[9] = ary[idx + 9];
    this[10] = ary[idx + 10];
    this[11] = ary[idx + 11];
    this[12] = ary[idx + 12];
    this[13] = ary[idx + 13];
    this[14] = ary[idx + 14];
    this[15] = ary[idx + 15];
    return this;
  }
  /** Put data into a flat buffer of matrices */
  toBuf(ary, idx) {
    ary[idx] = this[0];
    ary[idx + 1] = this[1];
    ary[idx + 2] = this[2];
    ary[idx + 3] = this[3];
    ary[idx + 4] = this[4];
    ary[idx + 5] = this[5];
    ary[idx + 6] = this[6];
    ary[idx + 7] = this[7];
    ary[idx + 8] = this[8];
    ary[idx + 9] = this[9];
    ary[idx + 10] = this[10];
    ary[idx + 11] = this[11];
    ary[idx + 12] = this[12];
    ary[idx + 13] = this[13];
    ary[idx + 14] = this[14];
    ary[idx + 15] = this[15];
    return this;
  }
  // #endregion
  // #region OPERATIONS
  add(b) {
    this[0] = this[0] + b[0];
    this[1] = this[1] + b[1];
    this[2] = this[2] + b[2];
    this[3] = this[3] + b[3];
    this[4] = this[4] + b[4];
    this[5] = this[5] + b[5];
    this[6] = this[6] + b[6];
    this[7] = this[7] + b[7];
    this[8] = this[8] + b[8];
    this[9] = this[9] + b[9];
    this[10] = this[10] + b[10];
    this[11] = this[11] + b[11];
    this[12] = this[12] + b[12];
    this[13] = this[13] + b[13];
    this[14] = this[14] + b[14];
    this[15] = this[15] + b[15];
    return this;
  }
  sub(b) {
    this[0] = this[0] - b[0];
    this[1] = this[1] - b[1];
    this[2] = this[2] - b[2];
    this[3] = this[3] - b[3];
    this[4] = this[4] - b[4];
    this[5] = this[5] - b[5];
    this[6] = this[6] - b[6];
    this[7] = this[7] - b[7];
    this[8] = this[8] - b[8];
    this[9] = this[9] - b[9];
    this[10] = this[10] - b[10];
    this[11] = this[11] - b[11];
    this[12] = this[12] - b[12];
    this[13] = this[13] - b[13];
    this[14] = this[14] - b[14];
    this[15] = this[15] - b[15];
    return this;
  }
  mul(b) {
    const a00 = this[0], a01 = this[1], a02 = this[2], a03 = this[3], a10 = this[4], a11 = this[5], a12 = this[6], a13 = this[7], a20 = this[8], a21 = this[9], a22 = this[10], a23 = this[11], a30 = this[12], a31 = this[13], a32 = this[14], a33 = this[15];
    let b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
    this[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    this[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    this[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    this[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    b0 = b[4];
    b1 = b[5];
    b2 = b[6];
    b3 = b[7];
    this[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    this[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    this[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    this[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    b0 = b[8];
    b1 = b[9];
    b2 = b[10];
    b3 = b[11];
    this[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    this[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    this[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    this[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    b0 = b[12];
    b1 = b[13];
    b2 = b[14];
    b3 = b[15];
    this[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    this[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    this[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    this[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    return this;
  }
  pmul(b) {
    const a00 = b[0], a01 = b[1], a02 = b[2], a03 = b[3], a10 = b[4], a11 = b[5], a12 = b[6], a13 = b[7], a20 = b[8], a21 = b[9], a22 = b[10], a23 = b[11], a30 = b[12], a31 = b[13], a32 = b[14], a33 = b[15];
    let b0 = this[0], b1 = this[1], b2 = this[2], b3 = this[3];
    this[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    this[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    this[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    this[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    b0 = this[4];
    b1 = this[5];
    b2 = this[6];
    b3 = this[7];
    this[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    this[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    this[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    this[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    b0 = this[8];
    b1 = this[9];
    b2 = this[10];
    b3 = this[11];
    this[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    this[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    this[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    this[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    b0 = this[12];
    b1 = this[13];
    b2 = this[14];
    b3 = this[15];
    this[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    this[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    this[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    this[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    return this;
  }
  invert() {
    const a00 = this[0], a01 = this[1], a02 = this[2], a03 = this[3], a10 = this[4], a11 = this[5], a12 = this[6], a13 = this[7], a20 = this[8], a21 = this[9], a22 = this[10], a23 = this[11], a30 = this[12], a31 = this[13], a32 = this[14], a33 = this[15], b00 = a00 * a11 - a01 * a10, b01 = a00 * a12 - a02 * a10, b02 = a00 * a13 - a03 * a10, b03 = a01 * a12 - a02 * a11, b04 = a01 * a13 - a03 * a11, b05 = a02 * a13 - a03 * a12, b06 = a20 * a31 - a21 * a30, b07 = a20 * a32 - a22 * a30, b08 = a20 * a33 - a23 * a30, b09 = a21 * a32 - a22 * a31, b10 = a21 * a33 - a23 * a31, b11 = a22 * a33 - a23 * a32;
    let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
    if (!det)
      return this;
    det = 1 / det;
    this[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
    this[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
    this[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
    this[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
    this[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
    this[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
    this[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
    this[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
    this[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
    this[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
    this[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
    this[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
    this[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
    this[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
    this[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
    this[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;
    return this;
  }
  translate(v, y, z) {
    let xx, yy, zz;
    if (v instanceof Float32Array || v instanceof Array && v.length == 3) {
      xx = v[0];
      yy = v[1];
      zz = v[2];
    } else if (typeof v === "number" && typeof y === "number" && typeof z === "number") {
      xx = v;
      yy = y;
      zz = z;
    } else
      return this;
    this[12] = this[0] * xx + this[4] * yy + this[8] * zz + this[12];
    this[13] = this[1] * xx + this[5] * yy + this[9] * zz + this[13];
    this[14] = this[2] * xx + this[6] * yy + this[10] * zz + this[14];
    this[15] = this[3] * xx + this[7] * yy + this[11] * zz + this[15];
    return this;
  }
  scale(x, y, z) {
    if (y == void 0)
      y = x;
    if (z == void 0)
      z = x;
    this[0] *= x;
    this[1] *= x;
    this[2] *= x;
    this[3] *= x;
    this[4] *= y;
    this[5] *= y;
    this[6] *= y;
    this[7] *= y;
    this[8] *= z;
    this[9] *= z;
    this[10] *= z;
    this[11] *= z;
    return this;
  }
  //----------------------------------------------------
  /** Make the rows into the columns */
  transpose() {
    const a01 = this[1], a02 = this[2], a03 = this[3], a12 = this[6], a13 = this[7], a23 = this[11];
    this[1] = this[4];
    this[2] = this[8];
    this[3] = this[12];
    this[4] = a01;
    this[6] = this[9];
    this[7] = this[13];
    this[8] = a02;
    this[9] = a12;
    this[11] = this[14];
    this[12] = a03;
    this[13] = a13;
    this[14] = a23;
    return this;
  }
  //----------------------------------------------------
  decompose(out_r, out_t, out_s) {
    out_t[0] = this[12];
    out_t[1] = this[13];
    out_t[2] = this[14];
    const m11 = this[0];
    const m12 = this[1];
    const m13 = this[2];
    const m21 = this[4];
    const m22 = this[5];
    const m23 = this[6];
    const m31 = this[8];
    const m32 = this[9];
    const m33 = this[10];
    out_s[0] = Math.hypot(m11, m12, m13);
    out_s[1] = Math.hypot(m21, m22, m23);
    out_s[2] = Math.hypot(m31, m32, m33);
    const is1 = 1 / out_s[0];
    const is2 = 1 / out_s[1];
    const is3 = 1 / out_s[2];
    const sm11 = m11 * is1;
    const sm12 = m12 * is2;
    const sm13 = m13 * is3;
    const sm21 = m21 * is1;
    const sm22 = m22 * is2;
    const sm23 = m23 * is3;
    const sm31 = m31 * is1;
    const sm32 = m32 * is2;
    const sm33 = m33 * is3;
    const trace = sm11 + sm22 + sm33;
    let S = 0;
    if (trace > 0) {
      S = Math.sqrt(trace + 1) * 2;
      out_r[3] = 0.25 * S;
      out_r[0] = (sm23 - sm32) / S;
      out_r[1] = (sm31 - sm13) / S;
      out_r[2] = (sm12 - sm21) / S;
    } else if (sm11 > sm22 && sm11 > sm33) {
      S = Math.sqrt(1 + sm11 - sm22 - sm33) * 2;
      out_r[3] = (sm23 - sm32) / S;
      out_r[0] = 0.25 * S;
      out_r[1] = (sm12 + sm21) / S;
      out_r[2] = (sm31 + sm13) / S;
    } else if (sm22 > sm33) {
      S = Math.sqrt(1 + sm22 - sm11 - sm33) * 2;
      out_r[3] = (sm31 - sm13) / S;
      out_r[0] = (sm12 + sm21) / S;
      out_r[1] = 0.25 * S;
      out_r[2] = (sm23 + sm32) / S;
    } else {
      S = Math.sqrt(1 + sm33 - sm11 - sm22) * 2;
      out_r[3] = (sm12 - sm21) / S;
      out_r[0] = (sm31 + sm13) / S;
      out_r[1] = (sm23 + sm32) / S;
      out_r[2] = 0.25 * S;
    }
    return this;
  }
  //----------------------------------------------------
  rotX(rad) {
    const s = Math.sin(rad), c = Math.cos(rad), a10 = this[4], a11 = this[5], a12 = this[6], a13 = this[7], a20 = this[8], a21 = this[9], a22 = this[10], a23 = this[11];
    this[4] = a10 * c + a20 * s;
    this[5] = a11 * c + a21 * s;
    this[6] = a12 * c + a22 * s;
    this[7] = a13 * c + a23 * s;
    this[8] = a20 * c - a10 * s;
    this[9] = a21 * c - a11 * s;
    this[10] = a22 * c - a12 * s;
    this[11] = a23 * c - a13 * s;
    return this;
  }
  rotY(rad) {
    const s = Math.sin(rad), c = Math.cos(rad), a00 = this[0], a01 = this[1], a02 = this[2], a03 = this[3], a20 = this[8], a21 = this[9], a22 = this[10], a23 = this[11];
    this[0] = a00 * c - a20 * s;
    this[1] = a01 * c - a21 * s;
    this[2] = a02 * c - a22 * s;
    this[3] = a03 * c - a23 * s;
    this[8] = a00 * s + a20 * c;
    this[9] = a01 * s + a21 * c;
    this[10] = a02 * s + a22 * c;
    this[11] = a03 * s + a23 * c;
    return this;
  }
  rotZ(rad) {
    const s = Math.sin(rad), c = Math.cos(rad), a00 = this[0], a01 = this[1], a02 = this[2], a03 = this[3], a10 = this[4], a11 = this[5], a12 = this[6], a13 = this[7];
    this[0] = a00 * c + a10 * s;
    this[1] = a01 * c + a11 * s;
    this[2] = a02 * c + a12 * s;
    this[3] = a03 * c + a13 * s;
    this[4] = a10 * c - a00 * s;
    this[5] = a11 * c - a01 * s;
    this[6] = a12 * c - a02 * s;
    this[7] = a13 * c - a03 * s;
    return this;
  }
  rotAxisAngle(axis, rad) {
    let x = axis[0], y = axis[1], z = axis[2], len = Math.sqrt(x * x + y * y + z * z);
    if (Math.abs(len) < 1e-6)
      return this;
    len = 1 / len;
    x *= len;
    y *= len;
    z *= len;
    const s = Math.sin(rad);
    const c = Math.cos(rad);
    const t = 1 - c;
    const a00 = this[0];
    const a01 = this[1];
    const a02 = this[2];
    const a03 = this[3];
    const a10 = this[4];
    const a11 = this[5];
    const a12 = this[6];
    const a13 = this[7];
    const a20 = this[8];
    const a21 = this[9];
    const a22 = this[10];
    const a23 = this[11];
    const b00 = x * x * t + c;
    const b01 = y * x * t + z * s;
    const b02 = z * x * t - y * s;
    const b10 = x * y * t - z * s;
    const b11 = y * y * t + c;
    const b12 = z * y * t + x * s;
    const b20 = x * z * t + y * s;
    const b21 = y * z * t - x * s;
    const b22 = z * z * t + c;
    this[0] = a00 * b00 + a10 * b01 + a20 * b02;
    this[1] = a01 * b00 + a11 * b01 + a21 * b02;
    this[2] = a02 * b00 + a12 * b01 + a22 * b02;
    this[3] = a03 * b00 + a13 * b01 + a23 * b02;
    this[4] = a00 * b10 + a10 * b11 + a20 * b12;
    this[5] = a01 * b10 + a11 * b11 + a21 * b12;
    this[6] = a02 * b10 + a12 * b11 + a22 * b12;
    this[7] = a03 * b10 + a13 * b11 + a23 * b12;
    this[8] = a00 * b20 + a10 * b21 + a20 * b22;
    this[9] = a01 * b20 + a11 * b21 + a21 * b22;
    this[10] = a02 * b20 + a12 * b21 + a22 * b22;
    this[11] = a03 * b20 + a13 * b21 + a23 * b22;
    return this;
  }
  // #endregion
  // #region TRANSFORMS
  transformVec3(v, out = [0, 0, 0]) {
    const x = v[0], y = v[1], z = v[2];
    out[0] = this[0] * x + this[4] * y + this[8] * z + this[12];
    out[1] = this[1] * x + this[5] * y + this[9] * z + this[13];
    out[2] = this[2] * x + this[6] * y + this[10] * z + this[14];
    return out;
  }
  transformVec4(v, out = [0, 0, 0, 0]) {
    const x = v[0], y = v[1], z = v[2], w = v[3];
    out[0] = this[0] * x + this[4] * y + this[8] * z + this[12] * w;
    out[1] = this[1] * x + this[5] * y + this[9] * z + this[13] * w;
    out[2] = this[2] * x + this[6] * y + this[10] * z + this[14] * w;
    out[3] = this[3] * x + this[7] * y + this[11] * z + this[15] * w;
    return out;
  }
  // #endregion
  // #region STATIC
  static mul(a, b) {
    return new Mat4().fromMul(a, b);
  }
  static invert(a) {
    return new Mat4().fromInvert(a);
  }
  // #endregion 
}

const COMP_LEN = 16;
class MatrixSkin {
  // #region MAIN
  bind;
  world;
  offsetBuffer;
  constructor(bindPose) {
    const bCnt = bindPose.bones.length;
    const mat4Identity = new Mat4();
    const world = new Array(bCnt);
    const bind = new Array(bCnt);
    this.offsetBuffer = new Float32Array(COMP_LEN * bCnt);
    for (let i = 0; i < bCnt; i++) {
      world[i] = new Mat4();
      bind[i] = new Mat4();
      mat4Identity.toBuf(this.offsetBuffer, i * COMP_LEN);
    }
    let b;
    let l;
    let m = new Mat4();
    for (let i = 0; i < bCnt; i++) {
      b = bindPose.bones[i];
      l = b.local;
      m = world[i];
      m.fromQuatTranScale(l.rot, l.pos, l.scl);
      if (b.pindex !== -1)
        m.pmul(world[b.pindex]);
      bind[i].fromInvert(m);
    }
    this.bind = bind;
    this.world = world;
  }
  // #endregion
  // #region METHODS
  updateFromPose(pose) {
    const offset = new Mat4().fromQuatTranScale(
      pose.offset.rot,
      pose.offset.pos,
      pose.offset.scl
    );
    const bOffset = new Mat4();
    const w = this.world;
    let b;
    let m;
    let i;
    for (i = 0; i < pose.bones.length; i++) {
      b = pose.bones[i];
      m = w[i];
      m.fromQuatTranScale(b.local.rot, b.local.pos, b.local.scl);
      if (b.pindex !== -1)
        m.pmul(w[b.pindex]);
      else
        m.pmul(offset);
      bOffset.fromMul(m, this.bind[i]).toBuf(this.offsetBuffer, i * COMP_LEN);
    }
    return this;
  }
  // #endregion
}

/**
 * Common utilities
 * @module glMatrix
 */
// Configuration Constants
var EPSILON = 0.000001;
var ARRAY_TYPE = typeof Float32Array !== 'undefined' ? Float32Array : Array;
if (!Math.hypot) Math.hypot = function () {
  var y = 0,
      i = arguments.length;

  while (i--) {
    y += arguments[i] * arguments[i];
  }

  return Math.sqrt(y);
};

/**
 * 3x3 Matrix
 * @module mat3
 */

/**
 * Creates a new identity mat3
 *
 * @returns {mat3} a new 3x3 matrix
 */

function create$3() {
  var out = new ARRAY_TYPE(9);

  if (ARRAY_TYPE != Float32Array) {
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[5] = 0;
    out[6] = 0;
    out[7] = 0;
  }

  out[0] = 1;
  out[4] = 1;
  out[8] = 1;
  return out;
}

/**
 * 3 Dimensional Vector
 * @module vec3
 */

/**
 * Creates a new, empty vec3
 *
 * @returns {vec3} a new 3D vector
 */

function create$2() {
  var out = new ARRAY_TYPE(3);

  if (ARRAY_TYPE != Float32Array) {
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
  }

  return out;
}
/**
 * Calculates the length of a vec3
 *
 * @param {ReadonlyVec3} a vector to calculate length of
 * @returns {Number} length of a
 */

function length(a) {
  var x = a[0];
  var y = a[1];
  var z = a[2];
  return Math.hypot(x, y, z);
}
/**
 * Creates a new vec3 initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @returns {vec3} a new 3D vector
 */

function fromValues(x, y, z) {
  var out = new ARRAY_TYPE(3);
  out[0] = x;
  out[1] = y;
  out[2] = z;
  return out;
}
/**
 * Copy the values from one vec3 to another
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the source vector
 * @returns {vec3} out
 */

function copy(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  return out;
}
/**
 * Normalize a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a vector to normalize
 * @returns {vec3} out
 */

function normalize$2(out, a) {
  var x = a[0];
  var y = a[1];
  var z = a[2];
  var len = x * x + y * y + z * z;

  if (len > 0) {
    //TODO: evaluate use of glm_invsqrt here?
    len = 1 / Math.sqrt(len);
  }

  out[0] = a[0] * len;
  out[1] = a[1] * len;
  out[2] = a[2] * len;
  return out;
}
/**
 * Calculates the dot product of two vec3's
 *
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @returns {Number} dot product of a and b
 */

function dot(a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}
/**
 * Computes the cross product of two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @returns {vec3} out
 */

function cross(out, a, b) {
  var ax = a[0],
      ay = a[1],
      az = a[2];
  var bx = b[0],
      by = b[1],
      bz = b[2];
  out[0] = ay * bz - az * by;
  out[1] = az * bx - ax * bz;
  out[2] = ax * by - ay * bx;
  return out;
}
/**
 * Alias for {@link vec3.length}
 * @function
 */

var len = length;
/**
 * Perform some operation over an array of vec3s.
 *
 * @param {Array} a the array of vectors to iterate over
 * @param {Number} stride Number of elements between the start of each vec3. If 0 assumes tightly packed
 * @param {Number} offset Number of elements to skip at the beginning of the array
 * @param {Number} count Number of vec3s to iterate over. If 0 iterates over entire array
 * @param {Function} fn Function to call for each vector in the array
 * @param {Object} [arg] additional argument to pass to fn
 * @returns {Array} a
 * @function
 */

(function () {
  var vec = create$2();
  return function (a, stride, offset, count, fn, arg) {
    var i, l;

    if (!stride) {
      stride = 3;
    }

    if (!offset) {
      offset = 0;
    }

    if (count) {
      l = Math.min(count * stride + offset, a.length);
    } else {
      l = a.length;
    }

    for (i = offset; i < l; i += stride) {
      vec[0] = a[i];
      vec[1] = a[i + 1];
      vec[2] = a[i + 2];
      fn(vec, vec, arg);
      a[i] = vec[0];
      a[i + 1] = vec[1];
      a[i + 2] = vec[2];
    }

    return a;
  };
})();

/**
 * 4 Dimensional Vector
 * @module vec4
 */

/**
 * Creates a new, empty vec4
 *
 * @returns {vec4} a new 4D vector
 */

function create$1() {
  var out = new ARRAY_TYPE(4);

  if (ARRAY_TYPE != Float32Array) {
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
  }

  return out;
}
/**
 * Calculates the squared length of a vec4
 *
 * @param {ReadonlyVec4} a vector to calculate squared length of
 * @returns {Number} squared length of a
 */

function squaredLength$2(a) {
  var x = a[0];
  var y = a[1];
  var z = a[2];
  var w = a[3];
  return x * x + y * y + z * z + w * w;
}
/**
 * Normalize a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {ReadonlyVec4} a vector to normalize
 * @returns {vec4} out
 */

function normalize$1(out, a) {
  var x = a[0];
  var y = a[1];
  var z = a[2];
  var w = a[3];
  var len = x * x + y * y + z * z + w * w;

  if (len > 0) {
    len = 1 / Math.sqrt(len);
  }

  out[0] = x * len;
  out[1] = y * len;
  out[2] = z * len;
  out[3] = w * len;
  return out;
}
/**
 * Perform some operation over an array of vec4s.
 *
 * @param {Array} a the array of vectors to iterate over
 * @param {Number} stride Number of elements between the start of each vec4. If 0 assumes tightly packed
 * @param {Number} offset Number of elements to skip at the beginning of the array
 * @param {Number} count Number of vec4s to iterate over. If 0 iterates over entire array
 * @param {Function} fn Function to call for each vector in the array
 * @param {Object} [arg] additional argument to pass to fn
 * @returns {Array} a
 * @function
 */

(function () {
  var vec = create$1();
  return function (a, stride, offset, count, fn, arg) {
    var i, l;

    if (!stride) {
      stride = 4;
    }

    if (!offset) {
      offset = 0;
    }

    if (count) {
      l = Math.min(count * stride + offset, a.length);
    } else {
      l = a.length;
    }

    for (i = offset; i < l; i += stride) {
      vec[0] = a[i];
      vec[1] = a[i + 1];
      vec[2] = a[i + 2];
      vec[3] = a[i + 3];
      fn(vec, vec, arg);
      a[i] = vec[0];
      a[i + 1] = vec[1];
      a[i + 2] = vec[2];
      a[i + 3] = vec[3];
    }

    return a;
  };
})();

/**
 * Quaternion
 * @module quat
 */

/**
 * Creates a new identity quat
 *
 * @returns {quat} a new quaternion
 */

function create() {
  var out = new ARRAY_TYPE(4);

  if (ARRAY_TYPE != Float32Array) {
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
  }

  out[3] = 1;
  return out;
}
/**
 * Sets a quat from the given angle and rotation axis,
 * then returns it.
 *
 * @param {quat} out the receiving quaternion
 * @param {ReadonlyVec3} axis the axis around which to rotate
 * @param {Number} rad the angle in radians
 * @returns {quat} out
 **/

function setAxisAngle(out, axis, rad) {
  rad = rad * 0.5;
  var s = Math.sin(rad);
  out[0] = s * axis[0];
  out[1] = s * axis[1];
  out[2] = s * axis[2];
  out[3] = Math.cos(rad);
  return out;
}
/**
 * Performs a spherical linear interpolation between two quat
 *
 * @param {quat} out the receiving quaternion
 * @param {ReadonlyQuat} a the first operand
 * @param {ReadonlyQuat} b the second operand
 * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
 * @returns {quat} out
 */

function slerp(out, a, b, t) {
  // benchmarks:
  //    http://jsperf.com/quaternion-slerp-implementations
  var ax = a[0],
      ay = a[1],
      az = a[2],
      aw = a[3];
  var bx = b[0],
      by = b[1],
      bz = b[2],
      bw = b[3];
  var omega, cosom, sinom, scale0, scale1; // calc cosine

  cosom = ax * bx + ay * by + az * bz + aw * bw; // adjust signs (if necessary)

  if (cosom < 0.0) {
    cosom = -cosom;
    bx = -bx;
    by = -by;
    bz = -bz;
    bw = -bw;
  } // calculate coefficients


  if (1.0 - cosom > EPSILON) {
    // standard case (slerp)
    omega = Math.acos(cosom);
    sinom = Math.sin(omega);
    scale0 = Math.sin((1.0 - t) * omega) / sinom;
    scale1 = Math.sin(t * omega) / sinom;
  } else {
    // "from" and "to" quaternions are very close
    //  ... so we can do a linear interpolation
    scale0 = 1.0 - t;
    scale1 = t;
  } // calculate final values


  out[0] = scale0 * ax + scale1 * bx;
  out[1] = scale0 * ay + scale1 * by;
  out[2] = scale0 * az + scale1 * bz;
  out[3] = scale0 * aw + scale1 * bw;
  return out;
}
/**
 * Creates a quaternion from the given 3x3 rotation matrix.
 *
 * NOTE: The resultant quaternion is not normalized, so you should be sure
 * to renormalize the quaternion yourself where necessary.
 *
 * @param {quat} out the receiving quaternion
 * @param {ReadonlyMat3} m rotation matrix
 * @returns {quat} out
 * @function
 */

function fromMat3(out, m) {
  // Algorithm in Ken Shoemake's article in 1987 SIGGRAPH course notes
  // article "Quaternion Calculus and Fast Animation".
  var fTrace = m[0] + m[4] + m[8];
  var fRoot;

  if (fTrace > 0.0) {
    // |w| > 1/2, may as well choose w > 1/2
    fRoot = Math.sqrt(fTrace + 1.0); // 2w

    out[3] = 0.5 * fRoot;
    fRoot = 0.5 / fRoot; // 1/(4w)

    out[0] = (m[5] - m[7]) * fRoot;
    out[1] = (m[6] - m[2]) * fRoot;
    out[2] = (m[1] - m[3]) * fRoot;
  } else {
    // |w| <= 1/2
    var i = 0;
    if (m[4] > m[0]) i = 1;
    if (m[8] > m[i * 3 + i]) i = 2;
    var j = (i + 1) % 3;
    var k = (i + 2) % 3;
    fRoot = Math.sqrt(m[i * 3 + i] - m[j * 3 + j] - m[k * 3 + k] + 1.0);
    out[i] = 0.5 * fRoot;
    fRoot = 0.5 / fRoot;
    out[3] = (m[j * 3 + k] - m[k * 3 + j]) * fRoot;
    out[j] = (m[j * 3 + i] + m[i * 3 + j]) * fRoot;
    out[k] = (m[k * 3 + i] + m[i * 3 + k]) * fRoot;
  }

  return out;
}
/**
 * Calculates the squared length of a quat
 *
 * @param {ReadonlyQuat} a vector to calculate squared length of
 * @returns {Number} squared length of a
 * @function
 */

var squaredLength$1 = squaredLength$2;
/**
 * Normalize a quat
 *
 * @param {quat} out the receiving quaternion
 * @param {ReadonlyQuat} a quaternion to normalize
 * @returns {quat} out
 * @function
 */

var normalize = normalize$1;
/**
 * Sets a quaternion to represent the shortest rotation from one
 * vector to another.
 *
 * Both vectors are assumed to be unit length.
 *
 * @param {quat} out the receiving quaternion.
 * @param {ReadonlyVec3} a the initial vector
 * @param {ReadonlyVec3} b the destination vector
 * @returns {quat} out
 */

(function () {
  var tmpvec3 = create$2();
  var xUnitVec3 = fromValues(1, 0, 0);
  var yUnitVec3 = fromValues(0, 1, 0);
  return function (out, a, b) {
    var dot$1 = dot(a, b);

    if (dot$1 < -0.999999) {
      cross(tmpvec3, xUnitVec3, a);
      if (len(tmpvec3) < 0.000001) cross(tmpvec3, yUnitVec3, a);
      normalize$2(tmpvec3, tmpvec3);
      setAxisAngle(out, tmpvec3, Math.PI);
      return out;
    } else if (dot$1 > 0.999999) {
      out[0] = 0;
      out[1] = 0;
      out[2] = 0;
      out[3] = 1;
      return out;
    } else {
      cross(tmpvec3, a, b);
      out[0] = tmpvec3[0];
      out[1] = tmpvec3[1];
      out[2] = tmpvec3[2];
      out[3] = 1 + dot$1;
      return normalize(out, out);
    }
  };
})();
/**
 * Performs a spherical linear interpolation with two control points
 *
 * @param {quat} out the receiving quaternion
 * @param {ReadonlyQuat} a the first operand
 * @param {ReadonlyQuat} b the second operand
 * @param {ReadonlyQuat} c the third operand
 * @param {ReadonlyQuat} d the fourth operand
 * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
 * @returns {quat} out
 */

(function () {
  var temp1 = create();
  var temp2 = create();
  return function (out, a, b, c, d, t) {
    slerp(temp1, a, d, t);
    slerp(temp2, b, c, t);
    slerp(out, temp1, temp2, 2 * t * (1 - t));
    return out;
  };
})();
/**
 * Sets the specified quaternion with values corresponding to the given
 * axes. Each axis is a vec3 and is expected to be unit length and
 * perpendicular to all other specified axes.
 *
 * @param {ReadonlyVec3} view  the vector representing the viewing direction
 * @param {ReadonlyVec3} right the vector representing the local "right" direction
 * @param {ReadonlyVec3} up    the vector representing the local "up" direction
 * @returns {quat} out
 */

(function () {
  var matr = create$3();
  return function (out, view, right, up) {
    matr[0] = right[0];
    matr[3] = right[1];
    matr[6] = right[2];
    matr[1] = up[0];
    matr[4] = up[1];
    matr[7] = up[2];
    matr[2] = -view[0];
    matr[5] = -view[1];
    matr[8] = -view[2];
    return normalize(out, fromMat3(out, matr));
  };
})();

/**
 * Creates a dual quat from a quaternion and a translation
 *
 * @param {ReadonlyQuat2} dual quaternion receiving operation result
 * @param {ReadonlyQuat} q a normalized quaternion
 * @param {ReadonlyVec3} t tranlation vector
 * @returns {quat2} dual quaternion receiving operation result
 * @function
 */

function fromRotationTranslation(out, q, t) {
  var ax = t[0] * 0.5,
      ay = t[1] * 0.5,
      az = t[2] * 0.5,
      bx = q[0],
      by = q[1],
      bz = q[2],
      bw = q[3];
  out[0] = bx;
  out[1] = by;
  out[2] = bz;
  out[3] = bw;
  out[4] = ax * bw + ay * bz - az * by;
  out[5] = ay * bw + az * bx - ax * bz;
  out[6] = az * bw + ax * by - ay * bx;
  out[7] = -ax * bx - ay * by - az * bz;
  return out;
}
/**
 * Multiplies two dual quat's
 *
 * @param {quat2} out the receiving dual quaternion
 * @param {ReadonlyQuat2} a the first operand
 * @param {ReadonlyQuat2} b the second operand
 * @returns {quat2} out
 */

function multiply(out, a, b) {
  var ax0 = a[0],
      ay0 = a[1],
      az0 = a[2],
      aw0 = a[3],
      bx1 = b[4],
      by1 = b[5],
      bz1 = b[6],
      bw1 = b[7],
      ax1 = a[4],
      ay1 = a[5],
      az1 = a[6],
      aw1 = a[7],
      bx0 = b[0],
      by0 = b[1],
      bz0 = b[2],
      bw0 = b[3];
  out[0] = ax0 * bw0 + aw0 * bx0 + ay0 * bz0 - az0 * by0;
  out[1] = ay0 * bw0 + aw0 * by0 + az0 * bx0 - ax0 * bz0;
  out[2] = az0 * bw0 + aw0 * bz0 + ax0 * by0 - ay0 * bx0;
  out[3] = aw0 * bw0 - ax0 * bx0 - ay0 * by0 - az0 * bz0;
  out[4] = ax0 * bw1 + aw0 * bx1 + ay0 * bz1 - az0 * by1 + ax1 * bw0 + aw1 * bx0 + ay1 * bz0 - az1 * by0;
  out[5] = ay0 * bw1 + aw0 * by1 + az0 * bx1 - ax0 * bz1 + ay1 * bw0 + aw1 * by0 + az1 * bx0 - ax1 * bz0;
  out[6] = az0 * bw1 + aw0 * bz1 + ax0 * by1 - ay0 * bx1 + az1 * bw0 + aw1 * bz0 + ax1 * by0 - ay1 * bx0;
  out[7] = aw0 * bw1 - ax0 * bx1 - ay0 * by1 - az0 * bz1 + aw1 * bw0 - ax1 * bx0 - ay1 * by0 - az1 * bz0;
  return out;
}
/**
 * Alias for {@link quat2.multiply}
 * @function
 */

var mul = multiply;
/**
 * Calculates the inverse of a dual quat. If they are normalized, conjugate is cheaper
 *
 * @param {quat2} out the receiving dual quaternion
 * @param {ReadonlyQuat2} a dual quat to calculate inverse of
 * @returns {quat2} out
 */

function invert(out, a) {
  var sqlen = squaredLength(a);
  out[0] = -a[0] / sqlen;
  out[1] = -a[1] / sqlen;
  out[2] = -a[2] / sqlen;
  out[3] = a[3] / sqlen;
  out[4] = -a[4] / sqlen;
  out[5] = -a[5] / sqlen;
  out[6] = -a[6] / sqlen;
  out[7] = a[7] / sqlen;
  return out;
}
/**
 * Calculates the squared length of a dual quat
 *
 * @param {ReadonlyQuat2} a dual quat to calculate squared length of
 * @returns {Number} squared length of a
 * @function
 */

var squaredLength = squaredLength$1;

class Vec3Ex {
  // #region LOADING / CONVERSION
  /** Used to get data from a flat buffer */
  static fromBuf(out, ary, idx) {
    out[0] = ary[idx];
    out[1] = ary[idx + 1];
    out[2] = ary[idx + 2];
    return out;
  }
  /** Put data into a flat buffer */
  static toBuf(v, ary, idx) {
    ary[idx] = v[0];
    ary[idx + 1] = v[1];
    ary[idx + 2] = v[2];
    return this;
  }
  // #endregion
  static lookAxes(dir, up = [0, 1, 0], xAxis = [1, 0, 0], yAxis = [0, 1, 0], zAxis = [0, 0, 1]) {
    copy(zAxis, dir);
    cross(xAxis, up, zAxis);
    cross(yAxis, zAxis, xAxis);
    normalize$2(xAxis, xAxis);
    normalize$2(yAxis, yAxis);
    normalize$2(zAxis, zAxis);
  }
  static project(out, from, to) {
    const denom = dot(to, to);
    if (denom < 1e-6) {
      out[0] = 0;
      out[1] = 0;
      out[2] = 0;
      return out;
    }
    const scl = dot(from, to) / denom;
    out[0] = to[0] * scl;
    out[1] = to[1] * scl;
    out[2] = to[2] * scl;
    return out;
  }
}

let DQTSkin$1 = class DQTSkin {
  // #region MAIN
  bind;
  world;
  // Split into 3 Buffers because THREEJS does handle mat4x3 correctly
  // Since using in Shader Uniforms, can skip the 16 byte alignment for scale & store data as Vec3 instead of Vec4.
  // TODO : This may change in the future into a single mat4x3 buffer.
  offsetQBuffer;
  // DualQuat : Quaternion
  offsetPBuffer;
  // DualQuat : Translation
  offsetSBuffer;
  // Scale
  constructor(arm) {
    const bCnt = arm.boneCount;
    const world = new Array(bCnt);
    const bind = new Array(bCnt);
    this.offsetQBuffer = new Float32Array(4 * bCnt);
    this.offsetPBuffer = new Float32Array(4 * bCnt);
    this.offsetSBuffer = new Float32Array(3 * bCnt);
    for (let i = 0; i < bCnt; i++) {
      world[i] = new Transform();
      bind[i] = new Transform();
      Vec3Ex.toBuf([1, 1, 1], this.offsetSBuffer, i * 3);
    }
    const pose = arm.bindPose;
    let b;
    for (let i = 0; i < bCnt; i++) {
      b = pose.bones[i];
      if (b.pindex !== -1)
        world[i].fromMul(world[b.pindex], b.local);
      else
        world[i].copy(b.local);
      bind[i].fromInvert(world[i]);
    }
    this.bind = bind;
    this.world = world;
  }
  // #endregion
  // #region METHODS
  updateFromPose(pose) {
    const bOffset = new Transform();
    const w = this.world;
    const dq = [0, 0, 0, 1, 0, 0, 0, 0];
    let b;
    let ii = 0;
    let si = 0;
    for (let i = 0; i < pose.bones.length; i++) {
      b = pose.bones[i];
      if (b.pindex !== -1)
        w[i].fromMul(w[b.pindex], b.local);
      else
        w[i].fromMul(pose.offset, b.local);
      bOffset.fromMul(w[i], this.bind[i]);
      fromRotationTranslation(dq, bOffset.rot, bOffset.pos);
      ii = i * 4;
      si = i * 3;
      this.offsetQBuffer[ii + 0] = dq[0];
      this.offsetQBuffer[ii + 1] = dq[1];
      this.offsetQBuffer[ii + 2] = dq[2];
      this.offsetQBuffer[ii + 3] = dq[3];
      this.offsetPBuffer[ii + 0] = dq[4];
      this.offsetPBuffer[ii + 1] = dq[5];
      this.offsetPBuffer[ii + 2] = dq[6];
      this.offsetPBuffer[ii + 3] = dq[7];
      this.offsetSBuffer[si + 0] = bOffset.scl[0];
      this.offsetSBuffer[si + 1] = bOffset.scl[1];
      this.offsetSBuffer[si + 2] = bOffset.scl[2];
    }
    return this;
  }
  // #endregion
};

class TranMatrixSkin {
  // #region MAIN
  bind;
  // Bind pose 
  world;
  // World space computation
  offsetBuffer;
  // Final Output for shaders to use
  constructor(bindPose) {
    const bCnt = bindPose.bones.length;
    const mat4Identity = new Mat4();
    const world = new Array(bCnt);
    const bind = new Array(bCnt);
    this.offsetBuffer = new Float32Array(16 * bCnt);
    for (let i = 0; i < bCnt; i++) {
      world[i] = new Transform();
      bind[i] = new Transform();
      mat4Identity.toBuf(this.offsetBuffer, i * 16);
    }
    let b;
    for (let i = 0; i < bCnt; i++) {
      b = bindPose.bones[i];
      if (b.pindex !== -1)
        world[i].fromMul(world[b.pindex], b.local);
      else
        world[i].copy(b.local);
      bind[i].fromInvert(world[i]);
    }
    this.bind = bind;
    this.world = world;
  }
  // #endregion
  // #region METHODS
  updateFromPose(pose) {
    const bOffset = new Transform();
    const w = this.world;
    const m = new Mat4();
    let b;
    for (let i = 0; i < pose.bones.length; i++) {
      b = pose.bones[i];
      if (b.pindex !== -1)
        w[i].fromMul(w[b.pindex], b.local);
      else
        w[i].fromMul(pose.offset, b.local);
      bOffset.fromMul(w[i], this.bind[i]);
      m.fromQuatTranScale(bOffset.rot, bOffset.pos, bOffset.scl).toBuf(this.offsetBuffer, i * 16);
    }
    return this;
  }
  // #endregion
}

class DQTSkin {
  // #region MAIN
  bind;
  world;
  // Split into 2 Buffers because THREEJS does handle mat4x2 correctly
  offsetQBuffer;
  // DualQuat : Quaternion
  offsetPBuffer;
  // DualQuat : Translation
  constructor(arm) {
    const bCnt = arm.boneCount;
    const world = new Array(bCnt);
    const bind = new Array(bCnt);
    this.offsetQBuffer = new Float32Array(4 * bCnt);
    this.offsetPBuffer = new Float32Array(4 * bCnt);
    for (let i = 0; i < bCnt; i++) {
      world[i] = [0, 0, 0, 1, 0, 0, 0, 0];
      bind[i] = [0, 0, 0, 1, 0, 0, 0, 0];
    }
    const pose = arm.bindPose;
    let b;
    for (let i = 0; i < bCnt; i++) {
      b = pose.bones[i];
      fromRotationTranslation(world[i], b.local.rot, b.local.pos);
      if (b.pindex !== -1)
        mul(world[i], world[b.pindex], world[i]);
      invert(bind[i], world[i]);
    }
    this.bind = bind;
    this.world = world;
  }
  // #endregion
  // #region METHODS
  updateFromPose(pose) {
    const offset = fromRotationTranslation([0, 0, 0, 1, 0, 0, 0, 0], pose.offset.rot, pose.offset.pos);
    const dq = [0, 0, 0, 1, 0, 0, 0, 0];
    const w = this.world;
    let b;
    let ii = 0;
    for (let i = 0; i < pose.bones.length; i++) {
      b = pose.bones[i];
      fromRotationTranslation(dq, b.local.rot, b.local.pos);
      if (b.pindex !== -1)
        mul(w[i], w[b.pindex], dq);
      else
        mul(w[i], offset, dq);
      mul(dq, w[i], this.bind[i]);
      ii = i * 4;
      this.offsetQBuffer[ii + 0] = dq[0];
      this.offsetQBuffer[ii + 1] = dq[1];
      this.offsetQBuffer[ii + 2] = dq[2];
      this.offsetQBuffer[ii + 3] = dq[3];
      this.offsetPBuffer[ii + 0] = dq[4];
      this.offsetPBuffer[ii + 1] = dq[5];
      this.offsetPBuffer[ii + 2] = dq[6];
      this.offsetPBuffer[ii + 3] = dq[7];
    }
    return this;
  }
  // #endregion
}

class SQTSkin {
  // #region MAIN
  bind;
  world;
  // Split into 3 Buffers because THREEJS does handle mat4x3 correctly
  // Since using in Shader Uniforms, can skip the 16 byte alignment for scale + pos, store data as Vec3 instead of Vec4.
  offsetQBuffer;
  // Quaternion
  offsetPBuffer;
  // Translation
  offsetSBuffer;
  // Scale
  constructor(bindPose) {
    const bCnt = bindPose.bones.length;
    const world = new Array(bCnt);
    const bind = new Array(bCnt);
    this.offsetQBuffer = new Float32Array(4 * bCnt);
    this.offsetPBuffer = new Float32Array(3 * bCnt);
    this.offsetSBuffer = new Float32Array(3 * bCnt);
    const vScl = new Vec3(1, 1, 1);
    const vPos = new Vec3();
    const vRot = new Quat();
    for (let i = 0; i < bCnt; i++) {
      world[i] = new Transform();
      bind[i] = new Transform();
      vRot.toBuf(this.offsetQBuffer, i * 4);
      vPos.toBuf(this.offsetPBuffer, i * 3);
      vScl.toBuf(this.offsetSBuffer, i * 3);
    }
    let b;
    for (let i = 0; i < bCnt; i++) {
      b = bindPose.bones[i];
      if (b.pindex !== -1)
        world[i].fromMul(world[b.pindex], b.local);
      else
        world[i].copy(b.local);
      bind[i].fromInvert(world[i]);
    }
    this.bind = bind;
    this.world = world;
  }
  // #endregion
  // #region METHODS
  updateFromPose(pose) {
    const bOffset = new Transform();
    const w = this.world;
    let b;
    let ii = 0;
    let si = 0;
    for (let i = 0; i < pose.bones.length; i++) {
      b = pose.bones[i];
      if (b.pindex !== -1)
        w[i].fromMul(w[b.pindex], b.local);
      else
        w[i].fromMul(pose.offset, b.local);
      bOffset.fromMul(w[i], this.bind[i]);
      ii = i * 4;
      si = i * 3;
      this.offsetQBuffer[ii + 0] = bOffset.rot[0];
      this.offsetQBuffer[ii + 1] = bOffset.rot[1];
      this.offsetQBuffer[ii + 2] = bOffset.rot[2];
      this.offsetQBuffer[ii + 3] = bOffset.rot[3];
      this.offsetPBuffer[si + 0] = bOffset.pos[0];
      this.offsetPBuffer[si + 1] = bOffset.pos[1];
      this.offsetPBuffer[si + 2] = bOffset.pos[2];
      this.offsetSBuffer[si + 0] = bOffset.scl[0];
      this.offsetSBuffer[si + 1] = bOffset.scl[1];
      this.offsetSBuffer[si + 2] = bOffset.scl[2];
    }
    return this;
  }
  // #endregion
}

class IKTarget {
  tmp = new Vec3();
  // Preallocate scratch variable
  pos = new Vec3();
  // Target Position
  dir = new Vec3();
  // Target Direction
  aSwingDir = new Vec3();
  // Orientation for First Bone
  aTwistDir = new Vec3();
  isAOrient = false;
  bSwingDir = new Vec3();
  // Orientation for Last Bone
  bTwistDir = new Vec3();
  isBOrient = false;
  sqDistance = 0;
  tarMode = 0;
  polePos = new Vec3();
  poleDir = new Vec3();
  poleMode = -1;
  setDir(v) {
    this.dir.copy(v);
    return this;
  }
  // this.tarMode = 1;
  setPos(v) {
    this.pos.copy(v);
    this.tarMode = 0;
    return this;
  }
  setPolePos(v) {
    this.polePos.copy(v);
    this.poleMode = 1;
    return this;
  }
  setPoleDir(v) {
    this.poleDir.copy(v);
    this.poleMode = 0;
    return this;
  }
  setStartOrientation(swing, twist) {
    this.aSwingDir.copy(swing);
    this.aTwistDir.copy(twist);
    this.isAOrient = true;
    return this;
  }
  setEndOrientation(swing, twist) {
    this.bSwingDir.copy(swing);
    this.bTwistDir.copy(twist);
    this.isBOrient = true;
    return this;
  }
  isReachable(maxLen) {
    return this.sqDistance <= maxLen ** 2;
  }
  useRootTransform(t) {
    switch (this.tarMode) {
      case 0:
        this.dir.fromSub(this.pos, t.pos);
        this.sqDistance = this.dir.lenSqr;
        this.dir.norm();
        break;
      case 1:
        console.warn("Direction target not implemented");
        break;
    }
    switch (this.poleMode) {
      case 0:
        this.poleDir.fromCross(
          this.tmp.fromCross(this.dir, this.poleDir),
          this.dir
        ).norm();
        break;
      case 1:
        this.poleDir.fromSub(this.polePos, t.pos);
        this.poleDir.fromCross(
          this.tmp.fromCross(this.dir, this.poleDir),
          this.dir
        ).norm();
        break;
    }
    return this;
  }
}

const AxesDirections = {
  UFR: 0,
  // Aim, Chest
  RBD: 1,
  // Left Arm
  LBD: 2,
  // Right Arm
  DFL: 3
  // LEGS
};
class BoneAxes {
  // x = new Vec3( 1, 0, 0 ); // Right
  // y = new Vec3( 0, 1, 0 ); // Up      - Point
  // z = new Vec3( 0, 0, 1 ); // Forward - Twist
  ortho = new Vec3(Vec3.RIGHT);
  // X
  swing = new Vec3(Vec3.UP);
  // Y
  twist = new Vec3(Vec3.FORWARD);
  // Z
  // TODO - Delete
  applyQuatInv(q) {
    const qi = new Quat(q).invert();
    this.ortho.transformQuat(qi);
    this.swing.transformQuat(qi);
    this.twist.transformQuat(qi);
    return this;
  }
  // TODO - DELETE
  useBoneFace() {
    this.ortho.copy(Vec3.RIGHT);
    this.twist.copy(Vec3.UP);
    this.swing.copy(Vec3.FORWARD);
    return this;
  }
  setQuatDirections(q, iAxes) {
    switch (iAxes) {
      case AxesDirections.UFR:
        this.swing.fromQuat(q, Vec3.UP);
        this.twist.fromQuat(q, Vec3.FORWARD);
        this.ortho.fromQuat(q, Vec3.RIGHT);
        break;
      case AxesDirections.RBD:
        this.swing.fromQuat(q, Vec3.RIGHT);
        this.twist.fromQuat(q, Vec3.BACK);
        this.ortho.fromQuat(q, Vec3.DOWN);
        break;
      case AxesDirections.LBD:
        this.swing.fromQuat(q, Vec3.RIGHT);
        this.twist.fromQuat(q, Vec3.BACK);
        this.ortho.fromQuat(q, Vec3.DOWN);
        break;
      case AxesDirections.DFL:
        this.swing.fromQuat(q, Vec3.DOWN);
        this.twist.fromQuat(q, Vec3.FORWARD);
        this.ortho.fromQuat(q, Vec3.LEFT);
        break;
    }
    return this;
  }
}

class IKLink {
  index = -1;
  pindex = -1;
  len = 0;
  axes = new BoneAxes();
  // WorldSpace Axis Directions, My contain qi-Directions
  bind = new Transform();
  world = new Transform();
  // Temporary working transform used in IK Solvers
  constructor(bone) {
    this.index = bone.index;
    this.pindex = bone.pindex;
    this.len = bone.len;
    this.bind.copy(bone.local);
  }
}
class IKChain {
  // #region MAIN
  links = [];
  // Link collection
  len = 0;
  // Total Length of chain
  count = 0;
  // How many links in the chain
  pworld = new Transform();
  // Parent WS Transform of the root bone
  data = null;
  // Any user data can be stored here
  constructor(bones) {
    if (bones)
      this.addBones(bones);
  }
  // #endregion
  // #region GETTERS
  get axes() {
    return this.links[0].axes;
  }
  isReachable(targetPos) {
    return Vec3.distSqr(targetPos, this.links[0].world.pos) < this.len ** 2;
  }
  // #endregion
  // #region METHODS
  addBones(bones) {
    for (const b of bones) {
      this.links.push(new IKLink(b));
      this.len += b.len;
    }
    this.count = this.links.length;
    return this;
  }
  qiDirectionFromPose(pose, iAxes) {
    const qi = new Quat();
    let b;
    for (const i of this.links) {
      b = pose.bones[i.index];
      qi.fromInvert(b.world.rot);
      i.axes.setQuatDirections(qi, iAxes);
    }
    return this;
  }
  // #endregion
  // #region METHODS IK COMPOSITION
  // Compute the worldspace transform of the ROOT bone from a pose
  updateRootFromPose(pose) {
    pose.getWorldTransform(this.links[0].pindex, this.pworld);
    this.links[0].world.fromMul(
      this.pworld,
      this.links[0].bind
    );
    return this;
  }
  // Compute the tail of the chain
  computeTrailTransform(pose, out = new Transform()) {
    const lnk = this.links[this.count - 1];
    pose.getWorldTransform(lnk.index, out);
    out.addPos([0, lnk.len, 0]);
    return out;
  }
  // World transform of each bone using the link's bind transform
  resetWorld(startIdx = -1, endIdx = -1) {
    if (startIdx < 0)
      startIdx = 0;
    if (endIdx < 0)
      endIdx = this.links.length - 1;
    let lnk;
    let pWS;
    for (let i = startIdx; i <= endIdx; i++) {
      lnk = this.links[i];
      pWS = i === 0 ? this.pworld : this.links[i - 1].world;
      lnk.world.fromMul(pWS, lnk.bind);
    }
    return this;
  }
  // Update pose's bones using the chain's world transforms converted to local space.
  setLocalRotPose(pose) {
    let lnk;
    let pRot;
    for (let i = 0; i < this.links.length; i++) {
      lnk = this.links[i];
      pRot = i === 0 ? this.pworld.rot : this.links[i - 1].world.rot;
      pose.bones[lnk.index].local.rot.copy(lnk.world.rot).pmulInvert(pRot);
    }
    return this;
  }
  // #endregion
  // #region DEBUGGING
  // debug( o: any ): void{
  //     const t = this.links[ 0 ].world;
  //     const v = new Vec3();
  //     console.log( this.axes );
  //     o.pnt.add( t.pos, 0x00ff00, 1 );
  //     o.ln.add( t.pos, v.fromQuat( t.rot, this.axes.ortho ).add( t.pos ), 0xff0000 );
  //     o.ln.add( t.pos, v.fromQuat( t.rot, this.axes.swing ).add( t.pos ), 0x00ff00 );
  //     o.ln.add( t.pos, v.fromQuat( t.rot, this.axes.twist ).add( t.pos ), 0x0000ff );
  // }
  // #endregion
}

function aimChainSolver(tar, chain, _pose) {
  const cTran = chain.links[0].world;
  const tarDir = tar.dir;
  const dir = new Vec3(chain.axes.swing).transformQuat(cTran.rot);
  const rot = new Quat().fromSwing(dir, tarDir).mul(cTran.rot);
  const twistDir = new Vec3();
  const swingTwistDir = new Vec3();
  const orthDir = new Vec3();
  twistDir.copy(tar.poleDir);
  swingTwistDir.fromQuat(rot, chain.axes.twist);
  orthDir.fromCross(tarDir, twistDir);
  twistDir.fromCross(orthDir, tarDir);
  cTran.rot.fromMul(
    Quat.swing(swingTwistDir, twistDir),
    rot
  );
}

function lawcos_sss(aLen, bLen, cLen) {
  const v = (aLen ** 2 + bLen ** 2 - cLen ** 2) / (2 * aLen * bLen);
  return Math.acos(Math.min(1, Math.max(-1, v)));
}
function twoBoneSolver(tar, chain, _pose) {
  const l0 = chain.links[0];
  const l1 = chain.links[1];
  const bendAxis = Vec3.fromQuat(l0.world.rot, chain.axes.ortho);
  const cLen = Vec3.dist(l0.world.pos, tar.pos);
  let rad = lawcos_sss(l0.len, cLen, l1.len);
  l0.world.rot.pmulAxisAngle(bendAxis, -rad);
  rad = Math.PI - lawcos_sss(l0.len, l1.len, cLen);
  l1.world.rot.fromMul(l0.world.rot, l1.bind.rot).pmulAxisAngle(bendAxis, rad);
}

let Fabric$1 = class Fabric {
  static solve(tar, chain, pose) {
    const epsilon = 0.01;
    const rootPos = new Vec3();
    chain.updateRootFromPose(pose);
    tar.useRootTransform(chain.links[0].world);
    rootPos.copy(chain.links[0].world.pos);
    const pnts = this.initPointsFromBindpose(chain);
    const effector = pnts[chain.count];
    for (let i = 0; i < 10; i++) {
      this.iterateBackward(chain, tar, pnts);
      pnts[0].copy(rootPos);
      this.iterateForward(chain, pnts);
      if (Vec3.dist(tar.pos, effector) <= epsilon) {
        console.log("Done", i);
        break;
      }
    }
    this.updatePoseFromBind(chain, pnts, pose);
  }
  // #region ITERATIONS
  static iterateBackward(chain, target, pnts) {
    const dir = new Vec3();
    let pTar = pnts[chain.count].copy(target.pos);
    let lnk;
    for (let i = chain.count - 1; i >= 0; i--) {
      lnk = chain.links[i];
      dir.fromSub(pnts[i], pTar).norm().scale(lnk.len);
      pnts[i].fromAdd(dir, pTar);
      pTar = pnts[i];
    }
  }
  static iterateForward(chain, pnts) {
    const dir = new Vec3();
    let lnk;
    let p;
    let c;
    for (let i = 1; i <= chain.count; i++) {
      lnk = chain.links[i - 1];
      c = pnts[i];
      p = pnts[i - 1];
      dir.fromSub(c, p).norm().scale(lnk.len);
      c.fromAdd(dir, p);
    }
  }
  static iterateBackwardWDir(chain, target, pnts, sigK = 0, doLerp = false) {
    const cnt = chain.count - 1;
    const dir = new Vec3();
    const iDir = new Vec3(target.bSwingDir).negate();
    let pTar = pnts[chain.count].copy(target.pos);
    let lnk;
    let t;
    for (let i = cnt; i >= 0; i--) {
      lnk = chain.links[i];
      dir.fromSub(pnts[i], pTar);
      if (doLerp || i === cnt) {
        t = i / cnt;
        t = sigmoid$1(t, sigK);
        dir.fromLerp(dir, iDir, t);
      }
      dir.norm().scale(lnk.len);
      pnts[i].fromAdd(dir, pTar);
      pTar = pnts[i];
    }
  }
  static iterateForwardWDir(chain, target, pnts) {
    const dir = new Vec3();
    let lnk;
    let p;
    let c;
    for (let i = 1; i < chain.count; i++) {
      lnk = chain.links[i - 1];
      c = pnts[i];
      p = pnts[i - 1];
      dir.fromSub(c, p).norm().scale(lnk.len);
      c.fromAdd(dir, p);
    }
    lnk = chain.links[chain.count - 1];
    pnts[chain.count].fromScale(target.bSwingDir, lnk.len).add(pnts[chain.count - 1]);
  }
  // #endregion
  // #region HELPERS
  static initPointsFromBindpose(chain) {
    const pnts = new Array(chain.count + 1);
    pnts[0] = chain.links[0].world.pos.clone();
    let lnk;
    for (let i = 1; i < chain.count; i++) {
      lnk = chain.links[i];
      lnk.world.fromMul(chain.links[i - 1].world, lnk.bind);
      pnts[i] = lnk.world.pos.clone();
    }
    pnts[chain.count] = new Vec3().fromQuat(lnk.world.rot, Vec3.UP).scale(lnk.len).add(lnk.world.pos);
    return pnts;
  }
  static updatePoseFromBind(chain, pnts, pose) {
    const swing = new Quat();
    const aDir = new Vec3();
    const bDir = new Vec3();
    let lnk;
    for (let i = 0; i < chain.count; i++) {
      lnk = chain.links[i];
      lnk.world.fromMul(
        i === 0 ? chain.pworld : chain.links[i - 1].world,
        lnk.bind
      );
      aDir.fromQuat(lnk.world.rot, Vec3.UP);
      bDir.fromSub(pnts[i + 1], lnk.world.pos).norm();
      swing.fromSwing(aDir, bDir);
      lnk.world.rot.pmul(swing);
    }
    chain.setLocalRotPose(pose);
  }
  static applyTwistLerp(chain, startDir, endDir) {
    const swing = new Vec3();
    const twist = new Vec3();
    const orth = new Vec3();
    const rot = new Quat();
    const dir = new Vec3();
    let lnk;
    let t;
    for (let i = 0; i < chain.count; i++) {
      t = i / (chain.count - 1);
      lnk = chain.links[i];
      dir.fromLerp(startDir, endDir, t);
      swing.fromQuat(lnk.world.rot, lnk.axes.swing);
      twist.fromQuat(lnk.world.rot, lnk.axes.twist);
      orth.fromCross(swing, dir);
      dir.fromCross(orth, swing).norm();
      if (Math.abs(Vec3.dot(twist, dir)) >= 0.999)
        continue;
      rot.fromSwing(twist, dir);
      lnk.world.rot.pmul(rot);
    }
  }
  // #endregion
};
function sigmoid$1(t, k = 0) {
  return (t - k * t) / (k - 2 * k * Math.abs(t) + 1);
}

function limbSolver(target, chain, pose) {
  chain.updateRootFromPose(pose);
  target.useRootTransform(chain.links[0].world);
  aimChainSolver(target, chain);
  if (target.isReachable(chain.len)) {
    twoBoneSolver(target, chain);
  } else {
    chain.resetWorld(1);
  }
  chain.setLocalRotPose(pose);
}

class Fabric {
  static solve(tar, chain, pose) {
    const epsilon = 0.01;
    const rootPos = new Vec3();
    chain.updateRootFromPose(pose);
    tar.useRootTransform(chain.links[0].world);
    rootPos.copy(chain.links[0].world.pos);
    const pnts = this.initPointsFromBindpose(chain);
    const effector = pnts[chain.count];
    for (let i = 0; i < 10; i++) {
      this.iterateBackward(chain, tar, pnts);
      pnts[0].copy(rootPos);
      this.iterateForward(chain, pnts);
      if (Vec3.dist(tar.pos, effector) <= epsilon) {
        console.log("Done", i);
        break;
      }
    }
    this.updatePoseFromBind(chain, pnts, pose);
  }
  // #region ITERATIONS
  static iterateBackward(chain, target, pnts) {
    const dir = new Vec3();
    let pTar = pnts[chain.count].copy(target.pos);
    let lnk;
    for (let i = chain.count - 1; i >= 0; i--) {
      lnk = chain.links[i];
      dir.fromSub(pnts[i], pTar).norm().scale(lnk.len);
      pnts[i].fromAdd(dir, pTar);
      pTar = pnts[i];
    }
  }
  static iterateForward(chain, pnts) {
    const dir = new Vec3();
    let lnk;
    let p;
    let c;
    for (let i = 1; i <= chain.count; i++) {
      lnk = chain.links[i - 1];
      c = pnts[i];
      p = pnts[i - 1];
      dir.fromSub(c, p).norm().scale(lnk.len);
      c.fromAdd(dir, p);
    }
  }
  static iterateBackwardWDir(chain, target, pnts, sigK = 0, doLerp = false) {
    const cnt = chain.count - 1;
    const dir = new Vec3();
    const iDir = new Vec3(target.bSwingDir).negate();
    let pTar = pnts[chain.count].copy(target.pos);
    let lnk;
    let t;
    for (let i = cnt; i >= 0; i--) {
      lnk = chain.links[i];
      dir.fromSub(pnts[i], pTar);
      if (doLerp || i === cnt) {
        t = i / cnt;
        t = sigmoid(t, sigK);
        dir.fromLerp(dir, iDir, t);
      }
      dir.norm().scale(lnk.len);
      pnts[i].fromAdd(dir, pTar);
      pTar = pnts[i];
    }
  }
  static iterateForwardWDir(chain, target, pnts) {
    const dir = new Vec3();
    let lnk;
    let p;
    let c;
    for (let i = 1; i < chain.count; i++) {
      lnk = chain.links[i - 1];
      c = pnts[i];
      p = pnts[i - 1];
      dir.fromSub(c, p).norm().scale(lnk.len);
      c.fromAdd(dir, p);
    }
    lnk = chain.links[chain.count - 1];
    pnts[chain.count].fromScale(target.bSwingDir, lnk.len).add(pnts[chain.count - 1]);
  }
  // #endregion
  // #region HELPERS
  static initPointsFromBindpose(chain) {
    const pnts = new Array(chain.count + 1);
    pnts[0] = chain.links[0].world.pos.clone();
    let lnk;
    for (let i = 1; i < chain.count; i++) {
      lnk = chain.links[i];
      lnk.world.fromMul(chain.links[i - 1].world, lnk.bind);
      pnts[i] = lnk.world.pos.clone();
    }
    pnts[chain.count] = new Vec3().fromQuat(lnk.world.rot, Vec3.UP).scale(lnk.len).add(lnk.world.pos);
    return pnts;
  }
  static updatePoseFromBind(chain, pnts, pose) {
    const swing = new Quat();
    const aDir = new Vec3();
    const bDir = new Vec3();
    let lnk;
    for (let i = 0; i < chain.count; i++) {
      lnk = chain.links[i];
      lnk.world.fromMul(
        i === 0 ? chain.pworld : chain.links[i - 1].world,
        lnk.bind
      );
      aDir.fromQuat(lnk.world.rot, Vec3.UP);
      bDir.fromSub(pnts[i + 1], lnk.world.pos).norm();
      swing.fromSwing(aDir, bDir);
      lnk.world.rot.pmul(swing);
    }
    chain.setLocalRotPose(pose);
  }
  static applyTwistLerp(chain, startDir, endDir) {
    const swing = new Vec3();
    const twist = new Vec3();
    const orth = new Vec3();
    const rot = new Quat();
    const dir = new Vec3();
    let lnk;
    let t;
    for (let i = 0; i < chain.count; i++) {
      t = i / (chain.count - 1);
      lnk = chain.links[i];
      dir.fromLerp(startDir, endDir, t);
      swing.fromQuat(lnk.world.rot, lnk.axes.swing);
      twist.fromQuat(lnk.world.rot, lnk.axes.twist);
      orth.fromCross(swing, dir);
      dir.fromCross(orth, swing).norm();
      if (Math.abs(Vec3.dot(twist, dir)) >= 0.999)
        continue;
      rot.fromSwing(twist, dir);
      lnk.world.rot.pmul(rot);
    }
  }
  // #endregion
}
function sigmoid(t, k = 0) {
  return (t - k * t) / (k - 2 * k * Math.abs(t) + 1);
}

function fabrikSolver(target, chain, pose, props) {
  const pp = Object.assign({
    sigmoidK: 0,
    epsilon: 1e-3
  }, props);
  chain.updateRootFromPose(pose);
  target.useRootTransform(chain.links[0].world);
  const pnts = Fabric.initPointsFromBindpose(chain);
  const effector = pnts[chain.count];
  const anchor = chain.links[0].world.pos.clone();
  if (target.isAOrient && target.isBOrient) {
    for (let i = 0; i < 10; i++) {
      Fabric.iterateBackwardWDir(chain, target, pnts, props?.sigmoidK, !!(i === 0));
      pnts[0].copy(anchor);
      Fabric.iterateForwardWDir(chain, target, pnts);
      if (Vec3.dist(target.pos, effector) <= pp.epsilon) {
        console.log("Done", i);
        break;
      }
    }
    Fabric.applyTwistLerp(chain, target.aTwistDir, target.bTwistDir);
  } else {
    for (let i = 0; i < 10; i++) {
      Fabric.iterateBackward(chain, target, pnts);
      pnts[0].copy(anchor);
      Fabric.iterateForward(chain, pnts);
      if (Vec3.dist(target.pos, effector) <= pp.epsilon) {
        console.log("Done", i);
        break;
      }
    }
  }
  Fabric.updatePoseFromBind(chain, pnts, pose);
}

class Maths {
  // #region CONSTANTS
  static TAU = 6.283185307179586;
  // PI * 2
  static PI_H = 1.5707963267948966;
  static TAU_INV = 1 / 6.283185307179586;
  static PI_Q = 0.7853981633974483;
  static PI_Q3 = 1.5707963267948966 + 0.7853981633974483;
  static PI_270 = Math.PI + 1.5707963267948966;
  static DEG2RAD = 0.01745329251;
  // PI / 180
  static RAD2DEG = 57.2957795131;
  // 180 / PI
  static EPSILON = 1e-6;
  static PHI = 1.618033988749895;
  // Goldren Ratio, (1 + sqrt(5)) / 2
  //#endregion
  // #region OPERATIONS
  static clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }
  static clampGrad(v) {
    return Math.max(-1, Math.min(1, v));
  }
  static saturate(v) {
    return Math.max(0, Math.min(1, v));
  }
  static fract(f) {
    return f - Math.floor(f);
  }
  static nearZero(v) {
    return Math.abs(v) <= Maths.EPSILON ? 0 : v;
  }
  static dotToDeg(dot) {
    return Math.acos(Maths.clampGrad(dot)) * Maths.RAD2DEG;
  }
  static remap(x, xMin, xMax, zMin, zMax) {
    return (x - xMin) / (xMax - xMin) * (zMax - zMin) + zMin;
  }
  static snap(x, step) {
    return Math.floor(x / step) * step;
  }
  static norm(min, max, v) {
    return (v - min) / (max - min);
  }
  // Modulas that handles Negatives ex "Maths.mod( -1, 5 ) = 4
  static mod(a, b) {
    const v = a % b;
    return v < 0 ? b + v : v;
  }
  static lerp(a, b, t) {
    return a * (1 - t) + b * t;
  }
  // Logarithmic Interpolation
  static eerp(a, b, t) {
    return a * (b / a) ** t;
  }
  // Move value to the closest step
  static roundStep(value, step) {
    return Math.round(value / step) * step;
  }
  // https://docs.unity3d.com/ScriptReference/Mathf.SmoothDamp.html
  // https://github.com/Unity-Technologies/UnityCsReference/blob/a2bdfe9b3c4cd4476f44bf52f848063bfaf7b6b9/Runtime/Export/Math/Mathf.cs#L308
  static smoothDamp(cur, tar, vel, dt, smoothTime = 1e-4, maxSpeed = Infinity) {
    smoothTime = Math.max(1e-4, smoothTime);
    const omega = 2 / smoothTime;
    const x = omega * dt;
    const exp = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x);
    let change = cur - tar;
    const maxChange = maxSpeed * smoothTime;
    change = Math.min(maxChange, Math.max(change, -maxChange));
    const temp = (vel + omega * change) * dt;
    vel = (vel - omega * temp) * exp;
    let val = cur - change + (change + temp) * exp;
    if (tar - cur > 0 && val > tar) {
      val = tar;
      vel = 0;
    }
    return [val, vel];
  }
  // #endregion
}

class Heap {
  // #region MAIN
  items = [];
  compare;
  constructor(fnCompare) {
    this.compare = fnCompare;
  }
  // #endregion
  // #region GETTERS
  get length() {
    return this.items.length;
  }
  // #endregion
  // #region METHODS
  /** Add item to the heap which will then get stored into the correct spot */
  add(n) {
    const idx = this.items.length;
    this.items.push(n);
    if (idx !== 0)
      this.bubbleUp(idx);
    return this;
  }
  /** Remove item from heap, if no index is set then it pops off the first item */
  remove(idx = 0) {
    if (this.items.length === 0)
      return void 0;
    const i = this.items.length - 1;
    const rmItem = this.items[idx];
    const lastItem = this.items.pop();
    if (idx === i || this.items.length === 0 || lastItem === void 0)
      return rmItem;
    this.items[idx] = lastItem;
    this.bubbleDown(idx);
    return rmItem;
  }
  /** Pass in a task reference to find & remove it from heap */
  removeItem(itm) {
    const idx = this.items.indexOf(itm);
    if (idx !== -1) {
      this.remove(idx);
      return true;
    }
    return false;
  }
  // #endregion
  // #region SHIFTING
  /** Will move item down the tree by swopping the parent with one 
      of it's 2 children when conditions are met */
  bubbleDown(idx) {
    const ary = this.items;
    const len = ary.length;
    const itm = ary[idx];
    let lft = 0;
    let rit = 0;
    let mov = -1;
    while (idx < len) {
      lft = idx * 2 + 1;
      rit = idx * 2 + 2;
      mov = -1;
      if (lft < len && this.compare(ary[lft], itm))
        mov = lft;
      if (rit < len && this.compare(ary[rit], itm)) {
        if (mov === -1 || this.compare(ary[rit], ary[lft]))
          mov = rit;
      }
      if (mov === -1)
        break;
      [ary[idx], ary[mov]] = // Swop
      [ary[mov], ary[idx]];
      idx = mov;
    }
    return this;
  }
  /** Will move item up the tree by swopping with it's parent if conditions are met */
  bubbleUp(idx) {
    const ary = this.items;
    let pidx;
    while (idx > 0) {
      pidx = Math.floor((idx - 1) / 2);
      if (!this.compare(ary[idx], ary[pidx]))
        break;
      [ary[idx], ary[pidx]] = // Swop
      [ary[pidx], ary[idx]];
      idx = pidx;
    }
    return this;
  }
  // #endregion
}

class AnimationTask {
  remainingTime;
  elapsedTime;
  duration;
  onUpdate;
  constructor(durationSec, fnOnUpdate) {
    this.duration = durationSec;
    this.remainingTime = durationSec;
    this.elapsedTime = 0;
    this.onUpdate = fnOnUpdate;
  }
  get normTime() {
    return Math.min(1, Math.max(0, this.elapsedTime / this.duration));
  }
}
class AnimationQueue {
  // #region MAIN
  queue = new Heap((a, b) => a.remainingTime < b.remainingTime);
  // #endregion
  addTask(duration, fn) {
    this.enqueue(new AnimationTask(duration, fn));
    return this;
  }
  enqueue(task) {
    this.queue.add(task);
    return this;
  }
  // dequeue(){}
  update(dt) {
    if (this.queue.length === 0)
      return;
    for (const task of this.queue.items) {
      task.elapsedTime += dt;
      task.remainingTime = task.duration - task.elapsedTime;
      try {
        task.onUpdate(task);
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error("Error running an animation task:", msg);
      }
    }
    while (this.queue.length > 0 && this.queue.items[0].remainingTime <= 0) {
      this.queue.remove();
    }
  }
}

class Easing {
  //-----------------------------------------------
  static quadIn(k) {
    return k * k;
  }
  static quadOut(k) {
    return k * (2 - k);
  }
  static quadInOut(k) {
    if ((k *= 2) < 1)
      return 0.5 * k * k;
    return -0.5 * (--k * (k - 2) - 1);
  }
  //-----------------------------------------------
  static cubicIn(k) {
    return k * k * k;
  }
  static cubicOut(k) {
    return --k * k * k + 1;
  }
  static cubicInOut(k) {
    if ((k *= 2) < 1)
      return 0.5 * k * k * k;
    return 0.5 * ((k -= 2) * k * k + 2);
  }
  //-----------------------------------------------
  static quartIn(k) {
    return k * k * k * k;
  }
  static quartOut(k) {
    return 1 - --k * k * k * k;
  }
  static quartInOut(k) {
    if ((k *= 2) < 1)
      return 0.5 * k * k * k * k;
    return -0.5 * ((k -= 2) * k * k * k - 2);
  }
  //-----------------------------------------------
  static quintIn(k) {
    return k * k * k * k * k;
  }
  static quintOut(k) {
    return --k * k * k * k * k + 1;
  }
  static quintInOut(k) {
    if ((k *= 2) < 1)
      return 0.5 * k * k * k * k * k;
    return 0.5 * ((k -= 2) * k * k * k * k + 2);
  }
  //-----------------------------------------------
  static sineIn(k) {
    return 1 - Math.cos(k * Math.PI / 2);
  }
  static sineOut(k) {
    return Math.sin(k * Math.PI / 2);
  }
  static sineInOut(k) {
    return 0.5 * (1 - Math.cos(Math.PI * k));
  }
  //-----------------------------------------------
  static expIn(k) {
    return k === 0 ? 0 : Math.pow(1024, k - 1);
  }
  static expOut(k) {
    return k === 1 ? 1 : 1 - Math.pow(2, -10 * k);
  }
  static exp_nOut(k) {
    if (k === 0 || k === 1)
      return k;
    if ((k *= 2) < 1)
      return 0.5 * Math.pow(1024, k - 1);
    return 0.5 * (-Math.pow(2, -10 * (k - 1)) + 2);
  }
  //-----------------------------------------------
  static circIn(k) {
    return 1 - Math.sqrt(1 - k * k);
  }
  static circOut(k) {
    return Math.sqrt(1 - --k * k);
  }
  static circInOut(k) {
    if ((k *= 2) < 1)
      return -0.5 * (Math.sqrt(1 - k * k) - 1);
    return 0.5 * (Math.sqrt(1 - (k -= 2) * k) + 1);
  }
  //-----------------------------------------------
  static elasticIn(k) {
    if (k === 0 || k === 1)
      return k;
    return -Math.pow(2, 10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI);
  }
  static elasticOut(k) {
    if (k === 0 || k === 1)
      return k;
    return Math.pow(2, -10 * k) * Math.sin((k - 0.1) * 5 * Math.PI) + 1;
  }
  static elasticInOut(k) {
    if (k === 0 || k === 1)
      return k;
    k *= 2;
    if (k < 1)
      return -0.5 * Math.pow(2, 10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI);
    return 0.5 * Math.pow(2, -10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI) + 1;
  }
  //-----------------------------------------------
  static backIn(k) {
    return k * k * ((1.70158 + 1) * k - 1.70158);
  }
  static backOut(k) {
    return --k * k * ((1.70158 + 1) * k + 1.70158) + 1;
  }
  static backInOut(k) {
    const s = 1.70158 * 1.525;
    if ((k *= 2) < 1)
      return 0.5 * (k * k * ((s + 1) * k - s));
    return 0.5 * ((k -= 2) * k * ((s + 1) * k + s) + 2);
  }
  //-----------------------------------------------
  static bounceIn(k) {
    return 1 - Easing.bounceOut(1 - k);
  }
  static bounceOut(k) {
    if (k < 1 / 2.75)
      return 7.5625 * k * k;
    else if (k < 2 / 2.75)
      return 7.5625 * (k -= 1.5 / 2.75) * k + 0.75;
    else if (k < 2.5 / 2.75)
      return 7.5625 * (k -= 2.25 / 2.75) * k + 0.9375;
    else
      return 7.5625 * (k -= 2.625 / 2.75) * k + 0.984375;
  }
  static bounce_InOut(k) {
    if (k < 0.5)
      return Easing.bounceIn(k * 2) * 0.5;
    return Easing.bounceOut(k * 2 - 1) * 0.5 + 0.5;
  }
  //-----------------------------------------------
  // EXTRAS
  static smoothTStep(t) {
    return t * t * (3 - 2 * t);
  }
  static sigmoid(t, k = 0) {
    return (t - k * t) / (k - 2 * k * Math.abs(t) + 1);
  }
  static bellCurve(t) {
    return (Math.sin(2 * Math.PI * (t - 0.25)) + 1) * 0.5;
  }
  /** a = 1.5, 2, 4, 9 */
  static betaDistCurve(t, a) {
    return 4 ** a * (t * (1 - t)) ** a;
  }
  static bouncy(t, jump = 6, offset = 1) {
    const rad = 6.283185307179586 * t;
    return (offset + Math.sin(rad)) / 2 * Math.sin(jump * rad);
  }
  /** bounce ease out */
  static bounce(t) {
    return (Math.sin(t * Math.PI * (0.2 + 2.5 * t * t * t)) * Math.pow(1 - t, 2.2) + t) * (1 + 1.2 * (1 - t));
  }
}

const EventType = {
  Frame: 0,
  Time: 1
};
const LerpType = {
  Step: 0,
  Linear: 1,
  Cubic: 2
};

class QuatBuffer {
  // #region MAIN
  buf;
  result = new Quat();
  constructor(buf) {
    this.buf = buf;
  }
  // #endregion
  // #region GETTERS
  get(i, out = this.result) {
    i *= 4;
    out[0] = this.buf[i + 0];
    out[1] = this.buf[i + 1];
    out[2] = this.buf[i + 2];
    out[3] = this.buf[i + 3];
    return out;
  }
  // #endregion
  // #region INTERPOLATION
  nblend(ai, bi, t, out = this.result) {
    ai *= 4;
    bi *= 4;
    const ary = this.buf;
    const a_x = ary[ai + 0];
    const a_y = ary[ai + 1];
    const a_z = ary[ai + 2];
    const a_w = ary[ai + 3];
    const b_x = ary[bi + 0];
    const b_y = ary[bi + 1];
    const b_z = ary[bi + 2];
    const b_w = ary[bi + 3];
    const dot = a_x * b_x + a_y * b_y + a_z * b_z + a_w * b_w;
    const ti = 1 - t;
    const s = dot < 0 ? -1 : 1;
    out[0] = ti * a_x + t * b_x * s;
    out[1] = ti * a_y + t * b_y * s;
    out[2] = ti * a_z + t * b_z * s;
    out[3] = ti * a_w + t * b_w * s;
    return out.norm();
  }
  slerp(ai, bi, t, out = this.result) {
    ai *= 4;
    bi *= 4;
    const ary = this.buf;
    const ax = ary[ai + 0], ay = ary[ai + 1], az = ary[ai + 2], aw = ary[ai + 3];
    let bx = ary[bi + 0], by = ary[bi + 1], bz = ary[bi + 2], bw = ary[bi + 3];
    let omega, cosom, sinom, scale0, scale1;
    cosom = ax * bx + ay * by + az * bz + aw * bw;
    if (cosom < 0) {
      cosom = -cosom;
      bx = -bx;
      by = -by;
      bz = -bz;
      bw = -bw;
    }
    if (1 - cosom > 1e-6) {
      omega = Math.acos(cosom);
      sinom = Math.sin(omega);
      scale0 = Math.sin((1 - t) * omega) / sinom;
      scale1 = Math.sin(t * omega) / sinom;
    } else {
      scale0 = 1 - t;
      scale1 = t;
    }
    out[0] = scale0 * ax + scale1 * bx;
    out[1] = scale0 * ay + scale1 * by;
    out[2] = scale0 * az + scale1 * bz;
    out[3] = scale0 * aw + scale1 * bw;
    return out;
  }
  // #endregion
}

class TrackQuat {
  // #region MAIN
  boneIndex = -1;
  // Bine index in skeleton this track will animate
  timeIndex = -1;
  // Which timestamp array it uses.
  lerpType = LerpType.Linear;
  values;
  // Flat data of animation
  vbuf;
  // Quat wrapper over flat data
  constructor(lerpType = LerpType.Linear) {
    this.lerpType = lerpType;
  }
  // #endregion
  // #region SETTERS
  setData(data) {
    this.values = new Float32Array(data);
    this.vbuf = new QuatBuffer(this.values);
    return this;
  }
  // #endregion
  // #region METHODS
  apply(pose, fi) {
    switch (this.lerpType) {
      case LerpType.Step:
        pose.setLocalRot(this.boneIndex, this.vbuf.get(fi.kB));
        break;
      case LerpType.Linear:
        this.vbuf.nblend(fi.kB, fi.kC, fi.t);
        pose.setLocalRot(this.boneIndex, this.vbuf.result);
        break;
      default:
        console.log("QuatTrack - unknown lerp type");
        break;
    }
    return this;
  }
  // #endregion
}

class Vec3Buffer {
  // #region MAIN
  buf;
  result = new Vec3();
  constructor(buf) {
    this.buf = buf;
  }
  // #endregion
  // #region GETTERS
  get(i, out = this.result) {
    i *= 3;
    out[0] = this.buf[i + 0];
    out[1] = this.buf[i + 1];
    out[2] = this.buf[i + 2];
    return out;
  }
  // #endregion
  // #region INTERPOLATION
  lerp(ai, bi, t, out = this.result) {
    const ary = this.buf;
    const ti = 1 - t;
    ai *= 3;
    bi *= 3;
    out[0] = ti * ary[ai + 0] + t * ary[bi + 0];
    out[1] = ti * ary[ai + 1] + t * ary[bi + 1];
    out[2] = ti * ary[ai + 2] + t * ary[bi + 2];
    return out;
  }
  // #endregion
}

class TrackVec3 {
  // #region MAIN
  boneIndex = -1;
  // Bine index in skeleton this track will animate
  timeIndex = -1;
  // Which timestamp array it uses.
  lerpType = LerpType.Linear;
  values;
  // Flat data of animation
  vbuf;
  // Vec3 wrapper over flat data
  constructor(lerpType = LerpType.Linear) {
    this.lerpType = lerpType;
  }
  // #endregion
  // #region SETTERS
  setData(data) {
    this.values = new Float32Array(data);
    this.vbuf = new Vec3Buffer(this.values);
    return this;
  }
  // #endregion
  // #region METHODS
  apply(pose, fi) {
    switch (this.lerpType) {
      case LerpType.Step:
        pose.setLocalPos(this.boneIndex, this.vbuf.get(fi.kB));
        break;
      case LerpType.Linear:
        pose.setLocalPos(this.boneIndex, this.vbuf.lerp(fi.kB, fi.kC, fi.t));
        break;
      default:
        console.log("Vec3Track - unknown lerp type", this.lerpType);
        break;
    }
    return this;
  }
  // #endregion
}

class AnimationEvent {
  name = "";
  type = EventType.Frame;
  start = -1;
  // Starting Frame or Time
  duration = -1;
  // How many frames or seconds this event lasts
  constructor(name, start = 0, eventType = EventType.Frame, duration = -1) {
    this.name = name;
    this.start = start;
    this.duration = duration;
    this.type = eventType;
  }
}

class RootMotion {
  // #region MAIN
  values;
  // Flat array of positions for each frame
  vbuf;
  //
  frameCount = 0;
  // How many frames worth of data exists
  timeStampIdx = -1;
  // Which time stamp to be used by root motion
  p0 = [0, 0, 0];
  // Preallocate vec objects so no need to reallocated every frame.
  p1 = [0, 0, 0];
  result = [0, 0, 0];
  constructor(data) {
    this.values = data;
    this.vbuf = new Vec3Buffer(this.values);
    this.frameCount = data.length / 3;
  }
  // #endregion
  getBetweenFrames(f0, t0, f1, t1) {
    const p0 = this.p0;
    const p1 = this.p1;
    const rtn = this.result;
    if (f0 > f1) {
      if (f0 + 1 < this.frameCount) {
        this.vbuf.get(this.frameCount - 1, p1);
        this.vbuf.lerp(f0, f0 + 1, t0, p0);
        p0[0] = p1[0] - p0[0];
        p0[1] = p1[1] - p0[1];
        p0[2] = p1[2] - p0[2];
      } else {
        p0[0] = 0;
        p0[1] = 0;
        p0[2] = 0;
      }
      this.vbuf.lerp(f1, f1 + 1, t1, p1);
      rtn[0] = p0[0] + p1[0];
      rtn[1] = p0[1] + p1[1];
      rtn[2] = p0[2] + p1[2];
      return rtn;
    }
    this.vbuf.lerp(f0, f0 + 1, t0, p0);
    if (f1 + 1 < this.frameCount)
      this.vbuf.lerp(f1, f1 + 1, t1, p1);
    else
      this.vbuf.get(f1, p1);
    rtn[0] = p1[0] - p0[0];
    rtn[1] = p1[1] - p0[1];
    rtn[2] = p1[2] - p0[2];
    return rtn;
  }
}

class Clip {
  // #region MAIN
  name = "";
  // Clip Name
  frameCount = 0;
  // Total frames in animation
  duration = 0;
  // Total animation time
  timeStamps = [];
  // Different sets of shared time stamps
  tracks = [];
  // Collection of animations broke out as Rotation, Position & Scale
  events = void 0;
  // Collection of animation events
  rootMotion = void 0;
  // Root motion for this animation
  isLooped = true;
  // Is the animation to run in a loop
  constructor(name = "") {
    this.name = name;
  }
  // #endregion
  // #region EVENTS
  addEvent(name, start, eventType = EventType.Frame, duration = -1) {
    if (!this.events)
      this.events = [];
    this.events.push(new AnimationEvent(name, start, eventType, duration));
    return this;
  }
  setRootMotionData(data) {
    const rm = new RootMotion(data);
    for (let i = 0; i < this.timeStamps.length; i++) {
      if (this.timeStamps[i].length === rm.frameCount) {
        rm.timeStampIdx = i;
        break;
      }
    }
    this.rootMotion = rm;
    return this;
  }
  // #endregion
  // #region METHODS
  timeAtFrame(f) {
    if (f >= 0 && f < this.frameCount) {
      for (const ts of this.timeStamps) {
        if (ts.length === this.frameCount)
          return ts[f];
      }
    }
    return -1;
  }
  // #endregion
  // #region DEBUG
  debugInfo(arm) {
    const pose = arm?.bindPose;
    const lerpKeys = Object.keys(LerpType);
    const getLerpName = (v) => lerpKeys.find((k) => LerpType[k] === v);
    let bName = "";
    let trackType = "";
    console.log(
      "Clip Name [ %s ] 	 Track Count [ %d ] 	 Max frames [ %d ]",
      this.name,
      this.tracks.length,
      this.frameCount
    );
    for (const t of this.tracks) {
      if (pose)
        bName = pose.bones[t.boneIndex].name;
      if (t instanceof TrackQuat)
        trackType = "quat";
      else if (t instanceof TrackVec3)
        trackType = "vec3";
      else
        trackType = "Unknown";
      console.log(
        "Bone [ %s ] 	 Type [ %s ] 	 Lerp Type [ %s ] 	 Frames [ %d ]",
        bName,
        trackType,
        getLerpName(t.lerpType),
        this.timeStamps[t.timeIndex].length
      );
    }
  }
  // #endregion
}

class PoseAnimator {
  // #region MAIN
  isRunning = false;
  clip = void 0;
  // Animation Clip
  clock = 0;
  // Animation Clock
  fInfo = [];
  // Clips can have multiple Timestamps
  scale = 1;
  // Scale the speed of the animation
  onEvent = void 0;
  //
  eventCache = void 0;
  placementMask = [0, 1, 0];
  // Used when inPlace is turned on. Set what to reset.
  // #endregion
  // #region SETTERS
  setClip(clip) {
    this.clip = clip;
    this.clock = 0;
    this.fInfo.length = 0;
    for (let i = 0; i < clip.timeStamps.length; i++) {
      this.fInfo.push(new FrameInfo());
    }
    if (clip.events && !this.eventCache) {
      this.eventCache = /* @__PURE__ */ new Map();
    }
    this.computeFrameInfo();
    return this;
  }
  setScale(s) {
    this.scale = s;
    return this;
  }
  // #endregion
  // #region FRAME CONTROLS
  step(dt) {
    if (this.clip && this.isRunning) {
      const tick = dt * this.scale;
      if (!this.clip.isLooped && this.clock + tick >= this.clip.duration) {
        this.clock = this.clip.duration;
        this.isRunning = false;
      } else {
        if (this.clock + tick >= this.clip.duration) {
          this.eventCache?.clear();
        }
        this.clock = (this.clock + tick) % this.clip.duration;
      }
      this.computeFrameInfo();
      if (this.clip.events && this.onEvent) {
        this.checkEvents();
      }
    }
    return this;
  }
  atTime(t) {
    if (this.clip) {
      this.clock = t % this.clip.duration;
      this.computeFrameInfo();
    }
    return this;
  }
  atFrame(n) {
    if (!this.clip)
      return this;
    n = Math.max(0, Math.min(this.clip.frameCount, n));
    const tsAry = this.clip.timeStamps;
    const fiAry = this.fInfo;
    let tsLen;
    let ts;
    let fi;
    for (let i = 0; i < tsAry.length; i++) {
      ts = tsAry[i];
      fi = fiAry[i];
      tsLen = ts.length - 1;
      fi.t = 0;
      fi.kA = n <= tsLen ? n : tsLen;
      fi.kB = fi.kA;
      fi.kC = fi.kA;
      fi.kD = fi.kA;
    }
    return this;
  }
  // #endregion
  // #region METHODS
  start() {
    this.isRunning = true;
    return this;
  }
  stop() {
    this.isRunning = false;
    return this;
  }
  usePlacementReset(mask = [0, 1, 0]) {
    this.placementMask = mask;
    return this;
  }
  updatePose(pose) {
    if (this.clip) {
      let t;
      for (t of this.clip.tracks) {
        t.apply(pose, this.fInfo[t.timeIndex]);
      }
    }
    if (this.placementMask) {
      pose.bones[0].local.pos.mul(this.placementMask);
    }
    return this;
  }
  getMotion() {
    const rm = this?.clip?.rootMotion;
    if (rm) {
      const fi = this.fInfo[rm.timeStampIdx];
      return rm.getBetweenFrames(fi.pkB, fi.pt, fi.kB, fi.t);
    }
    return null;
  }
  // #endregion
  // #region INTERNAL METHODS
  computeFrameInfo() {
    if (!this.clip)
      return;
    const time = this.clock;
    let fi;
    let ts;
    let imin;
    let imax;
    let imid;
    for (let i = 0; i < this.fInfo.length; i++) {
      fi = this.fInfo[i];
      if (this.clip.timeStamps[i].length === 0) {
        fi.singleFrame();
        continue;
      }
      ts = this.clip.timeStamps[i];
      fi.pkB = Math.max(fi.kB, 0);
      fi.pt = fi.t;
      if (time < ts[fi.kB] || time > ts[fi.kC] || fi.kB === -1) {
        imin = 0;
        imax = ts.length - 1;
        while (imin < imax) {
          imid = imin + imax >>> 1;
          if (time < ts[imid])
            imax = imid;
          else
            imin = imid + 1;
        }
        if (imax <= 0) {
          fi.kB = 0;
          fi.kC = 1;
        } else {
          fi.kB = imax - 1;
          fi.kC = imax;
        }
        fi.kA = Maths.mod(fi.kB - 1, ts.length);
        fi.kD = Maths.mod(fi.kC + 1, ts.length);
      }
      fi.t = (time - ts[fi.kB]) / (ts[fi.kC] - ts[fi.kB]);
    }
  }
  checkEvents() {
    if (!this?.clip?.events || !this.onEvent)
      return;
    for (const fi of this.fInfo) {
      for (const evt of this.clip.events) {
        if (evt.start >= fi.pkB && evt.start < fi.kB && !this.eventCache?.get(evt.name)) {
          this.eventCache?.set(evt.name, true);
          try {
            this.onEvent(evt.name);
          } catch (err) {
            const msg = err instanceof Error ? err.message : String(err);
            console.error("Error while calling animation event callback:", msg);
          }
          break;
        }
      }
    }
  }
  // #endregion
}
class FrameInfo {
  t = 0;
  // Lerp Time
  kA = -1;
  // Keyframe Pre Tangent
  kB = -1;
  // Keyframe Lerp Start
  kC = -1;
  // Keyframe Lerp End
  kD = -1;
  // Keyframe Post Tangent
  pkB = 0;
  // Previous Lerp Start
  pt = 0;
  // Previous Lerp Time
  // Set info for single frame timeStamp
  singleFrame() {
    this.t = 1;
    this.kA = 0;
    this.kB = -1;
    this.kC = -1;
    this.kD = 0;
    this.pkB = 0;
    this.pt = 0;
  }
}

class BoneLink {
  // #region MAIN
  srcIndex = -1;
  // Bone index in source tpose
  tarIndex = -1;
  // Bone index in target tpose
  qSrcParent = new Quat();
  // Cache the bone's parent worldspace quat
  qDotCheck = new Quat();
  // Cache the src bone worldspace quat for DOT Check
  qSrcToTar = new Quat();
  // Handles transformation from Src WS to Tar WS
  qTarParent = new Quat();
  // Cache tpose parent ws rotation, to make it easy to transform Tar WS to Tar LS
  constructor(srcIdx, tarIdx) {
    this.srcIndex = srcIdx;
    this.tarIndex = tarIdx;
  }
  // #endregion
  bind(src, tar) {
    const srcBone = src.bones[this.srcIndex];
    const tarBone = tar.bones[this.tarIndex];
    this.qDotCheck.copy(srcBone.world.rot);
    this.qSrcParent.copy(
      srcBone.pindex !== -1 ? src.bones[srcBone.pindex].world.rot : src.offset.rot
    );
    this.qTarParent.fromInvert(
      tarBone.pindex !== -1 ? tar.bones[tarBone.pindex].world.rot : tar.offset.rot
    );
    this.qSrcToTar.fromInvert(srcBone.world.rot).mul(tarBone.world.rot);
    return this;
  }
}
class Retarget {
  // #region MAIN
  animator = new PoseAnimator();
  links = /* @__PURE__ */ new Map();
  srcPose;
  tarPose;
  srcHip = new Vec3();
  tarHip = new Vec3();
  hipScale = 1;
  // #endregion
  // #region BINDING
  bindTPoses(src, tar) {
    this.srcPose = src.clone();
    this.tarPose = tar.clone();
    const srcBonemap = new BoneMap(src);
    const tarBonemap = new BoneMap(tar);
    let tarBone;
    for (const [key, srcBone] of srcBonemap.bones) {
      tarBone = tarBonemap.bones.get(key);
      if (!tarBone)
        continue;
      if (tarBone.isChain || srcBone.isChain) {
        const srcMax = srcBone.count - 1;
        const tarMax = tarBone.count - 1;
        this.links.set(
          key + "_first",
          new BoneLink(srcBone.index, tarBone.index).bind(src, tar)
        );
        this.links.set(
          key + "_last",
          new BoneLink(
            srcBone.items[srcMax].index,
            tarBone.items[tarMax].index
          ).bind(src, tar)
        );
        for (let i = 1; i <= Math.min(srcMax - 1, tarMax - 1); i++) {
          this.links.set(
            key + "_" + i,
            new BoneLink(
              srcBone.items[i].index,
              tarBone.items[i].index
            ).bind(src, tar)
          );
        }
      } else {
        this.links.set(
          key,
          new BoneLink(srcBone.index, tarBone.index).bind(src, tar)
        );
      }
    }
    const hip = this.links.get("hip");
    if (hip) {
      const srcBone = src.bones[hip.srcIndex];
      const tarBone2 = tar.bones[hip.tarIndex];
      this.srcHip.copy(srcBone.world.pos).nearZero();
      this.tarHip.copy(tarBone2.world.pos).nearZero();
      this.hipScale = Math.abs(this.srcHip[1] / this.tarHip[1]);
    }
    return this;
  }
  // #endregion
  // #region CONTROL ANIMATION
  step(dt) {
    this.animator.step(dt).updatePose(this.srcPose);
    this.srcPose.updateWorld();
    this.retargetPose();
    this.tarPose.updateWorld();
    return this;
  }
  // #endregion
  // #region CALCULATIONS
  retargetPose() {
    const diff = new Quat();
    const tmp = new Quat();
    let lnk;
    let srcBone;
    let tarBone;
    for (lnk of this.links.values()) {
      srcBone = this.srcPose.bones[lnk.srcIndex];
      tarBone = this.tarPose.bones[lnk.tarIndex];
      diff.fromMul(lnk.qSrcParent, srcBone.local.rot);
      diff.mul(
        Quat.dot(diff, lnk.qDotCheck) < 0 ? tmp.fromNegate(lnk.qSrcToTar) : lnk.qSrcToTar
        // No correction needed, transform to target tpose
      );
      tarBone.local.rot.fromMul(lnk.qTarParent, diff);
    }
    lnk = this.links.get("hip");
    if (lnk) {
      srcBone = this.srcPose.bones[lnk.srcIndex];
      tarBone = this.tarPose.bones[lnk.tarIndex];
      tarBone.local.pos.fromSub(srcBone.world.pos, this.srcHip).scale(this.hipScale).add(this.tarHip);
    }
  }
  // #endregion
}

const GLB_MAGIC = 1179937895;
const GLB_JSON = 1313821514;
const GLB_BIN = 5130562;
const GLB_VER = 2;
const GLB_MAGIC_BIDX = 0;
const GLB_VERSION_BIDX = 4;
const GLB_JSON_TYPE_BIDX = 16;
const GLB_JSON_LEN_BIDX = 12;
const GLB_JSON_BIDX = 20;
async function parseGLB(res) {
  const arybuf = await res.arrayBuffer();
  const dv = new DataView(arybuf);
  if (dv.getUint32(GLB_MAGIC_BIDX, true) != GLB_MAGIC) {
    console.error("GLB magic number does not match.");
    return null;
  }
  if (dv.getUint32(GLB_VERSION_BIDX, true) != GLB_VER) {
    console.error("Can only accept GLB of version 2.");
    return null;
  }
  if (dv.getUint32(GLB_JSON_TYPE_BIDX, true) != GLB_JSON) {
    console.error("GLB Chunk 0 is not the type: JSON ");
    return null;
  }
  const json_len = dv.getUint32(GLB_JSON_LEN_BIDX, true);
  const chk1_bidx = GLB_JSON_BIDX + json_len;
  if (dv.getUint32(chk1_bidx + 4, true) != GLB_BIN) {
    console.error("GLB Chunk 1 is not the type: BIN ");
    return null;
  }
  const bin_len = dv.getUint32(chk1_bidx, true);
  const bin_idx = chk1_bidx + 8;
  const txt_decoder = new TextDecoder("utf8");
  const json_bytes = new Uint8Array(arybuf, GLB_JSON_BIDX, json_len);
  const json_text = txt_decoder.decode(json_bytes);
  const json = JSON.parse(json_text);
  const bin = arybuf.slice(bin_idx);
  if (bin.byteLength != bin_len) {
    console.error("GLB Bin length does not match value in header.");
    return null;
  }
  return [json, bin];
}

const ComponentTypeMap = {
  5120: [1, Int8Array, "int8", "BYTE"],
  5121: [1, Uint8Array, "uint8", "UNSIGNED_BYTE"],
  5122: [2, Int16Array, "int16", "SHORT"],
  5123: [2, Uint16Array, "uint16", "UNSIGNED_SHORT"],
  5125: [4, Uint32Array, "uint32", "UNSIGNED_INT"],
  5126: [4, Float32Array, "float", "FLOAT"]
};
const ComponentVarMap = {
  SCALAR: 1,
  VEC2: 2,
  VEC3: 3,
  VEC4: 4,
  MAT2: 4,
  MAT3: 9,
  MAT4: 16
};

class Accessor {
  componentLen = 0;
  elementCnt = 0;
  byteOffset = 0;
  byteSize = 0;
  boundMin = null;
  boundMax = null;
  type = null;
  data = null;
  fromBin(accessor, bufView, bin) {
    const [
      compByte,
      compType,
      typeName
    ] = ComponentTypeMap[accessor.componentType];
    if (!compType) {
      console.error("Unknown Component Type for Accessor", accessor.componentType);
      return this;
    }
    this.componentLen = ComponentVarMap[accessor.type];
    this.elementCnt = accessor.count;
    this.byteOffset = (accessor.byteOffset || 0) + (bufView.byteOffset || 0);
    this.byteSize = this.elementCnt * this.componentLen * compByte;
    this.boundMin = accessor.min ? accessor.min.slice(0) : null;
    this.boundMax = accessor.max ? accessor.max.slice(0) : null;
    this.type = typeName;
    if (bin) {
      const size = this.elementCnt * this.componentLen;
      this.data = new compType(bin, this.byteOffset, size);
    }
    return this;
  }
}

class Attrib {
  byteOffset = 0;
  componentLen = 0;
  boundMin = null;
  boundMax = null;
  constructor(accID, json) {
    const accessor = json.accessors[accID];
    this.componentLen = ComponentVarMap[accessor.type];
    this.byteOffset = accessor.byteOffset;
    this.boundMin = accessor.min ? accessor.min.slice(0) : null;
    this.boundMax = accessor.max ? accessor.max.slice(0) : null;
  }
}
class InterleavedBuffer {
  data = null;
  elementCnt = 0;
  componentLen = 0;
  byteStride = 0;
  byteSize = 0;
  position = null;
  normal = null;
  tangent = null;
  texcoord_0 = null;
  texcoord_1 = null;
  color_0 = null;
  joints_0 = null;
  weights_0 = null;
  constructor(attr, json, bin) {
    const accessor = json.accessors[attr.POSITION];
    const bView = json.bufferViews[accessor.bufferView];
    this.elementCnt = accessor.count;
    this.byteStride = bView.byteStride;
    this.byteSize = bView.byteLength;
    this.componentLen = this.byteStride / 4;
    this.position = new Attrib(attr.POSITION, json);
    if (attr.NORMAL != void 0)
      this.normal = new Attrib(attr.NORMAL, json);
    if (attr.TANGENT != void 0)
      this.tangent = new Attrib(attr.TANGENT, json);
    if (attr.TEXCOORD_0 != void 0)
      this.texcoord_0 = new Attrib(attr.TEXCOORD_0, json);
    if (attr.TEXCOORD_1 != void 0)
      this.texcoord_1 = new Attrib(attr.TEXCOORD_1, json);
    if (attr.JOINTS_0 != void 0)
      this.joints_0 = new Attrib(attr.JOINTS_0, json);
    if (attr.WEIGHTS_0 != void 0)
      this.weights_0 = new Attrib(attr.WEIGHTS_0, json);
    if (attr.COLOR_0 != void 0)
      this.color_0 = new Attrib(attr.COLOR_0, json);
    if (bin) {
      this.data = new Float32Array(bin, bView.byteOffset || 0, this.elementCnt * this.componentLen);
    }
  }
}

class Draco {
  mod;
  decoder;
  mesh;
  faceCnt = 0;
  vertCnt = 0;
  constructor(mod) {
    this.mod = mod;
    this.decoder = new this.mod.Decoder();
  }
  dispose() {
    this.mod.destroy(this.decoder);
    if (this.mesh)
      this.mod.destroy(this.mesh);
    this.mod = null;
  }
  loadMesh(bin, offset, len) {
    const slice = new Int8Array(bin, offset, len);
    const buf = new this.mod.DecoderBuffer();
    buf.Init(slice, slice.byteLength);
    this.mesh = new this.mod.Mesh();
    this.decoder.DecodeBufferToMesh(buf, this.mesh);
    this.mod.destroy(buf);
    this.faceCnt = this.mesh.num_faces();
    this.vertCnt = this.mesh.num_points();
    return this;
  }
  loadPrimitive(prim, dAttr, gAttr, json) {
    if (dAttr.POSITION != void 0)
      prim.position = this.parseAttribute(dAttr.POSITION, gAttr.POSITION, json);
    if (dAttr.NORMAL != void 0)
      prim.normal = this.parseAttribute(dAttr.NORMAL, gAttr.NORMAL, json);
    if (dAttr.TEXCOORD_0 != void 0)
      prim.texcoord_0 = this.parseAttribute(dAttr.TEXCOORD_0, gAttr.TEXCOORD_0, json);
    const tAry = new Uint32Array(this.faceCnt * 3);
    const dAry = new this.mod.DracoUInt32Array();
    let ii;
    for (let i = 0; i < this.faceCnt; i++) {
      this.decoder.GetFaceFromMesh(this.mesh, i, dAry);
      ii = i * 3;
      tAry[ii + 0] = dAry.GetValue(0);
      tAry[ii + 1] = dAry.GetValue(1);
      tAry[ii + 2] = dAry.GetValue(2);
    }
    this.mod.destroy(dAry);
    prim.indices = new Accessor();
    prim.indices.componentLen = 1;
    prim.indices.elementCnt = this.faceCnt;
    prim.indices.byteSize = tAry.byteLength;
    prim.indices.data = tAry;
    prim.indices.type = "UNSIGNED_INT";
    this.mod.destroy(this.mesh);
    this.mesh = void 0;
    this.faceCnt = 0;
    this.vertCnt = 0;
  }
  parseAttribute(dIdx, gIdx, json) {
    const accessor = json.accessors[gIdx];
    const id = this.decoder.GetAttributeByUniqueId(this.mesh, dIdx);
    const out = new Accessor();
    const compByte = ComponentTypeMap[accessor.componentType][0];
    const dType = ComponentTypeMap[accessor.componentType][3];
    out.componentLen = ComponentVarMap[accessor.type];
    out.elementCnt = accessor.count;
    out.byteSize = out.elementCnt * out.componentLen * compByte;
    out.boundMin = accessor.min ? accessor.min.slice(0) : null;
    out.boundMax = accessor.max ? accessor.max.slice(0) : null;
    out.type = ComponentTypeMap[accessor.componentType][2];
    out.data = this.decodeAttributeData(id, dType, out.componentLen * this.vertCnt);
    return out;
  }
  decodeAttributeData(id, type, len) {
    let tAry;
    let dAry;
    switch (type) {
      case "BYTE":
        tAry = new Uint8Array(len);
        dAry = new this.mod.DracoInt8Array();
        this.decoder.GetAttributeInt8ForAllPoints(this.mesh, id, dAry);
        return dAry;
      case "UNSIGNED_BYTE":
        tAry = new Int16Array(len);
        dAry = new this.mod.DracoUInt8Array();
        this.decoder.GetAttributeUInt8ForAllPoints(this.mesh, id, dAry);
        break;
      case "SHORT":
        tAry = new Int16Array(len);
        dAry = new this.mod.DracoInt16Array();
        this.decoder.GetAttributeInt16ForAllPoints(this.mesh, id, dAry);
        break;
      case "UNSIGNED_SHORT":
        tAry = new Uint16Array(len);
        dAry = new this.mod.DracoUInt16Array();
        this.decoder.GetAttributeUInt16ForAllPoints(this.mesh, id, dAry);
        break;
      case "UNSIGNED_INT":
        tAry = new Uint32Array(len);
        dAry = new this.mod.DracoUInt32Array();
        this.decoder.GetAttributeUInt32ForAllPoints(this.mesh, id, dAry);
        break;
      case "FLOAT":
        tAry = new Float32Array(len);
        dAry = new this.mod.DracoFloat32Array();
        this.decoder.GetAttributeFloatForAllPoints(this.mesh, id, dAry);
        break;
    }
    for (let i = 0; i < len; i++)
      tAry[i] = dAry.GetValue(i);
    this.mod.destroy(dAry);
    return tAry;
  }
}

class Mesh {
  index = null;
  name = null;
  primitives = [];
  position = null;
  rotation = null;
  scale = null;
  morphTargets = null;
}
class Primitive {
  materialName = null;
  materialIdx = null;
  indices = null;
  position = null;
  normal = null;
  tangent = null;
  texcoord_0 = null;
  texcoord_1 = null;
  color_0 = null;
  joints_0 = null;
  weights_0 = null;
  interleaved = null;
}

class Skin {
  index = null;
  name = null;
  joints = [];
  position = null;
  rotation = null;
  scale = null;
}
class SkinJoint {
  name = null;
  index = null;
  parentIndex = null;
  bindMatrix = null;
  position = null;
  rotation = null;
  scale = null;
}

const ETransform = {
  Rot: 0,
  Pos: 1,
  Scl: 2
};
const ELerp = {
  Step: 0,
  Linear: 1,
  Cubic: 2
};
class Track {
  static Transform = ETransform;
  static Lerp = ELerp;
  transform = ETransform.Pos;
  interpolation = ELerp.Step;
  jointIndex = 0;
  timeStampIndex = 0;
  keyframes;
  static fromGltf(jointIdx, target, inter) {
    const t = new Track();
    t.jointIndex = jointIdx;
    switch (target) {
      case "translation":
        t.transform = ETransform.Pos;
        break;
      case "rotation":
        t.transform = ETransform.Rot;
        break;
      case "scale":
        t.transform = ETransform.Scl;
        break;
    }
    switch (inter) {
      case "LINEAR":
        t.interpolation = ELerp.Linear;
        break;
      case "STEP":
        t.interpolation = ELerp.Step;
        break;
      case "CUBICSPLINE":
        t.interpolation = ELerp.Cubic;
        break;
    }
    return t;
  }
}
class Animation {
  name = "";
  timestamps = [];
  tracks = [];
  constructor(name) {
    if (name)
      this.name = name;
  }
}

class Texture {
  index = -1;
  name = "";
  mime = "";
  uri = "";
  blob = null;
  static fromIndex(idx, parser) {
    const tex = new Texture();
    tex.index = idx;
    const info = parser.json.textures[idx];
    const src = parser.json.images[info.source];
    tex.name = src.name;
    tex.mime = src.mimeType;
    if (src.uri)
      tex.uri = src.uri;
    if (src.bufferView != null) {
      const bv = parser.json.bufferViews[src.bufferView];
      const bAry = new Uint8Array(parser.bin, bv.byteOffset, bv.byteLength);
      tex.blob = new Blob([bAry], { type: src.mimeType });
    }
    return tex;
  }
}

class PoseJoint {
  index;
  rot;
  pos;
  scl;
  constructor(idx, rot, pos, scl) {
    this.index = idx;
    this.rot = rot;
    this.pos = pos;
    this.scl = scl;
  }
}
class Pose {
  name = "";
  joints = [];
  constructor(name) {
    if (name)
      this.name = name;
  }
  add(idx, rot, pos, scl) {
    this.joints.push(new PoseJoint(idx, rot, pos, scl));
  }
}

class Material {
  index = -1;
  name = "";
  metallic = 0;
  roughness = 0;
  baseTexture = null;
  baseColor = null;
  constructor(mat, parser) {
    this.name = mat.name || window.crypto.randomUUID();
    if (mat.pbrMetallicRoughness) {
      if (mat.pbrMetallicRoughness.baseColorFactor) {
        this.baseColor = mat.pbrMetallicRoughness.baseColorFactor;
      }
      if (mat.pbrMetallicRoughness.baseColorTexture) {
        this.baseTexture = Texture.fromIndex(mat.pbrMetallicRoughness.baseColorTexture.index, parser);
      }
      this.metallic = mat.pbrMetallicRoughness.metallicFactor || 0;
      this.roughness = mat.pbrMetallicRoughness.roughnessFactor || 0;
    }
  }
}

class Gltf2Parser {
  json;
  bin;
  path = "";
  _needsDraco = false;
  _extDraco = void 0;
  constructor(json, bin) {
    this.json = json;
    this.bin = bin || new ArrayBuffer(0);
    if (json.extensionsRequired) {
      this._needsDraco = json.extensionsRequired.indexOf("KHR_draco_mesh_compression") !== -1;
    }
  }
  get needsDraco() {
    return this._needsDraco;
  }
  useDraco(mod) {
    this._extDraco = new Draco(mod);
    return this;
  }
  dispose() {
    if (this._extDraco)
      this._extDraco.dispose();
  }
  getNodeByName(n) {
    let o, i;
    for (i = 0; i < this.json.nodes.length; i++) {
      o = this.json.nodes[i];
      if (o.name == n)
        return [o, i];
    }
    return null;
  }
  getMeshNames() {
    const json = this.json, rtn = [];
    let i;
    for (i of json.meshes)
      rtn.push(i.name);
    return rtn;
  }
  getMeshNodes(idx) {
    const out = [];
    let n;
    for (n of this.json.nodes) {
      if (n.mesh == idx)
        out.push(n);
    }
    return out;
  }
  getMeshByName(n) {
    let o, i;
    for (i = 0; i < this.json.meshes.length; i++) {
      o = this.json.meshes[i];
      if (o.name == n)
        return [o, i];
    }
    return null;
  }
  getMeshElement(id) {
    const json = this.json;
    let m = null;
    let mIdx = null;
    switch (typeof id) {
      case "string": {
        const tup = this.getMeshByName(id);
        if (tup !== null) {
          m = tup[0];
          mIdx = tup[1];
        }
        break;
      }
      case "number":
        if (id < json.meshes.length) {
          m = json.meshes[id];
          mIdx = id;
        }
        break;
      default:
        m = json.meshes[0];
        mIdx = 0;
        break;
    }
    return [m, mIdx];
  }
  getMesh(id) {
    if (!this.json.meshes) {
      console.warn("No Meshes in GLTF File");
      return null;
    }
    const [m, mIdx] = this.getMeshElement(id);
    if (m == null || mIdx == null) {
      console.warn("No Mesh Found", id);
      return null;
    }
    const json = this.json;
    const mesh = new Mesh();
    mesh.name = m.name;
    mesh.index = mIdx;
    let p, prim, attr;
    for (p of m.primitives) {
      attr = p.attributes;
      prim = new Primitive();
      if (p.material != void 0 && p.material != null) {
        prim.materialIdx = p.material;
        prim.materialName = json.materials[p.material].name;
      }
      if (this._needsDraco && p?.extensions?.KHR_draco_mesh_compression) {
        if (this._extDraco) {
          const draco = p.extensions.KHR_draco_mesh_compression;
          const bufView = this.json.bufferViews[draco.bufferView];
          this._extDraco.loadMesh(this.bin, bufView.byteOffset, bufView.byteLength);
          this._extDraco.loadPrimitive(prim, draco.attributes, attr, this.json);
        } else {
          console.error("Mesh is draco compressed but ext is not loaded.");
        }
      } else {
        if (p.indices != void 0)
          prim.indices = this.parseAccessor(p.indices);
        if (attr.POSITION && this.isAccessorInterleaved(attr.POSITION)) {
          prim.interleaved = new InterleavedBuffer(attr, this.json, this.bin);
        } else {
          if (attr.POSITION != void 0)
            prim.position = this.parseAccessor(attr.POSITION);
          if (attr.NORMAL != void 0)
            prim.normal = this.parseAccessor(attr.NORMAL);
          if (attr.TANGENT != void 0)
            prim.tangent = this.parseAccessor(attr.TANGENT);
          if (attr.TEXCOORD_0 != void 0)
            prim.texcoord_0 = this.parseAccessor(attr.TEXCOORD_0);
          if (attr.TEXCOORD_1 != void 0)
            prim.texcoord_1 = this.parseAccessor(attr.TEXCOORD_1);
          if (attr.JOINTS_0 != void 0)
            prim.joints_0 = this.parseAccessor(attr.JOINTS_0);
          if (attr.WEIGHTS_0 != void 0)
            prim.weights_0 = this.parseAccessor(attr.WEIGHTS_0);
          if (attr.COLOR_0 != void 0)
            prim.color_0 = this.parseAccessor(attr.COLOR_0);
        }
      }
      mesh.primitives.push(prim);
    }
    const nodes = this.getMeshNodes(mIdx);
    if (nodes?.length) {
      if (nodes[0].translation)
        mesh.position = nodes[0].translation.slice(0);
      if (nodes[0].rotation)
        mesh.rotation = nodes[0].rotation.slice(0);
      if (nodes[0].scale)
        mesh.scale = nodes[0].scale.slice(0);
    }
    if (m?.extras?.targetNames)
      mesh.morphTargets = m.extras.targetNames;
    return mesh;
  }
  getMorphTarget(id, targetName) {
    const [m, mIdx] = this.getMeshElement(id);
    if (m == null || mIdx == null) {
      console.warn("No Mesh Found", id);
      return null;
    }
    if (!m?.extras?.targetNames) {
      console.log("Mesh element does not have any target names");
      return null;
    }
    const mtIdx = m.extras.targetNames.indexOf(targetName);
    if (mtIdx === -1) {
      console.log("Morph target not found in mesh:", targetName);
      return null;
    }
    const mesh = new Mesh();
    mesh.name = targetName;
    mesh.index = mtIdx;
    let p, prim, attr;
    for (p of m.primitives) {
      if (!p.targets)
        continue;
      attr = p.targets[mtIdx];
      if (this._needsDraco && p?.extensions?.KHR_draco_mesh_compression) {
        console.error("getMorphTarget currently does not support draco compression");
        continue;
      }
      if (attr.POSITION && this.isAccessorInterleaved(attr.POSITION)) {
        console.error("getMorphTarget currently does not support interleaved data");
        continue;
      }
      prim = new Primitive();
      if (attr.POSITION != void 0)
        prim.position = this.parseAccessor(attr.POSITION);
      if (attr.NORMAL != void 0)
        prim.normal = this.parseAccessor(attr.NORMAL);
      mesh.primitives.push(prim);
    }
    return mesh;
  }
  getSkinNames() {
    const json = this.json, rtn = [];
    let i;
    for (i of json.skins)
      rtn.push(i.name);
    return rtn;
  }
  getSkinByName(n) {
    let o, i;
    for (i = 0; i < this.json.skins.length; i++) {
      o = this.json.skins[i];
      if (o.name == n)
        return [o, i];
    }
    return null;
  }
  getSkin(id) {
    if (!this.json.skins) {
      console.warn("No Skins in GLTF File");
      return null;
    }
    const json = this.json;
    let js = null;
    let idx = null;
    switch (typeof id) {
      case "string": {
        const tup = this.getSkinByName(id);
        if (tup !== null) {
          js = tup[0];
          idx = tup[1];
        }
        break;
      }
      case "number":
        if (id < json.skins.length) {
          js = json.meshes[id];
          idx = id;
        }
        break;
      default:
        js = json.skins[0];
        idx = 0;
        break;
    }
    if (js == null) {
      console.warn("No Skin Found", id);
      return null;
    }
    const bind = this.parseAccessor(js.inverseBindMatrices);
    if (bind && bind.elementCnt != js.joints.length) {
      console.warn("Strange Error. Joint Count & Bind Matrix Count dont match");
      return null;
    }
    let i, bi, ni, joint, node;
    const jMap = /* @__PURE__ */ new Map();
    const skin = new Skin();
    skin.name = js.name;
    skin.index = idx;
    for (i = 0; i < js.joints.length; i++) {
      ni = js.joints[i];
      node = json.nodes[ni];
      jMap.set(ni, i);
      joint = new SkinJoint();
      joint.index = i;
      joint.name = node.name ? node.name : "bone_" + i;
      joint.rotation = node?.rotation?.slice(0) ?? null;
      joint.position = node?.translation?.slice(0) ?? null;
      joint.scale = node?.scale?.slice(0) ?? null;
      if (bind && bind.data) {
        bi = i * 16;
        joint.bindMatrix = Array.from(bind.data.slice(bi, bi + 16));
      }
      if (joint.scale) {
        if (Math.abs(1 - joint.scale[0]) <= 1e-6)
          joint.scale[0] = 1;
        if (Math.abs(1 - joint.scale[1]) <= 1e-6)
          joint.scale[1] = 1;
        if (Math.abs(1 - joint.scale[2]) <= 1e-6)
          joint.scale[2] = 1;
      }
      skin.joints.push(joint);
    }
    let j;
    for (i = 0; i < js.joints.length; i++) {
      ni = js.joints[i];
      node = json.nodes[ni];
      if (node?.children?.length) {
        for (j = 0; j < node.children.length; j++) {
          bi = jMap.get(node.children[j]);
          if (bi != void 0)
            skin.joints[bi].parentIndex = i;
          else
            console.log("BI", bi, node);
        }
      }
    }
    if (skin.name) {
      const snode = this.getNodeByName(skin.name);
      if (snode) {
        const n = snode[0];
        skin.rotation = n?.rotation?.slice(0) ?? null;
        skin.position = n?.translation?.slice(0) ?? null;
        skin.scale = n?.scale?.slice(0) ?? null;
      }
    }
    return skin;
  }
  getMaterial(id) {
    if (!this.json.materials) {
      console.warn("No Materials in GLTF File");
      return null;
    }
    const json = this.json;
    let idx = -1;
    switch (typeof id) {
      case "number":
        if (id >= json.materials.length) {
          console.error("Material index out of bounds", id);
          break;
        }
        idx = id;
        break;
      case "string":
        for (let i = 0; i < json.materials.length; i++) {
          if (json.materials[i].name === id) {
            idx = i;
            break;
          }
        }
        break;
      default:
        idx = 0;
        break;
    }
    if (idx === -1) {
      console.error("Material not found ", id);
      return null;
    }
    const mat = new Material(json.materials[idx], this);
    mat.index = idx;
    return mat;
  }
  getAllMaterials() {
    const rtn = {};
    if (this.json.materials) {
      let mat;
      for (let i = 0; i < this.json.materials.length; i++) {
        mat = new Material(this.json.materials[i], this);
        mat.index = i;
        rtn[mat.name] = mat;
      }
    }
    return rtn;
  }
  getTexture(id) {
    return Texture.fromIndex(id, this);
  }
  getAnimationNames() {
    const json = this.json, rtn = [];
    let i;
    for (i of json.animations)
      rtn.push(i.name);
    return rtn;
  }
  getAnimationByName(n) {
    let o, i;
    for (i = 0; i < this.json.animations.length; i++) {
      o = this.json.animations[i];
      if (o.name == n)
        return [o, i];
    }
    return null;
  }
  getAnimation(id) {
    if (!this.json.animations) {
      console.warn("No Animations in GLTF File");
      return null;
    }
    const json = this.json;
    let js = null;
    switch (typeof id) {
      case "string": {
        const tup = this.getAnimationByName(id);
        if (tup !== null)
          js = tup[0];
        break;
      }
      case "number":
        if (id < json.animations.length) {
          js = json.animations[id];
        }
        break;
      default:
        js = json.animations[0];
        break;
    }
    if (js == null) {
      console.warn("No Animation Found", id);
      return null;
    }
    const NJMap = /* @__PURE__ */ new Map();
    const timeStamps = [];
    const tsMap = /* @__PURE__ */ new Map();
    const fnGetJoint = (nIdx) => {
      let jIdx = NJMap.get(nIdx);
      if (jIdx != void 0)
        return jIdx;
      for (const skin of this.json.skins) {
        jIdx = skin.joints.indexOf(nIdx);
        if (jIdx != -1 && jIdx != void 0) {
          NJMap.set(nIdx, jIdx);
          return jIdx;
        }
      }
      return -1;
    };
    const fnGetTimestamp = (sIdx) => {
      let aIdx = tsMap.get(sIdx);
      if (aIdx != void 0)
        return aIdx;
      const acc2 = this.parseAccessor(sIdx);
      if (acc2) {
        aIdx = timeStamps.length;
        timeStamps.push(acc2);
        tsMap.set(sIdx, aIdx);
        return aIdx;
      }
      return -1;
    };
    const anim = new Animation(js.name);
    anim.timestamps = timeStamps;
    let track;
    let ch;
    let jointIdx;
    let sampler;
    let acc;
    for (ch of js.channels) {
      jointIdx = fnGetJoint(ch.target.node);
      sampler = js.samplers[ch.sampler];
      track = Track.fromGltf(jointIdx, ch.target.path, sampler.interpolation);
      acc = this.parseAccessor(sampler.output);
      if (acc)
        track.keyframes = acc;
      track.timeStampIndex = fnGetTimestamp(sampler.input);
      anim.tracks.push(track);
    }
    return anim;
  }
  getPoseByName(n) {
    let o, i;
    for (i = 0; i < this.json.poses.length; i++) {
      o = this.json.poses[i];
      if (o.name == n)
        return [o, i];
    }
    return null;
  }
  getPose(id) {
    if (!this.json.poses) {
      console.warn("No Poses in GLTF File");
      return null;
    }
    const json = this.json;
    let js = null;
    switch (typeof id) {
      case "string": {
        const tup = this.getPoseByName(id);
        if (tup !== null)
          js = tup[0];
        break;
      }
      default:
        js = json.poses[0];
        break;
    }
    if (js == null) {
      console.warn("No Pose Found", id);
      return null;
    }
    const pose = new Pose(js.name);
    let jnt;
    for (jnt of js.joints) {
      pose.add(jnt.idx, jnt.rot, jnt.pos, jnt.scl);
    }
    return pose;
  }
  parseAccessor(accID) {
    const accessor = this.json.accessors[accID];
    const bufView = this.json.bufferViews[accessor.bufferView];
    if (!bufView)
      return null;
    if (bufView.byteStride) {
      const compLen = ComponentVarMap[accessor.type];
      const byteSize = ComponentTypeMap[accessor.componentType][0];
      if (bufView.byteStride !== compLen * byteSize) {
        console.error("UNSUPPORTED - Parsing Interleaved Buffer With Accessor Object");
        return null;
      }
    }
    return new Accessor().fromBin(accessor, bufView, this.bin);
  }
  isAccessorInterleaved(accID) {
    const accessor = this.json.accessors[accID];
    const bufView = this.json.bufferViews[accessor.bufferView];
    if (bufView && bufView.byteStride) {
      const compLen = ComponentVarMap[accessor.type];
      const byteSize = ComponentTypeMap[accessor.componentType][0];
      return bufView.byteStride !== compLen * byteSize;
    }
    return false;
  }
  static async fetch(url) {
    const res = await fetch(url);
    if (!res.ok)
      return null;
    let parser = null;
    const path = url.substring(0, url.lastIndexOf("/") + 1);
    switch (url.slice(-4).toLocaleLowerCase()) {
      case "gltf": {
        let bin;
        const json = await res.json();
        if (json.buffers && json.buffers.length > 0) {
          bin = await fetch(path + json.buffers[0].uri).then((r) => r.arrayBuffer());
        }
        parser = new Gltf2Parser(json, bin);
        break;
      }
      case ".glb": {
        const tuple = await parseGLB(res);
        if (tuple)
          parser = new Gltf2Parser(tuple[0], tuple[1]);
        break;
      }
    }
    if (parser)
      parser.path = path;
    return parser;
  }
}

function MatrixSkinPbrMaterial( val='cyan', skin ){
    const isTex    = ( val instanceof THREE.Texture );
    const uniforms = {
        pose : { value: skin?.offsetBuffer },
    };

    if( !isTex ){
        let color;
        switch( typeof val ){
            case 'string':
            case 'number': color = new THREE.Color( val ); break;
            case 'object': if( Array.isArray( val ) ) color = new THREE.Color( val[0], val[1], val[2] ); break;
            default: color = new THREE.Color( 'red' ); break;
        }
        
        uniforms.baseColor = { type: 'vec3', value: color };
    }else {
        uniforms.texBase   = { type: 'sampler2D', value: val };
    }

    const matConfig = {
        side            : THREE.DoubleSide,
        uniforms        : uniforms,
        vertexShader    : VERT_SRC,
        fragmentShader	: ( !isTex )? FRAG_COL : FRAG_TEX,
    };

    const mat       = new THREE.RawShaderMaterial( matConfig );
    mat.extensions  = { derivatives : true }; // If not using WebGL2.0 and Want to use dfdx or fwidth, Need to load extension

    return mat;
}

// #region SHADER CODE

// HANDLE SKINNING
const VERT_SRC = `#version 300 es
in vec3 position;   // Vertex Position
in vec3 normal;     // Vertex Normal
in vec2 uv;         // Vertex Texcoord
in vec4 skinWeight; // Bone Weights
in vec4 skinIndex;  // Bone Indices

#define MAXBONES 100             // Arrays can not be dynamic, so must set a size
uniform mat4 pose[ MAXBONES ];

uniform mat4 modelMatrix;       // Matrices should be filled in by THREE.JS Automatically.
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

out vec3 fragWPos;             // Fragment World Space Position
out vec3 fragNorm;             // Fragment Normal
// out vec2 fragUv;               // Fragment Texcoord

////////////////////////////////////////////////////////////////////////

mat4 getBoneMatrix( mat4[ MAXBONES ] pose, vec4 idx, vec4 wgt ){
    /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    NORMALIZE BONE WEIGHT VECTOR - INCASE MODEL WASN'T PREPARED LIKE THAT
    If Weights are not normalized, Merging the Bone Offsets will create artifacts */
    int a = int( idx.x ),
        b = int( idx.y ),
        c = int( idx.z ),
        d = int( idx.w );
    
    wgt *= 1.0 / ( wgt.x + wgt.y + wgt.z + wgt.w );

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // MERGE THE BONE OFFSETS BASED ON WEIGHT
    mat4 bone_wgt =
        pose[ a ] * wgt.x +  
        pose[ b ] * wgt.y +
        pose[ c ] * wgt.z +
        pose[ d ] * wgt.w;

    return bone_wgt;
}

////////////////////////////////////////////////////////////////////////

void main() {
    mat4 boneMatrix = getBoneMatrix( pose, skinIndex, skinWeight );         // Get the Skinning Matrix
    mat4 mbMatrix   = modelMatrix * boneMatrix;                             // Merge Model and Bone Matrices together

    vec4 wpos       = mbMatrix * vec4( position, 1.0 );                     // Use new Matrix to Transform Vertices
    vec4 vpos       = viewMatrix * wpos;                                    // View space position
    fragWPos        = wpos.xyz;                                             // Save WorldSpace Position for Fragment Shader
    fragNorm        = mat3( transpose( inverse( mbMatrix ) ) ) * normal;    // Transform Normals using bone + model matrix
    // fragUv        = uv;

    gl_Position     = projectionMatrix * vpos;
    //gl_Position     = projectionMatrix * viewMatrix * vec4( position, 1.0 );
}`;

// FRAGMENT THAT HANDLES BASE COLOR & LIGHTING
const FRAG_COL = `#version 300 es
precision mediump float;

////////////////////////////////////////////////////////////////////////

out     vec4 out_color;
in      vec3 fragWPos;
in      vec3 fragNorm;

uniform vec3 baseColor;
uniform vec3 cameraPosition;

////////////////////////////////////////////////////////////////////////

struct PBRMaterial {
    vec3  baseColor;
    float metallic;
    float specular;
    float roughness;
    float alphaRoughness; // This is roughness^2
};

// #region DIFFUSE
const float M_PI = 3.141592653589793;

vec3 F_Schlick( vec3 f0, vec3 f90, float VdotH ){
    return f0 + (f90 - f0) * pow(clamp(1.0 - VdotH, 0.0, 1.0), 5.0);
}


// https://github.com/KhronosGroup/glTF-Sample-Viewer/blob/master/source/Renderer/shaders/brdf.glsl#L152
vec3 BRDF_lambertian( vec3 f0, vec3 f90, vec3 diffuseColor, float specularWeight, float VdotH ){
    // see https://seblagarde.wordpress.com/2012/01/08/pi-or-not-to-pi-in-game-lighting-equation/
    return ( 1.0 - specularWeight * F_Schlick( f0, f90, VdotH ) ) * ( diffuseColor / M_PI );
}
// #endregion

// #region SPECULAR
// https://github.com/KhronosGroup/glTF-Sample-Viewer/blob/master/source/Renderer/shaders/brdf.glsl#L74
float V_SmithGGXCorrelated( float NdotL, float NdotV, float alphaRoughness ){
    float roughSq   = alphaRoughness * alphaRoughness;
    float GGXV      = NdotL * sqrt( NdotV * NdotV * ( 1.0 - roughSq ) + roughSq );
    float GGXL      = NdotV * sqrt( NdotL * NdotL * ( 1.0 - roughSq ) + roughSq );
    float GGX       = GGXV + GGXL;
    return ( GGX > 0.0 )? 0.5 / GGX : 0.0;
}

// https://github.com/KhronosGroup/glTF-Sample-Viewer/blob/master/source/Renderer/shaders/brdf.glsl#L93
// D_GGX
float DistributionGGX( float NdotH, float alphaRoughness ){
    float roughSq   = alphaRoughness * alphaRoughness;
    float f         = ( NdotH * NdotH ) * ( roughSq - 1.0 ) + 1.0;
    return roughSq / ( M_PI * f * f );
}

// https://github.com/KhronosGroup/glTF-Sample-Viewer/blob/master/source/Renderer/shaders/brdf.glsl#L179
vec3 BRDF_specularGGX(vec3 f0, vec3 f90, float alphaRoughness, float specularWeight, float VdotH, float NdotL, float NdotV, float NdotH){
    float Vis = V_SmithGGXCorrelated( NdotL, NdotV, alphaRoughness );
    vec3 F    = F_Schlick( f0, f90, VdotH );
    float D   = DistributionGGX(NdotH, alphaRoughness);
    return specularWeight * F * Vis * D;
}
// #endregion

vec3 linear_SRGB( vec3 v ){ 
    return vec3(
        ( v.r <= 0.0031308 )? v.r * 12.92 : 1.055 * pow( v.r, 1.0/2.4) - 0.055,
        ( v.g <= 0.0031308 )? v.g * 12.92 : 1.055 * pow( v.g, 1.0/2.4) - 0.055,
        ( v.b <= 0.0031308 )? v.b * 12.92 : 1.055 * pow( v.b, 1.0/2.4) - 0.055
    );
}

////////////////////////////////////////////////////////////////////////

#define LITCNT 2

const vec4[] Lights = vec4[](
    vec4( 10.0, 10.0, 10.0, 0.0 ),
    vec4( -1.0, -5.0, 1.0, 1.0 )
);

const vec3[] LightColor = vec3[](
    vec3( 1.0 ),
    vec3( 0.5 )
);

const float u_ior                   = 1.5;
const float u_metallic              = 0.0;
const float u_roughness             = 0.5;
const float u_specular              = 1.0; // For specular to work, there needs to be some roughness

void main(){
    //vec3 norm   = normalize( cross( dFdx(frag_wpos), dFdy(frag_wpos) ) ); // Low Poly Normals
    
    PBRMaterial mat = PBRMaterial(
        baseColor,
        u_metallic,
        u_specular,
        u_roughness,
        u_roughness * u_roughness
    );

    vec3 f_diffuse  = vec3( 0.0 );
    vec3 f_specular = vec3( 0.0 );
    
    vec3 f90       = vec3( 1.0 );
    vec3 f0        = vec3( pow( ( u_ior - 1.0 ) / ( u_ior + 1.0 ), 2.0 ) ); // vec3( 0.04 );
    vec3 diffColor = mix( mat.baseColor, vec3( 0 ), mat.metallic ); // diffuseColor
    
    vec3 N = normalize( fragNorm );
    vec3 V = normalize( cameraPosition - fragWPos );    // View direction, from Fragment to Camera
    vec3 H;                                             // Halfway Vector between L & V
    vec3 L;                                             // Light Unit Direction
    
    float NdL;
    float NdV;
    float NdH;
    float VdH;
    vec4  lit;
    for( int i=0; i < LITCNT; i++ ){
        lit = Lights[ i ];
        if( int( lit.w ) == 0 ) L = normalize( lit.xyz );               // to Direction Light
        else                    L = normalize( lit.xyz - fragWPos );    // to Point Light
        
        H    = normalize( L + V );
        VdH  = clamp( dot( V, H ), 0.0, 1.0 );
        NdL  = clamp( dot( N, L ), 0.0, 1.0 );
        NdV  = clamp( dot( N, V ), 0.0, 1.0 );
        NdH  = clamp( dot( N, H ), 0.0, 1.0 );

        // f_diffuse += LightColor[ i ] * NdL * BRDF_lambertian( f0, f90, diffColor, mat.specular, VdH );
        f_diffuse   += diffColor * NdL * LightColor[ i ] * ( 1.0 - mat.metallic );
        f_specular  += NdL * LightColor[ i ] * BRDF_specularGGX( f0, f90, mat.alphaRoughness, mat.specular, VdH, NdL, NdV, NdH );
    }

    vec3 ambient = mat.baseColor * 0.3;
    out_color = vec4( ambient + f_diffuse + f_specular, 1.0 );
    // out_color.rgb = linear_SRGB( out_color.rgb );
}`;

// FRAGMENT THAT ONLY RENDERS TEXTURE
const FRAG_TEX = `#version 300 es
precision mediump float;

////////////////////////////////////////////////////////////////////////

out     vec4 out_color;
in      vec2 frag_uv;

uniform sampler2D texBase;

////////////////////////////////////////////////////////////////////////

void main(){
    out_color = texture( texBase, frag_uv );
}`;

// #endregion

// #region IMPORTS
class GltfUtil{

    // #region ARMATURE
    static parseArmature( gltf, mkOffsetPose=false ){
        const skin  = gltf.getSkin();
        const arm   = new Armature();

        let b;
        for( const j of skin.joints ){
            b = arm.addBone( { name: j.name, parent: j.parentIndex } );
            if( j.rotation ) b.local.rot.copy( j.rotation );
            if( j.position ) b.local.pos.copy( j.position );
            if( j.scale )    b.local.scl.copy( j.scale );
        }

        arm.bind( 0.1 );

        if( mkOffsetPose && ( skin.scale || skin.rotation ) ){
            const pose = arm.newPose( 'opose' );
            if( skin.scale )    pose.offset.scl.copy( skin.scale );
            if( skin.rotation ) pose.offset.rot.copy( skin.rotation );
            pose.updateWorld();
        }

        return arm;
    }
    // #endregion

    // #region METHODS
    static async fetch( url ){ return await Gltf2Parser.fetch( url ); }

    static filterNodes( gltf, props={} ){
        const { 
            prefix  = '', 
            isMesh  = false,
            hasSkin = false,
        } = props;

        const out = [];
        for( let n of gltf.json.nodes ){
            if( isMesh  && n.mesh === undefined ) continue;
            if( hasSkin && n.skin === undefined ) continue;
            if( prefix  && !n.name.startsWith( prefix ) ) continue;
            out.push( n );
        }

        return out;
    }

    static loadNodeMeshes( gltf, nList, skin=null, grp=new THREE.Group ){
        const matCache  = {};
        const useSkin   = !!skin;

        let m;
        let geo;
        let mat;
        let mesh;
        let matId;

        for( let n of nList ){
            // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            // Check if there is any mesh available
            m = gltf.getMesh( n.mesh );
            if( !m || m.primitives.length == 0 ){ console.error( 'No gltf mesh found', n.mesh ); continue; }

            // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            for( let p of m.primitives ){
                
                // Get Data 
                geo     = this.geoPrimitive( p, useSkin );
                
                // What Material To use?
                matId   = p.materialIdx || 'default';
                mat     = matCache[ matId ];
                if( !mat ){
                    const color = ( p.materialIdx !== undefined )? 
                        gltf.getMaterial( p.materialIdx ).baseColor.slice( 0, 2 ) : 
                        'cyan';

                    mat = ( skin )? 
                        MatrixSkinPbrMaterial( color, skin ) :
                        new THREE.MeshPhongMaterial( { color } );

                    matCache[ matId ] = mat;
                }

                // Create 3JS Mesh
                mesh = new THREE.Mesh( geo, mat );
                grp.add( mesh );
            }
        }

        return grp;
    }
    // #endregion

    // #region MESHES
    static loadMesh( gltf, id, useSkin=false ){
        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        const m = gltf.getMesh( id );
        if( !m || m.primitives.length == 0 ){
            console.error( 'No gltf mesh found', id );
            return null;
        }

        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        const out = [];
        let gGeo;
        let mesh;
        let mat;
        for( let p of m.primitives ){
            gGeo = this.geoPrimitive( p, useSkin );

            if( p.materialIdx !== undefined ){
                gltf.getMaterial( p.materialIdx );
                // col  = new THREE.Color( gMat.baseColorFactor[0], gMat.baseColorFactor[1], gMat.baseColorFactor[2] );
                // { color: col }
                mat  = new THREE.MeshPhongMaterial(  );
            }else {
                mat  = new THREE.MeshPhongMaterial();
            }

            mesh = new THREE.Mesh( gGeo, mat );
            out.push( mesh );
        }

        return out;
    }

    static geoPrimitive( prim, useSkin=false ){
        const geo = new THREE.BufferGeometry();
        geo.setAttribute( 'position', new THREE.BufferAttribute( prim.position.data, prim.position.componentLen ) );

        if( prim.indices )    geo.setIndex( new THREE.BufferAttribute( prim.indices.data, 1 ) );
        if( prim.normal )     geo.setAttribute( 'normal', new THREE.BufferAttribute( prim.normal.data, prim.normal.componentLen ) );
        if( prim.texcoord_0 ) geo.setAttribute( 'uv', new THREE.BufferAttribute( prim.texcoord_0.data, prim.texcoord_0.componentLen ) );

        if( useSkin && prim.joints_0 && prim.weights_0 ){
            geo.setAttribute( 'skinWeight', new THREE.BufferAttribute( prim.weights_0.data, prim.weights_0.componentLen ) );
            geo.setAttribute( 'skinIndex',  new THREE.BufferAttribute( prim.joints_0.data,  prim.joints_0.componentLen ) );
        }

        return geo;

    }

    static loadGeoBuffers( gltf, id, useSkin=true ){
        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        const m = gltf.getMesh( id );
        if( !m || m.primitives.length == 0 ){
            console.error( 'No gltf mesh found', id );
            return null;
        }

        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        const out = [];
        for( let p of m.primitives ){
            out.push( this.geoPrimitive( p, useSkin ) );
        }

        return out;
    }
    // #endregion

    // #region ANIMATIONS
    static loadAnimationClip( gltf, name, pose ){
        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        const anim  = gltf.getAnimation( name );
        const clip  = new Clip( anim.name );
    
        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        let i;
        for( i of anim.timestamps ){
            if( i.data )                         clip.timeStamps.push( new Float32Array( i.data ) ); // Clone TimeStamp Data so its not bound to GLTF's BIN
            if( i.elementCnt > clip.frameCount ) clip.frameCount = i.elementCnt;                     // Find max frame counts
            if( i?.boundMax[0] > clip.duration ) clip.duration   = i.boundMax[0];                    // Find full duration
        }
    
        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        let gTrack; // Gltf Track
        let oTrack; // Ossos Track
        let bName;  // Bone Name
        let reBoneFilter = new RegExp( /(root|hips?)/i ); // Only use Vec3 tracks for root or hip bone
    
        for( gTrack of anim.tracks ){
            // -------------------------------------------
            if( !gTrack.keyframes.data ){
                console.error( 'GLTF Animation Track has no keyframe data' );
                continue;
            }
    
            // -------------------------------------------
            oTrack = null;
            switch( gTrack.transform ){
                // Rotation
                case 0: oTrack = new TrackQuat( gTrack.interpolation ); break;
    
                // Translation
                case 1:
                    bName = pose.bones[ gTrack.jointIndex ].name;
                    if( reBoneFilter.test( bName ) ){
                        oTrack = new TrackVec3( gTrack.interpolation ); break;
                    }
                    break;
            }
    
            // -------------------------------------------
            if( !oTrack ) continue;
    
            oTrack.setData( gTrack.keyframes.data );
            oTrack.boneIndex = gTrack.jointIndex;
            oTrack.timeIndex = gTrack.timeStampIndex;
    
            clip.tracks.push( oTrack );
        }
    
        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        return clip;
    }
    // #endregion

}

export { AnimationQueue, Armature, AxesDirections, Bone, BoneAxes, BoneBindings, BoneMap, BoneSockets, Clip, DQTSkin$1 as DQTSkin, DQTSkin as DualQuatSkin, Easing, Fabric$1 as Fabrik, Gltf2Parser as Gltf2, GltfUtil, IKChain, IKTarget, LerpType, Maths, MatrixSkin, Pose$1 as Pose, PoseAnimator, Quat, Retarget, RootMotion, SQTSkin, TrackQuat, TrackVec3, TranMatrixSkin, Transform, Vec3, aimChainSolver, fabrikSolver, limbSolver, twoBoneSolver };
