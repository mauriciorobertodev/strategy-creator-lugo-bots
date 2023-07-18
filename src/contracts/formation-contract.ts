import { FormationCreator, FormationType, PlayerNumber, PlayerPosition, TeamPositions } from "../types";
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
    toJson(): string;
    getCreatorData(): FormationCreator;
    setPlayerPosition(number: PlayerNumber, position: PlayerPosition): void;
    getUuid(): string;
    setSelectingTheZone(selecting: boolean): void;
    deleteFieldZone(): void;
    getBlockGoalArea(): boolean;
    setBlockGoalArea(block: boolean): void;
}
