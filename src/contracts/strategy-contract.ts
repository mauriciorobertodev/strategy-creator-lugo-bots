import FieldZoneContract from "./field-zone-contract";
import FormationContract from "./formation-contract";

export default interface StrategyContract {
    getCols(): number;
    getRows(): number;
    getName(): string;
    getRegionWidth(): number;
    getRegionHeight(): number;
    getFormations(): FormationContract[];
    getFieldZones(): FieldZoneContract[];
    getCurrentFormation(): FormationContract;
    setCols(cols: number): void;
    setRows(rows: number): void;
    setColsAndRows(cols: number, rows: number): void;
}