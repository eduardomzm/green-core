import { useState, useCallback } from "react";
import { RotateCcw, User, Eye, Shirt, Sparkles } from "lucide-react";

interface Props {
    onSave: (url: string) => void;
    onClose: () => void;
}

// Opciones extraídas y validadas con DiceBear 7.x schema
const HAIR_OPTIONS = [
    { id: "bob", label: "Corte Bob" },
    { id: "bun", label: "Chongo" },
    { id: "curly", label: "Rizado" },
    { id: "curvy", label: "Ondulado" },
    { id: "dreads", label: "Rastas" },
    { id: "frida", label: "Estilo Frida" },
    { id: "fro", label: "Afro" },
    { id: "froBand", label: "Afro con Banda" },
    { id: "longButNotTooLong", label: "Largo Medio" },
    { id: "miaWallace", label: "Estilo Mia" },
    { id: "shavedSides", label: "Lados Rapados" },
    { id: "straight01", label: "Lacio 1" },
    { id: "straight02", label: "Lacio 2" },
    { id: "straightAndStrand", label: "Lacio con Mechón" },
    { id: "dreads01", label: "Rastas Cortas" },
    { id: "dreads02", label: "Rastas Largas" },
    { id: "frizzle", label: "Frizz" },
    { id: "shaggy", label: "Despeinado" },
    { id: "shaggyMullet", label: "Mullet" },
    { id: "shortCurly", label: "Corto Rizado" },
    { id: "shortFlat", label: "Corto Liso" },
    { id: "shortRound", label: "Corto Redondo" },
    { id: "shortWaved", label: "Corto Ondulado" },
    { id: "sides", label: "Rapado" },
    { id: "theCaesar", label: "César" },
    { id: "theCaesarAndSidePart", label: "César Lado" },
    { id: "bigHair", label: "Cabello Grande" },
    { id: "hat", label: "Sombrero" },
    { id: "hijab", label: "Hijab" },
    { id: "turban", label: "Turbante" },
    { id: "winterHat1", label: "Gorro Invierno 1" },
    { id: "winterHat02", label: "Gorro Invierno 2" },
    { id: "winterHat03", label: "Gorro Invierno 3" },
    { id: "winterHat04", label: "Gorro Invierno 4" },
];

const HAIR_COLORS = [
    { id: "auburn", hex: "#A55728" },
    { id: "black", hex: "#2C1B18" },
    { id: "blonde", hex: "#B58143" },
    { id: "blondeGolden", hex: "#D6B370" },
    { id: "brownDark", hex: "#4A3123" },
    { id: "brown", hex: "#724133" },
    { id: "pastelPink", hex: "#F59797" },
    { id: "platinum", hex: "#ECDCBF" },
    { id: "red", hex: "#C93305" },
    { id: "silverGray", hex: "#E8E1E1" },
];

const EYES_OPTIONS = [
    { id: "closed", label: "Cerrados" },
    { id: "cry", label: "Llorando" },
    { id: "default", label: "Normal" },
    { id: "xDizzy", label: "Mareado" },
    { id: "eyeRoll", label: "Rodando" },
    { id: "happy", label: "Feliz" },
    { id: "hearts", label: "Corazones" },
    { id: "side", label: "Lado" },
    { id: "squint", label: "Entrecerrados" },
    { id: "surprised", label: "Sorprendido" },
    { id: "wink", label: "Guiño" },
    { id: "winkWacky", label: "Loco" },
];

const EYEBROWS_OPTIONS = [
    { id: "angryNatural", label: "Enojo (Natural)" },
    { id: "defaultNatural", label: "Normal (Natural)" },
    { id: "flatNatural", label: "Plano (Natural)" },
    { id: "frownNatural", label: "Ceño (Natural)" },
    { id: "raisedExcitedNatural", label: "Levantadas (Nat)" },
    { id: "sadConcernedNatural", label: "Tristes (Nat)" },
    { id: "unibrowNatural", label: "Uniceja (Nat)" },
    { id: "upDownNatural", label: "Asimétricas (Nat)" },
    { id: "angry", label: "Enojo" },
    { id: "default", label: "Normal" },
    { id: "raisedExcited", label: "Levantadas" },
    { id: "sadConcerned", label: "Tristes" },
    { id: "upDown", label: "Asimétricas" }
];

