import FieldZoneContract from "../contracts/field-zone-contract";
import FormationContract from "../contracts/formation-contract";
import StrategyContract from "../contracts/strategy-contract";
import { FIELD_HEIGHT, FIELD_WIDTH } from "../helpers/constants";
import Formation from "./formation";

export default class Strategy implements StrategyContract {
    private formations: FormationContract[] = [];
    private current_formation: FormationContract;
    private region_width: number;
    private region_height: number;

    constructor(
        private cols: number,
        private rows: number,
        private name: string,
        formation?: FormationContract,
    ) {
        this.current_formation = formation ?? new Formation("Posições iniciais", "INITIAL_POSITIONS");
        this.formations.push(this.current_formation);
        this.region_width = FIELD_WIDTH / cols;
        this.region_height = FIELD_HEIGHT / rows;
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
        return this.current_formation;
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
}
