import { FormationType, TeamPositions } from "../types";
import FieldZoneContract from "./field-zone-contract";

export default interface FormationContract {
    getType(): FormationType;
    setType(type: FormationType): void;
    isInitialPositioning(): boolean;
    isSelectingTheZone(): boolean;
    hasFieldZone(): boolean;
    getFieldZone(): FieldZoneContract;
    setFieldZone(fieldZone: FieldZoneContract): void;
    getName(): string;
    setName(name: string): void;
    getTeamPositions(): TeamPositions;
}
