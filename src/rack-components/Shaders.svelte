<defs id="defs2">
  <filter
    inkscape:label="Combined Lighting"
    inkscape:menu="Bevels"
    inkscape:menu-tooltip="Basic specular bevel to use for building textures"
    style="color-interpolation-filters:sRGB;"
    id="cable">
    <feGaussianBlur
      stdDeviation="0.36838709677419351"
      in="SourceGraphic"
      result="result0"
      id="feGaussianBlur2919" />
    <feDiffuseLighting
      lighting-color="rgb(255,255,255)"
      diffuseConstant="0.97999999999999998"
      surfaceScale="4"
      result="result5"
      id="feDiffuseLighting2923">
      <feDistantLight elevation="45" azimuth="235" id="feDistantLight2921" />
    </feDiffuseLighting>
    <feComposite
      k1="1.4"
      in2="SourceGraphic"
      in="result5"
      result="fbSourceGraphic"
      operator="arithmetic"
      id="feComposite2925" />
    <feGaussianBlur
      result="result0"
      in="fbSourceGraphic"
      stdDeviation="6"
      id="feGaussianBlur2927" />
    <feSpecularLighting
      specularExponent="25"
      specularConstant="1"
      surfaceScale="3.9940828402366861"
      lighting-color="rgb(255,255,255)"
      result="result1"
      in="result0"
      id="feSpecularLighting2931">
      <feDistantLight azimuth="235" elevation="45" id="feDistantLight2929" />
    </feSpecularLighting>
    <feComposite
      k3="1"
      k2="1"
      operator="arithmetic"
      in="fbSourceGraphic"
      in2="result1"
      result="result4"
      id="feComposite2933" />
    <feComposite
      operator="in"
      result="result2"
      in2="SourceGraphic"
      in="result4"
      id="feComposite2935" />
  </filter>
    <linearGradient
        id="linearGradient855"
        x1="61.09"
        x2="61.09"
        y1="48.205"
        y2="15.955"
        gradientTransform="translate(-61.09 -16.205)"
        gradientUnits="userSpaceOnUse">
        <stop stop-color="#505d70" offset="0" />
        <stop stop-color="#566377" offset=".14364" />
        <stop stop-color="#e7e8ee" offset=".17465" />
        <stop stop-color="#f2f5fa" offset=".48" />
        <stop offset=".5" />
        <stop stop-color="#fff" offset=".52" />
        <stop stop-color="#666" offset=".82354" />
        <stop stop-color="#fff" offset=".85517" />
        <stop stop-color="#fff" offset="1" />
    </linearGradient>
    <filter
        id="filter1648"
        y="-.05"
        width="1.3"
        height="1.15"
        color-interpolation-filters="sRGB">
        <feFlood
            flood-color="rgb(0,0,0)"
            flood-opacity=".50196"
            result="flood" />
        <feComposite
            in="flood"
            in2="SourceGraphic"
            operator="in"
            result="composite1" />
        <feGaussianBlur in="composite1" result="blur" stdDeviation="0.5" />
        <feOffset dx="1" dy="1" result="offset" />
        <feComposite in="SourceGraphic" in2="offset" result="composite2" />
    </filter>
    <filter id="black-glow">
      <feColorMatrix type="matrix" values=
                  "0 0 0 0   0
                   0 0 0 0   0
                   0 0 0 0   0
                   0 0 0 0.7 0"/>
      <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
      <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
      </feMerge>
  </filter>
</defs>
