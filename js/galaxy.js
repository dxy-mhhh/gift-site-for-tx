/*
 * Galaxy — vanilla WebGL port of the React Bits <Galaxy /> component.
 * Deep star-field background that coexists with LightRays in the curtain.
 * No external deps; uses the original GLSL fragment shader verbatim.
 */
(function () {
  "use strict";

  var VERT = [
    "attribute vec2 uv;",
    "attribute vec2 position;",
    "",
    "varying vec2 vUv;",
    "",
    "void main() {",
    "  vUv = uv;",
    "  gl_Position = vec4(position, 0, 1);",
    "}"
  ].join("\n");

  var FRAG = [
    "precision highp float;",
    "",
    "uniform float uTime;",
    "uniform vec3 uResolution;",
    "uniform vec2 uFocal;",
    "uniform vec2 uRotation;",
    "uniform float uStarSpeed;",
    "uniform float uDensity;",
    "uniform float uHueShift;",
    "uniform float uSpeed;",
    "uniform vec2 uMouse;",
    "uniform float uGlowIntensity;",
    "uniform float uSaturation;",
    "uniform bool uMouseRepulsion;",
    "uniform float uTwinkleIntensity;",
    "uniform float uRotationSpeed;",
    "uniform float uRepulsionStrength;",
    "uniform float uMouseActiveFactor;",
    "uniform float uAutoCenterRepulsion;",
    "uniform bool uTransparent;",
    "",
    "varying vec2 vUv;",
    "",
    "#define NUM_LAYER 4.0",
    "#define STAR_COLOR_CUTOFF 0.2",
    "#define MAT45 mat2(0.7071, -0.7071, 0.7071, 0.7071)",
    "#define PERIOD 3.0",
    "",
    "float Hash21(vec2 p) {",
    "  p = fract(p * vec2(123.34, 456.21));",
    "  p += dot(p, p + 45.32);",
    "  return fract(p.x * p.y);",
    "}",
    "",
    "float tri(float x) {",
    "  return abs(fract(x) * 2.0 - 1.0);",
    "}",
    "",
    "float tris(float x) {",
    "  float t = fract(x);",
    "  return 1.0 - smoothstep(0.0, 1.0, abs(2.0 * t - 1.0));",
    "}",
    "",
    "float trisn(float x) {",
    "  float t = fract(x);",
    "  return 2.0 * (1.0 - smoothstep(0.0, 1.0, abs(2.0 * t - 1.0))) - 1.0;",
    "}",
    "",
    "vec3 hsv2rgb(vec3 c) {",
    "  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);",
    "  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);",
    "  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);",
    "}",
    "",
    "float Star(vec2 uv, float flare) {",
    "  float d = length(uv);",
    "  float m = (0.05 * uGlowIntensity) / d;",
    "  float rays = smoothstep(0.0, 1.0, 1.0 - abs(uv.x * uv.y * 1000.0));",
    "  m += rays * flare * uGlowIntensity;",
    "  uv *= MAT45;",
    "  rays = smoothstep(0.0, 1.0, 1.0 - abs(uv.x * uv.y * 1000.0));",
    "  m += rays * 0.3 * flare * uGlowIntensity;",
    "  m *= smoothstep(1.0, 0.2, d);",
    "  return m;",
    "}",
    "",
    "vec3 StarLayer(vec2 uv) {",
    "  vec3 col = vec3(0.0);",
    "",
    "  vec2 gv = fract(uv) - 0.5;",
    "  vec2 id = floor(uv);",
    "",
    "  for (int y = -1; y <= 1; y++) {",
    "    for (int x = -1; x <= 1; x++) {",
    "      vec2 offset = vec2(float(x), float(y));",
    "      vec2 si = id + vec2(float(x), float(y));",
    "      float seed = Hash21(si);",
    "      float size = fract(seed * 345.32);",
    "      float glossLocal = tri(uStarSpeed / (PERIOD * seed + 1.0));",
    "      float flareSize = smoothstep(0.9, 1.0, size) * glossLocal;",
    "",
    "      float red = smoothstep(STAR_COLOR_CUTOFF, 1.0, Hash21(si + 1.0)) + STAR_COLOR_CUTOFF;",
    "      float blu = smoothstep(STAR_COLOR_CUTOFF, 1.0, Hash21(si + 3.0)) + STAR_COLOR_CUTOFF;",
    "      float grn = min(red, blu) * seed;",
    "      vec3 base = vec3(red, grn, blu);",
    "",
    "      float hue = atan(base.g - base.r, base.b - base.r) / (2.0 * 3.14159) + 0.5;",
    "      hue = fract(hue + uHueShift / 360.0);",
    "      float sat = length(base - vec3(dot(base, vec3(0.299, 0.587, 0.114)))) * uSaturation;",
    "      float val = max(max(base.r, base.g), base.b);",
    "      base = hsv2rgb(vec3(hue, sat, val));",
    "",
    "      vec2 pad = vec2(tris(seed * 34.0 + uTime * uSpeed / 10.0), tris(seed * 38.0 + uTime * uSpeed / 30.0)) - 0.5;",
    "",
    "      float star = Star(gv - offset - pad, flareSize);",
    "      vec3 color = base;",
    "",
    "      float twinkle = trisn(uTime * uSpeed + seed * 6.2831) * 0.5 + 1.0;",
    "      twinkle = mix(1.0, twinkle, uTwinkleIntensity);",
    "      star *= twinkle;",
    "",
    "      col += star * size * color;",
    "    }",
    "  }",
    "",
    "  return col;",
    "}",
    "",
    "void main() {",
    "  vec2 focalPx = uFocal * uResolution.xy;",
    "  vec2 uv = (vUv * uResolution.xy - focalPx) / uResolution.y;",
    "",
    "  vec2 mouseNorm = uMouse - vec2(0.5);",
    "",
    "  if (uAutoCenterRepulsion > 0.0) {",
    "    vec2 centerUV = vec2(0.0, 0.0);",
    "    float centerDist = length(uv - centerUV);",
    "    vec2 repulsion = normalize(uv - centerUV) * (uAutoCenterRepulsion / (centerDist + 0.1));",
    "    uv += repulsion * 0.05;",
    "  } else if (uMouseRepulsion) {",
    "    vec2 mousePosUV = (uMouse * uResolution.xy - focalPx) / uResolution.y;",
    "    float mouseDist = length(uv - mousePosUV);",
    "    vec2 repulsion = normalize(uv - mousePosUV) * (uRepulsionStrength / (mouseDist + 0.1));",
    "    uv += repulsion * 0.05 * uMouseActiveFactor;",
    "  } else {",
    "    vec2 mouseOffset = mouseNorm * 0.1 * uMouseActiveFactor;",
    "    uv += mouseOffset;",
    "  }",
    "",
    "  float autoRotAngle = uTime * uRotationSpeed;",
    "  mat2 autoRot = mat2(cos(autoRotAngle), -sin(autoRotAngle), sin(autoRotAngle), cos(autoRotAngle));",
    "  uv = autoRot * uv;",
    "",
    "  uv = mat2(uRotation.x, -uRotation.y, uRotation.y, uRotation.x) * uv;",
    "",
    "  vec3 col = vec3(0.0);",
    "",
    "  for (float i = 0.0; i < 1.0; i += 1.0 / NUM_LAYER) {",
    "    float depth = fract(i + uStarSpeed * uSpeed);",
    "    float scale = mix(20.0 * uDensity, 0.5 * uDensity, depth);",
    "    float fade = depth * smoothstep(1.0, 0.9, depth);",
    "    col += StarLayer(uv * scale + i * 453.32) * fade;",
    "  }",
    "",
    "  if (uTransparent) {",
    "    float alpha = length(col);",
    "    alpha = smoothstep(0.0, 0.3, alpha);",
    "    alpha = min(alpha, 1.0);",
    "    gl_FragColor = vec4(col, alpha);",
    "  } else {",
    "    gl_FragColor = vec4(col, 1.0);",
    "  }",
    "}"
  ].join("\n");

  function compileShader(gl, type, src) {
    var s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.warn("Galaxy shader error:", gl.getShaderInfoLog(s));
      gl.deleteShader(s);
      return null;
    }
    return s;
  }

  function createProgram(gl, vs, fs) {
    var p = gl.createProgram();
    gl.attachShader(p, vs);
    gl.attachShader(p, fs);
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
      console.warn("Galaxy program link error:", gl.getProgramInfoLog(p));
      return null;
    }
    return p;
  }

  function Galaxy(options) {
    options = options || {};
    this.container =
      options.container instanceof HTMLElement
        ? options.container
        : document.querySelector(options.container || "body");

    this.focal = options.focal || [0.5, 0.5];
    this.rotation = options.rotation || [1.0, 0.0];
    this.starSpeed = options.starSpeed != null ? options.starSpeed : 0.5;
    this.density = options.density != null ? options.density : 1;
    this.hueShift = options.hueShift != null ? options.hueShift : 140;
    this.disableAnimation = !!options.disableAnimation;
    this.speed = options.speed != null ? options.speed : 1.0;
    this.mouseInteraction = options.mouseInteraction !== false;
    this.glowIntensity = options.glowIntensity != null ? options.glowIntensity : 0.3;
    this.saturation = options.saturation != null ? options.saturation : 0.0;
    this.mouseRepulsion = options.mouseRepulsion !== false;
    this.repulsionStrength = options.repulsionStrength != null ? options.repulsionStrength : 2;
    this.twinkleIntensity = options.twinkleIntensity != null ? options.twinkleIntensity : 0.3;
    this.rotationSpeed = options.rotationSpeed != null ? options.rotationSpeed : 0.1;
    this.autoCenterRepulsion = options.autoCenterRepulsion != null ? options.autoCenterRepulsion : 0;
    this.transparent = options.transparent !== false;

    this._canvas = null;
    this._gl = null;
    this._program = null;
    this._uniforms = {};
    this._raf = null;
    this._mouse = { x: 0.5, y: 0.5 };
    this._smoothMouse = { x: 0.5, y: 0.5 };
    this._targetMouseActive = 0;
    this._smoothMouseActive = 0;
    this._running = false;

    this._onResize = this._onResize.bind(this);
    this._onMouseMove = this._onMouseMove.bind(this);
    this._onMouseLeave = this._onMouseLeave.bind(this);
    this._loop = this._loop.bind(this);
  }

  Galaxy.prototype.init = function () {
    if (!this.container) return false;

    var canvas = document.createElement("canvas");
    canvas.style.cssText =
      "position:absolute;left:0;top:0;width:100%;height:100%;pointer-events:none;display:block;";
    while (this.container.firstChild) {
      this.container.removeChild(this.container.firstChild);
    }
    this.container.appendChild(canvas);
    this._canvas = canvas;

    var gl =
      canvas.getContext("webgl", {
        alpha: this.transparent,
        premultipliedAlpha: false,
        antialias: false,
      }) || canvas.getContext("experimental-webgl", { alpha: true });

    if (!gl) {
      canvas.style.display = "none";
      return false;
    }
    this._gl = gl;

    if (this.transparent) {
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      gl.clearColor(0, 0, 0, 0);
    } else {
      gl.clearColor(0, 0, 0, 1);
    }

    var vs = compileShader(gl, gl.VERTEX_SHADER, VERT);
    var fs = compileShader(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return false;

    var program = createProgram(gl, vs, fs);
    if (!program) return false;
    this._program = program;
    gl.useProgram(program);

    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 0, 0, 3, -1, 1, 0, -1, 3, 0, 1]),
      gl.STATIC_DRAW
    );
    var posLoc = gl.getAttribLocation(program, "position");
    var uvLoc = gl.getAttribLocation(program, "uv");
    var stride = 4 * Float32Array.BYTES_PER_ELEMENT;
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, stride, 0);
    if (uvLoc >= 0) {
      gl.enableVertexAttribArray(uvLoc);
      gl.vertexAttribPointer(uvLoc, 2, gl.FLOAT, false, stride, 2 * Float32Array.BYTES_PER_ELEMENT);
    }

    var names = [
      "uTime", "uResolution", "uFocal", "uRotation", "uStarSpeed",
      "uDensity", "uHueShift", "uSpeed", "uMouse", "uGlowIntensity",
      "uSaturation", "uMouseRepulsion", "uTwinkleIntensity",
      "uRotationSpeed", "uRepulsionStrength", "uMouseActiveFactor",
      "uAutoCenterRepulsion", "uTransparent",
    ];
    for (var i = 0; i < names.length; i++) {
      this._uniforms[names[i]] = gl.getUniformLocation(program, names[i]);
    }

    var self = this;
    requestAnimationFrame(function () {
      self.resize();
    });
    window.addEventListener("resize", this._onResize);

    if (this.mouseInteraction) {
      this.container.addEventListener("mousemove", this._onMouseMove);
      this.container.addEventListener("mouseleave", this._onMouseLeave);
    }

    this._running = true;
    this._raf = requestAnimationFrame(this._loop);
    return true;
  };

  Galaxy.prototype._onResize = function () {
    this.resize();
  };

  Galaxy.prototype._onMouseMove = function (e) {
    var rect = this._canvas.getBoundingClientRect();
    this._mouse.x = (e.clientX - rect.left) / rect.width;
    this._mouse.y = 1.0 - (e.clientY - rect.top) / rect.height;
    this._targetMouseActive = 1.0;
  };

  Galaxy.prototype._onMouseLeave = function () {
    this._targetMouseActive = 0;
  };

  Galaxy.prototype.resize = function () {
    var gl = this._gl;
    if (!gl) return;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w = this._canvas.clientWidth || this.container.clientWidth || window.innerWidth;
    var h = this._canvas.clientHeight || this.container.clientHeight || window.innerHeight;
    this._canvas.width = Math.floor(w * dpr);
    this._canvas.height = Math.floor(h * dpr);
    gl.viewport(0, 0, this._canvas.width, this._canvas.height);

    gl.uniform3f(
      this._uniforms.uResolution,
      this._canvas.width,
      this._canvas.height,
      this._canvas.width / this._canvas.height
    );
    gl.uniform2f(this._uniforms.uFocal, this.focal[0], this.focal[1]);
    gl.uniform2f(this._uniforms.uRotation, this.rotation[0], this.rotation[1]);
    gl.uniform1f(this._uniforms.uStarSpeed, this.starSpeed);
    gl.uniform1f(this._uniforms.uDensity, this.density);
    gl.uniform1f(this._uniforms.uHueShift, this.hueShift);
    gl.uniform1f(this._uniforms.uSpeed, this.speed);
    gl.uniform1f(this._uniforms.uGlowIntensity, this.glowIntensity);
    gl.uniform1f(this._uniforms.uSaturation, this.saturation);
    gl.uniform1i(this._uniforms.uMouseRepulsion, this.mouseRepulsion ? 1 : 0);
    gl.uniform1f(this._uniforms.uTwinkleIntensity, this.twinkleIntensity);
    gl.uniform1f(this._uniforms.uRotationSpeed, this.rotationSpeed);
    gl.uniform1f(this._uniforms.uRepulsionStrength, this.repulsionStrength);
    gl.uniform1f(this._uniforms.uAutoCenterRepulsion, this.autoCenterRepulsion);
    gl.uniform1i(this._uniforms.uTransparent, this.transparent ? 1 : 0);
  };

  Galaxy.prototype._loop = function (t) {
    if (!this._running) return;
    var gl = this._gl;
    if (!gl) return;

    if (!this.disableAnimation) {
      gl.uniform1f(this._uniforms.uTime, t * 0.001);
      gl.uniform1f(this._uniforms.uStarSpeed, (t * 0.001 * this.starSpeed) / 10.0);
    }

    var lerp = 0.05;
    this._smoothMouse.x += (this._mouse.x - this._smoothMouse.x) * lerp;
    this._smoothMouse.y += (this._mouse.y - this._smoothMouse.y) * lerp;
    this._smoothMouseActive += (this._targetMouseActive - this._smoothMouseActive) * lerp;

    gl.uniform2f(this._uniforms.uMouse, this._smoothMouse.x, this._smoothMouse.y);
    gl.uniform1f(this._uniforms.uMouseActiveFactor, this._smoothMouseActive);

    gl.drawArrays(gl.TRIANGLES, 0, 3);
    this._raf = requestAnimationFrame(this._loop);
  };

  Galaxy.prototype.destroy = function () {
    this._running = false;
    if (this._raf) cancelAnimationFrame(this._raf);
    this._raf = null;
    window.removeEventListener("resize", this._onResize);
    if (this.container) {
      this.container.removeEventListener("mousemove", this._onMouseMove);
      this.container.removeEventListener("mouseleave", this._onMouseLeave);
    }
    var gl = this._gl;
    if (gl && this._program) {
      gl.deleteProgram(this._program);
    }
    if (this._canvas && this._canvas.parentNode) {
      this._canvas.parentNode.removeChild(this._canvas);
    }
    this._gl = null;
    this._program = null;
    this._canvas = null;
  };

  window.Galaxy = Galaxy;
})();
