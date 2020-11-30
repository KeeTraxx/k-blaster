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
</defs>
