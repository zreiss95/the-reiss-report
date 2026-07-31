import Image from "next/image";

export default function HeroBrand() {
  return (
    <div
      style={{
        position:"relative",
        height:300,
        overflow:"hidden",
        display:"flex",
        alignItems:"center",
        justifyContent:"center",
      }}
    >

      <Image
        src="/logos/colts-logo.png"
        alt="Colts"
        fill
        style={{
          objectFit:"contain",
          opacity:0.12,
        }}
      />

      <div
        style={{
          position:"relative",
          zIndex:2,
          textAlign:"center",
        }}
      >
        <h1>
          The Reiss Report
        </h1>

        <p>
          NFL Picks • Survivor • Best Bets • Rankings • Fantasy
        </p>
      </div>

    </div>
  );
}