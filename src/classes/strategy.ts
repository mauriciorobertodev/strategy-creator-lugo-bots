import FieldZoneContract from "../contracts/field-zone-contract";
import FormationContract from "../contracts/formation-contract";
import StrategyContract from "../contracts/strategy-contract";
import { FIELD_HEIGHT, FIELD_WIDTH } from "../helpers/constants";
import { StrategyCreator } from "../types";
import Formation from "./formation";
import { v4 } from "uuid";

export default class Strategy implements StrategyContract {
    private uuid: string;
    private name: string;
    private cols: number;
    private rows: number;
    private formations: FormationContract[];
    private current_formation_uuid: string;
    private region_width: number;
    private region_height: number;

    constructor({ uuid, name, cols, rows, current_formation_uuid, formations }: StrategyCreator) {
        this.name = name;
        this.cols = cols;
        this.rows = rows;
        this.region_width = FIELD_WIDTH / cols;
        this.region_height = FIELD_HEIGHT / rows;
        this.current_formation_uuid = current_formation_uuid ?? "";
        this.formations = formations ? formations.map((creator) => new Formation(creator)) : [];
        this.uuid = uuid ?? v4();
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
        if (!this.getFormationsUuid().includes(this.current_formation_uuid)) this.current_formation_uuid = this.getFormationsUuid()[0];
        const formation = this.formations.find((formation) => formation.getUuid() === this.current_formation_uuid);
        if (!formation) throw new Error("Não há nenhuma formação com o uuid passado");
        return formation;
    }

    getFormationsUuid(): string[] {
        return this.formations.map((formation) => formation.getUuid());
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

    getUuid(): string {
        return this.uuid;
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
            uuid: this.getUuid(),
            name: this.getName(),
            cols: this.getCols(),
            rows: this.getRows(),
            current_formation_uuid: this.current_formation_uuid,
            formations: this.formations.map((formation) => formation.getCreatorData()),
        };
    }
}