/* ============================================================================
   GRAIN
   ----------------------------------------------------------------------------
   Paper has tooth. One fixed, pre-rasterised noise tile over the whole site so
   flat colour never reads as a flat screen.

   Static SVG data URI rather than an animated filter: the browser rasterises
   the 180px tile once and then it costs nothing to composite.
   ========================================================================= */

const TILE = `<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'>
<filter id='g'>
<feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/>
<feColorMatrix type='saturate' values='0'/>
</filter>
<rect width='180' height='180' filter='url(%23g)'/>
</svg>`.replace(/\n/g, "");

export function Grain() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[90] opacity-[0.32] mix-blend-overlay"
      style={{
        backgroundImage: `url("data:image/svg+xml;utf8,${TILE.replace(/#/g, "%23").replace(/"/g, "'")}")`,
        backgroundRepeat: "repeat",
      }}
    />
  );
}