const MOUTH_OPTIONS = [
    { id: "concerned", label: "Preocupado" },
    { id: "default", label: "Normal" },
    { id: "disbelief", label: "Incrédulo" },
    { id: "eating", label: "Comiendo" },
    { id: "grimace", label: "Mueca" },
    { id: "sad", label: "Triste" },
    { id: "screamOpen", label: "Grito" },
    { id: "serious", label: "Serio" },
    { id: "smile", label: "Sonrisa" },
    { id: "tongue", label: "Lengua" },
    { id: "twinkle", label: "Brillo" },
    { id: "vomit", label: "Vómito" },
];

const SKIN_COLORS = [
    { id: "tanned", hex: "#FD9841" },
    { id: "yellow", hex: "#F8D25C" },
    { id: "pale", hex: "#FFDBB4" },
    { id: "light", hex: "#EDB98A" },
    { id: "brown", hex: "#D08B5B" },
    { id: "darkBrown", hex: "#AE5D29" },
    { id: "black", hex: "#614335" },
];

const CLOTHING_OPTIONS = [
    { id: "blazerAndShirt", label: "Blazer y Camisa" },
    { id: "blazerAndSweater", label: "Blazer y Suéter" },
    { id: "collarAndSweater", label: "Cuello y Suéter" },
    { id: "graphicShirt", label: "Camisa Gráfica" },
    { id: "hoodie", label: "Sudadera" },
    { id: "overall", label: "Overol" },
    { id: "shirtCrewNeck", label: "Cuello Redondo" },
    { id: "shirtScoopNeck", label: "Cuello Ancho" },
    { id: "shirtVNeck", label: "Cuello V" },
];

const CLOTHING_COLORS = [
    { id: "black", hex: "#262E33" },
    { id: "blue01", hex: "#65C9FF" },
    { id: "blue02", hex: "#5199E4" },
    { id: "blue03", hex: "#25557C" },
    { id: "gray01", hex: "#E6E6E6" },
    { id: "gray02", hex: "#929598" },
    { id: "heather", hex: "#3C4F5C" },
    { id: "pastelBlue", hex: "#B1E2FF" },
    { id: "pastelGreen", hex: "#A7FFC4" },
    { id: "pastelOrange", hex: "#FFDEB5" },
    { id: "pastelRed", hex: "#FFAFB9" },
    { id: "pastelYellow", hex: "#FFFFB1" },
    { id: "pink", hex: "#FF488E" },
    { id: "red", hex: "#FF5C5C" },
    { id: "white", hex: "#FFFFFF" },
];

const ACCESSORIES_OPTIONS = [
    { id: "blank", label: "Ninguno" },
    { id: "kurt", label: "Kurt" },
    { id: "prescription01", label: "Gafas 1" },
    { id: "prescription02", label: "Gafas 2" },
    { id: "round", label: "Redondas" },
    { id: "sunglasses", label: "De Sol" },
    { id: "wayfarers", label: "Wayfarers" },
];

const getRandomItem = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)].id;

