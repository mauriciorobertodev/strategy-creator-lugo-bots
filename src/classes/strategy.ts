import FieldZoneContract from "../contracts/field-zone-contract";
import FormationContract from "../contracts/formation-contract";
import StrategyContract from "../contracts/strategy-contract";
import { FIELD_HEIGHT, FIELD_WIDTH } from "../helpers/constants";
import { StrategyCreator } from "../types";
import Formation from "./formation";

export default class Strategy implements StrategyContract {
    private name: string;
    private cols: number;
    private rows: number;
    private formations: FormationContract[];
    private current_formation_name: string;
    private region_width: number;
    private region_height: number;

    constructor({ name, cols, rows, current_formation_name, formations }: StrategyCreator) {
        this.name = name;
        this.cols = cols;
        this.rows = rows;
        this.region_width = FIELD_WIDTH / cols;
        this.region_height = FIELD_HEIGHT / rows;
        this.current_formation_name = current_formation_name ?? "";
        this.formations = formations ? formations.map((creator) => new Formation(creator)) : [];
    }

    getCols(): number {
        return this.cols;
    }

    getRows(): number {
        return this.rows;
    }

    getName(): string {
        return this.name;
    }

    getFormations(): FormationContract[] {
        return this.formations;
    }

    getFieldZones(): FieldZoneContract[] {
        return this.formations.map((formation) => formation.getFieldZone());
    }

    getCurrentFormation(): FormationContract {
        const formation = this.formations.find((formation) => formation.getName() === this.current_formation_name);
        if (!formation) throw new Error("Não há nenhuma formação com o nome desejado");
        return formation;
    }

    getRegionWidth(): number {
        return this.region_width;
    }

    getRegionHeight(): number {
        return this.region_height;
    }

    setCols(cols: number): void {
        if (cols < 2) return;
        this.cols = cols;
        this.region_width = FIELD_WIDTH / cols;
    }

    setRows(rows: number): void {
        if (rows < 1) return;
        this.rows = rows;
        this.region_height = FIELD_HEIGHT / rows;
    }

    setColsAndRows(cols: number, rows: number): void {
        if (cols < 2) return;
        this.cols = cols;
        this.region_width = FIELD_WIDTH / cols;
        if (rows < 1) return;
        this.rows = rows;
        this.region_height = FIELD_HEIGHT / rows;
    }

    public toJson(): string {
        return JSON.stringify(this.getCreatorData());
    }

    public getCreatorData(): StrategyCreator {
        return {
            name: this.getName(),
            cols: this.getCols(),
            rows: this.getRows(),
            current_formation_name: this.current_formation_name,
            formations: this.formations.map((formation) => formation.getCreatorData()),
        };
    }
}
