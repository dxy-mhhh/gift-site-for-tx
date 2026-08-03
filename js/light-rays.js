/*
 * LightRays — vanilla WebGL port of the React Bits <LightRays /> component.
 * Drops into the curtain as an animated ray-of-light background.
 * No external deps; uses the original GLSL fragment shader verbatim.
 */
(function () {
  "use strict";

  var VERT = [
    "attribute vec2 position;",
    "varying vec2 vUv;",
    "void main() {",
    "  vUv = position * 0.5 + 0.5;",
    "  gl_Position = vec4(position, 0.0, 1.0);",
    "}"
  ].join("\n");

  var FRAG = [
    "precision highp float;",
    "",
    "uniform float iTime;",
    "uniform vec2  iResolution;",
    "",
    "uniform vec2  rayPos;",
    "uniform vec2  rayDir;",
    "uniform vec3  raysColor;",
    "uniform float raysSpeed;",
    "uniform float lightSpread;",
    "uniform float rayLength;",
    "uniform float pulsating;",
    "uniform float fadeDistance;",
    "uniform float saturation;",
    "uniform vec2  mousePos;",
    "uniform float mouseInfluence;",
    "uniform float noiseAmount;",
    "uniform float distortion;",
    "",
    "varying vec2 vUv;",
    "",
    "float noise(vec2 st) {",
    "  return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);",
    "}",
    "",
    "float rayStrength(vec2 raySource, vec2 rayRefDirection, vec2 coord,",
    "                  float seedA, float seedB, float speed) {",
    "  vec2 sourceToCoord = coord - raySource;",
    "  vec2 dirNorm = normalize(sourceToCoord);",
    "  float cosAngle = dot(dirNorm, rayRefDirection);",
    "",
    "  float distortedAngle = cosAngle + distortion * sin(iTime * 2.0 + length(sourceToCoord) * 0.01) * 0.2;",
    "",
    "  float spreadFactor = pow(max(distortedAngle, 0.0), 1.0 / max(lightSpread, 0.001));",
    "",
    "  float distance = length(sourceToCoord);",
    "  float maxDistance = iResolution.x * rayLength;",
    "  float lengthFalloff = clamp((maxDistance - distance) / maxDistance, 0.0, 1.0);",
    "",
    "  float fadeFalloff = clamp((iResolution.x * fadeDistance - distance) / (iResolution.x * fadeDistance), 0.5, 1.0);",
    "  float pulse = pulsating > 0.5 ? (0.8 + 0.2 * sin(iTime * speed * 3.0)) : 1.0;",
    "",
    "  float baseStrength = clamp(",
    "    (0.45 + 0.15 * sin(distortedAngle * seedA + iTime * speed)) +",
    "    (0.3 + 0.2 * cos(-distortedAngle * seedB + iTime * speed)),",
    "    0.0, 1.0",
    "  );",
    "",
    "  return baseStrength * lengthFalloff * fadeFalloff * spreadFactor * pulse;",
    "}",
    "",
    "void mainImage(out vec4 fragColor, in vec2 fragCoord) {",
    "  vec2 coord = vec2(fragCoord.x, iResolution.y - fragCoord.y);",
    "",
    "  vec2 finalRayDir = rayDir;",
    "  if (mouseInfluence > 0.0) {",
    "    vec2 mouseScreenPos = mousePos * iResolution.xy;",
    "    vec2 mouseDirection = normalize(mouseScreenPos - rayPos);",
    "    finalRayDir = normalize(mix(rayDir, mouseDirection, mouseInfluence));",
    "  }",
    "",
    "  vec4 rays1 = vec4(1.0) *",
    "               rayStrength(rayPos, finalRayDir, coord, 36.2214, 21.11349,",
    "                           1.5 * raysSpeed);",
    "  vec4 rays2 = vec4(1.0) *",
    "               rayStrength(rayPos, finalRayDir, coord, 22.3991, 18.0234,",
    "                           1.1 * raysSpeed);",
    "",
    "  fragColor = rays1 * 0.5 + rays2 * 0.4;",
    "",
    "  if (noiseAmount > 0.0) {",
    "    float n = noise(coord * 0.01 + iTime * 0.1);",
    "    fragColor.rgb *= (1.0 - noiseAmount + noiseAmount * n);",
    "  }",
    "",
    "  float brightness = 1.0 - (coord.y / iResolution.y);",
    "  fragColor.x *= 0.1 + brightness * 0.8;",
    "  fragColor.y *= 0.3 + brightness * 0.6;",
    "  fragColor.z *= 0.5 + brightness * 0.5;",
    "",
    "  if (saturation != 1.0) {",
    "    float gray = dot(fragColor.rgb, vec3(0.299, 0.587, 0.114));",
    "    fragColor.rgb = mix(vec3(gray), fragColor.rgb, saturation);",
    "  }",
    "",
    "  fragColor.rgb *= raysColor;",
    "}",
    "",
    "void main() {",
    "  vec4 color;",
    "  mainImage(color, gl_FragCoord.xy);",
    "  gl_FragColor = color;",
    "}"
  ].join("\n");

  function hexToRgb(hex) {
    var m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return m
      ? [parseInt(m[1], 16) / 255, parseInt(m[2], 16) / 255, parseInt(m[3], 16) / 255]
      : [1, 1, 1];
  }

  function getAnchorAndDir(origin, w, h) {
    var outside = 0.2;
    switch (origin) {
      case "top-left":
        return { anchor: [0, -outside * h], dir: [0, 1] };
      case "top-right":
        return { anchor: [w, -outside * h], dir: [0, 1] };
      case "left":
        return { anchor: [-outside * w, 0.5 * h], dir: [1, 0] };
      case "right":
        return { anchor: [(1 + outside) * w, 0.5 * h], dir: [-1, 0] };
      case "bottom-left":
        return { anchor: [0, (1 + outside) * h], dir: [0, -1] };
      case "bottom-center":
        return { anchor: [0.5 * w, (1 + outside) * h], dir: [0, -1] };
      case "bottom-right":
        return { anchor: [w, (1 + outside) * h], dir: [0, -1] };
      default:
        return { anchor: [0.5 * w, -outside * h], dir: [0, 1] };
    }
  }

  function compileShader(gl, type, src) {
    var s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.warn("LightRays shader error:", gl.getShaderInfoLog(s));
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
      console.warn("LightRays program link error:", gl.getProgramInfoLog(p));
      return null;
    }
    return p;
  }

  var LightRays = function (options) {
    options = options || {};
    this.container =
      options.container instanceof HTMLElement
        ? options.container
        : document.querySelector(options.container || "body");
    this.raysOrigin = options.raysOrigin || "top-center";
    this.raysColor = options.raysColor || "#fde68a";
    this.raysSpeed = options.raysSpeed != null ? options.raysSpeed : 1.2;
    this.lightSpread = options.lightSpread != null ? options.lightSpread : 0.6;
    this.rayLength = options.rayLength != null ? options.rayLength : 1.6;
    this.pulsating = options.pulsating !== undefined ? options.pulsating : true;
    this.fadeDistance = options.fadeDistance != null ? options.fadeDistance : 1.2;
    this.saturation = options.saturation != null ? options.saturation : 0.85;
    this.followMouse = options.followMouse !== undefined ? options.followMouse : true;
    this.mouseInfluence = options.mouseInfluence != null ? options.mouseInfluence : 0.08;
    this.noiseAmount = options.noiseAmount != null ? options.noiseAmount : 0.08;
    this.distortion = options.distortion != null ? options.distortion : 0.03;

    this._canvas = null;
    this._gl = null;
    this._program = null;
    this._uniforms = {};
    this._raf = null;
    this._mouse = { x: 0.5, y: 0.5 };
    this._smoothMouse = { x: 0.5, y: 0.5 };
    this._running = false;
    this._onResize = this._onResize.bind(this);
    this._onMouseMove = this._onMouseMove.bind(this);
    this._loop = this._loop.bind(this);
  };

  LightRays.prototype.init = function () {
    if (!this.container) return false;

    var canvas = document.createElement("canvas");
    canvas.style.cssText =
      "position:absolute;left:0;top:0;width:100%;height:100%;pointer-events:none;display:block;";
    while (this.container.firstChild) {
      this.container.removeChild(this.container.firstChild);
    }
    this.container.appendChild(canvas);
    this._canvas = canvas;

    var gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: false,
      premultipliedAlpha: true,
    }) || canvas.getContext("experimental-webgl", { alpha: true });
    if (!gl) {
      canvas.style.display = "none";
      return false;
    }
    this._gl = gl;

    var vs = compileShader(gl, gl.VERTEX_SHADER, VERT);
    var fs = compileShader(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return false;

    var program = createProgram(gl, vs, fs);
    if (!program) return false;
    this._program = program;
    gl.useProgram(program);

    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    var loc = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    var names = [
      "iTime", "iResolution", "rayPos", "rayDir", "raysColor",
      "raysSpeed", "lightSpread", "rayLength", "pulsating",
      "fadeDistance", "saturation", "mousePos", "mouseInfluence",
      "noiseAmount", "distortion"
    ];
    for (var i = 0; i < names.length; i++) {
      this._uniforms[names[i]] = gl.getUniformLocation(program, names[i]);
    }

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

    this.resize();
    window.addEventListener("resize", this._onResize);
    if (this.followMouse) {
      window.addEventListener("mousemove", this._onMouseMove);
    }
    this._running = true;
    this._raf = requestAnimationFrame(this._loop);
    return true;
  };

  LightRays.prototype._onResize = function () {
    this.resize();
  };

  LightRays.prototype._onMouseMove = function (e) {
    var rect = this._canvas.getBoundingClientRect();
    this._mouse.x = (e.clientX - rect.left) / rect.width;
    this._mouse.y = (e.clientY - rect.top) / rect.height;
  };

  LightRays.prototype.resize = function () {
    var gl = this._gl;
    if (!gl) return;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w = this._canvas.clientWidth || this.container.clientWidth || window.innerWidth;
    var h = this._canvas.clientHeight || this.container.clientHeight || window.innerHeight;
    this._canvas.width = Math.floor(w * dpr);
    this._canvas.height = Math.floor(h * dpr);
    gl.viewport(0, 0, this._canvas.width, this._canvas.height);

    var rw = this._canvas.width;
    var rh = this._canvas.height;
    var anchorDir = getAnchorAndDir(this.raysOrigin, rw, rh);

    gl.uniform2f(this._uniforms.iResolution, rw, rh);
    gl.uniform2f(this._uniforms.rayPos, anchorDir.anchor[0], anchorDir.anchor[1]);
    gl.uniform2f(this._uniforms.rayDir, anchorDir.dir[0], anchorDir.dir[1]);
    gl.uniform3fv(this._uniforms.raysColor, hexToRgb(this.raysColor));
    gl.uniform1f(this._uniforms.raysSpeed, this.raysSpeed);
    gl.uniform1f(this._uniforms.lightSpread, this.lightSpread);
    gl.uniform1f(this._uniforms.rayLength, this.rayLength);
    gl.uniform1f(this._uniforms.pulsating, this.pulsating ? 1.0 : 0.0);
    gl.uniform1f(this._uniforms.fadeDistance, this.fadeDistance);
    gl.uniform1f(this._uniforms.saturation, this.saturation);
    gl.uniform1f(this._uniforms.mouseInfluence, this.mouseInfluence);
    gl.uniform1f(this._uniforms.noiseAmount, this.noiseAmount);
    gl.uniform1f(this._uniforms.distortion, this.distortion);
  };

  LightRays.prototype._loop = function (t) {
    if (!this._running) return;
    var gl = this._gl;
    if (!gl) return;

    gl.uniform1f(this._uniforms.iTime, t * 0.001);

    if (this.followMouse && this.mouseInfluence > 0) {
      var s = 0.92;
      this._smoothMouse.x = this._smoothMouse.x * s + this._mouse.x * (1 - s);
      this._smoothMouse.y = this._smoothMouse.y * s + this._mouse.y * (1 - s);
      gl.uniform2f(this._uniforms.mousePos, this._smoothMouse.x, this._smoothMouse.y);
    }

    gl.drawArrays(gl.TRIANGLES, 0, 3);
    this._raf = requestAnimationFrame(this._loop);
  };

  LightRays.prototype.destroy = function () {
    this._running = false;
    if (this._raf) cancelAnimationFrame(this._raf);
    window.removeEventListener("resize", this._onResize);
    window.removeEventListener("mousemove", this._onMouseMove);
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

  window.LightRays = LightRays;
})();
