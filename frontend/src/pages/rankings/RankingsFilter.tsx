import { Users, GraduationCap, Building2, Box } from "lucide-react";
import FilterButton from "./FilterButton";

type Props = {
    activeFilter: string
    setActiveFilter: (value: any) => void
}

export default function RankingsFilters({ activeFilter, setActiveFilter }: Props) {

    return (
        <div className="flex flex-wrap gap-2 mb-8 ">

            <FilterButton
                active={activeFilter === "alumnos"}
                onClick={() => setActiveFilter("alumnos")}
                icon={<Users className="w-4 h-4" />}
                label="Alumnos"
            />

            <FilterButton
                active={activeFilter === "grupos"}
                onClick={() => setActiveFilter("grupos")}
                icon={<Building2 className="w-4 h-4" />}
                label="Grupos"
            />

            <FilterButton
                active={activeFilter === "carreras"}
                onClick={() => setActiveFilter("carreras")}
                icon={<GraduationCap className="w-4 h-4" />}
                label="Carreras"
            />

            <FilterButton
                active={activeFilter === "materiales"}
                onClick={() => setActiveFilter("materiales")}
                icon={<Box className="w-4 h-4" />}
                label="Materiales"
            />

        </div>
    );
}
