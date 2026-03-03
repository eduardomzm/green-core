"use client"
import { Animations} from "../common/Background/Animations";
import { Environment } from "../common/Background/Environment";
import { Buildings } from "../common/Background/BuildingGroup";
import { Characters } from "../common/Background/Characters";

export default function MountainBackground() {
  return (
    <div className="fixed inset-0 w-full h-screen overflow-hidden" style={{ background: "#daf0f4" }}>
      {/* 1. Estilos CSS */}
      <Animations/>

      <svg
        viewBox="0 0 1200 700"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* 2. Capas del escenario (el orden importa para la profundidad) */}
        <Environment />  {/* Cielo, Nubes, Suelo, Árboles */}
        <Buildings />    {/* Edificios del fondo */}
        <Characters />   {/* Botes, Chica y hojas */}
      </svg>
    </div>
  );
}