export default function AvatarGenerator({ onSave, onClose }: Props) {
    const [tab, setTab] = useState("cabeza");
    const [seed, setSeed] = useState(() => Math.random().toString());

    // Inicializamos con un item aleatorio desde el principio para evitar fallos (400 Bad Request)
    const [top, setTop] = useState(() => getRandomItem(HAIR_OPTIONS));
    const [topColor, setTopColor] = useState(() => getRandomItem(HAIR_COLORS));
    const [eyes, setEyes] = useState(() => getRandomItem(EYES_OPTIONS));
    const [eyebrows, setEyebrows] = useState(() => getRandomItem(EYEBROWS_OPTIONS));
    const [mouth, setMouth] = useState(() => getRandomItem(MOUTH_OPTIONS));
    const [skin, setSkin] = useState(() => getRandomItem(SKIN_COLORS));
    const [clothes, setClothes] = useState(() => getRandomItem(CLOTHING_OPTIONS));
    const [clothesColor, setClothesColor] = useState(() => getRandomItem(CLOTHING_COLORS));
    const [accessories, setAccessories] = useState(() => getRandomItem(ACCESSORIES_OPTIONS));

    const handleRandomize = useCallback(() => {
        setSeed(Math.random().toString());
        setTop(getRandomItem(HAIR_OPTIONS));
        setTopColor(getRandomItem(HAIR_COLORS));
        setEyes(getRandomItem(EYES_OPTIONS));
        setEyebrows(getRandomItem(EYEBROWS_OPTIONS));
        setMouth(getRandomItem(MOUTH_OPTIONS));
        setSkin(getRandomItem(SKIN_COLORS));
        setClothes(getRandomItem(CLOTHING_OPTIONS));
        setClothesColor(getRandomItem(CLOTHING_COLORS));
        setAccessories(getRandomItem(ACCESSORIES_OPTIONS));
    }, []);

    // URL PRINCIPAL CON VALIDACIÓN PARA DICEBEAR 7.x
    const buildAvatarUrl = () => {
        const url = new URL("https://api.dicebear.com/7.x/avataaars/svg");
        url.searchParams.set("seed", seed);
        
        if (top) url.searchParams.set("top", top);
        
        const hColor = HAIR_COLORS.find(c => c.id === topColor);
        if (hColor) url.searchParams.set("hairColor", hColor.hex.replace("#", ""));
        
        if (accessories && accessories !== "blank") {
            url.searchParams.set("accessories", accessories);
            url.searchParams.set("accessoriesProbability", "100");
        } else {
            url.searchParams.set("accessoriesProbability", "0");
        }
        
        if (eyes) url.searchParams.set("eyes", eyes);
        if (eyebrows) url.searchParams.set("eyebrows", eyebrows);
        if (mouth) url.searchParams.set("mouth", mouth);
        
        const sColor = SKIN_COLORS.find(c => c.id === skin);
        if (sColor) url.searchParams.set("skinColor", sColor.hex.replace("#", ""));
        
        if (clothes) url.searchParams.set("clothing", clothes);
        
        const cColor = CLOTHING_COLORS.find(c => c.id === clothesColor);
        if (cColor) url.searchParams.set("clothingColor", cColor.hex.replace("#", ""));
        
        return url.toString();
    };

    const avatarUrl = buildAvatarUrl();

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-md overflow-hidden text-[#475569]">
            {/* MODAL GRANDE */}
            <div className="bg-[#f8fafc] w-[1150px] h-[750px] rounded-[32px] flex overflow-hidden shadow-2xl relative font-sans border border-[#e2e8f0]">
                
                {/* IZQUIERDA PREVIEW */}
                <div className="w-[38%] flex flex-col items-center justify-center bg-white border-r border-[#e2e8f0] p-10 relative">
                    <div className="w-[320px] h-[320px] rounded-full overflow-hidden border-[12px] border-[#f1f5f9] bg-[#eafdff] flex items-center justify-center relative shadow-inner">
                        <img 
                            src={avatarUrl} 
                            className="w-[115%] h-[115%] object-cover absolute top-6 transition-transform duration-300 transform hover:scale-105" 
                            alt="Avatar SVG" 
                        />
                    </div>

                    <button
                        onClick={handleRandomize}
                        className="mt-10 flex items-center gap-3 bg-[#f1f5f9] text-[#64748b] hover:text-[#45b29d] hover:bg-[#eafdff] px-6 py-3 rounded-full transition-all font-semibold shadow-sm border border-[#e2e8f0]"
                    >
                        <RotateCcw size={18} className="text-[#45b29d]" />
                        Crear Uno Aleatorio
                    </button>
                </div>

                {/* DERECHA CONFIG */}
                <div className="w-[62%] p-12 flex flex-col bg-white overflow-hidden relative">
                    <h2 className="text-3xl font-extrabold mb-8 flex items-center gap-3 text-[#1e293b]">
                        <div className="w-10 h-10 rounded-full bg-[#f1f5f9] flex items-center justify-center shadow-sm">
                            <Sparkles className="text-[#45b29d]" size={20} />
                        </div>
                        Diseña tu Avatar
                    </h2>

                    {/* TABS */}
                    <div className="flex border-b border-[#e2e8f0] mb-8 gap-10 text-[#64748b]">
                        {[
                            { id: "cabeza", label: "Cabeza", icon: <User size={18}/> },
                            { id: "rostro", label: "Rostro", icon: <Eye size={18}/> },
                            { id: "ropa", label: "Ropa", icon: <Shirt size={18}/> },
                            { id: "accesorios", label: "Accesorios", icon: <Sparkles size={18}/> }
                        ].map((t) => (
                            <button
                                key={t.id}
                                onClick={() => setTab(t.id)}
                                className={`flex items-center gap-2 pb-4 text-[15px] font-bold border-b-[3px] transition-all px-2 ${
                                    tab === t.id 
                                        ? "text-[#45b29d] border-[#45b29d]" 
                                        : "border-transparent hover:text-[#334155] hover:border-[#cbd5e1]"
                                }`}
                            >
                                {t.icon}
                                {t.label}
                            </button>
                        ))}
                    </div>

                    {/* CONTENIDO CON SCROLL */}
                    <div className="flex-1 overflow-y-auto pr-8 custom-scrollbar space-y-10 pb-20">

                        {/* CABEZA */}
                        {tab === "cabeza" && (
                            <>
                                <div>
                                    <h3 className="text-[13px] font-bold tracking-widest text-[#94a3b8] mb-5 uppercase flex items-center gap-2">
                                        Estilos de Cabello
                                    </h3>
                                    <div className="grid grid-cols-5 gap-y-4 gap-x-3">
                                        {HAIR_OPTIONS.map((h) => (
                                            <button
                                                key={h.id}
                                                onClick={() => setTop(h.id)}
                                                className={`text-[12px] font-semibold text-center px-2 py-3 transition-all outline-none rounded-[16px] border-2 ${
                                                    top === h.id 
                                                        ? "text-[#45b29d] border-[#45b29d] bg-[#f0f9fa] shadow-sm transform scale-[1.02]" 
                                                        : "text-[#64748b] border-[#f1f5f9] bg-white hover:border-[#cbd5e1] hover:text-[#45b29d]"
                                                }`}
                                            >
                                                {h.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="mt-8">
                                    <h3 className="text-[13px] font-bold tracking-widest text-[#94a3b8] mb-5 uppercase">Color de Cabello</h3>
                                    <div className="grid grid-cols-5 gap-4 w-[90%]">
                                        {HAIR_COLORS.map((c) => (
                                            <button
                                                key={c.id}
                                                onClick={() => setTopColor(c.id)}
                                                title={c.id}
                                                className={`h-11 rounded-2xl transition-all border border-black/10 shadow-sm ${
                                                    topColor === c.id 
                                                        ? "scale-110 ring-[3px] ring-offset-[3px] ring-[#45b29d] z-10" 
                                                        : "hover:scale-105 opacity-90 hover:opacity-100"
                                                }`}
                                                style={{ backgroundColor: c.hex }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}

                        {/* ROSTRO */}
                        {tab === "rostro" && (
                            <>
                                <div>
                                    <h3 className="text-[13px] font-bold tracking-widest text-[#94a3b8] mb-5 uppercase">Ojos</h3>
                                    <div className="grid grid-cols-4 gap-4">
                                        {EYES_OPTIONS.map((e) => (
                                            <button
                                                key={e.id}
                                                onClick={() => setEyes(e.id)}
                                                className={`text-[13px] font-semibold px-4 py-3 transition-all rounded-[16px] border-2 ${
                                                    eyes === e.id 
                                                        ? "text-[#45b29d] border-[#45b29d] bg-[#f0f9fa] shadow-sm" 
                                                        : "text-[#64748b] border-[#f1f5f9] bg-white hover:border-[#cbd5e1] hover:text-[#45b29d]"
                                                }`}
                                            >
                                                {e.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="mt-8">
                                    <h3 className="text-[13px] font-bold tracking-widest text-[#94a3b8] mb-5 uppercase">Cejas</h3>
                                    <div className="grid grid-cols-4 gap-4">
                                        {EYEBROWS_OPTIONS.map((eb) => (
                                            <button
                                                key={eb.id}
                                                onClick={() => setEyebrows(eb.id)}
                                                className={`text-[11px] font-semibold px-2 py-3 transition-all rounded-[16px] border-2 text-center ${
                                                    eyebrows === eb.id 
                                                        ? "text-[#45b29d] border-[#45b29d] bg-[#f0f9fa] shadow-sm transform scale-[1.02]" 
                                                        : "text-[#64748b] border-[#f1f5f9] bg-white hover:border-[#cbd5e1] hover:text-[#45b29d]"
                                                }`}
                                            >
                                                {eb.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="mt-8">
                                    <h3 className="text-[13px] font-bold tracking-widest text-[#94a3b8] mb-5 uppercase">Boca</h3>
                                    <div className="grid grid-cols-4 gap-4">
                                        {MOUTH_OPTIONS.map((m) => (
                                            <button
                                                key={m.id}
                                                onClick={() => setMouth(m.id)}
                                                className={`text-[13px] font-semibold px-4 py-3 transition-all rounded-[16px] border-2 ${
                                                    mouth === m.id 
                                                        ? "text-[#45b29d] border-[#45b29d] bg-[#f0f9fa] shadow-sm" 
                                                        : "text-[#64748b] border-[#f1f5f9] bg-white hover:border-[#cbd5e1] hover:text-[#45b29d]"
                                                }`}
                                            >
                                                {m.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="mt-8">
                                    <h3 className="text-[13px] font-bold tracking-widest text-[#94a3b8] mb-5 uppercase">Tono de Piel</h3>
                                    <div className="flex gap-5 flex-wrap">
                                        {SKIN_COLORS.map((c) => (
                                            <button
                                                key={c.id}
                                                onClick={() => setSkin(c.id)}
                                                className={`w-[52px] h-[52px] rounded-full transition-all border border-black/10 shadow-sm ${
                                                    skin === c.id 
                                                        ? "scale-110 ring-[3px] ring-offset-[3px] ring-[#45b29d] z-10" 
                                                        : "hover:scale-105 opacity-90 hover:opacity-100"
                                                }`}
                                                style={{ backgroundColor: c.hex }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}

                        {/* ROPA */}
                        {tab === "ropa" && (
                            <>
                                <div>
                                    <h3 className="text-[13px] font-bold tracking-widest text-[#94a3b8] mb-5 uppercase">Prendas</h3>
                                    <div className="grid grid-cols-3 gap-4">
                                        {CLOTHING_OPTIONS.map((c) => (
                                            <button
                                                key={c.id}
                                                onClick={() => setClothes(c.id)}
                                                className={`text-[13px] font-semibold px-4 py-3 transition-all rounded-[16px] border-2 ${
                                                    clothes === c.id 
                                                        ? "text-[#45b29d] border-[#45b29d] bg-[#f0f9fa] shadow-sm" 
                                                        : "text-[#64748b] border-[#f1f5f9] bg-white hover:border-[#cbd5e1] hover:text-[#45b29d]"
                                                }`}
                                            >
                                                {c.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="mt-8">
                                    <h3 className="text-[13px] font-bold tracking-widest text-[#94a3b8] mb-5 uppercase">Color de Prenda</h3>
                                    <div className="flex gap-4 flex-wrap w-[95%]">
                                        {CLOTHING_COLORS.map((c) => (
                                            <button
                                                key={c.id}
                                                onClick={() => setClothesColor(c.id)}
                                                className={`w-11 h-11 rounded-[14px] transition-all border border-black/10 shadow-sm ${
                                                    clothesColor === c.id 
                                                        ? "scale-110 ring-[3px] ring-offset-[3px] ring-[#45b29d] z-10" 
                                                        : "hover:scale-105 opacity-90 hover:opacity-100"
                                                }`}
                                                style={{ backgroundColor: c.hex }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}

                        {/* ACCESORIOS */}
                        {tab === "accesorios" && (
                            <div>
                                <h3 className="text-[13px] font-bold tracking-widest text-[#94a3b8] mb-5 uppercase">Añadir Accesorio</h3>
                                <div className="grid grid-cols-3 gap-4">
                                    {ACCESSORIES_OPTIONS.map((a) => (
                                        <button
                                            key={a.id}
                                            onClick={() => setAccessories(a.id)}
                                            className={`text-[13px] font-semibold px-4 py-3 transition-all rounded-[16px] border-2 ${
                                                accessories === a.id 
                                                    ? "text-[#45b29d] border-[#45b29d] bg-[#f0f9fa] shadow-sm" 
                                                    : "text-[#64748b] border-[#f1f5f9] bg-white hover:border-[#cbd5e1] hover:text-[#45b29d]"
                                            }`}
                                        >
                                            {a.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* FOOTER BOTONES */}
                    <div className="absolute bottom-0 right-0 w-[62%] bg-gradient-to-t from-white via-white to-transparent pt-14 pb-8 px-12 flex justify-end gap-5 items-center z-10">
                        <button 
                            onClick={onClose}
                            className="text-[#64748b] hover:text-[#0f172a] font-bold transition-colors text-[15px] px-4 py-3"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={() => onSave(avatarUrl)}
                            className="bg-[#45b29d] hover:bg-[#389180] text-white px-10 py-3.5 rounded-full font-bold flex items-center gap-2 transition-all shadow-lg shadow-[#45b29d]/40 transform hover:-translate-y-1"
                        >
                            Guardar Cambios
                        </button>
                    </div>

                </div>
            </div>
            
        </div>
    );
}

